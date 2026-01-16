# Settings & Notifications Backend Implementation Guide

## Overview
This document outlines the complete backend implementation for Settings and Notifications features, with all associated APIs, models, routes, and middleware.

## Database Models

### 1. User Model (Enhanced)
**File:** `models/userModel.js`

```javascript
notificationPreferences: {
  emailFollowers: { type: Boolean, default: true },
  emailComments: { type: Boolean, default: true },
  emailLikes: { type: Boolean, default: false },
  emailDigest: { type: Boolean, default: true },
  pushNotifications: { type: Boolean, default: true },
  pushMentions: { type: Boolean, default: true }
}

profileSettings: {
  website: { type: String, default: '' },
  location: { type: String, default: '' },
  allowComments: { type: Boolean, default: true },
  showReadingTime: { type: Boolean, default: true },
  autoSaveDrafts: { type: Boolean, default: true },
  profileVisibility: { type: Boolean, default: true },
  showActivity: { type: Boolean, default: true }
}
```

### 2. Notification Model
**File:** `models/notification.js`

```javascript
NotificationSchema = {
  recipient: ObjectId (required) - User receiving notification,
  sender: ObjectId (optional) - User who triggered notification,
  type: String - 'like' | 'comment' | 'follow' | 'bookmark' | 'trending',
  title: String - Notification title,
  message: String - Notification message,
  blog: ObjectId - Reference to blog (optional),
  comment: ObjectId - Reference to comment (optional),
  data: Mixed - Additional data,
  isRead: Boolean - Read status,
  readAt: Date - When it was read,
  createdAt: Date,
  updatedAt: Date
}

Indexes:
- { recipient: 1, createdAt: -1 }
- { recipient: 1, isRead: 1 }
```

## API Routes

### Settings Routes
**Base URL:** `/api/settings`

#### 1. Get All Settings
```
GET /api/settings
Authorization: Bearer {token}

Response:
{
  "profile": {
    "firstName": "John",
    "lastName": "Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "bio": "...",
    "website": "https://example.com",
    "location": "San Francisco",
    "avatar": "...",
    "isEmailVerified": true
  },
  "writing": {
    "allowComments": true,
    "showReadingTime": true,
    "autoSaveDrafts": true
  },
  "privacy": {
    "profileVisibility": true,
    "showActivity": true
  },
  "notifications": {
    "emailFollowers": true,
    "emailComments": true,
    "emailLikes": false,
    "emailDigest": true,
    "pushNotifications": true,
    "pushMentions": true
  }
}
```

#### 2. Update Profile
```
PUT /api/settings/profile
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "firstName": "John",
  "lastName": "Doe",
  "username": "johndoe",
  "bio": "Description",
  "website": "https://example.com",
  "location": "San Francisco"
}

Response:
{
  "message": "Profile updated successfully",
  "user": { /* Updated user data */ }
}
```

#### 3. Update Writing Preferences
```
PUT /api/settings/writing
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "allowComments": true,
  "showReadingTime": true,
  "autoSaveDrafts": true
}

Response:
{
  "message": "Writing preferences updated successfully",
  "writing": { /* Updated writing preferences */ }
}
```

#### 4. Update Privacy Settings
```
PUT /api/settings/privacy
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "profileVisibility": true,
  "showActivity": true
}

Response:
{
  "message": "Privacy settings updated successfully",
  "privacy": { /* Updated privacy settings */ }
}
```

#### 5. Update Notification Preferences
```
PUT /api/settings/notifications
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "emailFollowers": true,
  "emailComments": true,
  "emailLikes": false,
  "emailDigest": true,
  "pushNotifications": true,
  "pushMentions": true
}

Response:
{
  "message": "Notification preferences updated successfully",
  "notifications": { /* Updated preferences */ }
}
```

#### 6. Change Password
```
PUT /api/settings/password
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword123",
  "confirmPassword": "newPassword123"
}

Response:
{
  "message": "Password changed successfully"
}

Errors:
- 400: "All password fields are required"
- 400: "New passwords do not match"
- 400: "Password must be at least 6 characters"
- 401: "Current password is incorrect"
```

#### 7. Upload Avatar
```
POST /api/settings/avatar
Authorization: Bearer {token}
Content-Type: multipart/form-data

Request Body:
- avatar: <file> (JPG, PNG, GIF max 2MB)

Response:
{
  "message": "Avatar uploaded successfully",
  "avatar": "https://cloudinary-url.com/image.jpg"
}

Errors:
- 400: "No file provided"
- 400: "Invalid file type. Only JPG, PNG, GIF allowed"
- 400: "File size must be less than 2MB"
```

