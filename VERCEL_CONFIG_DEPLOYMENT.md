# Vercel Configuration & Deployment Files

## `vercel.json` - Vercel Build Configuration

Create this file in `zarrin_blogs/` folder:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "framework": "react",
  "env": {
    "REACT_APP_API_BASE_URL": "https://zarrin-blogs-backend.onrender.com",
    "REACT_APP_ENVIRONMENT": "production"
  }
}
```

---

## Environment Variables for Vercel Dashboard

**Location**: Project Settings → Environment Variables

### Production Environment

| Variable Name | Value | Scope |
|--------------|-------|-------|
| REACT_APP_API_BASE_URL | https://zarrin-blogs-backend.onrender.com | Production |
| REACT_APP_ENVIRONMENT | production | Production |

**Optional (for preview deployments):**

| Variable Name | Value | Scope |
|--------------|-------|-------|
| REACT_APP_API_BASE_URL | https://zarrin-blogs-backend.onrender.com | Preview |
| REACT_APP_ENVIRONMENT | development | Preview |

---

## Vercel CLI Deployment

If you prefer command-line deployment:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy (choose zarrin_blogs as root)
vercel

# Deploy to production
vercel --prod

# With environment variables in one command
vercel --prod --env REACT_APP_API_BASE_URL=https://zarrin-blogs-backend.onrender.com
```

---

## GitHub Actions (Optional - Auto-Deploy on Push)

Create `.github/workflows/vercel-deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main, master]
    paths: ['zarrin_blogs/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        uses: BetaHuhn/deploy-to-vercel-action@v1
        with:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
          WORKING_DIRECTORY: zarrin_blogs
```

---

## `package.json` - Confirmed Changes

Verify your `package.json` in `zarrin_blogs/` has these scripts:

```json
{
  "name": "zarrin",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "dependencies": {
    // ... your dependencies
  }
  // NO "proxy" field should exist here
}
```

---

## Deployment Flow Diagram

```
┌──────────────────────┐
│  GitHub Repository   │
│   (zarrin_blogs)     │
└──────────┬───────────┘
           │
           │ Push to main/master
           ↓
┌──────────────────────┐
│   Vercel CI/CD       │
│  (Auto-detects React)│
└──────────┬───────────┘
           │
           │ 1. npm install
           │ 2. npm run build
           │ 3. Deploys to CDN
           ↓
┌──────────────────────────────────┐
│  Vercel Production URL            │
│  https://zarrin-blogs.vercel.app │
└──────────┬───────────────────────┘
           │
           │ API Calls with
           │ REACT_APP_API_BASE_URL
           ↓
┌─────────────────────────────────────────┐
│  Render Backend                         │
│  https://zarrin-blogs-backend.onrender.com
│                                        │
│  MongoDB, Socket.IO, All Routes        │
└─────────────────────────────────────────┘
```

---

## Pre-Deployment Checklist

### Before Connecting to Vercel:

- [ ] Commit all changes to GitHub
- [ ] `.env` file exists with localhost URLs
- [ ] `.env.production` exists with Render URLs
- [ ] No `"proxy"` in `package.json`
- [ ] All 14 source files updated
- [ ] `npm install` completes without errors
- [ ] `npm run build` completes without errors
- [ ] No console errors in local development

### Vercel Setup Checklist:

- [ ] Vercel account created
- [ ] GitHub repository connected
- [ ] `zarrin_blogs` folder selected as root
- [ ] Framework set to React (auto-detected)
- [ ] Environment variables added to production
- [ ] Build command: `npm run build`
- [ ] Output directory: `build`

---

## Troubleshooting Vercel Deployment

### Build Fails: "Module not found"
**Solution**: 
```bash
npm install
npm audit fix
git add package-lock.json
git push
```

### Build Succeeds but Frontend Shows Errors
**Solution**: Check browser console for API URL issues
```javascript
// Open DevTools Console
console.log(process.env.REACT_APP_API_BASE_URL)
// Should show: https://zarrin-blogs-backend.onrender.com
```

### API Calls Return CORS Errors
**Solution**: Add Vercel URL to backend CORS (in Zarrin_server/index.js)
```javascript
cors({
  origin: [
    'https://zarrin-blogs.vercel.app',
    'https://zarrin-blogs-backend.onrender.com'
  ],
  credentials: true
})
```

### Site Works Locally but Not on Vercel
**Solution**: Environment variables not set in Vercel
1. Go to Vercel Dashboard
2. Select Project → Settings
3. Check Environment Variables section
4. Redeploy if you just added them

---

## Post-Deployment

### Verify Deployment Success:

```bash
# Test frontend loads
curl https://zarrin-blogs.vercel.app

# Check API calls in browser DevTools
# Network tab → filter "api" → check response

# Verify Socket.IO connected
# Console tab → look for "✅ Socket connected"
```

### Monitor Deployment:

1. **Vercel Dashboard**: https://vercel.com/dashboard
2. **View Logs**: Deployments → Select deployment → View logs
3. **Check Analytics**: Real-time metrics, errors, slowness

### Custom Domain (Optional):

1. Go to Vercel Project Settings
2. Domains → Add domain
3. Follow DNS instructions for your registrar

---

## Quick Commands Reference

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to staging
vercel

# Deploy to production
vercel --prod

# View deployment logs
vercel logs <deployment-url>

# Check environment variables
vercel env list
```

---

## Environment Variable File Hierarchy

Vercel applies environment variables in this order (highest to lowest priority):

1. **System environment variables** (set in terminal)
2. **Vercel dashboard env vars** (production/preview/development)
3. **Environment files** (.env.production, .env.development)
4. **Hardcoded fallback** (`'https://zarrin-blogs-backend.onrender.com'`)

---

## Continuous Deployment Setup

Every time you push to GitHub:

1. Vercel detects the change
2. Automatically runs build command
3. Tests the build
4. If successful, deploys to production
5. If failed, sends notification (no automatic deployment)

To disable auto-deploy:
- Vercel Dashboard → Settings → Git → Uncheck "Auto-deploy"

---

## Rollback Previous Deployment

If something goes wrong:

1. Go to Vercel Dashboard
2. Click "Deployments"
3. Find previous working deployment
4. Click "..." menu
5. Select "Promote to Production"

---

## Performance Optimization (Optional)

### Enable Caching:

In `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=3600"
        }
      ]
    }
  ]
}
```

### Use Web Vitals Monitoring:

Already included via `reportWebVitals.js` - check Vercel Analytics automatically.

---

## Security Best Practices

- ✅ Never commit `.env.production` with real values
- ✅ Use Vercel dashboard for sensitive env variables
- ✅ Enable "Protected Branches" in GitHub
- ✅ Require PR reviews before merging
- ✅ Keep dependencies updated: `npm audit`

---

## Success Indicators After Deployment

🟢 **All systems operational when:**

- Frontend loads without errors
- Can log in successfully
- Posts/blogs display correctly
- Can create new posts
- Chat connects and messages send
- Settings save without errors
- Notifications appear in real-time
- Network requests all go to Render backend

🟡 **Watch these metrics:**

- Build time (should be < 5 minutes)
- First Contentful Paint (should be < 2s)
- API response time (should be < 500ms)

---

## Documentation Links

- [Vercel Deployment Docs](https://vercel.com/docs)
- [React on Vercel](https://vercel.com/guides/deploying-react)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Vercel CLI Reference](https://vercel.com/cli)

---

**Ready to Deploy?** 

See [QUICK_DEPLOY_VERCEL.md](./QUICK_DEPLOY_VERCEL.md) for step-by-step instructions!
