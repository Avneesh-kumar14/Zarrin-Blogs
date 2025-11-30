const express = require('express');
const { auth } = require('../middleware/auth');
const Like = require('../models/like');
const Blog = require('../models/blog');

const router = express.Router();

// Get like count for a blog
router.get('/count/:blogId', async (req, res) => {
  try {
    const count = await Like.countDocuments({ blog: req.params.blogId });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Check if user liked a blog
router.get('/check/:blogId', auth, async (req, res) => {
  try {
    const like = await Like.findOne({ blog: req.params.blogId, user: req.user._id });
    res.json({ liked: !!like });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Like a blog (auth required)
router.post('/:blogId', auth, async (req, res) => {
  try {
    // Check if blog exists
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check if already liked
    const existingLike = await Like.findOne({ blog: req.params.blogId, user: req.user._id });
    if (existingLike) {
      return res.status(400).json({ message: 'Already liked this blog' });
    }

    const like = await Like.create({
      blog: req.params.blogId,
      user: req.user._id
    });

    const count = await Like.countDocuments({ blog: req.params.blogId });
    res.status(201).json({ message: 'Blog liked', count });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Unlike a blog (auth required)
router.delete('/:blogId', auth, async (req, res) => {
  try {
    const like = await Like.findOneAndDelete({ blog: req.params.blogId, user: req.user._id });
    
    if (!like) {
      return res.status(404).json({ message: 'Like not found' });
    }

    const count = await Like.countDocuments({ blog: req.params.blogId });
    res.json({ message: 'Like removed', count });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
