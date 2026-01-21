import React from 'react';
import { useChatContext } from '../../context/ChatContext';
import './ChatDebug.css';

const ChatDebug = () => {
  const {
    socketConnected,
    loading,
    error,
    conversations,
    selectedConversation
  } = useChatContext();

  return (
    <div className="chat-debug-panel">
      <div className="debug-header">Debug Info</div>
      
      <div className={`debug-item ${socketConnected ? 'success' : 'error'}`}>
        <span className="debug-label">Socket:</span>
        <span className="debug-value">
          {socketConnected ? '🟢 Connected' : '🔴 Disconnected'}
        </span>
      </div>

      <div className={`debug-item ${loading ? 'warning' : 'success'}`}>
        <span className="debug-label">Loading:</span>
        <span className="debug-value">
          {loading ? '⏳ Loading...' : '✅ Done'}
        </span>
      </div>

      <div className={`debug-item ${error ? 'error' : 'success'}`}>
        <span className="debug-label">Error:</span>
        <span className="debug-value">
          {error ? `❌ ${error}` : '✅ None'}
        </span>
      </div>

      <div className="debug-item">
        <span className="debug-label">Conversations:</span>
        <span className="debug-value">{conversations.length}</span>
      </div>

      <div className="debug-item">
        <span className="debug-label">Selected:</span>
        <span className="debug-value">
          {selectedConversation ? selectedConversation._id.substring(0, 8) : 'None'}
        </span>
      </div>

      <div className="debug-hint">
        Open DevTools (F12) → Console to see detailed logs
      </div>
    </div>
  );
};

export default ChatDebug;
