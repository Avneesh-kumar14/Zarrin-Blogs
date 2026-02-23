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
    <div className={`flex gap-2 mb-3 ml-1 mr-1 md:ml-2 md:mr-2 animate-in slide-in-from-bottom-1 ${isSentByMe ? 'justify-end' : 'justify-start'}`}>
      {!isSentByMe && showAvatar && (
        <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-primary text-on-primary text-xs md:text-sm font-semibold flex items-center justify-center flex-shrink-0">
          {message.senderId?.email?.[0]?.toUpperCase() || 'U'}
        </div>
      )}
      {!isSentByMe && !showAvatar && (
        <div className="w-8 h-8 md:w-9 md:h-9 flex-shrink-0"></div>
      )}

      <div className={`flex flex-col max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg ${isSentByMe ? 'items-end' : 'items-start'}`}>
        {!isSystemMessage && !isSentByMe && showAvatar && (
          <div className="text-xs font-bold text-text-secondary mb-1 capitalize px-2">{senderName}</div>
        )}

        <div className="relative group">
          <div className={`rounded-2xl px-3 py-2 md:px-4 md:py-2 break-words ${
            isSentByMe 
              ? 'bg-success-bg text-text-primary rounded-br-none' 
              : 'bg-neutral-200 text-text-primary rounded-bl-none'
          }`}>
            {isEditing ? (
              <textarea
                className="w-full bg-surface-primary border border-border-default rounded px-2 py-1 text-sm font-sans resize-none"
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
                      className="max-w-xs sm:max-w-sm md:max-w-md rounded-lg bg-neutral-900"
                    />
                  ) : (
                    <img 
                      src={attachmentUrl} 
                      alt={`Attachment ${idx + 1}`}
                      crossOrigin="anonymous"
                      referrerPolicy="no-referrer"
                      className="max-w-xs sm:max-w-sm md:max-w-md rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Message Actions - Hidden by default, shown on hover */}
          {!isSystemMessage && (
            <div className="hidden group-hover:flex gap-1 mt-1">
              {isEditing ? (
                <>
                  <button onClick={handleEdit} className="px-2 py-1 bg-success text-white text-xs rounded hover:bg-success-dark transition">Save</button>
                  <button onClick={() => setIsEditing(false)} className="px-2 py-1 bg-neutral-400 text-white text-xs rounded hover:bg-neutral-500 transition">Cancel</button>
                </>
              ) : (
                <>
                  <button
                    className="p-1.5 hover:bg-neutral-300 rounded transition"
                    onClick={() => setShowEmojis(!showEmojis)}
                    title="Add reaction"
                  >
                    <Smile size={14} />
                  </button>
                  {isSentByMe && (
                    <button
                        className="p-1.5 hover:bg-neutral-300 rounded transition"
                      onClick={handleEdit}
                      title="Edit message"
                    >
                      <Edit size={14} />
                    </button>
                  )}
                  {isSentByMe && (
                    <button
                        className="p-1.5 hover:bg-error-bg rounded transition"
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

        {/* Reactions */}
        {message.reactions?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {message.reactions.map((reaction, idx) => (
              <div key={idx} className="flex items-center gap-0.5 bg-surface-primary border border-border-default rounded-full px-1.5 py-0.5 text-xs hover:bg-neutral-50 transition">
                <span>{reaction.emoji}</span>
                <span className="text-text-secondary text-xs">{reaction.users.length}</span>
              </div>
            ))}
          </div>
        )}

        {/* Emoji Picker */}
        {showEmojis && (
          <div className="absolute z-40 mt-1 bg-surface-primary border border-border-default rounded-lg p-2 shadow-lg flex flex-wrap gap-1 w-max">
            {['👍', '❤️', '😂', '😮', '😢', '😡'].map(emoji => (
              <button
                key={emoji}
                className="text-xl hover:bg-neutral-100 p-1 rounded transition"
                onClick={() => handleReaction(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        {/* Message Meta */}
        <div className="flex items-center gap-1 mt-1 text-xs text-text-secondary px-2">
          <span>{formatTime(message.createdAt)}</span>
          {isSentByMe && (
            <span title={message.isRead ? 'Read' : 'Delivered'}>
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
