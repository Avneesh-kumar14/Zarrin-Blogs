# 🧪 TESTING & TROUBLESHOOTING GUIDE

**Last Updated**: January 17, 2026  
**Status**: Ready for Comprehensive Testing

---

## PRE-TESTING CHECKLIST

Before testing, ensure:

- [ ] **Backend**: All changes applied to `Zarrin_server/`
- [ ] **Frontend**: All changes applied to `zarrin_blogs/src/`
- [ ] **Environment**: `.env` has correct `REACT_APP_API_BASE_URL`
- [ ] **Services**: Both backend and frontend running
- [ ] **Database**: MongoDB running and connected
- [ ] **Browser**: Clear cache (Ctrl+Shift+Delete on Windows, Cmd+Shift+Delete on Mac)

---

## STARTUP PROCEDURE

### Step 1: Backend Setup & Start

```bash
cd Zarrin_server

# Install/update dependencies (if needed)
npm install

# Start server
npm start

# Expected output:
# ✅ MongoDB connected
# ✅ Server running on port 8200
# ✅ All routes registered
```

### Step 2: Frontend Setup & Start

```bash
cd zarrin_blogs

# Install/update dependencies (if needed)
npm install

# Verify .env file exists:
# REACT_APP_API_BASE_URL=http://localhost:8200

# Start frontend
npm start

# Expected output:
# ✅ Compiled successfully
# ✅ App running on http://localhost:3000
```

### Step 3: Verify Connection

In browser console (F12), run:
```javascript
fetch('http://localhost:8200/api/users')
  .then(r => r.json())
  .then(d => console.log('✅ Backend connected:', d.length, 'users'))
  .catch(e => console.error('❌ Backend error:', e));
```

Expected: `✅ Backend connected: X users` (or empty array)

---

## TEST #1: Home Page - Latest Articles

### Objective
Verify featured blog, recent articles, and top writers display correctly.

### Steps
1. Navigate to `http://localhost:3000` (Home page)
2. Look for:
   - ✅ Featured blog in hero section with image and title
   - ✅ Recent Articles section with 8 cards below featured
   - ✅ Top Writers section showing 3 writers with follower counts

### Expected Output
- Featured blog displays: Yes / No
- Recent blogs load (8+): Yes / No
- Top writers show: Yes / No

### Browser Console Check
```
✅ Blogs fetched: 8+
✅ Found total users: 3+
```

### If Failed ❌

**Problem**: "Featured blog shows nothing"
```javascript
// Check in console:
fetch('http://localhost:8200/api/blogs?status=published')
  .then(r => r.json())
  .then(d => console.log('Blogs:', d));
// If empty array: No published blogs exist, create one via create blog
```

**Problem**: "Recent blogs section empty"
```javascript
// Check API response format:
fetch('http://localhost:8200/api/blogs?status=published')
  .then(r => r.json())
  .then(d => {
    console.log('Response type:', typeof d);
    console.log('Is array?:', Array.isArray(d));
    console.log('Has .data?:', !!d.data);
    console.log('Has .blogs?:', !!d.blogs);
    console.log('First item:', d[0] || d.data?.[0] || d.blogs?.[0]);
  });
```

---

## TEST #2: Trending Blogs Section

### Objective
Verify trending section shows 6 blogs sorted by likes.

### Setup (If No Data)
1. Create 3+ test blogs via create blog page
2. Like at least 2 blogs from different accounts
3. Most liked should show first

