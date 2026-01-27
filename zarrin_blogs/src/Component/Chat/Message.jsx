import React, { useState } from 'react';
import { Trash2, Edit, Smile, CheckCheck, Check } from 'lucide-react';
import { useChatContext } from '../../context/ChatContext';
import './Message.css';

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
    <div className={`message-wrapper ${isSentByMe ? 'sent' : 'received'}`}>
      {!isSentByMe && showAvatar && (
        <div className="message-avatar">
          {message.senderId?.email?.[0]?.toUpperCase() || 'U'}
        </div>
      )}

      <div className={`message ${isSentByMe ? 'own-message' : 'other-message'}`}>
        {!isSystemMessage && !isSentByMe && showAvatar && (
          <div className="message-sender">{senderName}</div>
        )}

        <div className="message-content">
          {isEditing ? (
            <textarea
              className="edit-textarea"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              autoFocus
            />
          ) : (
            <p className={isSystemMessage ? 'system-message' : ''}>
              {message.content}
            </p>
          )}

          {message.attachments?.map((attachmentUrl, idx) => {
            // Determine if attachment is video based on URL or MIME type
            const isVideoFile = attachmentUrl.includes('.mp4') || 
                               attachmentUrl.includes('.webm') || 
                               attachmentUrl.includes('.mov') ||
                               attachmentUrl.includes('video');
            
            return (
              <div key={idx} className="message-attachment">
                {isVideoFile ? (
                  <video 
                    src={attachmentUrl}
                    controls
                    style={{
                      maxWidth: '300px',
                      maxHeight: '300px',
                      borderRadius: '12px',
                      display: 'block'
                    }}
                  />
                ) : (
                  <img 
                    src={attachmentUrl} 
                    alt={`Attachment ${idx + 1}`}
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Reactions */}
        {message.reactions?.length > 0 && (
          <div className="message-reactions">
            {message.reactions.map((reaction, idx) => (
              <div key={idx} className="reaction">
                <span>{reaction.emoji}</span>
                <span className="reaction-count">{reaction.users.length}</span>
              </div>
            ))}
          </div>
        )}

        {/* Message Actions */}
        {!isSystemMessage && (
          <div className="message-actions">
            {isEditing ? (
              <>
                <button onClick={handleEdit} className="btn-save">Save</button>
                <button onClick={() => setIsEditing(false)} className="btn-cancel">Cancel</button>
              </>
            ) : (
              <>
                <button
                  className="btn-action"
                  onClick={() => setShowEmojis(!showEmojis)}
                  title="Add reaction"
                >
                  <Smile size={16} />
                </button>
                {isSentByMe && (
                  <button
                    className="btn-action"
                    onClick={handleEdit}
                    title="Edit message"
                  >
                    <Edit size={16} />
                  </button>
                )}
                {isSentByMe && (
                  <button
                    className="btn-action"
                    onClick={handleDelete}
                    title="Delete message"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </>
            )}
          </div>
        )}

        {/* Emoji Picker */}
        {showEmojis && (
          <div className="emoji-picker">
            {['👍', '❤️', '😂', '😮', '😢', '😡'].map(emoji => (
              <button
                key={emoji}
                className="emoji-button"
                onClick={() => handleReaction(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        <div className="message-meta">
          <span className="message-time">{formatTime(message.createdAt)}</span>
          {isSentByMe && (
            <span className="message-status" title={message.isRead ? 'Read' : 'Delivered'}>
              {message.isRead ? <CheckCheck size={16} /> : <Check size={16} />}
            </span>
          )}
          {message.editHistory?.length > 0 && <span className="edited-badge">(edited)</span>}
        </div>
      </div>
    </div>
  );
};

export default Message;
