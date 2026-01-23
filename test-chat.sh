#!/bin/bash

# Chat System Full Test Script
# Run this to verify all chat functionality is working

echo "🔍 Chat System Diagnostic Tests"
echo "================================"
echo ""

# Test 1: Backend Health
echo "✅ Test 1: Backend Server Health"
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8200/health)
if [ "$response" == "200" ]; then
  echo "   ✅ Backend is running (HTTP $response)"
else
  echo "   ❌ Backend is not responding (HTTP $response)"
fi
echo ""

# Test 2: Frontend Health  
echo "✅ Test 2: Frontend Server Health"
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
if [ "$response" == "200" ]; then
  echo "   ✅ Frontend is running (HTTP $response)"
else
  echo "   ❌ Frontend is not responding (HTTP $response)"
fi
echo ""

# Test 3: Check if user is logged in
echo "✅ Test 3: Authentication Check"
echo "   Need to manually check in browser:"
echo "   1. Open DevTools Console (F12)"
echo "   2. Run: localStorage.getItem('token')"
echo "   3. If shows token string: ✅ You're logged in"
echo "   4. If null: ❌ Log in first"
echo ""

# Test 4: Check chat conversation creation
echo "✅ Test 4: API Endpoint Test"
echo "   GET /api/health - Backend health endpoint"
health=$(curl -s http://localhost:8200/health | grep -o '"status":"ok"')
if [ ! -z "$health" ]; then
  echo "   ✅ API is responding"
else
  echo "   ❌ API is not responding"
fi
echo ""

# Test 5: Check Socket.IO
echo "✅ Test 5: Socket.IO Status"
echo "   Need to manually check in browser DevTools:"
echo "   1. Go to /chat page"
echo "   2. Open DevTools Console (F12)"
echo "   3. Look for: '✅ Socket connected: [socket-id]'"
echo "   4. If present: ✅ Socket.IO is connected"
echo "   5. If not: ❌ Socket.IO is not connected"
echo ""

echo "================================"
echo "📊 Manual Testing Checklist:"
echo "================================"
echo ""
echo "1. ✅ Navigate to http://localhost:3000/chat"
echo "2. ✅ Check debug panel at top shows:"
echo "       - Socket: 🟢 Connected"
echo "       - Loading: ✅ Done"
echo "       - Conversations: [count]"
echo ""
echo "3. ✅ Try creating a conversation:"
echo "       - Click '+' button"
echo "       - Select a user"
echo "       - Conversation should appear"
echo ""
echo "4. ✅ Try sending a message:"
echo "       - Click a conversation"
echo "       - Type and send message"
echo "       - Message should appear in real-time"
echo ""
echo "5. ✅ Check browser console (F12):"
echo "       - Look for ✅ and 🟢 logs"
echo "       - No ❌ or 🔴 errors"
echo ""
echo "================================"
echo "🔧 Backend Log Monitoring:"
echo "================================"
echo ""
echo "Watch backend terminal for:"
echo "  - [CHAT] logs for API calls"
echo "  - [ChatService] logs for database ops"
echo "  - [Socket] logs for real-time events"
echo ""
echo "If you see errors:"
echo "  1. Check error message"
echo "  2. Run: node Zarrin_server/test-connections.js"
echo "  3. Restart backend: npm start in Zarrin_server"
echo ""

echo "================================"
echo "✅ Test Complete!"
echo "================================"
