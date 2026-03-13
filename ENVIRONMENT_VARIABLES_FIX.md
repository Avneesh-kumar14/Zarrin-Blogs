# Render Environment Variables: Side-by-Side Comparison

## ❌ CURRENT (BROKEN) vs ✅ FIXED

### Issue Summary
Your `render.yaml` has **WRONG environment variable names** that don't match what your backend code expects.

---

## Variable Comparison Table

| Backend Code Expects | Current render.yaml | ✅ SHOULD BE |
|---|---|---|
| `process.env.MONGO_URI` | `MONGO_URL` ❌ | `MONGO_URI` ✓ |
| `process.env.CLOUDINARY_CLOUD_NAME` | `CLOUD_NAME` ❌ | `CLOUDINARY_CLOUD_NAME` ✓ |
| `process.env.CLOUDINARY_API_KEY` | `CLOUD_API_KEY` ❌ | `CLOUDINARY_API_KEY` ✓ |
| `process.env.CLOUDINARY_API_SECRET` | `CLOUD_API_SECRET` ❌ | `CLOUDINARY_API_SECRET` ✓ |

---

## Current render.yaml (BROKEN ❌)

```yaml
services:
  - type: web
    name: zarrin-blogs-backend
    runtime: node
    buildCommand: "cd Zarrin_server && npm install"
    startCommand: "cd Zarrin_server && npm start"
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: MONGO_URL              # ❌ WRONG
        scope: project
      - key: JWT_SECRET
        scope: project
      - key: CLOUD_NAME             # ❌ WRONG
        scope: project
      - key: CLOUD_API_KEY          # ❌ WRONG
        scope: project
      - key: CLOUD_API_SECRET       # ❌ WRONG
        scope: project
      - key: CORS_ORIGIN
        value: "https://zarrin-blogs-frontend.vercel.app"
    healthCheckPath: /health
```

---

## FIXED render.yaml (CORRECT ✓)

```yaml
services:
  - type: web
    name: zarrin-blogs-backend
    runtime: node
    buildCommand: "cd Zarrin_server && npm install"
    startCommand: "cd Zarrin_server && npm start"
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: MONGO_URI              # ✅ FIXED
        scope: project
      - key: JWT_SECRET
        scope: project
      - key: CLOUDINARY_CLOUD_NAME  # ✅ FIXED
        scope: project
      - key: CLOUDINARY_API_KEY     # ✅ FIXED
        scope: project
      - key: CLOUDINARY_API_SECRET  # ✅ FIXED
        scope: project
      - key: CORS_ORIGIN
        value: "https://zarrin-blogs-frontend.vercel.app"
    healthCheckPath: /health
```

---

## What Changed (Diff View)

```diff
      - key: MONGO_URL              # ❌
-     scope: project
-   - key: JWT_SECRET
+   - key: MONGO_URI                # ✅
      scope: project

      - key: JWT_SECRET
        scope: project
-     - key: CLOUD_NAME             # ❌
+     - key: CLOUDINARY_CLOUD_NAME  # ✅
        scope: project
-     - key: CLOUD_API_KEY          # ❌
+     - key: CLOUDINARY_API_KEY     # ✅
        scope: project
-     - key: CLOUD_API_SECRET       # ❌
+     - key: CLOUDINARY_API_SECRET  # ✅
        scope: project
```

---

## Evidence from Backend Code

### From `Zarrin_server/index.js` (line 28)
```javascript
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET', 'PORT'];
//                        ^^^^^^^^^ Not MONGO_URL!
```

### From `Zarrin_server/utils/cloudinary.js` (line 5)
```javascript
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
//                 ^^^^^^^^^^^^^^^^^^^^^           ^^^^^^^^^^^^^^^^^^^^         ^^^^^^^^^^^^^^^^^^^^^^^
//                 Not CLOUD_NAME!                 Not CLOUD_API_KEY!          Not CLOUD_API_SECRET!
```

---

## Why This Causes "API route not found"

```
Browser Request: POST /api/auth/login
         ↓
Frontend (working) ✓
     ↓
Gets API URL: https://zarrin-blogs-backend.onrender.com/api/auth/login ✓
     ↓
Backend (NOT working) ❌
     ↓
Backend starts, but MONGO_URI is undefined (because render.yaml says MONGO_URL)
     ↓
Database connection fails
     ↓
Login route handler runs but can't query database
     ↓
Returns error → Frontend sees 404 "API route not found"
```

---

## Action Items

### ✅ Step 1: On Render.com Dashboard
1. Click on your **zarrin-blogs-backend** service
2. Go to **Settings** → **Environment**
3. **Delete** these wrong variables:
   - `MONGO_URL`
   - `CLOUD_NAME`
   - `CLOUD_API_KEY`
   - `CLOUD_API_SECRET`

4. **Add** these correct variables (with the same project-scoped values):
   - `MONGO_URI`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

### ✅ Step 2: Redeploy
1. Click **Redeploy latest commit** button
2. Wait for deployment to complete
3. Check logs for: `✅ MongoDB now available` and `✅ Connected to MongoDB`

### ✅ Step 3: Test
Open browser or Postman and test:
```
POST https://zarrin-blogs-backend.onrender.com/api/auth/signup
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "TestPass123"
}
```

Expected response (201 Created):
```json
{
  "message": "Signup successful! OTP has been sent to your email...",
  "email": "test@example.com",
  "requiresVerification": true
}
```

If you get **404**, the environment variables still aren't set correctly.

---

## Verify the Fix

After deploying, check the backend logs on Render.com:
- ✅ `[✅ DOTENV] Environment variables loaded successfully`
- ✅ `[✅ ENV VALIDATION] All critical environment variables are present`
- ✅ `[DB] ✅ MongoDB now available`
- ✅ `[STARTUP] Server is running on port 10000`

If you see `❌ MONGO_URI not configured`, the environment variables still need to be fixed!