### Notification Routes
**Base URL:** `/api/notifications`

#### 1. Get Notifications
```
GET /api/notifications?filter=all&page=1&limit=10
Authorization: Bearer {token}

Query Parameters:
- filter: 'all' | 'unread' | 'like' | 'comment' | 'follow' | 'bookmark' | 'trending'
- page: number (default: 1)
- limit: number (default: 10)

Response:
{
  "notifications": [
    {
      "_id": "...",
      "recipient": "...",
      "sender": { "name": "...", "avatar": "..." },
      "type": "like",
      "title": "John Doe liked your article",
      "message": "Your article 'Introduction to Node' received a like",
      "blog": { "title": "Introduction to Node", "slug": "intro-node" },
      "isRead": false,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 10,
    "pages": 5
  },
  "unreadCount": 12
}
```

#### 2. Get Notification Stats
```
GET /api/notifications/stats
Authorization: Bearer {token}

Response:
{
  "stats": {
    "likes": 23,
    "comments": 5,
    "followers": 8,
    "bookmarks": 12
  }
}
```

#### 3. Mark Notification as Read
```
PUT /api/notifications/{notificationId}/read
Authorization: Bearer {token}

Response:
{
  "message": "Notification marked as read"
}

Errors:
- 404: "Notification not found"
- 403: "Unauthorized"
```

#### 4. Mark All as Read
```
PUT /api/notifications/read-all
Authorization: Bearer {token}

Response:
{
  "message": "All notifications marked as read",
  "updatedCount": 12
}
```

#### 5. Delete Notification
```
DELETE /api/notifications/{notificationId}
Authorization: Bearer {token}

Response:
{
  "message": "Notification deleted successfully"
}

Errors:
- 404: "Notification not found"
- 403: "Unauthorized"
```

#### 6. Delete All Notifications
```
DELETE /api/notifications/delete-all
Authorization: Bearer {token}

Response:
{
  "message": "All notifications deleted",
  "deletedCount": 45
}
```

## Service Layer

### Notification Service
**File:** `services/notificationService.js`

Provides helper functions to create notifications with preference checking:

#### Functions:

1. **notifyBlogLike(userId, blogId, likerData)**
   - Creates like notification
   - Respects emailLikes preference
   - Only notifies if user hasn't muted notifications

2. **notifyBlogComment(userId, blogId, commentData)**
   - Creates comment notification
   - Respects emailComments preference
   - Includes comment preview

3. **notifyUserFollow(userId, followerId)**
   - Creates follow notification
   - Respects emailFollowers preference
   - Auto-rejects if user follows themselves

4. **notifyBlogBookmark(userId, blogId, bookmarkerData)**
   - Creates bookmark milestone notification
   - Only notifies on: 1st, 5th, 10th, 25th, 50th, 100th bookmarks
   - Includes milestone count

5. **notifyTrendingBlog(userId, blogId)**
   - Creates trending notification
   - Only sent once per blog
   - Sent to blog author

6. **notifyCommentReply(userId, blogId, commentData, replyData)**
   - Creates reply-to-comment notification
   - Respects emailComments preference
   - Includes reply preview

7. **clearOldNotifications(days = 30)**
   - Bulk delete read notifications older than specified days
   - Used for database cleanup

## Controller Functions

### Settings Controller
**File:** `controllers/settings.js`

#### Implemented Functions:

1. **getSettings(req, res)**
   - Retrieves all user settings
   - Formats profile data

2. **updateProfile(req, res)**
   - Updates name, bio, website, location
   - Validates input

3. **updateWritingPreferences(req, res)**
   - Updates allowComments, showReadingTime, autoSaveDrafts

4. **updatePrivacy(req, res)**
   - Updates profileVisibility, showActivity

5. **updateNotificationPreferences(req, res)**
   - Updates all email and push notification preferences
   - Respects all notification settings

6. **changePassword(req, res)**
   - Validates current password
   - Updates password with hashing
   - Comprehensive error handling

7. **uploadAvatar(req, res)**
   - Validates file type (JPG, PNG, GIF)
   - Validates file size (max 2MB)
   - Deletes old avatar from Cloudinary
   - Uploads new avatar to Cloudinary

### Notifications Controller
**File:** `controllers/notifications.js`

#### Implemented Functions:

1. **getNotifications(req, res)**
   - Fetches notifications with filters
   - Supports pagination
   - Returns stats with response

2. **getNotificationStats(req, res)**
   - Returns count by type: likes, comments, followers, bookmarks

3. **markAsRead(req, res)**
   - Marks single notification as read
   - Sets readAt timestamp

4. **markAllAsRead(req, res)**
   - Marks all unread notifications as read
   - Returns count of updated notifications

