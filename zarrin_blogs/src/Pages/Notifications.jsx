import React, { useState, useEffect, useCallback } from 'react';
import { Heart, MessageCircle, UserPlus, Bookmark, TrendingUp, Check, Bell, Trash2, Sparkles, X } from 'lucide-react';
import Alert from '../Component/Common/Alert';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({ likes: 0, comments: 0, followers: 0, bookmarks: 0 });
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
      if (filter !== 'all') url += `?filter=${filter}`;
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(5000)
      });
      if (!response.ok) throw new Error('Failed to fetch notifications');
      const data = await response.json();
      if (Array.isArray(data)) setNotifications(data);
      else if (data.notifications) setNotifications(Array.isArray(data.notifications) ? data.notifications : []);
      else if (data.data) setNotifications(Array.isArray(data.data) ? data.data : []);
      else setNotifications([]);
      setAlert(null);
    } catch (error) {
      if (error.name !== 'AbortError') console.error('⚠️ Error fetching notifications:', error.message);
    } finally { setLoading(false); }
  }, [API_URL, token, filter]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/notifications/stats`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(5000)
      });
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      if (data.stats) setStats(data.stats);
      else if (data.likes !== undefined) setStats(data);
    } catch (error) {
      if (error.name !== 'AbortError') console.error('⚠️ Error fetching stats:', error.message);
    }
  }, [API_URL, token]);

  useEffect(() => {
    if (!token) { setAlert({ type: 'error', message: 'Please login to view notifications' }); return; }
    fetchNotifications();
    fetchStats();
    const interval = setInterval(() => { fetchNotifications(); fetchStats(); }, 5000);
    return () => clearInterval(interval);
  }, [filter, token, fetchNotifications, fetchStats]);

  const handleMarkAllRead = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/notifications/read-all`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(5000)
      });
      if (!response.ok) throw new Error('Failed to mark all as read');
      setAlert({ type: 'success', message: 'All notifications marked as read' });
      await fetchNotifications();
    } catch (error) {
      if (error.name !== 'AbortError') setAlert({ type: 'error', message: error.message });
    } finally { setLoading(false); }
  }, [API_URL, token, fetchNotifications]);

  const handleMarkAsRead = useCallback(async (notificationId) => {
    try {
      const response = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(5000)
      });
      if (!response.ok) throw new Error('Failed to mark as read');
      setNotifications(prev => prev.map(n => n._id === notificationId ? { ...n, isRead: true, readAt: new Date() } : n));
      setTimeout(() => fetchNotifications(), 500);
    } catch (error) {
      if (error.name !== 'AbortError') console.error('⚠️ Error marking as read:', error.message);
    }
  }, [API_URL, token, fetchNotifications]);

  const handleDeleteNotification = useCallback(async (notificationId) => {
    try {
      const response = await fetch(`${API_URL}/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(5000)
      });
      if (!response.ok) throw new Error('Failed to delete notification');
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
      setAlert({ type: 'success', message: 'Notification deleted' });
    } catch (error) {
      if (error.name !== 'AbortError') setAlert({ type: 'error', message: 'Failed to delete notification' });
    }
  }, [API_URL, token]);

  const handleFollowBack = useCallback(async (notificationId, followerId) => {
    try {
      const response = await fetch(`${API_URL}/users/${followerId}/follow`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(5000)
      });
      if (!response.ok) throw new Error('Failed to follow user');
      setAlert({ type: 'success', message: 'Following user!' });
      setTimeout(() => fetchNotifications(), 500);
    } catch (error) {
      if (error.name !== 'AbortError') setAlert({ type: 'error', message: 'Failed to follow user' });
    }
  }, [API_URL, token, fetchNotifications]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const typeConfig = {
    like:      { icon: Heart,         accent: 'var(--color-error)',     bg: 'var(--color-error-bg)',     label: 'liked' },
    comment:   { icon: MessageCircle, accent: 'var(--color-info)',      bg: 'var(--color-info-bg)',      label: 'commented' },
    follow:    { icon: UserPlus,      accent: 'var(--color-secondary)', bg: 'var(--color-success-bg)',   label: 'followed' },
    bookmark:  { icon: Bookmark,      accent: 'var(--color-warning)',   bg: 'var(--color-warning-bg)',   label: 'bookmarked' },
    trending:  { icon: TrendingUp,    accent: 'var(--color-success)',   bg: 'var(--color-success-bg)',   label: 'trending' },
  };

  const statCards = [
    { icon: Heart,         label: 'Total Likes',    value: stats.likes,     accent: 'var(--color-error)',     bg: 'var(--color-error-bg)',   border: 'rgba(204,46,46,0.2)'   },
    { icon: MessageCircle, label: 'Comments',       value: stats.comments,  accent: 'var(--color-info)',      bg: 'var(--color-info-bg)',    border: 'rgba(74,127,165,0.2)'  },
    { icon: UserPlus,      label: 'New Followers',  value: stats.followers, accent: 'var(--color-secondary)', bg: 'var(--color-success-bg)', border: 'rgba(30,138,86,0.2)'   },
    { icon: Bookmark,      label: 'Bookmarks',      value: stats.bookmarks, accent: 'var(--color-warning)',   bg: 'var(--color-warning-bg)', border: 'rgba(196,154,60,0.2)'  },
  ];

  const filters = ['all', 'unread', 'like', 'comment', 'follow'];

  const NotificationItem = ({ notification }) => {
    const config = typeConfig[notification.type] || typeConfig.like;
    const Icon = config.icon;
    const [hovered, setHovered] = useState(false);

    return (
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => !notification.isRead && handleMarkAsRead(notification._id)}
        style={{
          ...N.item,
          background: notification.isRead ? 'var(--color-surface-primary)' : 'var(--color-info-bg)',
          border: notification.isRead
            ? `1px solid var(--color-border-light)`
            : `1px solid rgba(74,127,165,0.25)`,
          boxShadow: hovered ? 'var(--card-shadow-hover)' : 'var(--card-shadow)',
          cursor: notification.isRead ? 'default' : 'pointer',
          transform: hovered ? 'translateY(-1px)' : 'none',
        }}
      >
        {/* Unread left bar */}
        {!notification.isRead && <div style={N.unreadBar} />}

        {/* Icon bubble */}
        <div style={{ ...N.iconBubble, background: config.bg }}>
          <Icon size={19} style={{ color: config.accent }} />
        </div>

        {/* Content */}
        <div style={N.itemContent}>
          <div style={N.itemTop}>
            <p style={N.itemTitle}>
              {notification.sender && (
                <><strong style={{ color: 'var(--color-text-primary)' }}>{notification.sender.name}</strong>
                <span style={{ color: 'var(--color-text-secondary)', fontWeight: 400 }}> {notification.title}</span></>
              )}
              {!notification.sender && <span>{notification.title}</span>}
              {notification.blog && (
                <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}> "{notification.blog.title}"</span>
              )}
            </p>
            <div style={N.itemActions}>
              {!notification.isRead && <div style={N.unreadDot} />}
              <button
                onClick={e => { e.stopPropagation(); handleDeleteNotification(notification._id); }}
                title="Delete"
                style={N.deleteBtn}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--color-error)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {notification.message && (
            <p style={N.itemMsg}>{notification.message}</p>
          )}

          <div style={N.itemFooter}>
            <span style={N.itemTime}>
              {new Date(notification.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
            {notification.type === 'follow' && notification.sender && (
              <button
                onClick={e => { e.stopPropagation(); handleFollowBack(notification._id, notification.sender._id); }}
                style={N.followBtn}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--color-primary-dark)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--color-primary)'}
              >
                <UserPlus size={11} />Follow Back
              </button>
            )}
            {!notification.isRead && (
              <button
                onClick={e => { e.stopPropagation(); handleMarkAsRead(notification._id); }}
                style={N.readBtn}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-primary)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-primary)'; }}
              >
                <Check size={11} />Mark read
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={N.root}>
      {/* Ambient orbs */}
      <div style={N.orb1} />
      <div style={N.orb2} />

      <div style={N.wrap}>

        {/* ── PAGE HEADER ── */}
        <div style={N.pageHeader}>
          <div>
            <div style={N.pageBadge}><Sparkles size={12} />Activity</div>
            <h1 style={N.pageTitle}>Notifications</h1>
            {unreadCount > 0
              ? <p style={N.pageSub}>You have <strong style={{ color: 'var(--color-primary)' }}>{unreadCount}</strong> unread notification{unreadCount !== 1 ? 's' : ''}</p>
              : <p style={N.pageSub}>You're all caught up — great job!</p>}
          </div>
          <button
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0 || loading}
            style={{ ...N.markAllBtn, opacity: (unreadCount === 0 || loading) ? 0.5 : 1, cursor: (unreadCount === 0 || loading) ? 'not-allowed' : 'pointer' }}
            onMouseEnter={e => { if (unreadCount > 0 && !loading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
          >
            <Check size={14} />{loading ? 'Loading…' : 'Mark all read'}
          </button>
        </div>

        {/* ── STAT CARDS ── */}
        <div style={N.statsGrid}>
          {statCards.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} style={{ ...N.statCard, background: s.bg, border: `1px solid ${s.border}` }}>
                <div style={{ ...N.statIconWrap, background: s.accent }}>
                  <Icon size={16} color="#fff" />
                </div>
                <p style={{ ...N.statVal, color: s.accent }}>{s.value}</p>
                <p style={N.statLabel}>{s.label}</p>
              </div>
            );
          })}
        </div>

        {/* ── ALERT ── */}
        {alert && (
          <div style={{ marginBottom: 20 }}>
            <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} duration={3000} />
          </div>
        )}

        {/* ── FILTER TABS ── */}
        <div style={N.filterRow}>
          {filters.map(tab => {
            const active = filter === tab;
            return (
              <button key={tab} onClick={() => setFilter(tab)}
                style={{
                  ...N.filterBtn,
                  background: active ? 'var(--color-primary)' : 'var(--color-surface-primary)',
                  color: active ? '#fff' : 'var(--color-text-secondary)',
                  border: active ? '1px solid var(--color-primary)' : '1px solid var(--color-border-default)',
                  boxShadow: active ? '0 4px 12px rgba(43,100,212,0.22)' : 'none',
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--color-neutral-100)'; e.currentTarget.style.borderColor = 'var(--color-border-dark)'; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'var(--color-surface-primary)'; e.currentTarget.style.borderColor = 'var(--color-border-default)'; } }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === 'all' && unreadCount > 0 && (
                  <span style={N.filterBadge}>{unreadCount}</span>
                )}
                {tab === 'unread' && unreadCount > 0 && (
                  <span style={{ ...N.filterBadge, background: active ? 'rgba(255,255,255,0.25)' : 'var(--color-primary)', color: '#fff' }}>{unreadCount}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── NOTIFICATIONS LIST ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {loading ? (
            <div style={N.emptyState}>
              <div style={N.spinner} />
              <p style={{ marginTop: 16, color: 'var(--color-text-secondary)', fontSize: 14 }}>Loading notifications…</p>
            </div>
          ) : notifications.length > 0 ? (
            notifications.map(n => <NotificationItem key={n._id} notification={n} />)
          ) : (
            <div style={N.emptyState}>
              <div style={N.emptyIcon}><Bell size={32} style={{ color: 'var(--color-text-muted)' }} /></div>
              <h3 style={N.emptyTitle}>All caught up!</h3>
              <p style={N.emptySub}>
                {filter === 'unread' ? 'You have no unread notifications.' : 'No notifications to show right now.'}
              </p>
            </div>
          )}
        </div>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=Outfit:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes znFadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes znSpin   { to { transform: rotate(360deg); } }
        @media (max-width: 680px) {
          .zn-stats { grid-template-columns: 1fr 1fr !important; }
          .zn-filters { flex-wrap: wrap !important; }
        }
        @media (max-width: 420px) {
          .zn-stats { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

/* ─────────────────────────────────────────
   All styles via CSS custom properties
───────────────────────────────────────── */
const N = {
  root: {
    fontFamily: "'Outfit', sans-serif",
    background: 'var(--color-neutral-50)',
    minHeight: '100vh',
    padding: '44px 22px 90px',
    position: 'relative',
    overflowX: 'hidden',
  },
  orb1: {
    position: 'fixed', borderRadius: '50%', filter: 'blur(100px)',
    pointerEvents: 'none', zIndex: 0,
    width: 500, height: 500, top: -140, left: -140,
    background: 'rgba(43,100,212,0.05)',
  },
  orb2: {
    position: 'fixed', borderRadius: '50%', filter: 'blur(90px)',
    pointerEvents: 'none', zIndex: 0,
    width: 400, height: 400, bottom: 0, right: -100,
    background: 'rgba(112,64,204,0.04)',
  },
  wrap: { maxWidth: 860, margin: '0 auto', position: 'relative', zIndex: 1 },

  /* Header */
  pageHeader: {
    display: 'flex', alignItems: 'flex-start',
    justifyContent: 'space-between', gap: 20,
    marginBottom: 32, flexWrap: 'wrap',
    animation: 'znFadeUp 0.28s ease both',
  },
  pageBadge: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: 'rgba(43,100,212,0.08)', border: '1px solid rgba(43,100,212,0.2)',
    color: 'var(--color-primary)', fontSize: 11, fontWeight: 600,
    letterSpacing: '0.07em', textTransform: 'uppercase',
    padding: '6px 14px', borderRadius: 100, marginBottom: 10,
  },
  pageTitle: {
    fontFamily: "'Playfair Display', serif", fontWeight: 800,
    fontSize: 'clamp(1.9rem,4vw,2.7rem)', lineHeight: 1.1,
    color: 'var(--color-text-primary)', marginBottom: 6,
  },
  pageSub: { fontSize: 14, color: 'var(--color-text-secondary)', fontWeight: 300 },
  markAllBtn: {
    display: 'inline-flex', alignItems: 'center', gap: 7,
    padding: '11px 22px', borderRadius: 10,
    background: 'var(--color-primary)',
    boxShadow: '0 4px 14px rgba(43,100,212,0.25)',
    color: '#fff', fontFamily: "'Outfit', sans-serif",
    fontSize: 13, fontWeight: 600, border: 'none',
    transition: 'all 0.2s', flexShrink: 0,
  },

  /* Stats */
  statsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 14, marginBottom: 28,
    animation: 'znFadeUp 0.32s ease both 0.05s',
  },
  statCard: {
    borderRadius: 16, padding: '20px 16px',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: 8,
    boxShadow: 'var(--card-shadow)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  statIconWrap: {
    width: 38, height: 38, borderRadius: 10,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  statVal: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '2rem', fontWeight: 800, lineHeight: 1,
  },
  statLabel: { fontSize: 12, color: 'var(--color-text-secondary)', fontWeight: 400 },

  /* Filter */
  filterRow: {
    display: 'flex', gap: 8, marginBottom: 20,
    flexWrap: 'wrap',
    animation: 'znFadeUp 0.34s ease both 0.08s',
  },
  filterBtn: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '9px 18px', borderRadius: 100,
    fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 600,
    cursor: 'pointer', transition: 'all 0.18s',
  },
  filterBadge: {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: 20, height: 20, borderRadius: '50%',
    background: 'rgba(255,255,255,0.25)', color: '#fff',
    fontSize: 10, fontWeight: 700,
  },

  /* Notification item */
  item: {
    display: 'flex', alignItems: 'flex-start', gap: 14,
    padding: '16px 18px', borderRadius: 16,
    transition: 'all 0.2s', position: 'relative',
    animation: 'znFadeUp 0.28s ease both',
    overflow: 'hidden',
  },
  unreadBar: {
    position: 'absolute', left: 0, top: 0, bottom: 0,
    width: 3, background: 'var(--color-primary)',
    borderRadius: '0 2px 2px 0',
  },
  iconBubble: {
    width: 44, height: 44, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  itemContent: { flex: 1, minWidth: 0 },
  itemTop: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 4 },
  itemTitle: { fontSize: 13, lineHeight: 1.55, color: 'var(--color-text-primary)', flex: 1 },
  itemActions: { display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 },
  unreadDot: {
    width: 8, height: 8, borderRadius: '50%',
    background: 'var(--color-primary)', flexShrink: 0,
  },
  deleteBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    color: 'var(--color-text-muted)', display: 'flex',
    alignItems: 'center', padding: 4, borderRadius: 6,
    transition: 'color 0.18s',
  },
  itemMsg: {
    fontSize: 12, color: 'var(--color-text-secondary)',
    lineHeight: 1.6, marginBottom: 10,
  },
  itemFooter: { display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  itemTime: { fontSize: 11, color: 'var(--color-text-muted)' },
  followBtn: {
    display: 'inline-flex', alignItems: 'center', gap: 5,
    padding: '5px 14px', borderRadius: 8,
    background: 'var(--color-primary)', color: '#fff',
    fontFamily: "'Outfit', sans-serif", fontSize: 11, fontWeight: 600,
    border: 'none', cursor: 'pointer', transition: 'all 0.18s',
    boxShadow: '0 2px 8px rgba(43,100,212,0.22)',
  },
  readBtn: {
    display: 'inline-flex', alignItems: 'center', gap: 5,
    padding: '5px 12px', borderRadius: 8,
    background: 'transparent', color: 'var(--color-primary)',
    fontFamily: "'Outfit', sans-serif", fontSize: 11, fontWeight: 600,
    border: '1px solid var(--color-primary)',
    cursor: 'pointer', transition: 'all 0.18s',
  },

  /* Empty state */
  emptyState: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '60px 24px',
    background: 'var(--color-surface-primary)',
    border: '1px solid var(--color-border-light)',
    borderRadius: 20,
    boxShadow: 'var(--card-shadow)',
    textAlign: 'center',
  },
  emptyIcon: {
    width: 72, height: 72, borderRadius: '50%',
    background: 'var(--color-neutral-100)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: "'Playfair Display', serif", fontSize: '1.3rem',
    fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 6,
  },
  emptySub: { fontSize: 13, color: 'var(--color-text-secondary)' },

  /* Spinner */
  spinner: {
    width: 36, height: 36,
    border: '3px solid var(--color-border-default)',
    borderTopColor: 'var(--color-primary)',
    borderRadius: '50%',
    animation: 'znSpin 0.7s linear infinite',
  },
};

export default Notifications;