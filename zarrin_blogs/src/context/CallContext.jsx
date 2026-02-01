// File: zarrin_blogs/src/context/CallContext.jsx

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { useChatContext } from './ChatContext';

const CallContext = createContext();

export const CallProvider = ({ children }) => {
  const { socket } = useChatContext();
  
  // Call state
  const [activeCall, setActiveCall] = useState(null); // { callId, type, otherId, otherName, status }
  const [incomingCall, setIncomingCall] = useState(null); // Incoming call notification
  // eslint-disable-next-line no-unused-vars
  const [callHistory, setCallHistory] = useState([]);
  
  // Media state
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  
  // Call timing
  const [callDuration, setCallDuration] = useState(0);
  const callTimerRef = useRef(null);

  // WebRTC state
  const peerConnectionRef = useRef(null);
  const callIdRef = useRef(null);

  /**
   * Get user media (camera/microphone)
   */
  const getUserMedia = useCallback(async (constraints = { video: true, audio: true }) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setLocalStream(stream);
      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw error;
    }
  }, []);

  /**
   * Initialize call
   */
  const initiateCall = useCallback(async (recipientId, conversationId, callType = 'audio') => {
    try {
      console.log(`Initiating ${callType} call to ${recipientId}`);

      // Get media
      const constraints = {
        audio: true,
        video: callType === 'video'
      };
      // eslint-disable-next-line no-unused-vars
      const stream = await getUserMedia(constraints);

      // Emit socket event
      socket.emit('callInitiate', {
        recipientId,
        conversationId,
        callType,
        metadata: {
          initiatedVideoEnabled: callType === 'video',
          initiatedAudioEnabled: true
        }
      });

      // Set as active call
      setActiveCall({
        callId: null, // Will be set when confirmed
        type: callType,
        otherId: recipientId,
        status: 'initiating'
      });

      callIdRef.current = null;
    } catch (error) {
      console.error('Error initiating call:', error);
      throw error;
    }
  }, [socket, getUserMedia]);

  /**
   * Accept incoming call
   */
  const acceptCall = useCallback(async (call) => {
    try {
      console.log('Accepting call:', call.callId);

      // Get media
      const constraints = {
        audio: true,
        video: call.callType === 'video'
      };
      // eslint-disable-next-line no-unused-vars
      const stream = await getUserMedia(constraints);

      // Emit socket event
      socket.emit('callAccepted', {
        callId: call.callId,
        callerId: call.initiatorId,
        conversationId: call.conversationId
      });

      // Set as active call
      setActiveCall({
        callId: call.callId,
        type: call.callType,
        otherId: call.initiatorId,
        otherName: call.initiatorName,
        status: 'connecting'
      });

      callIdRef.current = call.callId;
      setIncomingCall(null);
    } catch (error) {
      console.error('Error accepting call:', error);
      throw error;
    }
  }, [socket, getUserMedia]);

  /**
   * Reject incoming call
   */
  const rejectCall = useCallback((call, reason = 'Declined') => {
    console.log('Rejecting call:', call.callId);

    socket.emit('callRejected', {
      callId: call.callId,
      callerId: call.initiatorId,
      reason
    });

    setIncomingCall(null);
  }, [socket]);

  /**
   * End active call
   */
  const endCall = useCallback((quality = 'good') => {
    console.log('Ending call');

    if (activeCall?.callId) {
      socket.emit('endCall', {
        callId: activeCall.callId,
        otherId: activeCall.otherId,
        duration: callDuration,
        quality,
        initiatorId: activeCall.initiatorId
      });
    }

    // Clean up
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }

    setActiveCall(null);
    setRemoteStream(null);
    setCallDuration(0);
    callIdRef.current = null;

    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
    }
  }, [socket, activeCall, callDuration, localStream]);

  /**
   * Toggle video
   */
  const toggleVideo = useCallback((enabled) => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = enabled;
      });
      setVideoEnabled(enabled);

      if (activeCall?.callId) {
        socket.emit('toggleVideo', {
          enabled,
          otherId: activeCall.otherId,
          callId: activeCall.callId
        });
      }
    }
  }, [socket, localStream, activeCall]);

  /**
   * Toggle audio
   */
  const toggleAudio = useCallback((enabled) => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = enabled;
      });
      setAudioEnabled(enabled);

      if (activeCall?.callId) {
        socket.emit('toggleAudio', {
          enabled,
          otherId: activeCall.otherId,
          callId: activeCall.callId
        });
      }
    }
  }, [socket, localStream, activeCall]);

  /**
   * Start call timer
   */
  const startCallTimer = useCallback(() => {
    if (callTimerRef.current) clearInterval(callTimerRef.current);

    callTimerRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
  }, []);

  /**
   * Stop call timer
   */
  const stopCallTimer = useCallback(() => {
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
    }
  }, []);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    // Incoming call
    socket.on('incomingCall', (data) => {
      console.log('Incoming call:', data);
      setIncomingCall(data);
    });

    // Call initiated confirmation
    socket.on('callInitiated', (data) => {
      console.log('Call initiated, call ID:', data.callId);
      callIdRef.current = data.callId;
      setActiveCall(prev => prev ? { ...prev, callId: data.callId, status: 'ringing' } : null);
    });

    // Call accepted
    socket.on('callAccepted', (data) => {
      console.log('Call accepted by:', data.recipientId);
      setActiveCall(prev => prev ? { ...prev, status: 'connecting', otherId: data.recipientId } : null);
    });

    // Call rejected
    socket.on('callRejected', (data) => {
      console.log('Call rejected:', data.reason);
      setActiveCall(null);
      // Show notification
    });

    // Call ended
    socket.on('callEnded', (data) => {
      console.log('Call ended');
      endCall();
    });

    // Remote media toggled
    socket.on('remoteVideoToggled', (data) => {
      console.log('Remote video toggled:', data.enabled);
    });

    socket.on('remoteAudioToggled', (data) => {
      console.log('Remote audio toggled:', data.enabled);
    });

    return () => {
      socket.off('incomingCall');
      socket.off('callInitiated');
      socket.off('callAccepted');
      socket.off('callRejected');
      socket.off('callEnded');
      socket.off('remoteVideoToggled');
      socket.off('remoteAudioToggled');
    };
  }, [socket, endCall]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (activeCall) {
        endCall();
      }
    };
  }, [activeCall, endCall]);

  const value = {
    // State
    activeCall,
    incomingCall,
    callHistory,
    localStream,
    remoteStream,
    videoEnabled,
    audioEnabled,
    callDuration,
    peerConnectionRef,

    // Methods
    initiateCall,
    acceptCall,
    rejectCall,
    endCall,
    toggleVideo,
    toggleAudio,
    getUserMedia,
    startCallTimer,
    stopCallTimer,
    setRemoteStream,
    setActiveCall
  };

  return <CallContext.Provider value={value}>{children}</CallContext.Provider>;
};

export const useCallContext = () => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error('useCallContext must be used within CallProvider');
  }
  return context;
};
