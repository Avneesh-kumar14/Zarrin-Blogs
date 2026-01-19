const express = require('express');
const { auth } = require('../middleware/auth');
const User = require('../models/userModel');
const Blog = require('../models/blog');
const Notification = require('../models/notification');
const { sendFollowNotification } = require('../services/emailService');
const { notifyUserFollow } = require('../services/notificationService');

const router = express.Router();

/**
 * Profile Page Debug:
 * Profile should show:
 * - Total posts by user
 * - Follower count
 * - Following count
 *
 * Verify:
 * - Blog count query filters by author
 * - Followers and following stored correctly
 * - Population logic matches schema
 * - API response includes correct counts
 */

// Search users by name (MUST come before /:userId route)
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    console.log('🔍 User search endpoint hit with query:', query);
    
    if (!query) {
      console.log('No query provided, returning empty array');
      return res.json([]);
    }

    const users = await User.find({
      name: { $regex: query, $options: 'i' }
    })
      .select('-password')
      .populate('followers', 'name email avatar')
      .populate('following', 'name email avatar')
      .limit(5);

    console.log('Found users:', users.length);

    // Add totalBlogs for each user
    const usersWithBlogs = await Promise.all(
      users.map(async (user) => {
        const blogs = await Blog.countDocuments({ author: user._id, status: 'published' });
        return {
          ...user.toObject(),
          totalBlogs: blogs
        };
      })
    );

    console.log('Returning users with blogs:', usersWithBlogs);
    res.json(usersWithBlogs);
  } catch (err) {
    console.error('Error in user search:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all users (for search fallback)
router.get('/', async (req, res) => {
  try {
    console.log('📋 Get all users endpoint hit');
    const users = await User.find()
      .select('-password')
      .populate('followers', 'name email avatar')
      .populate('following', 'name email avatar');

    console.log('Found total users:', users.length);

    // Add totalBlogs for each user
    const usersWithBlogs = await Promise.all(
      users.map(async (user) => {
        const blogs = await Blog.countDocuments({ author: user._id, status: 'published' });
        return {
          ...user.toObject(),
          totalBlogs: blogs
        };
      })
    );

    console.log('Returning users with blogs count');
    res.json(usersWithBlogs);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ ADDED: Get authenticated user profile (MUST be before /:userId)
router.get('/me/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('followers', 'name email avatar')
      .populate('following', 'name email avatar');

    if (!user) return res.status(404).json({ message: 'User not found' });

    const blogs = await Blog.countDocuments({ author: req.user._id, status: 'published' });
    
    res.json({
      ...user.toObject(),
      blogsCount: blogs
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get user profile
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    console.log('📌 Fetching user profile for userId:', userId);
    
    // Validation: Check if userId is valid
    if (!userId || userId === 'undefined' || userId === 'null') {
      console.log('❌ Invalid userId:', userId);
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    
    // Validation: Check if it's a valid MongoDB ObjectId format
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log('❌ Invalid ObjectId format:', userId);
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    
    const user = await User.findById(userId)
      .select('-password')
      .populate('followers', 'name email avatar')
      .populate('following', 'name email avatar');

    if (!user) {
      console.log('❌ User not found:', userId);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('✅ User found:', user.name);
    
    const blogs = await Blog.countDocuments({ author: userId, status: 'published' });
    
    const response = {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar || '',
      totalBlogs: blogs,
      followers: user.followers || [],
      following: user.following || [],
      bio: user.bio || '',
      profileSettings: user.profileSettings || {}
    };
    
    console.log('📤 Sending user response with followers:', response.followers?.length);
    res.json(response);
  } catch (err) {
    console.error('❌ Error in GET /:userId:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get user's blogs
router.get('/:userId/blogs', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Validation: Check if userId is valid
    if (!userId || userId === 'undefined' || userId === 'null') {
      console.log('❌ Invalid userId for blogs:', userId);
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    
    // Validation: Check if it's a valid MongoDB ObjectId format
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log('❌ Invalid ObjectId format for blogs:', userId);
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    
    const blogs = await Blog.find({ author: userId, status: 'published' })
      .populate('author', 'name email avatar')
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    console.error('❌ Error in GET /:userId/blogs:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * Follow / Unfollow Debug:
 * Follow action should:
 * - Update target user's followers
 * - Update current user's following
 * - Prevent duplicate follows
 *
 * Please verify:
 * - User IDs are valid ObjectIds
 * - Both user documents are updated
 * - API returns updated follow status
 * - Frontend handles response correctly
 */

// Follow user
router.post('/:userId/follow', auth, async (req, res) => {
  try {
    if (req.user._id === req.params.userId) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    const targetUser = await User.findById(req.params.userId);
    if (!targetUser) return res.status(404).json({ message: 'User not found' });

    // Check if already following
    if (targetUser.followers.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already following this user' });
    }

    // Add to followers
    targetUser.followers.push(req.user._id);
    await targetUser.save();

    // Add to following
    const currentUser = await User.findById(req.user._id);
    currentUser.following.push(req.params.userId);
    await currentUser.save();

    // Create notification using notification service
    try {
      await notifyUserFollow(req.params.userId, req.user._id);
    } catch (notifError) {
      console.error('Failed to create notification:', notifError);
      // Don't fail the request
    }

    // Send email notification to followed user
    if (targetUser.email) {
      try {
        await sendFollowNotification({
          followerName: req.user.name || 'Someone',
          followerEmail: req.user.email,
          userId: req.user._id,
          userEmail: targetUser.email,
        });
      } catch (emailError) {
        console.error('Email notification failed (but follow was successful):', emailError);
        // Don't fail the request if email fails
      }
    }

    res.json({ message: 'Followed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Unfollow user
router.delete('/:userId/follow', auth, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.userId);
    if (!targetUser) return res.status(404).json({ message: 'User not found' });

    // Remove from followers
    targetUser.followers = targetUser.followers.filter(id => id.toString() !== req.user._id.toString());
    await targetUser.save();

    // Remove from following
    const currentUser = await User.findById(req.user._id);
    currentUser.following = currentUser.following.filter(id => id.toString() !== req.params.userId);
    await currentUser.save();

    res.json({ message: 'Unfollowed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update user profile
router.patch('/profile', auth, async (req, res) => {
  try {
    const { bio, avatar, name } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { bio, avatar, name },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get user drafts
router.get('/:userId/drafts', auth, async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const drafts = await Blog.find({ author: req.user._id, status: 'draft' })
      .sort({ updatedAt: -1 });
    res.json(drafts);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete user account and all associated content
router.delete('/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { password } = req.body;

    console.log('\n================== DELETE ACCOUNT REQUEST ==================');
    console.log('🗑️ Delete account request for userId:', userId);
    console.log('🔐 Current authenticated user ID:', req.user._id.toString());
    console.log('🔐 Password provided:', password ? 'Yes' : 'No');
    console.log('=====================================================\n');

    // Verify authorization - user can only delete their own account
    if (req.user._id.toString() !== userId) {
      console.error('❌ UNAUTHORIZED: User trying to delete different account');
      console.error('   Expected:', userId);
      console.error('   Got:', req.user._id.toString());
      return res.status(403).json({ message: 'Unauthorized - You can only delete your own account' });
    }

    console.log('✅ Authorization check passed');

    // Verify password
    const user = await User.findById(userId);
    if (!user) {
      console.error('❌ User not found:', userId);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('✅ User found:', user.email);

    // Use the model's comparePassword method
    console.log('🔐 Comparing passwords...');
    const isPasswordValid = await user.comparePassword(password);
    console.log('🔐 Password comparison result:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.error('❌ INVALID PASSWORD for user:', userId);
      return res.status(401).json({ message: 'Incorrect password' });
    }

    console.log('✅ Password verified successfully');
    console.log('🗑️ Proceeding with deletion...\n');

    // Delete all user's blogs and their associated images
    const userBlogs = await Blog.find({ author: userId });
    console.log('📝 Found', userBlogs.length, 'blogs to delete');
    
    // Delete all comments on user's blogs
    const commentsDeleted = await Blog.updateMany(
      { author: userId },
      { $pull: { comments: { author: userId } } }
    );
    console.log('💬 Deleted comments from', commentsDeleted.modifiedCount, 'blogs');

    // Delete all likes on user's blogs
    const likesDeleted = await Blog.updateMany(
      { author: userId },
      { $pull: { likes: userId } }
    );
    console.log('👍 Deleted likes from', likesDeleted.modifiedCount, 'blogs');

    // Delete user's blogs
    const blogsDeleted = await Blog.deleteMany({ author: userId });
    console.log('📝 Deleted', blogsDeleted.deletedCount, 'blogs');

    // Delete all notifications related to user
    const notificationsDeleted = await Notification.deleteMany({ 
      $or: [
        { userId: userId },
        { from: userId }
      ]
    });
    console.log('🔔 Deleted', notificationsDeleted.deletedCount, 'notifications');

    // Remove user from all followers/following lists
    const followersUpdated = await User.updateMany(
      { followers: userId },
      { $pull: { followers: userId } }
    );
    console.log('👥 Removed user from', followersUpdated.modifiedCount, 'followers lists');

    const followingUpdated = await User.updateMany(
      { following: userId },
      { $pull: { following: userId } }
    );
    console.log('👥 Removed user from', followingUpdated.modifiedCount, 'following lists');

    // Delete the user account
    const deletedUser = await User.findByIdAndDelete(userId);
    console.log('✅ User account deleted successfully');
    console.log('   Deleted user email:', deletedUser.email);

    console.log('\n✅✅✅ ACCOUNT DELETION COMPLETE ✅✅✅\n');

    res.json({ 
      success: true,
      message: 'Account and all associated content deleted successfully',
      deleted: {
        blogs: blogsDeleted.deletedCount,
        notifications: notificationsDeleted.deletedCount
      }
    });
  } catch (err) {
    console.error('\n❌❌❌ ERROR DELETING USER ACCOUNT ❌❌❌');
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
    console.error('=========================================\n');
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
