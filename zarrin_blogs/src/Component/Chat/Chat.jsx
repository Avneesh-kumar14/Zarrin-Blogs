import React, { useEffect } from 'react';
import { useChatContext } from '../../context/ChatContext';
import ConversationList from './ConversationList';
import ChatWindow from './ChatWindow';
import './Chat.css';

const Chat = ({ userToken }) => {
  const {
    conversations,
    selectedConversation,
    loading,
    error,
    fetchConversations
  } = useChatContext();

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return (
    <div className="chat-container">
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
