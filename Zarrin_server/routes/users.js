const express = require('express');
const { auth } = require('../middleware/auth');
const User = require('../models/userModel');
const Blog = require('../models/blog');
const { sendFollowNotification } = require('../services/emailService');

const router = express.Router();

// Search users by name (MUST come before /:userId route)
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    console.log('🔍 User search endpoint hit with query:', query);
    
    if (!query) {
      console.log('No query provided, returning empty array');
      return res.json([]);
    }

    const users = await User.find({
      name: { $regex: query, $options: 'i' }
    })
      .select('-password')
      .populate('followers', 'name email avatar')
      .populate('following', 'name email avatar')
      .limit(5);

    console.log('Found users:', users.length);

    // Add totalBlogs for each user
    const usersWithBlogs = await Promise.all(
      users.map(async (user) => {
        const blogs = await Blog.countDocuments({ author: user._id, status: 'published' });
        return {
          ...user.toObject(),
          totalBlogs: blogs
        };
      })
    );

    console.log('Returning users with blogs:', usersWithBlogs);
    res.json(usersWithBlogs);
  } catch (err) {
    console.error('Error in user search:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all users (for search fallback)
router.get('/', async (req, res) => {
  try {
    console.log('📋 Get all users endpoint hit');
    const users = await User.find()
      .select('-password')
      .populate('followers', 'name email avatar')
      .populate('following', 'name email avatar');

    console.log('Found total users:', users.length);

    // Add totalBlogs for each user
    const usersWithBlogs = await Promise.all(
      users.map(async (user) => {
        const blogs = await Blog.countDocuments({ author: user._id, status: 'published' });
        return {
          ...user.toObject(),
          totalBlogs: blogs
        };
      })
    );

    console.log('Returning users with blogs count');
    res.json(usersWithBlogs);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get user profile
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('-password')
      .populate('followers', 'name email avatar')
      .populate('following', 'name email avatar');

    if (!user) return res.status(404).json({ message: 'User not found' });

    const blogs = await Blog.countDocuments({ author: req.params.userId, status: 'published' });
    
    res.json({
      ...user.toObject(),
      totalBlogs: blogs
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get user's blogs
router.get('/:userId/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.params.userId, status: 'published' })
      .populate('author', 'name email avatar')
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Follow user
router.post('/:userId/follow', auth, async (req, res) => {
  try {
    if (req.user._id === req.params.userId) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    const targetUser = await User.findById(req.params.userId);
    if (!targetUser) return res.status(404).json({ message: 'User not found' });

    // Check if already following
    if (targetUser.followers.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already following this user' });
    }

    // Add to followers
    targetUser.followers.push(req.user._id);
    await targetUser.save();

    // Add to following
    const currentUser = await User.findById(req.user._id);
    currentUser.following.push(req.params.userId);
    await currentUser.save();

    // Send email notification to followed user
    if (targetUser.email) {
      try {
        await sendFollowNotification({
          followerName: req.user.name || 'Someone',
          followerEmail: req.user.email,
          userId: req.user._id,
          userEmail: targetUser.email,
        });
      } catch (emailError) {
        console.error('Email notification failed (but follow was successful):', emailError);
        // Don't fail the request if email fails
      }
    }

    res.json({ message: 'Followed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Unfollow user
router.delete('/:userId/follow', auth, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.userId);
    if (!targetUser) return res.status(404).json({ message: 'User not found' });

    // Remove from followers
    targetUser.followers = targetUser.followers.filter(id => id.toString() !== req.user._id.toString());
    await targetUser.save();

    // Remove from following
    const currentUser = await User.findById(req.user._id);
    currentUser.following = currentUser.following.filter(id => id.toString() !== req.params.userId);
    await currentUser.save();

    res.json({ message: 'Unfollowed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update user profile
router.patch('/profile', auth, async (req, res) => {
  try {
    const { bio, avatar, name } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { bio, avatar, name },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get user drafts
router.get('/:userId/drafts', auth, async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const drafts = await Blog.find({ author: req.user._id, status: 'draft' })
      .sort({ updatedAt: -1 });
    res.json(drafts);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
