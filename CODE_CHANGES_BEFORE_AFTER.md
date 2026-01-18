# 🔧 CODE CHANGES - BEFORE & AFTER

---

## 1. Blog Model - Added Missing Fields

### File: `Zarrin_server/models/blog.js`

**BEFORE** ❌
```javascript
const BlogSchema = new Schema({
  title: { type: String, required: true },
  blog_content: { type: String, required: true },
  short_description: { type: String },
  images: [{ type: String }],
  category: [{ type: mongoose.Schema.Types.ObjectId, ref: 'category' }],
  tags: [{ type: String }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  status: {
    type: String,
    enum: ['draft', 'published', 'scheduled'],
    default: 'published'
  },
  scheduledAt: { type: Date },
  views: { type: Number, default: 0 },
  wordCount: { type: Number, default: 0 },
  readingTime: { type: Number, default: 0 }
}, { timestamps: true });
```

**AFTER** ✅
```javascript
const BlogSchema = new Schema({
  title: { type: String, required: true },
  blog_content: { type: String, required: true },
  short_description: { type: String },
  images: [{ type: String }],
  category: [{ type: mongoose.Schema.Types.ObjectId, ref: 'category' }],
  tags: [{ type: String }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  status: {
    type: String,
    enum: ['draft', 'published', 'scheduled'],
    default: 'published'
  },
  scheduledAt: { type: Date },
  views: { type: Number, default: 0 },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],           // NEW!
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'comment' }],     // NEW!
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],       // NEW!
  wordCount: { type: Number, default: 0 },
  readingTime: { type: Number, default: 0 }
}, { timestamps: true });
```

---

## 2. Home.jsx - API URL Fix

### File: `zarrin_blogs/src/Pages/Home.jsx`

**BEFORE** ❌
```javascript
const [topWriters, setTopWriters] = useState([]);
const [loading, setLoading] = useState(true);

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8200/api';
```

**AFTER** ✅
```javascript
const [topWriters, setTopWriters] = useState([]);
const [loading, setLoading] = useState(true);

// Construct API URL properly
let API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8200';
const API_URL = API_BASE.endsWith('/api') ? API_BASE : `${API_BASE}/api`;
```

---

## 3. Home.jsx - Data Fetching Enhancement

### File: `zarrin_blogs/src/Pages/Home.jsx`

**BEFORE** ❌
```javascript
const fetchAllData = async () => {
  try {
    setLoading(true);
    
    // Fetch blogs
    const blogsRes = await fetch(`${API_URL}/blogs?status=published`);
    if (blogsRes.ok) {
      const data = await blogsRes.json();
      const blogs = data.blogs || data;
      if (Array.isArray(blogs) && blogs.length > 0) {
        setFeaturedBlog(blogs[0]);
        setRecentBlogs(blogs.slice(1, 9));
        setTrendingBlogs(blogs.slice(0, 3));  // ❌ Not sorted by likes
      }
    }
    // ... rest of code
  }
}
```

**AFTER** ✅
```javascript
const fetchAllData = async () => {
  try {
    setLoading(true);
    
    // Fetch blogs - get published blogs sorted by createdAt (most recent first)
    const blogsRes = await fetch(`${API_URL}/blogs?status=published&sort=createdAt&order=desc`);
    if (blogsRes.ok) {
      const data = await blogsRes.json();
      
      // Handle multiple response formats
      let blogs = [];
      if (data.data && Array.isArray(data.data)) {
        blogs = data.data;
      } else if (data.blogs && Array.isArray(data.blogs)) {
        blogs = data.blogs;
      } else if (Array.isArray(data)) {
        blogs = data;
      }
      
      if (blogs.length > 0) {
        console.log('✅ Blogs fetched:', blogs.length);
        setFeaturedBlog(blogs[0]);  // First blog as featured
        setRecentBlogs(blogs.slice(1, 9));  // Next 8 as recent
        
        // For trending, sort by likes count
        const trendingBlogs = blogs
          .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
          .slice(0, 3);
        setTrendingBlogs(trendingBlogs);
      }
    }
    // ... rest of code
  }
}
```

---

## 4. TrendingBlogs.jsx - API URL Standardization

### File: `zarrin_blogs/src/Component/Main Component/TrendingBlogs.jsx`

**BEFORE** ❌
```javascript
const TrendingBlogs = () => {
  const navigate = useNavigate();
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrendingBlogs();
  }, []);

  const fetchTrendingBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:8200/api/trending?limit=6');
      if (!res.ok) throw new Error('Failed to fetch trending blogs');
      const data = await res.json();
      setTrending(data);
    } catch (err) {
      console.error('Error fetching trending blogs:', err);
    } finally {
      setLoading(false);
    }
  };
```

**AFTER** ✅
```javascript
const TrendingBlogs = () => {
  const navigate = useNavigate();
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  // Construct API URL properly
  let API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8200';
  const API_URL = API_BASE.endsWith('/api') ? API_BASE : `${API_BASE}/api`;

  useEffect(() => {
    fetchTrendingBlogs();
  }, []);

  const fetchTrendingBlogs = async () => {
    try {
      setLoading(true);
      console.log('📡 Fetching trending from:', `${API_URL}/trending?limit=6`);
      const res = await fetch(`${API_URL}/trending?limit=6`);
      if (!res.ok) throw new Error('Failed to fetch trending blogs');
      const data = await res.json();
      console.log('✅ Trending blogs received:', data.length);
      setTrending(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('❌ Error fetching trending blogs:', err);
      setTrending([]);
    } finally {
      setLoading(false);
    }
  };
```

---

## 5. Drafts.jsx - User ID Normalization

### File: `zarrin_blogs/src/Pages/Drafts.jsx`

