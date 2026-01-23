import React from 'react';
import { Phone, Video, Info, Settings } from 'lucide-react';
import { useChatContext } from '../../context/ChatContext';
import './ChatHeader.css';

const ChatHeader = ({ conversation }) => {
  const { onlineUsers, typingUsers } = useChatContext();

  const displayName = conversation.conversationName ||
    conversation.participants
      .map(p => p.name)
      .join(', ');

  const isGroup = conversation.conversationType === 'group';

  // Get status for direct conversations
  const getContactStatus = () => {
    if (isGroup) {
      const onlineCount = conversation.participants.filter(
        p => onlineUsers.has(p._id)
      ).length;
      return onlineCount > 0 ? `${onlineCount} online` : 'offline';
    } else {
      const otherUser = conversation.participants[0];
      const isOnline = onlineUsers.has(otherUser._id);
      return isOnline ? 'online' : 'offline';
    }
  };

  // Get typing status
  const getTypingStatus = () => {
    if (typingUsers.size === 0) return null;
    
    const typingList = Array.from(typingUsers.values());
    if (typingList.length === 1) {
      return `${typingList[0]} is typing...`;
    } else if (typingList.length === 2) {
      return `${typingList.join(' and ')} are typing...`;
    } else {
      return `${typingList.length} people are typing...`;
    }
  };

  const status = getTypingStatus() || getContactStatus();

  return (
    <div className="chat-header">
      <div className="chat-header-info">
        <div className="chat-header-avatar-wrapper">
          <div className="chat-header-avatar">
            {conversation.groupAvatar ? (
              <img src={conversation.groupAvatar} alt="Group" />
            ) : (
              isGroup ? '👥' : (conversation.participants[0]?.email?.[0]?.toUpperCase() || 'U')
            )}
          </div>
          {!isGroup && onlineUsers.has(conversation.participants[0]?._id) && (
            <div className="online-indicator" title="Online"></div>
          )}
        </div>
        <div className="chat-header-text">
          <h2 className="chat-header-name">{displayName}</h2>
          <p className={`chat-header-subtitle ${typingUsers.size > 0 ? 'typing' : ''}`}>
            {status}
          </p>
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
        {isGroup && (
          <button className="btn-icon" title="Group settings">
            <Settings size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
