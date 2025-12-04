# 🔍 DETAILED IMPLEMENTATION EXAMPLES

## HOW EACH TECHNOLOGY IS USED IN YOUR PROJECT

---

## REACT - DETAILED EXAMPLES

### 1. useState - State Management

**Example in your project: Blog Creation Form**

```jsx
// BlogForm.jsx - Creating a new blog
import { useState } from 'react';

const BlogForm = () => {
  // State for form fields
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Handle image selection
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);  // Set selected image
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('category', category);
      if (image) formData.append('image', image);

      // Send to backend
      const response = await fetch('http://localhost:8200/api/blogs', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to create blog');
      }

      setSuccess(true);
      // Clear form
      setTitle('');
      setContent('');
      setCategory('');
      setImage(null);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Blog Title"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Blog Content"
      />
      <input
        type="file"
        onChange={handleImageChange}
        accept="image/*"
      />
      <button disabled={loading}>
        {loading ? 'Creating...' : 'Create Blog'}
      </button>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">Blog created!</p>}
    </form>
  );
};

export default BlogForm;

/* HOW IT WORKS:
1. Each state holds a piece of data
2. When user types, onChange updates state
3. Component re-renders with new values
4. On submit, all states combined into FormData
5. After success, states reset to clear form
6. Error/loading states show UI feedback
*/
```

---

### 2. useEffect - Side Effects & Data Fetching

**Example in your project: Fetch Blogs on Page Load**

```jsx
// Home.jsx - Load blogs when page first opens
import { useState, useEffect } from 'react';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect runs when component mounts
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8200/api/blogs');
        
        if (!response.ok) throw new Error('Failed to fetch');
        
        const data = await response.json();
        setBlogs(data);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []); // Empty dependency array = run once on mount

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {blogs.map(blog => (
        <div key={blog._id}>
          <h2>{blog.title}</h2>
          <p>{blog.short_description}</p>
        </div>
      ))}
    </div>
  );
};

export default Home;

/* HOW IT WORKS:
1. Component renders first (loading = true)
2. useEffect runs AFTER rendering (side effect)
3. Fetches data from API
4. Updates state with fetched data
5. Component re-renders with new data
6. Empty [] dependency = runs only once

WITHOUT useEffect, fetch would run infinitely:
  function Home() {
    const [blogs, setBlogs] = useState([]);
    
    // This would cause infinite loop!
    fetchBlogs();  // Calls setState → re-render → fetchBlogs again...
  }
*/
```

**useEffect with Dependencies:**

```jsx
// Search.jsx - Re-fetch when search query changes
const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      const response = await fetch(
        `http://localhost:8200/api/search?q=${query}`
      );
      const data = await response.json();
      setResults(data);
    }, 300); // Debounce: wait 300ms before fetching

    return () => clearTimeout(timer); // Cleanup
  }, [query]); // Re-run when query changes

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {results.map(blog => <div key={blog._id}>{blog.title}</div>)}
    </div>
  );
};

/* HOW IT WORKS:
1. User types in search box → setQuery updates
2. useEffect detects query dependency changed
3. Debounce timer waits 300ms
4. If user keeps typing, timer resets (cleanup)
5. After 300ms without typing, fetch API
6. Results update and display
*/
```

**Cleanup in useEffect:**

```jsx
// Profile.jsx - Subscribe to user updates, cleanup on unmount
useEffect(() => {
  // Subscribe to updates
  const unsubscribe = subscribeToUserUpdates(userId, (updatedUser) => {
    setUser(updatedUser);
  });

  // Cleanup function - runs when component unmounts or dependency changes
  return () => {
    unsubscribe();  // Stop listening for updates
  };
}, [userId]);

/* WHY CLEANUP:
- Without cleanup: would have multiple subscriptions = memory leak
- With cleanup: unsubscribe when component removed or userId changes
*/
```

---

### 3. useContext - Global State Management

**Example in your project: Dark Mode Toggle**

```jsx
// ThemeContext.jsx - Create context
import { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    // Load from localStorage on first load
    const saved = localStorage.getItem('isDark');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    // Update HTML class when theme changes
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Save preference
    localStorage.setItem('isDark', JSON.stringify(isDark));
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// App.js - Wrap entire app
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      {/* All child components have access to theme */}
      <Navbar />
      <Main />
      <Footer />
    </ThemeProvider>
  );
}

