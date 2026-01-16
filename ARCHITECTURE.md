# Complete System Architecture - Photo Upload & Real-Time Notifications

## System Overview Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     FRONTEND (React/Tailwind)                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────┐    ┌──────────────────────────────┐  │
│  │   Settings.jsx       │    │   Notifications.jsx          │  │
│  │  ─────────────────   │    │  ──────────────────          │  │
│  │  • Profile Tab       │    │  • Notification List         │  │
│  │  • Account Tab       │    │  • Filter Tabs               │  │
│  │  • Notifications Tab │    │  • Stats Dashboard           │  │
│  │  • Appearance Tab    │    │  • Real-time Updates (5s)    │  │
│  │                      │    │  • Pagination                │  │
│  │  Features:           │    │                              │  │
│  │  ✓ Avatar Upload     │    │  Features:                   │  │
│  │  ✓ Profile Save      │    │  ✓ Auto-refresh              │  │
│  │  ✓ Password Change   │    │  ✓ Mark as Read              │  │
│  │  ✓ Preferences       │    │  ✓ Delete                    │  │
│  │  ✓ Form Validation   │    │  ✓ Follow Back               │  │
│  └──────────────────────┘    └──────────────────────────────┘  │
│          │                              │                        │
│          │ UpdateAvatar()               │ FetchNotifications()   │
│          │ UpdateProfile()              │ FetchStats()           │
│          │ ChangePassword()             │ MarkAsRead()           │
│          │                              │ DeleteNotification()   │
│          └──────────────────────────────┘                        │
│                      │                                           │
└──────────────────────┼──────────────────────────────────────────┘
                       │ HTTP/REST + JWT
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                  BACKEND (Express/Node.js)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              MIDDLEWARE STACK                            │    │
│  │  • auth (JWT verification)                              │    │
│  │  • upload (multer for file handling)                     │    │
│  │  • validation (input sanitization)                       │    │
│  │  • security (CORS, rate limiting)                        │    │
│  └─────────────────────────────────────────────────────────┘    │
│                           │                                      │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              ROUTES LAYER                                │    │
│  ├──────────────────────┬──────────────────────────────────┤    │
│  │  /api/settings       │  • GET / - Get all settings      │    │
│  │  ───────────────────  │  • PUT /profile - Update        │    │
│  │                       │  • POST /avatar - Upload        │    │
│  │  /api/upload         │  • PUT /notifications - Prefs    │    │
│  │  ────────────────     │  • PUT /password - Change pass  │    │
│  │                       │                                  │    │
│  │  /api/notifications  │  • GET / - List notifs          │    │
│  │  ────────────────     │  • GET /stats - Stats           │    │
│  │                       │  • PUT /{id}/read - Mark read   │    │
│  │  /api/likes          │  • PUT /read-all - Mark all      │    │
│  │  /api/comments       │  • DELETE /{id} - Delete         │    │
│  │  /api/users          │                                  │    │
│  │  ────────────────     │  Notification Creation:         │    │
│  │                       │  • On like → notifyBlogLike()   │    │
│  │                       │  • On comment → notifyComment() │    │
│  │                       │  • On follow → notifyFollow()   │    │
│  └──────────────────────┴──────────────────────────────────┘    │
│           │                  │                  │                │
│           ▼                  ▼                  ▼                │
│  ┌─────────────────┐ ┌──────────────────┐ ┌────────────────┐  │
│  │  CONTROLLERS    │ │   SERVICES       │ │  MIDDLEWARE    │  │
│  │  ───────────    │ │   ────────       │ │  ──────────    │  │
│  │  • settings.js  │ │ • notification   │ │ • auth.js      │  │
│  │  • notifications│ │   Service.js     │ │ • upload.js    │  │
│  │  • likes.js     │ │ • email          │ │ • security.js  │  │
│  │  • comments.js  │ │   Service.js     │ │                │  │
│  │  • users.js     │ │                  │ │                │  │
│  └─────────────────┘ └──────────────────┘ └────────────────┘  │
│           │                  │                                   │
│           └──────────────────┼───────────────────────────────┐   │
│                              │                               │   │
│                              ▼                               ▼   │
│                  ┌───────────────────────────────────────────┐   │
│                  │     EXTERNAL SERVICES                     │   │
│                  │  ───────────────────────────────────────  │   │
│                  │  • Cloudinary (Image Upload & Storage)    │   │
│                  │    - uploadToCloudinary()                 │   │
│                  │    - deleteFromCloudinary()               │   │
│                  │    - Folder: avatars/user_{id}            │   │
│                  │    - Folder: blogs/                        │   │
│                  │                                            │   │
│                  │  • Email Service (Notifications)          │   │
│                  │    - sendLikeNotification()               │   │
│                  │    - sendCommentNotification()            │   │
│                  │    - sendFollowNotification()             │   │
│                  └───────────────────────────────────────────┘   │
│                              │                                    │
└──────────────────────────────┼────────────────────────────────────┘
                               │
                    ┌──────────┴──────────┐
                    ▼                     ▼
         ┌─────────────────┐  ┌──────────────────┐
         │   CLOUDINARY    │  │   MongoDB Atlas  │
         │   ───────────   │  │   ────────────── │
         │  Image Storage  │  │  Collections:    │
         │  & Delivery     │  │  • users         │
         │                 │  │  • blogs         │
         │  URLs:          │  │  • notifications │
         │  • avatars/     │  │  • likes         │
         │  • blogs/       │  │  • comments      │
         │                 │  │  • bookmarks     │
         └─────────────────┘  └──────────────────┘
