const express = require('express');
const Blog = require('../models/blog');

const router = express.Router();

// Search blogs with filters
router.get('/', async (req, res) => {
  try {
    const { query, category, sortBy = 'newest' } = req.query;

    let searchFilter = {};

    // Text search
    if (query && query.trim()) {
      const searchRegex = new RegExp(query.trim(), 'i');
      searchFilter.$or = [
        { title: searchRegex },
        { blog_content: searchRegex },
        { short_description: searchRegex }
      ];
    }

    // Category filter
    if (category && category !== 'all') {
      searchFilter.category = category;
    }

    // Determine sort order
    let sortOrder = { createdAt: -1 }; // Default: newest
    if (sortBy === 'oldest') {
      sortOrder = { createdAt: 1 };
    } else if (sortBy === 'trending') {
      sortOrder = { views: -1 }; // Assuming views field exists
    }

    const blogs = await Blog.find(searchFilter)
      .populate('author', 'name email')
      .populate('category')
      .sort(sortOrder)
      .limit(50);

    res.json({
      count: blogs.length,
      blogs
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
