# Quick Start Guide - Settings & Notifications Backend

## What Was Implemented

### 1. Settings System ✅
Complete user settings management with the following features:

**Profile Settings**
- First/Last name, username, email
- Bio, website, location
- Avatar upload (JPG, PNG, GIF - max 2MB)

**Writing Preferences**
- Allow comments on articles
- Show reading time estimates
- Auto-save drafts

**Privacy Settings**
- Profile visibility toggle
- Activity status visibility
- Account privacy controls

**Notification Preferences**
- Email notifications (new followers, comments, likes, digest)
- Push notifications (enable/disable, mentions)

**Account Security**
- Password change with current password verification
- Comprehensive validation and error handling

### 2. Notification System ✅
Complete notification management with automatic triggering:

**Notification Types**
1. **Like** - When someone likes your blog post
2. **Comment** - When someone comments on your post
3. **Follow** - When someone follows you
4. **Bookmark** - Milestone notifications (1st, 5th, 10th, etc.)
5. **Trending** - When your post goes trending
6. **Reply** - When someone replies to your comment

**Notification Features**
- Respects user preferences (honor notification settings)
- Mark as read / Mark all read
- Delete single / Delete all
- Filter by type (all, unread, likes, comments, follows)
- Pagination support
- Statistics dashboard (counts by type)
- Follow back from notification

### 3. Database Enhancements ✅

**User Model**
- notificationPreferences object
- profileSettings object
- Enhanced profile fields

**Notification Model**
- Comprehensive schema for all notification types
- Indexed for performance
- Timestamps for tracking

### 4. API Endpoints ✅

**Settings (8 endpoints)**
- GET /api/settings - Get all settings
- PUT /api/settings/profile - Update profile
- PUT /api/settings/writing - Update writing preferences
- PUT /api/settings/privacy - Update privacy
- PUT /api/settings/notifications - Update notification preferences
- PUT /api/settings/password - Change password
- POST /api/settings/avatar - Upload avatar

**Notifications (6 endpoints)**
- GET /api/notifications - Get notifications with filters
- GET /api/notifications/stats - Get stats
- PUT /api/notifications/{id}/read - Mark as read
- PUT /api/notifications/read-all - Mark all read
- DELETE /api/notifications/{id} - Delete notification
- DELETE /api/notifications/delete-all - Delete all

### 5. Frontend Integration ✅

**Settings Page** (`src/Pages/Settings.jsx`)
- All settings form handlers now call actual backend APIs
- Profile updates
- Password change with validation
- Writing preferences
- Privacy settings
- Notification preferences
- Avatar upload with preview

**Notifications Page** (`src/Pages/Notifications.jsx`)
- Real-time notification fetching
- Mark as read functionality
- Delete single/all notifications
- Follow back button
- Filter by type
- Statistics display
- Proper error handling

### 6. Service Layer ✅

**Notification Service** (`services/notificationService.js`)
- Helper functions for each notification type
- Automatic preference checking
- Prevents self-notifications
- Milestone tracking for bookmarks
- One-time notifications for trending

### 7. Automatic Triggers ✅

Notifications are automatically created when:
- Someone likes your blog post
- Someone comments on your blog post
- Someone follows you
- Your blog reaches bookmark milestones
- Your blog starts trending
- Someone replies to your comment

All respecting user notification preferences!

## How to Use

### 1. Load Settings
```javascript
fetch('/api/settings', {
  headers: { 'Authorization': `Bearer ${token}` }
})
```

### 2. Update Settings
```javascript
fetch('/api/settings/profile', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    firstName: 'John',
    lastName: 'Doe',
    bio: 'My bio',
    website: 'https://example.com',
    location: 'San Francisco'
  })
})
```

### 3. Change Password
```javascript
fetch('/api/settings/password', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    currentPassword: 'oldPass123',
    newPassword: 'newPass123',
    confirmPassword: 'newPass123'
  })
})
```

### 4. Upload Avatar
```javascript
const formData = new FormData();
formData.append('avatar', fileInput.files[0]);

fetch('/api/settings/avatar', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData
})
```

### 5. Get Notifications
```javascript
fetch('/api/notifications?filter=all&page=1&limit=10', {
  headers: { 'Authorization': `Bearer ${token}` }
})
```

### 6. Mark as Read
```javascript
fetch(`/api/notifications/${notificationId}/read`, {
  method: 'PUT',
  headers: { 'Authorization': `Bearer ${token}` }
})
```

