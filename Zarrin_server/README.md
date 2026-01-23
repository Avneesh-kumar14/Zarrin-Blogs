# 🚀 Zarrin Server - Backend API

Express.js backend for the Zarrin Blogs MERN application. Provides RESTful APIs for user authentication, blog management, category handling, and image uploads to Cloudinary.

---

## 📋 Table of Contents
- [Installation](#installation)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Features](#features)
- [Error Handling](#error-handling)

---

## 🛠️ Installation

### Prerequisites
- Node.js v16+
- MongoDB Atlas account
- Cloudinary account

### Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env` file:**
   ```env
   PORT=8200
   MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/database_name
   JWT_SECRET=your_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

3. **Create admin account (optional):**
   ```bash
   node create-admin.js
   ```

4. **Start the server:**
   ```bash
   npm start
   ```

---

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `8200` |
| `MONGO_URL` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret for JWT tokens | `your_secret_key` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `diafth7k8` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `729789199238541` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `EU0ZFcGy8RP...` |

---

## 📡 API Endpoints

### Authentication Routes

#### Sign Up
```
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@gmail.com",
  "password": "Raj@1234"
}

Response:
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": "...",
    "name": "Admin",
    "email": "admin@gmail.com",
    "role": "admin"
  }
}
```

#### Validate Token
```
GET /api/auth/validate
Authorization: Bearer <token>

Response:
{
  "success": true,
  "user": { ... }
}
```

---

### Blog Routes

#### Get All Blogs
```
GET /api/blogs

Response:
[
  {
    "_id": "...",
    "title": "Blog Title",
    "short_description": "...",
    "blog_content": "...",
    "images": ["url1", "url2"],
    "category": [{ "_id": "...", "name": "Technology" }],
    "author": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "createdAt": "2025-11-23T10:30:00Z"
  }
]
```

#### Get Single Blog
```
GET /api/blogs/:id

Response:
{
  "_id": "...",
  "title": "Blog Title",
  "short_description": "...",
  "blog_content": "...",
  "images": ["url1", "url2"],
  "category": [...],
  "author": {...},
  "createdAt": "2025-11-23T10:30:00Z"
}
```

#### Get User's Blogs
```
GET /api/blogs/user/:userId

Response:
[...]
```

#### Create Blog
```
POST /api/blogs
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My First Blog",
  "shortDesc": "This is a short description",
  "content": "<p>Full blog content</p>",
  "images": ["cloudinary_url1", "cloudinary_url2"],
  "category": ["category_id_1", "category_id_2"]
}

Response:
{
  "_id": "...",
  "title": "My First Blog",
  ...
}
```

#### Update Blog
```
PATCH /api/blogs/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "shortDesc": "Updated description",
  "content": "<p>Updated content</p>",
  "images": [...],
  "category": [...]
}

Response:
{
  "_id": "...",
  "title": "Updated Title",
  ...
}
```

#### Delete Blog
```
DELETE /api/blogs/:id
Authorization: Bearer <token>

Response:
{
  "message": "Blog deleted"
}
```

---

### Category Routes

#### Get All Categories
```
GET /api/categories

Response:
[
  {
    "_id": "...",
    "name": "Technology",
    "slug": "technology",
    "createdAt": "2025-11-23T10:30:00Z"
  }
]
```

#### Create Category
```
POST /api/categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Technology"
}

Response:
{
  "_id": "...",
  "name": "Technology",
  "slug": "technology",
  "createdAt": "2025-11-23T10:30:00Z"
}
```

#### Delete Category
```
DELETE /api/categories/:id
Authorization: Bearer <token>

Response:
{
  "message": "Category deleted"
}
```

---

### Upload Routes

#### Upload Single Image
```
POST /api/upload/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <image_file>

Response:
{
  "success": true,
  "url": "https://res.cloudinary.com/...",
  "message": "Image uploaded successfully"
}
```

#### Upload Multiple Images
```
POST /api/upload/upload-multiple
Authorization: Bearer <token>
Content-Type: multipart/form-data

files: [<image1>, <image2>, ...]

Response:
{
  "success": true,
  "urls": ["url1", "url2", ...],
  "message": "Images uploaded successfully"
}
```

---

### Stats Routes

#### Get Dashboard Statistics
```
GET /api/stats/count
Authorization: Bearer <token>

Response:
{
  "stats": {
    "users": 5,
    "blogs": 12,
    "categories": 4
  },
  "recentBlogs": [
    {
      "_id": "...",
      "title": "...",
      "category": [...],
      "createdAt": "..."
    }
  ]
}
```

---

## 📊 Database Schema

### User Model
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (default: "user", enum: ["user", "admin"]),
  blog: [ObjectId] (references Blog),
  createdAt: Date,
  updatedAt: Date
}
```

