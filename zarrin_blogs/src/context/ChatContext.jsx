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

const api = process.env.REACT_APP_API_BASE_URL || 'https://zarrin-blogs-backend.onrender.com';

export const ChatProvider = ({ children, token }) => {
  // State management
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState(new Map());
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  // eslint-disable-next-line no-unused-vars
  const [unreadCounts, setUnreadCounts] = useState(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);

  // Socket event handlers wrapped in useCallback (defined first to avoid 'used before define' errors)
  const handleNewMessage = useCallback((message) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const handleUserOnline = useCallback((data) => {
    setOnlineUsers(prev => new Set([...prev, data.userId]));
  }, []);

  const handleUserOffline = useCallback((data) => {
    setOnlineUsers(prev => {
      const newSet = new Set(prev);
      newSet.delete(data.userId);
      return newSet;
    });
  }, []);

  const handleUserTyping = useCallback((data) => {
    if (selectedConversation && data.conversationId === selectedConversation._id) {
      setTypingUsers(prev => new Map(prev).set(data.userId, data.username));
    }
  }, [selectedConversation]);

  const handleUserStoppedTyping = useCallback((data) => {
    if (selectedConversation && data.conversationId === selectedConversation._id) {
      setTypingUsers(prev => {
        const newMap = new Map(prev);
        newMap.delete(data.userId);
        return newMap;
      });
    }
  }, [selectedConversation]);

  const handleMessagesRead = useCallback((data) => {
    // Update UI to show read status
  }, []);

  const handleMessageDeleted = useCallback((data) => {
    if (selectedConversation && data.conversationId === selectedConversation._id) {
      setMessages(prev => prev.filter(msg => msg._id !== data.messageId));
    }
  }, [selectedConversation]);

  const handleMessageEdited = useCallback((data) => {
    if (selectedConversation && data.conversationId === selectedConversation._id) {
      setMessages(prev =>
        prev.map(msg =>
          msg._id === data.messageId ? { ...msg, content: data.content } : msg
        )
      );
    }
  }, [selectedConversation]);

  const handleReactionAdded = useCallback((data) => {
    if (selectedConversation && data.conversationId === selectedConversation._id) {
      setMessages(prev =>
        prev.map(msg =>
          msg._id === data.messageId ? { ...msg, reactions: data.reactions } : msg
        )
      );
    }
  }, [selectedConversation]);

  const handleUserJoined = useCallback((data) => {
    // Handle user joined group
  }, []);

  const handleUserLeft = useCallback((data) => {
    // Handle user left group
  }, []);

  const handleIncomingCall = useCallback((data) => {
    // Handle incoming call
  }, []);

  const handleCallEnded = useCallback((data) => {
    // Handle call ended
  }, []);

  // eslint-disable-next-line no-unused-vars
  const handleSocketError = useCallback((error) => {
    setError(error.message);
  }, []);

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
        // Don't set error to avoid blocking UI
      };

      socketService.on('socketConnected', handleSocketConnected);
      socketService.on('socketDisconnected', handleSocketDisconnected);
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
        console.log('ChatProvider: Cleaning up socket listeners');
        socketService.off('socketConnected', handleSocketConnected);
        socketService.off('socketDisconnected', handleSocketDisconnected);
        // Don't disconnect socket on cleanup - let it reconnect automatically
        // socketService.disconnect();
      };
    } else {
      console.warn('ChatProvider: No token provided for socket connection');
      setSocketConnected(false);
    }
  }, [token, handleNewMessage, handleUserOnline, handleUserOffline, handleUserTyping, handleUserStoppedTyping, handleMessagesRead, handleMessageDeleted, handleMessageEdited, handleReactionAdded, handleUserJoined, handleUserLeft, handleIncomingCall, handleCallEnded]);

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
      console.log('🟡 Creating direct conversation with user:', otherUserId);
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${api}/api/chat/conversations/direct/${otherUserId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Direct conversation response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.message || `Failed to create conversation (${response.status})`;
        console.error('❌ Error response:', errorData);
        throw new Error(errorMsg);
      }

      const data = await response.json();
      console.log('✅ Conversation created successfully:', data);
      
      if (!data.data) {
        throw new Error('No conversation data in response');
      }

      // Add to conversations list
      setConversations(prev => {
        const exists = prev.some(c => c._id === data.data._id);
        if (exists) return prev;
        return [data.data, ...prev];
      });
      
      // Select the new conversation
      selectConversation(data.data);
      console.log('🟢 Direct conversation ready:', data.data._id);
      
    } catch (err) {
      console.error('❌ Error creating conversation:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, selectConversation]);

  // Create group conversation
  const createGroupConversation = useCallback(async (groupName, participants, groupAvatar) => {
    try {
      console.log('🟡 Creating group conversation:', groupName);
      setLoading(true);
      setError(null);
      
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

      console.log('✅ Group conversation response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.message || `Failed to create group conversation (${response.status})`;
        console.error('❌ Error response:', errorData);
        throw new Error(errorMsg);
      }

      const data = await response.json();
      console.log('✅ Group conversation created successfully:', data);
      
      if (!data.data) {
        throw new Error('No conversation data in response');
      }

      // Add to conversations list
      setConversations(prev => {
        const exists = prev.some(c => c._id === data.data._id);
        if (exists) return prev;
        return [data.data, ...prev];
      });
      
      // Select the new conversation
      selectConversation(data.data);
      console.log('🟢 Group conversation ready:', data.data._id);
      
    } catch (err) {
      console.error('❌ Error creating group conversation:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, selectConversation]);

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
