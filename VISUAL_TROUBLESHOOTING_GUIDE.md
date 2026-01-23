# VISUAL TROUBLESHOOTING GUIDE

## ✅ System is Working - What to Look For

### In Browser Console (F12 → Console tab):

**Healthy Signs:**
```
🔌 Attempting to connect to Socket.IO...
   URL: http://localhost:8200
   Namespace: /chat
   Token: eyJ...

✅ Socket connected: socket-abc123def
🟢 Socket connected in ChatProvider
Fetching conversations from: http://localhost:8200/api/chat/conversations?page=1
Conversations fetched successfully: {data: Array(2), pagination: {...}}
```

**Display:**
- Conversations appear in left sidebar
- No red errors in console
- Page responsive and interactive

---

## ❌ System Has Issues - Diagnosis

### Issue #1: "Socket connection error"

```
❌ Socket connection error: TransportError: websocket error
Error message: websocket error
```

**Causes & Fixes:**
```
1. Backend not running?
   → Start: npm start in Zarrin_server folder
   
2. Wrong localhost port?
   → Check .env: REACT_APP_API_URL=http://localhost:8200
   
3. CORS issue?
   → Backend logs will show CORS error
   → Check allowedOrigins includes http://localhost:3000
   
4. Token missing?
   → Must login first
   → Check: localStorage.getItem('token') returns value
```

**Verification:**
```bash
# Check if backend listening
netstat -ano | findstr ":8200"
# Should show: listening

# Check backend health
curl http://localhost:8200/health
# Should return: {"status":"ok","timestamp":"..."}
```

---

### Issue #2: "Failed to load resource: 500 (Internal Server Error)"

```
GET http://localhost:8200/api/chat/conversations?page=1  500
ChatContext.jsx:112 Error fetching conversations
```

**Causes & Fixes:**
```
1. User schema not registered?
   → FIXED: models now loaded before routes
   → Check backend restarted after fixes
   
2. User ID invalid?
   → Check token contains valid user ID
   → Check user exists in MongoDB
   
3. MongoDB not connected?
   → Check backend logs: "MongoDB Connected"
   → Verify MONGO_URI in .env is correct
```

**Verification:**
```javascript
// In browser console
localStorage.getItem('token')
// Should return a long string starting with 'eyJ'

// Decode it to see user ID
localStorage.getItem('user')
// Check _id field is present
```

---

### Issue #3: "WebSocket connection to 'ws://localhost:8200/socket.io' failed: 404"

```
websocket.js:116 WebSocket connection to 'ws://localhost:8200/socket.io' failed:
   WebSocket is closed before the connection is established
```

**Causes & Fixes:**
```
1. Socket.IO path mismatch?
   → Backend: path: '/socket.io'
   → Frontend: path: '/socket.io'
   → Both must match (FIXED in latest update)
   
2. Backend crashed?
   → Check: npm start output has errors?
   → Look for: "MongoDB Connected" message
   → Look for: "Socket.IO initialized" message
   
3. CORS blocking WebSocket?
   → Check backend logs
   → allowedOrigins must include http://localhost:3000
```

**Verification:**
```bash
# Check Socket.IO is listening
netstat -ano | findstr "8200"
# Should show multiple connections (WebSocket protocol)

# Check browser Network tab (F12)
# Look for "socket.io" entries
# Should see: 101 Switching Protocols (successful upgrade to WebSocket)
```

---

## 🎯 Step-by-Step Testing

### Step 1: Verify Backend Started
```
Check Terminal where you ran "npm start" in Zarrin_server:

Looking for:
✅ MongoDB Connected: ac-yzyiosg...
✅ Socket.IO initialized on namespace /chat
✅ Backend API running http://localhost:8200

If not present:
→ Backend crashed
→ Check errors in terminal
→ Run: npm start again
```

### Step 2: Verify Frontend Started
```
Check Terminal where you ran "npm start" in zarrin_blogs:

Looking for:
Compiled successfully!
Local: http://localhost:3000

If not present:
→ Frontend still compiling
→ Wait 1-2 minutes
→ Or check for error messages
```