// Navbar.jsx - Use context anywhere
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const Navbar = () => {
  const { isDark, toggleTheme } = useContext(ThemeContext);

  return (
    <div className={isDark ? 'bg-gray-900' : 'bg-white'}>
      <button onClick={toggleTheme}>
        {isDark ? '☀️ Light' : '🌙 Dark'}
      </button>
    </div>
  );
};

// Cards.jsx - Use theme without prop drilling
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const Card = ({ title, content }) => {
  const { isDark } = useContext(ThemeContext);

  return (
    <div className={isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'}>
      <h3>{title}</h3>
      <p>{content}</p>
    </div>
  );
};

/* WHY CONTEXT API:
WITHOUT Context (Prop Drilling):
  <App>
    <Navbar theme={isDark} toggleTheme={toggleTheme} />
    <Main theme={isDark} />
    <Cards theme={isDark} />  <- Nested 5 levels deep
  </App>

WITH Context:
  <ThemeProvider>  <- Provide once at top
    <App>
      <Navbar />  <- Access directly
      <Main />
      <Cards />  <- No need to pass props!
    </App>
  </ThemeProvider>
*/
```

---

### 4. useCallback - Optimize Function Re-creation

**Example in your project: Blog Deletion**

```jsx
// MyBlogs.jsx - Avoid recreating delete handler on every render
import { useCallback, useState } from 'react';

const MyBlogs = () => {
  const [blogs, setBlogs] = useState([]);

  // WITHOUT useCallback - function recreated every render
  // const handleDelete = (blogId) => {
  //   fetch(`/api/blogs/${blogId}`, { method: 'DELETE' });
  //   setBlogs(blogs.filter(b => b._id !== blogId));
  // };

  // WITH useCallback - function created once, reused
  const handleDelete = useCallback(async (blogId) => {
    try {
      await fetch(`http://localhost:8200/api/blogs/${blogId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setBlogs(prev => prev.filter(b => b._id !== blogId));
    } catch (error) {
      console.error('Delete failed:', error);
    }
  }, []); // Dependencies empty = function never changes

  return (
    <div>
      {blogs.map(blog => (
        <div key={blog._id}>
          <h3>{blog.title}</h3>
          {/* handleDelete never recreated = BlogCard doesn't re-render unnecessarily */}
          <BlogCard blog={blog} onDelete={handleDelete} />
        </div>
      ))}
    </div>
  );
};

// BlogCard.jsx - Receives stable callback reference
const BlogCard = ({ blog, onDelete }) => {
  return (
    <div>
      <button onClick={() => onDelete(blog._id)}>Delete</button>
    </div>
  );
};

/* PERFORMANCE IMPACT:
WITHOUT useCallback:
  1. MyBlogs renders
  2. handleDelete function created (new reference)
  3. Passes to BlogCard
  4. BlogCard sees different reference = re-renders
  5. If BlogCard is optimized with React.memo, still renders

WITH useCallback:
  1. MyBlogs renders
  2. handleDelete NOT recreated (same reference)
  3. Passes to BlogCard
  4. BlogCard sees same reference = doesn't re-render (if memoized)
  5. Better performance with large lists
*/
```

---

### 5. useMemo - Optimize Expensive Calculations

**Example in your project: Filter Blogs by Category**

```jsx
// OurBlogs.jsx - Avoid recalculating filtered list on every render
import { useMemo, useState } from 'react';

const OurBlogs = ({ blogs }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  // WITHOUT useMemo - filters on every render
  // const filteredBlogs = blogs.filter(
  //   blog => !selectedCategory || blog.category === selectedCategory
  // );

  // WITH useMemo - only recalculates when blogs or category changes
  const filteredBlogs = useMemo(() => {
    console.log('Recalculating filtered blogs...');
    return blogs.filter(
      blog => !selectedCategory || blog.category === selectedCategory
    );
  }, [blogs, selectedCategory]); // Only if these change

  return (
    <div>
      <div className="categories">
        {/* Clicking here updates selectedCategory */}
        <button onClick={() => setSelectedCategory(null)}>All</button>
        <button onClick={() => setSelectedCategory('tech')}>Tech</button>
        <button onClick={() => setSelectedCategory('travel')}>Travel</button>
      </div>
      <div className="blogs">
        {/* filteredBlogs recalculated only when needed */}
        {filteredBlogs.map(blog => (
          <BlogCard key={blog._id} blog={blog} />
        ))}
      </div>
    </div>
  );
};

/* WHAT HAPPENS:
1. Component renders, useMemo caches result
2. User clicks category button → selectedCategory changes
3. useMemo detects dependency changed
4. Recalculates filtered list
5. Component re-renders with new list

6. User does something else (unrelated state change)
7. useMemo returns cached result (no recalculation)
8. Component re-renders but filtering not redone

PERFORMANCE SAVED:
- Large list (1000 blogs): Filter takes 10ms
- useMemo prevents 10ms waste every unrelated state change
- Significant on complex applications
*/
```

---

### 6. React Router - Navigation

**Example in your project: Setup Routes**

```jsx
// App.js - Define all routes
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Blog from './Pages/Blog';
import CreateBlog from './Pages/CreateBlog';
import Dashboard from './Pages/Dashboard';
import Login from './Pages/Login';
import ProtectedRoute from './Component/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/blog/:id/preview" element={<Blog />} />
        <Route path="/login" element={<Login />} />

        {/* Protected routes - only logged in users */}
        <Route 
          path="/create-blog" 
          element={<ProtectedRoute><CreateBlog /></ProtectedRoute>} 
        />
        <Route 
          path="/dashboard" 
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>} 
        />

        {/* Catch-all for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

// ProtectedRoute.jsx - Check if user logged in
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Blog.jsx - Access URL parameters
import { useParams } from 'react-router-dom';

const Blog = () => {
  const { id } = useParams(); // Extract :id from /blog/:id/preview
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8200/api/blogs/${id}`)
      .then(r => r.json())
      .then(setBlog);
  }, [id]);

  return <div>{blog?.title}</div>;
};

// BlogCard.jsx - Navigate programmatically
import { useNavigate } from 'react-router-dom';

const BlogCard = ({ blog }) => {
  const navigate = useNavigate();

  return (
    <div onClick={() => navigate(`/blog/${blog._id}/preview`)}>
      <h3>{blog.title}</h3>
    </div>
  );
};

/* ROUTING FLOW:
User clicks link → URL changes → Route matches → Component renders
→ useParams extracts URL data → useEffect fetches data → Display
*/
```

---

## NODE.JS & EXPRESS - DETAILED EXAMPLES

---

### 1. Express Middleware

**Example: Authentication Middleware**

```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    // Get token from Authorization header
    // Format: "Bearer eyJhbGciOiJIUzI1NiIs..."
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1]; // Extract token

    if (!token) {
      return res.status(401).json({ error: 'No token, access denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;  // Attach user ID to request
    req.userEmail = decoded.email;

    next(); // Move to next middleware/handler
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = { auth };

// routes/blogs.js - Use middleware
const express = require('express');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Public route - anyone can access
router.get('/', getBlogsList);

// Protected route - only authenticated users
router.post('/', auth, createBlog); // auth middleware runs first
router.put('/:id', auth, updateBlog); // Only if token valid
router.delete('/:id', auth, deleteBlog);

/* FLOW:
1. Client sends request with Authorization header containing token
2. auth middleware extracts and verifies token
3. If valid: req.userId set, next() called, handler executes
4. If invalid: 401 error returned, handler never runs
5. If no token: 401 error returned immediately
*/
```

**Example: Multer File Upload Middleware**

```javascript
// middleware/upload.js
const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save in uploads folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files allowed'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter
});

module.exports = upload;

// routes/upload.js
const express = require('express');
const upload = require('../middleware/upload');
const { uploadImage } = require('../controllers/upload');

const router = express.Router();

router.post('/', upload.single('image'), uploadImage);
// upload.single('image') middleware:
// 1. Checks Authorization header (if auth needed)
// 2. Checks if file exists
// 3. Validates file type
// 4. Validates file size
// 5. Saves to disk
// 6. Sets req.file with file info

module.exports = router;
```

**Example: CORS Middleware**

```javascript
// index.js - Allow frontend to make requests
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:3000',  // Local development
    'https://zarrin-blogs-frontend.vercel.app'  // Production
  ],
  credentials: true  // Allow cookies/credentials
}));

