import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus } from 'lucide-react';
import socketService from '../../utils/socketService';
import './MessageInput.css';

const MessageInput = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [message]);

  const handleTyping = (e) => {
    const value = e.target.value;
    setMessage(value);

    // Emit typing indicator
    socketService.emit('userTyping', { characterCount: value.length });

    // Clear timeout and set new one
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socketService.emit('userStoppedTyping', {});
    }, 1000);
  };

  const handleSendMessage = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }

      // Stop typing indicator
      socketService.emit('userStoppedTyping', {});
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="message-input-container">
      <div className="message-input-wrapper">
        <button className="btn-attach" title="Attach file">
          <Plus size={20} />
        </button>

        <textarea
          ref={textareaRef}
          className="message-textarea"
          placeholder="Type a message..."
          value={message}
          onChange={handleTyping}
          onKeyPress={handleKeyPress}
          rows={1}
          disabled={isLoading}
        />

        <button
          className="btn-send"
          onClick={handleSendMessage}
          disabled={!message.trim() || isLoading}
          title="Send message"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
