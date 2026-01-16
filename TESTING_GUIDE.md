# Quick Testing Guide - Photo Upload & Notifications System

## Prerequisites
- Backend running on `http://localhost:8200`
- Frontend running on `http://localhost:3000`
- Cloudinary credentials configured in backend (.env)
- User logged in with valid JWT token

---

## Phase 1: Photo Upload Testing

### Test 1.1 - Avatar Upload
**Steps:**
1. Navigate to Settings page (navbar → Settings)
2. Click on "Profile" tab
3. Click "Upload Photo" button
4. Select a JPG/PNG image (< 2MB)
5. Preview should appear
6. Click "Save Photo" button

**Expected Results:**
```
✓ File preview displays immediately
✓ Upload button appears after selection
✓ Success alert shows "Avatar updated successfully!"
✓ Avatar changes in navbar
✓ Avatar persists after page refresh
✓ Old avatar deleted from Cloudinary
```

**Error Cases:**
- Selecting file > 2MB: "File size must be less than 2MB"
- Selecting non-image: "Invalid file type"
- Network error: Specific error message shown

### Test 1.2 - Profile Information Save
**Steps:**
1. Still in Settings → Profile
2. Fill in:
   - First Name: John
   - Last Name: Doe
   - Bio: "I love blogging"
   - Website: https://example.com
   - Location: San Francisco
3. Click "Save Profile"

**Expected Results:**
```
✓ Success alert: "Profile saved successfully!"
✓ Data persists on page refresh
✓ FirstName/LastName combined in user name field
✓ Bio appears in user profile
```

---

## Phase 2: Settings & Preferences Testing

### Test 2.1 - Notification Preferences
**Steps:**
1. Go to Settings → Notifications tab
2. Toggle OFF: "Email when someone comments"
3. Toggle ON: "Email when someone likes my post"
4. Click "Save Notification Settings"

**Expected Results:**
```
✓ Success alert appears
✓ Preferences saved to database
✓ Future comments won't trigger emails (preference-based)
✓ Future likes will trigger emails (preference-based)
```

### Test 2.2 - Writing Preferences
**Steps:**
1. Still in Notifications tab
2. Uncheck "Allow comments on my posts"
3. Click "Save Preferences"

**Expected Results:**
```
✓ Setting persists
✓ When you create blog, comments should reflect this preference
```

### Test 2.3 - Password Change
**Steps:**
1. Go to Settings → Account tab
2. Fill in:
   - Current Password: [your current]
   - New Password: NewSecurePass123
   - Confirm Password: NewSecurePass123
3. Click "Update Password"

**Expected Results:**
```
✓ Success alert: "Password changed successfully!"
✓ Fields clear
✓ New password works on next login
✓ Old password no longer works
```

**Error Cases:**
- Wrong current password: "Current password is incorrect"
- Passwords don't match: "Passwords do not match!"
- Password < 8 chars: "Password must be at least 8 characters"

---

## Phase 3: Like Notification Testing

### Test 3.1 - Create Like & Check Notification
**Setup:**
- Have 2 user accounts ready (User A and User B)
- User A: Published blog post

**Steps:**
1. Login as User B
2. Find User A's blog post
3. Click "Like" button
4. Logout
5. Login as User A
6. Go to Notifications page

**Expected Results:**
```
✓ "Like" notification appears
✓ Shows: "[User B Name] liked your article"
✓ Blog title displayed: "on '[Blog Title]'"
✓ Like count increased in stats
✓ Unread dot appears (blue indicator)
✓ Timestamp shows (e.g., "2m ago")
```

### Test 3.2 - Like Filter
**Steps:**
1. In Notifications page
2. Click "Like" filter button

**Expected Results:**
```
✓ Only like notifications shown
✓ Other notification types hidden
✓ "All" tab badge still shows total unread count
```

### Test 3.3 - Mark As Read
**Steps:**
1. Back to Notifications
2. Click on unread like notification

**Expected Results:**
```
✓ Notification background changes to white
✓ Blue dot indicator disappears
✓ Unread count decreases
✓ isRead set to true in database
```

---

