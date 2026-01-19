const express = require('express');
const router = express.Router();
const { body, param, query, validationResult } = require('express-validator');
const { auth: authMiddleware } = require('../middleware/auth');
const logger = require('../utils/logger');
const chatService = require('../services/chatService');

/**
 * Error handler middleware
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

/**
 * @route GET /api/chat/conversations
 * @desc Get user's conversations
 * @access Private
 */
router.get(
  '/conversations',
  authMiddleware,
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  handleValidationErrors,
  async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;

      const result = await chatService.getUserConversations(req.user.id, page, limit);

      res.json({
        success: true,
        data: result.conversations,
        pagination: {
          page,
          limit,
          total: result.total,
          pages: result.pages
        }
      });
    } catch (error) {
      logger.error('Error in GET /conversations:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
);

/**
 * @route GET /api/chat/conversations/:conversationId
 * @desc Get single conversation
 * @access Private
 */
router.get(
  '/conversations/:conversationId',
  authMiddleware,
  param('conversationId').isMongoId(),
  handleValidationErrors,
  async (req, res) => {
    try {
      const Conversation = require('../models/conversation');
      const conversation = await Conversation.findById(req.params.conversationId)
        .populate('participants', 'name username email')
        .populate('lastMessage');

      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: 'Conversation not found'
        });
      }

      // Check if user is participant
      const isParticipant = conversation.participants.some(
        p => p._id.toString() === req.user.id.toString()
      );

      if (!isParticipant) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized'
        });
      }

      res.json({
        success: true,
        data: conversation
      });
    } catch (error) {
      logger.error('Error in GET /conversations/:conversationId:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
);

/**
 * @route POST /api/chat/conversations/direct/:otherUserId
 * @desc Get or create direct conversation with user
 * @access Private
 */
router.post(
  '/conversations/direct/:otherUserId',
  authMiddleware,
  param('otherUserId').isMongoId(),
  handleValidationErrors,
  async (req, res) => {
    try {
      if (req.params.otherUserId === req.user.id) {
        return res.status(400).json({
          success: false,
          message: 'Cannot create conversation with yourself'
        });
      }

      const conversation = await chatService.getOrCreateDirectConversation(
        req.user.id,
        req.params.otherUserId
      );

      res.status(201).json({
        success: true,
        data: conversation
      });
    } catch (error) {
      logger.error('Error in POST /conversations/direct:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
);

/**
 * @route POST /api/chat/conversations/group
 * @desc Create group conversation
 * @access Private
 */
router.post(
  '/conversations/group',
  authMiddleware,
  body('conversationName').trim().notEmpty().withMessage('Group name required'),
  body('participants').isArray({ min: 1 }).withMessage('At least 1 participant required'),
  body('groupAvatar').optional(),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { conversationName, participants, groupAvatar } = req.body;

      const conversation = await chatService.createGroupConversation(
        req.user.id,
        participants,
        conversationName,
        groupAvatar
      );

      res.status(201).json({
        success: true,
        data: conversation
      });
    } catch (error) {
      logger.error('Error in POST /conversations/group:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
);

/**
 * @route GET /api/chat/conversations/:conversationId/messages
 * @desc Get messages in conversation
 * @access Private
 */
router.get(
  '/conversations/:conversationId/messages',
  authMiddleware,
  param('conversationId').isMongoId(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  handleValidationErrors,
  async (req, res) => {
    try {
      const Conversation = require('../models/conversation');
      const conversation = await Conversation.findById(req.params.conversationId);

      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: 'Conversation not found'
        });
      }

      // Verify user is participant
      const isParticipant = conversation.participants.some(
        p => p.toString() === req.user.id.toString()
      );

      if (!isParticipant) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized'
        });
      }

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 30;

      const result = await chatService.getConversationMessages(
        req.params.conversationId,
        page,
        limit
      );

      res.json({
        success: true,
        data: result.messages,
        pagination: {
          page,
          limit,
          total: result.total,
          pages: result.pages
        }
      });
    } catch (error) {
      logger.error('Error in GET /messages:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
);

/**
 * @route GET /api/chat/conversations/:conversationId/unread
 * @desc Get unread message count
 * @access Private
 */
router.get(
  '/conversations/:conversationId/unread',
  authMiddleware,
  param('conversationId').isMongoId(),
  handleValidationErrors,
  async (req, res) => {
    try {
      const count = await chatService.getUnreadCount(
        req.params.conversationId,
        req.user.id
      );

      res.json({
        success: true,
        unreadCount: count
      });
    } catch (error) {
      logger.error('Error in GET /unread:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
);

/**
 * @route PUT /api/chat/messages/:messageId/read
 * @desc Mark all messages in conversation as read
 * @access Private
 */
router.put(
  '/conversations/:conversationId/mark-read',
  authMiddleware,
  param('conversationId').isMongoId(),
  handleValidationErrors,
  async (req, res) => {
    try {
      await chatService.markMessagesAsRead(req.params.conversationId, req.user.id);

      res.json({
        success: true,
        message: 'Messages marked as read'
      });
    } catch (error) {
      logger.error('Error in PUT /mark-read:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
);

/**
 * @route DELETE /api/chat/messages/:messageId
 * @desc Delete a message
 * @access Private
 */
router.delete(
  '/messages/:messageId',
  authMiddleware,
  param('messageId').isMongoId(),
  handleValidationErrors,
  async (req, res) => {
    try {
      const message = await chatService.deleteMessage(req.params.messageId, req.user.id);

      res.json({
        success: true,
        data: message
      });
    } catch (error) {
      logger.error('Error in DELETE /messages:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
);

/**
 * @route PUT /api/chat/messages/:messageId
 * @desc Edit a message
 * @access Private
 */
router.put(
  '/messages/:messageId',
  authMiddleware,
  param('messageId').isMongoId(),
  body('content').trim().notEmpty().withMessage('Content required'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const message = await chatService.editMessage(
        req.params.messageId,
        req.user.id,
        req.body.content
      );

      res.json({
        success: true,
        data: message
      });
    } catch (error) {
      logger.error('Error in PUT /messages:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
);

/**
 * @route POST /api/chat/messages/:messageId/reaction
 * @desc Add reaction to message
 * @access Private
 */
router.post(
  '/messages/:messageId/reaction',
  authMiddleware,
  param('messageId').isMongoId(),
  body('emoji').notEmpty().withMessage('Emoji required'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const message = await chatService.addReaction(
        req.params.messageId,
        req.user.id,
        req.body.emoji
      );

      res.json({
        success: true,
        data: message
      });
    } catch (error) {
      logger.error('Error in POST /reaction:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
);

/**
 * @route POST /api/chat/conversations/:conversationId/members
 * @desc Add member to group
 * @access Private
 */
router.post(
  '/conversations/:conversationId/members',
  authMiddleware,
  param('conversationId').isMongoId(),
  body('userId').isMongoId().withMessage('Valid user ID required'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const conversation = await chatService.addGroupMember(
        req.params.conversationId,
        req.body.userId,
        req.user.id
      );

      res.json({
        success: true,
        data: conversation
      });
    } catch (error) {
      logger.error('Error in POST /members:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
);

/**
 * @route DELETE /api/chat/conversations/:conversationId/members/:userId
 * @desc Remove member from group
 * @access Private
 */
router.delete(
  '/conversations/:conversationId/members/:userId',
  authMiddleware,
  param('conversationId').isMongoId(),
  param('userId').isMongoId(),
  handleValidationErrors,
  async (req, res) => {
    try {
      const conversation = await chatService.removeGroupMember(
        req.params.conversationId,
        req.params.userId,
        req.user.id
      );

      res.json({
        success: true,
        data: conversation
      });
    } catch (error) {
      logger.error('Error in DELETE /members:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
);

/**
 * @route PUT /api/chat/conversations/:conversationId/archive
 * @desc Archive conversation
 * @access Private
 */
router.put(
  '/conversations/:conversationId/archive',
  authMiddleware,
  param('conversationId').isMongoId(),
  handleValidationErrors,
  async (req, res) => {
    try {
      await chatService.archiveConversation(req.params.conversationId, req.user.id);

      res.json({
        success: true,
        message: 'Conversation archived'
      });
    } catch (error) {
      logger.error('Error in PUT /archive:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
);

/**
 * @route PUT /api/chat/conversations/:conversationId/mute
 * @desc Mute conversation
 * @access Private
 */
router.put(
  '/conversations/:conversationId/mute',
  authMiddleware,
  param('conversationId').isMongoId(),
  handleValidationErrors,
  async (req, res) => {
    try {
      await chatService.muteConversation(req.params.conversationId, req.user.id);

      res.json({
        success: true,
        message: 'Conversation muted'
      });
    } catch (error) {
      logger.error('Error in PUT /mute:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
);

/**
 * @route PUT /api/chat/conversations/:conversationId/pin
 * @desc Pin conversation
 * @access Private
 */
router.put(
  '/conversations/:conversationId/pin',
  authMiddleware,
  param('conversationId').isMongoId(),
  handleValidationErrors,
  async (req, res) => {
    try {
      await chatService.pinConversation(req.params.conversationId, req.user.id);

      res.json({
        success: true,
        message: 'Conversation pinned'
      });
    } catch (error) {
      logger.error('Error in PUT /pin:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
);

module.exports = router;