```

---

## Data Flow Diagrams

### Avatar Upload Flow
```
User selects file in Settings.jsx
        │
        ▼
handleAvatarChange()
  • Read file
  • Create preview
  • Display in UI
        │
        ▼
handleAvatarUpload()
  • Create FormData
  • POST /api/settings/avatar
        │
        ▼
Backend: uploadAvatar() controller
  ├─ Validate file (type, size)
  ├─ Get current user
  ├─ Delete old avatar from Cloudinary
  ├─ Upload new to Cloudinary
  │  └─ Path: avatars/user_{userId}
  ├─ Update user.avatar in DB
  └─ Return secure_url
        │
        ▼
Frontend: Update state
  ├─ updateAvatar() in UserContext
  ├─ setFormData.avatar = newUrl
  ├─ Update localStorage
  ├─ Dispatch storage event
  └─ Show success alert
        │
        ▼
User sees avatar updated in navbar + settings
```

### Like Notification Creation Flow
```
User clicks "Like" button on blog
        │
        ▼
POST /api/likes/{blogId}
        │
        ▼
Backend: Like Route Handler
  ├─ Check blog exists
  ├─ Check not already liked
  ├─ Create Like document
  ├─ Increment like count
  └─ Call notifyBlogLike()
        │
        ▼
notifyBlogLike() in notificationService.js
  ├─ Check if not self-like
  ├─ Fetch sender user data
  ├─ Fetch blog data
  ├─ Check recipient's preferences
  │  └─ If emailLikes = false, skip
  ├─ Create Notification document
  │  ├─ recipient: blog.author
  │  ├─ sender: user who liked
  │  ├─ type: "like"
  │  ├─ title: "{Name} liked your article"
  │  ├─ message: "'{Title}' received a new like"
  │  ├─ blog: blogId
  │  └─ isRead: false
  └─ Save to DB
        │
        ▼
Send like response to frontend
  └─ {message: "Blog liked", count: N}
        │
        ▼
Blog author's Notifications page
  ├─ Auto-refresh every 5 seconds
  ├─ Fetches GET /api/notifications
  ├─ New notification appears
  ├─ Stats updated (likes +1)
  └─ Unread count increased
