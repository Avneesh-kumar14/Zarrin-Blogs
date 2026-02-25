import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Mail, FileText, ArrowLeft, UserCheck, UserPlus, Calendar, BookOpen, PenLine } from 'lucide-react';
import Alert from '../Component/Common/Alert';
import { getApiUrl } from '../utils/apiConfig';

const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age >= 0 ? age : null;
};

const UserProfile = ({ currentUser, isAuthenticated, ownProfile = false }) => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userBlogs, setUserBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [alert, setAlert] = useState(null);

  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  const loggedInUser = (currentUser && Object.keys(currentUser).length > 0) ? currentUser : storedUser;
  const getUserId = (u) => u?._id || u?.id;

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      let profileUserId;
      if (ownProfile) {
        if (!loggedInUser) { setAlert({ type: 'error', message: 'Please log in to view profile' }); setLoading(false); return; }
        profileUserId = getUserId(loggedInUser);
      } else {
        if (!userId || userId === 'undefined' || userId === 'null') { setAlert({ type: 'error', message: 'Invalid user ID' }); setLoading(false); return; }
        profileUserId = userId;
      }
      const res = await fetch(getApiUrl(`/api/users/${profileUserId}`), { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch user');
      const userData = await res.json();
      if (!userData || !getUserId(userData)) throw new Error('No user data available');
      setUser(userData);
      setIsFollowing(userData.followers?.some(f => getUserId(f) === getUserId(loggedInUser)) || false);
      const blogsRes = await fetch(getApiUrl(`/api/users/${getUserId(userData)}/blogs`), { credentials: 'include' });
      if (blogsRes.ok) {
        const blogs = await blogsRes.json();
        setUserBlogs(Array.isArray(blogs) ? blogs : []);
      }
      setLoading(false);
    } catch (err) {
      setAlert({ type: 'error', message: err.message });
      setUser(null); setLoading(false);
    }
  }, [userId, ownProfile, loggedInUser]);

  useEffect(() => {
    if (ownProfile && !loggedInUser) return;
    if (!ownProfile && (!userId || userId === 'undefined' || userId === 'null')) return;
    fetchProfile();
  }, [userId, ownProfile, loggedInUser, fetchProfile]);

  const handleFollowToggle = async () => {
    if (!token) { setAlert({ type: 'warning', message: 'Please log in to follow users' }); return; }
    try {
      const method = isFollowing ? 'DELETE' : 'POST';
      const res = await fetch(getApiUrl(`/api/users/${user._id}/follow`), {
        method, headers: { Authorization: `Bearer ${token}` }, credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to update follow status');
      setIsFollowing(!isFollowing);
      setAlert({ type: 'success', message: isFollowing ? 'Unfollowed successfully' : 'Followed successfully' });
    } catch (err) {
      setAlert({ type: 'error', message: err.message });
    }
  };

  const isOwnProfile = !userId || loggedInUser?._id === user?._id;

  if (loading) {
    return (
      <div className="zup-loading">
        <div className="zup-spinner" />
        <p className="zup-loading-txt">Loading profile…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="zup-notfound">
        <div className="zup-nf-icon"><FileText size={40} color="#fff" /></div>
        <p className="zup-nf-txt">User not found</p>
        <button onClick={() => navigate('/dashboard')} className="zup-nf-btn">
          Go Back to Dashboard
        </button>
      </div>
    );
  }

  const blogAccents = [
    'var(--color-primary,#2B64D4)',
    'var(--color-error,#CC2E2E)',
    'var(--color-secondary,#1E8A56)',
    'var(--color-accent,#7040CC)'
  ];

  return (
    <div className="zup-root">

      {/* ── Hero Banner ── */}
      <div className="zup-hero-banner">
        <div className="zup-hero-grid" />
        <div className="zup-hero-orb zup-orb1" />
        <div className="zup-hero-orb zup-orb2" />

        {!isOwnProfile && (
          <div className="zup-hero-top">
            <button onClick={() => navigate(-1)} className="zup-back">
              <ArrowLeft size={16} /> Go Back
            </button>
          </div>
        )}
      </div>

      {/* ── Alert ── */}
      {alert && (
        <div className="zup-alert-wrap">
          <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} duration={5000} />
        </div>
      )}

      {/* ── Profile Card ── */}
      <div className="zup-card-wrap">
        <div className="zup-profile-card">
          <div className="zup-pc-accent" />

          <div className="zup-pc-layout">
            {/* Avatar col */}
            <div className="zup-avatar-col">
              <div className="zup-avatar-ring">
                <div className="zup-avatar">
                  {user.avatar
                    ? <img src={user.avatar} alt={user.name} className="zup-avatar-img" />
                    : <User size={52} color="#fff" />}
                </div>
                <div className="zup-online-dot" />
              </div>

              {!isOwnProfile && (
                <button onClick={handleFollowToggle} className={`zup-follow-btn ${isFollowing ? 'zup-follow-active' : ''}`}>
                  {isFollowing ? <><UserCheck size={16} />Following</> : <><UserPlus size={16} />Follow</>}
                </button>
              )}
            </div>

            {/* Info col */}
            <div className="zup-info-col">
              <div className="zup-name-section">
                <h1 className="zup-name">{user.name}</h1>
                <div className="zup-meta-row">
                  <div className="zup-meta-chip"><Mail size={14} />{user.email}</div>
                  {user.dateOfBirth && (
                    <div className="zup-meta-chip">
                      <Calendar size={14} />Age {calculateAge(user.dateOfBirth)}
                    </div>
                  )}
                </div>
                {user.bio && <p className="zup-bio">"{user.bio}"</p>}
              </div>

              {/* Stats grid */}
              <div className="zup-stats-row">
                <div className="zup-stat-card zup-stat-primary">
                  <div className="zup-stat-icon"><BookOpen size={18} color="#fff" /></div>
                  <div>
                    <p className="zup-stat-val">{user.totalBlogs || 0}</p>
                    <p className="zup-stat-lbl">Articles</p>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/followers/${user._id || user.id}`)}
                  className="zup-stat-card zup-stat-error"
                >
                  <div className="zup-stat-icon"><User size={18} color="#fff" /></div>
                  <div>
                    <p className="zup-stat-val">{user.followers?.length || 0}</p>
                    <p className="zup-stat-lbl">Followers</p>
                  </div>
                </button>

                <button
                  onClick={() => navigate(`/following/${user._id || user.id}`)}
                  className="zup-stat-card zup-stat-secondary"
                >
                  <div className="zup-stat-icon"><User size={18} color="#fff" /></div>
                  <div>
                    <p className="zup-stat-val">{user.following?.length || 0}</p>
                    <p className="zup-stat-lbl">Following</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Articles Section ── */}
      <div className="zup-articles-wrap">
        <div className="zup-articles-head">
          <div className="zup-articles-eyebrow">
            <PenLine size={16} />Published Articles
          </div>
          <h2 className="zup-articles-h2">
            {user.name.split(' ')[0]}'s Writing
          </h2>
          <p className="zup-articles-sub">
            {userBlogs.length} {userBlogs.length === 1 ? 'article' : 'articles'} published
          </p>
        </div>

        {userBlogs.length > 0 ? (
          <div className="zup-blogs-grid">
            {userBlogs.map((blog, idx) => {
              const accent = blogAccents[idx % 4];
              return (
                <article
                  key={blog._id}
                  onClick={() => navigate(`/blog/${blog._id}/preview`)}
                  className="zup-blog-card"
                  style={{ '--ba': accent }}
                >
                  <div className="zup-bc-top-bar" />

                  {blog.images?.[0] && (
                    <div className="zup-bc-img-wrap">
                      <img src={blog.images[0]} alt={blog.title} className="zup-bc-img" />
                      <div className="zup-bc-img-overlay" />
                    </div>
                  )}

                  <div className="zup-bc-body">
                    <div className="zup-bc-date">
                      <Calendar size={12} />
                      {new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                    <h3 className="zup-bc-title">{blog.title}</h3>
                    <p className="zup-bc-desc">{blog.short_description}</p>
                    <div className="zup-bc-footer">
                      <span className="zup-bc-read">Read Article →</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="zup-empty">
            <div className="zup-empty-icon"><FileText size={36} color="#fff" /></div>
            <h3 className="zup-empty-title">No articles yet</h3>
            <p className="zup-empty-desc">This author is working on their first piece!</p>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=Outfit:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin:0; padding:0; }

        .zup-root {
          font-family: 'Outfit', sans-serif;
          background: var(--color-surface-secondary,#F5F5F5);
          color: var(--color-text-primary,#111);
          min-height: 100vh;
        }

        @keyframes fadeUp { from{opacity:0;transform:translateY(22px);}to{opacity:1;transform:translateY(0);} }
        @keyframes drift {
          0%,100%{transform:translate(0,0) scale(1);}
          40%{transform:translate(20px,-28px) scale(1.06);}
          70%{transform:translate(-14px,18px) scale(0.96);}
        }
        @keyframes spin { to{transform:rotate(360deg);} }

        /* Loading */
        .zup-loading {
          min-height: 100vh; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 20px;
          background: var(--color-surface-primary,#fff);
        }
        .zup-spinner {
          width: 44px; height: 44px;
          border: 3px solid var(--color-border-light,#EEE);
          border-top-color: var(--color-primary,#2B64D4);
          border-radius: 50%; animation: spin 0.7s linear infinite;
        }
        .zup-loading-txt { font-size: 14px; color: var(--color-text-secondary,#4A4A48); }

        /* Not found */
        .zup-notfound {
          min-height: 100vh; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 20px; padding: 24px;
          background: var(--color-surface-primary,#fff);
        }
        .zup-nf-icon {
          width: 80px; height: 80px; border-radius: 20px;
          background: var(--color-error,#CC2E2E);
          display: flex; align-items: center; justify-content: center;
        }
        .zup-nf-txt { font-family: 'Playfair Display',serif; font-size: 1.5rem; font-weight: 700; color: var(--color-text-primary,#111); }
        .zup-nf-btn {
          padding: 13px 28px; border-radius: 10px;
          background: var(--color-primary,#2B64D4); color: #fff;
          border: none; font-family: 'Outfit',sans-serif; font-size: 14px; font-weight: 600;
          cursor: pointer; transition: transform 0.2s;
        }
        .zup-nf-btn:hover { transform: translateY(-2px); }

        /* Hero banner */
        .zup-hero-banner {
          position: relative; height: 240px; overflow: hidden;
          background: linear-gradient(148deg, var(--color-primary-dark,#1A3F8A) 0%, var(--color-primary,#2B64D4) 60%, #2468d4 100%);
        }
        .zup-hero-grid {
          position: absolute; inset: 0;
          background-image: linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),
            linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px);
          background-size: 52px 52px; pointer-events: none;
        }
        .zup-hero-orb { position: absolute; border-radius: 50%; filter: blur(70px); pointer-events: none; }
        .zup-orb1 { width: 300px; height: 300px; top: -80px; left: -60px; background: rgba(255,255,255,0.08); animation: drift 10s ease-in-out infinite; }
        .zup-orb2 { width: 250px; height: 250px; bottom: -40px; right: -40px; background: rgba(30,138,86,0.2); animation: drift 12s ease-in-out infinite reverse; }

        .zup-hero-top {
          position: relative; z-index: 3;
          max-width: 1200px; margin: 0 auto; padding: 24px;
        }
        .zup-back {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 20px; border-radius: 10px;
          background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2);
          color: rgba(255,255,255,0.9); backdrop-filter: blur(8px);
          font-family: 'Outfit',sans-serif; font-size: 13px; font-weight: 500;
          cursor: pointer; transition: all 0.15s;
        }
        .zup-back:hover { background: rgba(255,255,255,0.2); }

        .zup-alert-wrap {
          max-width: 1200px; margin: 0 auto; padding: 16px 24px 0;
        }

        /* Profile card */
        .zup-card-wrap {
          max-width: 1200px; margin: -72px auto 0; padding: 0 24px;
          position: relative; z-index: 10;
        }
        .zup-profile-card {
          background: var(--color-surface-primary,#fff);
          border-radius: 20px; overflow: hidden;
          box-shadow: var(--card-shadow-elevated);
          border: 1px solid var(--color-border-light,#EEE);
          position: relative;
          animation: fadeUp 0.6s ease both;
        }
        .zup-pc-accent {
          position: absolute; top: 0; left: 0; right: 0; height: 4px;
          background: linear-gradient(90deg, var(--color-primary,#2B64D4), var(--color-secondary,#1E8A56), var(--color-accent,#7040CC));
        }
        .zup-pc-layout {
          display: grid; grid-template-columns: 200px 1fr; gap: 40px;
          padding: 40px; align-items: start;
        }
        @media(max-width:700px){.zup-pc-layout{grid-template-columns:1fr;gap:28px;}}

        /* Avatar */
        .zup-avatar-col { display: flex; flex-direction: column; align-items: center; gap: 18px; }
        .zup-avatar-ring {
          position: relative;
          width: 120px; height: 120px;
        }
        .zup-avatar {
          width: 120px; height: 120px; border-radius: 20px;
          background: linear-gradient(135deg, var(--color-primary,#2B64D4), var(--color-secondary,#1E8A56));
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(43,100,212,0.25);
        }
        .zup-avatar-img { width: 100%; height: 100%; object-fit: cover; }
        .zup-online-dot {
          position: absolute; bottom: -2px; right: -2px;
          width: 18px; height: 18px; border-radius: 50%;
          background: var(--color-secondary,#1E8A56);
          border: 3px solid var(--color-surface-primary,#fff);
        }

        .zup-follow-btn {
          display: flex; align-items: center; gap: 7px;
          padding: 12px 24px; border-radius: 10px; width: 100%;
          justify-content: center;
          background: linear-gradient(135deg, var(--color-primary,#2B64D4), var(--color-primary-dark,#1A3F8A));
          color: #fff; border: none;
          font-family: 'Outfit',sans-serif; font-size: 14px; font-weight: 600;
          cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 16px rgba(43,100,212,0.25);
        }
        .zup-follow-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(43,100,212,0.35); }
        .zup-follow-active {
          background: var(--color-surface-secondary,#F5F5F5);
          color: var(--color-text-primary,#111);
          box-shadow: none; border: 1px solid var(--color-border-default,#E0E0E0);
        }

        /* Info */
        .zup-info-col { display: flex; flex-direction: column; gap: 28px; }
        .zup-name {
          font-family: 'Playfair Display',serif;
          font-size: clamp(1.8rem, 3.5vw, 2.8rem); font-weight: 800; line-height: 1.15;
          color: var(--color-text-primary,#111); margin-bottom: 14px;
        }
        .zup-meta-row { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 16px; }
        .zup-meta-chip {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 13px; color: var(--color-text-secondary,#4A4A48);
          background: var(--color-surface-secondary,#F5F5F5);
          border: 1px solid var(--color-border-light,#EEE);
          padding: 6px 14px; border-radius: 100px;
        }
        .zup-bio {
          font-size: 15px; font-style: italic; line-height: 1.65;
          color: var(--color-text-secondary,#4A4A48);
          padding-left: 16px;
          border-left: 3px solid var(--color-primary,#2B64D4);
          max-width: 560px;
        }

        /* Stats row */
        .zup-stats-row { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; }
        @media(max-width:560px){.zup-stats-row{grid-template-columns:1fr;}}

        .zup-stat-card {
          display: flex; align-items: center; gap: 14px;
          border-radius: 14px; padding: 20px 18px;
          border: none; cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          font-family: 'Outfit',sans-serif;
        }
        .zup-stat-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
        .zup-stat-primary { background: linear-gradient(135deg, var(--color-primary,#2B64D4), var(--color-primary-dark,#1A3F8A)); }
        .zup-stat-error { background: linear-gradient(135deg, var(--color-error,#CC2E2E), var(--color-error-dark,#8B1F1F)); }
        .zup-stat-secondary { background: linear-gradient(135deg, var(--color-secondary,#1E8A56), var(--color-secondary-dark,#156B44)); }
        .zup-stat-icon {
          width: 40px; height: 40px; border-radius: 10px;
          background: rgba(255,255,255,0.15);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .zup-stat-val {
          font-family: 'Playfair Display',serif;
          font-size: 2rem; font-weight: 800; color: #fff; line-height: 1;
        }
        .zup-stat-lbl { font-size: 11px; color: rgba(255,255,255,0.65); letter-spacing: 0.06em; margin-top: 3px; }

        /* Articles */
        .zup-articles-wrap {
          max-width: 1200px; margin: 0 auto; padding: 60px 24px 80px;
        }
        .zup-articles-head { margin-bottom: 40px; }
        .zup-articles-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 12px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--color-primary,#2B64D4); margin-bottom: 10px;
        }
        .zup-articles-h2 {
          font-family: 'Playfair Display',serif;
          font-size: clamp(1.8rem, 3.5vw, 2.6rem); font-weight: 800;
          color: var(--color-text-primary,#111); margin-bottom: 8px;
        }
        .zup-articles-sub { font-size: 14px; color: var(--color-text-secondary,#4A4A48); }

        /* Blog grid */
        .zup-blogs-grid {
          display: grid; grid-template-columns: repeat(3,1fr); gap: 24px;
        }
        @media(max-width:900px){.zup-blogs-grid{grid-template-columns:repeat(2,1fr);}}
        @media(max-width:560px){.zup-blogs-grid{grid-template-columns:1fr;}}

        .zup-blog-card {
          background: var(--color-surface-primary,#fff);
          border: 1px solid var(--color-border-light,#EEE);
          border-radius: 18px; overflow: hidden;
          box-shadow: var(--card-shadow);
          cursor: pointer;
          transition: transform 0.22s, box-shadow 0.22s;
          display: flex; flex-direction: column;
          position: relative;
        }
        .zup-blog-card:hover { transform: translateY(-5px); box-shadow: var(--card-shadow-hover); }

        .zup-bc-top-bar {
          height: 4px; background: var(--ba);
        }
        .zup-bc-img-wrap { position: relative; height: 180px; overflow: hidden; }
        .zup-bc-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
        .zup-blog-card:hover .zup-bc-img { transform: scale(1.07); }
        .zup-bc-img-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.18); opacity: 0; transition: opacity 0.25s; }
        .zup-blog-card:hover .zup-bc-img-overlay { opacity: 1; }

        .zup-bc-body { padding: 20px; flex: 1; display: flex; flex-direction: column; gap: 10px; }
        .zup-bc-date {
          display: flex; align-items: center; gap: 5px;
          font-size: 11px; color: var(--color-text-muted,#B0B0AD);
        }
        .zup-bc-title {
          font-family: 'Playfair Display',serif;
          font-size: 1.1rem; font-weight: 700; color: var(--color-text-primary,#111); line-height: 1.3;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        .zup-blog-card:hover .zup-bc-title { color: var(--ba); }
        .zup-bc-desc {
          font-size: 13px; color: var(--color-text-secondary,#4A4A48); line-height: 1.6; flex: 1;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        .zup-bc-footer { padding-top: 12px; border-top: 1px solid var(--color-border-light,#EEE); }
        .zup-bc-read { font-size: 13px; font-weight: 600; color: var(--ba); transition: letter-spacing 0.2s; }
        .zup-blog-card:hover .zup-bc-read { letter-spacing: 0.02em; }

        /* Empty state */
        .zup-empty {
          background: var(--color-surface-primary,#fff);
          border: 2px dashed var(--color-border-default,#E0E0E0);
          border-radius: 20px; padding: 80px 40px; text-align: center;
        }
        .zup-empty-icon {
          width: 80px; height: 80px; border-radius: 20px;
          background: var(--color-primary,#2B64D4);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 20px;
        }
        .zup-empty-title { font-family: 'Playfair Display',serif; font-size: 1.5rem; font-weight: 700; color: var(--color-text-primary,#111); margin-bottom: 8px; }
        .zup-empty-desc { font-size: 15px; color: var(--color-text-secondary,#4A4A48); }
      `}</style>
    </div>
  );
};

export default UserProfile;