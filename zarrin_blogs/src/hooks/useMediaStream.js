// File: zarrin_blogs/src/hooks/useMediaStream.js

import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * Custom hook for managing media streams (camera/microphone)
 */
export const useMediaStream = () => {
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const streamRef = useRef(null);

  /**
   * Get user media
   */
  const getMedia = useCallback(async (constraints = { video: true, audio: true }) => {
    try {
      setIsLoading(true);
      setError(null);

      // Check browser support
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('getUserMedia is not supported in this browser');
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = mediaStream;
      setStream(mediaStream);

      // Track states
      const videoTrack = mediaStream.getVideoTracks()[0];
      const audioTrack = mediaStream.getAudioTracks()[0];

      if (videoTrack) setIsCameraOn(videoTrack.enabled);
      if (audioTrack) setIsMicOn(audioTrack.enabled);

      return mediaStream;
    } catch (err) {
      const errorMessage = err.message || 'Failed to access media devices';
      setError(errorMessage);
      console.error('Error getting media:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Stop media stream
   */
  const stopMedia = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }
    setStream(null);
    setIsCameraOn(false);
    setIsMicOn(false);
  }, []);

  /**
   * Toggle camera
   */
  const toggleCamera = useCallback((enable) => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach(track => {
        track.enabled = enable;
        setIsCameraOn(enable);
      });
    }
  }, []);

  /**
   * Toggle microphone
   */
  const toggleMicrophone = useCallback((enable) => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(track => {
        track.enabled = enable;
        setIsMicOn(enable);
      });
    }
  }, []);

  /**
   * Switch camera/screen
   */
  const switchMediaSource = useCallback(async (constraints) => {
    try {
      setIsLoading(true);
      stopMedia();

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = newStream;
      setStream(newStream);

      return newStream;
    } catch (err) {
      setError(err.message || 'Failed to switch media source');
      console.error('Error switching media:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [stopMedia]);

  /**
   * Share screen
   */
  const shareScreen = useCallback(async (includeAudio = false) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!navigator.mediaDevices?.getDisplayMedia) {
        throw new Error('Screen sharing is not supported in this browser');
      }

      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: 'always'
        },
        audio: includeAudio
      });

      streamRef.current = screenStream;
      setStream(screenStream);

      return screenStream;
    } catch (err) {
      // User may have canceled screen sharing
      if (err.name !== 'NotAllowedError') {
        setError(err.message || 'Failed to share screen');
        console.error('Error sharing screen:', err);
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Get available devices
   */
  const getAvailableDevices = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return {
        cameras: devices.filter(d => d.kind === 'videoinput'),
        microphones: devices.filter(d => d.kind === 'audioinput'),
        speakers: devices.filter(d => d.kind === 'audiooutput')
      };
    } catch (err) {
      console.error('Error getting devices:', err);
      return { cameras: [], microphones: [], speakers: [] };
    }
  }, []);

  // Request permissions on mount if needed
  useEffect(() => {
    // Optionally request permissions on component mount
    // You can call getMedia() when needed instead
    return () => {
      stopMedia();
    };
  }, [stopMedia]);

  return {
    stream,
    error,
    isLoading,
    isCameraOn,
    isMicOn,
    getMedia,
    stopMedia,
    toggleCamera,
    toggleMicrophone,
    switchMediaSource,
    shareScreen,
    getAvailableDevices
  };
};
