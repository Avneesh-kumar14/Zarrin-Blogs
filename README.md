# 📝 Zarrin Blogs - MERN Stack Blog Platform

A full-stack blog management platform built with **MongoDB**, **Express.js**, **React**, and **Node.js** (MERN). Features include user authentication, blog creation/editing/deletion, category management, and cloud-based image storage using Cloudinary.

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Node](https://img.shields.io/badge/Node-v16.x-green.svg)
![React](https://img.shields.io/badge/React-v18.x-blue.svg)

---

## 🌟 Features

### Frontend Features
- ✅ **User Authentication** - Secure login and signup with JWT tokens
- ✅ **Blog Management** - Create, read, update, and delete blogs
- ✅ **Rich Text Editor** - ReactQuill for formatted content creation
- ✅ **Image Upload** - Upload images to Cloudinary with preview
- ✅ **Category Management** - Create and manage blog categories
- ✅ **Blog Preview** - Preview blogs before publishing
- ✅ **Dashboard** - User analytics and dashboard interface
- ✅ **Responsive Design** - Mobile-friendly UI with Tailwind CSS
- ✅ **Admin Panel** - Admin user with special privileges
- ✅ **🔍 Blog Search** - Search blogs with filters and sorting
- ✅ **💬 Comments System** - Create, edit, delete comments on blogs
- ✅ **❤️ Like/Bookmark** - Like blogs and bookmark for later
- ✅ **📚 Bookmarks Page** - Manage and view all saved blogs

### Backend Features
- ✅ **RESTful API** - Complete REST API for all operations
- ✅ **User Authentication** - JWT-based authentication
- ✅ **Database** - MongoDB Atlas for data persistence
- ✅ **Image Storage** - Cloudinary integration for image management
- ✅ **Authorization** - Role-based access control (Admin/User)
- ✅ **Error Handling** - Comprehensive error handling
- ✅ **Password Hashing** - bcryptjs for secure password storage
- ✅ **🔍 Advanced Search** - Full-text search with category filtering
- ✅ **💬 Comments API** - Full CRUD for blog comments
- ✅ **❤️ Likes System** - Like/unlike with duplicate prevention
- ✅ **📌 Bookmarks API** - Save and manage bookmarks

---

## 📁 Project Structure

```
Zarrin-Blogs/
├── zarrin_blogs/                 # React Frontend
│   ├── public/                  # Static files
│   ├── src/
│   │   ├── Component/
│   │   │   ├── Main Component/  # Main page components
│   │   │   ├── Common/          # Reusable components
│   │   │   └── AuthenticatedLayout.jsx
│   │   ├── Pages/               # Page components
│   │   ├── App.js              # Main App component
│   │   ├── App.css
│   │   └── index.js
│   ├── package.json
│   └── tailwind.config.js
│
├── Zarrin_server/               # Express Backend
│   ├── controllers/             # Business logic
│   ├── middleware/              # Custom middleware
│   ├── models/                  # MongoDB schemas
│   ├── routes/                  # API routes
│   ├── utils/                   # Utility functions
│   ├── index.js                 # Server entry point
│   ├── connection.js            # Database connection
│   ├── .env                     # Environment variables
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🛠️ Tech Stack

### Frontend
- **React 18.2** - UI framework
- **React Router 7.7** - Client-side routing
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **ReactQuill** - Rich text editor
- **Lucide React** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - ODM for MongoDB
- **JWT** - Token-based authentication
- **bcryptjs** - Password hashing
- **Cloudinary** - Cloud image storage
- **Multer** - File upload middleware

---

## ⚙️ Installation & Setup

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB Atlas** account
- **Cloudinary** account
- **Git**

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd Zarrin_server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file with the following variables:**
   ```env
   PORT=8200
   MONGO_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/zarrin_blogs?retryWrites=true&w=majority
   JWT_SECRET=your_secret_key_here
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Create admin account (optional):**
   ```bash
   node create-admin.js
   ```
   - Email: `admin@gmail.com`
   - Password: `Raj@1234`

5. **Start the server:**
   ```bash
   npm start
   ```
   Server will run on `http://localhost:8200`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd zarrin_blogs
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```
   App will open on `http://localhost:3000`

---

## 🔐 Environment Variables

### Backend (.env)
```env
# Server Configuration
PORT=8200

# Database
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/database_name

# Authentication
JWT_SECRET=your_secret_jwt_key

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=729789199238541
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend
The frontend uses full URLs for API calls: `http://localhost:8200/api/...`

---

## 📚 API Endpoints

### Authentication Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | User registration |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/validate` | Validate JWT token |
| POST | `/api/auth/reset-password` | Reset password |

### Blog Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/blogs` | Get all blogs |
| GET | `/api/blogs/:id` | Get single blog |
| GET | `/api/blogs/user/:userId` | Get user's blogs |
| POST | `/api/blogs` | Create new blog |
| PATCH | `/api/blogs/:id` | Update blog |
| DELETE | `/api/blogs/:id` | Delete blog |

### Category Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | Get all categories |
| POST | `/api/categories` | Create category |
| DELETE | `/api/categories/:id` | Delete category |

### Upload Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload/upload` | Upload single image |
| POST | `/api/upload/upload-multiple` | Upload multiple images |

### Stats Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stats/count` | Get dashboard statistics |

### Search Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/search` | Search blogs with filters and sorting |

### Comments Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/comments/blog/:blogId` | Get all comments for a blog |
| POST | `/api/comments` | Create a new comment |
| PATCH | `/api/comments/:id` | Update a comment |
| DELETE | `/api/comments/:id` | Delete a comment |

### Likes Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/likes/count/:blogId` | Get like count for a blog |
| GET | `/api/likes/check/:blogId` | Check if user liked a blog |
| POST | `/api/likes/:blogId` | Like a blog |
| DELETE | `/api/likes/:blogId` | Unlike a blog |

### Bookmarks Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bookmarks` | Get user's bookmarks |
| GET | `/api/bookmarks/check/:blogId` | Check if blog is bookmarked |
| POST | `/api/bookmarks/:blogId` | Bookmark a blog |
| DELETE | `/api/bookmarks/:blogId` | Remove bookmark |

---

## 📖 Usage Guide

### User Registration
1. Click on **Sign Up** on the login page
2. Enter email and password (minimum 6 characters)
3. Account will be created and you'll be logged in

### Creating a Blog
1. Log in to your account
2. Go to **Dashboard** → **Create Blog** or **Dashboard** → **Posts**
3. Fill in blog details:
   - **Title** - Blog title
   - **Category** - Select or create a new category
   - **Short Description** - Brief summary
   - **Content** - Full blog content using rich text editor
   - **Images** - Upload images (they'll be stored in Cloudinary)
4. Click **Preview** to see how it looks before publishing
5. Click **Submit** to publish the blog

### Editing a Blog
1. Go to **Dashboard** → **My Blogs**
2. Click **Edit** button on any blog
3. Modify the content
4. Click **Update Blog** to save changes

### Deleting a Blog
1. Go to **Dashboard** → **My Blogs**
2. Click **Delete** button on any blog
3. Confirm the deletion

### Viewing Blogs
1. Go to **Blog** page to see all published blogs
2. Click on any blog to view full details
3. See author information and publication date

### Managing Categories
1. Go to **Dashboard** → **Categories**
2. Create new categories
3. Delete existing categories

### 🔍 Searching Blogs
1. Click on the **Search** icon in the navbar
2. Type keywords to search blogs
3. Press Enter or click search button
4. Use filters:
   - **Category** - Filter by blog category
   - **Sort** - Choose (Newest, Oldest, or Trending)
5. Click on any result to read the full blog

### 💬 Commenting on Blogs
1. Navigate to any blog post
2. Scroll down to the **Comments** section
3. If logged in, you can:
   - **Post** - Write a comment (1-1000 characters)
   - **Edit** - Click the pencil icon to modify your comment
   - **Delete** - Click the trash icon to remove your comment
4. If not logged in, click to log in first
5. See all comments with author names and timestamps

### ❤️ Liking & Bookmarking Blogs
1. On any blog post, see the **Like** and **Bookmark** buttons
2. Click **Like** button:
   - Button turns red when liked
   - Shows the total number of likes
   - Click again to unlike
3. Click **Bookmark** button:
   - Button turns yellow when bookmarked
   - Saves blog for later reading
   - Click again to remove bookmark
4. Both require authentication (log in if needed)

### 📚 Managing Bookmarks
1. Click the **Bookmark** icon in the navbar (when logged in)
2. View all your saved blogs in a grid layout
3. For each bookmark:
   - Click **Read** to open the blog
   - Click **Remove** to delete the bookmark
4. See category, author, and save date for each blog
5. Message shows if you have no bookmarks yet

---

## 🔑 Default Admin Credentials

```
Email: admin@gmail.com
Password: Raj@1234
```

> ⚠️ **Important:** Change these credentials after first login in production!

---

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the frontend:
   ```bash
   cd zarrin_blogs
   npm run build
   ```
2. Deploy the `build/` folder to Vercel or Netlify

### Backend (Heroku/Railway)
1. Create `.env` file with production variables
2. Deploy using your preferred platform
3. Update frontend API URL to production backend URL

---

## 🐛 Troubleshooting

### Image Upload Issues
- Ensure Cloudinary credentials are correctly set in `.env`
- Check file size (max 5MB per file)
- Verify file is in supported format (JPEG, PNG, GIF, WebP)

### Database Connection Error
- Verify MongoDB Atlas connection string is correct
- Ensure your IP is whitelisted in MongoDB Atlas
- Check username and password in connection string

### Authentication Issues
- Clear browser localStorage and cookies
- Check JWT_SECRET is consistent across restarts
- Verify token is being sent with Authorization header

### CORS Issues
- Backend should allow frontend URL in CORS configuration
- Check proxy setting in frontend `package.json`

---

## 📝 Database Schema

### User Schema
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (default: "user"),
  blog: [ObjectId] (reference to blogs),
  createdAt: Date,
  updatedAt: Date
}
```

### Blog Schema
```javascript
{
  title: String (required),
  blog_content: String (required),
  short_description: String,
  images: [String] (Cloudinary URLs),
  category: [ObjectId] (reference to categories),
  author: ObjectId (reference to user),
  createdAt: Date,
  updatedAt: Date
}
```

### Category Schema
```javascript
{
  name: String (required),
  slug: String,
  createdAt: Date
}
```

---

## 🔄 Application Flow

```
User Registration/Login
    ↓
Authentication (JWT Token)
    ↓
Dashboard (View Analytics)
    ↓
├─ Create Blog → Upload Images → Preview → Publish
├─ View My Blogs → Edit → Update
├─ View My Blogs → Preview → See Full Blog
├─ View My Blogs → Delete Blog
└─ Manage Categories → Create/Delete
    ↓
Public Blog Page (View All Blogs)
    ↓
Single Blog Preview (View Full Blog)
```

---

## 📚 Documentation

For detailed information about the new features, please refer to:

- **[FRONTEND_FEATURES_GUIDE.md](./FRONTEND_FEATURES_GUIDE.md)** - Complete guide to all frontend features including Search, Comments, Likes, Bookmarks
- **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** - Pre-deployment testing checklist and deployment steps
- **[QUICK_TESTING_GUIDE.md](./QUICK_TESTING_GUIDE.md)** - Step-by-step testing guide for all features
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Overview of implementation and status

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on [GitHub Issues](https://github.com/Avneesh-kumar14/Zarrin-Blogs/issues)
- Contact the development team

---

## 🙏 Acknowledgments

- **Cloudinary** - Image storage and optimization
- **MongoDB Atlas** - Cloud database hosting
- **React** - UI framework
- **Tailwind CSS** - Styling framework
- **OpenRewrite** - Code modernization

---

## 📊 Project Statistics

- **Frontend Components**: 15+
- **Backend Routes**: 20+
- **Database Collections**: 3
- **API Endpoints**: 15+

---

**Last Updated**: November 23, 2025

For the latest updates and features, visit the [GitHub Repository](https://github.com/Avneesh-kumar14/Zarrin-Blogs)
