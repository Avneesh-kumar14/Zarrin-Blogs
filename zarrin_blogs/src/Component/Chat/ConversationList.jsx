import React, { useState, useMemo } from 'react';
import { Search, Plus } from 'lucide-react';
import { useChatContext } from '../../context/ChatContext';
import ConversationItem from './ConversationItem';
import CreateConversationModal from './CreateConversationModal';

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
    <div className="flex flex-col h-full w-full bg-surface-primary dark:bg-surface-dark overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 md:p-5 border-b border-border-light flex-shrink-0">
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary truncate">Messages</h1>
        <button 
          className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full bg-primary text-white hover:bg-primary-dark transition-all duration-200 hover:scale-110 active:scale-95 flex-shrink-0 shadow-md hover:shadow-lg"
          onClick={() => setShowCreateModal(true)}
          title="New Conversation"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 p-3 md:p-4 mx-2 md:mx-3 bg-neutral-100 dark:bg-neutral-800 rounded-full flex-shrink-0 shadow-sm">
        <Search size={18} className="text-text-secondary flex-shrink-0" />
        <input
          type="text"
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent outline-none flex-1 text-sm md:text-base text-text-primary placeholder-text-secondary"
        />
      </div>

      {/* Conversations List - Smooth scrolling */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-700 scrollbar-track-transparent">
        {error && (
          <div className="p-4 mx-2 mt-2 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-200 text-sm animate-in slide-in-from-top duration-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center p-10 text-text-secondary">
            <div className="w-12 h-12 border-4 border-border-light border-t-primary rounded-full animate-spin mb-3"></div>
            <p className="text-sm md:text-base">Loading conversations...</p>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-10 text-text-secondary text-center animate-in fade-in duration-500">
            <div className="text-4xl mb-3 opacity-40">💬</div>
            <p className="font-medium text-text-primary text-sm md:text-base">No conversations yet</p>
            <small className="text-xs md:text-sm">Start a new conversation to begin messaging</small>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredConversations.map((conversation, index) => (
              <div key={conversation._id} className="animate-in fade-in slide-in-from-bottom duration-300" style={{ animationDelay: `${index * 30}ms` }}>
                <ConversationItem conversation={conversation} />
              </div>
            ))}
          </div>
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
