import React, { useState, useRef, useEffect } from 'react';
import { useCallContext } from '../../../context/CallContext';
import { Phone, Video, Mic } from 'lucide-react';

/**
 * Call button component for initiating calls - Tailwind CSS with responsive dropdown
 */
const CallButton = ({ 
  recipientId, 
  conversationId, 
  recipientName = 'User',
  disabled = false 
}) => {
  const { initiateCall, activeCall } = useCallContext();
  const [showMenu, setShowMenu] = useState(false);
  const [isInitiating, setIsInitiating] = useState(false);
  const menuRef = useRef(null);

  // BUG FIX: Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMenu]);

  const handleAudioCall = async () => {
    try {
      setIsInitiating(true);
      await initiateCall(recipientId, conversationId, 'audio');
      setShowMenu(false);
    } catch (error) {
      console.error('Error initiating audio call:', error);
    } finally {
      setIsInitiating(false);
    }
  };

  const handleVideoCall = async () => {
    try {
      setIsInitiating(true);
      await initiateCall(recipientId, conversationId, 'video');
      setShowMenu(false);
    } catch (error) {
      console.error('Error initiating video call:', error);
    } finally {
      setIsInitiating(false);
    }
  };

  // BUG FIX: Disable if already in call or loading
  const isDisabled = disabled || activeCall || isInitiating;

  return (
    <div ref={menuRef} className="relative">
      {/* Main Call Button */}
      <button
        className={`flex items-center justify-center p-2 md:p-2.5 rounded-lg transition transform ${
          isDisabled
            ? 'bg-disabled-bg text-disabled-text cursor-not-allowed'
            : 'bg-info-bg hover:bg-info-light text-info hover:text-info-dark active:scale-95'
        }`}
        onClick={() => !isDisabled && setShowMenu(!showMenu)}
        disabled={isDisabled}
        title="Start call"
      >
        <Phone size={18} className="md:block hidden" />
        <Phone size={16} className="md:hidden" />
      </button>

      {/* Dropdown Menu - BUG FIX: Better positioning and responsiveness */}
      {showMenu && !isDisabled && (
        <div className="absolute top-full right-0 mt-2 bg-surface-primary dark:bg-surface-dark border border-border-default dark:border-border-dark rounded-lg shadow-lg z-40 min-w-max overflow-hidden animate-in fade-in slide-in-from-top-1">
          {/* Audio Call Option */}
          <button
            className="w-full flex items-center gap-3 px-4 md:px-5 py-3 md:py-3.5 text-left text-text-primary dark:text-text-inverse hover:bg-info-bg dark:hover:bg-info-bg hover:text-info dark:hover:text-info-light transition border-b border-border-light dark:border-border-default last:border-b-0"
            onClick={handleAudioCall}
            disabled={isInitiating}
            title="Start audio call"
          >
            <Mic size={18} className="text-success flex-shrink-0" />
            <span className="text-sm md:text-base font-medium">Audio Call</span>
            {isInitiating && (
              <div className="w-4 h-4 border-2 border-info border-t-transparent rounded-full animate-spin ml-auto"></div>
            )}
          </button>

          {/* Video Call Option */}
          <button
            className="w-full flex items-center gap-3 px-4 md:px-5 py-3 md:py-3.5 text-left text-text-primary dark:text-text-inverse hover:bg-info-bg dark:hover:bg-info-bg hover:text-info dark:hover:text-info-light transition"
            onClick={handleVideoCall}
            disabled={isInitiating}
            title="Start video call"
          >
            <Video size={18} className="text-error flex-shrink-0" />
            <span className="text-sm md:text-base font-medium">Video Call</span>
            {isInitiating && (
              <div className="w-4 h-4 border-2 border-info border-t-transparent rounded-full animate-spin ml-auto"></div>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default CallButton;
