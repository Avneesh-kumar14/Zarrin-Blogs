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
      className={`flex gap-3 p-3 md:p-4 mx-1 md:mx-2 rounded-lg cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'bg-primary text-white shadow-md scale-100' 
          : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:scale-102 active:scale-100'
      }`}
      onClick={() => selectConversation(conversation)}
    >
      <div className={`relative w-12 h-12 md:w-14 md:h-14 rounded-full ${isSelected ? 'bg-white text-primary' : 'bg-secondary text-on-secondary'} text-on-secondary font-semibold flex items-center justify-center flex-shrink-0 text-sm md:text-base shadow-md transition-transform duration-200 ${!isSelected && 'hover:scale-110'}`}>
        {typeof getAvatar() === 'string' && getAvatar().startsWith('http') ? (
          <img src={getAvatar()} alt="Avatar" className="w-full h-full object-cover rounded-full" />
        ) : (
          getAvatar()
        )}
        {hasOnlineUsers && (
          <span className={`absolute bottom-0 right-0 w-3 h-3 md:w-3.5 md:h-3.5 rounded-full border-2 transition-all duration-200 ${isSelected ? 'border-white' : 'border-white'} bg-green-500 shadow-sm`}></span>
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex justify-between items-start gap-2">
          <h3 className={`font-semibold text-sm md:text-base truncate transition-colors duration-200 ${isSelected ? 'text-white' : 'text-text-primary'}`}>
            {displayName}
          </h3>
          <span className={`text-xs md:text-sm flex-shrink-0 whitespace-nowrap transition-colors duration-200 ${isSelected ? 'text-white text-opacity-80' : 'text-text-secondary'}`}>
            {new Date(conversation.lastMessageTime).toLocaleDateString()}
          </span>
        </div>
        <p className={`text-xs md:text-sm truncate transition-colors duration-200 ${isSelected ? 'text-white text-opacity-90' : 'text-text-secondary'}`}>
          {lastMessagePreview}
        </p>
      </div>
    </div>
  );
};

export default ConversationItem;
