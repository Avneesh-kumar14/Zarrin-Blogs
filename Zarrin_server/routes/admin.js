const express = require('express');
const { auth } = require('../middleware/auth');
const User = require('../models/userModel');
const Blog = require('../models/blog');
const Category = require('../models/blogCategory');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Admin
 *     description: Admin dashboard and management endpoints
 */

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Get admin dashboard statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stats:
 *                   type: object
 *                   properties:
 *                     totalUsers: { type: number }
 *                     totalBlogs: { type: number }
 *                     totalViews: { type: number }
 *                     totalLikes: { type: number }
 *                 topAuthors:
 *                   type: array
 *                 topBlogs:
 *                   type: array
 *       403:
 *         description: Admin access required
 */

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of users
 *       403:
 *         description: Admin access required
 */

/**
 * @swagger
 * /api/admin/users/{userId}:
 *   delete:
 *     summary: Delete a user (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted
 *       403:
 *         description: Admin access required
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/admin/blogs:
 *   get:
 *     summary: Get all blogs (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of blogs
 *       403:
 *         description: Admin access required
 */

/**
 * @swagger
 * /api/admin/analytics:
 *   get:
 *     summary: Get analytics data (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics data with trends
 *       403:
 *         description: Admin access required
 */

// ✅ Admin only middleware
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// ✅ Get dashboard stats
router.get('/dashboard', auth, adminOnly, async (req, res) => {
  try {
    const [userCount, blogCount, categoryCount] = await Promise.all([
      User.countDocuments(),
      Blog.countDocuments(),
      Category.countDocuments()
    ]);

    // Get blog stats by status
    const blogsByStatus = await Blog.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Get top authors
    const topAuthors = await Blog.aggregate([
      { $group: { _id: '$author', blogCount: { $sum: 1 } } },
      { $sort: { blogCount: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'author' } },
      { $unwind: '$author' },
      { $project: { 'author.name': 1, 'author.email': 1, 'author.avatar': 1, blogCount: 1 } }
    ]);

    // Get top blogs
    const topBlogs = await Blog.find()
      .populate('author', 'name email')
      .sort({ views: -1, likes: -1 })
      .limit(5)
      .select('title views wordCount readingTime createdAt');

    // Get recent blogs
    const recentBlogs = await Blog.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .limit(10)
      .select('title status views likes createdAt');

    // Get total engagement
    const engagement = await Blog.aggregate([
      { $group: { _id: null, totalViews: { $sum: '$views' }, totalLikes: { $sum: { $size: '$likes' } } } }
    ]);

    // Get users stats
    const newUsersThisWeek = await User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    res.json({
      stats: {
        totalUsers: userCount,
        totalBlogs: blogCount,
        totalCategories: categoryCount,
        totalViews: engagement[0]?.totalViews || 0,
        totalLikes: engagement[0]?.totalLikes || 0,
        newUsersThisWeek
      },
      blogsByStatus,
      topAuthors,
      topBlogs,
      recentBlogs
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get all users with pagination
router.get('/users', auth, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const skip = (page - 1) * limit;

    let filter = {};
    if (search) {
      filter = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const users = await User.find(filter)
      .select('-password')
      .populate('blog', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.json({
      users: users.map(u => ({
        _id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        blogs: u.blog?.length || 0,
        followers: u.followers?.length || 0,
        following: u.following?.length || 0,
        createdAt: u.createdAt
      })),
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalUsers: total
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get all blogs with pagination
router.get('/blogs', auth, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 10, status = 'all', search = '' } = req.query;
    const skip = (page - 1) * limit;

    let filter = {};
    if (status !== 'all') {
      filter.status = status;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { blog_content: { $regex: search, $options: 'i' } }
      ];
    }

    const blogs = await Blog.find(filter)
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Blog.countDocuments(filter);

    res.json({
      blogs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalBlogs: total
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete user
router.delete('/users/:userId', auth, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Delete all blogs by this user
    await Blog.deleteMany({ author: req.params.userId });
    
    // Delete user
    await User.findByIdAndDelete(req.params.userId);

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete blog
router.delete('/blogs/:blogId', auth, adminOnly, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });

    await Blog.findByIdAndDelete(req.params.blogId);

    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update blog status
router.patch('/blogs/:blogId/status', auth, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['draft', 'published', 'scheduled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const blog = await Blog.findByIdAndUpdate(
      req.params.blogId,
      { status },
      { new: true }
    );

    res.json({ message: 'Blog status updated', blog });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get analytics
router.get('/analytics', auth, adminOnly, async (req, res) => {
  try {
    // Daily blog creation count (last 7 days)
    const blogTrend = await Blog.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // User growth (last 7 days)
    const userTrend = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Most viewed categories
    const topCategories = await Blog.aggregate([
      { $unwind: '$category' },
      {
        $group: {
          _id: '$category',
          totalViews: { $sum: '$views' },
          blogCount: { $sum: 1 }
        }
      },
      { $sort: { totalViews: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'blogcategories',
          localField: '_id',
          foreignField: '_id',
          as: 'category'
        }
      }
    ]);

    res.json({
      blogTrend,
      userTrend,
      topCategories
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
