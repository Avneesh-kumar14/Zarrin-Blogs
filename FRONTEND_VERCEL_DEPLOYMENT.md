# Frontend to Vercel Deployment Guide

## ✅ What's Been Updated

All 15 frontend files have been updated to use the live Render backend:

### API URL Changes
- **Old fallback**: `http://localhost:8200`
- **New fallback**: `https://zarrin-blogs-backend.onrender.com`
- **Env variable**: `REACT_APP_API_BASE_URL` (now standardized across all files)

### Files Updated (15 total):
1. **Context files:**
   - `src/context/UserContext.jsx` ✅
   - `src/context/ChatContext.jsx` ✅

2. **Utils:**
   - `src/utils/api.js` ✅
   - `src/utils/socketService.js` ✅

3. **Chat Components:**
   - `src/Component/Chat/CreateConversationModal.jsx` ✅
   - `src/Component/Chat/MessageInput.jsx` ✅

4. **Pages:**
   - `src/Pages/Home.jsx` ✅
   - `src/Pages/Settings.jsx` ✅
   - `src/Pages/Notifications.jsx` ✅

5. **Layout/Navbar Components:**
   - `src/Component/Main Component/Layout1.jsx` ✅
   - `src/Component/Main Component/Navbar.jsx` ✅
   - `src/Component/Main Component/RecentPost.jsx` ✅
   - `src/Component/Main Component/TrendingBlogs.jsx` ✅
   - `src/Component/Main Component/SingleBlog.jsx` ✅

6. **Config files:**
   - `package.json` - Removed proxy ✅
   - `.env` - Created for development ✅
   - `.env.production` - Set for Render backend ✅

---

## 🚀 Next Steps: Vercel Deployment

### Step 1: Test Backend Health (Verify Connection)
```bash
# Test health endpoint
curl https://zarrin-blogs-backend.onrender.com/health

# Expected response: { "status": "ok" }

# Test API docs
https://zarrin-blogs-backend.onrender.com/api-docs
```

### Step 2: Prepare Frontend for Vercel

The frontend is ready! But before deploying, ensure:

```bash
# Install dependencies
npm install

# Build locally to test
npm run build

# Test build
npm start  # Will use .env for localhost testing
```

### Step 3: Connect Vercel to Your Repository

1. Go to [https://vercel.com](https://vercel.com)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Select the frontend folder (`zarrin_blogs`)

### Step 4: Set Environment Variables in Vercel

In Vercel dashboard → Project Settings → Environment Variables

Add:
```
REACT_APP_API_BASE_URL=https://zarrin-blogs-backend.onrender.com
REACT_APP_ENVIRONMENT=production
```

### Step 5: Deploy

1. Click **"Deploy"**
2. Vercel will:
   - Run `npm install`
   - Run `npm run build`
   - Deploy to production URL (e.g., `zarrin-blogs.vercel.app`)

---

## 🎯 Environment Configuration

### Local Development (`.env`)
```dotenv
REACT_APP_API_BASE_URL=http://localhost:8200
REACT_APP_ENVIRONMENT=development
```

### Production (`.env.production`)
```dotenv
REACT_APP_API_BASE_URL=https://zarrin-blogs-backend.onrender.com
REACT_APP_ENVIRONMENT=production
```

### Vercel (Environment Variables Dashboard)
```
REACT_APP_API_BASE_URL=https://zarrin-blogs-backend.onrender.com
REACT_APP_ENVIRONMENT=production
```

---

## 🔍 Verification Checklist Before Deploying

- [ ] Backend health check works: `/health` returns `{"status": "ok"}`
- [ ] Backend API docs accessible: `/api-docs`
- [ ] Can hit real routes: `/api/posts`, `/api/auth/login`, etc.
- [ ] All 15 files have correct fallback URLs
- [ ] `.env.production` has correct Render URL
- [ ] `package.json` has proxy removed
- [ ] Local build completes without errors: `npm run build`
- [ ] Socket.IO connects to Render backend

---

## 🚨 Common Issues & Fixes

### Issue: "API route not found"
**Why**: This is expected for backend root `/`
**Fix**: API calls should use full routes like `/api/posts`, `/api/auth/login`

### Issue: CORS errors
**Why**: Frontend origin not allowed on backend
**Fix**: Ensure Vercel frontend URL is added to backend CORS config:
```javascript
// In backend (Zarrin_server/index.js)
cors({
  origin: [
    'http://localhost:3000',
    'https://zarrin-blogs.vercel.app',  // Add this
    'https://zarrin-blogs-backend.onrender.com'
  ],
  credentials: true
})
```

### Issue: Socket.IO not connecting
**Why**: Connection URL wrong or namespace issue
**Fix**: Check:
- `SOCKET_URL` in `socketService.js` uses `REACT_APP_API_BASE_URL`
- Backend Socket.IO is enabled: `io(server, { cors: {...} })`

### Issue: 404 on API routes
**Why**: Routes not registered or typo in endpoint
**Fix**: Verify routes exist in backend:
- All `/api/*` routes loaded in `index.js`
- Check `routes/` folder for route definitions

---

## ✅ Success Indicators

After Vercel deployment:
1. Frontend loads: `https://zarrin-blogs.vercel.app`
2. API calls work: Check Network tab in DevTools
3. Socket.IO connected: Check Console for `✅ Socket connected`
4. Can create posts, chat, notifications, settings all work
5. Authentication flows correctly (login/logout)

---

## 📝 Final Notes

- **NODE_ENV on Render**: Currently set to `development` 
  - Should change to `production` for security/performance
  - Add env var in Render dashboard: `NODE_ENV=production`
  
- **MongoDB**: Connection confirmed, no changes needed

- **Proxy removed**: Vercel doesn't support `package.json` proxy
  - All API calls now use full URL from `REACT_APP_API_BASE_URL`
  - This is the production-ready approach

---

## 🎉 You're Ready!

All files are configured. When you're ready:
1. Push to GitHub
2. Deploy on Vercel
3. Frontend will automatically talk to Render backend

No more localhost! 🚀
