# 🔍 Error Analysis & Testing Guide

## ❌ Errors You're Seeing (Expected Behavior)

### Error 1: `/api/auth/login` returns 403 Forbidden

**Reason:** Email is not verified
```
403 Forbidden means:
- User account EXISTS ✅
- Password is CORRECT ✅
- BUT email is NOT VERIFIED ❌
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Email not verified. Please verify your email first.",
  "requiresVerification": true,
  "email": "your@email.com"
}
```

**Frontend Behavior:**
- Login page shows warning: "Email not verified. Please check your email for OTP verification."
- Automatically redirects to `/verify-otp` after 2 seconds

---

### Error 2: `/api/auth/verify-otp` returns 400 Bad Request

**Reason:** OTP has expired (older than 10 minutes)
```
OTP expires after 10 minutes
If you generated OTP but wait > 10 minutes → EXPIRED
```

**Expected Response:**
```json
{
  "success": false,
  "message": "OTP expired. Please request a new one."
}
```

**Solution:** Click "Resend OTP" button to get a new one

---

## ✅ Correct Testing Flow

### Step 1: Signup (Fresh Account)

**Action:** Go to `/signup` page
```
Name:     John Doe
Email:    john@example.com
Password: MyPassword123
```

**Expected Result:**
```
✅ Response: 201 Created
✅ Message: "Account created! Check your email for OTP."
✅ Redirects to: /verify-otp
✅ Email sent in background (check email inbox/spam)
```

**What happens behind scenes:**
- User saved to MongoDB
- OTP generated (6 digits)
- OTP stored with expiry = current_time + 10 minutes
- Email sent (fire-and-forget, non-blocking)
- Response sent immediately

---

### Step 2: Verify Email (Within 10 Minutes)

**Action:** Go to `/verify-otp` page
```
Email: john@example.com
OTP:   [6-digit code from email]
```

**Expected Result:**
```
✅ Response: 200 OK
✅ Message: "Email verified successfully!"
✅ Redirects to: /dashboard/analytics
✅ localStorage has: token, refreshToken, user
```

**What happens behind scenes:**
- OTP matched ✅
- OTP not expired ✅ (within 10 minutes)
- User marked: isEmailVerified = true
- OTP cleared from database
- Welcome email sent in background
- JWT tokens generated and returned

**⏰ CRITICAL: This must happen within 10 minutes of signup!**

---

### Step 3: Login (After Email Verified)

**Action:** Go to `/login` page
```
Email:    john@example.com
Password: MyPassword123
```

**Expected Result:**
```
✅ Response: 200 OK
✅ Message: "Login successful"
✅ Redirects to: /dashboard/analytics
✅ localStorage has: token, user
```

**What happens behind scenes:**
- User found in database
- Email verified check: YES ✅
- Password compared and matches ✅
- JWT tokens generated
- Response sent with tokens

---

## 🚨 Common Testing Mistakes

### ❌ Mistake 1: Waiting Too Long Before Verifying OTP

```
Timeline:
09:00 AM - Click signup
09:01 AM - OTP sent
09:00 AM - Receive email (or email delay)
09:05 AM - User checks email
09:06 AM - User enters OTP... waiting for user to copy

09:11 AM - User finally enters OTP
          ❌ ERROR: OTP expired (> 10 minutes) ❌
```

**Fix:** Enter OTP immediately within 10 minutes, or click "Resend OTP"

---

### ❌ Mistake 2: Trying to Login Before Email Verification

```
Timeline:
09:00 AM - Sign up
09:01 AM - Get email with OTP
09:02 AM - Try to login (WITHOUT verifying email)
          ❌ ERROR: 403 Forbidden ❌
          (Must verify email first)
```

**Fix:** Complete `/verify-otp` flow first, THEN go to login

---

### ❌ Mistake 3: Entering Wrong OTP

```
Timeline:
09:00 AM - Sign up
09:01 AM - Receive OTP: 123456
09:02 AM - Enter wrong OTP: 654321
          ❌ ERROR: 400 Bad Request ❌
          Message: "Invalid OTP. Please try again."
```

**Fix:** Check email carefully, make sure you copied correct OTP

---

## 🧪 Step-by-Step Testing Guide

### Scenario 1: Fresh Account Registration

```
STEP 1: Open browser
        Go to http://localhost:3000/signup

STEP 2: Fill signup form
        Name:     Test User
        Email:    test@example.com
        Password: TestPass123
        
STEP 3: Click "Sign Up"
        Expected: Redirects to /verify-otp
                  Shows success message
                  
STEP 4: Check email
        ⏰ IMPORTANT: Do this within 5 minutes
        Look for email from zarrin@gmail.com
        Copy the 6-digit OTP code
        
STEP 5: On the /verify-otp page
        Email: test@example.com (should be pre-filled)
        OTP:   [paste 6-digit code]
        
STEP 6: Click "Verify OTP"
        Expected: Email verified successfully!
                  Redirects to dashboard
                  
STEP 7: Now try /login
        Email:    test@example.com
        Password: TestPass123
        Expected: Login successful
                  Redirects to dashboard
```

---

### Scenario 2: Expired OTP (Test Resend)

