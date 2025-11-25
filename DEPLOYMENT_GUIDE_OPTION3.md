# Zarrin Blogs - Separate Frontend & Backend Deployment Guide

## Option 3: Independent Deployments (RECOMMENDED)

Frontend and backend are deployed separately. Changes to either are independent and reversible.

---

## **BACKEND DEPLOYMENT (Render)**

### Step 1: Remove dist folder from backend
```bash
cd Zarrin_server
rm -r dist  # Remove the frontend folder
```

### Step 2: Update Zarrin_server/index.js
Remove the static file serving code, keep only API routes:

```javascript
// Remove these lines:
// const distPath = path.join(__dirname, 'dist');
// app.use(express.static(distPath));
// app.get('*', (req, res) => { ... });
```

### Step 3: Create render-backend.yaml
In root directory:
```yaml
services:
  - type: web
    name: zarrin-blogs-backend
    runtime: node
    buildCommand: "npm install"
    startCommand: "npm start"
    dir: Zarrin_server
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: MONGO_URL
        scope: project
      - key: JWT_SECRET
        scope: project
      - key: CLOUD_NAME
        scope: project
      - key: CLOUD_API_KEY
        scope: project
      - key: CLOUD_API_SECRET
        scope: project
      - key: CLOUDINARY_URL
        scope: project
      - key: CORS_ORIGIN
        value: "https://zarrin-blogs-frontend.vercel.app"
```

### Step 4: Connect to Render
1. Go to https://render.com
2. Click "New" → "Web Service"
3. Connect your GitHub repo
4. Set Root Directory: `Zarrin_server`
5. Set Start Command: `npm start`
6. Add all environment variables from .env file
7. Deploy!

**Your backend URL will be:** `https://zarrin-blogs-backend.onrender.com`

---

## **FRONTEND DEPLOYMENT (Vercel)**

### Step 1: Create vercel.json
In `Zarrin_server/dist/zarrin_blogs/`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "env": {
    "REACT_APP_API_BASE_URL": "@react_app_api_base_url"
  }
}
```

### Step 2: Update API Base URL Usage
Your components already use relative `/api` paths. They work automatically with:
- **Development:** `http://localhost:8200` (via proxy)
- **Production:** Add this helper in `zarrin_blogs/src/utils/api.js`:

```javascript
// src/utils/api.js
const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8200';

export const fetchAPI = async (endpoint, options = {}) => {
  const url = `${API_BASE}${endpoint}`;
  const token = localStorage.getItem('token');
  
  return fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      ...options.headers
    }
  });
};

export default API_BASE;
```

### Step 3: Update Components (Optional - for explicit URLs)
If you want to explicitly use the API helper:

```javascript
// Before
const res = await fetch("/api/stats", { headers: {...} });

// After (optional)
import { fetchAPI } from '../utils/api';
const res = await fetchAPI("/api/stats");
```

### Step 4: Connect to Vercel
1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import your GitHub repo
4. Select `Zarrin_server/dist/zarrin_blogs` as Root Directory
5. Add Environment Variable:
   - Name: `REACT_APP_API_BASE_URL`
   - Value: `https://zarrin-blogs-backend.onrender.com`
6. Click Deploy!

**Your frontend URL will be:** `https://zarrin-blogs-frontend.vercel.app`

---

## **UPDATE BACKEND CORS**

Update `Zarrin_server/index.js` CORS configuration:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001', 
    'https://zarrin-blogs-frontend.vercel.app',  // Add this
    process.env.CORS_ORIGIN
  ],
  credentials: true
}));
```

---

## **DEPLOYMENT WORKFLOW**

### For Backend Updates:
```bash
cd Zarrin_server
git add .
git commit -m "Backend changes"
git push origin main
# Render auto-deploys (if configured)
```

### For Frontend Updates:
```bash
cd Zarrin_server/dist/zarrin_blogs
git add .
git commit -m "Frontend changes"
git push origin main
# Vercel auto-deploys (if configured)
```

### Rollback (Easy - All in Git):
```bash
git log --oneline              # See all commits
git revert <commit-hash>       # Rollback specific commit
git push origin main           # Re-deploy
```

---

## **BENEFITS OF OPTION 3:**

✅ Independent updates (change frontend without backend rebuild)
✅ Fast deployments (only changed service rebuilds)
✅ Better scalability (separate services)
✅ Full rollback history in Git
✅ Environment isolation (dev/prod configs separate)
✅ No manual build + copy process
✅ Auto-deployments on every push

---

## **LIVE URLS AFTER DEPLOYMENT:**

- **Frontend:** https://zarrin-blogs-frontend.vercel.app
- **Backend API:** https://zarrin-blogs-backend.onrender.com
- **Blog URL:** https://zarrin-blogs-frontend.vercel.app/blog
- **Dashboard:** https://zarrin-blogs-frontend.vercel.app/dashboard
- **API Endpoint:** https://zarrin-blogs-backend.onrender.com/api/blogs

---

## **QUICK REFERENCE**

| Task | Command |
|------|---------|
| Test locally | `cd Zarrin_server/dist/zarrin_blogs && npm start` (in one terminal) + `cd Zarrin_server && npm run dev` (in another) |
| Build frontend | `cd Zarrin_server/dist/zarrin_blogs && npm run build` |
| Check API | `curl https://zarrin-blogs-backend.onrender.com/api/stats` |
| Rollback frontend | `git revert <hash> && git push` |
| View logs | Check Render dashboard or Vercel dashboard |

