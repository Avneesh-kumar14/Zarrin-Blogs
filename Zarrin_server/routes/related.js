const express = require('express');
const { auth } = require('../middleware/auth');
const Blog = require('../models/blog');

const router = express.Router();

// Get related blogs by tags/category
router.get('/blog/:blogId', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const related = await Blog.find({
      _id: { $ne: req.params.blogId },
      status: 'published',
      $or: [
        { tags: { $in: blog.tags || [] } },
        { category: { $in: blog.category || [] } }
      ]
    })
      .populate('author', 'name email avatar')
      .limit(4)
      .sort({ createdAt: -1 });

    res.json(related);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
