const express = require('express');
const { auth } = require('../middleware/auth');
const User = require('../models/userModel');
const Blog = require('../models/blog');
const Category = require('../models/blogCategory');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    console.log('Stats request from user:', {
      userId: req.user._id,
      email: req.user.email,
      role: req.user.role
    });
    
    console.log('Fetching stats from database...');
    
    const [userCount, blogCount, categoryCount] = await Promise.all([
      User.countDocuments(),
      Blog.countDocuments(),
      Category.countDocuments()
    ]);

    console.log('Counts fetched:', { userCount, blogCount, categoryCount });

    const recentBlogs = await Blog.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('category', 'name')
      .select('title createdAt');

    const statsData = {
      stats: {
        users: userCount,
        blogs: blogCount,
        categories: categoryCount
      },
      recentBlogs
    };
    
    console.log('Sending stats data:', statsData);
    res.json(statsData);
  } catch (err) {
    console.error('Error in stats route:', err);
    res.status(500).json({ 
      error: 'Failed to fetch stats',
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

module.exports = router;