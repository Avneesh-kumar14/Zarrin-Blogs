const express = require('express');
const { auth, admin } = require('../middleware/auth');
const Blog = require('../models/blog');
const User = require('../models/userModel');

const router = express.Router();

// Get total count of blogs
router.get('/count', auth, async (req, res) => {
  try {
    const count = await Blog.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all blogs (with author info)
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().populate('author', 'name email').sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get single blog
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'name email');
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Create blog (auth required)
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, shortDesc, images, category } = req.body;
    
    // Validate required fields
    if (!title || !content || !shortDesc) {
      return res.status(400).json({ message: 'Title, content, and shortDesc are required' });
    }
    
    // Ensure category is an array
    const categoryArray = Array.isArray(category) ? category.filter(c => c) : (category ? [category] : []);
    
    const blog = await Blog.create({
      title,
      blog_content: content,
      short_description: shortDesc,
      images: images || [],
      category: categoryArray.length > 0 ? categoryArray : undefined,
      author: req.user._id
    });
    // Add blog to user's blogs
    await User.findByIdAndUpdate(req.user._id, { $push: { blog: blog._id } });
    res.status(201).json(blog);
  } catch (err) {
    console.error('Blog creation error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all blogs by user
router.get('/user/:userId', async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.params.userId }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update blog (owner or admin)
router.patch('/:id', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
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
    
    Object.assign(blog, updateData);
    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete blog (owner or admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await Blog.findByIdAndDelete(req.params.id);
    await User.findByIdAndUpdate(blog.author, { $pull: { blog: blog._id } });
    res.json({ message: 'Blog deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
