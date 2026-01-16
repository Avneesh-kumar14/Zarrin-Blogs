import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const API_URL = process.env.REACT_APP_API_BASE_URL ? `${process.env.REACT_APP_API_BASE_URL}/api` : 'http://localhost:8200/api';
  const token = localStorage.getItem('token');

  // Fetch user settings on mount
  useEffect(() => {
    if (token) {
      fetchUserSettings();
    }
  }, [token]);

  const fetchUserSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/settings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user settings');
      }

      const data = await response.json();
      
      // Store user data in context and localStorage
      const userData = {
        ...data.profile,
        writing: data.writing,
        privacy: data.privacy,
        notifications: data.notifications
      };
      
      setUser(userData);
      
      // Update localStorage with new user data for navbar sync
      localStorage.setItem('user', JSON.stringify({
        name: `${data.profile.firstName} ${data.profile.lastName}`,
        email: data.profile.email,
        avatar: data.profile.avatar,
        ...data.profile
      }));
      
      // Trigger storage event to notify navbar
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'user',
        newValue: JSON.stringify({
          name: `${data.profile.firstName} ${data.profile.lastName}`,
          email: data.profile.email,
          avatar: data.profile.avatar,
          ...data.profile
        }),
        storageArea: localStorage
      }));
    } catch (err) {
      console.error('Error fetching user settings:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [API_URL, token]);

  const updateUserProfile = useCallback(async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/settings/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to update profile');
      }

      const data = await response.json();
      
      // Update user context
      const updatedUser = {
        ...user,
        firstName: data.profile.firstName,
        lastName: data.profile.lastName,
        username: data.profile.username,
        bio: data.profile.bio,
        website: data.profile.website,
        location: data.profile.location
      };
      
      setUser(updatedUser);
      
      // Update localStorage
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({
        ...storedUser,
        name: `${data.profile.firstName} ${data.profile.lastName}`,
        ...data.profile
      }));
      
      // Trigger storage event for navbar
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'user',
        newValue: JSON.stringify({
          ...storedUser,
          name: `${data.profile.firstName} ${data.profile.lastName}`,
          ...data.profile
        }),
        storageArea: localStorage
      }));
      
      return data;
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [API_URL, token, user]);

  const updateAvatar = useCallback(async (avatarFile) => {
    try {
      setLoading(true);
      setError(null);
      const formData = new FormData();
      
      // Handle both File objects and already uploaded URLs
      if (typeof avatarFile === 'string') {
        // Already a URL, just update context
        const updatedUser = { ...user, avatar: avatarFile };
        setUser(updatedUser);
        
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({
          ...storedUser,
          avatar: avatarFile
        }));
        
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'user',
          newValue: JSON.stringify({
            ...storedUser,
            avatar: avatarFile
          }),
          storageArea: localStorage
        }));
        
        return { avatar: avatarFile };
      } else {
        // File object, upload to server
        formData.append('avatar', avatarFile);

        const response = await fetch(`${API_URL}/settings/avatar`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || 'Failed to upload avatar');
        }

        const data = await response.json();
        
        // Update user context
        const updatedUser = { ...user, avatar: data.avatar };
        setUser(updatedUser);
        
        // Update localStorage with new avatar
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({
          ...storedUser,
          avatar: data.avatar
        }));
        
        // Trigger storage event for navbar to update
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'user',
          newValue: JSON.stringify({
            ...storedUser,
            avatar: data.avatar
          }),
          storageArea: localStorage
        }));
        
        return data;
      }
    } catch (err) {
      console.error('Error updating avatar:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [API_URL, token, user]);

  const changePassword = useCallback(async (passwordData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/settings/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(passwordData)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to change password');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error changing password:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [API_URL, token]);

  const updateWritingPreferences = useCallback(async (preferences) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/settings/writing`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(preferences)
      });

      if (!response.ok) {
        throw new Error('Failed to update writing preferences');
      }

      const data = await response.json();
      setUser(prev => ({ ...prev, writing: data.writing }));
      return data;
    } catch (err) {
      console.error('Error updating writing preferences:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [API_URL, token]);

  const updatePrivacy = useCallback(async (privacySettings) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/settings/privacy`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(privacySettings)
      });

      if (!response.ok) {
        throw new Error('Failed to update privacy settings');
      }

      const data = await response.json();
      setUser(prev => ({ ...prev, privacy: data.privacy }));
      return data;
    } catch (err) {
      console.error('Error updating privacy settings:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [API_URL, token]);

  const updateNotifications = useCallback(async (notificationSettings) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/settings/notifications`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(notificationSettings)
      });

      if (!response.ok) {
        throw new Error('Failed to update notification settings');
      }

      const data = await response.json();
      setUser(prev => ({ ...prev, notifications: data.notifications }));
      return data;
    } catch (err) {
      console.error('Error updating notification settings:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [API_URL, token]);

  const value = {
    user,
    loading,
    error,
    updateUserProfile,
    updateAvatar,
    changePassword,
    updateWritingPreferences,
    updatePrivacy,
    updateNotifications,
    fetchUserSettings,
    setError
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;
