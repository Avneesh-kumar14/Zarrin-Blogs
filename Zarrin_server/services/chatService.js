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
      // Find existing conversation
      let conversation = await Conversation.findOne({
        conversationType: 'direct',
        participants: { $all: [userId1, userId2] }
      }).populate('participants', 'name username email');

      // If not found, create new conversation
      if (!conversation) {
        conversation = new Conversation({
          participants: [userId1, userId2],
          conversationType: 'direct'
        });
        await conversation.save();
        await conversation.populate('participants', 'name username email');
      }

      return conversation;
    } catch (error) {
      logger.error('Error in getOrCreateDirectConversation:', error);
      throw new Error('Failed to get or create conversation');
    }
  }

  /**
   * Create a group conversation
   */
  async createGroupConversation(creatorId, participantIds, conversationName, groupAvatar = null) {
    try {
      // Ensure creator is included in participants
      const allParticipants = Array.from(new Set([creatorId, ...participantIds]));

      const conversation = new Conversation({
        participants: allParticipants,
        conversationType: 'group',
        conversationName,
        createdBy: creatorId,
        groupAvatar
      });

      await conversation.save();
      await conversation.populate('participants', 'name username email');

      // Create system message
      await this.createSystemMessage(
        conversation._id,
        `${conversationName} group created`
      );

      return conversation;
    } catch (error) {
      logger.error('Error in createGroupConversation:', error);
      throw new Error('Failed to create group conversation');
    }
  }

  /**
   * Get user's conversations with pagination
   */
  async getUserConversations(userId, page = 1, limit = 20) {
    try {
      const skip = (page - 1) * limit;

      const conversations = await Conversation.find({
        participants: userId,
        archivedBy: { $ne: userId }
      })
        .populate('participants', 'name username email')
        .populate('lastMessage')
        .sort({ lastMessageTime: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Conversation.countDocuments({
        participants: userId,
        archivedBy: { $ne: userId }
      });

      return {
        conversations,
        total,
        pages: Math.ceil(total / limit)
      };
    } catch (error) {
      logger.error('Error in getUserConversations:', error);
      throw new Error('Failed to fetch conversations');
    }
  }

  /**
   * Send a message
   */
  async sendMessage(conversationId, senderId, content, messageType = 'text', attachments = []) {
    try {
      // Verify user is participant in conversation
      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        throw new Error('Conversation not found');
      }

      const isParticipant = conversation.participants.some(id => id.toString() === senderId.toString());
      if (!isParticipant) {
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

      await message.save();
      await message.populate('senderId', 'name username email');

      // Update conversation's last message
      conversation.lastMessage = message._id;
      conversation.lastMessagePreview = content.substring(0, 50);
      conversation.lastMessageTime = new Date();
      await conversation.save();

      return message;
    } catch (error) {
      logger.error('Error in sendMessage:', error);
      throw new Error('Failed to send message');
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
   * Delete a message (soft delete)
   */
  async deleteMessage(messageId, userId) {
    try {
      const message = await Message.findById(messageId);

      if (!message) {
        throw new Error('Message not found');
      }

      // Only sender or admin can delete
      if (message.senderId.toString() !== userId.toString()) {
        throw new Error('Not authorized to delete this message');
      }

      message.isDeleted = true;
      message.deletedBy = userId;
      message.content = '[Message deleted]';
      await message.save();

      return message;
    } catch (error) {
      logger.error('Error in deleteMessage:', error);
      throw new Error('Failed to delete message');
    }
  }

  /**
   * Edit a message
   */
  async editMessage(messageId, userId, newContent) {
    try {
      const message = await Message.findById(messageId);

      if (!message) {
        throw new Error('Message not found');
      }

      // Only sender can edit
      if (message.senderId.toString() !== userId.toString()) {
        throw new Error('Not authorized to edit this message');
      }

      // Add to edit history
      message.editHistory.push({
        content: message.content,
        editedAt: new Date()
      });

      message.content = newContent;
      await message.save();

      return message;
    } catch (error) {
      logger.error('Error in editMessage:', error);
      throw new Error('Failed to edit message');
    }
  }

  /**
   * Add reaction to message
   */
  async addReaction(messageId, userId, emoji) {
    try {
      const message = await Message.findById(messageId);

      if (!message) {
        throw new Error('Message not found');
      }

      // Find or create reaction
      let reaction = message.reactions.find(r => r.emoji === emoji);

      if (!reaction) {
        reaction = { emoji, users: [] };
        message.reactions.push(reaction);
      }

      // Check if user already reacted
      const userIndex = reaction.users.findIndex(id => id.toString() === userId.toString());

      if (userIndex > -1) {
        // Remove reaction if already exists
        reaction.users.splice(userIndex, 1);
        if (reaction.users.length === 0) {
          message.reactions = message.reactions.filter(r => r.emoji !== emoji);
        }
      } else {
        // Add reaction
        reaction.users.push(userId);
      }

      await message.save();
      return message;
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
}

module.exports = new ChatService();
