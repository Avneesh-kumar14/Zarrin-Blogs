import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import socketService from '../utils/socketService';

const ChatContext = createContext();

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within ChatProvider');
  }
  return context;
};

const api = process.env.REACT_APP_API_URL || 'http://localhost:8200';

export const ChatProvider = ({ children, token }) => {
  // State management
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState(new Map());
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [unreadCounts, setUnreadCounts] = useState(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);

  // Initialize Socket connection
  useEffect(() => {
    if (token) {
      console.log('ChatProvider: Initializing socket connection with token');
      socketService.connect(token);

      // Setup listeners with connection tracking
      const handleSocketConnected = () => {
        console.log('🟢 Socket connected in ChatProvider');
        setSocketConnected(true);
      };

      const handleSocketDisconnected = (reason) => {
        console.log('🔴 Socket disconnected in ChatProvider:', reason);
        setSocketConnected(false);
      };

      const handleSocketError = (error) => {
        console.log('🟠 Socket error in ChatProvider:', error);
      };

      socketService.on('socketConnected', handleSocketConnected);
      socketService.on('socketDisconnected', handleSocketDisconnected);
      socketService.on('socketError', handleSocketError);
      socketService.on('newMessage', handleNewMessage);
      socketService.on('userOnline', handleUserOnline);
      socketService.on('userOffline', handleUserOffline);
      socketService.on('userIsTyping', handleUserTyping);
      socketService.on('userStoppedTyping', handleUserStoppedTyping);
      socketService.on('messagesRead', handleMessagesRead);
      socketService.on('messageDeleted', handleMessageDeleted);
      socketService.on('messageEdited', handleMessageEdited);
      socketService.on('reactionAdded', handleReactionAdded);
      socketService.on('userJoinedConversation', handleUserJoined);
      socketService.on('userLeftConversation', handleUserLeft);
      socketService.on('incomingCall', handleIncomingCall);
      socketService.on('callEnded', handleCallEnded);

      return () => {
        console.log('ChatProvider: Cleaning up socket connection');
        socketService.off('socketConnected', handleSocketConnected);
        socketService.off('socketDisconnected', handleSocketDisconnected);
        socketService.off('socketError', handleSocketError);
        socketService.disconnect();
      };
    } else {
      console.warn('ChatProvider: No token provided for socket connection');
      setSocketConnected(false);
    }
  }, [token]);

  // Fetch conversations
  const fetchConversations = useCallback(async (page = 1) => {
    try {
      if (!token) {
        console.warn('ChatContext: No token available for fetching conversations');
        setError('No authentication token');
        return;
      }

      setLoading(true);
      setError(null);
      console.log('Fetching conversations from:', `${api}/api/chat/conversations?page=${page}`);

      const response = await fetch(`${api}/api/chat/conversations?page=${page}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Conversations response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch conversations (${response.status})`);
      }

      const data = await response.json();
      console.log('Conversations fetched successfully:', data);
      setConversations(data.data || []);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Fetch messages for a conversation
  const fetchMessages = useCallback(async (conversationId, page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${api}/api/chat/conversations/${conversationId}/messages?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      setMessages(data.data);

      // Mark messages as read
      await fetch(
        `${api}/api/chat/conversations/${conversationId}/mark-read`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      socketService.markAsRead(conversationId);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Select a conversation
  const selectConversation = useCallback((conversation) => {
    setSelectedConversation(conversation);
    setMessages([]);
    socketService.joinConversation(conversation._id);
    fetchMessages(conversation._id);
  }, [fetchMessages]);

  // Send message
  const sendMessage = useCallback((content, attachments = []) => {
    if (!selectedConversation) {
      setError('No conversation selected');
      return;
    }

    socketService.sendMessage(selectedConversation._id, content, attachments);
  }, [selectedConversation]);

  // Delete message
  const deleteMessage = useCallback((messageId) => {
    if (!selectedConversation) return;
    socketService.deleteMessage(selectedConversation._id, messageId);
  }, [selectedConversation]);

  // Edit message
  const editMessage = useCallback((messageId, newContent) => {
    if (!selectedConversation) return;
    socketService.editMessage(selectedConversation._id, messageId, newContent);
  }, [selectedConversation]);

  // Add reaction
  const addReaction = useCallback((messageId, emoji) => {
    if (!selectedConversation) return;
    socketService.addReaction(selectedConversation._id, messageId, emoji);
  }, [selectedConversation]);

  // Create direct conversation
  const createDirectConversation = useCallback(async (otherUserId) => {
    try {
      console.log('Creating direct conversation with user:', otherUserId);
      const response = await fetch(`${api}/api/chat/conversations/direct/${otherUserId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to create conversation (${response.status})`);
      }

      const data = await response.json();
      console.log('Conversation created successfully:', data);
      setConversations(prev => [data.data, ...prev]);
      selectConversation(data.data);
    } catch (err) {
      console.error('Error creating conversation:', err);
      setError(err.message);
      alert(`Error creating conversation: ${err.message}`);
    }
  }, [token, selectConversation]);

  // Create group conversation
  const createGroupConversation = useCallback(async (groupName, participants, groupAvatar) => {
    try {
      const response = await fetch(`${api}/api/chat/conversations/group`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          conversationName: groupName,
          participants,
          groupAvatar
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create group conversation');
      }

      const data = await response.json();
      setConversations(prev => [data.data, ...prev]);
      selectConversation(data.data);
    } catch (err) {
      setError(err.message);
      console.error('Error creating group conversation:', err);
    }
  }, [token, selectConversation]);

  // Socket event handlers
  const handleNewMessage = (message) => {
    setMessages(prev => [...prev, message]);
  };

  const handleUserOnline = (data) => {
    setOnlineUsers(prev => new Set([...prev, data.userId]));
  };

  const handleUserOffline = (data) => {
    setOnlineUsers(prev => {
      const newSet = new Set(prev);
      newSet.delete(data.userId);
      return newSet;
    });
  };

  const handleUserTyping = (data) => {
    if (selectedConversation && data.conversationId === selectedConversation._id) {
      setTypingUsers(prev => new Map(prev).set(data.userId, data.username));
    }
  };

  const handleUserStoppedTyping = (data) => {
    if (selectedConversation && data.conversationId === selectedConversation._id) {
      setTypingUsers(prev => {
        const newMap = new Map(prev);
        newMap.delete(data.userId);
        return newMap;
      });
    }
  };

  const handleMessagesRead = (data) => {
    // Update UI to show read status
  };

  const handleMessageDeleted = (data) => {
    if (selectedConversation && data.conversationId === selectedConversation._id) {
      setMessages(prev => prev.filter(msg => msg._id !== data.messageId));
    }
  };

  const handleMessageEdited = (data) => {
    if (selectedConversation && data.conversationId === selectedConversation._id) {
      setMessages(prev =>
        prev.map(msg =>
          msg._id === data.messageId ? { ...msg, content: data.content } : msg
        )
      );
    }
  };

  const handleReactionAdded = (data) => {
    if (selectedConversation && data.conversationId === selectedConversation._id) {
      setMessages(prev =>
        prev.map(msg =>
          msg._id === data.messageId ? { ...msg, reactions: data.reactions } : msg
        )
      );
    }
  };

  const handleUserJoined = (data) => {
    // Handle user joined group
  };

  const handleUserLeft = (data) => {
    // Handle user left group
  };

  const handleIncomingCall = (data) => {
    // Handle incoming call
  };

  const handleCallEnded = (data) => {
    // Handle call ended
  };

  const handleSocketError = (error) => {
    setError(error.message);
  };

  // Context value
  const value = {
    conversations,
    selectedConversation,
    messages,
    typingUsers,
    onlineUsers,
    unreadCounts,
    loading,
    error,
    searchQuery,
    socketConnected,
    setSearchQuery,
    fetchConversations,
    fetchMessages,
    selectConversation,
    sendMessage,
    deleteMessage,
    editMessage,
    addReaction,
    createDirectConversation,
    createGroupConversation
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
