# Chat System Implementation Guide

## Overview
This is a complete real-time chat system built with Socket.IO, similar to Instagram/Facebook messaging. It supports:
- ✅ Direct 1-on-1 conversations
- ✅ Group chats with multiple participants
- ✅ Real-time message delivery
- ✅ Typing indicators
- ✅ Message reactions (emojis)
- ✅ Edit & Delete messages
- ✅ Read receipts
- ✅ Online/Offline status
- ✅ Message attachments
- ✅ Conversation management (mute, pin, archive)

---

## Backend Structure

### Models

#### 1. **Conversation** (`models/conversation.js`)
- Stores conversation metadata
- Participants list
- Group info (name, avatar, description)
- Last message cache
- Muted/Pinned/Archived tracking

#### 2. **Message** (`models/message.js`)
- Message content and type
- Sender information
- Read status by participants
- Edit history
- Emoji reactions
- Attachments (images, files)
- Message deletion tracking

#### 3. **ChatActivity** (`models/chatActivity.js`)
- Tracks user activity (typing, online, offline, calling)
- Auto-expires after 1 hour (TTL index)
- Used for real-time presence tracking

### Services

#### **chatService.js**
Core business logic including:
- `getOrCreateDirectConversation()` - Start 1-on-1 chat
- `createGroupConversation()` - Create group chat
- `getUserConversations()` - Fetch user's conversations
- `sendMessage()` - Send and save message
- `getConversationMessages()` - Fetch message history
- `markMessagesAsRead()` - Update read status
- `deleteMessage()` - Soft delete message
- `editMessage()` - Update message content
- `addReaction()` - Add emoji reaction
- `addGroupMember()` / `removeGroupMember()` - Group management
- `archiveConversation()` / `muteConversation()` / `pinConversation()`

### Real-Time Communication

#### **socketHandler.js**
Socket.IO event handlers for:
- **Connection Management**: User connect/disconnect, online status
- **Messaging**: Send, receive, edit, delete messages
- **Typing Indicators**: Real-time "user is typing" notifications
- **Read Status**: Message read receipts
- **Group Management**: Member join/leave notifications
- **Reactions**: Emoji reactions on messages
- **Call Events**: Voice/video call notifications

### API Routes

#### **routes/chat.js**
REST endpoints for:
```
GET    /api/chat/conversations                    - Get user's conversations
GET    /api/chat/conversations/:id                - Get single conversation
GET    /api/chat/conversations/:id/messages       - Get messages with pagination
GET    /api/chat/conversations/:id/unread         - Get unread count
POST   /api/chat/conversations/direct/:userId     - Create direct conversation
POST   /api/chat/conversations/group              - Create group conversation
POST   /api/chat/conversations/:id/members        - Add member to group
DELETE /api/chat/conversations/:id/members/:userId - Remove member from group
PUT    /api/chat/conversations/:id/mark-read      - Mark messages as read
PUT    /api/chat/messages/:id                     - Edit message
DELETE /api/chat/messages/:id                     - Delete message
POST   /api/chat/messages/:id/reaction            - Add emoji reaction
PUT    /api/chat/conversations/:id/archive        - Archive conversation
PUT    /api/chat/conversations/:id/mute           - Mute conversation
PUT    /api/chat/conversations/:id/pin            - Pin conversation
```

---

## Frontend Structure

### Context & State Management

#### **ChatContext.jsx**
Global state for chat using React Context:
- `conversations` - User's conversations list
- `selectedConversation` - Currently active conversation
- `messages` - Messages in active conversation
- `typingUsers` - Users currently typing
- `onlineUsers` - Currently online users
- `unreadCounts` - Unread messages per conversation

**Key Functions:**
- `fetchConversations()` - Load user's chats
- `fetchMessages()` - Load conversation history
- `selectConversation()` - Switch active chat
- `sendMessage()` - Send new message
- `deleteMessage()` - Delete message
- `editMessage()` - Edit message
- `addReaction()` - React with emoji
- `createDirectConversation()` - Start 1-on-1 chat
- `createGroupConversation()` - Start group chat

### Socket Service

#### **socketService.js**
Client-side Socket.IO wrapper with methods:
- `connect(token)` - Connect with JWT authentication
- `disconnect()` - Close connection
- `joinConversation(id)` - Join conversation room
- `leaveConversation(id)` - Leave conversation room
- `sendMessage()` - Emit message event
- `emitTyping()` - Send typing indicator
- `markAsRead()` - Emit read receipt
- `deleteMessage()` - Emit delete event
- `editMessage()` - Emit edit event
- `addReaction()` - Emit reaction event
- `on()` - Listen to events
- `off()` - Remove event listener

### Components

#### **Chat.jsx**
Main chat container - wraps sidebar and chat window

#### **ConversationList.jsx**
- Displays user's conversations
- Search functionality
- New conversation button
- Shows unread counts

#### **ConversationItem.jsx**
- Individual conversation in list
- Shows participant avatars
- Last message preview
- Online status indicator

#### **ChatWindow.jsx**
- Main chat display area
- Message list
- Typing indicators
- Message input

#### **MessageList.jsx**
- Renders all messages
- Handles message grouping
- Shows read status

#### **Message.jsx**
- Individual message bubble
- Actions menu (edit, delete)
- Emoji reactions display
- Emoji picker

#### **MessageInput.jsx**
- Textarea input with auto-resize
- Send button
- Attachment button
- Real-time typing indicator

#### **ChatHeader.jsx**
- Conversation title
- Participant info
- Call buttons
- Info button

#### **CreateConversationModal.jsx**
- Mode selector (direct/group)
- User search
- Group name input
- Create conversation

