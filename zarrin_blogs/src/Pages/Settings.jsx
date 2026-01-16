// import React, { useState, useEffect } from 'react';
// import { User, Shield, Bell, Palette, Upload, Eye, EyeOff } from 'lucide-react';
// import Alert from '../Component/Common/Alert';

// const Settings = () => {
//   const [activeTab, setActiveTab] = useState('profile');
//   const [alert, setAlert] = useState(null);
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [passwordData, setPasswordData] = useState({
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: ''
//   });
//   const [formData, setFormData] = useState({
//     firstName: 'John',
//     lastName: 'Doe',
//     username: '@johndoe',
//     bio: 'Passionate developer with expertise in full-stack development.',
//     website: 'https://example.com',
//     location: 'San Francisco, CA',
//     email: 'john@example.com',
//     allowComments: true,
//     showReadingTime: true,
//     autoSaveDrafts: true,
//     profileVisibility: true,
//     showActivity: true,
//     emailFollowers: true,
//     emailComments: true,
//     emailLikes: false,
//     emailDigest: true,
//     pushNotifications: true,
//     pushMentions: true
//   });

//   const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8200/api';
//   const token = localStorage.getItem('token');

//   // Fetch settings on mount
//   useEffect(() => {
//     fetchSettings();
//   }, []);

//   const fetchSettings = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`${API_URL}/settings`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (!response.ok) {
//         throw new Error('Failed to fetch settings');
//       }

//       const data = await response.json();
//       setFormData({
//         firstName: data.profile.firstName,
//         lastName: data.profile.lastName,
//         username: data.profile.username,
//         email: data.profile.email,
//         bio: data.profile.bio,
//         website: data.profile.website,
//         location: data.profile.location,
//         allowComments: data.writing.allowComments,
//         showReadingTime: data.writing.showReadingTime,
//         autoSaveDrafts: data.writing.autoSaveDrafts,
//         profileVisibility: data.privacy.profileVisibility,
//         showActivity: data.privacy.showActivity,
//         emailFollowers: data.notifications.emailFollowers,
//         emailComments: data.notifications.emailComments,
//         emailLikes: data.notifications.emailLikes,
//         emailDigest: data.notifications.emailDigest,
//         pushNotifications: data.notifications.pushNotifications,
//         pushMentions: data.notifications.pushMentions
//       });
//     } catch (error) {
//       console.error('Error fetching settings:', error);
//       setAlert({ type: 'error', message: 'Failed to load settings' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === 'checkbox' ? checked : value
//     });
//   };

//   const handlePasswordChange = (e) => {
//     const { name, value } = e.target;
//     setPasswordData({
//       ...passwordData,
//       [name]: value
//     });
//   };

//   const handleSaveProfile = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`${API_URL}/settings/profile`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           firstName: formData.firstName,
//           lastName: formData.lastName,
//           username: formData.username,
//           bio: formData.bio,
//           website: formData.website,
//           location: formData.location
//         })
//       });

//       if (!response.ok) {
//         throw new Error('Failed to update profile');
//       }

//       setAlert({ type: 'success', message: 'Profile settings saved successfully!' });
//     } catch (error) {
//       console.error('Error saving profile:', error);
//       setAlert({ type: 'error', message: error.message });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChangePassword = () => {
//     setAlert({ type: 'success', message: 'Password changed successfully!' });
//   };

//   const TabButton = ({ tab, icon: Icon, label }) => (
//     <button
//       onClick={() => setActiveTab(tab)}
//       className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
//         activeTab === tab
//           ? 'bg-gradient-to-r from-[#6366F1] to-[#EC4899] text-white'
//           : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
//       }`}
//     >
//       <Icon className="w-4 h-4" />
//       {label}
//     </button>
//   );

import React, { useState, useEffect } from 'react';
import { User, Shield, Bell, Palette, Upload, Eye, EyeOff } from 'lucide-react';
import Alert from '../Component/Common/Alert';
import { useUser } from '../context/UserContext';

const Settings = () => {
  const { user, updateAvatar, updateUserProfile } = useUser();
  const [activeTab, setActiveTab] = useState('profile');
  const [alert, setAlert] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ ADDED: Avatar states (FIX no-undef)
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [avatarLoading, setAvatarLoading] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    username: '@johndoe',
    bio: 'Passionate developer with expertise in full-stack development.',
    website: 'https://example.com',
    location: 'San Francisco, CA',
    email: 'john@example.com',
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

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8200/api';
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/settings`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch settings');

      const data = await response.json();
      setFormData({
        firstName: data.profile.firstName,
        lastName: data.profile.lastName,
        username: data.profile.username,
        email: data.profile.email,
        bio: data.profile.bio,
        website: data.profile.website,
        location: data.profile.location,
        allowComments: data.writing.allowComments,
        showReadingTime: data.writing.showReadingTime,
        autoSaveDrafts: data.writing.autoSaveDrafts,
        profileVisibility: data.privacy.profileVisibility,
        showActivity: data.privacy.showActivity,
        emailFollowers: data.notifications.emailFollowers,
        emailComments: data.notifications.emailComments,
        emailLikes: data.notifications.emailLikes,
        emailDigest: data.notifications.emailDigest,
        pushNotifications: data.notifications.pushNotifications,
        pushMentions: data.notifications.pushMentions
      });
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to load settings' });
    } finally {
      setLoading(false);
    }
  };

  // ✅ ADDED: Avatar handlers (FIX no-undef)
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

      // Get the file from input
      const fileInput = document.getElementById('avatar-input');
      if (!fileInput || !fileInput.files[0]) {
        setAlert({ type: 'error', message: 'No file selected' });
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('avatar', fileInput.files[0]);

      const response = await fetch(`${API_URL}/settings/avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to upload avatar');
      }

      const data = await response.json();
      setFormData({
        ...formData,
        avatar: data.avatar
      });
      
      // ✅ FIX: Update user context to sync navbar
      updateAvatar(data.avatar);
      
      setPreviewAvatar(null);
      fileInput.value = '';
      setAlert({ type: 'success', message: 'Avatar updated successfully!' });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setAlert({ type: 'error', message: error.message });
    } finally {
      setAvatarLoading(false);
    }
  };

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

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/settings/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.username,
          bio: formData.bio,
          website: formData.website,
          location: formData.location
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      setAlert({ type: 'success', message: 'Profile settings saved successfully!' });
    } catch (error) {
      console.error('Error saving profile:', error);
      setAlert({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      setLoading(true);
      
      // Validate
      if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
        setAlert({ type: 'error', message: 'All password fields are required' });
        setLoading(false);
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setAlert({ type: 'error', message: 'New passwords do not match' });
        setLoading(false);
        return;
      }

      if (passwordData.newPassword.length < 6) {
        setAlert({ type: 'error', message: 'Password must be at least 6 characters' });
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/settings/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to change password');
      }

      setAlert({ type: 'success', message: 'Password changed successfully!' });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error changing password:', error);
      setAlert({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  // ✅ ADDED: Missing handlers used by buttons
  const handleUpdateWritingPreferences = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/settings/writing`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          allowComments: formData.allowComments,
          showReadingTime: formData.showReadingTime,
          autoSaveDrafts: formData.autoSaveDrafts
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update writing preferences');
      }

      setAlert({ type: 'success', message: 'Writing preferences saved!' });
    } catch (error) {
      console.error('Error updating writing preferences:', error);
      setAlert({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePrivacy = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/settings/privacy`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          profileVisibility: formData.profileVisibility,
          showActivity: formData.showActivity
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update privacy settings');
      }

      setAlert({ type: 'success', message: 'Privacy settings saved!' });
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      setAlert({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateNotificationPreferences = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/settings/notifications`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          emailFollowers: formData.emailFollowers,
          emailComments: formData.emailComments,
          emailLikes: formData.emailLikes,
          emailDigest: formData.emailDigest,
          pushNotifications: formData.pushNotifications,
          pushMentions: formData.pushMentions
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update notification preferences');
      }

      setAlert({ type: 'success', message: 'Notification preferences saved!' });
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      setAlert({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const TabButton = ({ tab, icon: Icon, label }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
        activeTab === tab
          ? 'bg-gradient-to-r from-[#6366F1] to-[#EC4899] text-white'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-10 bg-gradient-to-b from-[#6366F1] to-[#EC4899] rounded-full" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Settings</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Alert */}
        {alert && (
          <div className="mb-6">
            <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} duration={3000} />
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          <TabButton tab="profile" icon={User} label="Profile" />
          <TabButton tab="account" icon={Shield} label="Account" />
          <TabButton tab="notifications" icon={Bell} label="Notifications" />
          <TabButton tab="appearance" icon={Palette} label="Appearance" />
        </div>

        {/* Profile Settings */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            {/* Public Profile Card */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-[#6366F1] to-[#EC4899] rounded-full" />
                Public Profile
              </h2>

              {/* Avatar */}
              <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-200 dark:border-slate-700">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#6366F1] to-[#EC4899] flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                  {previewAvatar ? (
                    <img src={previewAvatar} alt="Avatar preview" className="w-full h-full object-cover" />
                  ) : (
                    formData.firstName?.charAt(0).toUpperCase() || 'JD'
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/gif,image/png"
                    onChange={handleAvatarChange}
                    className="hidden"
                    id="avatar-input"
                  />
                  <label htmlFor="avatar-input" className="inline-block">
                    <button 
                      onClick={() => document.getElementById('avatar-input')?.click()}
                      type="button"
                      disabled={avatarLoading}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#5558E3] hover:to-[#7C4EE8] text-white rounded-lg mb-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Upload className="w-4 h-4" />
                      {avatarLoading ? 'Uploading...' : 'Upload new photo'}
                    </button>
                  </label>
                  {previewAvatar && (
                    <button
                      onClick={handleAvatarUpload}
                      disabled={avatarLoading}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg mb-2 ml-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {avatarLoading ? 'Saving...' : 'Save Avatar'}
                    </button>
                  )}
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    JPG, GIF or PNG. Max size 2MB
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#6366F1]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#6366F1]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#6366F1]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#6366F1]"
                    placeholder="Tell us about yourself..."
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Brief description for your profile. Max 160 characters.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#6366F1]"
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#6366F1]"
                  />
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700 flex justify-end gap-3">
                <button className="px-6 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700">
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className="px-6 py-2 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#5558E3] hover:to-[#7C4EE8] text-white rounded-lg disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>

            {/* Writing Preferences */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-[#EC4899] to-[#F472B6] rounded-full" />
                Writing Preferences
              </h2>

              <div className="space-y-4">
                {[
                  { key: 'allowComments', label: 'Allow comments on articles', desc: 'Let readers comment on your posts' },
                  { key: 'showReadingTime', label: 'Show reading time', desc: 'Display estimated reading time on articles' },
                  { key: 'autoSaveDrafts', label: 'Auto-save drafts', desc: 'Automatically save your work as you write' }
                ].map((item) => (
                  <div key={item.key}>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="font-medium text-gray-900 dark:text-white">{item.label}</label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                      </div>
                      <input
                        type="checkbox"
                        name={item.key}
                        checked={formData[item.key]}
                        onChange={handleInputChange}
                        className="w-5 h-5 rounded cursor-pointer"
                      />
                    </div>
                    {item !== [
                  { key: 'allowComments', label: 'Allow comments on articles', desc: 'Let readers comment on your posts' },
                  { key: 'showReadingTime', label: 'Show reading time', desc: 'Display estimated reading time on articles' },
                  { key: 'autoSaveDrafts', label: 'Auto-save drafts', desc: 'Automatically save your work as you write' }
                ][2] && <div className="border-b border-gray-200 dark:border-slate-700 mt-4" />}
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700 flex justify-end">
                <button
                  onClick={handleUpdateWritingPreferences}
                  disabled={loading}
                  className="px-6 py-2 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#5558E3] hover:to-[#7C4EE8] text-white rounded-lg disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Preferences'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Account Settings */}
        {activeTab === 'account' && (
          <div className="space-y-6">
            {/* Account Information */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-[#6366F1] to-[#EC4899] rounded-full" />
                Account Information
              </h2>

              <div className="space-y-4 pb-6 border-b border-gray-200 dark:border-slate-700">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#6366F1]"
                  />
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Your email is verified <span className="inline-block ml-2 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-xs font-medium">Verified</span>
                  </p>
                </div>
              </div>

              {/* Change Password */}
              <div className="pt-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Change Password</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#6366F1]"
                      />
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#6366F1]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#6366F1]"
                    />
                  </div>

                  <button
                    onClick={handleChangePassword}
                    disabled={loading}
                    className="px-6 py-2 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#5558E3] hover:to-[#7C4EE8] text-white rounded-lg disabled:opacity-50"
                  >
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </div>
            </div>

            {/* Privacy & Security */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-[#EC4899] to-[#F472B6] rounded-full" />
                Privacy & Security
              </h2>

              <div className="space-y-4">
                {[
                  { key: 'profileVisibility', label: 'Profile visibility', desc: 'Make your profile visible to everyone' },
                  { key: 'showActivity', label: 'Show activity status', desc: 'Let others see when you\'re active' }
                ].map((item, idx) => (
                  <div key={item.key}>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="font-medium text-gray-900 dark:text-white">{item.label}</label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                      </div>
                      <input
                        type="checkbox"
                        name={item.key}
                        checked={formData[item.key]}
                        onChange={handleInputChange}
                        className="w-5 h-5 rounded cursor-pointer"
                      />
                    </div>
                    {idx === 0 && <div className="border-b border-gray-200 dark:border-slate-700 mt-4" />}
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700 flex justify-end">
                <button
                  onClick={handleUpdatePrivacy}
                  disabled={loading}
                  className="px-6 py-2 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#5558E3] hover:to-[#7C4EE8] text-white rounded-lg disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Settings */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            {/* Email Notifications */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-[#6366F1] to-[#EC4899] rounded-full" />
                Email Notifications
              </h2>

              <div className="space-y-4">
                {[
                  { key: 'emailFollowers', label: 'New followers', desc: 'Get notified when someone follows you' },
                  { key: 'emailComments', label: 'Comments on your articles', desc: 'Get notified when someone comments' },
                  { key: 'emailLikes', label: 'Article likes', desc: 'Get notified when someone likes your article' },
                  { key: 'emailDigest', label: 'Weekly digest', desc: 'Receive a weekly summary of activity' }
                ].map((item, idx) => (
                  <div key={item.key}>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="font-medium text-gray-900 dark:text-white">{item.label}</label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                      </div>
                      <input
                        type="checkbox"
                        name={item.key}
                        checked={formData[item.key]}
                        onChange={handleInputChange}
                        className="w-5 h-5 rounded cursor-pointer"
                      />
                    </div>
                    {idx < 3 && <div className="border-b border-gray-200 dark:border-slate-700 mt-4" />}
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700 flex justify-end">
                <button
                  onClick={handleUpdateNotificationPreferences}
                  disabled={loading}
                  className="px-6 py-2 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#5558E3] hover:to-[#7C4EE8] text-white rounded-lg disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Notifications'}
                </button>
              </div>
            </div>

            {/* Push Notifications */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-[#EC4899] to-[#F472B6] rounded-full" />
                Push Notifications
              </h2>

              <div className="space-y-4">
                {[
                  { key: 'pushNotifications', label: 'Enable push notifications', desc: 'Receive notifications on your device' },
                  { key: 'pushMentions', label: 'Mentions and replies', desc: 'Get notified when someone mentions you' }
                ].map((item, idx) => (
                  <div key={item.key}>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="font-medium text-gray-900 dark:text-white">{item.label}</label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                      </div>
                      <input
                        type="checkbox"
                        name={item.key}
                        checked={formData[item.key]}
                        onChange={handleInputChange}
                        className="w-5 h-5 rounded cursor-pointer"
                      />
                    </div>
                    {idx === 0 && <div className="border-b border-gray-200 dark:border-slate-700 mt-4" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Appearance Settings */}
        {activeTab === 'appearance' && (
          <div className="space-y-6">
            {/* Theme */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-[#6366F1] to-[#EC4899] rounded-full" />
                Theme
              </h2>

              <div className="grid grid-cols-3 gap-4">
                {['Light', 'Dark', 'Auto'].map((theme) => (
                  <div
                    key={theme}
                    className="p-4 border-2 border-gray-200 dark:border-slate-700 rounded-lg cursor-pointer hover:border-[#6366F1] transition-all"
                  >
                    <div className="w-full h-20 rounded bg-gray-100 dark:bg-gray-800 mb-2"></div>
                    <p className="font-medium text-center text-gray-900 dark:text-white">{theme}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Display */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-[#EC4899] to-[#F472B6] rounded-full" />
                Display
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Font Size
                  </label>
                  <div className="flex gap-2">
                    {['Small', 'Medium', 'Large'].map((size, idx) => (
                      <button
                        key={size}
                        className={`px-4 py-2 rounded-lg border ${
                          idx === 1
                            ? 'bg-gradient-to-r from-[#6366F1] to-[#EC4899] text-white border-0'
                            : 'border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Reading Width
                  </label>
                  <div className="flex gap-2">
                    {['Narrow', 'Standard', 'Wide'].map((width, idx) => (
                      <button
                        key={width}
                        className={`px-4 py-2 rounded-lg border ${
                          idx === 1
                            ? 'bg-gradient-to-r from-[#6366F1] to-[#EC4899] text-white border-0'
                            : 'border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {width}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