## Phase 4: Comment Notification Testing

### Test 4.1 - Create Comment & Check Notification
**Setup:**
- Same 2 users (User A has blog, User B will comment)

**Steps:**
1. Login as User B
2. Find User A's blog post
3. Scroll to comments section
4. Write comment: "Great post!"
5. Click "Post Comment"
6. Logout
7. Login as User A
8. Go to Notifications

**Expected Results:**
```
✓ "Comment" notification appears
✓ Shows: "[User B Name] commented on your article"
✓ Blog title displayed
✓ Comment preview shown (first ~50 chars)
✓ Comment count increased in stats
✓ Notification has comment type icon (speech bubble)
```

### Test 4.2 - Comment Filter
**Steps:**
1. Click "Comment" filter tab

**Expected Results:**
```
✓ Only comment notifications shown
✓ Like/Follow notifications hidden
✓ Filter persists until changed
```

---

## Phase 5: Follow Notification Testing

### Test 5.1 - Create Follow & Check Notification
**Setup:**
- Users A and B (different accounts)

**Steps:**
1. Login as User B
2. Find User A's profile
3. Click "Follow" button
4. Logout
5. Login as User A
6. Go to Notifications

**Expected Results:**
```
✓ "Follow" notification appears
✓ Shows: "[User B Name] started following you"
✓ Follow notification has person-plus icon
✓ Follow count increased in stats
✓ "Follow Back" button appears on notification
```

### Test 5.3 - Follow Back
**Steps:**
1. On the follow notification
2. Click "Follow Back" button

**Expected Results:**
```
✓ User A now follows User B
✓ Success alert: "Following user!"
✓ Notifications refresh
✓ Follow count increases
```

---

## Phase 6: Real-Time Updates Testing

### Test 6.1 - Auto-Refresh (5 Second Intervals)
**Steps:**
1. Open Notifications page in browser
2. In another browser tab/window:
   - Like a blog post as different user
3. Watch first tab

**Expected Results:**
```
✓ After ~5 seconds, new notification appears
✓ No manual refresh needed
✓ Unread count updates automatically
✓ Stats (likes count) updates
```

### Test 6.2 - Manual Refresh Button
**Steps:**
1. In Notifications page
2. Immediately like a blog as another user
3. Click the refresh button (circular arrow icon)

**Expected Results:**
```
✓ Button shows loading spinner
✓ After ~1 second, new notification appears
✓ Doesn't wait for 5-second auto-refresh
✓ Stats update immediately
```

### Test 6.3 - Mark All Read
**Steps:**
1. Have multiple unread notifications
2. Click "Mark all as read" button (in header)

**Expected Results:**
```
✓ All notifications turn white (isRead)
✓ Unread count becomes 0
✓ Blue dots disappear
✓ All updated in database
✓ Success alert shown
```

---

## Phase 7: Dashboard Analytics

### Test 7.1 - Stats Display
**Steps:**
1. Notifications page is open
2. Have various notification types

**Expected Results:**
```
✓ Card 1 (Likes): Shows correct count (red)
✓ Card 2 (Comments): Shows correct count (blue)
✓ Card 3 (Followers): Shows correct count (purple)
✓ Card 4 (Bookmarks): Shows correct count (orange)
✓ Stats match database counts
```

### Test 7.2 - Stats Update
**Steps:**
1. Create new like/comment/follow while on page

**Expected Results:**
```
✓ Stats update within 5 seconds
✓ Corresponding notification appears
✓ Card count increases by 1
```

---

## Phase 8: Pagination Testing

### Test 8.1 - Load More Notifications
**Setup:**
- Have 15+ notifications

**Steps:**
1. Notifications page loads (shows 10 by default)
2. Scroll to bottom
3. Click "Load More" button

**Expected Results:**
```
✓ Next 10 notifications load
✓ No page reload
✓ Smooth scrolling
✓ Button shows loading state while fetching
✓ Can continue loading more pages
```

---

## Phase 9: Filter Combinations Testing

### Test 9.1 - Filter Switching
**Steps:**
1. Click "Like" tab → shows only likes
2. Click "Comment" tab → shows only comments
3. Click "Follow" tab → shows only follows
4. Click "All" tab → shows all types

