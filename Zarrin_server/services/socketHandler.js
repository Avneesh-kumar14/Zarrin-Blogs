const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const chatService = require('./chatService');

// Store active connections
const activeUsers = new Map(); // userId -> Set of socket IDs
const socketToUser = new Map(); // socketId -> userId

class SocketHandler {
  constructor(io) {
    this.io = io;
    this.setupNamespaces();
  }

  setupNamespaces() {
    // Main chat namespace
    this.io.of('/chat').use(this.authMiddleware.bind(this)).on('connection', (socket) => {
      this.handleConnection(socket);
    });
  }

  /**
   * Authentication middleware for Socket.IO
   */
  authMiddleware(socket, next) {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Authentication token required'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      socket.userId = decoded.id;
      socket.username = decoded.username;

      next();
    } catch (error) {
      logger.error('Socket auth error:', error);
      next(new Error('Invalid token'));
    }
  }

  /**
   * Handle socket connection
   */
  handleConnection(socket) {
    const userId = socket.userId;
    logger.info(`User connected: ${userId} (Socket: ${socket.id})`);

    // Track active users
    if (!activeUsers.has(userId)) {
      activeUsers.set(userId, new Set());
    }
    activeUsers.get(userId).add(socket.id);
    socketToUser.set(socket.id, userId);

    // Broadcast user online status
    socket.broadcast.emit('userOnline', {
      userId,
      username: socket.username,
      timestamp: new Date()
    });

    // Setup event listeners
    this.setupEventListeners(socket);

    // Handle disconnect
    socket.on('disconnect', () => {
      this.handleDisconnect(socket);
    });
  }

  /**
   * Handle socket disconnection
   */
  handleDisconnect(socket) {
    const userId = socket.userId;
    logger.info(`User disconnected: ${userId} (Socket: ${socket.id})`);

    // Remove socket from active users
    if (activeUsers.has(userId)) {
      activeUsers.get(userId).delete(socket.id);
      if (activeUsers.get(userId).size === 0) {
        activeUsers.delete(userId);
        
        // Broadcast user offline status
        socket.broadcast.emit('userOffline', {
          userId,
          timestamp: new Date()
        });
      }
    }

    socketToUser.delete(socket.id);
  }

  /**
   * Setup all event listeners
   */
  setupEventListeners(socket) {
    // Join conversation room
    socket.on('joinConversation', (data) => {
      this.handleJoinConversation(socket, data);
    });

    // Leave conversation room
    socket.on('leaveConversation', (data) => {
      this.handleLeaveConversation(socket, data);
    });

    // Send message
    socket.on('sendMessage', (data) => {
      this.handleSendMessage(socket, data);
    });

    // Typing indicator
    socket.on('userTyping', (data) => {
      this.handleUserTyping(socket, data);
    });

    // Stop typing
    socket.on('userStoppedTyping', (data) => {
      this.handleUserStoppedTyping(socket, data);
    });

    // Mark as read
    socket.on('markAsRead', (data) => {
      this.handleMarkAsRead(socket, data);
    });

    // Delete message
    socket.on('deleteMessage', (data) => {
      this.handleDeleteMessage(socket, data);
    });

    // Edit message
    socket.on('editMessage', (data) => {
      this.handleEditMessage(socket, data);
    });

    // Add reaction
    socket.on('addReaction', (data) => {
      this.handleAddReaction(socket, data);
    });

    // Member joined group
    socket.on('memberJoined', (data) => {
      this.handleMemberJoined(socket, data);
    });

    // Member left group
    socket.on('memberLeft', (data) => {
      this.handleMemberLeft(socket, data);
    });

    // Call initiated
    socket.on('initiateCall', (data) => {
      this.handleInitiateCall(socket, data);
    });

    // Call ended
    socket.on('endCall', (data) => {
      this.handleEndCall(socket, data);
    });
  }

  /**
   * Handle joining a conversation room
   */
  async handleJoinConversation(socket, { conversationId }) {
    try {
      const roomName = `conversation_${conversationId}`;
      socket.join(roomName);

      // Update user activity
      await chatService.updateUserActivity(socket.userId, conversationId, 'online');

      logger.info(`User ${socket.userId} joined conversation ${conversationId}`);

      // Notify others in the room
      socket.to(roomName).emit('userJoinedConversation', {
        userId: socket.userId,
        username: socket.username,
        conversationId,
        timestamp: new Date()
      });
    } catch (error) {
      logger.error('Error in handleJoinConversation:', error);
      socket.emit('error', { message: 'Failed to join conversation' });
    }
  }

  /**
   * Handle leaving a conversation room
   */
  async handleLeaveConversation(socket, { conversationId }) {
    try {
      const roomName = `conversation_${conversationId}`;
      socket.leave(roomName);

      // Clear typing indicator
      await chatService.updateUserActivity(socket.userId, conversationId, 'typing', 0);

      logger.info(`User ${socket.userId} left conversation ${conversationId}`);

      // Notify others in the room
      socket.to(roomName).emit('userLeftConversation', {
        userId: socket.userId,
        conversationId,
        timestamp: new Date()
      });
    } catch (error) {
      logger.error('Error in handleLeaveConversation:', error);
    }
  }

  /**
   * Handle sending a message
   */
  async handleSendMessage(socket, { conversationId, content, attachments = [], messageType = 'text' }) {
    try {
      if (!content.trim() && attachments.length === 0) {
        socket.emit('error', { message: 'Message content cannot be empty' });
        return;
      }

      // Save message to database
      const message = await chatService.sendMessage(
        conversationId,
        socket.userId,
        content,
        messageType,
        attachments
      );

      const roomName = `conversation_${conversationId}`;

      // Broadcast message to all in the room
      this.io.of('/chat').to(roomName).emit('newMessage', {
        _id: message._id,
        conversationId,
        senderId: message.senderId,
        content: message.content,
        messageType: message.messageType,
        attachments: message.attachments,
        createdAt: message.createdAt,
        readBy: []
      });

      logger.info(`Message sent in conversation ${conversationId} by ${socket.userId}`);
    } catch (error) {
      logger.error('Error in handleSendMessage:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  }

  /**
   * Handle user typing indicator
   */
  async handleUserTyping(socket, { conversationId, characterCount = 0 }) {
    try {
      await chatService.updateUserActivity(socket.userId, conversationId, 'typing', characterCount);

      const roomName = `conversation_${conversationId}`;

      socket.to(roomName).emit('userIsTyping', {
        userId: socket.userId,
        username: socket.username,
        conversationId,
        timestamp: new Date()
      });
    } catch (error) {
      logger.error('Error in handleUserTyping:', error);
    }
  }

  /**
   * Handle user stopped typing
   */
  async handleUserStoppedTyping(socket, { conversationId }) {
    try {
      await chatService.updateUserActivity(socket.userId, conversationId, 'typing', 0);

      const roomName = `conversation_${conversationId}`;

      socket.to(roomName).emit('userStoppedTyping', {
        userId: socket.userId,
        conversationId,
        timestamp: new Date()
      });
    } catch (error) {
      logger.error('Error in handleUserStoppedTyping:', error);
    }
  }

  /**
   * Handle marking messages as read
   */
  async handleMarkAsRead(socket, { conversationId }) {
    try {
      await chatService.markMessagesAsRead(conversationId, socket.userId);

      const roomName = `conversation_${conversationId}`;

      socket.to(roomName).emit('messagesRead', {
        userId: socket.userId,
        conversationId,
        timestamp: new Date()
      });
    } catch (error) {
      logger.error('Error in handleMarkAsRead:', error);
    }
  }

  /**
   * Handle deleting a message
   */
  async handleDeleteMessage(socket, { conversationId, messageId }) {
    try {
      const message = await chatService.deleteMessage(messageId, socket.userId);

      const roomName = `conversation_${conversationId}`;

      this.io.of('/chat').to(roomName).emit('messageDeleted', {
        conversationId,
        messageId,
        timestamp: new Date()
      });
    } catch (error) {
      logger.error('Error in handleDeleteMessage:', error);
      socket.emit('error', { message: error.message });
    }
  }

  /**
   * Handle editing a message
   */
  async handleEditMessage(socket, { conversationId, messageId, newContent }) {
    try {
      const message = await chatService.editMessage(messageId, socket.userId, newContent);

      const roomName = `conversation_${conversationId}`;

      this.io.of('/chat').to(roomName).emit('messageEdited', {
        conversationId,
        messageId,
        content: newContent,
        editHistory: message.editHistory,
        timestamp: new Date()
      });
    } catch (error) {
      logger.error('Error in handleEditMessage:', error);
      socket.emit('error', { message: error.message });
    }
  }

  /**
   * Handle adding reaction
   */
  async handleAddReaction(socket, { conversationId, messageId, emoji }) {
    try {
      const message = await chatService.addReaction(messageId, socket.userId, emoji);

      const roomName = `conversation_${conversationId}`;

      this.io.of('/chat').to(roomName).emit('reactionAdded', {
        conversationId,
        messageId,
        reactions: message.reactions,
        timestamp: new Date()
      });
    } catch (error) {
      logger.error('Error in handleAddReaction:', error);
      socket.emit('error', { message: error.message });
    }
  }

  /**
   * Handle member joined group
   */
  async handleMemberJoined(socket, { conversationId, newMemberId }) {
    try {
      const roomName = `conversation_${conversationId}`;

      this.io.of('/chat').to(roomName).emit('memberJoinedGroup', {
        conversationId,
        newMemberId,
        timestamp: new Date()
      });
    } catch (error) {
      logger.error('Error in handleMemberJoined:', error);
    }
  }

  /**
   * Handle member left group
   */
  async handleMemberLeft(socket, { conversationId, memberId }) {
    try {
      const roomName = `conversation_${conversationId}`;

      this.io.of('/chat').to(roomName).emit('memberLeftGroup', {
        conversationId,
        memberId,
        timestamp: new Date()
      });
    } catch (error) {
      logger.error('Error in handleMemberLeft:', error);
    }
  }

  /**
   * Handle call initiated
   */
  async handleInitiateCall(socket, { conversationId, callType = 'audio' }) {
    try {
      const roomName = `conversation_${conversationId}`;

      socket.to(roomName).emit('incomingCall', {
        callerId: socket.userId,
        callerName: socket.username,
        conversationId,
        callType,
        timestamp: new Date()
      });

      await chatService.updateUserActivity(socket.userId, conversationId, 'calling');
    } catch (error) {
      logger.error('Error in handleInitiateCall:', error);
      socket.emit('error', { message: 'Failed to initiate call' });
    }
  }

  /**
   * Handle call ended
   */
  async handleEndCall(socket, { conversationId }) {
    try {
      const roomName = `conversation_${conversationId}`;

      this.io.of('/chat').to(roomName).emit('callEnded', {
        conversationId,
        timestamp: new Date()
      });

      // Clear activity
      await chatService.updateUserActivity(socket.userId, conversationId, 'calling');
    } catch (error) {
      logger.error('Error in handleEndCall:', error);
    }
  }

  /**
   * Get online users in a conversation
   */
  async getOnlineUsersInConversation(conversationId) {
    const onlineUsers = [];
    const activities = await chatService.getActiveUsers(conversationId);

    activities.forEach(activity => {
      if (activeUsers.has(activity.userId.toString())) {
        onlineUsers.push({
          userId: activity.userId,
          username: activity.userId.username,
          status: activity.activityType
        });
      }
    });

    return onlineUsers;
  }
}

module.exports = SocketHandler;
