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
    <div className="h-screen w-full flex bg-gray-100">
      <div className="flex w-full h-full">
        {/* Conversation List Sidebar - Hidden on mobile when chat is open */}
        <div className={`${showChatOnMobile ? 'hidden md:flex' : 'flex'} w-full md:w-80 lg:w-96 bg-white border-r border-gray-200 flex-col overflow-hidden`}>
          <ConversationList 
            conversations={conversations}
            loading={loading}
            error={error}
          />
        </div>

        {/* Chat Window - Shown on mobile when selected, always visible on desktop */}
        <div className={`${showChatOnMobile ? 'flex' : 'hidden md:flex'} flex-1 flex-col bg-white`}>
          {selectedConversation ? (
            <>
              {/* Back Button for Mobile */}
              <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-white">
                <button
                  onClick={handleBackToList}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700"
                  title="Back to conversations"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <span className="text-sm font-semibold text-gray-900">
                  {selectedConversation.participantName || selectedConversation.groupName || 'Chat'}
                </span>
              </div>
              <ChatWindow conversation={selectedConversation} />
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-600">
              <div className="text-6xl mb-4 opacity-50">💬</div>
              <h2 className="text-xl font-semibold mb-2 text-gray-900">Select a conversation to start messaging</h2>
              <p className="text-sm text-gray-500">Choose from your existing conversations or start a new one</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
