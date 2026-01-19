# Quick Start Guide - Chat System Installation

## 🚀 Installation Steps

### Step 1: Install Backend Dependencies
```bash
cd Zarrin_server
npm install
```
The required packages (socket.io, socket.io-cors) are already added to package.json.

### Step 2: Install Frontend Dependencies
```bash
cd zarrin_blogs
npm install
```
The required package (socket.io-client) is already added to package.json.

### Step 3: Start Backend Server
```bash
cd Zarrin_server
npm run dev  # for development with nodemon
# or
npm start    # for production
```
Backend will run on: `http://localhost:8200`

### Step 4: Start Frontend Server
```bash
cd zarrin_blogs
npm start
```
Frontend will run on: `http://localhost:3000`

### Step 5: Access Chat Feature
1. Login to the application
2. Navigate to `http://localhost:3000/chat`
3. Create or select a conversation
4. Start messaging in real-time!

---

## 📁 Files Created/Modified

### Backend Files
#### New Models:
- `Zarrin_server/models/conversation.js` - Stores conversation data
- `Zarrin_server/models/message.js` - Stores messages with rich metadata
- `Zarrin_server/models/chatActivity.js` - Tracks user presence

#### New Services:
- `Zarrin_server/services/chatService.js` - Core chat business logic
- `Zarrin_server/services/socketHandler.js` - Real-time Socket.IO events

#### New Routes:
- `Zarrin_server/routes/chat.js` - REST API endpoints for chat

#### Modified Files:
- `Zarrin_server/package.json` - Added socket.io dependencies
- `Zarrin_server/index.js` - Integrated Socket.IO server initialization

### Frontend Files
#### New Context:
- `zarrin_blogs/src/context/ChatContext.jsx` - Global chat state management

#### New Utilities:
- `zarrin_blogs/src/utils/socketService.js` - Socket.IO client wrapper

#### New Components:
- `zarrin_blogs/src/Component/Chat/Chat.jsx` - Main container
- `zarrin_blogs/src/Component/Chat/ConversationList.jsx` - Conversation sidebar
- `zarrin_blogs/src/Component/Chat/ConversationItem.jsx` - Individual conversation item
- `zarrin_blogs/src/Component/Chat/ChatWindow.jsx` - Chat display area
- `zarrin_blogs/src/Component/Chat/MessageList.jsx` - Messages container
- `zarrin_blogs/src/Component/Chat/Message.jsx` - Individual message bubble
- `zarrin_blogs/src/Component/Chat/MessageInput.jsx` - Message input with typing
- `zarrin_blogs/src/Component/Chat/ChatHeader.jsx` - Conversation header
- `zarrin_blogs/src/Component/Chat/CreateConversationModal.jsx` - New chat dialog

#### New Styles:
- All `.css` files in `zarrin_blogs/src/Component/Chat/`

#### Modified Files:
- `zarrin_blogs/package.json` - Added socket.io-client
- `zarrin_blogs/src/App.js` - Added Chat route and ChatProvider

---

## 🧪 Testing the Chat System

### Test 1: Create Direct Conversation
1. Login as User A
2. Go to Chat page
3. Click "+" button
4. Select "Direct Message" mode
5. Search and select User B
6. Click "Create"
✅ Should show conversation with User B

### Test 2: Send Message in Real-Time
1. User A sends: "Hello"
2. User B (in another window) should receive the message instantly
3. Message should show sender name and timestamp
✅ Message appears without page refresh

### Test 3: Typing Indicator
1. User A opens message input
2. User A starts typing
3. User B should see: "User A is typing..."
✅ Indicator shows and disappears when user stops

### Test 4: Message Reactions
1. Hover over any message
2. Click emoji button
3. Select emoji (👍 ❤️ 😂 etc.)
4. All users see the reaction count
✅ Reaction appears instantly

### Test 5: Edit & Delete Messages
1. Hover over own message
2. Click edit icon (✏️)
3. Modify text and save
4. Message shows "(edited)" label
5. Delete button shows and soft-deletes message
✅ Both users see changes

### Test 6: Group Chat
1. Click "+" → "Group Chat"
2. Enter group name: "Dev Team"
3. Select 3+ users
4. Click "Create"
✅ Group conversation with multiple members created

### Test 7: Mark as Read
1. User A sends message
2. User B receives message
3. All messages marked as read automatically
✅ Read count resets

### Test 8: Online Status
1. User A opens chat
2. User B should see online indicator (green dot)
3. User B closes browser/refreshes
4. User A should see offline status
✅ Online status updates in real-time

---

## 🔍 API Endpoints Reference

