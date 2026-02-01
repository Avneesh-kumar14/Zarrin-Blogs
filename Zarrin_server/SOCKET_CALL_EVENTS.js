// File: Zarrin_server/services/socketHandler.js - ADD THESE EVENT HANDLERS

// Add this code to the setupEventListeners method in socketHandler.js

/**
 * Setup WebRTC and Call-related event listeners
 * Add this inside the setupEventListeners method after the existing chat events
 */

// ==================== CALL EVENTS ====================

/**
 * Handle call initiation
 */
socket.on('callInitiate', async (data) => {
  try {
    const { recipientId, conversationId, callType, metadata } = data;
    const initiatorId = socket.userId;

    logger.info(`[SOCKET] Call initiated: ${initiatorId} -> ${recipientId}, type: ${callType}`);

    // Get recipient's socket connections
    const recipientSockets = activeUsers.get(recipientId);

    if (!recipientSockets || recipientSockets.size === 0) {
      logger.warn(`[SOCKET] Recipient ${recipientId} is offline`);
      socket.emit('callFailed', {
        reason: 'Recipient is offline',
        code: 'RECIPIENT_OFFLINE'
      });
      return;
    }

    // Create call log in database
    const callService = require('./callService');
    const callLog = await callService.initiateCall(
      initiatorId,
      recipientId,
      conversationId,
      callType
    );

    // Send call invitation to recipient through all their active connections
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

    // Emit confirmation to initiator
    socket.emit('callInitiated', {
      callId: callLog.callId,
      status: 'ringing'
    });

  } catch (error) {
    logger.error('[SOCKET] Error in callInitiate:', error.message);
    socket.emit('callError', {
      message: error.message
    });
  }
});

/**
 * Handle call acceptance
 */
socket.on('callAccepted', async (data) => {
  try {
    const { callId, callerId, conversationId } = data;
    const recipientId = socket.userId;

    logger.info(`[SOCKET] Call accepted by ${recipientId}, Call ID: ${callId}`);

    // Get caller's socket
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

/**
 * Handle call rejection
 */
socket.on('callRejected', async (data) => {
  try {
    const { callId, callerId, reason } = data;
    const recipientId = socket.userId;

    logger.info(`[SOCKET] Call rejected by ${recipientId}, reason: ${reason}`);

    // Update call log
    const callService = require('./callService');
    await callService.rejectCall(callId, reason);

    // Notify caller
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

// ==================== WebRTC SIGNALING EVENTS ====================

/**
 * Forward SDP Offer from initiator to recipient
 */
socket.on('sendOffer', (data) => {
  try {
    const { to, offer, callId } = data;
    const from = socket.userId;

    logger.info(`[SOCKET] WebRTC Offer: ${from} -> ${to}, Call ID: ${callId}`);

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
    } else {
      logger.warn(`[SOCKET] Recipient ${to} not found for offer`);
      socket.emit('signalingError', { message: 'Recipient not found' });
    }

  } catch (error) {
    logger.error('[SOCKET] Error in sendOffer:', error.message);
    socket.emit('signalingError', { message: error.message });
  }
});

/**
 * Forward SDP Answer from recipient to initiator
 */
socket.on('sendAnswer', (data) => {
  try {
    const { to, answer, callId } = data;
    const from = socket.userId;

    logger.info(`[SOCKET] WebRTC Answer: ${from} -> ${to}, Call ID: ${callId}`);

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
    } else {
      logger.warn(`[SOCKET] Recipient ${to} not found for answer`);
      socket.emit('signalingError', { message: 'Recipient not found' });
    }

  } catch (error) {
    logger.error('[SOCKET] Error in sendAnswer:', error.message);
    socket.emit('signalingError', { message: error.message });
  }
});

/**
 * Forward ICE Candidates (bidirectional)
 */
socket.on('sendICECandidate', (data) => {
  try {
    const { to, candidate, callId } = data;
    const from = socket.userId;

    logger.debug(`[SOCKET] ICE Candidate: ${from} -> ${to}`);

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

// ==================== CALL CONTROL EVENTS ====================

/**
 * Handle call end
 */
socket.on('endCall', async (data) => {
  try {
    const { callId, otherId, duration, quality } = data;
    const userId = socket.userId;

    logger.info(`[SOCKET] Call ended by ${userId}, Duration: ${duration}s`);

    // Update call log
    const callService = require('./callService');
    await callService.endCall(callId, 'completed', {
      quality,
      initiatorLeftTime: userId === data.initiatorId ? new Date() : undefined
    });

    // Notify the other participant
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
    socket.emit('callError', { message: error.message });
  }
});

/**
 * Handle video toggle
 */
socket.on('toggleVideo', (data) => {
  try {
    const { enabled, otherId, callId } = data;
    const userId = socket.userId;

    logger.info(`[SOCKET] Video toggled by ${userId}: ${enabled}`);

    // Notify the other participant
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

/**
 * Handle audio toggle
 */
socket.on('toggleAudio', (data) => {
  try {
    const { enabled, otherId, callId } = data;
    const userId = socket.userId;

    logger.info(`[SOCKET] Audio toggled by ${userId}: ${enabled}`);

    // Notify the other participant
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

/**
 * Handle call quality report
 */
socket.on('reportCallQuality', async (data) => {
  try {
    const { callId, quality, connectionStrength, metrics } = data;
    const userId = socket.userId;

    logger.info(`[SOCKET] Call quality report from ${userId}: ${quality}, strength: ${connectionStrength}%`);

    const CallLog = require('../models/callLog');
    await CallLog.findByIdAndUpdate(
      callId,
      {
        quality,
        connectionStrength,
        'metadata.metrics': metrics
      }
    );

  } catch (error) {
    logger.error('[SOCKET] Error in reportCallQuality:', error.message);
  }
});

// Export or add to existing method
module.exports = {
  // ... existing exports
  // These event handlers should be added to the setupEventListeners method
};
