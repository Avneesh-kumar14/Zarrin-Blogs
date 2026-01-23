# Zarrin Chat System - Complete Documentation

## Overview

A professional Instagram/Facebook-style chat system with real-time messaging, group conversations, emoji support, image uploads, and more.

## Features Implemented

### ✅ Core Messaging
- **Text Messaging**: Send and receive messages in real-time via Socket.IO
- **Message Editing**: Edit messages with edit history tracking
- **Message Deletion**: Soft delete messages (content replaced with "[Message deleted]")
- **Message Reactions**: Add emoji reactions to messages with user counts
- **Image Uploads**: Upload up to 10 images per message (5MB max each)
- **Attachments**: Display images inline with messages

### ✅ Conversations
- **Direct Conversations**: One-on-one chats between users
- **Group Conversations**: Multiple participants with group settings
- **Conversation Management**: 
  - Create groups
  - Edit group name and avatar
  - Add/remove members
  - Delete groups (owner only)
  - Archive/mute conversations
  - Pin conversations

### ✅ Real-Time Features
- **Typing Indicators**: See who is typing in real-time
- **Online/Offline Status**: Visual indicators for user availability
- **Presence Tracking**: Active connection status for all participants
- **Read Receipts**: Track message read status
- **Activity Tracking**: User activity within conversations

### ✅ UI/UX Enhancements
- **Emoji Picker**: Full emoji picker with:
  - 9 categories (smileys, gestures, hearts, symbols, activities, nature, food, travel, etc.)
  - Search functionality
  - Recent emojis tracking
  - Smooth animations
  
- **Image Preview**: Before sending images:
  - Grid preview of selected images
  - Remove individual images
  - Clear all images
  - Upload progress indication
  
- **Status Indicators**:
  - Online status badges on avatars
  - Pulsing animation for online users
  - Typing status display in header
  - Member count for groups

## Architecture

### Backend Stack
- **Framework**: Express.js v5.1.0
- **Real-time**: Socket.IO v4.7.2
- **Database**: MongoDB with Mongoose v8.17.1
- **File Storage**: Cloudinary for image uploads
- **Authentication**: JWT with 7-day expiration

### Frontend Stack
- **Framework**: React 18.2.0
- **Routing**: React Router 7.7.1
- **Real-time**: Socket.IO Client
- **Icons**: Lucide React
- **State Management**: React Context + Socket.IO

## API Endpoints

### Messages
```
POST   /api/chat/conversations/:conversationId/messages
GET    /api/chat/conversations/:conversationId/messages
PUT    /api/chat/messages/:messageId          # Edit message
DELETE /api/chat/messages/:messageId          # Delete message
POST   /api/chat/messages/:messageId/reaction # Add reaction
POST   /api/chat/conversations/:conversationId/messages/upload # Upload images
```

### Conversations
```
GET    /api/chat/conversations               # List user conversations
POST   /api/chat/conversations/direct/:userId # Create direct chat
POST   /api/chat/conversations/group          # Create group
GET    /api/chat/conversations/:conversationId
PUT    /api/chat/conversations/:conversationId/group-info # Update group
DELETE /api/chat/conversations/:conversationId # Delete group
```

### Members
```
POST   /api/chat/conversations/:conversationId/members             # Add member
DELETE /api/chat/conversations/:conversationId/members/:userId     # Remove member
```

### Utilities
```
PUT    /api/chat/conversations/:conversationId/archive  # Archive conversation
PUT    /api/chat/conversations/:conversationId/mute     # Mute conversation
PUT    /api/chat/conversations/:conversationId/pin      # Pin conversation
PUT    /api/chat/messages/:messageId/read               # Mark as read
```

## Socket.IO Events

### Emitted from Client
```javascript
// Connection & Rooms
emit('joinConversation', { conversationId })
emit('leaveConversation', { conversationId })

// Messages
emit('sendMessage', { 
  conversationId, 
  content, 
  attachments 
})
emit('editMessage', { 
  conversationId, 
  messageId, 
  newContent 
})
emit('deleteMessage', { 
  conversationId, 
  messageId 
})

// Reactions
emit('addReaction', { 
  conversationId, 
  messageId, 
  emoji 
})

// Status
emit('userTyping', { 
  characterCount 
})
emit('userStoppedTyping', {})
emit('markAsRead', { 
  conversationId, 
  messageIds 
})

// Group Management
emit('memberJoined', { 
  conversationId, 
  newMemberId 
})
emit('memberLeft', { 
  conversationId 
})
```

