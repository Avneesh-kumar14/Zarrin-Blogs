const express = require('express');
const { auth } = require('../middleware/auth');
const Comment = require('../models/comment');
const Blog = require('../models/blog');
const { sendCommentNotification } = require('../services/emailService');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Comments
 *     description: Blog comment operations
 */

/**
 * @swagger
 * /api/comments/blog/{blogId}:
 *   get:
 *     summary: Get all comments for a blog
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of comments
 */

/**
 * @swagger
 * /api/comments/blog/{blogId}:
 *   post:
 *     summary: Add a comment to a blog
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [text]
 *             properties:
 *               text:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment created
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/comments/{commentId}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment deleted
 *       401:
 *         description: Unauthorized
 */

// Get all comments for a blog
router.get('/blog/:blogId', async (req, res) => {
  try {
    const comments = await Comment.find({ blog: req.params.blogId })
      .populate('author', 'name email')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Create comment (auth required)
router.post('/', auth, async (req, res) => {
  try {
    const { blogId, content } = req.body;

    if (!blogId || !content) {
      return res.status(400).json({ message: 'Blog ID and content are required' });
    }

    if (content.trim().length === 0 || content.length > 1000) {
      return res.status(400).json({ message: 'Content must be between 1 and 1000 characters' });
    }

    // Check if blog exists
    const blog = await Blog.findById(blogId).populate('author', 'name email');
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const comment = await Comment.create({
      blog: blogId,
      author: req.user._id,
      content: content.trim()
    });

    const populatedComment = await comment.populate('author', 'name email');

    // Send email notification to blog author (if author != commenter and email exists)
    if (blog.author && blog.author._id.toString() !== req.user._id.toString() && blog.author.email) {
      try {
        const preview = content.substring(0, 100);
        await sendCommentNotification({
          commenterName: req.user.name || 'Someone',
          blogTitle: blog.title,
          blogId: blogId,
          userEmail: blog.author.email,
          commentPreview: preview,
        });
      } catch (emailError) {
        console.error('Email notification failed (but comment was created):', emailError);
        // Don't fail the request if email fails
      }
    }

    res.status(201).json(populatedComment);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete comment (owner or admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update comment (owner only)
router.patch('/:id', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this comment' });
    }

    if (!content || content.trim().length === 0 || content.length > 1000) {
      return res.status(400).json({ message: 'Content must be between 1 and 1000 characters' });
    }

    comment.content = content.trim();
    comment.updatedAt = Date.now();
    await comment.save();

    const updatedComment = await comment.populate('author', 'name email');
    res.json(updatedComment);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
