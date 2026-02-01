// File: zarrin_blogs/src/Component/Chat/CallComponents/MediaStream.jsx

import React, { useEffect, useRef } from 'react';

/**
 * Component to display video or audio stream
 */
const MediaStream = ({ 
  stream, 
  isMuted = false, 
  label = 'Stream',
  isLocal = false,
  userName = 'User',
  profileImage = null,
  showLabel = true,
  className = '',
  videoClassName = ''
}) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video && stream) {
      video.srcObject = stream;
    }

    return () => {
      if (video) {
        video.srcObject = null;
      }
    };
  }, [stream]);

  if (!stream) {
    return (
      <div className={`media-stream-placeholder ${className}`}>
        <div className="placeholder-content">
          {profileImage ? (
            <img src={profileImage} alt={userName} className="user-avatar" />
          ) : (
            <div className="avatar-fallback">👤</div>
          )}
          <p className="user-name">{userName}</p>
          {!stream && <p className="stream-status">Camera off</p>}
        </div>
      </div>
    );
  }

  return (
    <div className={`media-stream-container ${className}`}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isMuted}
        className={`media-stream-video ${videoClassName} ${isLocal ? 'local' : 'remote'}`}
      />
      
      {showLabel && (
        <div className="media-stream-label">
          <span>{isLocal ? 'You' : userName}</span>
          {isMuted && <span className="muted-indicator">🔇</span>}
        </div>
      )}
    </div>
  );
};

export default MediaStream;