---

## Socket Events

### Emitted from Client to Server
```javascript
// Connection
'joinConversation'        - Join conversation room
'leaveConversation'       - Leave conversation room

// Messaging
'sendMessage'            - Send message
'userTyping'             - Emit typing indicator
'userStoppedTyping'      - Stop typing
'markAsRead'             - Mark messages as read
'deleteMessage'          - Delete message
'editMessage'            - Edit message
'addReaction'            - Add emoji reaction

// Group
'memberJoined'           - Notify member joined
'memberLeft'             - Notify member left

// Call
'initiateCall'           - Start call
'endCall'                - End call
```

### Received from Server to Client
```javascript
// Status
'userOnline'             - User came online
'userOffline'            - User went offline
'userJoinedConversation' - User joined conversation
'userLeftConversation'   - User left conversation

// Messages
'newMessage'             - New message arrived
'messagesRead'           - Messages marked as read
'messageDeleted'         - Message was deleted
'messageEdited'          - Message was edited
'reactionAdded'          - Reaction added to message

// Presence
'userIsTyping'           - User is typing
'userStoppedTyping'      - User stopped typing

// Call
'incomingCall'           - Incoming call
'callEnded'              - Call ended

// Error
'error'                  - Error occurred
```

---

## Integration Steps

### 1. Backend Setup
```bash
cd Zarrin_server
npm install socket.io socket.io-cors
node index.js
```

### 2. Frontend Setup
```bash
cd zarrin_blogs
npm install socket.io-client
npm start
```

### 3. Environment Variables
Backend `.env`:
```
SOCKET_PORT=8200
CORS_ORIGIN=http://localhost:3000
```

### 4. Access Chat
Navigate to `http://localhost:3000/chat` after logging in

---

## Database Indexes

The following indexes are created for performance:

**Conversations:**
- `participants`: Quick lookup of user's conversations
- `createdAt`: Sort by date
- `lastMessageTime`: Recently active conversations
- `conversationType`: Filter by type

**Messages:**
- `conversationId + createdAt`: Get messages in order
- `senderId`: Find messages by sender
- `isDeleted + conversationId`: Exclude deleted messages
- `isPinned + conversationId`: Find pinned messages

**ChatActivity:**
- `userId + conversationId + activityType`: Quick activity lookup
- TTL index on `timestamp`: Auto-cleanup

---

## Real-World Example Flow

### User sends a message:
1. User types in MessageInput
2. `emitTyping()` sent every keystroke
3. User presses Enter
4. `sendMessage()` emitted via Socket
5. Server validates, saves to DB
6. Server broadcasts to conversation room
7. All users in room receive `newMessage` event
8. Messages state updates in ChatContext
9. MessageList re-renders with new message

### User reacts to message:
1. User clicks emoji in Message
2. `addReaction(messageId, emoji)` called
3. Socket emits to server
4. Server finds message, updates reactions
5. Server broadcasts `reactionAdded` event
6. All users see reaction count update

---

## Security Features

- ✅ JWT authentication for Socket connections
- ✅ User authorization checks (can only access own conversations)
- ✅ Rate limiting on message endpoints
- ✅ Input validation with express-validator
- ✅ XSS protection on message content
- ✅ CORS protection for Socket connections
- ✅ Helmet security headers

---

## Performance Optimizations

- ✅ Pagination on messages (30 per page)
- ✅ MongoDB indexing for quick queries
- ✅ Socket.IO rooms for efficient broadcasting
- ✅ Activity TTL expiration (auto-cleanup)
- ✅ Lazy loading conversations
- ✅ Compressed message format
- ✅ Connection pooling

---

## Future Enhancements

1. **Voice/Video Calls** - Integrate WebRTC
2. **File Sharing** - Upload documents, videos
3. **Message Search** - Full-text search in conversations
4. **Read Receipts** - Show "seen at" timestamp
5. **Message Forwarding** - Forward to other conversations
6. **Conversation Backup** - Export chat history
7. **Message Encryption** - E2E encryption
8. **Bot Integration** - Chatbots in groups
9. **Voice Messages** - Send audio clips
10. **Story/Status** - Status messages like WhatsApp

---

## Troubleshooting

### Socket connection fails
- Check JWT token validity
- Verify CORS origins in index.js
- Check socket.io port availability

### Messages not appearing
- Verify user is in conversation participants
- Check MongoDB connection
- Review socket event names in console

### Typing indicator stuck
- Timeout automatically clears after 1 second
- Manual `userStoppedTyping` event fires on blur

### Read receipts not working
- Verify `markAsRead` is called
- Check user is in readBy array

---

## File Structure
```
Backend:
├── models/
│   ├── conversation.js
│   ├── message.js
│   └── chatActivity.js
├── routes/
│   └── chat.js
├── services/
│   ├── chatService.js
│   └── socketHandler.js
└── index.js (with Socket.IO setup)

Frontend:
├── src/
│   ├── context/
│   │   └── ChatContext.jsx
│   ├── utils/
│   │   └── socketService.js
│   ├── Component/Chat/
│   │   ├── Chat.jsx
│   │   ├── ConversationList.jsx
│   │   ├── ConversationItem.jsx
│   │   ├── ChatWindow.jsx
│   │   ├── MessageList.jsx
│   │   ├── Message.jsx
│   │   ├── MessageInput.jsx
│   │   ├── ChatHeader.jsx
│   │   ├── CreateConversationModal.jsx
│   │   └── (all .css files)
│   └── App.js (with chat route)
```

---

## Notes
- This is a production-ready implementation
- Follows senior developer patterns
- Comprehensive error handling
- Full real-time functionality
- Scalable architecture