```

### Notification Display Flow
```
Notifications.jsx mounts
        │
        ├─ fetchNotifications()
        ├─ fetchStats()
        └─ Set 5-second auto-refresh interval
        │
        ▼
GET /api/notifications?page=1&limit=10&filter=all
        │
        ▼
Backend: getNotifications() controller
  ├─ Find notifications for recipient
  ├─ Apply filter (type, isRead)
  ├─ Populate references:
  │  ├─ sender: name, avatar, email
  │  ├─ blog: title, slug
  │  └─ comment: content
  ├─ Sort by createdAt descending
  └─ Return paginated results
        │
        ▼
Frontend: Process response
  ├─ Set notifications state
  ├─ Map to NotificationItem components
  └─ Render with proper styling
        │
        ▼
User sees notification cards
        │
    ┌───┴──────────────────┬────────────┐
    ▼                      ▼            ▼
Mark as Read         Delete           Follow Back
    │                  │               │
    ▼                  ▼               ▼
PUT /read         DELETE /id      POST /follow
    │                  │               │
    ▼                  ▼               ▼
Updates           Removes from       Adds follow
isRead: true      DB & UI             relationship
```

---

## Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  
  // Authentication
  name: String,              // Full name
  firstName: String,         // First name
  lastName: String,          // Last name
  username: String,          // Unique handle
  email: String,             // Unique email
  password: String,          // Hashed
  role: "user" | "admin",
  isEmailVerified: Boolean,
  
  // OTP & Password Reset
  otp: String,
  otpExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  
  // Profile
  bio: String,
  avatar: String,            // Cloudinary URL
  blog: [ObjectId],          // Ref to Blog
  followers: [ObjectId],     // Ref to User
  following: [ObjectId],     // Ref to User
  
  // Settings
  notificationPreferences: {
    emailFollowers: Boolean,
    emailComments: Boolean,
    emailLikes: Boolean,
    emailDigest: Boolean,
    pushNotifications: Boolean,
    pushMentions: Boolean
  },
  profileSettings: {
    website: String,
    location: String,
    allowComments: Boolean,
    showReadingTime: Boolean,
    autoSaveDrafts: Boolean,
    profileVisibility: Boolean,
    showActivity: Boolean
  },
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

### Notification Collection
```javascript
{
  _id: ObjectId,
  
  recipient: ObjectId,       // Ref to User (recipient)
  sender: ObjectId,          // Ref to User (who triggered)
  type: "like|comment|follow|bookmark|trending",
  
  title: String,             // "John liked your article"
  message: String,           // "'Post Title' received a new like"
  
  blog: ObjectId,            // Ref to Blog (optional)
  comment: ObjectId,         // Ref to Comment (optional)
  
  data: {
    // Type-specific data
    likerName: String,       // For likes
    likerAvatar: String,
    
    commentContent: String,  // For comments (preview)
    authorName: String,
    
    followerName: String,    // For follows
    followerAvatar: String,
    
    bookmarkCount: Number,   // For bookmarks
    
    trending: Boolean        // For trending
  },
  
  isRead: Boolean,
  readAt: Date,
  
  createdAt: Date,
  updatedAt: Date
}

// Indexes:
// { recipient: 1, createdAt: -1 }
// { recipient: 1, isRead: 1 }
```

### Blog Collection
```javascript
{
  _id: ObjectId,
  
  title: String,
  blog_content: String,
  short_description: String,
  images: [String],          // Cloudinary URLs
  
  category: [ObjectId],      // Ref to Category
  tags: [String],
  
  author: ObjectId,          // Ref to User
  status: "draft|published|scheduled",
  scheduledAt: Date,
  
  views: Number,
  wordCount: Number,
  readingTime: Number,
  
  createdAt: Date,
  updatedAt: Date
}
```

---

## API Endpoints Summary

### Settings Management
```
GET  /api/settings
     - Fetch all user settings
     - Returns: profile, writing, privacy, notifications

