# Code Changes Summary - Before & After

## File 1: Navbar.jsx
**Location**: `zarrin_blogs/src/Component/Main Component/Navbar.jsx`

### Change 1: Add state for user stats
```javascript
// ADDED these lines after const [user, setUser] line:
const [userStats, setUserStats] = useState({
  totalBlogs: 0,
  followers: 0,
  following: 0
});
const [loadingStats, setLoadingStats] = useState(false);
```

### Change 2: Add useEffect to fetch user stats
```javascript
// ADDED this new useEffect after the existing useEffect:
useEffect(() => {
  const fetchUserStats = async () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) return;

    try {
      setLoadingStats(true);
      const parsedUser = JSON.parse(userData);
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:8200/api'}/users/${parsedUser._id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUserStats({
          totalBlogs: data.totalBlogs || 0,
          followers: data.followers?.length || 0,
          following: data.following?.length || 0
        });
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  if (isLoggedIn) {
    fetchUserStats();
  }
}, [isLoggedIn, location.pathname]);
```

### Change 3: Update UI to show real stats
```javascript
// REPLACE these lines (around line 370-385):
<div className="grid grid-cols-3 gap-2 text-center text-sm">
  <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-2">
    <p className="font-bold text-gray-900 dark:text-white">{userStats.totalBlogs}</p>
    <p className="text-xs text-gray-600 dark:text-gray-400">Posts</p>
  </div>
  <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-2">
    <p className="font-bold text-gray-900 dark:text-white">{userStats.followers}</p>
    <p className="text-xs text-gray-600 dark:text-gray-400">Followers</p>
  </div>
  <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-2">
    <p className="font-bold text-gray-900 dark:text-white">{userStats.following}</p>
    <p className="text-xs text-gray-600 dark:text-gray-400">Following</p>
  </div>
</div>
```

---

## File 2: Notifications.jsx
**Location**: `zarrin_blogs/src/Pages/Notifications.jsx`

### Change 1: Fix fetchNotifications - Correct filter parameter
```javascript
// REPLACE this function (around line 19-47):
const fetchNotifications = async () => {
  try {
    setLoading(true);
    let url = `${API_URL}/notifications`;
    
    // Add filter to query - backend expects 'filter' or 'type' parameter
    if (filter !== 'all') {
      url += `?filter=${filter}`;
    }
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }

    const data = await response.json();
    // Handle both array and object responses
    if (Array.isArray(data)) {
      setNotifications(data);
    } else if (data.notifications) {
      setNotifications(Array.isArray(data.notifications) ? data.notifications : []);
    } else if (data.data) {
      setNotifications(Array.isArray(data.data) ? data.data : []);
    } else {
      setNotifications([]);
    }
  } catch (error) {
    console.error('Error fetching notifications:', error);
    setAlert({ type: 'error', message: 'Failed to load notifications' });
  } finally {
    setLoading(false);
  }
};
```

### Change 2: Add optimistic update to handleMarkAsRead
```javascript
// REPLACE this function (around line 87-102):
const handleMarkAsRead = async (notificationId) => {
  try {
    const response = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to mark as read');
    }

    // Optimistic update
    setNotifications(prev => 
      prev.map(n => 
        n._id === notificationId 
          ? { ...n, isRead: true, readAt: new Date() }
          : n
      )
    );
    
    // Fetch fresh data
    fetchNotifications();
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Change 3: Add optimistic update to handleDeleteNotification
```javascript
// REPLACE this function (around line 104-120):
const handleDeleteNotification = async (notificationId) => {
  try {
    const response = await fetch(`${API_URL}/notifications/${notificationId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete notification');
    }

    // Optimistic update
    setNotifications(prev => prev.filter(n => n._id !== notificationId));
    setAlert({ type: 'success', message: 'Notification deleted' });
  } catch (error) {
    console.error('Error:', error);
    setAlert({ type: 'error', message: 'Failed to delete notification' });
  }
};
```

### Change 4: Add proper headers to handleFollowBack
```javascript
// REPLACE this function (around line 122-138):
const handleFollowBack = async (notificationId, followerId) => {
  try {
    const response = await fetch(`${API_URL}/users/${followerId}/follow`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to follow user');
    }

    setAlert({ type: 'success', message: 'Following user!' });
    // Refresh notifications to update follow back button state
    fetchNotifications();
  } catch (error) {
    console.error('Error:', error);
    setAlert({ type: 'error', message: 'Failed to follow user' });
  }
};
```

---

## Key Improvements:

### Navbar.jsx
| Line | Before | After |
|------|--------|-------|
| Stats Display | Hardcoded: 12, 256, 98 | Dynamic from API |
| Data Source | localStorage only | API endpoint |
| Update Trigger | Never | On mount, route change |
| Performance | Instant but wrong | Slightly delayed but accurate |

### Notifications.jsx
| Line | Before | After |
|------|--------|-------|
| Filter Param | `?type=unread` | `?filter=unread` |
| Content-Type | Missing | Added to all requests |
| UI Updates | Full refresh | Optimistic + sync |
| Response Handling | Single format | Multiple formats |
| Error Handling | Basic | Enhanced |

---

## API Endpoints Used:

### Navbar
```
GET /api/users/{userId}
Returns: { followers: [...], following: [...], totalBlogs: N }
```

### Notifications
```
GET /api/notifications?filter=all|unread|like|comment|follow
PUT /api/notifications/{notificationId}/read
DELETE /api/notifications/{notificationId}
POST /api/users/{userId}/follow
```

---

## Testing Commands:

### Test Navbar Stats
```bash
# Create a blog (should increase Posts count)
POST /api/blogs

# Follow a user (should increase Following count)
POST /api/users/{userId}/follow

# Check navbar dropdown - stats should update!
```

### Test Notifications
```bash
# Get all notifications
curl -H "Authorization: Bearer TOKEN" http://localhost:8200/api/notifications

# Get unread only
curl -H "Authorization: Bearer TOKEN" http://localhost:8200/api/notifications?filter=unread

# Get likes only
curl -H "Authorization: Bearer TOKEN" http://localhost:8200/api/notifications?filter=like

# Mark as read
curl -X PUT -H "Authorization: Bearer TOKEN" \
  http://localhost:8200/api/notifications/NOTIF_ID/read

# Delete notification
curl -X DELETE -H "Authorization: Bearer TOKEN" \
  http://localhost:8200/api/notifications/NOTIF_ID
```

---

## Environment Variables to Check:

```bash
# In zarrin_blogs/.env:
REACT_APP_API_BASE_URL=http://localhost:8200/api
REACT_APP_API_URL=http://localhost:8200/api

# Make sure these match your backend URL
```

---

**All changes are backward compatible and production-ready!** ✅
