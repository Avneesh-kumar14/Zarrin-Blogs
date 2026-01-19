import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useChatContext } from '../../context/ChatContext';
import './CreateConversationModal.css';

const CreateConversationModal = ({ onClose }) => {
  const { createDirectConversation, createGroupConversation } = useChatContext();
  const [mode, setMode] = useState('direct'); // 'direct' or 'group'
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch available users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setUsers(data.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUserSelect = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreateConversation = async () => {
    if (mode === 'direct' && selectedUsers.length === 1) {
      await createDirectConversation(selectedUsers[0]);
      onClose();
    } else if (mode === 'group' && selectedUsers.length > 0 && groupName.trim()) {
      await createGroupConversation(groupName, selectedUsers);
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>New Conversation</h2>
          <button className="btn-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-content">
          {/* Mode Selector */}
          <div className="mode-selector">
            <button
              className={`mode-btn ${mode === 'direct' ? 'active' : ''}`}
              onClick={() => {
                setMode('direct');
                setSelectedUsers([]);
                setGroupName('');
              }}
            >
              Direct Message
            </button>
            <button
              className={`mode-btn ${mode === 'group' ? 'active' : ''}`}
              onClick={() => {
                setMode('group');
                setSelectedUsers([]);
                setGroupName('');
              }}
            >
              Group Chat
            </button>
          </div>

          {/* Group Name Input */}
          {mode === 'group' && (
            <input
              type="text"
              placeholder="Group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="group-name-input"
            />
          )}

          {/* User Search */}
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="user-search-input"
          />

          {/* Users List */}
          <div className="users-list">
            {loading ? (
              <p>Loading users...</p>
            ) : filteredUsers.length === 0 ? (
              <p>No users found</p>
            ) : (
              filteredUsers.map(user => (
                <label key={user._id} className="user-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user._id)}
                    onChange={() => handleUserSelect(user._id)}
                    disabled={mode === 'direct' && selectedUsers.length === 1 && !selectedUsers.includes(user._id)}
                  />
                  <span className="user-info">
                    <strong>{user.name}</strong>
                    <small>{user.email}</small>
                  </span>
                </label>
              ))
            )}
          </div>
        </div>

        <div className="modal-actions">
          <button
            className="btn-cancel"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="btn-create"
            onClick={handleCreateConversation}
            disabled={
              (mode === 'direct' && selectedUsers.length !== 1) ||
              (mode === 'group' && (selectedUsers.length === 0 || !groupName.trim()))
            }
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateConversationModal;
