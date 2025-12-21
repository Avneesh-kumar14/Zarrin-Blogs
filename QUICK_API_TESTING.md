# ⚡ Quick API Testing Guide - All 5 Features

## 🚀 Quick Start

```bash
# 1. Start backend
cd Zarrin_server
npm run dev

# 2. Start frontend
cd zarrin_blogs
npm start

# 3. Access Swagger UI
http://localhost:8200/api-docs
```

---

## 🧪 Test Each Feature in 2 Minutes

### **Feature 1: Email Notifications** 
```bash
# Prerequisite: Set RESEND_API_KEY in .env

# Test Follow Notification
POST http://localhost:8200/api/users/:followedUserId/follow
Headers: Authorization: Bearer YOUR_TOKEN

# Test Comment Notification
POST http://localhost:8200/api/comments/
Headers: Authorization: Bearer YOUR_TOKEN
Body: {
  "blogId": "blog_id_here",
  "content": "Great article!"
}

# Test Like Notification
POST http://localhost:8200/api/likes/:blogId
Headers: Authorization: Bearer YOUR_TOKEN
```

---

### **Feature 2: Advanced Search Filters**
```bash
# Basic search
GET http://localhost:8200/api/search?query=react

# With filters
GET http://localhost:8200/api/search?query=javascript&minViews=10&maxReadTime=15&sortBy=trending

# Pagination
GET http://localhost:8200/api/search?query=blog&page=1&limit=10

# Author filter
GET http://localhost:8200/api/search?author=USER_ID&sortBy=mostLiked
```

---

### **Feature 3: Reading Progress Tracking**
```bash
# Get current progress
GET http://localhost:8200/api/reading-progress/:blogId
Headers: Authorization: Bearer YOUR_TOKEN

# Save reading progress
POST http://localhost:8200/api/reading-progress/:blogId
Headers: Authorization: Bearer YOUR_TOKEN
Body: {
  "scrollPosition": 45,
  "timeSpent": 300,
  "isCompleted": false
}

# Get continue reading list
GET http://localhost:8200/api/reading-progress/continue/recent?limit=5
Headers: Authorization: Bearer YOUR_TOKEN

# Get reading stats
GET http://localhost:8200/api/reading-progress/stats
Headers: Authorization: Bearer YOUR_TOKEN
```

---

### **Feature 4: Admin Dashboard**
```bash
# Frontend access
http://localhost:3000/admin
(Login with admin account)

# API endpoints
GET http://localhost:8200/api/admin/dashboard
GET http://localhost:8200/api/admin/users?page=1&limit=10
GET http://localhost:8200/api/admin/blogs?page=1&status=published
DELETE http://localhost:8200/api/admin/users/:userId
GET http://localhost:8200/api/admin/analytics
```

---

### **Feature 5: Swagger Documentation**
```
Just go to:
http://localhost:8200/api-docs

Click "Authorize" button and paste your token:
Bearer YOUR_JWT_TOKEN_HERE

Then test any endpoint interactively!
```

---

## 📊 cURL Command Examples

### **Follow Notification Test**
```bash
curl -X POST http://localhost:8200/api/users/USER_ID_TO_FOLLOW/follow \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

### **Advanced Search**
```bash
curl "http://localhost:8200/api/search?query=react&minViews=50&sortBy=trending"
```

### **Save Reading Progress**
```bash
curl -X POST http://localhost:8200/api/reading-progress/BLOG_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "scrollPosition": 50,
    "timeSpent": 300,
    "isCompleted": false
  }'
```

### **Get Admin Dashboard**
```bash
curl http://localhost:8200/api/admin/dashboard \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### **Get Reading Stats**
```bash
curl http://localhost:8200/api/reading-progress/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## ✅ Verification Checklist

Run this in order to verify everything works:

```bash
# 1. Check all tests pass
cd Zarrin_server
npm test

# Output: ✅ 32 passed, 0 failed

# 2. Check server starts without errors
npm run dev
# Output: ✅ Backend API running on http://localhost:8200

# 3. Check Swagger loads
curl http://localhost:8200/api-docs
# Output: 200 OK with Swagger UI HTML