### 7. Delete Notification
```javascript
fetch(`/api/notifications/${notificationId}`, {
  method: 'DELETE',
  headers: { 'Authorization': `Bearer ${token}` }
})
```

## Files Modified/Created

### Backend Files
1. `controllers/settings.js` - Added avatar upload handler
2. `routes/settings.js` - Added avatar upload route
3. `services/notificationService.js` - **NEW** Notification creation helpers
4. `routes/likes.js` - Integrated notification service
5. `routes/comments.js` - Integrated notification service
6. `routes/users.js` - Integrated notification service
7. `routes/bookmarks.js` - Integrated notification service

### Frontend Files
1. `src/Pages/Settings.jsx` - Updated all handlers to call backend APIs
2. `src/Pages/Notifications.jsx` - Added delete and follow back handlers

## Real-World Example Flow

### When a User Likes a Blog:

1. User clicks "Like" on a blog post
2. Frontend sends: `POST /api/likes/{blogId}`
3. Backend creates Like record
4. Backend checks blog author's notification preferences
5. **If emailLikes is true**: Notification created in DB
6. Blog author sees notification in real-time
7. Author can:
   - Click to mark as read
   - Click delete button to remove
   - View in notification stats

### When User Updates Settings:

1. User changes profile name in Settings page
2. Frontend sends: `PUT /api/settings/profile` with new data
3. Backend validates and updates User record
4. Response confirms success
5. All subsequent API calls use updated profile
6. Notifications use updated name in future notifications

### Notification Preference System:

1. User disables "Email on Likes" in Settings
2. Frontend sends: `PUT /api/settings/notifications` with `emailLikes: false`
3. Backend updates user's notificationPreferences
4. Someone likes user's blog
5. Backend checks: `user.notificationPreferences.emailLikes` → false
6. **Notification NOT created** (respects user preference)
7. No notification appears for the user

## Key Features

✅ **Secure** - JWT authentication on all endpoints
✅ **Real-time** - Notifications created immediately
✅ **Preference-Aware** - Respects user notification settings
✅ **Scalable** - Indexed database queries
✅ **User-Friendly** - Professional error messages
✅ **Complete** - All CRUD operations supported
✅ **Integrated** - Works across all content types (blogs, comments, follows)
✅ **Performant** - Pagination and indexed searches

## Testing the Implementation

### Test Settings:
1. Go to Settings page
2. Click "Profile" tab
3. Change name and bio
4. Click "Save Changes"
5. Verify success message
6. Refresh page
7. Confirm changes persisted

### Test Notifications:
1. Go to Notifications page
2. Like a blog post as different user
3. Notifications page auto-refreshes
4. Click notification to mark read
5. Click X to delete
6. For follow notifications, click "Follow Back"

### Test Avatar Upload:
1. Go to Settings > Profile
2. Click "Upload new photo"
3. Select JPG/PNG/GIF file (< 2MB)
4. Click "Save Avatar"
5. Confirm avatar updated in profile

## Troubleshooting

### Issue: 401 Unauthorized
**Solution**: Ensure token is passed in Authorization header
```
Authorization: Bearer {token}
```

### Issue: Avatar upload fails
**Solution**: Check file is JPG/PNG/GIF and under 2MB
**Or**: Verify Cloudinary credentials in .env

### Issue: Notifications not appearing
**Solution**: 
1. Check user's notification preferences
2. Verify user isn't trying to notify themselves
3. Check database connection

### Issue: Password change fails
**Solution**: Verify current password is correct and new passwords match

## Next Steps

1. **Email Notifications**: Integrate email service for each notification type
2. **Push Notifications**: Implement web push notifications
3. **Activity Feed**: Create real-time activity feed
4. **Email Digest**: Implement weekly/daily digest emails
5. **Notification Preferences UI**: Allow per-type customization
6. **Read Receipts**: Track when notifications were read

## Performance Notes

- Notifications table is indexed on (recipient, createdAt) and (recipient, isRead)
- Pagination defaults to 10 items per page
- Old notifications auto-cleared after 30 days (optional)
- User settings cached on frontend after first fetch

## Security Notes

- All endpoints require JWT authentication
- Password changes require current password verification
- Avatar uploads validated for type and size
- User can only modify their own settings
- Notification data is private per user

---

**Implementation Complete!** 🎉

All Settings and Notifications functionality is now fully implemented and integrated with real backend APIs. The system is production-ready and follows professional backend standards.
