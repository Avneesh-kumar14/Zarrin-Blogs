import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile, Image as ImageIcon, X } from 'lucide-react';
import { socketService } from '../../utils/socketService';
import EmojiPicker from './EmojiPicker';

const MessageInput = ({ onSendMessage, isLoading, selectedConversation, onError = () => {} }) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const pickerRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [message]);

  // Fix emoji picker positioning - click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showEmojiPicker]);

  const handleTyping = (e) => {
    const value = e.target.value;
    setMessage(value);

    // Emit typing indicator
    try {
      socketService.emit('userTyping', { characterCount: value.length });
    } catch (err) {
      console.warn('Error emitting typing event:', err);
    }

    // Clear timeout and set new one
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      try {
        socketService.emit('userStoppedTyping', {});
      } catch (err) {
        console.warn('Error stopping typing:', err);
      }
    }, 1000);
  };

  const handleEmojiSelect = (emoji) => {
    const newMessage = message + emoji;
    setMessage(newMessage);
    setShowEmojiPicker(false);

    // Focus back on textarea
    if (textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    
    // BUG FIX: Validate file types and size
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
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
    if (e.target) e.target.value = '';
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
      const newPreviews = prev.filter((_, i) => i !== index);
      // Cleanup old preview URL - BUG FIX
      if (prev[index]) {
        URL.revokeObjectURL(prev[index]);
      }
      return newPreviews;
    });
  };

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    try {
      // BUG FIX: Better socket reconnection handling
      if (!socketService.isConnected()) {
        console.warn('⚠️ Socket not connected, attempting reconnect...');
        socketService.reconnect?.();
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (!socketService.isConnected()) {
          throw new Error('Socket connection unavailable. Please try again.');
        }
      }

      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('images', file);
      });

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
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Upload failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Images uploaded:', data);

      // Clear files after successful upload
      setSelectedFiles([]);
      previewUrls.forEach(url => URL.revokeObjectURL(url));
      setPreviewUrls([]);
      setMessage('');

      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } catch (error) {
      console.error('❌ Image upload error:', error);
      onError(`Failed to upload images: ${error.message}`, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendMessage = async () => {
    if (selectedFiles.length > 0) {
      await uploadFiles();
      return;
    }

    if (message.trim() && !isLoading && !isUploading) {
      onSendMessage(message.trim());
      setMessage('');
      
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }

      try {
        socketService.emit('userStoppedTyping', {});
      } catch (err) {
        console.warn('Error stopping typing:', err);
      }
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
    <div className="w-full border-t border-border-light bg-surface-primary dark:bg-surface-dark flex-shrink-0">
      {/* File previews - Smooth animations */}
      {previewUrls.length > 0 && (
        <div className="p-3 md:p-4 border-b border-border-light animate-in slide-in-from-bottom duration-300 bg-neutral-50 dark:bg-neutral-800">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
            {previewUrls.map((url, idx) => {
              const file = selectedFiles[idx];
              const isVideo = file?.type?.startsWith('video/');
              return (
                <div 
                  key={idx} 
                  className="relative group aspect-square rounded-lg overflow-hidden bg-neutral-200 dark:bg-neutral-700 ring-2 ring-transparent hover:ring-primary transition-all duration-200 animate-in fade-in scale-in-95 duration-300"
                >
                  {isVideo ? (
                    <video 
                      src={url} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                  )}
                  <button
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-200 rounded"
                    onClick={() => removeFile(idx)}
                    title="Remove file"
                  >
                    <X size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </button>
                </div>
              );
            })}
          </div>
          {selectedFiles.length > 0 && (
            <button
              className="mt-3 text-xs md:text-sm px-3 py-1.5 bg-error text-white hover:bg-red-600 rounded-lg transition-all duration-200 active:scale-95"
              onClick={() => {
                setSelectedFiles([]);
                previewUrls.forEach(url => URL.revokeObjectURL(url));
                setPreviewUrls([]);
              }}
            >
              Clear all
            </button>
          )}
        </div>
      )}

      {/* Input Area - Responsive padding and spacing */}
      <div className="flex items-end gap-2 sm:gap-2.5 md:gap-3 p-3 md:p-4">
        {/* Attach Button */}
        <button 
          className="p-2 md:p-2.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-all duration-200 flex-shrink-0 hover:scale-110 active:scale-95"
          title="Attach photos or videos"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon size={20} className="text-text-secondary" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        
        {/* Emoji Button - Better positioning */}
        <div className="relative">
          <button
            className={`p-2 md:p-2.5 rounded-lg transition-all duration-200 flex-shrink-0 hover:scale-110 active:scale-95 ${showEmojiPicker ? 'bg-neutral-100 dark:bg-neutral-800' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}
            title="Add emoji"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <Smile size={20} className="text-text-secondary" />
          </button>
          
          {/* Emoji Picker - Smooth transitions */}
          {showEmojiPicker && (
            <div 
              ref={pickerRef} 
              className="absolute bottom-full left-0 z-50 mb-2 animate-in fade-in zoom-in-95 duration-200 origin-bottom"
            >
              <EmojiPicker
                onEmojiSelect={handleEmojiSelect}
                onClose={() => setShowEmojiPicker(false)}
              />
            </div>
          )}
        </div>

        {/* Textarea - Optimized for all sizes */}
        <textarea
          ref={textareaRef}
          className="flex-1 resize-none px-3 md:px-4 py-2 md:py-3 text-sm md:text-base bg-neutral-100 dark:bg-neutral-800 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-primary transition-all duration-200"
          placeholder="Message... (Shift+Enter for new line)"
          value={message}
          onChange={handleTyping}
          onKeyPress={handleKeyPress}
          rows={1}
          disabled={isLoading || isUploading}
          style={{ minHeight: '38px', maxHeight: '100px' }}
        />

        {/* Send Button - Smooth interactions */}
        <button
          className={`p-2 md:p-2.5 text-white rounded-lg transition-all duration-200 flex-shrink-0 hover:scale-110 active:scale-95 ${
            canSend 
              ? 'bg-primary hover:bg-primary-dark hover:shadow-lg' 
              : 'bg-neutral-300 dark:bg-neutral-700 cursor-not-allowed'
          }`}
          onClick={handleSendMessage}
          disabled={!canSend}
          title="Send message"
        >
          {isUploading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send size={20} />
          )}
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