# 4. Test basic search
curl "http://localhost:8200/api/search?query=test"
# Output: {"success": true, "data": [...], "pagination": {...}}

# 5. Test reading progress (need auth token)
curl http://localhost:8200/api/reading-progress/BLOG_ID \
  -H "Authorization: Bearer TOKEN"
# Output: {"success": true, "data": {...}}
```

---

## 🔑 Get Your Auth Token

### **For Testing:**

```bash
# 1. Signup
curl -X POST http://localhost:8200/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPass123"
  }'

# 2. Copy token from response
# 3. Use in headers: Authorization: Bearer TOKEN_HERE
```

### **For Admin Testing:**

```bash
# Setup admin user
cd Zarrin_server
node create-admin.js

# Then login with admin credentials
curl -X POST http://localhost:8200/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "AdminPass123"
  }'
```

---

## 📚 Response Format Reference

### **Email Notifications** (No special response, just 201/200)
```json
{
  "message": "Blog liked",
  "count": 42
}
```

### **Advanced Search**
```json
{
  "success": true,
  "data": [{ blogs... }],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalResults": 100,
    "hasNextPage": true
  },
  "filters": { applied_filters... }
}
```

### **Reading Progress**
```json
{
  "success": true,
  "data": {
    "scrollPosition": 50,
    "timeSpent": 300,
    "isCompleted": false,
    "lastReadAt": "2025-12-19T10:30:00.000Z"
  }
}
```

### **Reading Stats**
```json
{
  "success": true,
  "data": {
    "totalBlogsRead": 42,
    "completedBlogs": 28,
    "inProgress": 14,
    "totalTimeSpent": 18000,
    "totalTimeSpentHours": 5.0,
    "averageTimePerBlog": 428.57,
    "completionRate": 66.7
  }
}
```

### **Admin Dashboard**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalUsers": 150,
      "totalBlogs": 342,
      "totalViews": 15000,
      "totalLikes": 2500
    },
    "topAuthors": [{ user objects... }],
    "topBlogs": [{ blog objects... }],
    "statusDistribution": { draft: 50, published: 280, scheduled: 12 }
  }
}
```

---

## 🎯 Interview Demo Script

**"Let me show you the 5 features I built:"**

1. **Admin Dashboard** (1 min)
   - Show at http://localhost:3000/admin
   - Click through tabs
   - Show stat cards and charts

2. **Swagger Docs** (1 min)
   - Go to http://localhost:8200/api-docs
   - Show 27+ endpoints
   - Show Bearer auth and example request

3. **Email Notifications** (1 min)
   - Show emailService.js file
   - Show integration in likes.js, comments.js, users.js
   - Explain error handling

4. **Advanced Search** (1 min)
   - Show search API with filters
   - Test: ?query=react&minViews=50&sortBy=trending
   - Show pagination response

5. **Reading Progress** (1 min)
   - Show readingProgress model
   - Show endpoints for save/get/stats
   - Explain use case (continue reading feature)

**Total time:** 5 minutes ⏱️

---

## 🚨 Troubleshooting

**Problem:** Email notifications not sending
- [ ] Check `RESEND_API_KEY` is set
- [ ] Check `RESEND_FROM_EMAIL` is set
- [ ] Check recipient email is valid
- [ ] Look at console for `Error sending email` logs

**Problem:** Advanced search returns empty
- [ ] Check query parameter format: `?query=keyword`
- [ ] Check MongoDB has blog data
- [ ] Try without filters first: `?query=test`

**Problem:** Reading progress not saving
- [ ] Check authorization token is valid
- [ ] Check blog ID exists
- [ ] Check scrollPosition is 0-100
- [ ] Check response for errors

**Problem:** Admin dashboard 403 error
- [ ] Check user has `role: 'admin'` in database
- [ ] Check token is valid
- [ ] Use node create-admin.js to create admin

**Problem:** Tests failing
- [ ] Run: `npm test`
- [ ] All 32 should pass
- [ ] If failing, check console for error messages

---

## 🎉 You're All Set!

All 5 features are ready to go. Use this guide to test and demo them! 

**Questions?** Check the full guide at `IMPLEMENTATION_COMPLETE_ALL_FEATURES.md`
