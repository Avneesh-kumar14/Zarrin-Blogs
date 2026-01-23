import React, { useState } from 'react';
import { Trash2, Edit, Smile } from 'lucide-react';
import { useChatContext } from '../../context/ChatContext';
import './Message.css';

const Message = ({ message, showAvatar, conversation }) => {
  const { deleteMessage, editMessage, addReaction } = useChatContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);
  const [showEmojis, setShowEmojis] = useState(false);

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

  return (
    <div className={`message-wrapper ${message.senderId._id === conversation._id ? 'own' : ''}`}>
      {showAvatar && (
        <div className="message-avatar">
          {message.senderId?.email?.[0]?.toUpperCase() || 'U'}
        </div>
      )}

      <div className={`message ${message.senderId._id === conversation._id ? 'own-message' : 'other-message'}`}>
        {!isSystemMessage && showAvatar && (
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

          {message.attachments?.map((attachmentUrl, idx) => (
            <div key={idx} className="message-attachment">
              <img 
                src={attachmentUrl} 
                alt={`Attachment ${idx + 1}`}
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
              />
            </div>
          ))}
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
                <button
                  className="btn-action"
                  onClick={handleEdit}
                  title="Edit message"
                >
                  <Edit size={16} />
                </button>
                <button
                  className="btn-action"
                  onClick={handleDelete}
                  title="Delete message"
                >
                  <Trash2 size={16} />
                </button>
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

        <div className="message-time">
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
          {message.editHistory?.length > 0 && <span className="edited">(edited)</span>}
        </div>
      </div>
    </div>
  );
};

export default Message;