### Step 3: Open Chat Page
```
1. Go to: http://localhost:3000/chat
2. Wait 2 seconds for Socket.IO to connect
3. Open DevTools (F12)
4. Go to Console tab
5. Look for green checkmarks (✅) and 🟢 symbols
```

### Step 4: Check Backend Logs
```
Look at terminal running backend (npm start in Zarrin_server):

Healthy:
[CHAT] GET /conversations - User: 696e6f75e66...
[ChatService] Found 2 conversations

Unhealthy:
[ERROR]: Error in getUserConversations: Schema hasn't been registered
[ERROR]: Connection refused
[ERROR]: MongoDB connection failed
```

### Step 5: Create Test Conversation
```
1. On chat page, click "+" button
2. Select "Direct Message"
3. Search for and select another user
4. Click "Create"

Expected in console:
Fetching conversations...
Conversations fetched successfully

Unexpected:
Error fetching conversations
Socket disconnected
Connection refused
```

---

## 🔍 Detailed Debugging

### Enable Maximum Logging

**Backend:**
```javascript
// In index.js or routes/chat.js
logger.info(`[CHAT] Detailed info:`, {
  userId: req.user?.id,
  timestamp: new Date(),
  method: req.method,
  path: req.path
});
```

**Frontend:**
```javascript
// In socketService.js or ChatContext.jsx
console.log('🟡 [DEBUG]:', {
  socketConnected,
  token: token?.substring(0, 10),
  timestamp: new Date(),
  action: 'Creating conversation'
});
```

---

### Check MongoDB Data

```bash
# Connect to MongoDB
mongo "mongodb+srv://username:password@cluster.mongodb.net/zarrin_blogs?retryWrites=true&w=majority"

# List databases
show databases

# Use zarrin_blogs database
use zarrin_blogs

# Check conversations
db.conversations.find().pretty()

# Check messages
db.messages.find().pretty()

# Check users
db.users.find({}, { password: 0 }).pretty()
```

---

## 📊 Real-Time Monitoring

### Open 3 Windows

**Window 1: Backend Logs**
```
Terminal running: npm start (in Zarrin_server)
Shows: API requests, Socket.IO events, Database queries
```

**Window 2: Frontend Console**
```
Browser DevTools (F12) → Console tab
Shows: Socket status, API calls, JavaScript errors
```

**Window 3: Chat Application**
```
Browser tab: http://localhost:3000/chat
Interact with: Create conversations, send messages
```

---

## 🚨 Emergency Restart

If everything is stuck:

```powershell
# Stop all Node processes
Get-Process node | Stop-Process -Force
Start-Sleep -Seconds 3

# Verify all stopped
Get-Process node
# Should show: Nothing

# Start backend fresh
cd "c:\Users\Rajne\OneDrive\Desktop\project-1 - Copy\Zarrin_server"
npm start
# Wait for: ✅ Backend API running

# In new terminal, start frontend
cd "c:\Users\Rajne\OneDrive\Desktop\project-1 - Copy\zarrin_blogs"
npm start
# Wait for: Compiled successfully

# In browser
http://localhost:3000/chat
# Should see debug panel with 🟢 Connected
```

---

## ✅ Final Checklist

- [ ] Backend running (port 8200)
- [ ] Frontend running (port 3000)
- [ ] No red errors in browser console
- [ ] Socket shows 🟢 Connected (not 🔴 Disconnected)
- [ ] /chat page loads without errors
- [ ] Can create a new conversation
- [ ] Can send a message
- [ ] Message appears immediately
- [ ] Backend logs show activity

**If all checked:** ✅ System is working properly

---

## Support Commands

```bash
# Health check
curl http://localhost:8200/health

# Check running processes
Get-Process node | Select-Object ProcessName, Id, Memory

# Check port listeners
netstat -ano | findstr "8200\|3000"

# View backend logs (last 50 lines)
Get-Content "logs/*.log" -Tail 50

# Clear all Node processes
taskkill /F /IM node.exe
```

---

**Last Updated:** 2026-01-23 | **Status:** ✅ All Systems Operational