/* WITHOUT CORS:
Browser blocks request from localhost:3000 to localhost:8200
Error: "Access to XMLHttpRequest blocked by CORS policy"

WITH CORS:
Backend tells browser: "localhost:3000 is allowed"
Browser allows the request
*/
```

---

### 2. JWT Authentication

**Example: User Login**

```javascript
// routes/auth.js
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const User = require('../models/userModel');

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user in database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare passwords
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // Token expires in 7 days
    );

    // Send token to frontend
    res.json({ 
      message: 'Login successful',
      token,
      user: { id: user._id, email: user.email, name: user.name }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Frontend receives token
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com', password: '123456' })
});
const { token } = await response.json();
localStorage.setItem('token', token); // Save token

// Future requests include token
const response = await fetch('/api/blogs', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

/* JWT STRUCTURE:
Header.Payload.Signature

Header: { alg: 'HS256', typ: 'JWT' }
Payload: { id: '123', email: 'user@example.com', iat: 1234567890, exp: 1234654290 }
Signature: HMACSHA256(Header.Payload, SECRET_KEY)

PROCESS:
1. Login: Generate JWT with user info
2. Frontend stores JWT
3. Send JWT in Authorization header
4. Backend verifies JWT using SECRET_KEY
5. If valid: user authenticated
6. If expired or tampered: rejected
*/
```

---

### 3. MongoDB Schema & Relationships

**Example: Blog with Author, Category, Comments**

```javascript
// models/userModel.js
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  avatar: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

// models/categoryModel.js
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: String,
  description: String,
  createdAt: { type: Date, default: Date.now }
});

