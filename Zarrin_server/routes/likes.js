const express = require('express');
const { auth } = require('../middleware/auth');
const Like = require('../models/like');
const Blog = require('../models/blog');
const User = require('../models/userModel');
const Notification = require('../models/notification');
const { sendLikeNotification } = require('../services/emailService');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Likes
 *     description: Blog like operations
 */

/**
 * @swagger
 * /api/likes/count/{blogId}:
 *   get:
 *     summary: Get like count for a blog
 *     tags: [Likes]
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Like count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count: { type: number }
 */

/**
 * @swagger
 * /api/likes/{blogId}:
 *   post:
 *     summary: Like a blog
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog liked
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/likes/{blogId}:
 *   delete:
 *     summary: Unlike a blog
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog unliked
 *       401:
 *         description: Unauthorized
 */

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
    const blog = await Blog.findById(req.params.blogId).populate('author', 'name email');
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

    // Create notification in database
    if (blog.author && blog.author._id.toString() !== req.user._id.toString()) {
      try {
        await Notification.create({
          recipient: blog.author._id,
          sender: req.user._id,
          type: 'like',
          title: `${req.user.name || 'Someone'} liked your article`,
          message: `Your article "${blog.title}" received a like`,
          blog: req.params.blogId,
          data: { likeCount: count }
        });
      } catch (notifError) {
        console.error('Failed to create notification:', notifError);
        // Don't fail the request if notification creation fails
      }
    }

    // Send email notification to blog author (if author != liker and email exists)
    if (blog.author && blog.author._id.toString() !== req.user._id.toString() && blog.author.email) {
      try {
        await sendLikeNotification({
          likerName: req.user.name || 'Someone',
          blogTitle: blog.title,
          blogId: req.params.blogId,
          userEmail: blog.author.email,
          totalLikes: count,
        });
      } catch (emailError) {
        console.error('Email notification failed (but like was successful):', emailError);
        // Don't fail the request if email fails
      }
    }

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
