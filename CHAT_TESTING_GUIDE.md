# Chat System - Quick Start & Testing Guide

## Quick Start

### 1. Environment Setup

Make sure you have:
- Node.js v22.13.1+
- MongoDB Atlas URL
- Cloudinary credentials

### 2. Start Backend

```bash
cd Zarrin_server
npm install  # if first time
npm start
```

Expected output:
```
✅ MongoDB Connected
✅ All models loaded and registered
✅ Socket.IO initialized on namespace /chat
✅ Backend API running on http://localhost:8200
✅ Email service ready
```

### 3. Start Frontend

```bash
cd zarrin_blogs
npm install  # if first time
npm start
```

Opens automatically at http://localhost:3000

## Testing New Features

### Feature 1: Message Editing

1. Send a message (e.g., "Hello world")
2. Hover over the message
3. Click the **Edit** button (pencil icon)
4. Change the text (e.g., "Hello universe")
5. Click **Save**
6. Notice "(edited)" appears next to timestamp
7. Verify edit history is stored (check in DevTools Network tab)

**Expected behavior**:
- Message updates in real-time for all users
- Edit history records original content
- Toast notification shows on save

### Feature 2: Message Deletion

1. Send a test message
2. Hover over the message
3. Click the **Delete** button (trash icon)
4. Confirm in the popup
5. Message changes to "[Message deleted]"

**Expected behavior**:
- Message is soft-deleted (data preserved in DB)
- All users see the deleted message
- Deletions are broadcast via Socket.IO

### Feature 3: Emoji Picker

1. Focus on message input
2. Click the **Smile** icon (emoji button)
3. Emoji picker modal appears
4. Select an emoji (e.g., 👍)
5. Emoji appears in your message input
6. Send message with emoji

**Expected behavior**:
- Emoji picker shows all categories
- Search functionality filters emojis
- Recent emojis tracked and shown first
- Emoji picker closes after selection
- Emoji displays correctly in message

### Feature 4: Message Reactions

1. Hover over a message from another user
2. Click the **Smile** reaction button (left action)
3. Select emoji from quick picker
4. Reaction appears below message with count

**Expected behavior**:
- Reaction shows emoji + user count
- Clicking same emoji removes your reaction
- Real-time updates to reaction counts
- Multiple reactions per message supported

### Feature 5: Image Upload

1. Click the **Image** button (or paperclip)
2. Select 1-10 images (< 5MB each)
3. Preview grid shows selected images
4. Remove individual images with X button
5. Send images with "Send" button

**Expected behavior**:
- Preview grid shows thumbnails
- Remove button works per image
- Upload progress shows
- Images appear in chat after upload
- Images are displayed inline with messages

### Feature 6: Group Management

#### Create Group
1. Click "+" or "New" button
2. Select "Create Group"
3. Enter group name
4. Select 2+ members
5. Click "Create"

#### Edit Group
1. Open group chat
2. Click **Settings** button (gear icon)
3. Edit group name
4. Save changes

#### Add Member
1. Click **Settings**
2. Click "Add member"
3. Select user
4. Confirm

#### Remove Member
1. Click **Settings**
2. Find member in list
3. Click remove (X)
4. Confirm

**Expected behavior**:
- Group created with all selected members
- Members can see group in conversation list
- Only owner can delete group
- Add/remove updates for all members
- System message notifies when member joins/leaves

### Feature 7: Typing Indicators

1. Open chat in two browser windows/tabs
2. In window A: Focus on message input
3. Start typing in window A
4. In window B: See "User is typing..." in header
5. Stop typing for 1 second in window A
6. In window B: Typing indicator disappears

**Expected behavior**:
- Typing status shows in header
- Updates in real-time
- Auto-clears after 1 second of no input
- Works in group chats (shows all typists)
- Multiple people typing shows correct count

### Feature 8: Online/Offline Status

1. Open chat in two browser windows (Users A & B)
2. Direct chat between them
3. Both windows show green dot on avatar (online)
4. Close one browser tab
5. Other window shows no dot (offline) after ~5 seconds
6. Reopen browser
7. Green dot reappears

**Expected behavior**:
- Green pulsing dot shows online status
- Sidebar shows online indicators
- Header shows "X online" for groups
- Status updates immediately on connect/disconnect
- No false positives for page refresh

## Debugging

### Backend Logs

Watch the Node terminal for:
```
[CHAT] POST /conversations/direct/:userId - User: xxx
[CHAT] Image uploaded: xxx
[Socket] handleSendMessage - Conversation: xxx
[ChatService] deleteMessage: xxx
```

### Frontend Console

Check DevTools Console for:
- Socket.IO connection messages
- API call status
- Error warnings
- State updates

### Network Tab

Monitor API calls:
- POST messages should return 201
- PUT messages should return 200
- DELETE messages should return 200
- Image uploads should return 200 with attachments

## Common Issues & Fixes

### Issue: Images not uploading
**Solution**:
- Check Cloudinary credentials in .env
- Verify image < 5MB
- Check browser console for errors
- Ensure backend is receiving multipart data

### Issue: Emoji picker not appearing
**Solution**:
- Click away and try again
- Check z-index in DevTools (should be > 1000)
- Clear browser cache
- Refresh page

### Issue: Typing indicator not showing
**Solution**:
- Verify Socket.IO connection in console
- Check that userTyping event is emitted
- Verify users are in same conversation
- Check Socket.IO namespace (/chat)

### Issue: Message not sending
**Solution**:
- Verify Socket.IO is connected (green dot in console)
- Check user is authenticated (token in localStorage)
- Verify conversation ID is valid
- Check backend logs for errors

## Performance Testing

### Measure Message Send Time
```javascript
const start = Date.now();
sendMessage('test');
// Check console log in ChatContext when newMessage arrives
```

### Monitor Socket Events
Open DevTools Console and run:
```javascript
// Show all socket events
io.on('*', (event, ...args) => {
  console.log(`Socket event: ${event}`, args);
});
```

### Check Memory Usage
- Open DevTools > Performance
- Record for 30 seconds of active chat
- Check heap size doesn't grow indefinitely
- Verify no memory leaks with multiple send/delete cycles

## Load Testing

### Test with Many Messages
```javascript
// In browser console while in a chat:
for (let i = 0; i < 100; i++) {
  setTimeout(() => {
    fetch('http://localhost:8200/api/chat/conversations/[ID]/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: `Message ${i}`
      })
    });
  }, i * 100);
}
```

### Test with Many Reactions
- Add reactions rapidly
- Verify all updates are received
- Check no duplicate reactions

## Success Criteria

✅ All features working without errors  
✅ Real-time updates within 100ms  
✅ Images display properly  
✅ Emoji picker smooth and responsive  
✅ No console errors  
✅ Socket reconnection works  
✅ Multiple tabs sync properly  
✅ Mobile responsive (when testing on device)  

---

**Ready to test!** Start with Feature 1 and work through each feature systematically.