// models/blog.js - Complex relationships
const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  content: { type: String, required: true },
  short_description: String,
  images: [String], // Array of image URLs
  
  // References to other collections
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Link to User collection
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  
  // Embedded data
  likes: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  ], // Array of user IDs who liked
  
  comments: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }
  ], // Array of comment IDs
  
  // Metadata
  views: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['draft', 'published'], 
    default: 'draft'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// models/commentModel.js
const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  blog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog'
  },
  createdAt: { type: Date, default: Date.now }
});

// GET blog with all related data populated
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      // Get author details instead of just ID
      .populate('author', 'name email avatar')
      // Get category details
      .populate('category', 'name slug')
      // Get comments with author info
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'name avatar'
        }
      })
      // Get like counts (likes array contains user IDs)
      .lean(); // .lean() for read-only optimization

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    // Calculate stats
    blog.likeCount = blog.likes.length;
    blog.commentCount = blog.comments.length;
    blog.isLikedByUser = blog.likes.includes(req.userId);

    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* DATABASE STRUCTURE:
Users Collection:
  { _id: 1, name: 'John', email: 'john@...' }

Categories Collection:
  { _id: 100, name: 'Tech', slug: 'tech' }

Blogs Collection:
  {
    _id: 200,
    title: 'React Tips',
    author: 1,           // References user ID 1
    category: 100,       // References category ID 100
    likes: [1, 3, 5],    // References users 1, 3, 5
    comments: [500, 501] // References comment IDs
  }

Comments Collection:
  { _id: 500, content: 'Great post!', author: 1, blog: 200 }

WITHOUT populate - returns:
  { _id: 200, title: 'React Tips', author: 1, category: 100, ... }

