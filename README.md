# 📚 Zarrin Blogs - Complete Blogging Platform

A modern, full-stack blogging application with real-time notifications, user profiles, bookmarking, and social features.

---

## 🎯 Overview

**Zarrin Blogs** is a comprehensive blogging platform built with:
- **Frontend**: React.js with Tailwind CSS and Lucide icons
- **Backend**: Node.js/Express with MongoDB
- **Storage**: Cloudinary for image and avatar management
- **Real-time**: In-app notifications with email support
- **State Management**: React Context API for user profile sync

---

## ✨ Current Functionality

### 🔐 **Authentication**
- User signup with email verification
- Login with JWT token
- Password reset via email OTP
- Secure session management with localStorage

### 📝 **Blog Management**
- Create, read, update, delete (CRUD) blogs
- Blog drafts support
- Rich content editing
- Category-based organization
- Search blogs by title and content
- Blog preview with reading time estimation
- Related blogs suggestions
- Paginated blog listing

### 👥 **User Profiles**
- Public user profiles with blog count
- Avatar upload (Cloudinary integration)
- Bio, website, and location fields
- Real follower/following counts
- Follow/unfollow users
- View user's published blogs

### ❤️ **Social Features**
- **Like Blogs**: Like/unlike with real-time counts
- **Comments**: Add, edit, delete comments with author controls
- **Bookmarks**: Save blogs to personal bookmark collection
- **Follow System**: Follow/unfollow users, view followers/following lists
- **Activity Tracking**: Reading progress tracking per blog

### 🔔 **Notifications System**
- **Real-time In-app Notifications**: Triggered on:
  - Someone likes your blog
  - Someone comments on your blog
  - Someone follows you
  - Someone bookmarks your blog
- **Email Notifications**: Backup email alerts for key activities
- View all notifications with timestamp
- Mark notifications as read
- Delete notifications
- Filter notifications by type
- Notification preferences in Settings

### ⚙️ **Settings & Preferences**
- **Profile Settings**: Update name, username, bio, website, location, email
- **Avatar Upload**: Real-time avatar update with navbar sync
- **Password Change**: Secure password update
- **Writing Preferences**: 
  - Allow/disable comments on blogs
  - Show/hide reading time
  - Auto-save drafts
- **Privacy Settings**:
  - Public/private profile visibility
  - Show/hide activity
- **Notification Preferences**:
  - Email notifications for followers, comments, likes
  - Daily digest option
  - Push notification settings
  - Mention-specific notifications

### 📊 **Dashboard & Admin**
- Admin dashboard with analytics
- User management (admin only)
- Blog moderation
- Statistics tracking

### 🔍 **Search & Discovery**
- Advanced blog search
- User search
- Trending topics
- Category browsing
- Search suggestions

### 🎨 **UI/UX Features**
- Dark/Light theme toggle
- Responsive design (mobile, tablet, desktop)
- Smooth animations and transitions
- Loading states and skeleton screens
- Error handling with user-friendly messages
- Toast notifications for user feedback

---

## 🆕 Latest Changes & Fixes

### **Phase 2: Real-Time Sync & Data Fixes**

#### 1. **Avatar Upload Real-Time Sync** ✅
**Previous Behavior:**
- Avatar uploaded but navbar didn't update
- Required page refresh to see new avatar
- Avatar not persisted across navigation

**Current Behavior:**
- Avatar updates immediately in navbar after upload
- Synced across all pages without refresh
- Avatar persists in UserContext and localStorage
- Displays actual image instead of initials

**Technical Changes:**
- Created `UserContext.jsx` for centralized user state management
- Updated `Settings.jsx` to call `updateAvatar()` after upload
- Modified `Navbar.jsx` to display real avatar image from context
- Added UserProvider wrapper in `App.js`

---

#### 2. **Real Follower/Following Data** ✅
**Previous Behavior:**
- Showing placeholder counts (fake data)
- Follower counts not updating on follow/unfollow

**Current Behavior:**
- Displays actual follower/following counts from database
- Counts update in real-time after follow/unfollow action
- Data syncs across all pages where counts are displayed
- Navbar shows real follower counts

