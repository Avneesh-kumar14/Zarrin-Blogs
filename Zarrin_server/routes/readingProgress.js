const express = require('express');
const { auth } = require('../middleware/auth');
const ReadingProgress = require('../models/readingProgress');
const Blog = require('../models/blog');
const logger = require('../utils/logger');
const {
  validateReadingProgressSave,
  validateReadingProgressGet,
} = require('../utils/validators');

const router = express.Router();

/**
 * @swagger
 * /api/reading-progress/{blogId}:
 *   get:
 *     summary: Get reading progress for a blog
 *     tags: [Reading Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     responses:
 *       200:
 *         description: Reading progress retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     scrollPosition:
 *                       type: number
 *                     timeSpent:
 *                       type: number
 *                     isCompleted:
 *                       type: boolean
 *                     lastReadAt:
 *                       type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No progress found (user can start fresh)
 */
router.get('/:blogId', auth, validateReadingProgressGet, async (req, res) => {
  try {
    const progress = await ReadingProgress.findOne({
      userId: req.user._id,
      blogId: req.params.blogId,
    });

    if (!progress) {
      return res.status(200).json({
        success: true,
        data: {
          scrollPosition: 0,
          timeSpent: 0,
          isCompleted: false,
          lastReadAt: null,
        },
      });
    }

    res.json({
      success: true,
      data: progress,
    });
  } catch (error) {
    console.error('Error fetching reading progress:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch reading progress',
    });
  }
});

/**
 * @swagger
 * /api/reading-progress/{blogId}:
 *   post:
 *     summary: Save or update reading progress
 *     tags: [Reading Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               scrollPosition:
 *                 type: number
 *                 description: Scroll position (0-100 percentage)
 *               timeSpent:
 *                 type: number
 *                 description: Time spent reading (seconds)
 *               isCompleted:
 *                 type: boolean
 *                 description: Whether blog is fully read
 *             required:
 *               - scrollPosition
 *               - timeSpent
 *     responses:
 *       200:
 *         description: Reading progress saved
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Blog not found
 */
router.post('/:blogId', auth, validateReadingProgressSave, async (req, res) => {
  try {
    const { scrollPosition, timeSpent, isCompleted } = req.body;

    // Validate blog exists
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        error: 'Blog not found',
      });
    }

    // Update or create reading progress
    let progress = await ReadingProgress.findOneAndUpdate(
      {
        userId: req.user._id,
        blogId: req.params.blogId,
      },
      {
        scrollPosition: Math.min(scrollPosition, 100),
        timeSpent: Math.max(timeSpent, 0),
        isCompleted: isCompleted || scrollPosition >= 95, // Mark complete at 95% scroll
        lastReadAt: new Date(),
      },
      {
        new: true,
        upsert: true,
      }
    );

    res.json({
      success: true,
      data: progress,
      message: isCompleted ? 'Blog marked as completed! 🎉' : 'Progress saved',
    });
  } catch (error) {
    console.error('Error saving reading progress:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save reading progress',
    });
  }
});

/**
 * @swagger
 * /api/reading-progress/continue:
 *   get:
 *     summary: Get recently read blogs to continue
 *     tags: [Reading Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 5
 *         description: Number of blogs to return
 *     responses:
 *       200:
 *         description: List of blogs to continue reading
 *       401:
 *         description: Unauthorized
 */
router.get('/continue/recent', auth, async (req, res) => {
  try {
    const limit = Math.min(req.query.limit || 5, 20);

    const progress = await ReadingProgress.find({
      userId: req.user._id,
      isCompleted: false,
    })
      .sort({ lastReadAt: -1 })
      .limit(limit)
      .populate('blogId', 'title category cover_image');

    res.json({
      success: true,
      data: progress.map((p) => ({
        progress: {
          scrollPosition: p.scrollPosition,
          timeSpent: p.timeSpent,
          lastReadAt: p.lastReadAt,
        },
        blog: p.blogId,
      })),
      total: progress.length,
    });
  } catch (error) {
    console.error('Error fetching continue reading list:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch continue reading list',
    });
  }
});

/**
 * @swagger
 * /api/reading-progress/stats:
 *   get:
 *     summary: Get reading statistics
 *     tags: [Reading Progress]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User reading statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalBlogsRead:
 *                       type: number
 *                     completedBlogs:
 *                       type: number
 *                     totalTimeSpent:
 *                       type: number
 *                     averageTimePerBlog:
 *                       type: number
 *                     continueReading:
 *                       type: number
 */
router.get('/stats', auth, async (req, res) => {
  try {
    const stats = await ReadingProgress.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: null,
          totalBlogsRead: { $sum: 1 },
          completedBlogs: {
            $sum: { $cond: ['$isCompleted', 1, 0] },
          },
          totalTimeSpent: { $sum: '$timeSpent' },
          averageTimePerBlog: { $avg: '$timeSpent' },
          inProgress: {
            $sum: { $cond: ['$isCompleted', 0, 1] },
          },
        },
      },
    ]);

    const data =
      stats.length > 0
        ? stats[0]
        : {
            totalBlogsRead: 0,
            completedBlogs: 0,
            totalTimeSpent: 0,
            averageTimePerBlog: 0,
            inProgress: 0,
          };

    res.json({
      success: true,
      data: {
        ...data,
        totalTimeSpentHours: (data.totalTimeSpent / 3600).toFixed(2),
        completionRate: data.totalBlogsRead > 0 
          ? ((data.completedBlogs / data.totalBlogsRead) * 100).toFixed(1)
          : 0,
      },
    });
  } catch (error) {
    console.error('Error fetching reading stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch reading statistics',
    });
  }
});

module.exports = router;
