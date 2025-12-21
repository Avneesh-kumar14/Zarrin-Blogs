# 📚 Swagger API Documentation - Quick Guide

## ✅ What's Ready

Your API is now fully documented with **Swagger/OpenAPI 3.0**

---

## 🚀 Access Swagger UI

### **Local Development:**
```
http://localhost:8200/api-docs
```

### **Production:**
```
https://api.zarrin-blogs.com/api-docs
```

---

## 📋 Documented Endpoints

### **Authentication (7 endpoints)**
- ✅ `POST /api/auth/signup` - Register user
- ✅ `POST /api/auth/login` - Login user
- ✅ `POST /api/auth/send-otp` - Send OTP
- ✅ `POST /api/auth/verify-email` - Verify email
- ✅ `POST /api/auth/forgot-password` - Reset password request
- ✅ `POST /api/auth/reset-password/{token}` - Reset password

### **Blog Management (10+ endpoints)**
- ✅ `GET /api/blog` - Get all blogs (paginated)
- ✅ `POST /api/blog` - Create blog
- ✅ `GET /api/blog/{id}` - Get single blog
- ✅ `PUT /api/blog/{id}` - Update blog
- ✅ `DELETE /api/blog/{id}` - Delete blog
- ✅ `POST /api/blog/{id}/like` - Like blog

### **Search & Discovery (5+ endpoints)**
- ✅ `GET /api/search` - Search blogs with filters
- ✅ `GET /api/trending` - Get trending blogs
- ✅ `GET /api/related/{id}` - Get related blogs

### **Comments (4+ endpoints)**
- ✅ `GET /api/comments/blog/{blogId}` - Get comments
- ✅ `POST /api/comments/blog/{blogId}` - Add comment
- ✅ `DELETE /api/comments/{commentId}` - Delete comment

### **Likes (3 endpoints)**
- ✅ `GET /api/likes/count/{blogId}` - Get like count
- ✅ `POST /api/likes/{blogId}` - Like blog
- ✅ `DELETE /api/likes/{blogId}` - Unlike blog

### **Admin (6+ endpoints)**
- ✅ `GET /api/admin/dashboard` - Dashboard stats
- ✅ `GET /api/admin/users` - Get all users
- ✅ `DELETE /api/admin/users/{userId}` - Delete user
- ✅ `GET /api/admin/blogs` - Get all blogs
- ✅ `GET /api/admin/analytics` - Analytics data

---

## 🔐 Authentication in Swagger

### **How to Use Bearer Token:**

1. Go to `http://localhost:8200/api-docs`
2. Click **"Authorize"** button (top right)
3. Paste your JWT token: `Bearer YOUR_TOKEN_HERE`
4. Click **"Authorize"**
5. All endpoints now include your token automatically

### **Get Test Token:**
```bash
# 1. Signup
POST http://localhost:8200/api/auth/signup
{
  "name": "Test Admin",
  "email": "admin@test.com",
  "password": "AdminPass123"
}

# 2. Copy the token from response
# 3. Use in Swagger "Authorize" field
```

---

## 📊 What Each Section Shows

### **Parameters**
```json
- in: "path/query" - Where parameter is located
- required: true - Must be provided
- schema: { type: "string" } - Data type
- description: "..." - Explanation
```

### **Request Body**
```json
{
  "required": ["field1", "field2"],
  "properties": {
    "field1": { "type": "string" }
  }
}
```

### **Responses**
```json
- 200: Success
- 201: Created
- 400: Bad request
- 401: Unauthorized
- 404: Not found
- 403: Forbidden
- 500: Server error
```

---

## 🎯 Interview Tips

**You can say:**
- ✅ "All my API endpoints are documented with Swagger"
- ✅ "My API is production-ready with OpenAPI 3.0 specification"
- ✅ "Developers can interactively test all endpoints in the UI"
- ✅ "I included authentication, pagination, and error handling docs"
- ✅ "Every endpoint has example request/response formats"

---

## 🔧 Code Examples

### **Python (requests library)**
```python
import requests

headers = {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
}

# Get all blogs
response = requests.get('http://localhost:8200/api/blog', headers=headers)
blogs = response.json()

# Create blog
data = {
    "title": "My Blog",
    "blog_content": "Content here...",
    "category": ["123"]
}
response = requests.post('http://localhost:8200/api/blog', json=data, headers=headers)
```

### **JavaScript (fetch)**
```javascript
const token = localStorage.getItem('token');

// Get all blogs
fetch('http://localhost:8200/api/blog', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(res => res.json())
.then(blogs => console.log(blogs));

// Create blog
fetch('http://localhost:8200/api/blog', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'My Blog',
    blog_content: 'Content...',
    category: ['123']
  })
})
```

### **cURL**
```bash
# Get blogs
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:8200/api/blog

# Create blog
curl -X POST http://localhost:8200/api/blog \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"title":"My Blog","blog_content":"...","category":["123"]}'
```

---

## 📱 Mobile App Integration

**API is ready for:**
- ✅ React Native apps
- ✅ Flutter apps
- ✅ Native iOS/Android
- ✅ Web clients

All endpoints return **JSON** with consistent format:
```json
{
  "success": true/false,
  "data": { ... },
  "error": "error message",
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 100
  }
}
```

---

## 🚀 Deployment

### **Environment Variables:**
```
RENDER_URL=https://zarrin-blogs.render.com
SWAGGER_URL=https://zarrin-blogs.render.com/api-docs
```

### **Vercel Backend:**
If deploying API to Vercel:
```
PORT=3001
BASE_URL=https://api.vercel.app
```

---

## ✨ Benefits

- **Professional:** Shows API best practices
- **Developer-Friendly:** Interactive testing UI
- **Self-Documented:** No separate API docs needed
- **Type-Safe:** Clear schemas for every endpoint
- **Production-Ready:** Industry standard format

---

**Your API is now enterprise-grade! 🎉**

Next step: **Email Notifications** 