**Expected Results:**
```
✓ List properly filtered each time
✓ Unread count in "All" badge accurate
✓ Stats stay visible (not filtered)
✓ No data loss when switching
```

### Test 9.2 - Unread Filter
**Steps:**
1. Have mix of read and unread notifications
2. Click "Unread" tab

**Expected Results:**
```
✓ Only unread notifications shown
✓ Unread count displayed accurately
✓ Can mark as read to remove from list
```

---

## Phase 10: Error Handling

### Test 10.1 - Network Errors
**Steps:**
1. Stop backend server
2. Try to load Notifications
3. Try to like/follow

**Expected Results:**
```
✓ Clear error message displayed
✓ Specific error text (e.g., "Failed to fetch notifications")
✓ Retry possible after server restarts
✓ No infinite loading
```

### Test 10.2 - Unauthorized Access
**Steps:**
1. Clear JWT token from localStorage
2. Refresh Notifications page

**Expected Results:**
```
✓ Unauthorized error message
✓ Redirect to login or clear token
✓ Clear messaging to user
```

---

## Phase 11: Database Verification

### Test 11.1 - Verify User Settings Saved
**Command (MongoDB):**
```javascript
db.users.findOne({email: "user@example.com"})
// Check:
// - avatar: URL should be Cloudinary URL
// - firstName, lastName: Updated values
// - notificationPreferences: All settings
// - profileSettings: All settings
```

### Test 11.2 - Verify Notifications Created
**Command:**
```javascript
db.notifications.find({recipient: ObjectId("...")}).limit(10)
// Check:
// - type: "like", "comment", "follow"
// - isRead: true/false
// - sender: References correct user
// - title, message: Properly formatted
// - blog: References correct blog
```

---

## Performance Metrics

### Expected Performance
```
- Avatar upload: < 3 seconds
- Settings save: < 1 second
- Load Notifications: < 2 seconds
- Like creation: < 1 second
- Notification appears in feed: < 5 seconds (auto-refresh)
- Manual refresh: < 1 second
```

### Monitoring
- Browser DevTools → Network tab:
  - Check response times
  - Monitor payload sizes
  - Look for failed requests

---

## Troubleshooting

### Issue: Avatar not uploading
**Solution:**
1. Check Cloudinary credentials in .env
2. Check file size (< 2MB)
3. Check file type (JPG, PNG, GIF)
4. Check browser console for error message
5. Verify CORS is configured

### Issue: Notifications not appearing
**Solution:**
1. Check notification preferences aren't disabled
2. Verify database connection
3. Check backend logs for errors
4. Ensure like/comment/follow actually created
5. Try manual refresh button

### Issue: Settings not saving
**Solution:**
1. Check JWT token is valid
2. Verify user ID in request
3. Check backend validation
4. Monitor network request in DevTools
5. Check database for partial updates

### Issue: Photos not displaying
**Solution:**
1. Check Cloudinary URL format
2. Verify CORS allows Cloudinary
3. Check image wasn't deleted
4. Verify file exists in Cloudinary dashboard
5. Check browser console for security errors

---

## Sign-Off Checklist

After testing all phases:

- [ ] All avatar uploads work
- [ ] All profile settings save
- [ ] Like notifications appear in real-time
- [ ] Comment notifications appear in real-time
- [ ] Follow notifications appear in real-time
- [ ] Filters work correctly
- [ ] Stats update automatically
- [ ] Mark as read works
- [ ] Delete notification works
- [ ] Pagination works
- [ ] Auto-refresh works (5 seconds)
- [ ] Manual refresh works
- [ ] No console errors
- [ ] Responsive on mobile
- [ ] Dark mode works
- [ ] Error messages clear
- [ ] Performance acceptable
- [ ] Database consistent
- [ ] Settings persist after reload
- [ ] No security issues (JWT, CORS, etc.)

---

**Test Date:** ___________
**Tester:** ___________
**Status:** ✅ All Tests Passed / ❌ Issues Found

**Notes:**
```
[Add any issues or observations here]
```

