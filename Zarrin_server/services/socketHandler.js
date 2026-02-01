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
        logger.error('Socket auth error: No token provided');
        return next(new Error('Authentication token required'));
      }

      const JWT_SECRET = process.env.JWT_SECRET || 'makeityourown';
      const decoded = jwt.verify(token, JWT_SECRET);
      socket.userId = decoded.id;
      socket.username = decoded.username;
      logger.info(`Socket auth successful for user: ${decoded.id}`);

      next();
    } catch (error) {
      logger.error('Socket auth error:', error.message);
      next(new Error('Invalid token: ' + error.message));
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

    // ==================== CALL EVENTS ====================

    // Call initiation
    socket.on('callInitiate', async (data) => {
      try {
        const { recipientId, conversationId, callType, metadata } = data;
        const initiatorId = socket.userId;

        logger.info(`[SOCKET] Call initiated: ${initiatorId} -> ${recipientId}, type: ${callType}`);

        const recipientSockets = activeUsers.get(recipientId);

        if (!recipientSockets || recipientSockets.size === 0) {
          logger.warn(`[SOCKET] Recipient ${recipientId} is offline`);
          socket.emit('callFailed', {
            reason: 'Recipient is offline',
            code: 'RECIPIENT_OFFLINE'
          });
          return;
        }

        const callService = require('./callService');
        const callLog = await callService.initiateCall(
          initiatorId,
          recipientId,
          conversationId,
          callType
        );

        recipientSockets.forEach(recipientSocketId => {
          const recipientSocket = this.io.sockets.sockets.get(recipientSocketId);
          if (recipientSocket) {
            recipientSocket.emit('incomingCall', {
              callId: callLog.callId,
              initiatorId: socket.userId,
              initiatorName: socket.username,
              conversationId,
              callType,
              metadata
            });
          }
        });

        socket.emit('callInitiated', {
          callId: callLog.callId,
          status: 'ringing'
        });

      } catch (error) {
        logger.error('[SOCKET] Error in callInitiate:', error.message);
        socket.emit('callError', { message: error.message });
      }
    });

    // Call acceptance
    socket.on('callAccepted', async (data) => {
      try {
        const { callId, callerId, conversationId } = data;
        const recipientId = socket.userId;

        logger.info(`[SOCKET] Call accepted by ${recipientId}, Call ID: ${callId}`);

        const callerSockets = activeUsers.get(callerId);

        if (callerSockets && callerSockets.size > 0) {
          callerSockets.forEach(callerSocketId => {
            const callerSocket = this.io.sockets.sockets.get(callerSocketId);
            if (callerSocket) {
              callerSocket.emit('callAccepted', {
                callId,
                recipientId: socket.userId,
                recipientName: socket.username
              });
            }
          });
        }

      } catch (error) {
        logger.error('[SOCKET] Error in callAccepted:', error.message);
        socket.emit('callError', { message: error.message });
      }
    });

    // Call rejection
    socket.on('callRejected', async (data) => {
      try {
        const { callId, callerId, reason } = data;
        const recipientId = socket.userId;

        logger.info(`[SOCKET] Call rejected by ${recipientId}, reason: ${reason}`);

        const callService = require('./callService');
        await callService.rejectCall(callId, reason);

        const callerSockets = activeUsers.get(callerId);
        if (callerSockets && callerSockets.size > 0) {
          callerSockets.forEach(callerSocketId => {
            const callerSocket = this.io.sockets.sockets.get(callerSocketId);
            if (callerSocket) {
              callerSocket.emit('callRejected', {
                callId,
                reason: reason || 'Call declined by recipient'
              });
            }
          });
        }

      } catch (error) {
        logger.error('[SOCKET] Error in callRejected:', error.message);
        socket.emit('callError', { message: error.message });
      }
    });

    // WebRTC Offer
    socket.on('sendOffer', (data) => {
      try {
        const { to, offer, callId } = data;
        const from = socket.userId;

        logger.info(`[SOCKET] WebRTC Offer: ${from} -> ${to}`);

        const recipientSockets = activeUsers.get(to);
        if (recipientSockets && recipientSockets.size > 0) {
          recipientSockets.forEach(recipientSocketId => {
            const recipientSocket = this.io.sockets.sockets.get(recipientSocketId);
            if (recipientSocket) {
              recipientSocket.emit('receiveOffer', {
                offer,
                from,
                callId
              });
            }
          });
        }

      } catch (error) {
        logger.error('[SOCKET] Error in sendOffer:', error.message);
      }
    });

    // WebRTC Answer
    socket.on('sendAnswer', (data) => {
      try {
        const { to, answer, callId } = data;
        const from = socket.userId;

        logger.info(`[SOCKET] WebRTC Answer: ${from} -> ${to}`);

        const recipientSockets = activeUsers.get(to);
        if (recipientSockets && recipientSockets.size > 0) {
          recipientSockets.forEach(recipientSocketId => {
            const recipientSocket = this.io.sockets.sockets.get(recipientSocketId);
            if (recipientSocket) {
              recipientSocket.emit('receiveAnswer', {
                answer,
                from,
                callId
              });
            }
          });
        }

      } catch (error) {
        logger.error('[SOCKET] Error in sendAnswer:', error.message);
      }
    });

    // ICE Candidates
    socket.on('sendICECandidate', (data) => {
      try {
        const { to, candidate, callId } = data;
        const from = socket.userId;

        const recipientSockets = activeUsers.get(to);
        if (recipientSockets && recipientSockets.size > 0) {
          recipientSockets.forEach(recipientSocketId => {
            const recipientSocket = this.io.sockets.sockets.get(recipientSocketId);
            if (recipientSocket) {
              recipientSocket.emit('receiveICECandidate', {
                candidate,
                from,
                callId
              });
            }
          });
        }

      } catch (error) {
        logger.error('[SOCKET] Error in sendICECandidate:', error.message);
      }
    });

    // Call end
    socket.on('endCall', async (data) => {
      try {
        const { callId, otherId, duration, quality } = data;
        const userId = socket.userId;

        logger.info(`[SOCKET] Call ended by ${userId}, Duration: ${duration}s`);

        const callService = require('./callService');
        await callService.endCall(callId, 'completed', { quality });

        if (otherId) {
          const otherSockets = activeUsers.get(otherId);
          if (otherSockets && otherSockets.size > 0) {
            otherSockets.forEach(otherSocketId => {
              const otherSocket = this.io.sockets.sockets.get(otherSocketId);
              if (otherSocket) {
                otherSocket.emit('callEnded', {
                  callId,
                  endedBy: socket.userId,
                  duration
                });
              }
            });
          }
        }

      } catch (error) {
        logger.error('[SOCKET] Error in endCall:', error.message);
      }
    });

    // Video toggle
    socket.on('toggleVideo', (data) => {
      try {
        const { enabled, otherId, callId } = data;
        const userId = socket.userId;

        if (otherId) {
          const otherSockets = activeUsers.get(otherId);
          if (otherSockets && otherSockets.size > 0) {
            otherSockets.forEach(otherSocketId => {
              const otherSocket = this.io.sockets.sockets.get(otherSocketId);
              if (otherSocket) {
                otherSocket.emit('remoteVideoToggled', {
                  userId,
                  enabled,
                  callId
                });
              }
            });
          }
        }

      } catch (error) {
        logger.error('[SOCKET] Error in toggleVideo:', error.message);
      }
    });

    // Audio toggle
    socket.on('toggleAudio', (data) => {
      try {
        const { enabled, otherId, callId } = data;
        const userId = socket.userId;

        if (otherId) {
          const otherSockets = activeUsers.get(otherId);
          if (otherSockets && otherSockets.size > 0) {
            otherSockets.forEach(otherSocketId => {
              const otherSocket = this.io.sockets.sockets.get(otherSocketId);
              if (otherSocket) {
                otherSocket.emit('remoteAudioToggled', {
                  userId,
                  enabled,
                  callId
                });
              }
            });
          }
        }

      } catch (error) {
        logger.error('[SOCKET] Error in toggleAudio:', error.message);
      }
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
      logger.info(`[Socket] Sending message in conversation ${conversationId} from user ${socket.userId}`);
      
      if (!content.trim() && attachments.length === 0) {
        logger.warn(`[Socket] Empty message attempted in conversation ${conversationId}`);
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

      logger.info(`[Socket] Message created: ${message._id}`);

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

      logger.info(`[Socket] Message broadcasted to room: ${roomName}`);
    } catch (error) {
      logger.error('[Socket] Error in handleSendMessage:', error);
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
