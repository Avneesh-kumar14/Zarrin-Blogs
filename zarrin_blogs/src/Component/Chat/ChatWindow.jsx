import React, { useEffect, useRef, useState } from 'react';
import { useChatContext } from '../../context/ChatContext';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ChatHeader from './ChatHeader';
import './ChatWindow.css';

const ChatWindow = ({ conversation }) => {
  const { messages, sendMessage, typingUsers } = useChatContext();
  const messagesEndRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (content, attachments = []) => {
    if (content.trim()) {
      sendMessage(content, attachments);
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-window">
      <ChatHeader conversation={conversation} />

      <div className="messages-container">
        <MessageList 
          messages={messages}
          conversation={conversation}
        />
        
        {/* Typing Indicator */}
        {typingUsers.size > 0 && (
          <div className="typing-indicator">
            <span>
              {Array.from(typingUsers.values()).join(', ')} 
              {typingUsers.size === 1 ? ' is' : ' are'} typing...
            </span>
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <MessageInput 
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ChatWindow;