### Steps
1. On home page, scroll to "Trending Now 🔥" section
2. Verify:
   - ✅ Exactly 6 blog cards display
   - ✅ Each card has ranking badge (#1, #2, #3, etc.)
   - ✅ Blog with most likes shows #1
   - ✅ Like/view counts visible on each card

### Expected Output
- Trending cards display (count): 0/6, 3/6, 6/6
- Badges show ranking: Yes / No
- Blogs sorted by likes: Yes / No

### Browser Console Check
```
📡 Fetching trending from: http://localhost:8200/api/trending?limit=6
✅ Trending blogs received: 6
```

### If Failed ❌

**Problem**: "No trending blogs show"
```javascript
// Check trending endpoint:
fetch('http://localhost:8200/api/trending?limit=6')
  .then(r => r.json())
  .then(d => {
    console.log('Trending response:', d);
    console.log('Is array?:', Array.isArray(d));
    console.log('Count:', d.length);
    if (d[0]) console.log('First blog has likes?:', d[0].likes);
  });

// If blogs have no likes field, restart backend after model update
```

**Problem**: "Blogs show but not sorted"
```javascript
// Check if new Blog schema applied:
fetch('http://localhost:8200/api/trending?limit=6')
  .then(r => r.json())
  .then(d => {
    if (d[0]) {
      console.log('Blog fields:', Object.keys(d[0]));
      console.log('Has likes field?:', 'likes' in d[0]);
    }
  });
```

**Solution**: Restart backend to reload schema
```bash
# In Zarrin_server terminal:
# Press Ctrl+C to stop
npm start
```

---

## TEST #3: MyBlogs/Drafts Page

### Objective
Verify drafts page loads without "Invalid user data" error.

### Prerequisites
- [ ] Logged in as a user
- [ ] Token exists in localStorage
- [ ] User has drafts created

### Steps
1. Click on profile/dashboard menu
2. Select "My Drafts" or navigate to `/drafts`
3. Verify:
   - ✅ No "Invalid user data" alert appears
   - ✅ Drafts list loads (empty or with drafts)
   - ✅ Create/Edit/Delete buttons work

### Expected Output
- Alert "Invalid user data" appears: Yes / No (should be No)
- Drafts load: Yes / No
- No console errors: Yes / No

### Browser Console Check
```
📥 Fetching drafts for user: [userId]
📊 Response status: 200
✅ Drafts fetched: 0 or more
```

### If Failed ❌

**Problem**: "Invalid user data" alert shows
```javascript
// Check localStorage user data:
const user = JSON.parse(localStorage.getItem('user'));
console.log('User data:', user);
console.log('Has _id?:', !!user._id);
console.log('Has id?:', !!user.id);
console.log('Has token?:', !!localStorage.getItem('token'));
```

**Solution**: Re-login
```bash
1. Go to /login
2. Enter credentials
3. Submit
4. Check localStorage again
5. Try drafts page again
```

**Problem**: "Response status: 401 or 403"
```javascript
// Token might be expired or invalid
const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('token');
console.log('Token starts with Bearer?:', token?.startsWith('eyJ'));
```

**Solution**: Clear localStorage and login again
```javascript
localStorage.clear();
// Then navigate to /login and log in again
```

---

## TEST #4: User Profile - Counts Display

### Objective
Verify post count, followers count, and following count display.

### Steps
1. Navigate to any user profile: `/profile/[user-id]`
2. Verify three stat cards display:
   - ✅ "Articles: X" (post count)
   - ✅ "Followers: X" (follower count)
   - ✅ "Following: X" (following count)
3. Verify buttons:
   - ✅ Followers button is clickable
   - ✅ Following button is clickable

### Expected Output
```
Articles: 5 (or other number)
Followers: 12 (or other number)
Following: 8 (or other number)
```

### Browser Console Check
```
✅ User found: [name]
📤 Sending user response with followers: X
✅ Blogs counted for user
```

### If Failed ❌

**Problem**: "Counts show 0 or missing"
```javascript
// Check API response:
const userId = new URLSearchParams(window.location.search).get('userId');
fetch(`http://localhost:8200/api/users/${userId}`)
  .then(r => r.json())
  .then(user => {
    console.log('User object:', user);
    console.log('totalBlogs:', user.totalBlogs);
    console.log('followers length:', user.followers?.length);
    console.log('following length:', user.following?.length);
  });
```

**Problem**: "Followers/Following buttons not clickable"
```javascript
// Check if user._id exists:
const user = JSON.parse(localStorage.getItem('user'));
console.log('Current user _id:', user._id || user.id);
```

---

## TEST #5: Followers Page - Follow/Unfollow

### Objective
Verify followers list loads and follow/unfollow works with proper error messages.

### Steps
1. Navigate to profile
2. Click "Followers" button/stat
3. Verify:
   - ✅ Follower list loads
   - ✅ Each follower card shows name, avatar, bio
   - ✅ Follow/Unfollow button appears for each
   - ✅ Clicking button changes state

### Test Actions
- [ ] Click Follow button → Verify success message
- [ ] Click Unfollow button → Verify success message
- [ ] Try to follow yourself → Verify error message
- [ ] Already following someone → Verify error message

### Expected Behavior
```
When following: ✅ "Followed successfully" alert
When unfollowing: ✅ "Unfollowed successfully" alert
Error cases: ✅ Detailed error message (not generic)
```

### Browser Console Check
```
✅ Valid userId, calling fetchFollowers
API Response Status: 200
User data received: {...}
Follow toggle success or error logged
```

### If Failed ❌

**Problem**: "Failed to update follow status" generic error
```javascript
// Check backend response:
const followerId = '[user-id]';
const token = localStorage.getItem('token');
fetch(`http://localhost:8200/api/users/${followerId}/follow`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}` }
})
  .then(r => {
    console.log('Status:', r.status);
    return r.json();
  })
  .then(d => console.log('Response:', d));
```

**Solution**: New error response parsing catches actual error:
```
Expected: "Already following this user"
Instead of: "Failed to update follow status"
```

**Problem**: "List doesn't load or shows empty"
```javascript
// Check if followers populated:
const userId = '[profile-user-id]';
fetch(`http://localhost:8200/api/users/${userId}`)
  .then(r => r.json())
  .then(user => {
    console.log('Followers array:', user.followers);
    console.log('Followers count:', user.followers?.length);
  });
```

---

## TEST #6: Following Page - Follow/Unfollow

### Objective
Same as TEST #5 but for following list.

### Steps
1. Navigate to user profile
2. Click "Following" stat/button
3. Repeat TEST #5 steps for following page

### Expected
Same as TEST #5

### Browser Console Check
```
✅ Valid userId, calling fetchFollowing
API Response Status: 200
User data received: {...}
```

---

## TEST #7: Database Schema Verification

### Objective
Verify Blog model has all required fields.

### Steps

**1. In MongoDB Shell**:
```javascript
// Connect to your MongoDB
db.blogs.findOne()

// Check if these fields exist:
db.blogs.findOne({}, {
  _id: 1,
  title: 1,
  likes: 1,
  comments: 1,
  bookmarks: 1,
  views: 1
})
```

**2. In Browser Console**:
```javascript
fetch('http://localhost:8200/api/blogs?limit=1')
  .then(r => r.json())
  .then(blogs => {
    const blog = Array.isArray(blogs) ? blogs[0] : blogs[0] || blogs;
    if (blog) {
      console.log('Blog fields:', Object.keys(blog));
      console.log('Has likes?:', 'likes' in blog);
      console.log('Has comments?:', 'comments' in blog);
      console.log('Has bookmarks?:', 'bookmarks' in blog);
    }
  });
```

### Expected Output
```
✅ likes: array present
✅ comments: array present
✅ bookmarks: array present
```

### If Failed ❌

**Problem**: Fields missing
```javascript
// Old blogs might not have these fields
// Solution: Run migration script in MongoDB shell:
db.blogs.updateMany({}, {
  $set: {
    likes: [],
    comments: [],
    bookmarks: []
  }
})
```

---

## FULL INTEGRATION TEST

### Complete User Journey

**1. Create Blog**
```
1. Login
2. Click "Create Blog"
3. Fill in: Title, Content, Description
4. Upload image (optional)
5. Click "Publish"
✅ Blog appears in home page
✅ Blog shows in trending (after getting likes)
```

**2. Like Blog**
```
1. Go to home/blog page
2. Click like button on any blog
✅ Like count increases
✅ Notification appears for blog author
```

**3. Follow User**
```
1. Go to any user profile
2. Click "Follow" button
✅ Count increases
✅ User appears in your following list
```

**4. Check Dashboard**
```
1. Go to dashboard/myblogs
✅ No error alert
✅ Your blogs list loads
```

**5. Check Profile**
```
1. Go to your profile
✅ Post count matches
✅ Follower count matches
✅ Following count matches
```

---

## PERFORMANCE MONITORING

### Load Time Checks

Open DevTools (F12) → Network tab

**Home Page Should Load**:
- [ ] Featured blog: < 1s
- [ ] Recent blogs: < 2s
- [ ] Trending blogs: < 2s
- [ ] Top writers: < 1s

**Total Page Load**: < 5s

### If Slow ❌

```javascript
// In console:
console.time('blogs-load');
fetch('http://localhost:8200/api/blogs')
  .then(r => r.json())
  .then(d => console.timeEnd('blogs-load'));

// Should show: blogs-load: XXXms (< 1000ms)
```

---

## ERROR REFERENCE TABLE

| Error | Cause | Solution |
|-------|-------|----------|
| "Invalid user data" | Missing user ID | Re-login |
| "Failed to update follow status" | Generic error | Check error response parsing |
| "Not trending blogs yet" | No published blogs | Create blogs and like them |
| "No recent blogs" | API URL wrong | Check .env REACT_APP_API_BASE_URL |
| Connection refused | Backend not running | npm start in Zarrin_server |
| 401 Unauthorized | Token expired | Re-login |
| 404 Not Found | User doesn't exist | Verify user ID |
| CORS error | Backend not configured | Check CORS in express setup |

---

## QUICK FIXES REFERENCE

### "Restart Everything" Fix
```bash
# Stop both services (Ctrl+C)

# Clear browser cache
# (Ctrl+Shift+Delete)

# Backend
cd Zarrin_server
npm start

# Frontend (in new terminal)
cd zarrin_blogs
npm start

# Refresh browser (Ctrl+F5)
```

### "Clear All Data" Fix
```javascript
// In browser console:
localStorage.clear();
sessionStorage.clear();
// Then refresh page
```

### "Database Reset" Fix
```bash
# In MongoDB shell:
use your_database_name
db.blogs.drop()
db.users.drop()
# (Re-create data via UI)
```

---

## FINAL CHECKLIST

- [ ] Home page shows featured + recent + trending blogs
- [ ] Trending blogs sorted by likes (most first)
- [ ] MyBlogs page loads without error
- [ ] Profile shows all three counts (posts, followers, following)
- [ ] Followers page loads and follow/unfollow works
- [ ] Following page loads and follow/unfollow works
- [ ] All error messages are specific (not generic)
- [ ] Console has no 404 or connection errors
- [ ] All pages load within 5 seconds
- [ ] Follow buttons work with proper feedback
- [ ] Notifications appear when following/unfollowing
- [ ] User data persists across page refreshes

---

## REPORT ISSUES

If any test fails:

1. **Document**: Screenshot or console error
2. **Note**: Exact steps to reproduce
3. **Check**: Browser console (F12) for errors
4. **Verify**: Backend running (`npm start` in Zarrin_server)
5. **Clear**: Cache and localStorage
6. **Try Again**: From step 1

---

**Testing Status**: 🟢 READY  
**Last Updated**: January 17, 2026

