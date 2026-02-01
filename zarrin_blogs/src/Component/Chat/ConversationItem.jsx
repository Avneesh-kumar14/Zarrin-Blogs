import React from 'react';
import { useChatContext } from '../../context/ChatContext';

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
      className={`flex gap-3 p-3 md:p-4 mx-2 md:mx-3 rounded-lg cursor-pointer transition ${
        isSelected 
          ? 'bg-blue-100 border-l-4 border-blue-500' 
          : 'hover:bg-gray-100'
      }`}
      onClick={() => selectConversation(conversation)}
    >
      <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 text-white font-semibold flex items-center justify-center flex-shrink-0 text-sm md:text-base">
        {getAvatar()}
        {hasOnlineUsers && <span className="absolute bottom-0 right-0 w-3 h-3 md:w-3.5 md:h-3.5 bg-green-500 rounded-full border-2 border-white"></span>}
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-semibold text-gray-900 text-sm md:text-base truncate">{displayName}</h3>
          <span className="text-xs md:text-sm text-gray-500 flex-shrink-0 whitespace-nowrap">
            {new Date(conversation.lastMessageTime).toLocaleDateString()}
          </span>
        </div>
        <p className="text-xs md:text-sm text-gray-600 truncate">{lastMessagePreview}</p>
      </div>
    </div>
  );
};

export default ConversationItem;
