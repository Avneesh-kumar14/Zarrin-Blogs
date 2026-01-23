# 🚀 Chat System - Quick Reference

## Start Servers

```bash
# Terminal 1: Backend
cd Zarrin_server && npm start

# Terminal 2: Frontend  
cd zarrin_blogs && npm start
```

## New Features

### Message Features
- **Edit**: Hover message → Click pencil icon
- **Delete**: Hover message → Click trash icon  
- **React**: Hover message → Click smiley → Pick emoji

### Image Upload
- Click **Image** button in input
- Select 1-10 images (< 5MB each)
- Preview grid shows
- Click **Send**

### Emoji Picker
- Click **Smiley** button
- Search, browse 9 categories
- Click emoji to add
- Recent emojis shown first

### Group Management
- Click **Settings** in group chat
- Edit name, avatar
- Add/remove members
- Delete group (owner only)

### Status Indicators
- Green dot = online
- No dot = offline
- "X is typing..." = active
- Pulsing animation = active presence

## API Endpoints

### Messages
```
PUT    /api/chat/messages/:messageId          # Edit
DELETE /api/chat/messages/:messageId          # Delete
POST   /api/chat/messages/:messageId/reaction # React
POST   /api/chat/conversations/:id/messages/upload # Images
```

### Groups
```
DELETE /api/chat/conversations/:id            # Delete group
PUT    /api/chat/conversations/:id/group-info # Edit info
```

## Socket.IO Events

### Send
```javascript
emit('sendMessage', { conversationId, content })
emit('editMessage', { conversationId, messageId, newContent })
emit('deleteMessage', { conversationId, messageId })
emit('addReaction', { conversationId, messageId, emoji })
emit('userTyping', { characterCount })
emit('userStoppedTyping', {})
```

### Receive
```javascript
on('newMessage', (data) => {})
on('messageEdited', (data) => {})
on('messageDeleted', (data) => {})
on('reactionAdded', (data) => {})
on('userIsTyping', (data) => {})
on('userOnline', (data) => {})
on('userOffline', (data) => {})
```

## Database Models

### Message
```javascript
{
  content, senderId, conversationId,
  editHistory, reactions, attachments,
  readBy, isDeleted, isPinned
}
```

### Conversation
```javascript
{
  participants, conversationType,
  conversationName, createdBy, groupAvatar,
  lastMessage, isArchived, isMuted, pinnedBy
}
```

## Frontend Components

| Component | Purpose |
|-----------|---------|
| `Chat.jsx` | Main container |
| `ChatWindow.jsx` | Message display area |
| `MessageInput.jsx` | Text & image input |
| `EmojiPicker.jsx` | Emoji selection |
| `ChatHeader.jsx` | Conversation header |
| `ConversationItem.jsx` | Sidebar item |
| `Message.jsx` | Individual message |

## Common Tasks

### Send Message with Image
```javascript
// UI: Click image button → Select file → Click Send
// Or: See MessageInput.jsx uploadFiles()
```

### Add Emoji Reaction
```javascript
// UI: Hover message → Click smiley → Pick emoji
// Backend: addReaction() in chatService
```

### Edit Group Name
```javascript
// UI: Click settings in group → Edit name → Save
// API: PUT /conversations/:id/group-info
```

### Check User Status
```javascript
// Check onlineUsers Set in ChatContext
// Green dot = in onlineUsers Set
// No dot = not in Set
```

## Debugging

### Check Logs
```bash
# Backend: Watch terminal for [CHAT], [Socket], [ChatService] logs
# Frontend: DevTools Console for Socket events
```

### Check Socket Connection
```javascript
// DevTools Console:
console.log(socketService.socket?.connected)
```

### Check Stored Token
```javascript
// DevTools Console:
localStorage.getItem('token')
```

## Performance Tips

- Images auto-optimize via Cloudinary
- Pagination on message history  
- Real-time updates < 100ms
- Memory efficient Socket.IO
- Debounced typing events

## Security

- ✅ JWT tokens required
- ✅ User ownership verified
- ✅ File type validated
- ✅ File size limited (5MB)
- ✅ Soft deletes (no data loss)

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Images not uploading | Check Cloudinary credentials |
| Emoji picker not showing | Click away and try again |
| Typing not showing | Refresh page, check Socket connection |
| Messages not sending | Verify Socket.IO is connected |
| Offline after disconnect | Wait 5 seconds for status update |

## Documentation

- **CHAT_SYSTEM_DOCUMENTATION.md** - Complete API docs
- **CHAT_TESTING_GUIDE.md** - Step-by-step testing
- **CHAT_TROUBLESHOOTING.md** - Common issues
- **FINAL_IMPLEMENTATION_REPORT.md** - Summary

## Environment Variables

```
# Backend
PORT=8200
MONGO_URI=your_mongodb_uri
JWT_SECRET=makeityourown
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_KEY=your_cloudinary_key
CLOUDINARY_SECRET=your_cloudinary_secret

# Frontend
REACT_APP_API_URL=http://localhost:8200
```

---

**Version**: 1.0.0  
**Last Updated**: December 2024  
**Status**: ✅ Production Ready
