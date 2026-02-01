import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useChatContext } from '../../context/ChatContext';

const api = process.env.REACT_APP_API_BASE_URL || 'https://zarrin-blogs-backend.onrender.com';

const CreateConversationModal = ({ onClose }) => {
  const { createDirectConversation, createGroupConversation } = useChatContext();
  const [mode, setMode] = useState('direct'); // 'direct' or 'group'
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // eslint-disable-line no-unused-vars

  // Fetch available users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const response = await fetch(`${api}/api/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`);
      }
      const data = await response.json();
      // Handle both array and object with data property
      const usersList = Array.isArray(data) ? data : (data.data || []);
      // Filter out current user
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const currentUserId = currentUser._id;
      const filteredList = usersList.filter(user => user._id !== currentUserId);
      setUsers(filteredList);
      console.log('Fetched users:', filteredList);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error.message);
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
    try {
      if (mode === 'direct' && selectedUsers.length === 1) {
        console.log('🟡 Starting direct conversation creation');
        await createDirectConversation(selectedUsers[0]);
        console.log('✅ Direct conversation created');
        // Give async operation time to complete
        setTimeout(() => {
          onClose();
        }, 500);
      } else if (mode === 'group' && selectedUsers.length > 0 && groupName.trim()) {
        console.log('🟡 Starting group conversation creation');
        await createGroupConversation(groupName, selectedUsers);
        console.log('✅ Group conversation created');
        // Give async operation time to complete
        setTimeout(() => {
          onClose();
        }, 500);
      } else {
        setError('Please select at least one user' + (mode === 'group' ? ' and enter a group name' : ''));
      }
    } catch (err) {
      console.error('❌ Error creating conversation:', err);
      setError(err.message || 'Failed to create conversation');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-96 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-5 border-b border-gray-200">
          <h2 className="text-lg md:text-xl font-bold text-gray-900">New Conversation</h2>
          <button className="p-1 hover:bg-gray-100 rounded-lg transition" onClick={onClose}>
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4">
          {/* Mode Selector */}
          <div className="flex gap-2 border-b border-gray-200 pb-4">
            <button
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                mode === 'direct'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => {
                setMode('direct');
                setSelectedUsers([]);
                setGroupName('');
              }}
            >
              Direct Message
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                mode === 'group'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
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
              placeholder="Group name (e.g., 'Project Team')"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
            />
          )}

          {/* User Search */}
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
          />

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              ⚠️ {error}
            </div>
          )}

          {/* Users List */}
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-3 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                <span className="ml-2 text-gray-600 text-sm">Loading users...</span>
              </div>
            ) : users.length === 0 ? (
              <p className="text-center text-gray-500 py-8 text-sm">No users available</p>
            ) : filteredUsers.length === 0 ? (
              <p className="text-center text-gray-500 py-8 text-sm">No users found matching your search</p>
            ) : (
              filteredUsers.map(user => (
                <label
                  key={user._id}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition"
                >
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user._id)}
                    onChange={() => handleUserSelect(user._id)}
                    disabled={mode === 'direct' && selectedUsers.length === 1 && !selectedUsers.includes(user._id)}
                    className="w-4 h-4 rounded cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 text-sm truncate">{user.name}</div>
                    <div className="text-xs text-gray-600 truncate">{user.email}</div>
                  </div>
                </label>
              ))
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 p-4 md:p-5 border-t border-gray-200 bg-gray-50">
          <button
            className="flex-1 px-4 py-2 text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-100 transition text-sm md:text-base"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={`flex-1 px-4 py-2 font-medium rounded-lg text-white transition text-sm md:text-base ${
              (mode === 'direct' && selectedUsers.length === 1) ||
              (mode === 'group' && selectedUsers.length > 0 && groupName.trim())
                ? 'bg-blue-500 hover:bg-blue-600 cursor-pointer'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
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
