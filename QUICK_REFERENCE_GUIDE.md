# 🚀 Authentication System: Quick Reference Guide

## 📌 For Developers

### Authentication Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     USER AUTHENTICATION FLOW                 │
└─────────────────────────────────────────────────────────────┘

SIGNUP FLOW:
───────────
User enters: Name, Email, Password
      ↓
Frontend validates locally
      ↓
POST /api/auth/signup
      ↓ (50ms response)
Backend creates user + generates OTP
      ↓
Response: 201 Created ✅
      ↓
Frontend shows success message
      ↓
User redirected to /verify-otp
      ↓
Email sent in BACKGROUND (non-blocking)
      ↓
User enters 6-digit OTP
      ↓
POST /api/auth/verify-otp
      ↓ (50ms response)
Backend verifies OTP + marks email as verified
      ↓
Response: 200 OK + accessToken + refreshToken
      ↓
LocalStorage: token, refreshToken, user
      ↓
Redirected to /dashboard/analytics ✅


LOGIN FLOW:
──────────
User enters: Email, Password
      ↓
Frontend validates locally
      ↓
POST /api/auth/login
      ↓ (500ms response)
Backend finds user + compares password
      ↓
Check: Is email verified?
      ├─ No  → Response: 403 Forbidden
      │        (redirect to /verify-otp)
      └─ Yes → Response: 200 OK
              ↓
              LocalStorage: token, user
              ↓
              Redirect to /dashboard ✅


EMAIL VERIFICATION FLOW:
───────────────────────
POST /api/auth/signup
      ↓
User created in database
      ↓
OTP generated in database
      ↓
Response sent immediately (50ms)
      ↓
Email sent in BACKGROUND (fire-and-forget)
      ↓
If email fails, user can click "Resend OTP"
      ↓
POST /api/auth/resend-otp
      ↓
New OTP generated
      ↓
Response sent immediately
      ↓
Email sent in BACKGROUND again
```

---

## 🔑 Key Endpoints

### 1. Signup
```http
POST /api/auth/signup
Content-Type: application/json

Request:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "MyPassword123"
}

Response (201 Created):
{
  "success": true,
  "message": "Signup successful! OTP sent to email",
  "email": "john@example.com",
  "requiresVerification": true
}

Possible Errors:
- 400: User already exists
- 400: Invalid email format
- 400: Password too weak
- 500: Server error
```

### 2. Verify OTP
```http
POST /api/auth/verify-otp
Content-Type: application/json

Request:
{
  "email": "john@example.com",
  "otp": "123456"
}

Response (200 OK):
{
  "success": true,
  "message": "Email verified successfully!",
  "user": {
    "_id": "60d5ec49c1234567890abcde",
    "id": "60d5ec49c1234567890abcde",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "isEmailVerified": true,
    "avatar": ""
  },
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}

Possible Errors:
- 400: Email and OTP required
- 400: Invalid OTP
- 400: OTP expired
- 404: User not found
- 500: Server error
```

### 3. Login
```http
POST /api/auth/login
Content-Type: application/json

Request:
{
  "email": "john@example.com",
  "password": "MyPassword123"
}

Response (200 OK):
{
  "success": true,
  "message": "Login successful",
  "user": {
    "_id": "60d5ec49c1234567890abcde",
    "id": "60d5ec49c1234567890abcde",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "isEmailVerified": true,
    "avatar": ""
  },
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}

Possible Errors:
- 401: Invalid email or password
- 403: Email not verified (redirect to /verify-otp)
- 429: Too many login attempts
- 500: Server error
```

### 4. Resend OTP
```http
POST /api/auth/resend-otp
Content-Type: application/json

Request:
{
  "email": "john@example.com"
}

Response (200 OK):
{
  "success": true,
  "message": "New OTP sent to email. Valid for 10 minutes.",
  "email": "john@example.com"
}

Possible Errors:
- 400: Email required
- 400: Invalid email format
- 400: User not found
- 429: Too many requests
- 500: Server error
```

### 5. Validate Token
```http
GET /api/auth/validate
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

Response (200 OK):
{
  "success": true,
  "valid": true,
  "user": {
    "id": "60d5ec49c1234567890abcde",
    "_id": "60d5ec49c1234567890abcde",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "isEmailVerified": true,
    "avatar": ""
  }
}

Possible Errors:
- 401: Token invalid or expired
- 500: Server error
```

---

## 📦 Token Storage

### localStorage Keys
```javascript
// After successful signup verification or login
localStorage.setItem('token', accessToken);              // JWT token
localStorage.setItem('refreshToken', refreshToken);      // Refresh token
localStorage.setItem('user', JSON.stringify(user));      // User object
```

### Token Expiration
```javascript
- accessToken:  7 days
- refreshToken: 30 days
- OTP:          10 minutes
```

---

## ⚠️ Important Notes

### 1. **Non-Blocking Email**
- Emails are sent in background (fire-and-forget)
- Response is sent IMMEDIATELY after user is created
- If email fails, user can resend OTP
- Do NOT await sendOTPEmail() in endpoints

### 2. **Status Codes**
```
201 Created  → Signup successful (new resource)
200 OK      → Login, verify OTP, validate token
400 Bad     → Validation failed, invalid input
401 Unauth  → Invalid credentials
403 Forbid  → Email not verified
429 Too     → Rate limit exceeded
500 Error   → Server error
```

### 3. **Security**
- Passwords NEVER returned in responses
- Vague error messages ("Invalid email or password")
- Don't reveal if email exists in database
- Rate limiting: 10 attempts per 15 minutes per IP/email
- bcrypt hashing with salt factor 10

### 4. **Error Messages**
```javascript
// ✅ GOOD - Don't reveal if user exists
"Invalid email or password"

