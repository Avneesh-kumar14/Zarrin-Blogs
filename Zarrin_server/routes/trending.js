const express = require('express');
const { auth } = require('../middleware/auth');
const Blog = require('../models/blog');

const router = express.Router();

// Get trending blogs (most liked, commented, viewed)
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const trending = await Blog.find({ status: 'published' })
      .populate('author', 'name email avatar')
      .sort({ 
        likes: -1, 
        views: -1
      })
      .limit(limit);
    res.json(trending);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
