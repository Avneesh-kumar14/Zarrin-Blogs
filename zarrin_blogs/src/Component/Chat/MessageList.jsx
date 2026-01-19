import React from 'react';
import Message from './Message';
import './MessageList.css';

const MessageList = ({ messages, conversation }) => {
  return (
    <div className="message-list">
      {messages.length === 0 ? (
        <div className="empty-messages">
          <p>Start a conversation</p>
          <small>Send the first message to begin chatting</small>
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
