const express = require('express');
const { auth, admin } = require('../middleware/auth');
const { validateBlog, validateObjectId } = require('../middleware/security');
const Blog = require('../models/blog');
const User = require('../models/userModel');

const router = express.Router();

/**
 * Trending Blogs Debug:
 * Trending blogs should be determined by:
 * - Highest likeCount OR
 * - Highest commentCount OR
 * - Aggregation pipeline using $lookup and $sort
 *
 * Please verify:
 * - Like and Comment models update counts correctly
 * - Aggregation pipeline is correct
 * - Fields used for sorting actually exist in schema
 * - API response is not empty due to filters
 */

/**
 * @swagger
 * tags:
 *   - name: Blog
 *     description: Blog CRUD operations
 */

/**
 * @swagger
 * /api/blog:
 *   get:
 *     summary: Get all blogs with pagination
 *     tags: [Blog]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 10
 *         description: Items per page (max 100)
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       200:
 *         description: List of blogs with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Blog'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage: { type: number }
 *                     totalPages: { type: number }
 *                     totalItems: { type: number }
 *                     itemsPerPage: { type: number }
 *                     hasNextPage: { type: boolean }
 *                     hasPrevPage: { type: boolean }
 */

/**
 * @swagger
 * /api/blog:
 *   post:
 *     summary: Create a new blog (requires authentication)
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, content]
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 5
 *               blog_content:
 *                 type: string
 *                 minLength: 20
 *               short_description:
 *                 type: string
 *               category:
 *                 type: array
 *                 items:
 *                   type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               status:
 *                 type: string
 *                 enum: [draft, published, scheduled]
 *     responses:
 *       201:
 *         description: Blog created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/blog/{id}:
 *   get:
 *     summary: Get a single blog by ID
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     responses:
 *       200:
 *         description: Blog details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       404:
 *         description: Blog not found
 */

/**
 * @swagger
 * /api/blog/{id}:
 *   put:
 *     summary: Update a blog (requires authentication)
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               blog_content: { type: string }
 *               short_description: { type: string }
 *               category: { type: array }
 *               status: { type: string, enum: [draft, published, scheduled] }
 *     responses:
 *       200:
 *         description: Blog updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Blog not found
 */

/**
 * @swagger
 * /api/blog/{id}:
 *   delete:
 *     summary: Delete a blog (requires authentication)
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Blog not found
 */

/**
 * @swagger
 * /api/blog/{id}/like:
 *   post:
 *     summary: Like a blog (requires authentication)
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog liked successfully
 *       401:
 *         description: Unauthorized
 */

// ✅ PAGINATION HELPER FUNCTION
const getPagination = (page = 1, limit = 10) => {
  const validPage = Math.max(1, parseInt(page) || 1);
  const validLimit = Math.max(1, Math.min(100, parseInt(limit) || 10)); // Max 100 per page
  const skip = (validPage - 1) * validLimit;
  return { skip, limit: validLimit, page: validPage };
};

// Get total count of blogs
router.get('/count', auth, async (req, res) => {
  try {
    const count = await Blog.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ Get all blogs with PAGINATION (with author info)
router.get('/', async (req, res) => {
  try {
    const { skip, limit, page } = getPagination(req.query.page, req.query.limit);
    const sortBy = req.query.sort || 'createdAt';
    const sortOrder = req.query.order === 'asc' ? 1 : -1;
    
    // Build filter query
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Count total documents matching filter
    const total = await Blog.countDocuments(filter);

    // Fetch paginated blogs
    const blogs = await Blog.find(filter)
      .populate('author', 'name email avatar')
      .populate('category', 'name slug')
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .select('-__v');

    // Return paginated response
    res.json({
      success: true,
      data: blogs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all blogs by user with pagination (MUST come before /:id route)
router.get('/user/:userId', validateObjectId, async (req, res) => {
  try {
    const { skip, limit, page } = getPagination(req.query.page, req.query.limit);
    
    const total = await Blog.countDocuments({ author: req.params.userId });
    
    const blogs = await Blog.find({ author: req.params.userId })
      .populate('author', 'name email avatar')
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v');
    
    res.json({
      success: true,
      data: blogs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get single blog with validation (after /user/:userId route)
router.get('/:id', validateObjectId, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'name email avatar')
      .populate('category', 'name slug')
      .select('-__v');
    
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    
    // Increment views
    blog.views = (blog.views || 0) + 1;
    await blog.save();
    
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Create blog (auth required) with validation
router.post('/', auth, validateBlog, async (req, res) => {
  try {
    const { title, content, shortDesc, images, category } = req.body;
    
    console.log('📝 Blog creation request received');
    console.log('   Title:', title);
    console.log('   Images received:', images?.length || 0, images);
    console.log('   Category:', category);
    
    // Ensure category is an array
    const categoryArray = Array.isArray(category) ? category.filter(c => c) : (category ? [category] : []);
    
    // Filter images to ensure they're valid URLs
    const validImages = Array.isArray(images) ? images.filter(img => typeof img === 'string' && img.trim()) : [];
    console.log('   Valid images after filtering:', validImages.length, validImages);
    
    const blog = await Blog.create({
      title,
      blog_content: content,
      short_description: shortDesc,
      images: validImages,
      category: categoryArray.length > 0 ? categoryArray : undefined,
      author: req.user._id,
      views: 0,
      likes: [],
      comments: []
    });
    
    console.log('✅ Blog created:', blog._id);
    
    // Add blog to user's blogs
    await User.findByIdAndUpdate(req.user._id, { $push: { blog: blog._id } });
    
    const populatedBlog = await Blog.findById(blog._id)
      .populate('author', 'name email avatar')
      .populate('category', 'name slug');
    
    res.status(201).json({ success: true, data: populatedBlog });
  } catch (err) {
    console.error('Blog creation error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// Update blog (owner or admin) with validation
router.patch('/:id', auth, validateObjectId, validateBlog, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    
    if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    console.log('📝 Blog update request received');
    console.log('   Blog ID:', req.params.id);
    console.log('   Images in request:', req.body.images?.length || 0, req.body.images);
    
    // Map content to blog_content if provided
    const updateData = { ...req.body };
    if (updateData.content) {
      updateData.blog_content = updateData.content;
      delete updateData.content;
    }
    if (updateData.shortDesc) {
      updateData.short_description = updateData.shortDesc;
      delete updateData.shortDesc;
    }
    
    // Handle images - ensure it's an array of strings (URLs)
    if (updateData.images) {
      updateData.images = Array.isArray(updateData.images) ? updateData.images.filter(img => typeof img === 'string' && img.trim()) : [];
      console.log('   Valid images after filtering:', updateData.images.length, updateData.images);
    }
    
    // Handle categories - ensure it's an array of valid IDs
    if (updateData.category) {
      updateData.category = Array.isArray(updateData.category) ? updateData.category.filter(c => c) : (updateData.category ? [updateData.category] : []);
    }
    
    Object.assign(blog, updateData);
    await blog.save();
    
    console.log('✅ Blog updated:', req.params.id);
    
    // Populate author and category info
    const updatedBlog = await Blog.findById(blog._id)
      .populate('author', 'name email avatar')
      .populate('category', 'name slug');
    
    res.json({ success: true, data: updatedBlog });
  } catch (err) {
    console.error('Blog update error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete blog (owner or admin) with validation
router.delete('/:id', auth, validateObjectId, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    
    if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await Blog.findByIdAndDelete(req.params.id);
    await User.findByIdAndUpdate(blog.author, { $pull: { blog: blog._id } });
    
    res.json({ success: true, message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
