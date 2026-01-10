const Notification = require('../models/notification');
const User = require('../models/userModel');
const Blog = require('../models/blog');
const logger = require('../utils/logger');

/**
 * Get all notifications for a user
 */
const getNotifications = async (req, res) => {
  try {
    const { filter = 'all', page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let query = { recipient: req.user._id };

    // Apply filter
    if (filter !== 'all' && filter !== 'unread') {
      query.type = filter;
    } else if (filter === 'unread') {
      query.isRead = false;
    }

    const notifications = await Notification.find(query)
      .populate('sender', 'name avatar email')
      .populate('blog', 'title slug')
      .populate('comment', 'content')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ 
      recipient: req.user._id, 
      isRead: false 
    });

    res.json({
      notifications,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      },
      unreadCount
    });
  } catch (error) {
    logger.error('Error fetching notifications:', { error: error.message });
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get notification stats
 */
const getNotificationStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Count notifications by type
    const likes = await Notification.countDocuments({ 
      recipient: userId, 
      type: 'like' 
    });
    const comments = await Notification.countDocuments({ 
      recipient: userId, 
      type: 'comment' 
    });
    const followers = await Notification.countDocuments({ 
      recipient: userId, 
      type: 'follow' 
    });
    const bookmarks = await Notification.countDocuments({ 
      recipient: userId, 
      type: 'bookmark' 
    });

    res.json({
      stats: {
        likes,
        comments,
        followers,
        bookmarks
      }
    });
  } catch (error) {
    logger.error('Error fetching notification stats:', { error: error.message });
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Mark notification as read
 */
const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Verify ownership
    if (notification.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    notification.isRead = true;
    notification.readAt = new Date();
    await notification.save();

    logger.info('Notification marked as read', { notificationId, userId: req.user._id });
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    logger.error('Error marking notification as read:', { error: error.message });
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Mark all notifications as read
 */
const markAllAsRead = async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { 
        recipient: req.user._id,
        isRead: false 
      },
      { 
        $set: { 
          isRead: true,
          readAt: new Date()
        }
      }
    );

    logger.info('All notifications marked as read', { 
      userId: req.user._id,
      updatedCount: result.modifiedCount
    });

    res.json({ 
      message: 'All notifications marked as read',
      updatedCount: result.modifiedCount
    });
  } catch (error) {
    logger.error('Error marking all notifications as read:', { error: error.message });
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Delete a notification
 */
const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Verify ownership
    if (notification.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Notification.findByIdAndDelete(notificationId);

    logger.info('Notification deleted', { notificationId, userId: req.user._id });
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    logger.error('Error deleting notification:', { error: error.message });
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Delete all notifications
 */
const deleteAllNotifications = async (req, res) => {
  try {
    const result = await Notification.deleteMany({
      recipient: req.user._id
    });

    logger.info('All notifications deleted', { 
      userId: req.user._id,
      deletedCount: result.deletedCount
    });

    res.json({ 
      message: 'All notifications deleted',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    logger.error('Error deleting all notifications:', { error: error.message });
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Create a notification (Internal use)
 */
const createNotification = async (recipientId, notificationData) => {
  try {
    const notification = new Notification({
      recipient: recipientId,
      ...notificationData
    });

    await notification.save();
    logger.info('Notification created', { 
      recipientId,
      type: notificationData.type
    });

    return notification;
  } catch (error) {
    logger.error('Error creating notification:', { error: error.message });
    throw error;
  }
};

module.exports = {
  getNotifications,
  getNotificationStats,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  createNotification
};
