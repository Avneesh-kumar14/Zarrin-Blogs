const express = require('express');
const { auth } = require('../middleware/auth');
const Blog = require('../models/blog');

const router = express.Router();

// Get trending blogs (most liked, commented, viewed)
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    
    // Use aggregation to calculate like and comment counts properly
    const trending = await Blog.aggregate([
      { $match: { status: 'published' } },
      {
        $addFields: {
          likeCount: { $size: { $ifNull: ['$likes', []] } },
          commentCount: { $size: { $ifNull: ['$comments', []] } }
        }
      },
      {
        $sort: { 
          likeCount: -1,
          commentCount: -1,
          views: -1
        }
      },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'author'
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category'
        }
      },
      {
        $unwind: { path: '$author', preserveNullAndEmptyArrays: true }
      },
      {
        $project: {
          title: 1,
          short_description: 1,
          blog_content: 1,
          images: 1,
          category: 1,
          author: { name: 1, email: 1, avatar: 1 },
          views: 1,
          likes: 1,
          comments: 1,
          createdAt: 1,
          status: 1,
          likeCount: 1,
          commentCount: 1
        }
      }
    ]);
    
    res.json(trending);
  } catch (err) {
    console.error('❌ Trending error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
