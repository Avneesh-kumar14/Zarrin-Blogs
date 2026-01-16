const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');

/**
 * Get user settings
 */
const getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      profile: {
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ').slice(1).join(' ') || '',
        username: user.name || '',
        email: user.email,
        bio: user.bio || '',
        website: user.profileSettings?.website || '',
        location: user.profileSettings?.location || '',
        avatar: user.avatar || '',
        isEmailVerified: user.isEmailVerified
      },
      writing: {
        allowComments: user.profileSettings?.allowComments ?? true,
        showReadingTime: user.profileSettings?.showReadingTime ?? true,
        autoSaveDrafts: user.profileSettings?.autoSaveDrafts ?? true
      },
      privacy: {
        profileVisibility: user.profileSettings?.profileVisibility ?? true,
        showActivity: user.profileSettings?.showActivity ?? true
      },
      notifications: user.notificationPreferences || {
        emailFollowers: true,
        emailComments: true,
        emailLikes: false,
        emailDigest: true,
        pushNotifications: true,
        pushMentions: true
      }
    });
  } catch (error) {
    logger.error('Error fetching settings:', { error: error.message });
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Update user profile settings
 */
const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, username, bio, website, location, avatar } = req.body;
    
    const fullName = `${firstName || ''} ${lastName || ''}`.trim();
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        name: fullName || username,
        bio: bio || '',
        avatar: avatar || '',
        'profileSettings.website': website || '',
        'profileSettings.location': location || ''
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    logger.info('Profile updated successfully', { userId: req.user._id });
    res.json({
      message: 'Profile updated successfully',
      user: {
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ').slice(1).join(' ') || '',
        email: user.email,
        bio: user.bio,
        website: user.profileSettings?.website,
        location: user.profileSettings?.location,
        avatar: user.avatar
      }
    });
  } catch (error) {
    logger.error('Error updating profile:', { error: error.message });
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Update writing preferences
 */
const updateWritingPreferences = async (req, res) => {
  try {
    const { allowComments, showReadingTime, autoSaveDrafts } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        'profileSettings.allowComments': allowComments,
        'profileSettings.showReadingTime': showReadingTime,
        'profileSettings.autoSaveDrafts': autoSaveDrafts
      },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    logger.info('Writing preferences updated', { userId: req.user._id });
    res.json({
      message: 'Writing preferences updated successfully',
      writing: user.profileSettings
    });
  } catch (error) {
    logger.error('Error updating writing preferences:', { error: error.message });
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Update privacy settings
 */
const updatePrivacy = async (req, res) => {
  try {
    const { profileVisibility, showActivity } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        'profileSettings.profileVisibility': profileVisibility,
        'profileSettings.showActivity': showActivity
      },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    logger.info('Privacy settings updated', { userId: req.user._id });
    res.json({
      message: 'Privacy settings updated successfully',
      privacy: user.profileSettings
    });
  } catch (error) {
    logger.error('Error updating privacy settings:', { error: error.message });
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Update notification preferences
 */
const updateNotificationPreferences = async (req, res) => {
  try {
    const {
      emailFollowers,
      emailComments,
      emailLikes,
      emailDigest,
      pushNotifications,
      pushMentions
    } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        notificationPreferences: {
          emailFollowers,
          emailComments,
          emailLikes,
          emailDigest,
          pushNotifications,
          pushMentions
        }
      },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    logger.info('Notification preferences updated', { userId: req.user._id });
    res.json({
      message: 'Notification preferences updated successfully',
      notifications: user.notificationPreferences
    });
  } catch (error) {
    logger.error('Error updating notification preferences:', { error: error.message });
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Change user password
 */
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'All password fields are required' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'New passwords do not match' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Get user from database
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update password (will be hashed by pre-save middleware)
    user.password = newPassword;
    await user.save();

    logger.info('Password changed successfully', { userId: req.user._id });
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    logger.error('Error changing password:', { error: error.message });
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Upload user avatar
 */
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ message: 'Invalid file type. Only JPG, PNG, GIF allowed' });
    }

    // Validate file size (max 2MB)
    if (req.file.size > 2 * 1024 * 1024) {
      return res.status(400).json({ message: 'File size must be less than 2MB' });
    }

    // Get current user to check existing avatar
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete old avatar if exists
    if (user.avatar) {
      try {
        const publicId = user.avatar.split('/').pop().split('.')[0];
        await deleteFromCloudinary(publicId, 'avatars');
      } catch (error) {
        logger.warn('Could not delete old avatar', { error: error.message });
      }
    }

    // Upload new avatar to Cloudinary
    const result = await uploadToCloudinary(
      req.file.buffer,
      req.file.mimetype,
      `avatars/user_${req.user._id}`
    );

    // Update user avatar URL
    user.avatar = result.secure_url;
    await user.save();

    logger.info('Avatar uploaded successfully', { userId: req.user._id, url: result.secure_url });
    res.json({
      message: 'Avatar uploaded successfully',
      avatar: result.secure_url
    });
  } catch (error) {
    logger.error('Error uploading avatar:', { error: error.message });
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getSettings,
  updateProfile,
  updateWritingPreferences,
  updatePrivacy,
  updateNotificationPreferences,
  changePassword,
  uploadAvatar
};
