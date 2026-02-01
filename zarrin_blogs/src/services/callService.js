// File: zarrin_blogs/src/services/callService.js

/**
 * WebRTC Peer Connection Service
 * Handles WebRTC offer/answer and ICE candidate exchange
 */

class CallService {
  constructor() {
    this.peerConnection = null;
    this.signalingServer = null;
    this.localStream = null;
    this.remoteStream = null;
    this.callId = null;
    this.config = {
      iceServers: [
        { urls: ['stun:stun.l.google.com:19302'] },
        { urls: ['stun:stun1.l.google.com:19302'] },
        { urls: ['stun:stun2.l.google.com:19302'] }
      ]
    };
  }

  /**
   * Initialize WebRTC connection
   */
  async initializePeerConnection(signalingServer, localStream, isInitiator = false) {
    try {
      this.signalingServer = signalingServer;
      this.localStream = localStream;

      // Create peer connection
      this.peerConnection = new RTCPeerConnection({
        iceServers: this.config.iceServers
      });

      // Add local stream tracks
      if (localStream) {
        localStream.getTracks().forEach(track => {
          this.peerConnection.addTrack(track, localStream);
        });
      }

      // Setup event listeners
      this.setupPeerConnectionListeners();

      // If initiator, create and send offer
      if (isInitiator) {
        await this.createAndSendOffer();
      }

      return this.peerConnection;
    } catch (error) {
      console.error('Error initializing peer connection:', error);
      throw error;
    }
  }

  /**
   * Setup peer connection event listeners
   */
  setupPeerConnectionListeners() {
    // ICE candidates
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('Sending ICE candidate:', event.candidate);
        this.signalingServer.emit('sendICECandidate', {
          to: this.remotePeerId,
          candidate: event.candidate,
          callId: this.callId
        });
      }
    };

    // Connection state changes
    this.peerConnection.onconnectionstatechange = () => {
      console.log('Connection state:', this.peerConnection.connectionState);

      if (this.peerConnection.connectionState === 'connected') {
        console.log('Peer connection established');
      } else if (this.peerConnection.connectionState === 'failed') {
        console.log('Peer connection failed, attempting to reconnect');
      } else if (this.peerConnection.connectionState === 'disconnected') {
        console.log('Peer connection disconnected');
      } else if (this.peerConnection.connectionState === 'closed') {
        console.log('Peer connection closed');
      }
    };

    // ICE connection state changes
    this.peerConnection.oniceconnectionstatechange = () => {
      console.log('ICE connection state:', this.peerConnection.iceConnectionState);
    };

    // Track remote stream
    this.peerConnection.ontrack = (event) => {
      console.log('Remote track received:', event.track.kind);
      this.remoteStream = event.streams[0];
      if (this.onRemoteStream) {
        this.onRemoteStream(this.remoteStream);
      }
    };

    // Renegotiation needed
    this.peerConnection.onnegotiationneeded = async () => {
      console.log('Negotiation needed');
      // Handle if tracks are added/removed
    };
  }

  /**
   * Create and send offer
   */
  async createAndSendOffer() {
    try {
      const offer = await this.peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });

      await this.peerConnection.setLocalDescription(offer);

      console.log('Sending SDP offer');
      this.signalingServer.emit('sendOffer', {
        to: this.remotePeerId,
        offer: this.peerConnection.localDescription,
        callId: this.callId
      });
    } catch (error) {
      console.error('Error creating offer:', error);
      throw error;
    }
  }

  /**
   * Handle received offer
   */
  async handleOffer(offer, fromPeerId, callId) {
    try {
      console.log('Received SDP offer');

      this.remotePeerId = fromPeerId;
      this.callId = callId;

      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

      // Create and send answer
      const answer = await this.peerConnection.createAnswer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });

      await this.peerConnection.setLocalDescription(answer);

      console.log('Sending SDP answer');
      this.signalingServer.emit('sendAnswer', {
        to: fromPeerId,
        answer: this.peerConnection.localDescription,
        callId
      });
    } catch (error) {
      console.error('Error handling offer:', error);
      throw error;
    }
  }

  /**
   * Handle received answer
   */
  async handleAnswer(answer, fromPeerId) {
    try {
      console.log('Received SDP answer');

      if (this.peerConnection.signalingState === 'stable') {
        console.warn('Ignoring answer in stable state');
        return;
      }

      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      console.log('Remote description set');
    } catch (error) {
      console.error('Error handling answer:', error);
      throw error;
    }
  }

  /**
   * Handle ICE candidate
   */
  async handleICECandidate(candidate, fromPeerId) {
    try {
      if (this.peerConnection && candidate) {
        await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        console.log('ICE candidate added');
      }
    } catch (error) {
      console.error('Error handling ICE candidate:', error);
    }
  }

  /**
   * Get connection stats
   */
  async getConnectionStats() {
    try {
      const stats = await this.peerConnection.getStats();
      const report = {
        audio: {},
        video: {},
        connection: {}
      };

      stats.forEach(stat => {
        if (stat.type === 'inbound-rtp') {
          if (stat.kind === 'audio') {
            report.audio.bytesReceived = stat.bytesReceived;
            report.audio.packetsReceived = stat.packetsReceived;
            report.audio.packetsLost = stat.packetsLost;
          } else if (stat.kind === 'video') {
            report.video.bytesReceived = stat.bytesReceived;
            report.video.packetsReceived = stat.packetsReceived;
            report.video.framesDecoded = stat.framesDecoded;
          }
        }

        if (stat.type === 'outbound-rtp') {
          if (stat.kind === 'audio') {
            report.audio.bytesSent = stat.bytesSent;
            report.audio.packetsSent = stat.packetsSent;
          } else if (stat.kind === 'video') {
            report.video.bytesSent = stat.bytesSent;
            report.video.packetsSent = stat.packetsSent;
            report.video.framesEncoded = stat.framesEncoded;
          }
        }

        if (stat.type === 'candidate-pair' && stat.state === 'succeeded') {
          report.connection.currentRoundTripTime = stat.currentRoundTripTime;
          report.connection.availableOutgoingBitrate = stat.availableOutgoingBitrate;
          report.connection.availableIncomingBitrate = stat.availableIncomingBitrate;
        }
      });

      return report;
    } catch (error) {
      console.error('Error getting connection stats:', error);
      return null;
    }
  }

  /**
   * Assess call quality
   */
  async assessCallQuality() {
    try {
      const stats = await this.getConnectionStats();
      if (!stats) return 'unknown';

      const rtt = stats.connection.currentRoundTripTime || 0;
      const videoBitrate = stats.video.availableOutgoingBitrate || 0;

      if (rtt > 0.3 || videoBitrate < 500000) {
        return 'poor';
      } else if (rtt > 0.15 || videoBitrate < 1000000) {
        return 'fair';
      } else if (rtt > 0.05 || videoBitrate < 2500000) {
        return 'good';
      } else {
        return 'excellent';
      }
    } catch (error) {
      console.error('Error assessing call quality:', error);
      return 'unknown';
    }
  }

  /**
   * Close peer connection
   */
  closePeerConnection() {
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
  }

  /**
   * Set callback for remote stream
   */
  setOnRemoteStream(callback) {
    this.onRemoteStream = callback;
  }
}

export default new CallService();
