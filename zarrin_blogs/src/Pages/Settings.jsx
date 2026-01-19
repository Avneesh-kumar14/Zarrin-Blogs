import React, { useState, useEffect } from 'react';
import { User, Shield, Bell, Palette, Upload, Eye, EyeOff, Trash2 } from 'lucide-react';
import Alert from '../Component/Common/Alert';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { user, loading: userLoading, updateUserProfile, updateAvatar, changePassword, updateWritingPreferences, updatePrivacy, updateNotifications, clearUser } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [alert, setAlert] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deletePassword, setDeletePassword] = useState('');

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    bio: '',
    website: '',
    location: '',
    avatar: '',
    allowComments: true,
    showReadingTime: true,
    autoSaveDrafts: true,
    profileVisibility: true,
    showActivity: true,
    emailFollowers: true,
    emailComments: true,
    emailLikes: false,
    emailDigest: true,
    pushNotifications: true,
    pushMentions: true
  });

  // Load settings when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || '',
        website: user.website || '',
        location: user.location || '',
        avatar: user.avatar || '',
        allowComments: user.writing?.allowComments ?? true,
        showReadingTime: user.writing?.showReadingTime ?? true,
        autoSaveDrafts: user.writing?.autoSaveDrafts ?? true,
        profileVisibility: user.privacy?.profileVisibility ?? true,
        showActivity: user.privacy?.showActivity ?? true,
        emailFollowers: user.notifications?.emailFollowers ?? true,
        emailComments: user.notifications?.emailComments ?? true,
        emailLikes: user.notifications?.emailLikes ?? false,
        emailDigest: user.notifications?.emailDigest ?? true,
        pushNotifications: user.notifications?.pushNotifications ?? true,
        pushMentions: user.notifications?.pushMentions ?? true
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreviewAvatar(URL.createObjectURL(file));
  };

  const handleAvatarUpload = async () => {
    try {
      setAvatarLoading(true);
      
      if (!previewAvatar) {
        setAlert({ type: 'error', message: 'Please select an image first' });
        return;
      }

      const fileInput = document.getElementById('avatar-input');
      if (!fileInput || !fileInput.files[0]) {
        setAlert({ type: 'error', message: 'No file selected' });
        return;
      }

      // Call UserContext method to handle upload
      const response = await updateAvatar(fileInput.files[0]);
      
      // Handle both response formats
      const avatarUrl = response?.avatar || response?.data?.avatar || (typeof response === 'string' ? response : null);
      
      if (!avatarUrl) {
        throw new Error('Failed to get avatar URL from upload response');
      }
      
      // Update local form data with new avatar immediately
      setFormData(prev => ({
        ...prev,
        avatar: avatarUrl
      }));
      
      // Clear preview and input
      setPreviewAvatar(null);
      fileInput.value = '';
      
      setAlert({ type: 'success', message: 'Avatar updated successfully!' });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setAlert({ type: 'error', message: error.message || 'Failed to upload avatar' });
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      await updateUserProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        bio: formData.bio,
        website: formData.website,
        location: formData.location
      });
      setAlert({ type: 'success', message: 'Profile saved successfully!' });
    } catch (error) {
      console.error('Error saving profile:', error);
      setAlert({ type: 'error', message: error.message || 'Failed to save profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setAlert({ type: 'error', message: 'Passwords do not match!' });
        return;
      }

      if (passwordData.newPassword.length < 8) {
        setAlert({ type: 'error', message: 'Password must be at least 8 characters' });
        return;
      }

      setLoading(true);
      await changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      setAlert({ type: 'success', message: 'Password changed successfully!' });
    } catch (error) {
      console.error('Error changing password:', error);
      setAlert({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveWritingPreferences = async () => {
    try {
      setLoading(true);
      await updateWritingPreferences({
        allowComments: formData.allowComments,
        showReadingTime: formData.showReadingTime,
        autoSaveDrafts: formData.autoSaveDrafts
      });
      setAlert({ type: 'success', message: 'Writing preferences saved!' });
    } catch (error) {
      console.error('Error saving writing preferences:', error);
      setAlert({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSavePrivacy = async () => {
    try {
      setLoading(true);
      await updatePrivacy({
        profileVisibility: formData.profileVisibility,
        showActivity: formData.showActivity
      });
      setAlert({ type: 'success', message: 'Privacy settings saved!' });
    } catch (error) {
      console.error('Error saving privacy settings:', error);
      setAlert({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    try {
      setLoading(true);
      await updateNotifications({
        emailFollowers: formData.emailFollowers,
        emailComments: formData.emailComments,
        emailLikes: formData.emailLikes,
        emailDigest: formData.emailDigest,
        pushNotifications: formData.pushNotifications,
        pushMentions: formData.pushMentions
      });
      setAlert({ type: 'success', message: 'Notification preferences saved!' });
    } catch (error) {
      console.error('Error saving notification preferences:', error);
      setAlert({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // Check if user is loaded
      if (!user || !user._id) {
        setAlert({ type: 'error', message: 'User not loaded. Please refresh the page.' });
        return;
      }

      // Validate confirmation
      if (deleteConfirmText !== 'DELETE MY ACCOUNT') {
        setAlert({ type: 'error', message: 'Please type "DELETE MY ACCOUNT" to confirm' });
        return;
      }

      if (!deletePassword) {
        setAlert({ type: 'error', message: 'Please enter your password to confirm deletion' });
        return;
      }

      setLoading(true);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      // Call delete account API
      const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8200';
      const API_URL = API_BASE.endsWith('/api') ? API_BASE : `${API_BASE}/api`;

      console.log('🗑️ Attempting to delete account for user:', user._id);
      console.log('📡 API URL:', `${API_URL}/users/${user._id}`);

      const res = await fetch(`${API_URL}/users/${user._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ password: deletePassword })
      });

      console.log('📤 Delete response status:', res.status);

      if (!res.ok) {
        const error = await res.json();
        console.error('❌ Delete failed:', error);
        throw new Error(error.message || 'Failed to delete account');
      }

      const data = await res.json();
      console.log('✅ Delete successful:', data);

      // Clear user context and localStorage
      clearUser();

      setAlert({ type: 'success', message: 'Account deleted successfully. Redirecting to home...' });

      // Redirect to home after 2 seconds
      setTimeout(() => {
        navigate('/');
        // Force refresh to clear any remaining state
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('❌ Error deleting account:', error);
      setAlert({ type: 'error', message: error.message || 'Failed to delete account' });
      setLoading(false);
    }
  };

  const TabButton = ({ tab, icon: Icon, label, isDanger = false }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
        activeTab === tab
          ? isDanger 
            ? 'bg-red-500 text-white'
            : 'bg-gradient-to-r from-[#6366F1] to-[#EC4899] text-white'
          : isDanger
            ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {alert && (
          <div className="mb-6">
            <Alert type={alert.type} message={alert.message} />
          </div>
        )}

        {/* Settings Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your account preferences and profile</p>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 mb-8 flex gap-2 flex-wrap">
          <TabButton tab="profile" icon={User} label="Profile" />
          <TabButton tab="account" icon={Shield} label="Account" />
          <TabButton tab="notifications" icon={Bell} label="Notifications" />
          <TabButton tab="appearance" icon={Palette} label="Appearance" />
          <TabButton tab="danger" icon={Trash2} label="Danger Zone" isDanger={true} />
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white dark:bg-slate-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Profile Settings</h2>

            {/* Avatar Section */}
            <div className="mb-8 pb-8 border-b border-gray-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile Picture</h3>
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-r from-[#6366F1] to-[#EC4899] flex items-center justify-center text-white text-3xl font-bold overflow-hidden border-4 border-white dark:border-slate-700 shadow-lg">
                    {previewAvatar ? (
                      <img src={previewAvatar} alt="Preview" className="w-full h-full object-cover" />
                    ) : formData.avatar ? (
                      <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      formData.firstName?.[0]?.toUpperCase() || 'U'
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <label className="flex items-center gap-3 px-4 py-2 bg-gray-100 dark:bg-slate-700 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">
                    <Upload className="w-4 h-4" />
                    <span className="text-gray-700 dark:text-gray-300">Upload Photo</span>
                    <input
                      id="avatar-input"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                  {previewAvatar && (
                    <button
                      onClick={handleAvatarUpload}
                      disabled={avatarLoading}
                      className="mt-3 px-4 py-2 bg-gradient-to-r from-[#6366F1] to-[#EC4899] text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      {avatarLoading ? 'Uploading...' : 'Save Photo'}
                    </button>
                  )}
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">JPG, PNG or GIF (max. 2MB)</p>
                </div>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white"
              />
            </div>

            {/* Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Website</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="City, Country"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex gap-3">
              <button
                onClick={handleSaveProfile}
                disabled={loading}
                className="px-6 py-2 bg-gradient-to-r from-[#6366F1] to-[#EC4899] text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </div>
        )}

        {/* Account Tab */}
        {activeTab === 'account' && (
          <div className="bg-white dark:bg-slate-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Account Settings</h2>

            {/* Email Display */}
            <div className="mb-8 pb-8 border-b border-gray-200 dark:border-slate-700">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 dark:text-gray-400 text-gray-600 cursor-not-allowed"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Email cannot be changed</p>
            </div>

            {/* Change Password */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Change Password</h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white"
                />
              </div>

              <button
                onClick={handleChangePassword}
                disabled={loading}
                className="px-6 py-2 bg-gradient-to-r from-[#6366F1] to-[#EC4899] text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="bg-white dark:bg-slate-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Notification Preferences</h2>

            {/* Writing Preferences */}
            <div className="mb-8 pb-8 border-b border-gray-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Writing Preferences</h3>

              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="allowComments"
                    checked={formData.allowComments}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Allow comments on my posts</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="showReadingTime"
                    checked={formData.showReadingTime}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Show reading time on posts</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="autoSaveDrafts"
                    checked={formData.autoSaveDrafts}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Auto-save drafts</span>
                </label>
              </div>

              <button
                onClick={handleSaveWritingPreferences}
                disabled={loading}
                className="mt-4 px-6 py-2 bg-gradient-to-r from-[#6366F1] to-[#EC4899] text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>

            {/* Privacy Settings */}
            <div className="mb-8 pb-8 border-b border-gray-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Privacy Settings</h3>

              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="profileVisibility"
                    checked={formData.profileVisibility}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Make profile public</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="showActivity"
                    checked={formData.showActivity}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Show my activity</span>
                </label>
              </div>

              <button
                onClick={handleSavePrivacy}
                disabled={loading}
                className="mt-4 px-6 py-2 bg-gradient-to-r from-[#6366F1] to-[#EC4899] text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Privacy Settings'}
              </button>
            </div>

            {/* Email & Push Notifications */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Email & Push Notifications</h3>

              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="emailFollowers"
                    checked={formData.emailFollowers}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Email when someone follows me</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="emailComments"
                    checked={formData.emailComments}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Email when someone comments</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="emailLikes"
                    checked={formData.emailLikes}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Email when someone likes my post</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="emailDigest"
                    checked={formData.emailDigest}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Weekly digest email</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="pushNotifications"
                    checked={formData.pushNotifications}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Push notifications</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="pushMentions"
                    checked={formData.pushMentions}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Push notifications for mentions</span>
                </label>
              </div>

              <button
                onClick={handleSaveNotifications}
                disabled={loading}
                className="mt-4 px-6 py-2 bg-gradient-to-r from-[#6366F1] to-[#EC4899] text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Notification Settings'}
              </button>
            </div>
          </div>
        )}

        {/* Appearance Tab */}
        {activeTab === 'appearance' && (
          <div className="bg-white dark:bg-slate-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Appearance Settings</h2>
            <p className="text-gray-600 dark:text-gray-400">Theme settings managed through the navbar theme toggle.</p>
          </div>
        )}

        {/* Danger Zone Tab */}
        {activeTab === 'danger' && (
          <div className="bg-white dark:bg-slate-800 rounded-lg p-8 border-2 border-red-200 dark:border-red-900">
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-6 flex items-center gap-2">
              <Trash2 className="w-6 h-6" />
              Danger Zone
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              ⚠️ <strong>Warning:</strong> The actions in this section are permanent and cannot be undone. Please proceed with caution.
            </p>

            {/* Delete Account */}
            <div className="mb-8 pb-8 border-b border-red-200 dark:border-red-900">
              <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">Delete Account</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Once you delete your account, all your blogs, comments, likes, and followers will be permanently removed. This action cannot be undone.
              </p>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete My Account
              </button>
            </div>
          </div>
        )}

        {/* Delete Account Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-8 max-w-md w-full shadow-2xl">
              <h3 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4 flex items-center gap-2">
                <Trash2 className="w-6 h-6" />
                Delete Account?
              </h3>

              <p className="text-gray-700 dark:text-gray-300 mb-6">
                This will <strong>permanently delete</strong> your account and all associated content including:
              </p>

              <ul className="text-sm text-gray-600 dark:text-gray-400 mb-6 list-disc list-inside space-y-2">
                <li>Your profile and all personal information</li>
                <li>All your blog posts and articles</li>
                <li>All uploaded images and files</li>
                <li>Your comments and interactions</li>
                <li>Your followers and following lists</li>
              </ul>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Type <strong>"DELETE MY ACCOUNT"</strong> to confirm:
                  </label>
                  <input
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder="DELETE MY ACCOUNT"
                    className="w-full px-4 py-2 border border-red-300 dark:border-red-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-slate-700 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Enter your password to confirm:
                  </label>
                  <input
                    type="password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    placeholder="Your password"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-slate-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteConfirmText('');
                    setDeletePassword('');
                  }}
                  disabled={loading}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={loading || deleteConfirmText !== 'DELETE MY ACCOUNT' || !deletePassword}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:hover:bg-red-600 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Deleting...' : 'Delete Account'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