5. **deleteNotification(req, res)**
   - Deletes single notification
   - Validates ownership

6. **deleteAllNotifications(req, res)**
   - Deletes all user's notifications
   - Returns count of deleted notifications

7. **createNotification(notificationData)** (Internal)
   - Internal helper function
   - Used by other controllers to create notifications

## Integration Points

### 1. Like Creation (routes/likes.js)
```javascript
// When a blog is liked:
await notifyBlogLike(blog.author._id, blogId, {
  sender: req.user._id,
  likeCount: count
});
```

### 2. Comment Creation (routes/comments.js)
```javascript
// When a comment is created:
await notifyBlogComment(blog.author._id, blogId, {
  author: req.user._id,
  content: content,
  _id: comment._id
});
```

### 3. User Follow (routes/users.js)
```javascript
// When user follows another:
await notifyUserFollow(req.params.userId, req.user._id);
```

### 4. Blog Bookmark (routes/bookmarks.js)
```javascript
// When blog is bookmarked:
await notifyBlogBookmark(blog.author, blogId, {
  user: req.user._id,
  username: req.user.name
});
```

## Frontend Integration

### Settings Page
**File:** `src/Pages/Settings.jsx`

Endpoints called:
- `GET /api/settings` - Load all settings on mount
- `PUT /api/settings/profile` - Save profile changes
- `PUT /api/settings/writing` - Save writing preferences
- `PUT /api/settings/privacy` - Save privacy settings
- `PUT /api/settings/notifications` - Save notification preferences
- `PUT /api/settings/password` - Change password
- `POST /api/settings/avatar` - Upload avatar

### Notifications Page
**File:** `src/Pages/Notifications.jsx`

Endpoints called:
- `GET /api/notifications` - Load notifications with filters
- `GET /api/notifications/stats` - Load statistics
- `PUT /api/notifications/{id}/read` - Mark single as read
- `PUT /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/{id}` - Delete single
- `POST /api/users/{userId}/follow` - Follow back from notification

## Middleware

### Auth Middleware
**File:** `middleware/auth.js`
- Verifies JWT token
- Ensures user is authenticated before accessing settings/notifications

### Upload Middleware
**File:** `middleware/upload.js`
- Handles file upload for avatar
- Used in settings avatar endpoint

## Error Handling

All endpoints include comprehensive error handling:

1. **Validation Errors (400)**
   - Invalid input format
   - Missing required fields
   - File size/type validation

2. **Authentication Errors (401)**
   - Missing or invalid token
   - Incorrect password

3. **Authorization Errors (403)**
   - User doesn't own the resource
   - Insufficient permissions

4. **Not Found Errors (404)**
   - Resource doesn't exist
   - User not found

5. **Server Errors (500)**
   - Database errors
   - Upload failures
   - Unexpected server issues

## Real-time Updates

The system implements real-time updates through:

1. **Database-First Approach**: All notifications stored in MongoDB
2. **Preference Filtering**: Respects user notification preferences
3. **Consistency**: Settings updated immediately and reflected everywhere
4. **Cleanup**: Old notifications automatically cleared

## Performance Optimizations

1. **Indexed Queries**: Notifications table indexed on recipient and read status
2. **Pagination**: Large notification lists paginated by default
3. **Population**: Selective field population to reduce payload
4. **Caching**: User settings cached on frontend after fetch

## Security Considerations

1. **JWT Authentication**: All endpoints require authentication
2. **Input Validation**: All user inputs validated
3. **File Upload**: Only allowed file types, size limits enforced
4. **Ownership Verification**: Users can only modify their own data
5. **Password Security**: Bcrypt hashing, old avatar deletion
6. **Rate Limiting**: Applied to all sensitive endpoints

## Testing Recommendations

1. **Unit Tests**: Test each controller function
2. **Integration Tests**: Test full request/response cycles
3. **Permission Tests**: Verify authorization rules
4. **File Upload Tests**: Test various file types and sizes
5. **Notification Preference Tests**: Verify preference filtering
6. **Pagination Tests**: Test with various page/limit values

## Deployment Checklist

- [ ] All dependencies installed (bcryptjs, cloudinary, etc.)
- [ ] Environment variables configured (CLOUDINARY_URL, DB_URL)
- [ ] Database migrations run
- [ ] Notification service tested
- [ ] Email service integrated
- [ ] Settings routes registered in main app.js
- [ ] Frontend API URLs configured
- [ ] Auth middleware active on all protected routes
- [ ] Rate limiting enabled
- [ ] CORS configured properly
- [ ] Logging set up and tested
- [ ] Backups configured for notification data