```
STEP 1-3: Follow steps 1-3 from Scenario 1

STEP 4: Wait > 10 minutes
        ⏰ Important: Wait 10 minutes before proceeding
        
STEP 5: Try to verify OTP
        Expected: Error 400
                  Message: "OTP expired. Please request a new one."
                  
STEP 6: Click "Resend OTP"
        Expected: New OTP sent to email
                  Countdown timer shows "Resend in 60s"
                  
STEP 7: Check email for NEW OTP

STEP 8: Enter new OTP
        Expected: Email verified successfully!
```

---

### Scenario 3: Wrong OTP (Test Error Handling)

```
STEP 1-4: Follow steps 1-4 from Scenario 1

STEP 5: On /verify-otp page
        Email: test@example.com
        OTP:   000000 (deliberately wrong)
        
STEP 6: Click "Verify OTP"
        Expected: Error 400
                  Message: "Invalid OTP. Please try again."
                  
STEP 7: Enter CORRECT OTP
        Expected: Email verified successfully!
```

---

## 📋 Verification Checklist

### Email Service Check
- [ ] Gmail account is configured
- [ ] App password is correct
- [ ] Emails are being sent (check spam folder)
- [ ] OTP email arrives within 1-2 minutes

### Signup Flow
- [ ] `/signup` form validates password
- [ ] Response 201 Created
- [ ] Redirects to `/verify-otp`
- [ ] Email received in inbox/spam
- [ ] OTP in email matches what was sent

### OTP Verification Flow
- [ ] Email pre-filled on `/verify-otp`
- [ ] 6-digit input only accepts numbers
- [ ] Valid OTP → 200 OK response
- [ ] Invalid OTP → 400 error
- [ ] Expired OTP → 400 error
- [ ] "Resend OTP" button sends new OTP
- [ ] 60-second cooldown works

### Login Flow
- [ ] After email verified, login works
- [ ] Valid credentials → 200 OK
- [ ] Invalid credentials → 401 Unauthorized
- [ ] Wrong password → 401 Unauthorized
- [ ] Before verification → 403 Forbidden
- [ ] Token stored in localStorage

---

## 🔧 Debugging: Check Local Storage

After successful login/verify, check localStorage:

**Open Browser DevTools (F12)**
1. Go to **Application** tab
2. Click **Local Storage**
3. Select `http://localhost:3000`
4. You should see:

```
Key               Value
─────────────────────────────────────────
token             eyJhbGciOiJIUzI1NiIs...
refreshToken      eyJhbGciOiJIUzI1NiIs...
user              {"_id":"...","name":"...","email":"..."}
```

If these are missing → authentication failed

---

## 🔍 Debugging: Check Network Tab

**Open Browser DevTools (F12)**
1. Go to **Network** tab
2. Perform login action
3. Look for call to `/api/auth/login`
4. Click on it

**Check Response Tab:**
```
Response:
{
  "success": true,
  "message": "Login successful",
  "user": {
    "_id": "...",
    "name": "...",
    "email": "..."
  },
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Check Status:** Should be `200 OK`

**If 403:** Shows in Network → Check Response → User not verified

---

## 📌 Key Points to Remember

| Status | Meaning | What to Do |
|--------|---------|-----------|
| **201** | Signup succeeded | Check email for OTP |
| **200** | OTP verified or Login worked | Check localStorage for token |
| **400** | Bad request (invalid OTP, expired OTP, weak password) | Fix the error, resend OTP if expired |
| **401** | Invalid credentials (wrong email/password) | Check credentials |
| **403** | Email not verified | Go to /verify-otp and verify email first |
| **429** | Too many attempts | Wait 15 minutes or try different IP |
| **500** | Server error | Check backend logs |

---

## ✨ Expected Timeline

```
T+0min    User clicks "Sign Up"
          → Account created
          → OTP generated (expires at T+10min)
          → Email sent
          → Redirects to /verify-otp

T+1-2min  User receives OTP email
          → Clicks email
          → Copies OTP

T+5min    User enters OTP and clicks "Verify"
          → Email marked verified ✅
          → Redirects to dashboard
          → Token stored in localStorage

T+6min    User clicks "Login"
          → Credentials checked
          → Email verified = YES ✅
          → Login accepted
          → New token issued

T+15min   If OTP not verified by now
          → OTP expires
          → User must click "Resend OTP"
          → New OTP sent
          → Verify again
```

---

## 🎯 What This Means

Your errors are **CORRECT and EXPECTED**:

1. **403 on login** = You haven't verified your email yet
   - Solution: Sign up → Check email → Enter OTP → Verify
   
2. **400 on verify-otp (OTP expired)** = You waited too long
   - Solution: Do it within 10 minutes or click "Resend OTP"

The system is working as designed! ✅

Just follow the flow exactly as outlined above and it will work perfectly.

---

## 🧪 Quick Test Command (Optional)

If you want to test directly with curl:

```bash
# 1. Signup
curl -X POST http://localhost:8200/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test123@example.com","password":"TestPass123"}'

# Response should show: 201 Created

# 2. Get OTP from email, then verify
curl -X POST http://localhost:8200/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test123@example.com","otp":"123456"}'

# Response should show: 200 OK + tokens

# 3. Now login
curl -X POST http://localhost:8200/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test123@example.com","password":"TestPass123"}'

# Response should show: 200 OK + tokens
```

---

**The errors you're seeing are proof the system is working correctly!**
