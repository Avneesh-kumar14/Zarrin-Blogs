# Authentication Flow Implementation

## Overview
Complete authentication flow implemented with email verification via OTP for new users and direct login for existing verified users.

---

## Flow 1: New User Signup (Email Verification Required)

### Step 1: User Fills Signup Form
**Route:** `/signup`  
**Component:** `Signup.jsx`
- User enters: Name, Email, Password, Confirm Password
- Form validation ensures:
  - Password: 8+ chars with uppercase, lowercase, and number
  - Password and confirm password match
  - All fields required

### Step 2: Backend Processes Signup
**Endpoint:** `POST /api/auth/signup`
- Creates new user with:
  - `isEmailVerified: false` (not verified yet)
  - Generates 6-digit OTP
  - OTP expires in 10 minutes
- Sends OTP to user's email via Gmail SMTP
- Returns response with `requiresVerification: true`

### Step 3: Redirect to OTP Verification Page
**Route:** `/verify-otp`  
**Component:** `OTPVerify.jsx`
- User enters email (pre-filled from signup) and OTP
- Can resend OTP if not received (60s cooldown)
- Maximum 5 attempts before rate limiting

### Step 4: Backend Verifies OTP
**Endpoint:** `POST /api/auth/verify-otp`
- Validates OTP:
  - ✅ OTP is correct
  - ✅ OTP hasn't expired (10 minutes)
  - ✅ User account exists
- Marks email as verified: `isEmailVerified: true`
- Generates JWT token
- Sends welcome email
- Returns `token` and `user` object

### Step 5: Redirect to Dashboard
- Saves token and user to localStorage
- Automatically redirects to `/dashboard/analytics`
- User is now fully authenticated and verified

**Flow Summary:** Signup → OTP Verification Page → Enter OTP → Dashboard

---

## Flow 2: Existing Verified User Login

### Step 1: User Fills Login Form
**Route:** `/login`  
**Component:** `Loginpage.jsx`
- User enters: Email, Password
- Form validation ensures both fields are filled

### Step 2: Backend Processes Login
**Endpoint:** `POST /api/auth/login`
- Finds user by email
- Validates password with bcrypt
- **Check 1:** Is email verified?
  - ❌ **If NOT verified:** Return 403 status → Redirect to OTP verification
  - ✅ **If verified:** Continue to next step
- Generates JWT token
- Returns token and user object

### Step 3: Token Validation
**Endpoint:** `GET /api/auth/validate`
- Validates JWT token authenticity
- Returns user data if valid

### Step 4: Redirect to Dashboard
- Saves token and user to localStorage
- Automatically redirects to `/dashboard/analytics`
- User is logged in

**Flow Summary:** Login → Enter Credentials → Dashboard (if verified) OR OTP Page (if not verified)

---

## Routes Added/Modified

| Path | Component | Purpose |
|------|-----------|---------|
| `/signup` | `Signup.jsx` | New user registration |
| `/verify-otp` | `OTPVerify.jsx` | Email verification with OTP |
| `/login` | `Loginpage.jsx` | User login |
| `/dashboard/analytics` | `Dashboard.jsx` | Main dashboard (authenticated) |
| `/forgot-password` | `ForgotPassword.jsx` | Password recovery |
| `/reset-password/:token` | `ResetPassword.jsx` | Reset password with token |

---

## API Endpoints Used

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login existing user
- `POST /api/auth/verify-otp` - Verify email with OTP
- `POST /api/auth/resend-otp` - Resend OTP if not received
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/validate` - Validate JWT token

---

## User Data Storage

### localStorage Keys
```javascript
// After signup verification or login
localStorage.setItem('token', data.token);
localStorage.setItem('user', JSON.stringify(data.user));

// User object structure
{
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  isEmailVerified: true
}
```

---

## Email Notifications

### 1. OTP Email (Signup)
- Sent immediately after signup
- Contains 6-digit OTP
- Expires in 10 minutes
- Via Gmail SMTP

### 2. Welcome Email
- Sent after OTP verification
- Welcomes user to Zarrin Blogs
- Via Gmail SMTP

### 3. Other Notification Emails
- Follow notifications
- Comment notifications
- Like notifications
- All via Gmail SMTP

---

## Security Features Implemented

✅ **Email Verification**
- New users must verify email before accessing dashboard
- OTP sent via secure email (Gmail SMTP)
- OTP expires after 10 minutes

✅ **Password Security**
- Minimum 8 characters
- Must contain uppercase, lowercase, and number
- Hashed with bcryptjs before storage

✅ **JWT Token Authentication**
- Token-based authentication for API requests
- Token validated on protected routes
- Stored in localStorage

✅ **Rate Limiting**
- Login attempts limited
- OTP verification attempts limited
- Resend OTP requests limited (60s cooldown, 5 attempts max)

✅ **Error Handling**
- User-friendly error messages
- Prevents information disclosure
- Proper HTTP status codes (400, 403, 429, 500)

---

## Testing the Flow

### Test 1: New User Signup
```bash
1. Go to /signup
2. Fill form with name, email, password
3. Click "Create Account"
4. Should redirect to /verify-otp
5. Check email for 6-digit OTP
6. Enter OTP on verification page
7. Should redirect to /dashboard/analytics
```

### Test 2: Existing User Login
```bash
1. Go to /login
2. Enter verified user's email and password
3. Click "Sign In"
4. Should redirect directly to /dashboard/analytics
5. No OTP required (already verified)
```

### Test 3: Unverified User Login Attempt
```bash
1. Create new account (but don't verify OTP)
2. Go to /login
3. Enter new account credentials
4. Should show error message
5. Redirect to /verify-otp to complete verification
```

---

## Configuration

### Environment Variables (.env)
```
PORT=8200
MONGO_URL=your_mongodb_url
JWT_SECRET=your_jwt_secret
GMAIL_EMAIL=your_gmail@gmail.com
GMAIL_APP_PASSWORD=your_app_password
FRONTEND_URL=http://localhost:3000
```

### Gmail Setup
1. Enable 2-Factor Authentication on Gmail account
2. Generate App Password (not regular password)
3. Use App Password in GMAIL_APP_PASSWORD

---

## Files Modified/Created

### Frontend
- ✅ `zarrin_blogs/src/Component/Common/Signup.jsx` - Modified signup logic
- ✅ `zarrin_blogs/src/Component/Common/OTPVerify.jsx` - Modified OTP verification
- ✅ `zarrin_blogs/src/Component/Common/Loginpage.jsx` - Already correct
- ✅ `zarrin_blogs/src/App.js` - Added /verify-otp route

### Backend
- ✅ `Zarrin_server/routes/auth.js` - Already implements all endpoints correctly
- ✅ `Zarrin_server/services/emailService.js` - Modified to use Nodemailer with Gmail
- ✅ `Zarrin_server/connection.js` - Database connection setup

---

## Next Steps (Optional)

- [ ] Add email confirmation resend notification UI
- [ ] Add password strength indicator UI
- [ ] Add 2FA (Two-Factor Authentication) support
- [ ] Add social login (Google, GitHub)
- [ ] Add email change verification flow
- [ ] Add account deletion feature

---

**Status:** ✅ Implementation Complete  
**Date:** December 23, 2025  
**Server Status:** Running on http://localhost:8200
