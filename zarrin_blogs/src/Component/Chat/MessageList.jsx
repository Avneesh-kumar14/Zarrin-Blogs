import React, { useMemo } from 'react';
import Message from './Message';

const MessageList = ({ messages, conversation }) => {
  // Memoize to prevent unnecessary re-renders
  const memoizedMessages = useMemo(() => {
    return messages.map((message, index) => ({
      message,
      showAvatar: index === 0 || messages[index - 1].senderId._id !== message.senderId._id
    }));
  }, [messages]);

  return (
    <div className="flex flex-col w-full gap-0.5">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center text-text-secondary py-8 px-4">
          <div className="text-4xl mb-3 opacity-40">💬</div>
          <p className="font-medium text-text-primary text-sm">Start a conversation</p>
          <small className="text-xs text-text-secondary">Send the first message to begin chatting</small>
        </div>
      ) : (
        memoizedMessages.map(({ message, showAvatar }) => (
          <Message
            key={message._id}
            message={message}
            showAvatar={showAvatar}
            conversation={conversation}
          />
        ))
      )}
    </div>
  );
};

export default MessageList;
