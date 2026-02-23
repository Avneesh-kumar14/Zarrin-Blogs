import React, { useState, useEffect, useCallback } from 'react';
import { Heart, MessageCircle, UserPlus, Bookmark, TrendingUp, Check, Bell } from 'lucide-react';
import Alert from '../Component/Common/Alert';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({
    likes: 0,
    comments: 0,
    followers: 0,
    bookmarks: 0
  });
  const [filter, setFilter] = useState('all');
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_BASE = process.env.REACT_APP_API_BASE_URL || 'https://zarrin-blogs-backend.onrender.com';
  const API_URL = API_BASE.includes('/api') ? API_BASE : `${API_BASE}/api`;
  const token = localStorage.getItem('token');

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      let url = `${API_URL}/notifications`;
      
      // Add filter to query - backend expects 'filter' or 'type' parameter
      if (filter !== 'all') {
        url += `?filter=${filter}`;
      }
      
      console.log('📡 Fetching notifications from:', url);
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });
      if (!response.ok) {
        console.error('❌ Response not OK:', response.status, response.statusText);
        throw new Error('Failed to fetch notifications');
      }

      const data = await response.json();
      console.log('✅ Notifications fetched:', data);
      
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
      setAlert(null); // Clear alerts on success
    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn('⏱️ Notifications fetch timeout');
      } else {
        console.error('⚠️ Error fetching notifications:', error.message);
      }
    } finally {
      setLoading(false);
    }
  }, [API_URL, token, filter]);

  const fetchStats = useCallback(async () => {
    try {
      const url = `${API_URL}/notifications/stats`;
      console.log('📊 Fetching stats from:', url);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });

      if (!response.ok) {
        console.error('❌ Stats response not OK:', response.status, response.statusText);
        throw new Error('Failed to fetch stats');
      }

      const data = await response.json();
      console.log('✅ Stats fetched:', data);
      
      // Handle different response formats
      if (data.stats) {
        setStats(data.stats);
      } else if (data.likes !== undefined) {
        setStats(data);
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn('⏱️ Stats fetch timeout');
      } else {
        console.error('⚠️ Error fetching stats:', error.message);
      }
    }
  }, [API_URL, token]);

  // Real-time notifications fetching (like Navbar pattern)
  useEffect(() => {
    if (!token) {
      setAlert({ type: 'error', message: 'Please login to view notifications' });
      return;
    }

    // Fetch immediately on load
    fetchNotifications();
    fetchStats();

    // Set up real-time interval (refresh every 5 seconds like navbar dropdown)
    const notifInterval = setInterval(() => {
      fetchNotifications();
      fetchStats();
    }, 5000);

    return () => clearInterval(notifInterval);
  }, [filter, token, fetchNotifications, fetchStats]);

  const handleMarkAllRead = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/notifications/read-all`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(5000)
      });

      if (!response.ok) {
        throw new Error('Failed to mark all as read');
      }

      setAlert({ type: 'success', message: 'All notifications marked as read' });
      // Refresh immediately after action
      await fetchNotifications();
    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn('⏱️ Mark all read timeout');
      } else {
        console.error('⚠️ Error:', error.message);
      }
      setAlert({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  }, [API_URL, token, fetchNotifications]);

  const handleMarkAsRead = useCallback(async (notificationId) => {
    try {
      const response = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(5000)
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
      
      // Fetch fresh data after a short delay
      setTimeout(() => fetchNotifications(), 500);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('⚠️ Error marking as read:', error.message);
      }
    }
  }, [API_URL, token, fetchNotifications]);

  const handleDeleteNotification = useCallback(async (notificationId) => {
    try {
      const response = await fetch(`${API_URL}/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(5000)
      });

      if (!response.ok) {
        throw new Error('Failed to delete notification');
      }

      // Optimistic update
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
      setAlert({ type: 'success', message: 'Notification deleted' });
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('⚠️ Error deleting notification:', error.message);
      }
      setAlert({ type: 'error', message: 'Failed to delete notification' });
    }
  }, [API_URL, token]);

  const handleFollowBack = useCallback(async (notificationId, followerId) => {
    try {
      const response = await fetch(`${API_URL}/users/${followerId}/follow`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(5000)
      });

      if (!response.ok) {
        throw new Error('Failed to follow user');
      }

      setAlert({ type: 'success', message: 'Following user!' });
      // Refresh notifications to update follow back button state
      setTimeout(() => fetchNotifications(), 500);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('⚠️ Error following user:', error.message);
      }
      setAlert({ type: 'error', message: 'Failed to follow user' });
    }
  }, [API_URL, token, fetchNotifications]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const typeConfig = {
    like: {
      icon: Heart,
      color: 'text-error',
      bgColor: 'bg-error-bg dark:bg-error-bg'
    },
    comment: {
      icon: MessageCircle,
      color: 'text-info',
      bgColor: 'bg-info-bg dark:bg-info-bg'
    },
    follow: {
      icon: UserPlus,
      color: 'text-secondary',
      bgColor: 'bg-secondary-bg dark:bg-secondary-bg'
    },
    bookmark: {
      icon: Bookmark,
      color: 'text-warning',
      bgColor: 'bg-warning-bg dark:bg-warning-bg'
    },
    trending: {
      icon: TrendingUp,
      color: 'text-success',
      bgColor: 'bg-success-bg dark:bg-success-bg'
    }
  };

  const NotificationItem = ({ notification }) => {
    const config = typeConfig[notification.type] || typeConfig.like;
    const Icon = config.icon;

    return (
      <div 
        className={`flex gap-4 p-4 rounded-xl border transition-all ${
          notification.isRead 
            ? 'bg-surface-primary dark:bg-surface-dark border-border-default hover:shadow-md' 
            : 'bg-info-bg dark:bg-info-bg border-info/30'
        }`}
      >
        {/* Icon */}
        <div className={`w-12 h-12 rounded-full ${config.bgColor} flex items-center justify-center flex-shrink-0 cursor-pointer`}
          onClick={() => !notification.isRead && handleMarkAsRead(notification._id)}>
          <Icon className={`w-6 h-6 ${config.color}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 cursor-pointer" onClick={() => !notification.isRead && handleMarkAsRead(notification._id)}>
              <p className="text-sm font-medium text-text-primary">
                {notification.sender && (
                  <>
                    <span className="font-bold">{notification.sender.name}</span>
                    <span className="text-text-secondary"> {notification.title}</span>
                  </>
                )}
                {!notification.sender && <span>{notification.title}</span>}
                {notification.blog && (
                  <span className="font-semibold"> "{notification.blog.title}"</span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {!notification.isRead && (
                <div className="w-2 h-2 rounded-full bg-info mt-1.5" />
              )}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteNotification(notification._id);
                }}
                className="text-text-muted hover:text-error transition-colors"
                title="Delete notification"
              >
                ×
              </button>
            </div>
          </div>

          <p className="text-sm text-text-secondary mb-2 cursor-pointer hover:underline"
            onClick={() => !notification.isRead && handleMarkAsRead(notification._id)}>
            {notification.message}
          </p>

          <div className="flex items-center justify-between">
            <p className="text-xs text-text-muted">
              {new Date(notification.createdAt).toLocaleDateString()}
            </p>
            {notification.type === 'follow' && notification.sender && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleFollowBack(notification._id, notification.sender._id);
                }}
                className="px-3 py-1 text-xs font-medium bg-primary hover:bg-primary-dark text-on-primary rounded-lg transition-all">
                Follow Back
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-surface-primary dark:bg-surface-dark py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-10 bg-primary rounded-full" />
              <div>
                <h1 className="text-4xl font-bold text-text-primary">Notifications</h1>
                {unreadCount > 0 && (
                  <p className="text-text-secondary text-sm mt-1">
                    You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={handleMarkAllRead}
              disabled={unreadCount === 0 || loading}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-on-primary rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="w-4 h-4" />
              {loading ? 'Loading...' : 'Mark all read'}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-error/10 dark:bg-error/10 border border-error/20 dark:border-error/30">
            <Heart className="w-6 h-6 text-error mx-auto mb-2" />
            <div className="text-2xl font-bold text-text-primary text-center">{stats.likes}</div>
            <div className="text-xs text-text-secondary text-center">Total Likes</div>
          </div>

          <div className="p-4 rounded-xl bg-info/10 dark:bg-info/10 border border-info/20 dark:border-info/30">
            <MessageCircle className="w-6 h-6 text-info mx-auto mb-2" />
            <div className="text-2xl font-bold text-text-primary text-center">{stats.comments}</div>
            <div className="text-xs text-text-secondary text-center">Comments</div>
          </div>

          <div className="p-4 rounded-xl bg-secondary/10 dark:bg-secondary/10 border border-secondary/20 dark:border-secondary/30">
            <UserPlus className="w-6 h-6 text-secondary mx-auto mb-2" />
            <div className="text-2xl font-bold text-text-primary text-center">{stats.followers}</div>
            <div className="text-xs text-text-secondary text-center">New Followers</div>
          </div>

          <div className="p-4 rounded-xl bg-warning/10 dark:bg-warning/10 border border-warning/20 dark:border-warning/30">
            <Bookmark className="w-6 h-6 text-warning mx-auto mb-2" />
            <div className="text-2xl font-bold text-text-primary text-center">{stats.bookmarks}</div>
            <div className="text-xs text-text-secondary text-center">Bookmarks</div>
          </div>
        </div>

        {/* Alert */}
        {alert && (
          <div className="mb-6">
            <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} duration={3000} />
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {['all', 'unread', 'like', 'comment', 'follow'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === tab
                  ? 'bg-primary hover:bg-primary-dark text-on-primary'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-text-secondary hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'all' && unreadCount > 0 && (
                <span className="ml-2  w-5 h-5 rounded-full bg-white text-info text-xs font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {loading ? (
            <div className="p-12 text-center rounded-xl bg-neutral-50 dark:bg-neutral-800">
              <div className="inline-block w-8 h-8 border-4 border-border-default border-t-primary rounded-full animate-spin"></div>
              <p className="mt-4 text-text-secondary">Loading notifications...</p>
            </div>
          ) : notifications.length > 0 ? (
            notifications.map((notification) => (
              <NotificationItem key={notification._id} notification={notification} />
            ))
          ) : (
            <div className="p-12 text-center rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-border-default">
              <Bell className="w-16 h-16 mx-auto mb-4 text-neutral-300 dark:text-neutral-600" />
              <h3 className="text-xl font-bold text-text-primary mb-2">All caught up!</h3>
              <p className="text-text-secondary">
                {filter === 'unread' ? 'You have no unread notifications' : 'No notifications to show'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
