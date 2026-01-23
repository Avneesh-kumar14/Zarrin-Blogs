const express = require('express');
const router = express.Router();
const { body, param, query, validationResult } = require('express-validator');
const { auth: authMiddleware } = require('../middleware/auth');
const logger = require('../utils/logger');
const chatService = require('../services/chatService');
const multer = require('multer');

// Configure multer for image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    logger.info(`[MULTER] Processing file: ${file.fieldname}, mimetype: ${file.mimetype}, size: ${file.size}`);
    // Allow only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      logger.error(`[MULTER] Rejected file: ${file.filename} - invalid mimetype: ${file.mimetype}`);
      cb(new Error('Only image files are allowed'));
    }
  }
});

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
      const userId = req.user?.id || req.user?._id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      
      if (!userId) {
        return res.status(401).json({ 
          success: false,
          error: 'User not authenticated' 
        });
      }
      
      logger.info(`[CHAT] GET /conversations - User: ${userId}, Page: ${page}, Limit: ${limit}`);

      const result = await chatService.getUserConversations(userId, page, limit);
      
      logger.info(`[CHAT] Conversations found: ${result.conversations.length}, Total: ${result.total}`);

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
      logger.error('[CHAT] Error in GET /conversations:', {
        message: error.message,
        userId: req.user?.id,
        stack: error.stack
      });
      
      res.status(500).json({
        success: false,
        error: 'Failed to fetch conversations',
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
      const currentUserId = req.user.id;
      const otherUserId = req.params.otherUserId;
      
      logger.info(`[CHAT] POST /conversations/direct - Current user: ${currentUserId}, Other user: ${otherUserId}`);
      
      if (otherUserId === currentUserId) {
        return res.status(400).json({
          success: false,
          message: 'Cannot create conversation with yourself'
        });
      }

      const conversation = await chatService.getOrCreateDirectConversation(
        currentUserId,
        otherUserId
      );

      if (!conversation) {
        logger.error('[CHAT] Conversation is null or undefined');
        return res.status(500).json({
          success: false,
          message: 'Failed to create or retrieve conversation'
        });
      }

      logger.info(`[CHAT] Conversation created/retrieved: ${conversation._id}`);
      
      res.status(201).json({
        success: true,
        data: conversation
      });
    } catch (error) {
      logger.error('[CHAT] Error in POST /conversations/direct:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to get or create conversation'
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

/**
 * @route DELETE /api/chat/conversations/:conversationId
 * @desc Delete a group conversation
 * @access Private (Group owner only)
 */
router.delete(
  '/conversations/:conversationId',
  authMiddleware,
  param('conversationId').isMongoId(),
  handleValidationErrors,
  async (req, res) => {
    try {
      const userId = req.user?.id || req.user?._id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated'
        });
      }

      logger.info(`[CHAT] DELETE /conversations/${req.params.conversationId} - User: ${userId}`);

      const conversation = await chatService.deleteGroupConversation(
        req.params.conversationId,
        userId
      );

      logger.info(`[CHAT] Group conversation deleted: ${req.params.conversationId}`);

      res.json({
        success: true,
        message: 'Conversation deleted',
        data: conversation
      });
    } catch (error) {
      logger.error('Error in DELETE /conversations/:conversationId:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

/**
 * @route PUT /api/chat/conversations/:conversationId/group-info
 * @desc Update group name and avatar
 * @access Private (Group members)
 */
router.put(
  '/conversations/:conversationId/group-info',
  authMiddleware,
  param('conversationId').isMongoId(),
  body('conversationName').optional().trim(),
  body('groupAvatar').optional(),
  handleValidationErrors,
  async (req, res) => {
    try {
      const userId = req.user?.id || req.user?._id;
      const { conversationName, groupAvatar } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated'
        });
      }

      if (!conversationName && !groupAvatar) {
        return res.status(400).json({
          success: false,
          error: 'Provide either conversationName or groupAvatar'
        });
      }

      logger.info(`[CHAT] PUT /conversations/${req.params.conversationId}/group-info - User: ${userId}`);

      const conversation = await chatService.updateGroupInfo(
        req.params.conversationId,
        { conversationName, groupAvatar },
        userId
      );

      logger.info(`[CHAT] Group info updated: ${req.params.conversationId}`);

      res.json({
        success: true,
        message: 'Group info updated',
        data: conversation
      });
    } catch (error) {
      logger.error('Error in PUT /group-info:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

/**
 * @route POST /api/chat/conversations/:conversationId/messages/upload
 * @desc Upload images and create message with attachments
 * @access Private
 */
router.post(
  '/conversations/:conversationId/messages/upload',
  authMiddleware,
  (req, res, next) => {
    upload.array('images', 10)(req, res, (err) => {
      if (err) {
        logger.error(`[MULTER ERROR] ${err.message}`);
        return res.status(400).json({
          success: false,
          error: `File upload error: ${err.message}`
        });
      }
      next();
    });
  },
  param('conversationId').isMongoId(),
  async (req, res) => {
    try {
      const conversationId = req.params.conversationId;
      const userId = req.user?.id || req.user?._id;
      const { content = '' } = req.body; // Optional caption/content

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated'
        });
      }

      logger.info(`[CHAT] POST /messages/upload - User: ${userId}, Conversation: ${conversationId}`);

      // Get files from multer - req.files is an array when using .array()
      const imageFiles = req.files;
      
      if (!imageFiles || !Array.isArray(imageFiles) || imageFiles.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No images found in request'
        });
      }

      // Filter out undefined/invalid files
      const validFiles = imageFiles.filter(file => file && file.buffer && file.buffer.length > 0);

      if (validFiles.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No valid image files to upload'
        });
      }

      // Upload to Cloudinary and collect URLs
      const cloudinaryUtils = require('../utils/cloudinary');
      const { getProxyUrl } = cloudinaryUtils;
      const attachments = [];

      for (const file of validFiles) {
        try {
          const result = await new Promise((resolve, reject) => {
            const stream = cloudinaryUtils.cloudinary.uploader.upload_stream(
              {
                resource_type: 'auto',
                folder: 'zarrin_chat',
                quality: 'auto',
                fetch_format: 'auto'
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            );
            stream.end(file.buffer);
          });

          // Use proxy URL to avoid tracking prevention warnings
          const proxyUrl = getProxyUrl(result.secure_url);

          // Store just the URL, like how blog stores images
          attachments.push(proxyUrl);

          logger.info(`[CHAT] Image uploaded: ${result.public_id}`);
        } catch (error) {
          logger.error(`[CHAT] Failed to upload image:`, { 
            filename: file?.name || 'unknown',
            error: error.message 
          });
          // Continue with other files
        }
      }

      if (attachments.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Failed to upload any images'
        });
      }

      // Create message with attachments using chatService
      const message = await chatService.sendMessage(
        conversationId,
        userId,
        content || `Shared ${attachments.length} image(s)`,
        'image',
        attachments
      );

      logger.info(`[CHAT] Message created with attachments: ${message._id}`);

      // Broadcast to Socket.IO room
      const roomName = `conversation_${conversationId}`;
      const ioInstance = req.app.get('io');
      if (ioInstance) {
        ioInstance.of('/chat').to(roomName).emit('newMessage', {
          _id: message._id,
          conversationId,
          senderId: message.senderId,
          content: message.content,
          messageType: message.messageType,
          attachments: message.attachments,
          createdAt: message.createdAt,
          readBy: []
        });
      }

      res.json({
        success: true,
        message: {
          _id: message._id,
          conversationId,
          senderId: message.senderId,
          content: message.content,
          messageType: message.messageType,
          attachments: message.attachments,
          createdAt: message.createdAt,
          readBy: []
        },
        count: attachments.length
      });
    } catch (error) {
      logger.error('Error in POST /messages/upload:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to upload images'
      });
    }
  }
);

module.exports = router;
