// File: Zarrin_server/services/callService.js

const CallLog = require('../models/callLog');
const User = require('../models/userModel');
const Conversation = require('../models/conversation');
const logger = require('../utils/logger');

class CallService {
  /**
   * Initiate a new call
   */
  async initiateCall(initiatorId, recipientId, conversationId, callType = 'audio') {
    try {
      logger.info(`[CallService] Initiating ${callType} call from ${initiatorId} to ${recipientId}`);

      // Validate users exist
      const [initiator, recipient, conversation] = await Promise.all([
        User.findById(initiatorId),
        User.findById(recipientId),
        Conversation.findById(conversationId)
      ]);

      if (!initiator || !recipient || !conversation) {
        throw new Error('Invalid initiator, recipient, or conversation');
      }

      // Check if recipient is online (optional - can be skipped for missed calls)
      const callLog = new CallLog({
        conversationId,
        initiatorId,
        recipientId,
        callType,
        status: 'ongoing',
        startTime: new Date()
      });

      await callLog.save();
      logger.info(`[CallService] Call log created: ${callLog._id}`);

      return {
        success: true,
        callId: callLog._id,
        callType,
        initiator: {
          id: initiator._id,
          name: initiator.name,
          username: initiator.username
        },
        recipient: {
          id: recipient._id,
          name: recipient.name,
          username: recipient.username
        }
      };
    } catch (error) {
      logger.error('[CallService] Error in initiateCall:', error.message);
      throw error;
    }
  }

  /**
   * End a call and log duration
   */
  async endCall(callId, status = 'completed', endMetadata = {}) {
    try {
      logger.info(`[CallService] Ending call: ${callId}, status: ${status}`);

      const callLog = await CallLog.findById(callId);
      if (!callLog) {
        throw new Error('Call not found');
      }

      callLog.status = status;
      callLog.endTime = new Date();
      
      if (endMetadata) {
        if (endMetadata.quality) callLog.quality = endMetadata.quality;
        if (endMetadata.connectionStrength) callLog.connectionStrength = endMetadata.connectionStrength;
        if (endMetadata.initiatorLeftTime) callLog.initiatorLeftTime = endMetadata.initiatorLeftTime;
        if (endMetadata.recipientLeftTime) callLog.recipientLeftTime = endMetadata.recipientLeftTime;
      }

      await callLog.save();
      logger.info(`[CallService] Call ended: ${callId}, duration: ${callLog.duration}s`);

      return {
        success: true,
        callId: callLog._id,
        duration: callLog.duration,
        status: callLog.status
      };
    } catch (error) {
      logger.error('[CallService] Error in endCall:', error.message);
      throw error;
    }
  }

  /**
   * Get call history for a conversation
   */
  async getCallHistory(conversationId, limit = 20, page = 1) {
    try {
      logger.info(`[CallService] Getting call history for conversation: ${conversationId}`);

      const skip = (page - 1) * limit;

      const [calls, total] = await Promise.all([
        CallLog.find({ conversationId, status: { $ne: 'ongoing' } })
          .populate('initiatorId', 'name username profileImage')
          .populate('recipientId', 'name username profileImage')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        CallLog.countDocuments({ conversationId, status: { $ne: 'ongoing' } })
      ]);

      return {
        calls,
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      };
    } catch (error) {
      logger.error('[CallService] Error in getCallHistory:', error.message);
      throw error;
    }
  }

