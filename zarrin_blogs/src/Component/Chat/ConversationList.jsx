import React, { useState, useMemo } from 'react';
import { Search, Plus } from 'lucide-react';
import { useChatContext } from '../../context/ChatContext';
import ConversationItem from './ConversationItem';
import CreateConversationModal from './CreateConversationModal';
import './ConversationList.css';

const ConversationList = ({ conversations, loading, error }) => {
  const { searchQuery, setSearchQuery } = useChatContext();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredConversations = useMemo(() => {
    if (!searchQuery) return conversations;
    
    return conversations.filter(conv => {
      const name = conv.conversationName || 
        conv.participants
          .map(p => p.name)
          .join(', ');
      return name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [conversations, searchQuery]);

  return (
    <div className="conversation-list">
      {/* Header */}
      <div className="conversation-list-header">
        <h1>Messages</h1>
        <button 
          className="btn-new-conversation"
          onClick={() => setShowCreateModal(true)}
          title="New Conversation"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Conversations List */}
      <div className="conversations-scroll">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading conversations...</p>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="no-conversations">
            <p>No conversations yet</p>
            <small>Start a new conversation to begin messaging</small>
          </div>
        ) : (
          filteredConversations.map(conversation => (
            <ConversationItem
              key={conversation._id}
              conversation={conversation}
            />
          ))
        )}
      </div>

      {/* Create Conversation Modal */}
      {showCreateModal && (
        <CreateConversationModal
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
};

export default ConversationList;
