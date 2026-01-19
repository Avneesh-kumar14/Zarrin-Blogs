import React from 'react';
import { useChatContext } from '../../context/ChatContext';
import './ConversationItem.css';

const ConversationItem = ({ conversation }) => {
  const { selectConversation, selectedConversation, onlineUsers } = useChatContext();
  
  const isSelected = selectedConversation?._id === conversation._id;
  
  // Get display name
  const displayName = conversation.conversationName || 
    conversation.participants
      .map(p => p.name)
      .join(', ');

  // Get last message preview
  const lastMessagePreview = conversation.lastMessagePreview || 'No messages yet';

  // Get avatar for direct conversations
  const getAvatar = () => {
    if (conversation.conversationType === 'group') {
      return conversation.groupAvatar || '👥';
    }
    return conversation.participants[0]?.email?.[0]?.toUpperCase() || 'U';
  };

  // Check if any participant is online
  const hasOnlineUsers = conversation.participants.some(p => 
    onlineUsers.has(p._id)
  );

  return (
    <div
      className={`conversation-item ${isSelected ? 'active' : ''}`}
      onClick={() => selectConversation(conversation)}
    >
      <div className="conversation-avatar">
        {getAvatar()}
        {hasOnlineUsers && <span className="online-indicator"></span>}
      </div>

      <div className="conversation-info">
        <div className="conversation-header">
          <h3 className="conversation-name">{displayName}</h3>
          <span className="conversation-time">
            {new Date(conversation.lastMessageTime).toLocaleDateString()}
          </span>
        </div>
        <p className="conversation-preview">{lastMessagePreview}</p>
      </div>
    </div>
  );
};

export default ConversationItem;