**Technical Changes:**
- Added `GET /api/users/me/profile` endpoint for authenticated users
- UserContext fetches fresh user data on app load
- Follower/following arrays properly populated from database
- All profile displays use real data

---

#### 3. **Comment Delete Functionality** ✅
**Previous Behavior:**
- Comment had delete endpoint but no UI button

**Current Behavior:**
- Delete button (trash icon) visible for comment author
- Only comment author or admin can delete
- Confirmation dialog before deletion
- Notification sent to blog author on deletion
- Comments refresh immediately after deletion

**Technical Changes:**
- `Comments.jsx` has fully functional delete button with handler
- Proper authorization check on backend (`routes/comments.js`)
- Notification triggered on comment deletion
- UI matches like/unlike pattern for consistency

---

#### 4. **Notification Triggers Verification** ✅
**All User Activities Now Trigger Notifications:**
- ✓ **Like**: Notifies blog author
- ✓ **Comment**: Notifies blog author
- ✓ **Bookmark**: Notifies blog author
- ✓ **Follow**: Notifies followed user
- All include both in-app and email notifications

**Technical Implementation:**
- `routes/likes.js` → `notifyBlogLike()`
- `routes/comments.js` → `notifyBlogComment()`
- `routes/bookmarks.js` → `notifyBlogBookmark()`
- `routes/users.js` → `notifyUserFollow()`
- `services/notificationService.js` handles all triggers

---

#### 5. **Centralized User State Management** ✅
**New Addition:**
- `UserContext.jsx` - React Context for shared user state
- Eliminates localStorage-only state management
- Single source of truth for user data
- Real-time updates across components

**Features:**
- `useUser()` hook for accessing user data in components
- `updateAvatar()` - Sync avatar across app
- `updateUserProfile()` - Sync profile changes
- `updateFollowerCount()` - Sync follower/following data
- `refreshUserData()` - Fetch fresh data from backend

---

## 📊 Data Models

### User Model
```
- _id: ObjectId
- name: String
- email: String (unique)
- password: String (hashed)
- avatar: String (URL from Cloudinary)
- bio: String
- website: String
- location: String
- followers: Array of User IDs
- following: Array of User IDs
- isAdmin: Boolean
- createdAt: Date
```

### Blog Model
```
- _id: ObjectId
- title: String
- short_description: String
- blog_content: String (HTML)
- category: Array of Category IDs
- author: User ID
- images: Array of URLs
- likes: Number
- comments: Array of Comment IDs
- bookmarks: Number
- status: "draft" | "published"
- createdAt: Date
- updatedAt: Date
```

### Notification Model
```
- _id: ObjectId
- recipient: User ID
- sender: User ID
- type: "like" | "comment" | "bookmark" | "follow"
- blogId: Blog ID (optional)
- commentId: Comment ID (optional)
- message: String
- read: Boolean
- createdAt: Date
```

### Comment Model
```
- _id: ObjectId
- content: String
- author: User ID
- blog: Blog ID
- likes: Number
- createdAt: Date
- updatedAt: Date
```

---

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `POST /api/auth/verify-otp` - Verify email OTP

### Blogs
- `GET /api/blogs` - Get all published blogs (paginated)
- `POST /api/blogs` - Create new blog
- `GET /api/blogs/:id` - Get single blog
- `PUT /api/blogs/:id` - Update blog
- `DELETE /api/blogs/:id` - Delete blog
- `GET /api/blogs/:id/preview` - Preview blog

### Users
- `GET /api/users/me/profile` - Get authenticated user profile
- `GET /api/users/:userId` - Get public user profile
- `POST /api/users/:userId/follow` - Follow user
- `DELETE /api/users/:userId/follow` - Unfollow user
- `GET /api/users/:userId/followers` - Get user's followers
- `GET /api/users/:userId/following` - Get user's following list

### Likes
- `POST /api/likes/:blogId` - Like a blog
- `DELETE /api/likes/:blogId` - Unlike a blog
- `GET /api/likes/count/:blogId` - Get like count