### Received from Server
```javascript
// Messages
on('newMessage', (data) => {
  // { conversationId, messageId, message, timestamp }
})
on('messageEdited', (data) => {
  // { conversationId, messageId, content, editHistory, timestamp }
})
on('messageDeleted', (data) => {
  // { conversationId, messageId, timestamp }
})

// Reactions
on('reactionAdded', (data) => {
  // { conversationId, messageId, reactions, timestamp }
})

// Status
on('userOnline', (data) => {
  // { userId, username, timestamp }
})
on('userOffline', (data) => {
  // { userId, timestamp }
})
on('userIsTyping', (data) => {
  // { conversationId, userId, username }
})
on('userStoppedTyping', (data) => {
  // { conversationId, userId }
})

// Members
on('userJoinedConversation', (data) => {
  // { userId, username, conversationId, timestamp }
})
on('userLeftConversation', (data) => {
  // { userId, conversationId, timestamp }
})

// Receipts
on('messagesRead', (data) => {
  // { conversationId, userId, messageIds }
})

// Connection
on('connect', () => {})
on('disconnect', (reason) => {})
on('error', (error) => {})
```

## Database Models

### Message Schema
```javascript
{
  conversationId: ObjectId (ref: 'Conversation'),
  senderId: ObjectId (ref: 'User'),
  content: String,
  messageType: String (enum: ['text', 'system']),
  attachments: [{
    url: String,
    filename: String,
    type: String,
    size: Number,
    cloudinaryId: String
  }],
  readBy: [{
    userId: ObjectId (ref: 'User'),
    readAt: Date
  }],
  editHistory: [{
    content: String,
    editedAt: Date
  }],
  reactions: [{
    emoji: String,
    users: [ObjectId] (ref: 'User')
  }],
  isPinned: Boolean,
  isDeleted: Boolean,
  deletedBy: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

### Conversation Schema
```javascript
{
  participants: [ObjectId] (ref: 'User'),
  conversationType: String (enum: ['direct', 'group']),
  conversationName: String,
  createdBy: ObjectId (ref: 'User'),
  groupAvatar: String,
  lastMessage: ObjectId (ref: 'Message'),
  lastMessagePreview: String,
  lastMessageTime: Date,
  isArchived: Boolean,
  isMuted: Boolean,
  pinnedBy: [ObjectId],
  isDeleted: Boolean,
  deletedBy: ObjectId,
  deletedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### ChatActivity Schema
```javascript
{
  userId: ObjectId (ref: 'User'),
  conversationId: ObjectId (ref: 'Conversation'),
  activityType: String (enum: ['typing', 'online', 'offline']),
  timestamp: Date
}
```

## Frontend Components

### Chat Container Components
- **Chat.jsx** - Main chat component with conversation loading
- **ChatWindow.jsx** - Message display area with typing indicators
- **ChatDebug.jsx** - Debug panel for connection status

### Sidebar Components
- **ConversationList.jsx** - List of all conversations
- **ConversationItem.jsx** - Individual conversation with online status
- **CreateConversationModal.jsx** - Create new chat modal

### Message Components
- **MessageList.jsx** - Scrollable message list
- **Message.jsx** - Individual message with actions
- **MessageInput.jsx** - Text input with emoji & image support

### Header Components
- **ChatHeader.jsx** - Conversation header with status & actions

### UI Components
- **EmojiPicker.jsx** - Full-featured emoji picker

## Setup & Installation

### Prerequisites
- Node.js v22.13.1+
- MongoDB Atlas account
- Cloudinary account
- Environment variables configured

### Backend Setup
```bash
cd Zarrin_server
npm install
npm start
```

### Frontend Setup
```bash
cd zarrin_blogs
npm install
npm start
```

## Environment Variables

### Backend (.env)
```
PORT=8200
MONGO_URI=your_mongodb_uri
JWT_SECRET=makeityourown
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_KEY=your_cloudinary_key
CLOUDINARY_SECRET=your_cloudinary_secret
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:8200
```

## Error Handling & Validation

### Backend Validation
- Input validation with express-validator
- Authorization checks on all endpoints
- Error logging with comprehensive messages
- Try-catch blocks on all async operations

### Frontend Error Handling
- Socket.IO connection error recovery
- Network error notifications
- Input validation before submission
- Loading states during operations

## Security Features

### Authentication
- JWT token validation on Socket.IO handshake
- Bearer token required for all API endpoints
- 7-day token expiration

### Authorization
- User ownership verification for message edit/delete
- Group owner validation for deletion
- Member verification for group operations
- Activity tracking for audit logs

### Data Protection
- Soft deletes (data never actually deleted)
- Cloudinary integration for secure file storage
- CORS protection
- Rate limiting on write operations
- Parameter pollution prevention

## Performance Optimizations

### Frontend
- React Context for efficient state management
- Memoized components to prevent unnecessary renders
- Lazy image loading for attachments
- Textarea auto-resizing to prevent layout shift
- Socket.IO event debouncing for typing indicators

### Backend
- Indexed database queries
- Pagination for conversation/message lists
- Batch operations where possible
- Connection pooling
- Cloudinary CDN for image delivery

## Testing Checklist

### Message Features
- [ ] Send text message
- [ ] Edit message (verify edit history)
- [ ] Delete message (verify soft delete)
- [ ] Add emoji reaction (verify user count)
- [ ] Remove emoji reaction (verify removal)
- [ ] Upload single image
- [ ] Upload multiple images (2-10)
- [ ] Image preview before upload
- [ ] Remove image from preview
- [ ] Clear all previews

### Conversation Features
- [ ] Create direct conversation
- [ ] Create group conversation
- [ ] Edit group name
- [ ] Update group avatar
- [ ] Add member to group
- [ ] Remove member from group
- [ ] Delete group (owner only)
- [ ] Archive conversation
- [ ] Unarchive conversation
- [ ] Mute conversation
- [ ] Unmute conversation
- [ ] Pin conversation
- [ ] Unpin conversation

### Real-Time Features
- [ ] See typing indicator
- [ ] Typing indicator disappears after 1 second of no typing
- [ ] Online status shows green dot
- [ ] Offline status removes dot
- [ ] See online count in header
- [ ] Read receipts update in real-time
- [ ] Member join notification
- [ ] Member leave notification

### UI/UX Features
- [ ] Emoji picker opens and closes
- [ ] Emoji search works
- [ ] Emoji categories switch
- [ ] Recent emojis persist
- [ ] Image preview grid displays
- [ ] Remove image button works
- [ ] Upload progress shows
- [ ] Message actions appear on hover
- [ ] Edit mode shows save/cancel buttons
- [ ] Delete confirmation appears

### Error Handling
- [ ] Network disconnection recovery
- [ ] Invalid message gracefully fails
- [ ] File upload error messaging
- [ ] Authorization error handling
- [ ] Socket reconnection attempts

## Known Limitations

1. Read receipts show only "read at" timestamp, not per-user
2. Image compression not yet implemented
3. Voice/video call not yet integrated
4. Message search not yet implemented
5. Conversation search in sidebar basic

## Future Enhancements

1. Message search with full-text indexing
2. Voice/video call integration with WebRTC
3. Message forwarding
4. Message pinning UI
5. Conversation backup/export
6. End-to-end encryption
7. Message reactions animations
8. Stickers and GIFs support
9. Auto-delete messages
10. Read-only conversations

## Troubleshooting

### Backend Connection Issues
- Check MongoDB connection string
- Verify Cloudinary credentials
- Check JWT_SECRET is set
- Ensure port 8200 is not in use

### Frontend Connection Issues
- Verify REACT_APP_API_URL is correct
- Check browser console for Socket.IO errors
- Ensure backend is running
- Clear browser cache

### Message Not Sending
- Verify user is authenticated
- Check conversation ID is valid
- Check file size (< 5MB for images)
- Verify Socket.IO connection is active

## Contributing

When adding new features:
1. Add Socket.IO event listeners/emitters
2. Add model fields to database schema
3. Add validation on both frontend and backend
4. Add error handling and logging
5. Update this documentation
6. Test thoroughly before committing

---

**Last Updated**: 2024
**Version**: 1.0.0
**Status**: Production Ready
