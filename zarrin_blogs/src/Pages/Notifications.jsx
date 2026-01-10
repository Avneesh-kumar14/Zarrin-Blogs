import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, UserPlus, Bookmark, TrendingUp, Check, Settings, Bell } from 'lucide-react';
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

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8200/api';
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchNotifications();
    fetchStats();
  }, [filter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/notifications?filter=${filter}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const data = await response.json();
      setNotifications(data.notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setAlert({ type: 'error', message: 'Failed to load notifications' });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/notifications/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }

      const data = await response.json();
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/notifications/read-all`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to mark all as read');
      }

      setAlert({ type: 'success', message: 'All notifications marked as read' });
      fetchNotifications();
    } catch (error) {
      console.error('Error:', error);
      setAlert({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      const response = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to mark as read');
      }

      fetchNotifications();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const typeConfig = {
    like: {
      icon: Heart,
      color: 'text-red-500',
      bgColor: 'bg-red-100 dark:bg-red-900/20'
    },
    comment: {
      icon: MessageCircle,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    follow: {
      icon: UserPlus,
      color: 'text-purple-500',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20'
    },
    bookmark: {
      icon: Bookmark,
      color: 'text-orange-500',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20'
    },
    trending: {
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    }
  };

  const NotificationItem = ({ notification }) => {
    const config = typeConfig[notification.type] || typeConfig.like;
    const Icon = config.icon;

    return (
      <div 
        className={`flex gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
          notification.isRead 
            ? 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:shadow-md' 
            : 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800'
        }`}
        onClick={() => !notification.isRead && handleMarkAsRead(notification._id)}
      >
        {/* Icon */}
        <div className={`w-12 h-12 rounded-full ${config.bgColor} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-6 h-6 ${config.color}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {notification.sender && (
                  <>
                    <span className="font-bold">{notification.sender.name}</span>
                    <span className="text-gray-600 dark:text-gray-400"> {notification.title}</span>
                  </>
                )}
                {!notification.sender && <span>{notification.title}</span>}
                {notification.blog && (
                  <span className="font-semibold"> "{notification.blog.title}"</span>
                )}
              </p>
            </div>
            {!notification.isRead && (
              <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-1.5" />
            )}
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {notification.message}
          </p>

          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(notification.createdAt).toLocaleDateString()}
            </p>
            {notification.type === 'follow' && (
              <button className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-[#6366F1] to-[#EC4899] hover:from-[#5558E3] hover:to-[#E91E63] text-white rounded-lg transition-all">
                Follow Back
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-10 bg-gradient-to-b from-[#6366F1] to-[#EC4899] rounded-full" />
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Notifications</h1>
                {unreadCount > 0 && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={handleMarkAllRead}
              disabled={unreadCount === 0 || loading}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#6366F1] to-[#EC4899] hover:from-[#5558E3] hover:to-[#E91E63] text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="w-4 h-4" />
              {loading ? 'Loading...' : 'Mark all read'}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/10 border border-red-200 dark:border-red-800">
            <Heart className="w-6 h-6 text-red-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white text-center">{stats.likes}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 text-center">Total Likes</div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 border border-blue-200 dark:border-blue-800">
            <MessageCircle className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white text-center">{stats.comments}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 text-center">Comments</div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 border border-purple-200 dark:border-purple-800">
            <UserPlus className="w-6 h-6 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white text-center">{stats.followers}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 text-center">New Followers</div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/10 border border-orange-200 dark:border-orange-800">
            <Bookmark className="w-6 h-6 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white text-center">{stats.bookmarks}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 text-center">Bookmarks</div>
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
                  ? 'bg-gradient-to-r from-[#6366F1] to-[#EC4899] text-white'
                  : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'all' && unreadCount > 0 && (
                <span className="ml-2 inline-block w-5 h-5 rounded-full bg-white text-blue-600 text-xs font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {loading ? (
            <div className="p-12 text-center rounded-xl bg-gray-50 dark:bg-slate-800">
              <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-[#6366F1] rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading notifications...</p>
            </div>
          ) : notifications.length > 0 ? (
            notifications.map((notification) => (
              <NotificationItem key={notification._id} notification={notification} />
            ))
          ) : (
            <div className="p-12 text-center rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
              <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-slate-600" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">All caught up!</h3>
              <p className="text-gray-600 dark:text-gray-400">
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