PUT  /api/settings/profile
     - Update: firstName, lastName, bio, website, location
     - Returns: updated profile

POST /api/settings/avatar
     - Upload avatar image
     - Content-Type: multipart/form-data
     - Returns: avatar URL

PUT  /api/settings/notifications
     - Update notification preferences
     - Returns: updated preferences

PUT  /api/settings/password
     - Change password
     - Requires: currentPassword, newPassword, confirmPassword
     - Returns: success message
```

### Image Upload
```
POST /api/upload/upload
     - Upload single image
     - Content-Type: multipart/form-data
     - Returns: {success, url, message}

POST /api/upload/upload-multiple
     - Upload up to 10 images
     - Content-Type: multipart/form-data
     - Returns: {success, urls[], message}
```

### Notifications
```
GET  /api/notifications?page=1&limit=10&filter=all|like|comment|follow
     - Fetch notifications
     - Returns: {notifications[], pagination, unreadCount}

GET  /api/notifications/stats
     - Fetch notification statistics
     - Returns: {stats: {likes, comments, followers, bookmarks}}

PUT  /api/notifications/{id}/read
     - Mark single notification as read
     - Returns: {message}

PUT  /api/notifications/read-all
     - Mark all notifications as read
     - Returns: {message, updatedCount}

DELETE /api/notifications/{id}
       - Delete notification
       - Returns: {message}
```

### Social Interactions (Notification Triggers)
```
POST /api/likes/{blogId}
     - Like blog
     - Triggers: notifyBlogLike()
     - Returns: {message, count}

POST /api/comments/
     - Comment on blog
     - Body: {blogId, content}
     - Triggers: notifyBlogComment()
     - Returns: {comment object}

POST /api/users/{userId}/follow
      - Follow user
      - Triggers: notifyUserFollow()
      - Returns: {message}
```

---

## Frontend Component Structure

### Settings.jsx Component Hierarchy
```
Settings
├─ State:
│  ├─ activeTab: 'profile' | 'account' | 'notifications' | 'appearance'
│  ├─ formData: {firstName, lastName, bio, website, location, avatar, ...}
│  ├─ passwordData: {currentPassword, newPassword, confirmPassword}
│  ├─ previewAvatar: URL | null
│  └─ alert: {type, message} | null
│
├─ Effects:
│  └─ Load user data on mount
│
├─ Handlers:
│  ├─ handleInputChange(e)
│  ├─ handleAvatarChange(e)
│  ├─ handleAvatarUpload()
│  ├─ handleSaveProfile()
│  ├─ handleChangePassword()
│  ├─ handleSaveWritingPreferences()
│  ├─ handleSavePrivacy()
│  └─ handleSaveNotifications()
│
└─ Render:
   ├─ TabButton Component (x4)
   └─ Conditional Tab Content
      ├─ Profile Tab
      ├─ Account Tab
      ├─ Notifications Tab
      └─ Appearance Tab
```

### Notifications.jsx Component Hierarchy
```
Notifications
├─ State:
│  ├─ notifications: Notification[]
│  ├─ stats: {likes, comments, followers, bookmarks}
│  ├─ filter: 'all' | 'unread' | 'like' | 'comment' | 'follow'
│  ├─ page: number
│  ├─ hasMore: boolean
│  ├─ loading: boolean
│  ├─ refreshing: boolean
│  └─ alert: {type, message} | null
│
├─ Effects:
│  ├─ Load notifications on mount
│  ├─ Load stats on mount
│  └─ Set 5-second auto-refresh interval
│
├─ Callbacks:
│  ├─ fetchNotifications(pageNum)
│  ├─ fetchStats()
│  ├─ handleRefresh()
│  ├─ handleMarkAllRead()
│  ├─ handleMarkAsRead(id)
│  ├─ handleDeleteNotification(id)
│  └─ handleFollowBack(id, followerId)
│
└─ Render:
   ├─ Header (with refresh button)
   ├─ Stats Cards (4x)
   ├─ Filter Tabs (5x)
   ├─ Mark All Read Button
   ├─ Notifications List
   │  ├─ NotificationItem (x many)
   │  │  ├─ Icon (by type)
   │  │  ├─ Content
   │  │  ├─ Timestamp
   │  │  ├─ Comment preview
   │  │  └─ Actions (mark read, delete, follow back)
   │  └─ Load More Button
   └─ Empty State