  /**
   * Get call statistics for a user
   */
  async getUserCallStats(userId, period = 'month') {
    try {
      logger.info(`[CallService] Getting call stats for user: ${userId}`);

      const startDate = this.getPeriodStartDate(period);

      const stats = await CallLog.aggregate([
        {
          $match: {
            $or: [
              { initiatorId: userId },
              { recipientId: userId }
            ],
            status: 'completed',
            startTime: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: null,
            totalCalls: { $sum: 1 },
            totalDuration: { $sum: '$duration' },
            audioCalls: {
              $sum: { $cond: [{ $eq: ['$callType', 'audio'] }, 1, 0] }
            },
            videoCalls: {
              $sum: { $cond: [{ $eq: ['$callType', 'video'] }, 1, 0] }
            },
            averageDuration: { $avg: '$duration' }
          }
        }
      ]);

      if (stats.length === 0) {
        return {
          totalCalls: 0,
          totalDuration: 0,
          audioCalls: 0,
          videoCalls: 0,
          averageDuration: 0
        };
      }

      return stats[0];
    } catch (error) {
      logger.error('[CallService] Error in getUserCallStats:', error.message);
      throw error;
    }
  }

  /**
   * Get call statistics for a conversation
   */
  async getConversationCallStats(conversationId) {
    try {
      logger.info(`[CallService] Getting call stats for conversation: ${conversationId}`);

      const stats = await CallLog.aggregate([
        {
          $match: {
            conversationId: conversationId,
            status: 'completed'
          }
        },
        {
          $group: {
            _id: null,
            totalCalls: { $sum: 1 },
            totalDuration: { $sum: '$duration' },
            audioCalls: {
              $sum: { $cond: [{ $eq: ['$callType', 'audio'] }, 1, 0] }
            },
            videoCalls: {
              $sum: { $cond: [{ $eq: ['$callType', 'video'] }, 1, 0] }
            },
            averageDuration: { $avg: '$duration' },
            averageQuality: { $avg: { $cond: [{ $eq: ['$quality', 'excellent'] }, 4, { $cond: [{ $eq: ['$quality', 'good'] }, 3, { $cond: [{ $eq: ['$quality', 'fair'] }, 2, 1] }] }] } }
          }
        }
      ]);

      if (stats.length === 0) {
        return {
          totalCalls: 0,
          totalDuration: 0,
          audioCalls: 0,
          videoCalls: 0,
          averageDuration: 0
        };
      }

      return stats[0];
    } catch (error) {
      logger.error('[CallService] Error in getConversationCallStats:', error.message);
      throw error;
    }
  }

  /**
   * Mark call as missed
   */
  async markCallAsMissed(callId) {
    try {
      logger.info(`[CallService] Marking call as missed: ${callId}`);

      const callLog = await CallLog.findByIdAndUpdate(
        callId,
        {
          status: 'missed',
          endTime: new Date()
        },
        { new: true }
      );

      return callLog;
    } catch (error) {
      logger.error('[CallService] Error in markCallAsMissed:', error.message);
      throw error;
    }
  }

  /**
   * Mark call as rejected
   */
  async rejectCall(callId, reason = null) {
    try {
      logger.info(`[CallService] Rejecting call: ${callId}`);

      const callLog = await CallLog.findByIdAndUpdate(
        callId,
        {
          status: 'rejected',
          rejectionReason: reason,
          endTime: new Date()
        },
        { new: true }
      );

      return callLog;
    } catch (error) {
      logger.error('[CallService] Error in rejectCall:', error.message);
      throw error;
    }
  }

  /**
   * Delete call log
   */
  async deleteCall(callId) {
    try {
      logger.info(`[CallService] Deleting call log: ${callId}`);

      await CallLog.findByIdAndDelete(callId);
      return { success: true };
    } catch (error) {
      logger.error('[CallService] Error in deleteCall:', error.message);
      throw error;
    }
  }

  /**
   * Helper: Get period start date
   */
  getPeriodStartDate(period) {
    const now = new Date();
    switch (period) {
      case 'week':
        return new Date(now.setDate(now.getDate() - 7));
      case 'month':
        return new Date(now.setMonth(now.getMonth() - 1));
      case 'year':
        return new Date(now.setFullYear(now.getFullYear() - 1));
      default:
        return new Date(now.setMonth(now.getMonth() - 1));
    }
  }
}

module.exports = new CallService();