// ❌ BAD - Reveals user doesn't exist
"User not found"

// ✅ GOOD - Don't block emails
Return 201 immediately, send email in background

// ❌ BAD - Blocks if email fails
Return error if email send fails
```

---

## 🧪 Testing Checklist

### Test Signup
- [ ] Valid details → 201 Created
- [ ] User already exists → 400
- [ ] Invalid email → 400
- [ ] Weak password → 400
- [ ] Should NOT receive OTP (email fails) → Still 201
- [ ] Rate limit exceeded (11 tries) → 429

### Test Verify OTP
- [ ] Valid OTP → 200 OK + tokens
- [ ] Invalid OTP → 400
- [ ] Expired OTP → 400
- [ ] User not found → 404
- [ ] Rate limit exceeded → 429

### Test Login
- [ ] Valid credentials → 200 OK + token
- [ ] Invalid email → 401
- [ ] Invalid password → 401
- [ ] Email not verified → 403 + requiresVerification flag
- [ ] Rate limit exceeded → 429

---

## 🔧 Common Issues & Solutions

### Issue: "API route not found"
**Solution:** 
- Check REACT_APP_API_BASE_URL in .env
- Verify backend is running on Render
- Check routes are mounted: `app.use('/api/auth', authRoutes)`

### Issue: Loading spinner never stops
**Solution:**
- Check if error thrown in try block
- Verify finally block executes: `setLoading(false)`
- Check browser console for errors
- No missing return statements in error paths

### Issue: Email not received
**Solution:**
- Check Gmail SMTP credentials
- Check spam/junk folder
- Use "Resend OTP" button
- Check server logs for email errors

### Issue: Token not stored
**Solution:**
- Verify response includes token
- Check localStorage is enabled
- Verify JSON parsing: `JSON.stringify(user)`
- Check for typos in key names

### Issue: CORS errors
**Solution:**
- Verify `credentials: 'include'` in fetch
- Check CORS_ORIGIN environment variable
- Verify frontend URL is allowed in CORS

---

## 📝 Code Templates

### Backend Endpoint Template
```javascript
router.post('/endpoint-name', authLimiter, validateInput, async (req, res) => {
  try {
    // VALIDATION: Validate and normalize inputs
    const input = req.body.field.toLowerCase().trim();

    // DATABASE: Query or modify data
    const result = await Model.findOne({ field: input });

    // CHECK: Validate business logic
    if (!result) {
      return res.status(404).json({ success: false, message: 'Not found' });
    }

    // OPERATION: Perform the main operation
    result.field = newValue;
    await result.save();

    // RESPONSE: Return success with explicit status
    return res.status(200).json({
      success: true,
      message: 'Operation successful',
      data: result
    });

  } catch (err) {
    logger.error('Endpoint error', { error: err.message });
    return res.status(500).json({ 
      success: false,
      message: 'Server error'
    });
  }
});
```

### Frontend Hook Template
```javascript
const [state, setState] = useState(initialValue);
const [loading, setLoading] = useState(false);
const [alert, setAlert] = useState(null);

const handleAction = async (e) => {
  e.preventDefault();

  // VALIDATION: Check inputs BEFORE loading
  if (!input) {
    setAlert({ type: 'warning', message: 'Input required' });
    return;
  }

  // LOADING: Set after validation
  setLoading(true);

  try {
    // API CALL: Make request
    const res = await fetch(getApiUrl('/api/endpoint'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ input })
    });

    // RESPONSE: Parse response
    const data = await res.json();

    // ERROR HANDLING: Check for errors
    if (!res.ok) {
      throw new Error(data.message || 'Request failed');
    }

    // SUCCESS: Update state
    setState(data.result);
    setAlert({ type: 'success', message: 'Success!' });

  } catch (err) {
    // ERROR: Show error
    setAlert({ type: 'error', message: err.message });

  } finally {
    // CLEANUP: Always reset loading
    setLoading(false);
  }
};
```

---

## 📱 Frontend Integration

### Store Token After Login
```javascript
// After successful login
localStorage.setItem('token', data.token);
localStorage.setItem('refreshToken', data.refreshToken);
localStorage.setItem('user', JSON.stringify(data.user));

// In API requests
const token = localStorage.getItem('token');
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

### Redirect Based on Auth Status
```javascript
// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (!user.isEmailVerified) {
    return <Navigate to="/verify-otp" />;
  }

  return children;
};
```

---

## 🚀 Deployment Checklist

- [ ] Environment variables set on Render
- [ ] Verify MONGO_URI (not MONGO_URL)
- [ ] Verify CLOUDINARY_CLOUD_NAME, API_KEY, API_SECRET
- [ ] Frontend .env.production has correct API_BASE_URL
- [ ] Email service credentials work
- [ ] Rate limiting is enabled
- [ ] Error logging configured
- [ ] Test signup → verify → login flow
- [ ] Test from production frontend URL
- [ ] No console errors in production

---

## 📞 Support

For issues, check:
1. Error message in console (look for [SIGNUP], [LOGIN], [DB] prefixes)
2. Network tab to see actual API response
3. Render dashboard logs for backend errors
4. localStorage for stored values
5. .env variables are set correctly

---

**Last Updated:** February 25, 2026  
**Version:** 2.0 (Audited & Refactored)
