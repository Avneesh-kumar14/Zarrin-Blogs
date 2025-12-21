const express = require('express');
const Blog = require('../models/blog');
const logger = require('../utils/logger');
const { validateSearch } = require('../utils/validators');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Search
 *     description: Search and filter blogs
 */

/**
 * @swagger
 * /api/search:
 *   get:
 *     summary: Advanced search with multiple filters
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Search term (searches title, content, description)
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category ID
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [newest, oldest, trending, popular, mostLiked]
 *           default: newest
 *         description: Sort order
 *       - in: query
 *         name: minViews
 *         schema:
 *           type: number
 *           default: 0
 *         description: Minimum number of views
 *       - in: query
 *         name: maxViews
 *         schema:
 *           type: number
 *         description: Maximum number of views
 *       - in: query
 *         name: minReadTime
 *         schema:
 *           type: number
 *           default: 0
 *         description: Minimum read time (minutes)
 *       - in: query
 *         name: maxReadTime
 *         schema:
 *           type: number
 *         description: Maximum read time (minutes)
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Author ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 20
 *           maximum: 100
 *         description: Results per page
 *     responses:
 *       200:
 *         description: Search results with pagination
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
 *                     currentPage:
 *                       type: number
 *                     totalPages:
 *                       type: number
 *                     totalResults:
 *                       type: number
 *                     hasNextPage:
 *                       type: boolean
 */

// Advanced search with filters
router.get('/', validateSearch, async (req, res) => {
  try {
    const {
      query,
      category,
      sortBy = 'newest',
      minViews = 0,
      maxViews,
      minReadTime = 0,
      maxReadTime,
      author,
      page = 1,
      limit = 20,
    } = req.query;

    let searchFilter = {};

    // Text search
    if (query && query.trim()) {
      const searchRegex = new RegExp(query.trim(), 'i');
      searchFilter.$or = [
        { title: searchRegex },
        { blog_content: searchRegex },
        { short_description: searchRegex },
      ];
    }

    // Category filter
    if (category && category !== 'all') {
      searchFilter.category = category;
    }

    // Author filter
    if (author) {
      searchFilter.author = author;
    }

    // Views range filter
    const viewsFilter = {};
    if (minViews) viewsFilter.$gte = parseInt(minViews);
    if (maxViews) viewsFilter.$lte = parseInt(maxViews);
    if (Object.keys(viewsFilter).length > 0) {
      searchFilter.views = viewsFilter;
    }

    // Read time range filter
    const readTimeFilter = {};
    if (minReadTime) readTimeFilter.$gte = parseInt(minReadTime);
    if (maxReadTime) readTimeFilter.$lte = parseInt(maxReadTime);
    if (Object.keys(readTimeFilter).length > 0) {
      searchFilter.readTime = readTimeFilter;
    }

    // Determine sort order
    let sortOrder = { createdAt: -1 }; // Default: newest
    switch (sortBy) {
      case 'oldest':
        sortOrder = { createdAt: 1 };
        break;
      case 'trending':
        sortOrder = { views: -1 };
        break;
      case 'popular':
        sortOrder = { likes: -1 };
        break;
      case 'mostLiked':
        sortOrder = { likes: -1 };
        break;
      default:
        sortOrder = { createdAt: -1 };
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20));
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const totalResults = await Blog.countDocuments(searchFilter);
    const blogs = await Blog.find(searchFilter)
      .populate('author', 'name email avatar')
      .populate('category', 'name slug')
      .sort(sortOrder)
      .skip(skip)
      .limit(limitNum);

    const totalPages = Math.ceil(totalResults / limitNum);

    res.json({
      success: true,
      data: blogs,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalResults,
        hasNextPage: pageNum < totalPages,
        hasPreviousPage: pageNum > 1,
        limit: limitNum,
      },
      filters: {
        query: query || null,
        category: category || null,
        sortBy,
        viewsRange: { min: minViews, max: maxViews || 'unlimited' },
        readTimeRange: { min: minReadTime, max: maxReadTime || 'unlimited' },
        author: author || null,
      },
    });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: err.message,
    });
  }
});

module.exports = router;