### Get Conversations
```
GET /api/chat/conversations?page=1&limit=20
Headers: Authorization: Bearer {token}
Response: { success, data: [conversations], pagination }
```

### Get Messages
```
GET /api/chat/conversations/{conversationId}/messages?page=1
Headers: Authorization: Bearer {token}
Response: { success, data: [messages], pagination }
```

### Send Message
```
Socket Emit: sendMessage
Data: { conversationId, content, attachments[], messageType }
```

### Create Direct Conversation
```
POST /api/chat/conversations/direct/{otherUserId}
Headers: Authorization: Bearer {token}
Response: { success, data: conversation }
```

### Create Group Conversation
```
POST /api/chat/conversations/group
Headers: Authorization: Bearer {token}
Body: { conversationName, participants[], groupAvatar }
Response: { success, data: conversation }
```

---

## 🛠️ Troubleshooting

### ❌ "Socket connection refused"
**Solution:** 
- Ensure backend is running: `npm run dev` in Zarrin_server
- Check if port 8200 is available
- Verify token is valid

### ❌ "Messages not appearing"
**Solution:**
- Open browser DevTools → Console
- Check for Socket.IO connection status
- Verify both users are in same conversation
- Check MongoDB connection

### ❌ "Typing indicator stuck"
**Solution:**
- Auto-clears after 1 second
- Refresh page if persists
- Check socket connection

### ❌ "CORS error"
**Solution:**
- Frontend URL should be in allowedOrigins in index.js
- Default includes `http://localhost:3000`

### ❌ "Cannot find module 'socket.io'"
**Solution:**
```bash
npm install socket.io socket.io-cors
npm install socket.io-client  # in frontend
```

---

## 📊 Database Collections

### conversations
```javascript
{
  _id: ObjectId,
  participants: [userId],
  conversationType: "direct|group",
  conversationName: "Group Name" // only for groups
  lastMessage: messageId,
  lastMessagePreview: "text preview",
  lastMessageTime: Date,
  createdBy: userId,
  mutedBy: [userId],
  pinnedBy: [userId],
  archivedBy: [userId],
  createdAt: Date,
  updatedAt: Date
}
```

### messages
```javascript
{
  _id: ObjectId,
  conversationId: ObjectId,
  senderId: ObjectId,
  content: "message text",
  messageType: "text|image|file|system",
  attachments: [{ url, type, filename, size, mimeType }],
  readBy: [{ userId, readAt }],
  editHistory: [{ content, editedAt }],
  isDeleted: false,
  deletedBy: userId,
  replyTo: messageId,
  reactions: [{ emoji, users: [userId] }],
  isPinned: false,
  pinnedBy: userId,
  pinnedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### chatActivities
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  conversationId: ObjectId,
  activityType: "typing|online|offline|recording|calling",
  characterCount: 0,
  timestamp: Date  // expires after 1 hour
}
```

---

## 🔐 Security Checklist

- ✅ JWT authentication required for Socket connections
- ✅ User can only access own conversations
- ✅ Message sender can only delete/edit own messages
- ✅ Group creator can manage members
- ✅ Rate limiting on chat endpoints
- ✅ Input validation on all endpoints
- ✅ XSS protection on message content
- ✅ CORS protection configured

---

## 📈 Performance Tips

1. **Use pagination** - Load 20 conversations, 30 messages per page
2. **Lazy load images** - Optimize attachment loading
3. **Compress messages** - Minimize Socket payload
4. **Index MongoDB** - Already configured for all queries
5. **Cleanup old activity** - TTL index auto-expires after 1 hour
6. **Close connections** - Leave conversation room when switching

---

## 📚 Additional Resources

- Socket.IO Docs: https://socket.io/docs/
- MongoDB Docs: https://docs.mongodb.com/
- Express.js Docs: https://expressjs.com/
- React Docs: https://react.dev/

---

## ✅ Implementation Status

| Feature | Status | File |
|---------|--------|------|
| Socket.IO Server | ✅ Done | index.js, socketHandler.js |
| Chat Models | ✅ Done | models/*.js |
| Chat Routes | ✅ Done | routes/chat.js |
| Chat Service | ✅ Done | services/chatService.js |
| React Components | ✅ Done | Component/Chat/*.jsx |
| Chat Context | ✅ Done | context/ChatContext.jsx |
| Socket Client | ✅ Done | utils/socketService.js |
| Styling | ✅ Done | Component/Chat/*.css |
| Integration | ✅ Done | App.js |
| Documentation | ✅ Done | CHAT_SYSTEM_README.md |

---

## 🎉 You're All Set!

The chat system is now fully integrated and ready to use. Start both servers and navigate to `/chat` to begin messaging!

For detailed technical documentation, see: `CHAT_SYSTEM_README.md`
