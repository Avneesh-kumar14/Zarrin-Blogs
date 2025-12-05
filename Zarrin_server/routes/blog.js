const express = require('express');
const { auth, admin } = require('../middleware/auth');
const { validateBlog, validateObjectId } = require('../middleware/security');
const Blog = require('../models/blog');
const User = require('../models/userModel');

const router = express.Router();

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

    // Count total documents
    const total = await Blog.countDocuments();

    // Fetch paginated blogs
    const blogs = await Blog.find()
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

// Get single blog with validation
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
    
    // Ensure category is an array
    const categoryArray = Array.isArray(category) ? category.filter(c => c) : (category ? [category] : []);
    
    const blog = await Blog.create({
      title,
      blog_content: content,
      short_description: shortDesc,
      images: images || [],
      category: categoryArray.length > 0 ? categoryArray : undefined,
      author: req.user._id,
      views: 0,
      likes: [],
      comments: []
    });
    
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

// Get all blogs by user with pagination
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


// Update blog (owner or admin) with validation
router.patch('/:id', auth, validateObjectId, validateBlog, async (req, res) => {
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
    
    // Handle images - ensure it's an array of strings (URLs)
    if (updateData.images) {
      updateData.images = Array.isArray(updateData.images) ? updateData.images.filter(img => typeof img === 'string' && img.trim()) : [];
    }
    
    // Handle categories - ensure it's an array of valid IDs
    if (updateData.category) {
      updateData.category = Array.isArray(updateData.category) ? updateData.category.filter(c => c) : (updateData.category ? [updateData.category] : []);
    }
    
    Object.assign(blog, updateData);
    await blog.save();
    
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
