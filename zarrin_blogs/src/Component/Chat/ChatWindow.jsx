import React, { useEffect, useRef, useState } from 'react';
import { useChatContext } from '../../context/ChatContext';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ChatHeader from './ChatHeader';
import Toast from './Toast';

const ChatWindow = ({ conversation }) => {
  const { messages, sendMessage, typingUsers, fetchMessages } = useChatContext();
  const messagesEndRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState([]);
  const pollIntervalRef = useRef(null);

  // Show toast notification
  const showToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-fetch messages when conversation changes
  useEffect(() => {
    if (conversation?._id) {
      console.log('ChatWindow: Conversation changed, fetching messages...');
      fetchMessages(conversation._id);

      // Start polling every 5 seconds as fallback for real-time
      // (in case socket connection drops)
      pollIntervalRef.current = setInterval(() => {
        fetchMessages(conversation._id);
      }, 5000);

      return () => {
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
        }
      };
    }
  }, [conversation?._id, fetchMessages]);

  const handleSendMessage = (content, attachments = []) => {
    if (content.trim()) {
      sendMessage(content, attachments);
      setIsLoading(false);
      showToast('Message sent', 'success', 2000);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-white">
      <ChatHeader conversation={conversation} />

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 bg-white">
        <MessageList 
          messages={messages}
          conversation={conversation}
        />
        
        {/* Typing Indicator */}
        {typingUsers.size > 0 && (
          <div className="flex items-center gap-2 mt-4 p-3 bg-gray-100 rounded-full w-fit text-xs text-gray-500">
            <span>
              {Array.from(typingUsers.values()).join(', ')} 
              {typingUsers.size === 1 ? ' is' : ' are'} typing...
            </span>
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></span>
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <MessageInput 
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        selectedConversation={conversation}
        onError={showToast}
      />

      {/* Toast Notifications */}
      <div className="fixed top-5 right-5 z-50 pointer-events-none">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatWindow;
