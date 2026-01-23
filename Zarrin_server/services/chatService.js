const Conversation = require('../models/conversation');
const Message = require('../models/message');
const ChatActivity = require('../models/chatActivity');
const User = require('../models/userModel');
const logger = require('../utils/logger');

class ChatService {
  /**
   * Get or create a direct conversation between two users
   */
  async getOrCreateDirectConversation(userId1, userId2) {
    try {
      logger.info(`[ChatService] Getting or creating direct conversation between ${userId1} and ${userId2}`);
      
      // Validate user IDs
      if (!userId1 || !userId2) {
        const error = new Error('Both user IDs are required');
        logger.error('[ChatService] Validation failed:', error.message);
        throw error;
      }

      // Validate users exist in database
      const user1 = await User.findById(userId1);
      const user2 = await User.findById(userId2);
      
      if (!user1 || !user2) {
        const error = new Error('One or both users do not exist');
        logger.error('[ChatService] User validation failed:', { userId1: !!user1, userId2: !!user2 });
        throw error;
      }

      // Find existing conversation
      let conversation = await Conversation.findOne({
        conversationType: 'direct',
        participants: { $all: [userId1, userId2] }
      })
      .populate('participants', 'name username email profileImage')
      .populate('lastMessage')
      .exec();

      if (conversation) {
        logger.info(`[ChatService] Existing conversation found: ${conversation._id}`);
        // Safely populate with error handling
        try {
          await conversation.populate('participants', 'name username email profileImage');
        } catch (err) {
          logger.warn('[ChatService] Could not populate participants:', err.message);
          // Return without populated data if populate fails
        }
        return conversation;
      }

      // If not found, create new conversation
      logger.info(`[ChatService] Creating new direct conversation`);
      conversation = new Conversation({
        participants: [userId1, userId2],
        conversationType: 'direct',
        lastMessageTime: new Date()
      });
      
      await conversation.save();
      logger.info(`[ChatService] New conversation saved: ${conversation._id}`);
      
      // Populate participants with error handling
      try {
        await conversation.populate('participants', 'name username email profileImage');
        logger.info(`[ChatService] Populated conversation with participants`);
      } catch (err) {
        logger.warn('[ChatService] Could not populate participants:', err.message);
        // Return conversation data even if populate fails
      }

      return conversation;
    } catch (error) {
      logger.error('[ChatService] Error in getOrCreateDirectConversation:', {
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  /**
   * Create a group conversation
   */
  async createGroupConversation(creatorId, participantIds, conversationName, groupAvatar = null) {
    try {
      logger.info(`[ChatService] Creating group conversation: ${conversationName} by ${creatorId}`);
      
      // Ensure creator is included in participants
      const allParticipants = Array.from(new Set([creatorId, ...participantIds]));
      logger.info(`[ChatService] Total participants: ${allParticipants.length}`);

      const conversation = new Conversation({
        participants: allParticipants,
        conversationType: 'group',
        conversationName,
        createdBy: creatorId,
        groupAvatar,
        lastMessageTime: new Date()
      });

      await conversation.save();
      logger.info(`[ChatService] Group conversation saved: ${conversation._id}`);
      
      try {
        await conversation.populate('participants', 'name username email');
        logger.info(`[ChatService] Group participants populated`);
      } catch (err) {
        logger.warn('[ChatService] Could not populate group participants:', err.message);
      }

      // Create system message
      await this.createSystemMessage(
        conversation._id,
        `${conversationName} group created`
      );

      logger.info(`[ChatService] Group conversation created successfully: ${conversation._id}`);
      return conversation;
    } catch (error) {
      logger.error('[ChatService] Error in createGroupConversation:', error);
      throw error;
    }
  }

  /**
   * Get user's conversations with pagination
   */
  async getUserConversations(userId, page = 1, limit = 20) {
    try {
      const skip = (page - 1) * limit;
      logger.info(`[ChatService] getUserConversations - userId: ${userId}, page: ${page}, limit: ${limit}`);

      // Validate userId is a valid ObjectId
      if (!userId || typeof userId !== 'string' || userId.length !== 24) {
        throw new Error('Invalid user ID format');
      }

      // Query without populate first to avoid schema registration issues
      let query = Conversation.find({
        participants: userId,
        archivedBy: { $ne: userId }
      })
        .sort({ lastMessageTime: -1 })
        .skip(skip)
        .limit(limit);

      // Try to populate, but don't fail if it doesn't work
      try {
        query = query
          .populate({
            path: 'participants',
            select: 'name username email profileImage'
          })
          .populate({
            path: 'lastMessage',
            select: 'content createdAt'
          });
      } catch (err) {
        logger.warn('[ChatService] Could not set up population:', err.message);
      }

      const conversations = await query.exec();

      const total = await Conversation.countDocuments({
        participants: userId,
        archivedBy: { $ne: userId }
      });

      logger.info(`[ChatService] Found ${conversations.length} conversations, total: ${total}`);

      return {
        conversations,
        total,
        pages: Math.ceil(total / limit)
      };
    } catch (error) {
      logger.error('[ChatService] Error in getUserConversations:', {
        message: error.message,
        stack: error.stack,
        userId
      });
      throw new Error(`Failed to fetch conversations: ${error.message}`);
    }
  }

  /**
   * Send a message
   */
  async sendMessage(conversationId, senderId, content, messageType = 'text', attachments = []) {
    try {
      logger.info(`[ChatService] Sending message to conversation: ${conversationId}, from user: ${senderId}`);
      logger.info(`[ChatService] Message type: ${messageType}, Attachments count: ${attachments.length}`);
      logger.info(`[ChatService] Attachments data:`, JSON.stringify(attachments));
      
      // Verify user is participant in conversation
      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        logger.error('[ChatService] Conversation not found:', conversationId);
        throw new Error('Conversation not found');
      }

      const isParticipant = conversation.participants.some(id => id.toString() === senderId.toString());
      if (!isParticipant) {
        logger.error('[ChatService] User not authorized to send message:', senderId);
        throw new Error('Not authorized to send message in this conversation');
      }

      // Create message
      const message = new Message({
        conversationId,
        senderId,
        content,
        messageType,
        attachments: messageType === 'image' || messageType === 'file' ? attachments : []
      });

      logger.info(`[ChatService] Message object before save:`, JSON.stringify(message));

      await message.save();
      logger.info(`[ChatService] Message saved: ${message._id}`);
      
      await message.populate('senderId', 'name username email');

      // Update conversation's last message
      conversation.lastMessage = message._id;
      conversation.lastMessagePreview = content.substring(0, 50);
      conversation.lastMessageTime = new Date();
      await conversation.save();
      logger.info(`[ChatService] Conversation updated with latest message`);

      return message;
    } catch (error) {
      logger.error('[ChatService] Error in sendMessage:', error);
      throw error;
    }
  }

  /**
   * Get messages for a conversation with pagination
   */
  async getConversationMessages(conversationId, page = 1, limit = 30) {
    try {
      const skip = (page - 1) * limit;

      const messages = await Message.find({
        conversationId,
        isDeleted: false
      })
        .populate('senderId', 'name username email')
        .populate('replyTo')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Message.countDocuments({
        conversationId,
        isDeleted: false
      });

      return {
        messages: messages.reverse(), // Reverse to show chronological order
        total,
        pages: Math.ceil(total / limit)
      };
    } catch (error) {
      logger.error('Error in getConversationMessages:', error);
      throw new Error('Failed to fetch messages');
    }
  }

  /**
   * Mark messages as read
   */
  async markMessagesAsRead(conversationId, userId) {
    try {
      const result = await Message.updateMany(
        {
          conversationId,
          isDeleted: false,
          'readBy.userId': { $ne: userId }
        },
        {
          $push: {
            readBy: {
              userId,
              readAt: new Date()
            }
          }
        }
      );

      return result;
    } catch (error) {
      logger.error('Error in markMessagesAsRead:', error);
      throw new Error('Failed to mark messages as read');
    }
  }

  /**
   * Get unread message count for a conversation
   */
  async getUnreadCount(conversationId, userId) {
    try {
      const count = await Message.countDocuments({
        conversationId,
        isDeleted: false,
        'readBy.userId': { $ne: userId }
      });

      return count;
    } catch (error) {
      logger.error('Error in getUnreadCount:', error);
      throw new Error('Failed to get unread count');
    }
  }

  /**
   * Delete a message (soft delete) - Atomic operation
   */
  async deleteMessage(messageId, userId) {
    try {
      // First verify authorization (only sender can delete)
      const message = await Message.findById(messageId);

      if (!message) {
        throw new Error('Message not found');
      }

      // Only sender can delete
      if (message.senderId.toString() !== userId.toString()) {
        throw new Error('Not authorized to delete this message');
      }

      // Use atomic updateOne for fast deletion without loading entire document
      const result = await Message.updateOne(
        { _id: messageId },
        {
          $set: {
            isDeleted: true,
            deletedBy: userId,
            content: '[Message deleted]'
          }
        }
      );

      if (result.modifiedCount === 0) {
        throw new Error('Failed to delete message');
      }

      // Return updated message for Socket.IO broadcast
      return await Message.findById(messageId);
    } catch (error) {
      logger.error('Error in deleteMessage:', error);
      throw new Error('Failed to delete message');
    }
  }

  /**
   * Edit a message - Atomic operation
   */
  async editMessage(messageId, userId, newContent) {
    try {
      // First verify authorization (only sender can edit)
      const message = await Message.findById(messageId);

      if (!message) {
        throw new Error('Message not found');
      }

      // Only sender can edit
      if (message.senderId.toString() !== userId.toString()) {
        throw new Error('Not authorized to edit this message');
      }

      // Use atomic update to add to history and update content
      const result = await Message.updateOne(
        { _id: messageId },
        {
          $push: {
            editHistory: {
              content: message.content,
              editedAt: new Date()
            }
          },
          $set: {
            content: newContent
          }
        }
      );

      if (result.modifiedCount === 0) {
        throw new Error('Failed to edit message');
      }

      // Return updated message for Socket.IO broadcast
      return await Message.findById(messageId);
    } catch (error) {
      logger.error('Error in editMessage:', error);
      throw new Error('Failed to edit message');
    }
  }

  /**
   * Add reaction to message - Atomic operation using MongoDB operators
   */
  async addReaction(messageId, userId, emoji) {
    try {
      if (!emoji || emoji.trim() === '') {
        throw new Error('Invalid emoji');
      }

      const message = await Message.findById(messageId);

      if (!message) {
        throw new Error('Message not found');
      }

      // Check if user already has this reaction
      const existingReaction = message.reactions.find(r => r.emoji === emoji);
      
      if (existingReaction) {
        const userAlreadyReacted = existingReaction.users.some(id => id.toString() === userId.toString());

        if (userAlreadyReacted) {
          // Remove reaction - use atomic $pull operator
          const result = await Message.updateOne(
            { _id: messageId },
            {
              $pull: {
                'reactions.$[elem].users': userId
              }
            },
            {
              arrayFilters: [{ 'elem.emoji': emoji }]
            }
          );

          if (result.modifiedCount === 0) {
            throw new Error('Failed to remove reaction');
          }

          // Also remove the reaction object if it has no users
          await Message.updateOne(
            { _id: messageId },
            {
              $pull: {
                reactions: { emoji: emoji, users: [] }
              }
            }
          );
        } else {
          // Add user to existing reaction - use atomic $push operator
          const result = await Message.updateOne(
            { _id: messageId },
            {
              $push: {
                'reactions.$[elem].users': userId
              }
            },
            {
              arrayFilters: [{ 'elem.emoji': emoji }]
            }
          );

          if (result.modifiedCount === 0) {
            throw new Error('Failed to add reaction');
          }
        }
      } else {
        // Create new reaction - use atomic $push operator
        const result = await Message.updateOne(
          { _id: messageId },
          {
            $push: {
              reactions: {
                emoji: emoji,
                users: [userId]
              }
            }
          }
        );

        if (result.modifiedCount === 0) {
          throw new Error('Failed to add reaction');
        }
      }

      // Return updated message for Socket.IO broadcast
      return await Message.findById(messageId);
    } catch (error) {
      logger.error('Error in addReaction:', error);
      throw new Error('Failed to add reaction');
    }
  }

  /**
   * Track user activity (typing, online, etc.)
   */
  async updateUserActivity(userId, conversationId, activityType, characterCount = 0) {
    try {
      await ChatActivity.findOneAndUpdate(
        {
          userId,
          conversationId,
          activityType
        },
        {
          userId,
          conversationId,
          activityType,
          characterCount,
          timestamp: new Date()
        },
        {
          upsert: true,
          new: true
        }
      );
    } catch (error) {
      logger.error('Error in updateUserActivity:', error);
      throw new Error('Failed to update user activity');
    }
  }

  /**
   * Get active users in conversation
   */
  async getActiveUsers(conversationId) {
    try {
      const activities = await ChatActivity.find({
        conversationId,
        activityType: { $in: ['typing', 'online'] }
      }).populate('userId', 'name username email');

      return activities;
    } catch (error) {
      logger.error('Error in getActiveUsers:', error);
      throw new Error('Failed to get active users');
    }
  }

  /**
   * Add member to group conversation
   */
  async addGroupMember(conversationId, newUserId, adminId) {
    try {
      const conversation = await Conversation.findById(conversationId);

      if (!conversation) {
        throw new Error('Conversation not found');
      }

      if (conversation.conversationType !== 'group') {
        throw new Error('Can only add members to group conversations');
      }

      // Check if admin is creator
      if (conversation.createdBy.toString() !== adminId.toString()) {
        throw new Error('Only group creator can add members');
      }

      // Check if user already in group
      if (conversation.participants.some(id => id.toString() === newUserId.toString())) {
        throw new Error('User already in group');
      }

      conversation.participants.push(newUserId);
      await conversation.save();

      // Create system message
      const user = await User.findById(newUserId);
      await this.createSystemMessage(
        conversationId,
        `${user.name} was added to the group`
      );

      return conversation;
    } catch (error) {
      logger.error('Error in addGroupMember:', error);
      throw new Error('Failed to add group member');
    }
  }

  /**
   * Remove member from group conversation
   */
  async removeGroupMember(conversationId, userId, adminId) {
    try {
      const conversation = await Conversation.findById(conversationId);

      if (!conversation) {
        throw new Error('Conversation not found');
      }

      if (conversation.conversationType !== 'group') {
        throw new Error('Can only remove members from group conversations');
      }

      // Check if admin is creator
      if (conversation.createdBy.toString() !== adminId.toString() && userId.toString() !== adminId.toString()) {
        throw new Error('Only group creator or the user themselves can remove members');
      }

      conversation.participants = conversation.participants.filter(
        id => id.toString() !== userId.toString()
      );
      await conversation.save();

      // Create system message
      const user = await User.findById(userId);
      await this.createSystemMessage(
        conversationId,
        `${user.name} left the group`
      );

      return conversation;
    } catch (error) {
      logger.error('Error in removeGroupMember:', error);
      throw new Error('Failed to remove group member');
    }
  }

  /**
   * Create a system message (auto-generated)
   */
  async createSystemMessage(conversationId, content) {
    try {
      const message = new Message({
        conversationId,
        senderId: null, // System message has no sender
        content,
        messageType: 'system',
        readBy: []
      });

      await message.save();

      // Update conversation
      const conversation = await Conversation.findById(conversationId);
      conversation.lastMessage = message._id;
      conversation.lastMessagePreview = content;
      conversation.lastMessageTime = new Date();
      await conversation.save();

      return message;
    } catch (error) {
      logger.error('Error in createSystemMessage:', error);
      throw new Error('Failed to create system message');
    }
  }

  /**
   * Archive conversation
   */
  async archiveConversation(conversationId, userId) {
    try {
      await Conversation.findByIdAndUpdate(
        conversationId,
        { $push: { archivedBy: userId } },
        { new: true }
      );
    } catch (error) {
      logger.error('Error in archiveConversation:', error);
      throw new Error('Failed to archive conversation');
    }
  }

  /**
   * Mute conversation
   */
  async muteConversation(conversationId, userId) {
    try {
      await Conversation.findByIdAndUpdate(
        conversationId,
        { $push: { mutedBy: userId } },
        { new: true }
      );
    } catch (error) {
      logger.error('Error in muteConversation:', error);
      throw new Error('Failed to mute conversation');
    }
  }

  /**
   * Pin conversation
   */
  async pinConversation(conversationId, userId) {
    try {
      await Conversation.findByIdAndUpdate(
        conversationId,
        { $push: { pinnedBy: userId } },
        { new: true }
      );
    } catch (error) {
      logger.error('Error in pinConversation:', error);
      throw new Error('Failed to pin conversation');
    }
  }

  /**
   * Delete a group conversation (admin only)
   */
  async deleteGroupConversation(conversationId, userId) {
    try {
      const conversation = await Conversation.findById(conversationId);

      if (!conversation) {
        throw new Error('Conversation not found');
      }

      // Only conversation creator can delete
      if (conversation.createdBy.toString() !== userId.toString()) {
        throw new Error('Only group owner can delete this conversation');
      }

      // Soft delete by marking as deleted
      conversation.isDeleted = true;
      conversation.deletedAt = new Date();
      conversation.deletedBy = userId;
      
      await conversation.save();

      logger.info(`[ChatService] Group conversation deleted: ${conversationId}`);
      return conversation;
    } catch (error) {
      logger.error('Error in deleteGroupConversation:', error);
      throw error;
    }
  }

  /**
   * Update group conversation info (name, avatar)
   */
  async updateGroupInfo(conversationId, updates, userId) {
    try {
      const conversation = await Conversation.findById(conversationId).populate('participants');

      if (!conversation) {
        throw new Error('Conversation not found');
      }

      // Check if user is a participant
      const isParticipant = conversation.participants.some(
        p => p._id.toString() === userId.toString()
      );

      if (!isParticipant) {
        throw new Error('Only conversation members can update group info');
      }

      // Update name if provided
      if (updates.conversationName) {
        conversation.conversationName = updates.conversationName;
      }

      // Update avatar if provided
      if (updates.groupAvatar) {
        conversation.groupAvatar = updates.groupAvatar;
      }

      await conversation.save();

      logger.info(`[ChatService] Group info updated: ${conversationId}`);
      return conversation;
    } catch (error) {
      logger.error('Error in updateGroupInfo:', error);
      throw error;
    }
  }
}

module.exports = new ChatService();
