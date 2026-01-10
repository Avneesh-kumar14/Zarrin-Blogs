import React, { useState } from 'react';
import { Heart, MessageCircle, UserPlus, Bookmark, TrendingUp, Check, Settings, Bell } from 'lucide-react';
import Alert from '../Component/Common/Alert';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "like",
      icon: Heart,
      color: "text-red-500",
      bgColor: "bg-red-100 dark:bg-red-900/20",
      user: {
        name: "Emily Parker",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
      },
      action: "liked your article",
      target: "The Future of Web Development",
      time: "5 minutes ago",
      unread: true
    },
    {
      id: 2,
      type: "comment",
      icon: MessageCircle,
      color: "text-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      user: {
        name: "David Kim",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
      },
      action: "commented on your article",
      target: "Building Scalable Applications",
      comment: "Great insights! This really helped me understand the concept better.",
      time: "2 hours ago",
      unread: true
    },
    {
      id: 3,
      type: "follow",
      icon: UserPlus,
      color: "text-purple-500",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
      user: {
        name: "Sarah Chen",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
      },
      action: "started following you",
      time: "5 hours ago",
      unread: true
    },
    {
      id: 4,
      type: "bookmark",
      icon: Bookmark,
      color: "text-orange-500",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
      user: {
        name: "Michael Brown",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
      },
      action: "bookmarked your article",
      target: "TypeScript Best Practices",
      time: "1 day ago",
      unread: false
    },
    {
      id: 5,
      type: "trending",
      icon: TrendingUp,
      color: "text-green-500",
      bgColor: "bg-green-100 dark:bg-green-900/20",
      action: "Your article is trending!",
      target: "Advanced React Patterns",
      description: "Your article has reached 1,000 views",
      time: "2 days ago",
      unread: false
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [alert, setAlert] = useState(null);

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
    setAlert({ type: 'success', message: 'All notifications marked as read' });
  };

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : filter === 'unread'
    ? notifications.filter(n => n.unread)
    : notifications.filter(n => n.type === filter);

  const NotificationItem = ({ notification }) => {
    const Icon = notification.icon;

    return (
      <div className={`flex gap-4 p-4 rounded-xl border transition-all ${
        notification.unread 
          ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800' 
          : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:shadow-md'
      }`}>
        {/* Icon */}
        <div className={`w-12 h-12 rounded-full ${notification.bgColor} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-6 h-6 ${notification.color}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {notification.user && (
                  <>
                    <span className="font-bold">{notification.user.name}</span>
                    <span className="text-gray-600 dark:text-gray-400"> {notification.action}</span>
                  </>
                )}
                {!notification.user && <span>{notification.action}</span>}
                {notification.target && (
                  <span className="font-semibold"> "{notification.target}"</span>
                )}
              </p>
            </div>
            {notification.unread && (
              <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-1.5" />
            )}
          </div>

          {notification.comment && (
            <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-slate-700 p-2 rounded mb-2 italic">
              "{notification.comment}"
            </p>
          )}

          {notification.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {notification.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 dark:text-gray-400">{notification.time}</p>
            {notification.type === "follow" && (
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
              disabled={unreadCount === 0}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#6366F1] to-[#EC4899] hover:from-[#5558E3] hover:to-[#E91E63] text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="w-4 h-4" />
              Mark all read
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/10 border border-red-200 dark:border-red-800">
            <Heart className="w-6 h-6 text-red-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white text-center">342</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 text-center">Total Likes</div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 border border-blue-200 dark:border-blue-800">
            <MessageCircle className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white text-center">128</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 text-center">Comments</div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 border border-purple-200 dark:border-purple-800">
            <UserPlus className="w-6 h-6 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white text-center">89</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 text-center">New Followers</div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/10 border border-orange-200 dark:border-orange-800">
            <Bookmark className="w-6 h-6 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white text-center">156</div>
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
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
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