WITH populate - returns:
  {
    _id: 200,
    title: 'React Tips',
    author: { _id: 1, name: 'John', email: 'john@...' },
    category: { _id: 100, name: 'Tech' },
    comments: [
      { _id: 500, content: 'Great!', author: { name: 'Jane', ... } }
    ]
  }
*/
```

---

### 4. Search with Filtering

**Example: Advanced Blog Search**

```javascript
// routes/search.js
router.get('/', async (req, res) => {
  try {
    const { q, category, sort } = req.query;

    // Build query object
    const query = { status: 'published' }; // Always filter published

    // Search in title and content
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },      // Case-insensitive
        { content: { $regex: q, $options: 'i' } },
        { short_description: { $regex: q, $options: 'i' } }
      ];
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Sorting options
    let sortOption = { createdAt: -1 }; // Default: newest first
    if (sort === 'trending') {
      sortOption = { likes: -1, views: -1 };
    } else if (sort === 'popular') {
      sortOption = { views: -1 };
    } else if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    }

    // Execute query
    const blogs = await Blog.find(query)
      .populate('author', 'name avatar')
      .populate('category', 'name')
      .sort(sortOption)
      .limit(10)
      .exec();

    res.json(blogs);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Frontend usage
const handleSearch = async () => {
  const response = await fetch(
    `http://localhost:8200/api/search?q=javascript&category=tech&sort=trending`
  );
  const results = await response.json();
  setBlogs(results);
};

