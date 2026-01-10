const express = require('express');
const { auth } = require('../middleware/auth');
const {
  getNotifications,
  getNotificationStats,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications
} = require('../controllers/notifications');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Notifications
 *     description: User notifications management
 */

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get all notifications for current user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *           enum: [all, unread, like, comment, follow, bookmark, trending]
 *         description: Filter notifications by type or read status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of notifications
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', auth, getNotifications);

/**
 * @swagger
 * /api/notifications/stats:
 *   get:
 *     summary: Get notification statistics
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notification statistics
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/stats', auth, getNotificationStats);

/**
 * @swagger
 * /api/notifications/{notificationId}/read:
 *   put:
 *     summary: Mark a notification as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification marked as read
 *       404:
 *         description: Notification not found
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.put('/:notificationId/read', auth, markAsRead);

/**
 * @swagger
 * /api/notifications/read-all:
 *   put:
 *     summary: Mark all notifications as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.put('/read-all', auth, markAllAsRead);

/**
 * @swagger
 * /api/notifications/{notificationId}:
 *   delete:
 *     summary: Delete a notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification deleted
 *       404:
 *         description: Notification not found
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.delete('/:notificationId', auth, deleteNotification);

/**
 * @swagger
 * /api/notifications/delete-all:
 *   delete:
 *     summary: Delete all notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications deleted
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.delete('/delete-all', auth, deleteAllNotifications);

module.exports = router;