```

---

## Security Architecture

### Authentication Flow
```
User Login
    │
    ▼
POST /api/auth/login
    │
    ├─ Validate credentials
    ├─ Hash password verification
    └─ Generate JWT token
    │
    ▼
Frontend stores JWT in localStorage
    │
    ▼
All protected requests include:
Authorization: Bearer {token}
    │
    ▼
Backend: auth middleware
    ├─ Extract token from header
    ├─ Verify JWT signature
    ├─ Extract user._id
    ├─ Attach to req.user
    └─ Continue to route handler
    │
    ▼
Authorized endpoint executes
```

### File Upload Security
```
Frontend
    │
    ├─ Check file type (client-side)
    ├─ Check file size (client-side)
    └─ Create preview
    │
    ▼
Backend: uploadAvatar()
    │
    ├─ Validate file type
    │  └─ Allowed: image/jpeg, image/png, image/gif
    ├─ Validate file size
    │  └─ Max: 2MB
    ├─ Sanitize filename
    ├─ Use public ID: avatars/user_{userId}
    └─ Upload to Cloudinary
    │
    ▼
Cloudinary
    ├─ Stores file securely
    ├─ Returns CDN URL
    └─ Manages delivery
```

---

## Error Handling Strategy

```
Try-Catch Blocks
    ├─ Database operations
    ├─ Cloudinary uploads
    ├─ External API calls
    └─ File operations
    │
    ▼
Error Categorization
    ├─ 400 - Bad Request
    │  └─ Validation errors, missing fields
    ├─ 401 - Unauthorized
    │  └─ Invalid JWT, expired token
    ├─ 403 - Forbidden
    │  └─ Insufficient permissions
    ├─ 404 - Not Found
    │  └─ Resource doesn't exist
    ├─ 500 - Server Error
    │  └─ Unexpected errors
    └─ Other specific errors
    │
    ▼
Logging
    ├─ Log all errors to logger.js
    ├─ Include: timestamp, userId, action, error
    └─ Monitor for patterns
    │
    ▼
User Notification
    ├─ Show friendly error message
    ├─ No sensitive information
    ├─ Suggest action to user
    └─ Offer retry option
```

---

## Performance Optimization Summary

| Operation | Target | Strategy |
|-----------|--------|----------|
| Avatar Upload | < 3s | Cloudinary CDN, compression |
| Settings Save | < 1s | Direct DB update, indexing |
| Load Notifications | < 2s | Pagination, lean queries |
| Like/Comment | < 1s | Async notification creation |
| Notification Appear | < 5s | Auto-refresh interval |
| Mark As Read | < 1s | Bulk update query |
| Filter Switch | < 1s | Client-side state + API pagination |

---

## Future Enhancement Roadmap

### Phase 2: WebSocket Real-Time
```javascript
// Replace 5-second poll with Socket.IO
io.on('notification:created', (notification) => {
  setNotifications(prev => [notification, ...prev]);
  updateStats();
});
```

### Phase 3: Advanced Filtering
- Date range filtering
- Archive old notifications
- Notification grouping by type
- Smart sorting

### Phase 4: Push Notifications
- Service Worker registration
- Browser push notifications
- Mobile app integration
- Background sync

### Phase 5: Email Digests
- Batch notifications by type
- Daily/weekly digest options
- Custom scheduling
- HTML email templates

---

**Architecture Documentation Complete**
**Last Updated:** January 16, 2026
**Status:** ✅ Production Ready