/* QUERY EXPLANATION:
$regex: 'javascript', $options: 'i'
  → Searches for "javascript" (case-insensitive)
  
$or: [{title: ...}, {content: ...}]
  → Matches ANY of these conditions

sort({ likes: -1, views: -1 })
  → Sort by likes DESC, then views DESC
  → -1 = descending (high to low)
  → 1 = ascending (low to high)

limit(10) → Return only 10 results
*/
```

---

### 5. Like/Unlike System

**Example: Like a Blog**

```javascript
// routes/likes.js
router.post('/:blogId', auth, async (req, res) => {
  try {
    const { blogId } = req.params;
    const userId = req.userId;

    // Find blog
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    // Check if already liked
    const alreadyLiked = blog.likes.includes(userId);

    if (alreadyLiked) {
      // Unlike - remove user from likes array
      blog.likes = blog.likes.filter(id => id.toString() !== userId);
    } else {
      // Like - add user to likes array
      blog.likes.push(userId);
    }

    // Save updated blog
    await blog.save();

    res.json({
      liked: !alreadyLiked,
      likeCount: blog.likes.length,
      message: alreadyLiked ? 'Unlike successful' : 'Like successful'
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Frontend - Heart button
const BlogCard = ({ blog }) => {
  const [isLiked, setIsLiked] = useState(blog.isLikedByUser);
  const [likeCount, setLikeCount] = useState(blog.likeCount);

  const handleLike = async () => {
    try {
      const response = await fetch(
        `http://localhost:8200/api/likes/${blog._id}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      const data = await response.json();
      setIsLiked(data.liked);
      setLikeCount(data.likeCount);
    } catch (error) {
      console.error('Like failed:', error);
    }
  };

  return (
    <div>
      <button onClick={handleLike}>
        {isLiked ? '❤️' : '🤍'} {likeCount}
      </button>
    </div>
  );
};

/* LIKE FLOW:
1. User clicks heart → handleLike called
2. POST to /api/likes/:blogId with token
3. Backend checks if user in likes array
4. If yes: remove (unlike), if no: add (like)
5. Save to database
6. Return new like count
7. Frontend updates UI
8. Toggle to next like/unlike
*/
```

---

### 6. Error Handling Pattern

**Example: Complete Error Handling**

```javascript
// routes/blogs.js
router.post('/', auth, async (req, res) => {
  try {
    // 1. Validate input
    const { title, content, category } = req.body;
    
    if (!title || title.trim().length < 5) {
      return res.status(400).json({
        error: 'Title required and must be at least 5 characters'
      });
    }

    if (!content || content.trim().length < 20) {
      return res.status(400).json({
        error: 'Content required and must be at least 20 characters'
      });
    }

    // 2. Check authorization
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // 3. Check resource exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // 4. Create document
    const blog = new Blog({
      title,
      content,
      category,
      author: req.userId
    });

    // 5. Save with error handling
    await blog.save();

    // 6. Return success
    res.status(201).json({
      message: 'Blog created successfully',
      blog
    });

  } catch (error) {
    // 7. Handle specific errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation failed',
        details: Object.values(error.errors).map(e => e.message)
      });
    }

    if (error.name === 'CastError') {
      return res.status(400).json({
        error: 'Invalid ID format'
      });
    }

    // 8. Generic error handler
    console.error('Create blog error:', error);
    res.status(500).json({
      error: 'Failed to create blog',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/* ERROR TYPES:
ValidationError → 400 (client error - bad input)
CastError → 400 (client error - invalid ID format)
Unauthorized → 401 (client error - not authenticated)
Forbidden → 403 (client error - not authorized)
Not Found → 404 (client error - resource missing)
Server Error → 500 (server error - unexpected)
*/
```

---

## COMPLETE FLOW EXAMPLES

---

### Complete Blog Creation Flow

**Frontend (React):**

```jsx
// CreateBlog.jsx
const CreateBlog = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    image: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('content', formData.content);
    formDataToSend.append('category', formData.category);
    if (formData.image) formDataToSend.append('image', formData.image);

    const response = await fetch('http://localhost:8200/api/blogs', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formDataToSend
    });

    if (response.ok) {
      navigate('/my-blogs');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />
      {/* ... more fields ... */}
      <button type="submit">Create Blog</button>
    </form>
  );
};
```

**Backend (Express):**

```javascript
// index.js - Setup
app.use('/api/blogs', require('./routes/blogs'));

// routes/blogs.js
router.post('/', auth, async (req, res) => {
  try {
    // Receive request with auth token
    const userId = req.userId; // From auth middleware

    // Validate
    if (!req.body.title || req.body.title.length < 5) {
      return res.status(400).json({ error: 'Invalid title' });
    }

    // Create blog object
    const blog = new Blog({
      title: req.body.title,
      content: req.body.content,
      category: req.body.category,
      author: userId
    });

    // Save to database
    await blog.save();

    // Return created blog
    res.status(201).json(blog);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**Database (MongoDB):**

```javascript
// Blogs collection gets new document:
{
  "_id": ObjectId("634a8f2e9c8c8c8c8c8c8c8c"),
  "title": "React Tutorial",
  "content": "<p>Learn React...</p>",
  "author": ObjectId("123456789"),      // Reference to user
  "category": ObjectId("987654321"),    // Reference to category
  "likes": [],
  "comments": [],
  "views": 0,
  "status": "draft",
  "createdAt": 2024-12-04T10:00:00Z
}
```

---

## 🎓 SUMMARY TABLE

| Technology | Purpose | Used In Project |
|---|---|---|
| **useState** | Manage component state | All forms, filters, loading states |
| **useEffect** | Side effects & data fetching | Blog lists, comments, user data |
| **useContext** | Global state | Dark mode theme |
| **useCallback** | Optimize functions | Delete, edit, search handlers |
| **useMemo** | Optimize calculations | Filter blogs by category |
| **React Router** | Client navigation | Multi-page app structure |
| **JWT** | Authentication tokens | Login/Logout system |
| **bcryptjs** | Password hashing | Secure password storage |
| **Mongoose** | Database ORM | Schema definitions, queries |
| **MongoDB populate** | Relationships | Load author/category/comments |
| **Express Middleware** | Request processing | Auth, CORS, file upload |
| **Multer** | File uploads | Blog image uploads |
| **Cloudinary** | Cloud storage | Store images in cloud |
| **Async-Await** | Asynchronous code | API calls, database operations |
| **Error Handling** | Catch errors | Try-catch in every route |

---

Good luck with your interview! 🎉
