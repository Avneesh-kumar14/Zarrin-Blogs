// File: Zarrin_server/routes/calls.js

const express = require('express');
const router = express.Router();
const { param, query, validationResult } = require('express-validator');
const { auth: authMiddleware } = require('../middleware/auth');
const callService = require('../services/callService');
const logger = require('../utils/logger');

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
 * @route GET /api/calls/history/:conversationId
 * @desc Get call history for a conversation
 * @access Private
 */
router.get(
  '/history/:conversationId',
  authMiddleware,
  param('conversationId').isMongoId(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { conversationId } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;

      logger.info(`[CALLS] GET /history/:conversationId - Conversation: ${conversationId}`);

      const result = await callService.getCallHistory(conversationId, limit, page);

      res.json({
        success: true,
        data: result.calls,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          pages: result.pages
        }
      });
    } catch (error) {
      logger.error('[CALLS] Error in GET /history:', error.message);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

/**
 * @route GET /api/calls/stats/user
 * @desc Get call statistics for authenticated user
 * @access Private
 */
router.get(
  '/stats/user',
  authMiddleware,
  query('period').optional().isIn(['week', 'month', 'year']),
  handleValidationErrors,
  async (req, res) => {
    try {
      const userId = req.user?.id || req.user?._id;
      const period = req.query.period || 'month';

      logger.info(`[CALLS] GET /stats/user - User: ${userId}, Period: ${period}`);

      const stats = await callService.getUserCallStats(userId, period);

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      logger.error('[CALLS] Error in GET /stats/user:', error.message);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

/**
 * @route GET /api/calls/stats/conversation/:conversationId
 * @desc Get call statistics for a conversation
 * @access Private
 */
router.get(
  '/stats/conversation/:conversationId',
  authMiddleware,
  param('conversationId').isMongoId(),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { conversationId } = req.params;

      logger.info(`[CALLS] GET /stats/conversation - Conversation: ${conversationId}`);

      const stats = await callService.getConversationCallStats(conversationId);

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      logger.error('[CALLS] Error in GET /stats/conversation:', error.message);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

/**
 * @route GET /api/calls/:callId
 * @desc Get specific call details
 * @access Private
 */
router.get(
  '/:callId',
  authMiddleware,
  param('callId').isMongoId(),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { callId } = req.params;

      logger.info(`[CALLS] GET /:callId - Call: ${callId}`);

      const CallLog = require('../models/callLog');
      const call = await CallLog.findById(callId)
        .populate('initiatorId', 'name username profileImage')
        .populate('recipientId', 'name username profileImage')
        .lean();

      if (!call) {
        return res.status(404).json({
          success: false,
          error: 'Call not found'
        });
      }

      res.json({
        success: true,
        data: call
      });
    } catch (error) {
      logger.error('[CALLS] Error in GET /:callId:', error.message);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

/**
 * @route DELETE /api/calls/:callId
 * @desc Delete call log (Admin/User)
 * @access Private
 */
router.delete(
  '/:callId',
  authMiddleware,
  param('callId').isMongoId(),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { callId } = req.params;
      const userId = req.user?.id || req.user?._id;

      logger.info(`[CALLS] DELETE /:callId - Call: ${callId}, User: ${userId}`);

      const CallLog = require('../models/callLog');
      const call = await CallLog.findById(callId);

      if (!call) {
        return res.status(404).json({
          success: false,
          error: 'Call not found'
        });
      }

      // Check authorization (user can only delete their own calls)
      if (call.initiatorId.toString() !== userId && call.recipientId.toString() !== userId) {
        return res.status(403).json({
          success: false,
          error: 'Unauthorized to delete this call'
        });
      }

      await callService.deleteCall(callId);

      res.json({
        success: true,
        message: 'Call log deleted successfully'
      });
    } catch (error) {
      logger.error('[CALLS] Error in DELETE /:callId:', error.message);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

module.exports = router;
