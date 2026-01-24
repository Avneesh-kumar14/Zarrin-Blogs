import io from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_API_BASE_URL || 'https://zarrin-blogs-backend.onrender.com';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  /**
   * Initialize Socket.IO connection with proper error handling
   */
  connect(token) {
    if (this.socket?.connected) {
      console.log('✅ Socket already connected');
      return this.socket;
    }

    if (!token) {
      console.error('❌ Socket connection failed: No token provided');
      this.emit('socketError', new Error('No token provided'));
      return null;
    }

    console.log('🔌 Attempting to connect to Socket.IO...');
    console.log('URL:', SOCKET_URL);
    console.log('Namespace:', '/chat');
    console.log('Token:', token.substring(0, 20) + '...');

    try {
      // Connect to the /chat namespace on the Socket.IO server
      this.socket = io(`${SOCKET_URL}/chat`, {
        auth: {
          token: token
        },
        reconnection: true,
        reconnectionDelay: 500,           // Faster initial reconnection
        reconnectionDelayMax: 10000,      // Increased max wait
        reconnectionAttempts: 10,         // More reconnection attempts
        transports: ['websocket', 'polling'],
        secure: false,                    // Set to true only for https
        rejectUnauthorized: false,
        forceNew: false,
        path: '/socket.io',               // Explicit path matching backend
        timeout: 30000,                   // 30 second connection timeout
        multiplex: true,                  // Allow multiple connections
        randomizationFactor: 0.5,         // Randomize reconnection delay
        maxHttpBufferSize: 1e6            // 1MB buffer for large uploads
      });

      // Connection events
      this.socket.on('connect', () => {
        console.log('✅ Socket connected:', this.socket.id);
        console.log('Connected to namespace: /chat');
        this.emit('socketConnected');
      });

      this.socket.on('disconnect', (reason) => {
        console.log('❌ Socket disconnected:', reason);
        this.emit('socketDisconnected', reason);
      });

      this.socket.on('connect_error', (error) => {
        console.error('❌ Socket connection error:', error);
        console.error('Error message:', error.message);
        console.error('Error type:', error.type);
        console.error('Error data:', error.data);
        this.emit('socketError', error);
      });

      this.socket.on('error', (error) => {
        console.error('❌ Socket error event:', error);
        this.emit('socketError', error);
      });

      // Handle reconnection attempts
      this.socket.on('reconnect_attempt', () => {
        console.log('🔄 Socket reconnection attempt...');
      });

      this.socket.on('reconnect', () => {
        console.log('✅ Socket reconnected successfully');
        this.emit('socketConnected');
      });

      this.socket.on('reconnect_failed', () => {
        console.error('❌ Socket reconnection failed');
        this.emit('socketError', new Error('Failed to reconnect after max attempts'));
      });

      return this.socket;
    } catch (error) {
      console.error('❌ Socket initialization error:', error);
      return null;
    }
  }

  /**
   * Disconnect socket safely
   */
  disconnect() {
    if (this.socket) {
      try {
        if (this.socket.connected) {
          this.socket.disconnect();
        }
      } catch (error) {
        console.error('Error disconnecting socket:', error);
      }
      this.socket = null;
    }
  }

  /**
   * Check if socket is connected
   */
  isConnected() {
    return this.socket?.connected || false;
  }

  /**
   * Force reconnect if disconnected
   */
  reconnect() {
    if (this.socket && !this.socket.connected) {
      console.log('🔄 Forcing socket reconnection...');
      this.socket.connect();
    }
  }

  /**
   * Join a conversation room
   */
  joinConversation(conversationId) {
    if (!this.socket?.connected) {
      console.error('Socket not connected');
      return;
    }
    this.socket.emit('joinConversation', { conversationId });
  }

  /**
   * Leave a conversation room
   */
  leaveConversation(conversationId) {
    if (!this.socket?.connected) {
      console.error('Socket not connected');
      return;
    }
    this.socket.emit('leaveConversation', { conversationId });
  }

  /**
   * Send a message
   */
  sendMessage(conversationId, content, attachments = [], messageType = 'text') {
    if (!this.socket?.connected) {
      console.error('❌ Socket not connected, cannot send message');
      return;
    }
    console.log('📤 Emitting sendMessage:', { conversationId, messageType, contentLength: content.length });
    this.socket.emit('sendMessage', {
      conversationId,
      content,
      attachments,
      messageType
    });
    console.log('✅ Message emitted successfully');
  }

  /**
   * Emit typing indicator
   */
  emitTyping(conversationId, characterCount = 0) {
    if (!this.socket?.connected) {
      return;
    }
    this.socket.emit('userTyping', {
      conversationId,
      characterCount
    });
  }

  /**
   * Emit stopped typing
   */
  emitStoppedTyping(conversationId) {
    if (!this.socket?.connected) {
      return;
    }
    this.socket.emit('userStoppedTyping', { conversationId });
  }

  /**
   * Mark messages as read
   */
  markAsRead(conversationId) {
    if (!this.socket?.connected) {
      return;
    }
    this.socket.emit('markAsRead', { conversationId });
  }

  /**
   * Delete a message
   */
  deleteMessage(conversationId, messageId) {
    if (!this.socket?.connected) {
      return;
    }
    this.socket.emit('deleteMessage', { conversationId, messageId });
  }

  /**
   * Edit a message
   */
  editMessage(conversationId, messageId, newContent) {
    if (!this.socket?.connected) {
      return;
    }
    this.socket.emit('editMessage', {
      conversationId,
      messageId,
      newContent
    });
  }

  /**
   * Add reaction to message
   */
  addReaction(conversationId, messageId, emoji) {
    if (!this.socket?.connected) {
      return;
    }
    this.socket.emit('addReaction', {
      conversationId,
      messageId,
      emoji
    });
  }

  /**
   * Initiate call
   */
  initiateCall(conversationId, callType = 'audio') {
    if (!this.socket?.connected) {
      return;
    }
    this.socket.emit('initiateCall', {
      conversationId,
      callType
    });
  }

  /**
   * End call
   */
  endCall(conversationId) {
    if (!this.socket?.connected) {
      return;
    }
    this.socket.emit('endCall', { conversationId });
  }

  /**
   * Listen to event
   */
  on(event, callback) {
    if (!this.socket) {
      console.error('Socket not initialized');
      return;
    }

    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);

    this.socket.on(event, callback);
  }

  /**
   * Remove event listener
   */
  off(event, callback) {
    if (!this.socket) {
      return;
    }

    this.socket.off(event, callback);

    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  /**
   * Listen to event once
   */
  once(event, callback) {
    if (!this.socket) {
      return;
    }
    this.socket.once(event, callback);
  }

  /**
   * Emit custom event
   */
  emit(event, data) {
    if (!this.socket) {
      return;
    }
    this.socket.emit(event, data);
  }

  /**
   * Get socket connection status
   */
  isConnected() {
    return this.socket?.connected || false;
  }

  /**
   * Get socket ID
   */
  getSocketId() {
    return this.socket?.id || null;
  }
}

// Singleton instance
export default new SocketService();
