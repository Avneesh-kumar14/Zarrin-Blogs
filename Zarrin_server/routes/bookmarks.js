const express = require('express');
const { auth } = require('../middleware/auth');
const Bookmark = require('../models/bookmark');
const Blog = require('../models/blog');
const Notification = require('../models/notification');

const router = express.Router();

// Get all bookmarks for user
router.get('/', auth, async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user._id })
      .populate({
        path: 'blog',
        populate: { path: 'author', select: 'name email' }
      })
      .sort({ createdAt: -1 });
    res.json(bookmarks);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Check if user bookmarked a blog
router.get('/check/:blogId', auth, async (req, res) => {
  try {
    const bookmark = await Bookmark.findOne({ blog: req.params.blogId, user: req.user._id });
    res.json({ bookmarked: !!bookmark });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Bookmark a blog (auth required)
router.post('/:blogId', auth, async (req, res) => {
  try {
    // Check if blog exists
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check if already bookmarked
    const existingBookmark = await Bookmark.findOne({ blog: req.params.blogId, user: req.user._id });
    if (existingBookmark) {
      return res.status(400).json({ message: 'Already bookmarked this blog' });
    }

    const bookmark = await Bookmark.create({
      blog: req.params.blogId,
      user: req.user._id
    });

    const populated = await bookmark.populate({
      path: 'blog',
      populate: { path: 'author', select: 'name email' }
    });

    // Create notification for blog author
    if (blog.author && blog.author.toString() !== req.user._id.toString()) {
      try {
        await Notification.create({
          recipient: blog.author,
          sender: req.user._id,
          type: 'bookmark',
          title: `${req.user.name || 'Someone'} bookmarked your article`,
          message: `Your article "${blog.title}" was bookmarked`,
          blog: req.params.blogId
        });
      } catch (notifError) {
        console.error('Failed to create notification:', notifError);
        // Don't fail the request
      }
    }

    res.status(201).json({ message: 'Blog bookmarked', bookmark: populated });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Remove bookmark (auth required)
router.delete('/:blogId', auth, async (req, res) => {
  try {
    const bookmark = await Bookmark.findOneAndDelete({ blog: req.params.blogId, user: req.user._id });
    
    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }

    res.json({ message: 'Bookmark removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
