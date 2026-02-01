import React from 'react';
import Message from './Message';

const MessageList = ({ messages, conversation }) => {
  return (
    <div className="flex flex-col w-full">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center text-gray-500 py-8">
          <p className="font-medium text-gray-900">Start a conversation</p>
          <small className="text-sm">Send the first message to begin chatting</small>
        </div>
      ) : (
        messages.map((message, index) => (
          <Message
            key={message._id}
            message={message}
            showAvatar={
              index === 0 ||
              messages[index - 1].senderId._id !== message.senderId._id
            }
            conversation={conversation}
          />
        ))
      )}
    </div>
  );
};

export default MessageList;
