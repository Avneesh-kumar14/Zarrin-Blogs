import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile, Image as ImageIcon, X } from 'lucide-react';
import { socketService } from '../../utils/socketService';
import EmojiPicker from './EmojiPicker';
import './MessageInput.css';

const MessageInput = ({ onSendMessage, isLoading, selectedConversation, onError = () => {} }) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
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

  const handleEmojiSelect = (emoji) => {
    const newMessage = message + emoji;
    setMessage(newMessage);
    setShowEmojiPicker(false);

    // Focus back on textarea
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file types and size
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const isUnder25MB = file.size <= 25 * 1024 * 1024; // 25MB for videos, 5MB for images
      const fileSize = file.type.startsWith('video/') ? 25 * 1024 * 1024 : 5 * 1024 * 1024;
      const isUnderLimit = file.size <= fileSize;
      
      if (!isImage && !isVideo) {
        onError(`${file.name} - Only images and videos are allowed`, 'error');
        return false;
      }
      
      if (!isUnderLimit) {
        const limit = file.type.startsWith('video/') ? '25MB' : '5MB';
        onError(`${file.name} is larger than ${limit}`, 'error');
        return false;
      }
      
      return true;
    });

    if (validFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
      
      // Create preview URLs
      const newPreviews = validFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviews]);
    }

    // Reset input
    e.target.value = '';
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
      const newPreviews = prev.filter((_, i) => i !== index);
      // Cleanup old preview URL
      URL.revokeObjectURL(prev[index]);
      return newPreviews;
    });
  };

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    try {
      // Verify socket is connected before uploading
      if (!socketService.isConnected()) {
        console.warn('⚠️ Socket not connected, attempting reconnect...');
        socketService.reconnect();
        // Wait for reconnection
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (!socketService.isConnected()) {
          throw new Error('Socket connection unavailable. Please try again.');
        }
      }

      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('images', file);
      });

      // Include caption/content if provided
      if (message.trim()) {
        formData.append('content', message.trim());
      }

      const token = localStorage.getItem('token');
      const api = process.env.REACT_APP_API_BASE_URL || 'https://zarrin-blogs-backend.onrender.com';

      const response = await fetch(
        `${api}/api/chat/conversations/${selectedConversation._id}/messages/upload`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData,
          timeout: 60000  // 60 second timeout for upload
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Upload failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Images uploaded and message created:', data);

      // Clear files after successful upload
      setSelectedFiles([]);
      previewUrls.forEach(url => URL.revokeObjectURL(url));
      setPreviewUrls([]);
      setMessage('');

      // Message is already created on backend via upload endpoint
      // The Socket.IO event will handle displaying it
      // No need to call onSendMessage again
    } catch (error) {
      console.error('❌ Image upload error:', error);
      onError(`Failed to upload images: ${error.message}`, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendMessage = async () => {
    // Send images with optional caption
    if (selectedFiles.length > 0) {
      await uploadFiles();
      return;
    }

    // Send text message only
    if (message.trim() && !isLoading && !isUploading) {
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

  const canSend = (message.trim() || selectedFiles.length > 0) && !isLoading && !isUploading;

  return (
    <div className="message-input-container">
      {/* File previews */}
      {previewUrls.length > 0 && (
        <div className="file-preview-container">
          <div className="file-preview-grid">
            {previewUrls.map((url, idx) => {
              const file = selectedFiles[idx];
              const isVideo = file?.type?.startsWith('video/');
              return (
                <div key={idx} className="file-preview-item">
                  {isVideo ? (
                    <video 
                      src={url} 
                      controls
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <img src={url} alt={`Preview ${idx}`} />
                  )}
                  <button
                    className="file-preview-remove"
                    onClick={() => removeFile(idx)}
                    title="Remove file"
                  >
                    <X size={16} />
                  </button>
                </div>
              );
            })}
          </div>
          {selectedFiles.length > 0 && (
            <div className="file-preview-actions">
              <button
                className="btn-clear-files"
                onClick={() => {
                  setSelectedFiles([]);
                  previewUrls.forEach(url => URL.revokeObjectURL(url));
                  setPreviewUrls([]);
                }}
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      )}

      <div className="message-input-wrapper">
        <div className="input-actions-left">
          <button 
            className="btn-attach" 
            title="Attach photos or videos"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon size={20} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          
          <button
            className="btn-emoji"
            title="Add emoji"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <Smile size={20} />
          </button>
        </div>

        <textarea
          ref={textareaRef}
          className="message-textarea"
          placeholder="Type a message... (Shift+Enter for new line)"
          value={message}
          onChange={handleTyping}
          onKeyPress={handleKeyPress}
          rows={1}
          disabled={isLoading || isUploading}
        />

        <button
          className="btn-send"
          onClick={handleSendMessage}
          disabled={!canSend}
          title="Send message"
        >
          {isUploading ? (
            <div className="spinner-small" />
          ) : (
            <Send size={20} />
          )}
        </button>
      </div>

      {/* Emoji Picker Modal */}
      {showEmojiPicker && (
        <EmojiPicker
          onEmojiSelect={handleEmojiSelect}
          onClose={() => setShowEmojiPicker(false)}
        />
      )}
    </div>
  );
};

export default MessageInput;
