import React, { useEffect, useRef, useState } from 'react';
import { useChatContext } from '../../context/ChatContext';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ChatHeader from './ChatHeader';
import Toast from './Toast';

const ChatWindow = ({ conversation }) => {
  const { messages, sendMessage, typingUsers, fetchMessages } = useChatContext();
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [shouldScroll, setShouldScroll] = useState(true);
  const pollIntervalRef = useRef(null);
  const lastMessageCountRef = useRef(0);

  // Show toast notification
  const showToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Improved auto-scroll: only scroll to bottom for new messages, not on initial load
  useEffect(() => {
    if (messages.length > lastMessageCountRef.current && shouldScroll) {
      // We have new messages, scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 0);
    }
    lastMessageCountRef.current = messages.length;
  }, [messages, shouldScroll]);

  // Prevent scroll jump when component mounts or conversation changes
  useEffect(() => {
    if (conversation?._id) {
      setShouldScroll(false);
      console.log('ChatWindow: Conversation changed, fetching messages...');
      fetchMessages(conversation._id);

      // Start polling every 5 seconds as fallback for real-time
      pollIntervalRef.current = setInterval(() => {
        fetchMessages(conversation._id);
      }, 5000);

      // Re-enable smooth scrolling after initial load
      setTimeout(() => {
        setShouldScroll(true);
        // Scroll to bottom after data is loaded
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto', block: 'end' });
      }, 200);

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
    <div className="flex flex-col h-full w-full bg-surface-primary dark:bg-surface-dark overflow-hidden">
      <ChatHeader conversation={conversation} />

      {/* Messages Container - Fixed height with proper overflow */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden p-3 md:p-4 flex flex-col gap-2 bg-surface-primary dark:bg-surface-dark scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-700 scrollbar-track-transparent"
        style={{ scrollBehavior: 'smooth' }}
      >
        <MessageList 
          messages={messages}
          conversation={conversation}
        />
        
        {/* Typing Indicator - Fixed positioning */}
        {typingUsers.size > 0 && (
          <div className="flex items-center gap-2 mt-2 p-3 bg-neutral-100 dark:bg-neutral-800 rounded-full w-fit text-xs text-text-secondary animate-in fade-in duration-300">
            <span className="font-medium">
              {Array.from(typingUsers.values()).join(', ')} 
              {typingUsers.size === 1 ? ' is' : ' are'} typing
            </span>
            <div className="flex gap-1 ml-1">
              <span className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
              <span className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
            </div>
          </div>
        )}
        
        {/* Scroll to bottom anchor */}
        <div ref={messagesEndRef} className="flex-shrink-0" />
      </div>

      {/* Message Input - Fixed at bottom */}
      <MessageInput 
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        selectedConversation={conversation}
        onError={showToast}
      />

      {/* Toast Notifications */}
      <div className="fixed top-4 sm:top-6 right-4 sm:right-6 z-50 pointer-events-none max-w-xs sm:max-w-sm">
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
