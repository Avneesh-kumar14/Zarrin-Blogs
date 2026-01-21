import React, { useEffect, useState } from 'react';
import { useChatContext } from '../../context/ChatContext';
import ConversationList from './ConversationList';
import ChatWindow from './ChatWindow';
import ChatDebug from './ChatDebug';
import './Chat.css';

const Chat = ({ userToken }) => {
  const {
    conversations,
    selectedConversation,
    loading,
    error,
    socketConnected,
    fetchConversations
  } = useChatContext();
  const [conversationError, setConversationError] = useState(null);

  useEffect(() => {
    const loadConversations = async () => {
      try {
        console.log('🟡 Chat component: Fetching conversations (socket connected:', socketConnected, ')');
        await fetchConversations();
      } catch (err) {
        console.error('❌ Failed to load conversations:', err);
        setConversationError('Failed to load conversations');
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

  return (
    <div className="chat-container">
      {/* Debug Panel */}
      <ChatDebug />
      
      <div className="chat-wrapper">
        {/* Conversation List Sidebar */}
        <div className="chat-sidebar">
          <ConversationList 
            conversations={conversations}
            loading={loading}
            error={error}
          />
        </div>

        {/* Chat Window */}
        <div className="chat-main">
          {selectedConversation ? (
            <ChatWindow conversation={selectedConversation} />
          ) : (
            <div className="no-conversation">
              <div className="no-conversation-icon">💬</div>
              <h2>Select a conversation to start messaging</h2>
              <p>Choose from your existing conversations or start a new one</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
