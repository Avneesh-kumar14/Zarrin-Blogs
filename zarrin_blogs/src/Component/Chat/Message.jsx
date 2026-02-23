import React, { useState } from 'react';
import { Trash2, Edit, Smile, CheckCheck, Check } from 'lucide-react';
import { useChatContext } from '../../context/ChatContext';

const Message = ({ message, showAvatar, conversation }) => {
  const { deleteMessage, editMessage, addReaction } = useChatContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);
  const [showEmojis, setShowEmojis] = useState(false);

  // Get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const currentUserId = currentUser._id || currentUser.id;

  const handleDelete = () => {
    if (window.confirm('Delete this message?')) {
      deleteMessage(message._id);
    }
  };

  const handleEdit = () => {
    if (isEditing && editedContent !== message.content) {
      editMessage(message._id, editedContent);
    }
    setIsEditing(!isEditing);
  };

  const handleReaction = (emoji) => {
    addReaction(message._id, emoji);
    setShowEmojis(false);
  };

  const isSystemMessage = message.messageType === 'system';
  const senderName = message.senderId?.name || 'Unknown';
  const isSentByMe = message.senderId._id === currentUserId;

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex gap-2 mb-1 mx-1 md:mx-2 animate-in fade-in slide-in-from-bottom-2 duration-300 ${isSentByMe ? 'justify-end' : 'justify-start'}`}>
      {!isSentByMe && showAvatar && (
        <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-primary text-on-primary text-xs md:text-sm font-semibold flex items-center justify-center flex-shrink-0 shadow-sm">
          {message.senderId?.email?.[0]?.toUpperCase() || 'U'}
        </div>
      )}
      {!isSentByMe && !showAvatar && (
        <div className="w-8 h-8 md:w-9 md:h-9 flex-shrink-0"></div>
      )}

      <div className={`flex flex-col max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg ${isSentByMe ? 'items-end' : 'items-start'}`}>
        {!isSystemMessage && !isSentByMe && showAvatar && (
          <div className="text-xs font-bold text-text-secondary mb-1 capitalize px-2 opacity-70">{senderName}</div>
        )}

        <div className="relative group">
          <div className={`rounded-2xl px-3 py-2 md:px-4 md:py-2.5 break-words transition-all duration-200 ${
            isSentByMe 
              ? 'bg-primary text-white rounded-br-none shadow-md hover:shadow-lg hover:scale-105' 
              : 'bg-neutral-200 dark:bg-neutral-700 text-text-primary rounded-bl-none shadow-sm hover:shadow-md hover:scale-105 dark:shadow-sm'
          } ${isEditing ? 'ring-2 ring-primary' : ''}`}>
            {isEditing ? (
              <textarea
                className="w-full bg-surface-primary dark:bg-neutral-800 border-2 border-primary rounded px-2 py-1 text-sm font-sans resize-none focus:outline-none focus:ring-0"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                autoFocus
                rows={3}
              />
            ) : (
              <p className={`text-sm md:text-base leading-relaxed ${isSystemMessage ? 'text-xs text-text-secondary italic text-center' : ''}`}>
                {message.content}
              </p>
            )}

            {message.attachments?.map((attachmentUrl, idx) => {
              // Determine if attachment is video based on URL
              const isVideoFile = attachmentUrl.includes('.mp4') || 
                                 attachmentUrl.includes('.webm') || 
                                 attachmentUrl.includes('.mov') ||
                                 attachmentUrl.includes('video');
              
              return (
                <div key={idx} className="mt-2">
                  {isVideoFile ? (
                    <video 
                      src={attachmentUrl}
                      controls
                      className="max-w-xs sm:max-w-sm md:max-w-md rounded-lg bg-neutral-900 shadow-md hover:shadow-lg transition-shadow duration-200"
                    />
                  ) : (
                    <img 
                      src={attachmentUrl} 
                      alt={`Attachment ${idx + 1}`}
                      crossOrigin="anonymous"
                      referrerPolicy="no-referrer"
                      className="max-w-xs sm:max-w-sm md:max-w-md rounded-lg cursor-pointer hover:opacity-90 transition-opacity duration-200 shadow-md hover:shadow-lg"
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Message Actions - Smooth appear/disappear on hover */}
          {!isSystemMessage && (
            <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 transform origin-bottom -translate-y-1 group-hover:translate-y-0 flex gap-1 mt-1.5">
              {isEditing ? (
                <>
                  <button onClick={handleEdit} className="px-2 py-1 bg-success text-white text-xs rounded hover:bg-success-dark transition-colors duration-150 active:scale-95 shadow-sm">Save</button>
                  <button onClick={() => setIsEditing(false)} className="px-2 py-1 bg-neutral-400 text-white text-xs rounded hover:bg-neutral-500 transition-colors duration-150 active:scale-95 shadow-sm">Cancel</button>
                </>
              ) : (
                <>
                  <button
                    className="p-1.5 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded transition-all duration-150 hover:scale-110 active:scale-95"
                    onClick={() => setShowEmojis(!showEmojis)}
                    title="Add reaction"
                  >
                    <Smile size={14} />
                  </button>
                  {isSentByMe && (
                    <button
                        className="p-1.5 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded transition-all duration-150 hover:scale-110 active:scale-95"
                      onClick={handleEdit}
                      title="Edit message"
                    >
                      <Edit size={14} />
                    </button>
                  )}
                  {isSentByMe && (
                    <button
                        className="p-1.5 hover:bg-error-bg dark:hover:bg-red-900 rounded transition-all duration-150 hover:scale-110 active:scale-95"
                        onClick={handleDelete}
                        title="Delete message"
                      >
                        <Trash2 size={14} className="text-error" />
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Reactions - Smooth animations */}
        {message.reactions?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2 animate-in fade-in duration-300">
            {message.reactions.map((reaction, idx) => (
              <div key={idx} className="flex items-center gap-0.5 bg-neutral-100 dark:bg-neutral-700 border border-border-light rounded-full px-1.5 py-0.5 text-xs hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-all duration-150 hover:scale-110 cursor-pointer">
                <span>{reaction.emoji}</span>
                <span className="text-text-secondary text-xs font-medium">{reaction.users.length}</span>
              </div>
            ))}
          </div>
        )}

        {/* Emoji Picker */}
        {showEmojis && (
          <div className="absolute z-40 mt-1 bg-surface-primary dark:bg-neutral-800 border border-border-light rounded-lg p-2 shadow-lg flex flex-wrap gap-1 w-max animate-in fade-in zoom-in-50 duration-200">
            {['👍', '❤️', '😂', '😮', '😢', '😡'].map(emoji => (
              <button
                key={emoji}
                className="text-xl hover:bg-neutral-100 dark:hover:bg-neutral-700 p-1 rounded transition-all duration-150 hover:scale-125 active:scale-100"
                onClick={() => handleReaction(emoji)}
                title="Add reaction"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        {/* Message Meta - Smooth fade */}
        <div className="flex items-center gap-1 mt-1 text-xs text-text-secondary px-2 opacity-70 group-hover:opacity-100 transition-opacity duration-200">
          <span>{formatTime(message.createdAt)}</span>
          {isSentByMe && (
            <span title={message.isRead ? 'Read' : 'Delivered'} className="flex">
              {message.isRead ? <CheckCheck size={12} /> : <Check size={12} />}
            </span>
          )}
          {message.editHistory?.length > 0 && <span className="italic">(edited)</span>}
        </div>
      </div>
    </div>
  );
};

export default Message;