### Comments
- `GET /api/comments/blog/:blogId` - Get blog comments
- `POST /api/comments` - Create comment
- `PATCH /api/comments/:commentId` - Edit comment
- `DELETE /api/comments/:commentId` - Delete comment

### Bookmarks
- `POST /api/bookmarks/:blogId` - Bookmark blog
- `DELETE /api/bookmarks/:blogId` - Remove bookmark
- `GET /api/bookmarks` - Get user's bookmarks

### Notifications
- `GET /api/notifications` - Get all notifications
- `GET /api/notifications/:type` - Get notifications by type
- `PUT /api/notifications/:id/read` - Mark as read
- `DELETE /api/notifications/:id` - Delete notification
- `DELETE /api/notifications` - Clear all notifications

### Settings
- `GET /api/settings` - Get all user settings
- `PUT /api/settings/profile` - Update profile
- `PUT /api/settings/password` - Change password
- `POST /api/settings/avatar` - Upload avatar
- `PUT /api/settings/writing` - Update writing preferences
- `PUT /api/settings/privacy` - Update privacy settings
- `PUT /api/settings/notifications` - Update notification preferences

---

## 🔄 Component Architecture

### Context
- `ThemeContext` - Dark/Light theme management
- `UserContext` - Centralized user state (NEW)

### Pages
- `Home` - Landing page with trending blogs
- `Blog` - Blog listing with pagination
- `UserProfile` - User profile with blogs
- `Settings` - User settings and preferences
- `Notifications` - User notifications management
- `Bookmarks` - Saved blogs
- `Drafts` - User's draft blogs
- `AdminDashboard` - Admin analytics
- `Followers/Following` - Follow relationships

### Components
- `Navbar` - Navigation with real avatar (UPDATED)
- `Comments` - Blog comments with delete (READY)
- `LikeBookmarkButtons` - Like and bookmark actions
- `BlogCard` - Blog preview card
- `Settings` - Preference management with avatar sync (UPDATED)
- `NotificationCenter` - Notifications display and management

---

## 🔧 Setup & Installation

### Prerequisites
- Node.js v14+
- MongoDB
- Cloudinary account
- Gmail account (for email notifications)

### Backend Setup
```bash
cd Zarrin_server
npm install

# Create .env file
MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
GMAIL_USER=your_gmail@gmail.com
GMAIL_PASS=your_app_password
PORT=8200
```

```bash
npm start
```

### Frontend Setup
```bash
cd zarrin_blogs
npm install

# Create .env file
REACT_APP_API_URL=http://localhost:8200/api
```

```bash
npm start
```

---

## 📱 Pages & Features Map

| Page | Features |
|------|----------|
| **Home** | Trending blogs, featured articles, quick links |
| **Blog** | Paginated blog listing, search, categories |
| **Blog Detail** | Full blog, comments, likes, bookmarks, author info, related blogs |
| **User Profile** | User info, follower count, blogs, follow button |
| **Settings** | Profile update, avatar upload, password change, preferences |
| **Notifications** | All notifications, filters, mark read, delete |
| **Bookmarks** | Saved blogs, remove bookmark |
| **Drafts** | User's draft blogs, publish/delete |
| **Admin Dashboard** | Analytics, user management, moderation |

---

## 🐛 Known Fixes & Improvements

✅ Avatar uploads now sync in real-time across all pages
✅ Navbar shows actual user avatar instead of initials
✅ Follower/following counts display real data
✅ Comment delete button available for authors
✅ All notifications trigger properly (like, comment, bookmark, follow)
✅ User state managed centrally with Context API
✅ Settings changes reflect immediately across app

---

## 🚀 Performance Optimizations

- Lazy loading for blog images
- Pagination for blog listings (10 per page)
- Caching user data in localStorage
- Debounced search queries
- Optimized database queries with indexes
- Image compression via Cloudinary

---

## 📝 License

All rights reserved © 2025 Zarrin Blogs

---

## 📞 Support

For issues or questions, please contact the development team.

**Last Updated**: January 16, 2026
**Version**: 2.0 (Real-Time Sync Update)
