# Bug Fixes Summary

## Issues Fixed

### Issue 1: "Rate limit exceeded for ::1 on /validate" Error
**Problem:** When refreshing the page after following a user, the error "Rate limit exceeded for ::1 on /validate" appeared because the `/validate` endpoint was being called multiple times and hit the rate limit.

**Root Cause:** The `authLimiter` was applied globally to ALL `/api/auth/*` routes, including the `/validate` endpoint which is called by authenticated users, not just during authentication.

**Solution:**
1. Removed the global `authLimiter` from the `/api/auth` route in `index.js`
2. Applied the `authLimiter` only to sensitive authentication endpoints:
   - `/signup` - User registration
   - `/login` - User login
   - `/verify-otp` - OTP verification
   - `/resend-otp` - Resend OTP request
   - `/forgot-password` - Password reset request
3. Left `/validate` endpoint **without rate limiting** since it's called by authenticated users

**Files Modified:**
- `index.js` - Removed global rate limiter from `/api/auth` route
- `routes/auth.js` - Added `authLimiter` to specific sensitive endpoints only

---

### Issue 2: Follower Count Doesn't Update Without Page Refresh
**Problem:** After following/unfollowing a user, the follower count wouldn't update immediately. Users had to refresh the page to see the changes.

**Root Cause:** The Followers and Following pages were not re-fetching the user data after a follow/unfollow action. The UI only updated the local `followingMap` state but didn't refresh the actual user list data.

**Solution:**
1. Added `await fetchFollowers()` call after a successful follow/unfollow in `Followers.jsx`
2. Added `await fetchFollowing()` call after a successful follow/unfollow in `Following.jsx`
3. This ensures the component re-fetches the latest user data from the server after any follow action

**Files Modified:**
- `Pages/Followers.jsx` - Added `fetchFollowers()` call in `handleFollowToggle()`
- `Pages/Following.jsx` - Added `fetchFollowing()` call in `handleFollowToggle()`

---

### Issue 3: Repeated Validate Calls
**Problem:** The `AuthenticatedLayout.jsx` component was calling the `/validate` endpoint on every render, causing unnecessary API calls and hitting the rate limit.

**Root Cause:** The `useEffect` hook in `AuthenticatedLayout.jsx` had `[navigate]` as dependency, which could cause the effect to run multiple times.

**Solution:**
1. Added a `hasValidated` state flag to track if validation has already been done
2. Skip validation if `hasValidated` is already true
3. Set `hasValidated` to true after the first validation attempt (success or failure)
4. This ensures the validation only happens once per component mount

**Files Modified:**
- `Component/AuthenticatedLayout.jsx` - Added `hasValidated` state and early return in useEffect

---

## Testing the Fixes

1. **Test Rate Limit Fix:**
   - Log in and navigate to a user's followers page
   - Follow a user
   - Refresh the page immediately
   - The "Rate limit exceeded" error should NOT appear

2. **Test Follower Update:**
   - Go to a user's followers/following page
   - Click follow/unfollow button on any user
   - The list should update immediately without needing to refresh

3. **Test Validate Endpoint:**
   - Monitor the network tab in browser DevTools
   - Navigate through authenticated pages
   - Only one `/validate` call should occur on initial load
   - No additional validate calls should appear on page refresh or navigation

---

## Summary of Changes

| File | Change | Type |
|------|--------|------|
| `index.js` | Removed global `authLimiter` from `/api/auth` route | Backend Fix |
| `routes/auth.js` | Added `authLimiter` to specific sensitive endpoints | Backend Fix |
| `Pages/Followers.jsx` | Added `fetchFollowers()` call in follow handler | Frontend Fix |
| `Pages/Following.jsx` | Added `fetchFollowing()` call in follow handler | Frontend Fix |
| `Component/AuthenticatedLayout.jsx` | Added `hasValidated` state to prevent repeated calls | Frontend Fix |

---

## Additional Notes

- The rate limiter still applies to localhost bypass, so development is not affected
- All sensitive auth endpoints (signup, login, OTP, password reset) still have rate limiting protection
- The `/validate` endpoint is now free from rate limiting since it's used by authenticated users
- Follower/following lists now update in real-time after follow actions
