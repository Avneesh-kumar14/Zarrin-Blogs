const express = require('express');
const { auth } = require('../middleware/auth');
const { uploadMulter } = require('../middleware/upload');
const {
  getSettings,
  updateProfile,
  updateWritingPreferences,
  updatePrivacy,
  updateNotificationPreferences,
  changePassword,
  uploadAvatar
} = require('../controllers/settings');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Settings
 *     description: User settings management
 */

/**
 * @swagger
 * /api/settings:
 *   get:
 *     summary: Get all user settings
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Settings retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', auth, getSettings);

/**
 * @swagger
 * /api/settings/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               username:
 *                 type: string
 *               bio:
 *                 type: string
 *               website:
 *                 type: string
 *               location:
 *                 type: string
 *               avatar:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.put('/profile', auth, updateProfile);

/**
 * @swagger
 * /api/settings/writing:
 *   put:
 *     summary: Update writing preferences
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               allowComments:
 *                 type: boolean
 *               showReadingTime:
 *                 type: boolean
 *               autoSaveDrafts:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Writing preferences updated
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.put('/writing', auth, updateWritingPreferences);

/**
 * @swagger
 * /api/settings/privacy:
 *   put:
 *     summary: Update privacy settings
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               profileVisibility:
 *                 type: boolean
 *               showActivity:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Privacy settings updated
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.put('/privacy', auth, updatePrivacy);

/**
 * @swagger
 * /api/settings/notifications:
 *   put:
 *     summary: Update notification preferences
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emailFollowers:
 *                 type: boolean
 *               emailComments:
 *                 type: boolean
 *               emailLikes:
 *                 type: boolean
 *               emailDigest:
 *                 type: boolean
 *               pushNotifications:
 *                 type: boolean
 *               pushMentions:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Notification preferences updated
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.put('/notifications', auth, updateNotificationPreferences);

/**
 * @swagger
 * /api/settings/password:
 *   put:
 *     summary: Change user password
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword, confirmPassword]
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized or incorrect password
 *       500:
 *         description: Server error
 */
router.put('/password', auth, changePassword);

/**
 * @swagger
 * /api/settings/avatar:
 *   post:
 *     summary: Upload user avatar
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar uploaded successfully
 *       400:
 *         description: Invalid file
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/avatar', auth, uploadMulter.single('avatar'), uploadAvatar);

module.exports = router;