### Blog Model
```javascript
{
  _id: ObjectId,
  title: String (required),
  blog_content: String (required),
  short_description: String,
  images: [String] (Cloudinary URLs),
  category: [ObjectId] (references Category),
  author: ObjectId (references User, required),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Category Model
```javascript
{
  _id: ObjectId,
  name: String (required),
  slug: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔒 Middleware

### Authentication Middleware (`auth.js`)
- Verifies JWT token
- Extracts user information
- Protects authenticated routes
- Checks user roles

### Upload Middleware (`upload.js`)
- Handles file uploads with Multer
- Memory storage for images
- File type validation (JPEG, PNG, GIF, WebP)
- 5MB file size limit

---

## 🎨 Features

### Password Security
- Passwords hashed using bcryptjs
- Pre-save hook for automatic hashing
- Password comparison for authentication

### Cloudinary Integration
- Upload images to Cloudinary cloud
- Automatic image optimization
- URL returned for frontend use
- Support for single and multiple uploads

### JWT Authentication
- Token-based authentication
- Token stored in localStorage (frontend)
- Bearer token in Authorization header
- Token includes userId, email, role

### Authorization Checks
- Blog owner can edit/delete own blogs
- Admin can edit/delete any blog
- Category operations require authentication
- User-specific blog filtering

---

## 🚨 Error Handling

### Common Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

---

## 📝 Routes File Structure

```
routes/
├── auth.js          # Authentication routes
├── blog.js          # Blog CRUD operations
├── category.js      # Category management
├── upload.js        # Image upload
└── stats.js         # Dashboard statistics
```

---

## 🔑 Default Admin Account

```
Email: admin@gmail.com
Password: Raj@1234
```

Create using: `node create-admin.js`

---

## 🧪 Testing

### Using Postman/Thunder Client

1. **Sign Up User:**
   - POST `http://localhost:8200/api/auth/signup`
   - Body: `{ "name": "Test", "email": "test@test.com", "password": "test123" }`

2. **Login:**
   - POST `http://localhost:8200/api/auth/login`
   - Body: `{ "email": "test@test.com", "password": "test123" }`

3. **Get Token:**
   - Copy the token from login response

4. **Create Blog:**
   - POST `http://localhost:8200/api/blogs`
   - Header: `Authorization: Bearer <token>`
   - Body: Blog data

---

## 📚 Utilities

### Cloudinary Utils (`utils/cloudinary.js`)
- `uploadToCloudinary(buffer, fileName)` - Upload image to Cloudinary
- `deleteFromCloudinary(publicId)` - Delete image from Cloudinary

### Token Generation (`utils/generateToken.js`)
- `generateToken(user)` - Generate JWT token with user data

---

## 🐛 Common Issues

### Image Upload Fails
- Check Cloudinary credentials in .env
- Verify file size is under 5MB
- Ensure file is valid image format

### Database Connection Error
- Check MongoDB Atlas connection string
- Verify IP whitelist in MongoDB Atlas
- Ensure network connectivity
- **Server Startup with MongoDB**:
  - Server starts immediately on port 8200 without waiting for MongoDB
  - MongoDB connection is established asynchronously in the background
  - If MongoDB is unreachable, server continues running in offline mode
  - Check logs for `[DB] Connected to MongoDB` confirmation
  - Use `/health` endpoint to check database status: `GET http://localhost:8200/health`

### Auth Issues
- Clear token in localStorage
- Verify JWT_SECRET is consistent
- Check Authorization header format

### Server Exits Immediately
- Ensure all environment variables are set in `.env`
- Check for unhandled promise rejections in logs
- Verify Node.js version is v16 or higher
- Use `npm start` from the Zarrin_server directory

---

## 🏥 Health Check Endpoint

The server provides a health check endpoint for monitoring:

```
GET /api/health
```

**Response (Database Connected):**
```json
{
  "status": "UP",
  "timestamp": "2025-01-23T10:30:45.123Z",
  "uptime": 145.678,
  "database": {
    "state": "connected",
    "connected": true
  },
  "memory": {
    "rss": 56789012,
    "heapTotal": 23456789,
    "heapUsed": 12345678,
    "external": 567890
  }
}
```

**Response (Database Unavailable - Degraded Mode):**
```json
{
  "status": "DEGRADED",
  "timestamp": "2025-01-23T10:30:45.123Z",
  "uptime": 145.678,
  "database": {
    "state": "disconnected",
    "connected": false
  },
  "memory": { ... }
}
```

---

## ⚡ Server Startup Behavior

### Async MongoDB Connection (New Behavior)
- **Immediate**: Server binds to port 8200 and starts accepting requests
- **Background**: MongoDB connection attempt starts asynchronously
- **Benefit**: Server remains operational even if MongoDB is temporarily unavailable
- **Status Check**: Use `/health` endpoint to verify database connectivity
- **Models**: Loaded automatically once MongoDB connects
- **Fallback**: Server continues running in offline/degraded mode if DB unavailable

### Startup Sequence
1. ✅ Environment variables loaded
2. ✅ Middleware and routes configured
3. ✅ Express app created
4. ✅ Server listens on port 8200
5. 🔄 MongoDB connection starts (async, non-blocking)
6. 🔄 Models load once DB connects
7. ✅ Ready to accept requests immediately

---

## 📈 Performance Tips

1. Use image optimization in Cloudinary
2. Implement pagination for blog lists
3. Cache frequently accessed data
4. Use database indexes on frequently queried fields

---

## 🔄 Deployment

### Environment for Production
```env
PORT=8200
MONGO_URL=<production_mongodb_url>
JWT_SECRET=<strong_secret_key>
CLOUDINARY_CLOUD_NAME=<your_cloud>
CLOUDINARY_API_KEY=<your_key>
CLOUDINARY_API_SECRET=<your_secret>
```

### Deploy on Heroku
```bash
git push heroku main
```

### Deploy on Railway/Render
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

---

## 📞 Support

For issues or questions:
- Check error logs in server console
- Review API response status codes
- Verify environment variables
- Check database connection

---

**Last Updated**: January 23, 2026
**Status**: ✅ MongoDB Connection Fixed - Async Startup Implemented

[Back to Main README](../README.md)
