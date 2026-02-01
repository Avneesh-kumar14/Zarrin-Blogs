import React from 'react';
import { useCallContext } from '../../../context/CallContext';
import { Phone, PhoneOff } from 'lucide-react';

/**
 * Incoming call notification component - Tailwind CSS with animations
 */
const CallNotification = () => {
  const { incomingCall, acceptCall, rejectCall } = useCallContext();

  if (!incomingCall) return null;

  const handleAccept = async () => {
    try {
      await acceptCall(incomingCall);
    } catch (error) {
      console.error('Error accepting call:', error);
    }
  };

  const handleReject = () => {
    rejectCall(incomingCall, 'Declined');
  };

  return (
    <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top-2">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-2xl p-4 md:p-6 text-white min-w-64 md:min-w-80">
        {/* Caller Info */}
        <div className="flex items-center gap-3 md:gap-4 mb-4">
          {/* Caller Avatar with pulse animation */}
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-xl md:text-2xl">
              👤
            </div>
            <div className="absolute inset-0 rounded-full border-2 border-white animate-pulse opacity-50"></div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-base md:text-lg font-bold truncate">
              {incomingCall.initiatorName || 'Unknown'}
            </h3>
            <p className="text-xs md:text-sm text-blue-100">
              {incomingCall.callType === 'video' ? '📹 Video call' : '🎤 Audio call'}
            </p>
          </div>
        </div>

        {/* Call Duration/Status */}
        <p className="text-xs md:text-sm text-blue-100 mb-4">
          Incoming call...
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2 md:gap-3">
          {/* Accept Button */}
          <button
            className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 md:py-2.5 px-3 md:px-4 rounded-lg transition transform hover:scale-105 active:scale-95"
            onClick={handleAccept}
            title="Accept call"
          >
            <Phone size={18} className="md:flex hidden" />
            <Phone size={16} className="md:hidden" />
            <span className="text-sm md:text-base">Accept</span>
          </button>

          {/* Reject Button */}
          <button
            className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 md:py-2.5 px-3 md:px-4 rounded-lg transition transform hover:scale-105 active:scale-95"
            onClick={handleReject}
            title="Reject call"
          >
            <PhoneOff size={18} className="md:flex hidden" />
            <PhoneOff size={16} className="md:hidden" />
            <span className="text-sm md:text-base">Reject</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallNotification;
