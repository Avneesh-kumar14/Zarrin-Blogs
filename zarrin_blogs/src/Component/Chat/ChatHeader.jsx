import React from 'react';
import { Phone, Video, Info } from 'lucide-react';
import './ChatHeader.css';

const ChatHeader = ({ conversation }) => {
  const displayName = conversation.conversationName ||
    conversation.participants
      .map(p => p.name)
      .join(', ');

  const isGroup = conversation.conversationType === 'group';

  return (
    <div className="chat-header">
      <div className="chat-header-info">
        <div className="chat-header-avatar">
          {conversation.groupAvatar || (isGroup ? '👥' : conversation.participants[0]?.email?.[0]?.toUpperCase())}
        </div>
        <div>
          <h2 className="chat-header-name">{displayName}</h2>
          {isGroup && (
            <p className="chat-header-subtitle">
              {conversation.participants.length} members
            </p>
          )}
        </div>
      </div>

      <div className="chat-header-actions">
        <button className="btn-icon" title="Voice call">
          <Phone size={20} />
        </button>
        <button className="btn-icon" title="Video call">
          <Video size={20} />
        </button>
        <button className="btn-icon" title="Conversation info">
          <Info size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
