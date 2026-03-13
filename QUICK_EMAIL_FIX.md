# 🚀 Quick Fix Checklist - Email Service

## ⚡ Immediate Action Required

### 1. Get Valid Gmail App Password
- [ ] Go to: https://myaccount.google.com/apppasswords
- [ ] Select Mail + Windows Computer (or your device)
- [ ] Copy the generated 16-char password (with spaces)
- [ ] Example: `abcd efgh ijkl mnop`

### 2. Update .env File
```bash
# Open: Zarrin_server/.env
# Find line 14:
GMAIL_APP_PASSWORD=fack hjhr jhts hwoa

# Replace with your Google-generated password:
GMAIL_APP_PASSWORD=abcd efgh ijkl mnop
```

### 3. Restart Server
```bash
# In terminal:
cd Zarrin_server
npm start
```

### 4. Check Server Startup Log
Look for this message:
```
[✅ EMAIL] Email service ready - Gmail SMTP connected
```

## ✅ Verification Tests

After restart, try signing up:
```
POST http://localhost:8200/api/auth/signup
Body:
{
  "name": "Test User",
  "email": "your-test@gmail.com",
  "password": "Test123!!!"
}
```

You should receive an OTP email within 1-2 seconds.

## 🎯 Root Cause Found

**Problem:** Invalid Gmail App Password in .env
**Location:** Zarrin_server/.env line 14
**Current Value:** `fack hjhr jhts hwoa` ❌ (Not a valid password)
**Fix:** Replace with real 16-character password from Google

## 📚 Full Details
See: `EMAIL_SERVICE_DIAGNOSIS.md`

