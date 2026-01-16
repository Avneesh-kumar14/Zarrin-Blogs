const Notification = require('../models/notification');
const User = require('../models/userModel');
const logger = require('../utils/logger');

/**
 * Create notification for blog like
 */
const notifyBlogLike = async (userId, blogId, likerData) => {
  try {
    // Don't notify self
    if (userId.toString() === likerData.sender.toString()) {
      return null;
    }

    const sender = await User.findById(likerData.sender).select('name avatar email');
    const blog = await (require('../models/blog')).findById(blogId).select('title slug');

    if (!sender || !blog) return null;

    // Check user preferences
    const user = await User.findById(userId);
    if (!user?.notificationPreferences?.emailLikes) return null;

    const notification = new Notification({
      recipient: userId,
      sender: likerData.sender,
      type: 'like',
      title: `${sender.name} liked your article`,
      message: `"${blog.title}" received a new like`,
      blog: blogId,
      data: {
        likerName: sender.name,
        likerAvatar: sender.avatar
      }
    });

    await notification.save();
    logger.info('Like notification created', { userId, blogId, sender: likerData.sender });
    return notification;
  } catch (error) {
    logger.error('Error creating like notification:', { error: error.message });
    return null;
  }
};

/**
 * Create notification for blog comment
 */
const notifyBlogComment = async (userId, blogId, commentData) => {
  try {
    // Don't notify self
    if (userId.toString() === commentData.author.toString()) {
      return null;
    }

    const author = await User.findById(commentData.author).select('name avatar email');
    const blog = await (require('../models/blog')).findById(blogId).select('title slug');

    if (!author || !blog) return null;

    // Check user preferences
    const user = await User.findById(userId);
    if (!user?.notificationPreferences?.emailComments) return null;

    const notification = new Notification({
      recipient: userId,
      sender: commentData.author,
      type: 'comment',
      title: `${author.name} commented on your article`,
      message: `"${blog.title}" has a new comment`,
      blog: blogId,
      comment: commentData._id,
      data: {
        authorName: author.name,
        authorAvatar: author.avatar,
        commentContent: commentData.content?.substring(0, 50) || ''
      }
    });

    await notification.save();
    logger.info('Comment notification created', { userId, blogId, author: commentData.author });
    return notification;
  } catch (error) {
    logger.error('Error creating comment notification:', { error: error.message });
    return null;
  }
};

/**
 * Create notification for user follow
 */
const notifyUserFollow = async (userId, followerId) => {
  try {
    // Don't notify self
    if (userId.toString() === followerId.toString()) {
      return null;
    }

    const follower = await User.findById(followerId).select('name avatar email');

    if (!follower) return null;

    // Check user preferences
    const user = await User.findById(userId);
    if (!user?.notificationPreferences?.emailFollowers) return null;

    const notification = new Notification({
      recipient: userId,
      sender: followerId,
      type: 'follow',
      title: `${follower.name} started following you`,
      message: `${follower.name} is now following your articles`,
      data: {
        followerName: follower.name,
        followerAvatar: follower.avatar
      }
    });

    await notification.save();
    logger.info('Follow notification created', { userId, followerId });
    return notification;
  } catch (error) {
    logger.error('Error creating follow notification:', { error: error.message });
    return null;
  }
};

/**
 * Create notification for blog bookmark
 */
const notifyBlogBookmark = async (userId, blogId, bookmarkerData) => {
  try {
    // Get bookmark count threshold (notify after 5 bookmarks)
    const blog = await (require('../models/blog')).findById(blogId);
    if (!blog) return null;

    const bookmarkCount = await (require('../models/bookmark')).countDocuments({ blog: blogId });

    // Notify on milestone bookmarks: 1st, 5th, 10th, 25th, etc.
    const notifyOn = [1, 5, 10, 25, 50, 100];
    if (!notifyOn.includes(bookmarkCount)) return null;

    const notification = new Notification({
      recipient: userId,
      type: 'bookmark',
      title: `Your article reached ${bookmarkCount} bookmarks!`,
      message: `"${blog.title}" has been bookmarked ${bookmarkCount} times`,
      blog: blogId,
      data: {
        bookmarkCount,
        milestone: true
      }
    });

    await notification.save();
    logger.info('Bookmark milestone notification created', { userId, blogId, bookmarkCount });
    return notification;
  } catch (error) {
    logger.error('Error creating bookmark notification:', { error: error.message });
    return null;
  }
};

/**
 * Create notification for trending blog
 */
const notifyTrendingBlog = async (userId, blogId) => {
  try {
    const blog = await (require('../models/blog')).findById(blogId);
    if (!blog || blog.author.toString() !== userId.toString()) return null;

    // Check if already notified
    const existingNotification = await Notification.findOne({
      recipient: userId,
      blog: blogId,
      type: 'trending'
    });

    if (existingNotification) return null;

    const notification = new Notification({
      recipient: userId,
      type: 'trending',
      title: 'Your article is trending!',
      message: `"${blog.title}" is now trending on the platform`,
      blog: blogId,
      data: {
        trending: true
      }
    });

    await notification.save();
    logger.info('Trending notification created', { userId, blogId });
    return notification;
  } catch (error) {
    logger.error('Error creating trending notification:', { error: error.message });
    return null;
  }
};

/**
 * Create notification for reply to comment
 */
const notifyCommentReply = async (userId, blogId, commentData, replyData) => {
  try {
    // Don't notify self
    if (userId.toString() === replyData.author.toString()) {
      return null;
    }

    const author = await User.findById(replyData.author).select('name avatar email');
    const blog = await (require('../models/blog')).findById(blogId).select('title slug');

    if (!author || !blog) return null;

    // Check user preferences
    const user = await User.findById(userId);
    if (!user?.notificationPreferences?.emailComments) return null;

    const notification = new Notification({
      recipient: userId,
      sender: replyData.author,
      type: 'comment',
      title: `${author.name} replied to your comment`,
      message: `Your comment on "${blog.title}" received a reply`,
      blog: blogId,
      comment: commentData._id,
      data: {
        authorName: author.name,
        authorAvatar: author.avatar,
        replyContent: replyData.content?.substring(0, 50) || ''
      }
    });

    await notification.save();
    logger.info('Comment reply notification created', { userId, blogId, author: replyData.author });
    return notification;
  } catch (error) {
    logger.error('Error creating comment reply notification:', { error: error.message });
    return null;
  }
};

/**
 * Bulk clear old notifications
 */
const clearOldNotifications = async (days = 30) => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const result = await Notification.deleteMany({
      createdAt: { $lt: cutoffDate },
      isRead: true
    });

    logger.info('Old notifications cleared', { deletedCount: result.deletedCount, days });
    return result;
  } catch (error) {
    logger.error('Error clearing old notifications:', { error: error.message });
    throw error;
  }
};

module.exports = {
  notifyBlogLike,
  notifyBlogComment,
  notifyUserFollow,
  notifyBlogBookmark,
  notifyTrendingBlog,
  notifyCommentReply,
  clearOldNotifications
};