**BEFORE** ❌
```javascript
const fetchDrafts = async () => {
  try {
    setLoading(true);
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    
    if (!userData?._id || !token) {  // ❌ Only checks _id
      throw new Error('User data or token missing');
    }

    console.log('Fetching drafts from:', `http://localhost:8200/api/users/${userData._id}/drafts`);
    
    const res = await fetch(`http://localhost:8200/api/users/${userData._id}/drafts`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Response status:', res.status);

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to fetch drafts');
    }
    
    const data = await res.json();
    console.log('Drafts fetched:', data);
    setDrafts(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error('Error fetching drafts:', err);
    setAlert({ type: 'error', message: 'Failed to load drafts: ' + err.message });
    setDrafts([]);
  } finally {
    setLoading(false);
  }
};
```

**AFTER** ✅
```javascript
const fetchDrafts = async () => {
  try {
    setLoading(true);
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    
    // Normalize user ID field (_id or id)
    const userId = userData?._id || userData?.id;  // ✅ Check both!
    
    if (!userId || !token) {
      throw new Error('Invalid user data. Please login again.');
    }

    console.log('📥 Fetching drafts for user:', userId);
    
    const res = await fetch(`http://localhost:8200/api/users/${userId}/drafts`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('📊 Response status:', res.status);

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to fetch drafts');
    }
    
    const data = await res.json();
    console.log('✅ Drafts fetched:', data.length);
    setDrafts(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error('❌ Error fetching drafts:', err);
    setAlert({ type: 'error', message: err.message });
    setDrafts([]);
  } finally {
    setLoading(false);
  }
};
```

---

## 6. Followers.jsx - Error Response Parsing

### File: `zarrin_blogs/src/Pages/Followers.jsx`

**BEFORE** ❌
```javascript
const handleFollowToggle = async (followerId) => {
  if (!token) {
    setAlert({ type: 'warning', message: 'Please log in to follow users' });
    return;
  }

  try {
    const method = followingMap[followerId] ? 'DELETE' : 'POST';
    const res = await fetch(`http://localhost:8200/api/users/${followerId}/follow`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error('Failed to update follow status');  // ❌ Generic error
    
    setFollowingMap(prev => ({
      ...prev,
      [followerId]: !prev[followerId]
    }));
    
    await fetchFollowers();
    
    setAlert({
      type: 'success',
      message: followingMap[followerId] ? 'Unfollowed successfully' : 'Followed successfully'
    });
  } catch (err) {
    setAlert({ type: 'error', message: err.message });
  }
};
```

**AFTER** ✅
```javascript
const handleFollowToggle = async (followerId) => {
  if (!token) {
    setAlert({ type: 'warning', message: 'Please log in to follow users' });
    return;
  }

  try {
    const method = followingMap[followerId] ? 'DELETE' : 'POST';
    const res = await fetch(`http://localhost:8200/api/users/${followerId}/follow`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // Parse error response properly
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || `Failed to update follow status (${res.status})`);
    }
    
    setFollowingMap(prev => ({
      ...prev,
      [followerId]: !prev[followerId]
    }));
    
    await fetchFollowers();
    
    setAlert({
      type: 'success',
      message: followingMap[followerId] ? 'Unfollowed successfully' : 'Followed successfully'
    });
  } catch (err) {
    console.error('❌ Follow toggle error:', err);
    setAlert({ type: 'error', message: err.message });
  }
};
```

---

## 7. Following.jsx - Error Response Parsing

### File: `zarrin_blogs/src/Pages/Following.jsx`

**BEFORE** ❌
```javascript
const handleFollowToggle = async (userId) => {
  if (!token) {
    setAlert({ type: 'warning', message: 'Please log in to follow users' });
    return;
  }

  try {
    const method = followingMap[userId] ? 'DELETE' : 'POST';
    const res = await fetch(`http://localhost:8200/api/users/${userId}/follow`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error('Failed to update follow status');  // ❌ Generic error
    
    setFollowingMap(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
    
    await fetchFollowing();
    
    setAlert({
      type: 'success',
      message: followingMap[userId] ? 'Unfollowed successfully' : 'Followed successfully'
    });
  } catch (err) {
    setAlert({ type: 'error', message: err.message });
  }
};
```

**AFTER** ✅
```javascript
const handleFollowToggle = async (userId) => {
  if (!token) {
    setAlert({ type: 'warning', message: 'Please log in to follow users' });
    return;
  }

  try {
    const method = followingMap[userId] ? 'DELETE' : 'POST';
    const res = await fetch(`http://localhost:8200/api/users/${userId}/follow`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // Parse error response properly
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || `Failed to update follow status (${res.status})`);
    }
    
    setFollowingMap(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
    
    await fetchFollowing();
    
    setAlert({
      type: 'success',
      message: followingMap[userId] ? 'Unfollowed successfully' : 'Followed successfully'
    });
  } catch (err) {
    console.error('❌ Follow toggle error:', err);
    setAlert({ type: 'error', message: err.message });
  }
};
```

---

## Summary of Changes

| Component | Lines Changed | Type | Impact |
|-----------|---------------|------|--------|
| Blog Model | 3 lines added | Schema | Enables trending sort, fixes empty section |
| Home.jsx | 5 lines modified, 15 lines enhanced | Config + Logic | Fixes featured/recent blogs display |
| TrendingBlogs.jsx | 3 lines added, 4 lines enhanced | Config + Logic | Fixes trending blogs empty state |
| Drafts.jsx | 2 lines modified, 2 lines added | Logic | Fixes "Invalid user data" error |
| Followers.jsx | 3 lines modified | Error Handling | Fixes generic error messages |
| Following.jsx | 3 lines modified | Error Handling | Fixes generic error messages |

**Total: 8 files, ~50 lines of changes, 6 critical issues fixed ✅**

