# Chat System - Quick Reference

## 🚀 Quick Start
1. Both servers running ✅
2. Go to http://localhost:3000/chat
3. Look for debug panel at top
4. Check console (F12) for logs

## 📊 Debug Panel Guide

| Status | Meaning | Action |
|--------|---------|--------|
| 🟢 Socket Connected | WebSocket ready | ✅ Good to go |
| 🔴 Socket Disconnected | WebSocket lost | Check network |
| ✅ Loading Done | Data loaded | Conversations show |
| ⏳ Loading | Fetching data | Wait a moment |
| ❌ Error | Something failed | Check error message |

## 🔍 Console Logs to Look For

### ✅ Success Sequence
```
✅ Socket connected: [socket-id]
Fetching conversations from: http://localhost:8200/api/chat/conversations?page=1
Conversations response status: 200
Conversations fetched successfully: [...]
```

### ❌ Common Issues
```
❌ Socket connection failed: No token provided
  → Solution: Make sure you're logged in

❌ Socket connection error: Invalid token
  → Solution: Log out and back in

Conversations response status: 401
  → Solution: Check authentication

Conversations response status: 500
  → Solution: Check backend logs for errors
```

## 🛠️ Backend Logs to Check

Look for lines starting with `[CHAT]`:
```
[CHAT] GET /conversations - User: [id], Page: 1, Limit: 20
[CHAT] Conversations found: 5, Total: 5
```

These show that API request was received and data was returned.

## 📱 API Endpoints

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| GET | `/api/chat/conversations` | Required | ✅ Working |
| GET | `/api/chat/conversations/:id/messages` | Required | ✅ Working |
| POST | `/api/chat/conversations` | Required | ✅ Working |
| POST | `/api/chat/messages` | Required | ✅ Working |
| PUT | `/api/chat/conversations/:id` | Required | ✅ Working |
| DELETE | `/api/chat/messages/:id` | Required | ✅ Working |

## 🔧 Quick Commands

### Check if logged in (in console)
```javascript
localStorage.getItem('token') // Should show token string
```

### Force refresh conversations
```javascript
// If you have access to context, use:
// This won't work directly, navigate to chat instead
```

### Check Socket connection (in console)
```javascript
// Not directly accessible, check debug panel instead
```

### View API response (in console)
Check "Network" tab in DevTools, look for /api/chat/conversations request

## 🎯 Troubleshooting by Symptom

### "Conversations list is empty"
1. Check debug panel: all green?
2. Check console: any errors?
3. Are there conversations in DB?
4. Create a new conversation to test

### "Failed to fetch conversations"
1. Check response status in console
2. If 401: log out and back in
3. If 500: check backend logs for [CHAT] errors
4. If network error: check if backend is running

### "Socket stays disconnected"
1. Refresh page (may reconnect automatically)
2. Check if you're logged in
3. Check backend is running on port 8200
4. Might be network/firewall issue

### "Nothing shows but no error"
1. Conversations may be loading
2. Check "Loading: ⏳" in debug panel
3. Wait a few seconds
4. Check browser Network tab for pending requests

## 📊 Performance Tips

- First load takes ~1-3 seconds (Socket init + fetch)
- Subsequent loads are instant (cached)
- Refresh page if stuck on loading
- Close other tabs if slow (save resources)

## 🔐 Security Info

- All API calls require Bearer token
- JWT secret: must be 'makeityourown' (checked ✅)
- Token expires in 7 days
- Socket disconnects on logout

## 📝 Key Files

| File | Purpose | Location |
|------|---------|----------|
| Chat.jsx | Main component | zarrin_blogs/src/Component/Chat/ |
| ChatContext.jsx | State & API | zarrin_blogs/src/context/ |
| socketService.js | WebSocket wrapper | zarrin_blogs/src/utils/ |
| chat.js | Backend routes | Zarrin_server/routes/ |
| chatService.js | Backend logic | Zarrin_server/services/ |

## 🆘 When to Check What

| Problem | Check First | Then Check |
|---------|-------------|-----------|
| Conversations won't load | Console logs | Backend [CHAT] logs |
| Socket won't connect | Debug panel | Network tab |
| API returns error | Response status | Backend error logs |
| Nothing displays | Browser cache | localStorage token |
| Seems slow | Network tab | Backend performance |

## 📞 Information to Provide When Reporting

1. Screenshot of debug panel
2. Full console log output (right-click → save as)
3. Backend terminal log (copy-paste)
4. Response status code from console
5. Steps to reproduce the issue

## ✅ Daily Checklist

- [ ] Both servers running
- [ ] Can log in
- [ ] Debug panel shows all green
- [ ] Conversations load in <3 seconds
- [ ] Can select a conversation
- [ ] No errors in console

## 🚨 Emergency Fixes

### If chat crashes
```bash
# Restart backend
cd Zarrin_server
npm start

# Or restart frontend in separate terminal
cd zarrin_blogs
npm start
```

### If socket won't connect
1. Refresh page (Ctrl+R)
2. Clear browser cache (Ctrl+Shift+Delete)
3. Restart backend
4. Log out and back in

### If conversations won't show
1. Create a new conversation
2. Check database has conversations
3. Try different user account
4. Restart both servers

## 📈 Expected Behavior

✅ **On Page Load:**
- Debug panel appears
- Socket connects (🟢)
- Starts loading (⏳)
- Conversations appear in <3 seconds
- Loading done (✅)
- Can select and view conversations

✅ **Real-time Features:**
- New messages appear instantly
- Typing indicator appears
- User online/offline status updates
- Message reactions update in real-time

## 🎓 Learning Resources

See these files for detailed info:
- `CHAT_TROUBLESHOOTING.md` - Detailed diagnostics
- `CHAT_IMPROVEMENTS_SUMMARY.md` - Technical details
- Backend logs - Real-time debugging

---

**Last Updated**: Latest improvements applied
**Status**: ✅ All systems operational
**Next**: Monitor for any issues and report with debug info
