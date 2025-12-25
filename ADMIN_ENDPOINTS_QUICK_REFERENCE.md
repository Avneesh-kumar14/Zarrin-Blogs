# ⚡ Admin API Quick Reference

## All Admin Endpoints

### 📊 Dashboard
```bash
GET /api/admin/dashboard
# Returns: stats, blogsByStatus, topAuthors, topBlogs, recentBlogs, engagement
```

### 👥 User Management
```bash
# Get all users
GET /api/admin/users?page=1&limit=10&search=query

# Delete user (removes user + all their blogs)
DELETE /api/admin/users/:userId
```

### 📝 Blog Management
```bash
# Get all blogs
GET /api/admin/blogs?page=1&limit=10&status=published&search=query

# Delete blog
DELETE /api/admin/blogs/:blogId

# Update blog status
PATCH /api/admin/blogs/:blogId/status
Body: { "status": "draft" | "published" | "scheduled" }
```

### 💬 Comment Management (NEW!)
```bash
# Get all comments
GET /api/admin/comments?page=1&limit=20&search=query
Response: 
{
  "comments": [...],
  "pagination": { "currentPage": 1, "totalPages": 5, "totalComments": 100 }
}

# Delete specific comment
DELETE /api/admin/comments/:commentId
Response: { "message": "Comment deleted successfully" }

# Delete all comments on a blog
DELETE /api/admin/blogs/:blogId/comments
Response: { "message": "5 comments deleted successfully", "deletedCount": 5 }

# Delete all comments by a user
DELETE /api/admin/users/:userId/comments
Response: { "message": "12 comments deleted successfully", "deletedCount": 12 }
```

### 📈 Analytics
```bash
GET /api/admin/analytics
# Returns: blogTrend, userTrend, topCategories
```

---

## 🔒 Authentication

All endpoints require:
```
Header: Authorization: Bearer {token}
        Content-Type: application/json
```

And admin role:
```
User must have: role === 'admin'
```

---

## 📌 Common Queries

### Get all comments with pagination
```bash
curl -X GET "http://localhost:8200/api/admin/comments?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Delete a specific comment
```bash
curl -X DELETE "http://localhost:8200/api/admin/comments/COMMENT_ID" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Delete all comments on a blog
```bash
curl -X DELETE "http://localhost:8200/api/admin/blogs/BLOG_ID/comments" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Delete all comments by a user
```bash
curl -X DELETE "http://localhost:8200/api/admin/users/USER_ID/comments" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## ✅ Features Added

✅ View all comments with search and pagination
✅ Delete specific comment
✅ Delete all comments on a blog (bulk delete)
✅ Delete all comments by a user (bulk delete)

---

## 🎯 Admin Powers Summary

| Resource | View | Create | Update | Delete |
|----------|------|--------|--------|--------|
| Users | ✅ | ❌ | ❌ | ✅ |
| Blogs | ✅ | ❌ | ✅ | ✅ |
| Comments | ✅ | ❌ | ❌ | ✅ |
| Analytics | ✅ | ❌ | ❌ | ❌ |

---

## Response Format

### Success (200)
```json
{
  "message": "Operation successful",
  "deletedCount": 5
}
```

### Error (400/404/500)
```json
{
  "error": "User not found" | "Blog not found" | "Comment not found"
}
```

### Not Authorized (403)
```json
{
  "error": "Admin access required"
}
```
