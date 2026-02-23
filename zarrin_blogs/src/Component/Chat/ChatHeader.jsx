import React from 'react';
import { Info, Settings } from 'lucide-react';
import { useChatContext } from '../../context/ChatContext';
import CallButton from './CallComponents/CallButton';

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
    <div className="flex items-center justify-between p-3 sm:p-3.5 md:p-4 border-b border-border-light bg-surface-primary dark:bg-surface-dark gap-3 sm:gap-4 h-14 md:h-16 flex-shrink-0 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Left Side - Avatar and Info */}
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-primary text-white text-on-primary font-semibold flex items-center justify-center text-sm md:text-base overflow-hidden shadow-md">
            {conversation.groupAvatar ? (
              <img src={conversation.groupAvatar} alt="Group" className="w-full h-full object-cover" />
            ) : (
              isGroup ? '👥' : (conversation.participants[0]?.email?.[0]?.toUpperCase() || 'U')
            )}
          </div>
          {!isGroup && onlineUsers.has(conversation.participants[0]?._id) && (
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h2 className="text-sm sm:text-base md:text-lg font-semibold text-text-primary truncate">
            {displayName}
          </h2>
          <p className={`text-xs sm:text-sm transition-colors duration-200 ${
            typingUsers.size > 0 
              ? 'text-primary font-medium animate-pulse' 
              : 'text-text-secondary'
          }`}>
            {status}
          </p>
        </div>
      </div>

      {/* Right Side - Actions */}
      <div className="flex items-center gap-1 sm:gap-2 md:gap-3 flex-shrink-0">
        <CallButton 
          recipientId={isGroup ? null : conversation.participants[0]?._id}
          conversationId={conversation._id}
          recipientName={isGroup ? null : conversation.participants[0]?.name}
          disabled={isGroup}
        />
        <button 
          className="p-2 md:p-2.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95" 
          title="Conversation info"
        >
          <Info size={18} className="text-text-secondary" />
        </button>
        {isGroup && (
          <button 
            className="p-2 md:p-2.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95" 
            title="Group settings"
          >
            <Settings size={18} className="text-text-secondary" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
