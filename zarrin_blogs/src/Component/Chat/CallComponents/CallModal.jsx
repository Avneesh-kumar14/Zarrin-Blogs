import React, { useEffect, useState, useCallback } from 'react';
import { useCallContext } from '../../../context/CallContext';
import MediaStream from './MediaStream';
import { Mic, MicOff, Video, VideoOff, Phone } from 'lucide-react';

/**
 * Main call modal component for active calls - Tailwind CSS with responsive design
 */
const CallModal = ({ conversation }) => {
  const {
    activeCall,
    localStream,
    remoteStream,
    videoEnabled,
    audioEnabled,
    callDuration,
    toggleVideo,
    toggleAudio,
    endCall,
    startCallTimer,
    stopCallTimer
  } = useCallContext();

  const [formattedDuration, setFormattedDuration] = useState('00:00');
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  // BUG FIX: Format call duration
  useEffect(() => {
    const minutes = Math.floor(callDuration / 60);
    const seconds = callDuration % 60;
    setFormattedDuration(
      `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    );
  }, [callDuration]);

  // BUG FIX: Start timer when call is active
  useEffect(() => {
    if (activeCall?.status === 'connecting' || activeCall?.status === 'active') {
      startCallTimer();
      return () => stopCallTimer();
    }
  }, [activeCall?.status, startCallTimer, stopCallTimer]);

  // BUG FIX: Handle responsive view changes
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // BUG FIX: Memoize callback to prevent unnecessary re-renders
  const handleToggleAudio = useCallback(() => {
    toggleAudio?.(!audioEnabled);
  }, [audioEnabled, toggleAudio]);

  const handleToggleVideo = useCallback(() => {
    toggleVideo?.(!videoEnabled);
  }, [videoEnabled, toggleVideo]);

  const handleEndCall = useCallback(() => {
    endCall?.('good');
  }, [endCall]);

  if (!activeCall) return null;

  const isVideoCall = activeCall.type === 'video';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50 p-2 md:p-4">
      <div className={`rounded-2xl shadow-2xl overflow-hidden ${
        isVideoCall && !isMobileView
          ? 'w-full h-full max-w-4xl max-h-screen aspect-video'
          : 'w-full max-w-sm'
      } flex flex-col`}>
        
        {/* Video Display Area (for video calls) */}
        {isVideoCall ? (
          <div className="relative w-full flex-1 bg-black">
            {/* Remote Video */}
            <div className="w-full h-full">
              <MediaStream
                stream={remoteStream}
                isMuted={true}
                userName={activeCall.otherName || 'Caller'}
                isLocal={false}
                showLabel={true}
              />
            </div>

            {/* Local Video - Picture in Picture */}
            <div className={`absolute rounded-lg overflow-hidden border-2 border-white shadow-lg bg-gray-900 ${
              isMobileView
                ? 'bottom-16 right-2 w-20 h-24'
                : 'bottom-20 right-4 w-32 h-40'
            }`}>
              <MediaStream
                stream={localStream}
                isMuted={true}
                userName="You"
                isLocal={true}
                showLabel={true}
              />
            </div>
          </div>
        ) : (
          /* Audio Call Display - Centered */
          <div className="bg-gradient-to-br from-purple-500 to-purple-700 flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl md:text-8xl mb-4 animate-bounce">👤</div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{activeCall.otherName || 'User'}</h2>
              <p className="text-purple-200 text-lg">
                {activeCall.status === 'ringing' && '🔔 Ringing...'}
                {activeCall.status === 'connecting' && '⏳ Connecting...'}
                {activeCall.status === 'active' && '📞 In call'}
              </p>
            </div>
          </div>
        )}

        {/* Call Controls */}
        <div className="bg-gray-900 px-4 md:px-6 py-4 md:py-5 space-y-4">
          {/* Call Duration & Quality */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-white font-mono text-lg md:text-xl font-semibold">{formattedDuration}</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-green-500"></div>
                <span className="text-xs md:text-sm text-gray-300">excellent</span>
              </div>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-center gap-3 md:gap-6">
            {/* Microphone Toggle - BUG FIX: Better responsive sizing */}
            <button
              className={`flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full transition transform hover:scale-110 ${
                audioEnabled
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
              onClick={handleToggleAudio}
              title={audioEnabled ? 'Mute microphone' : 'Unmute microphone'}
            >
              {audioEnabled ? (
                <Mic size={isMobileView ? 20 : 24} />
              ) : (
                <MicOff size={isMobileView ? 20 : 24} />
              )}
            </button>

            {/* Video Toggle - Only for video calls - BUG FIX: Better state management */}
            {isVideoCall && (
              <button
                className={`flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full transition transform hover:scale-110 ${
                  videoEnabled
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
                onClick={handleToggleVideo}
                title={videoEnabled ? 'Stop camera' : 'Start camera'}
              >
                {videoEnabled ? (
                  <Video size={isMobileView ? 20 : 24} />
                ) : (
                  <VideoOff size={isMobileView ? 20 : 24} />
                )}
              </button>
            )}

            {/* End Call Button */}
            <button
              className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-red-600 hover:bg-red-700 text-white transition transform hover:scale-110"
              onClick={handleEndCall}
              title="End call"
            >
              <Phone size={isMobileView ? 20 : 24} className="rotate-[225deg]" />
            </button>
          </div>

          {/* Call Info - Mobile only */}
          {isMobileView && (
            <div className="text-center text-xs text-gray-400">
              {isVideoCall ? 'Video Call' : 'Audio Call'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CallModal;
