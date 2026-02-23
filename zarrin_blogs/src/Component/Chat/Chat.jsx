import React, { useEffect, useState } from 'react';
import { useChatContext } from '../../context/ChatContext';
import { ArrowLeft } from 'lucide-react';
import ConversationList from './ConversationList';
import ChatWindow from './ChatWindow';

const Chat = ({ userToken }) => {
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);
  const {
    conversations,
    selectedConversation,
    loading,
    error,
    socketConnected,
    fetchConversations
  } = useChatContext();

  useEffect(() => {
    const loadConversations = async () => {
      try {
        console.log('🟡 Chat component: Fetching conversations (socket connected:', socketConnected, ')');
        await fetchConversations();
      } catch (err) {
        console.error('❌ Failed to load conversations:', err);
      }
    };

    // Wait for socket to be ready before fetching
    if (socketConnected) {
      console.log('🟢 Socket connected, loading conversations');
      loadConversations();
    } else {
      console.log('🟡 Waiting for socket connection...');
      // Set a timeout in case socket doesn't connect
      const timeout = setTimeout(() => {
        console.log('⏱️ Socket connection timeout, loading anyway');
        loadConversations();
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [socketConnected, fetchConversations]);

  // Show chat on mobile when selected
  useEffect(() => {
    if (selectedConversation) {
      setShowChatOnMobile(true);
    }
  }, [selectedConversation]);

  const handleBackToList = () => {
    setShowChatOnMobile(false);
  };

  return (
    <div className="w-full bg-neutral-50 dark:bg-neutral-900 overflow-hidden" style={{ height: 'calc(100vh - 80px)' }}>
      <div className="flex w-full h-full overflow-hidden">
        {/* Conversation List Sidebar - Hidden on mobile when chat is open */}
        <div className={`${showChatOnMobile ? 'hidden md:flex' : 'flex'} w-full md:w-80 lg:w-96 bg-surface-primary dark:bg-surface-dark border-r border-border-light flex-col overflow-hidden transition-all duration-300`}>
          <ConversationList 
            conversations={conversations}
            loading={loading}
            error={error}
          />
        </div>

        {/* Chat Window - Shown on mobile when selected, always visible on desktop */}
        <div className={`${showChatOnMobile ? 'flex' : 'hidden md:flex'} flex-1 flex-col bg-surface-primary dark:bg-surface-dark transform transition-all duration-300 ease-out overflow-hidden`}>
          {selectedConversation ? (
            <>
              {/* Back Button for Mobile */}
              <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-border-light bg-surface-primary dark:bg-surface-dark h-14 flex-shrink-0">
                <button
                  onClick={handleBackToList}
                  className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-all duration-200 text-text-primary active:scale-95"
                  title="Back to conversations"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <span className="text-sm font-semibold text-text-primary truncate">
                  {selectedConversation.participantName || selectedConversation.groupName || 'Chat'}
                </span>
              </div>
              <ChatWindow conversation={selectedConversation} />
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-text-secondary">
              <div className="text-6xl sm:text-7xl mb-4 opacity-50 animate-pulse">💬</div>
              <h2 className="text-lg sm:text-xl font-semibold mb-2 text-text-primary px-4">Select a conversation to start</h2>
              <p className="text-xs sm:text-sm text-text-secondary px-4">Choose from your existing conversations or start a new one</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
