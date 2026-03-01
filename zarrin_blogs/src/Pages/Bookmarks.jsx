import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bookmark, ArrowRight, Trash2, Clock, BookmarkX, Sparkles,
  Search, Filter, Grid3X3, List, TrendingUp, Eye,
  BookOpen, Zap, Star, ChevronRight
} from 'lucide-react';
import Alert from '../Component/Common/Alert';
import { getApiUrl } from '../utils/apiConfig';

const Bookmarks = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [alert, setAlert] = useState(null);

  // ── NEW UI STATE ──
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [sortBy, setSortBy] = useState('newest');

  /* ── EXISTING FETCH — preserved exactly ── */
  const fetchBookmarks = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(getApiUrl('/api/bookmarks'), {
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include'
      });
      if (!res.ok) {
        if (res.status === 401) { navigate('/login'); return; }
        throw new Error('Failed to fetch bookmarks');
      }
      const data = await res.json();
      setBookmarks(Array.isArray(data) ? data : (data.bookmarks || []));
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to load bookmarks: ' + err.message });
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    fetchBookmarks();
  }, [isAuthenticated, navigate, fetchBookmarks]);

  /* ── EXISTING REMOVE — preserved exactly ── */
  const handleRemoveBookmark = async (blogId) => {
    setAlert({
      type: 'warning',
      message: 'Remove this bookmark? This action cannot be undone.',
      isConfirmation: true,
      onConfirm: async () => {
        try {
          setDeleting(blogId);
          const token = localStorage.getItem('token');
          const res = await fetch(getApiUrl(`/api/bookmarks/${blogId}`), {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
            credentials: 'include'
          });
          if (!res.ok) throw new Error('Failed to remove bookmark');
          setBookmarks(bookmarks.filter(b => b.blog._id !== blogId));
          setAlert({ type: 'success', message: 'Bookmark removed successfully!' });
        } catch (err) {
          setAlert({ type: 'error', message: 'Failed to remove bookmark: ' + err.message });
        } finally {
          setDeleting(null);
        }
      }
    });
  };

  const handleViewBlog = (blogId) => navigate(`/blog/${blogId}/preview`);

  /* ── DERIVED DATA ── */
  const filtered = bookmarks
    .filter(b => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        b.blog.title?.toLowerCase().includes(q) ||
        b.blog.author?.name?.toLowerCase().includes(q) ||
        b.blog.category?.name?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'az') return a.blog.title?.localeCompare(b.blog.title);
      return 0;
    });

  const categoryMap = bookmarks.reduce((acc, b) => {
    const cat = b.blog.category?.name || 'Uncategorized';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const tips = [
    { icon: BookOpen, title: 'Read Later', desc: 'Bookmark articles and come back to them whenever you have time.' },
    { icon: Zap, title: 'Stay Organised', desc: 'Your saved articles are always here — searchable and sorted your way.' },
    { icon: Star, title: 'Never Miss Out', desc: 'Save trending posts before they leave your feed forever.' },
  ];

  return (
    <div className="zbm-root">

      {/* ══ HERO ══ */}
      <section className="zbm-hero">
        <div className="zbm-hero-grid" />
        <div className="zbm-orb zbm-o1" />
        <div className="zbm-orb zbm-o2" />
        <div className="zbm-orb zbm-o3" />

        <div className="zbm-hero-inner">
          <div className="zbm-hero-left">
            <div className="zbm-eyebrow">
              <Sparkles size={13} /> Your Reading List
            </div>
            <h1 className="zbm-hero-h1">
              Saved <em>Stories</em>
            </h1>
            <p className="zbm-hero-sub">
              Keep your favourite articles handy for whenever you want to revisit them. Your personal library, always within reach.
            </p>

            {/* Stats row */}
            <div className="zbm-hero-stats">
              <div className="zbm-hs">
                <span className="zbm-hs-val">{bookmarks.length}</span>
                <span className="zbm-hs-lbl">Saved</span>
              </div>
              <div className="zbm-hs-div" />
              <div className="zbm-hs">
                <span className="zbm-hs-val">{Object.keys(categoryMap).length}</span>
                <span className="zbm-hs-lbl">Topics</span>
              </div>
              <div className="zbm-hs-div" />
              <div className="zbm-hs">
                <span className="zbm-hs-val">
                  {bookmarks.reduce((t, b) => t + (parseInt(b.blog.readingTime) || 5), 0)}m
                </span>
                <span className="zbm-hs-lbl">Total Reading</span>
              </div>
            </div>
          </div>

          {/* Right: icon block */}
          <div className="zbm-hero-right">
            <div className="zbm-hero-icon-card">
              <div className="zbm-hic-glow" />
              <div className="zbm-hic-inner">
                <Bookmark size={52} className="zbm-hic-icon" />
                <p className="zbm-hic-label">Reading List</p>
                <div className="zbm-hic-dots">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="zbm-hic-dot" style={{ animationDelay: `${i * 0.4}s` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="zbm-wave">
          <svg viewBox="0 0 1440 64" fill="none" preserveAspectRatio="none">
            <path d="M0 32 Q360 64 720 32 Q1080 0 1440 32 L1440 64 L0 64 Z" fill="var(--color-surface-secondary,#F5F5F5)" />
          </svg>
        </div>
      </section>

      {/* ══ MAIN CONTENT ══ */}
      <div className="zbm-main">
        <div className="zbm-main-inner">

          {/* Alert */}
          {alert && (
            <div className="zbm-alert-wrap">
              <Alert
                message={alert.message} type={alert.type}
                onClose={() => setAlert(null)}
                duration={alert.isConfirmation ? 0 : 5000}
                isConfirmation={alert.isConfirmation}
                onConfirm={alert.onConfirm}
                onCancel={() => setAlert(null)}
              />
            </div>
          )}

          {loading ? (
            /* ── LOADING ── */
            <div className="zbm-loading">
              <div className="zbm-spinner" />
              <p className="zbm-loading-txt">Loading your bookmarks…</p>
              {/* Skeleton cards */}
              <div className="zbm-skeleton-grid">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="zbm-sk-card">
                    <div className="zbm-sk-img" />
                    <div className="zbm-sk-body">
                      <div className="zbm-sk-line zbm-sk-short" />
                      <div className="zbm-sk-line" />
                      <div className="zbm-sk-line zbm-sk-med" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          ) : bookmarks.length > 0 ? (
            <div className="zbm-content">

              {/* ── TOOLBAR ── */}
              <div className="zbm-toolbar">
                <div className="zbm-toolbar-left">
                  {/* Search */}
                  <div className="zbm-search-wrap">
                    <Search size={15} className="zbm-search-icon" />
                    <input
                      type="text"
                      placeholder="Search saved articles…"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="zbm-search-input"
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} className="zbm-search-clear">×</button>
                    )}
                  </div>

                  {/* Sort */}
                  <div className="zbm-sort-wrap">
                    <Filter size={13} className="zbm-sort-icon" />
                    <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="zbm-sort-select">
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="az">A → Z</option>
                    </select>
                  </div>
                </div>

                <div className="zbm-toolbar-right">
                  {/* Count */}
                  <div className="zbm-count-pill">
                    <Bookmark size={13} />
                    {filtered.length} {filtered.length === 1 ? 'article' : 'articles'}
                  </div>

                  {/* View toggle */}
                  <div className="zbm-view-toggle">
                    <button onClick={() => setViewMode('grid')} className={`zbm-vt-btn ${viewMode === 'grid' ? 'zbm-vt-active' : ''}`}>
                      <Grid3X3 size={15} />
                    </button>
                    <button onClick={() => setViewMode('list')} className={`zbm-vt-btn ${viewMode === 'list' ? 'zbm-vt-active' : ''}`}>
                      <List size={15} />
                    </button>
                  </div>
                </div>
              </div>

              {/* ── CATEGORY CHIPS ── */}
              {Object.keys(categoryMap).length > 1 && (
                <div className="zbm-cats">
                  {Object.entries(categoryMap).map(([cat, count]) => (
                    <button key={cat} className="zbm-cat-chip"
                      onClick={() => setSearchQuery(cat)}>
                      {cat} <span className="zbm-cc-count">{count}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* ── GRID / LIST ── */}
              {filtered.length === 0 ? (
                <div className="zbm-no-results">
                  <Search size={40} className="zbm-nr-icon" />
                  <p className="zbm-nr-txt">No bookmarks match "<strong>{searchQuery}</strong>"</p>
                  <button onClick={() => setSearchQuery('')} className="zbm-nr-btn">Clear search</button>
                </div>
              ) : (
                <div className={viewMode === 'grid' ? 'zbm-grid' : 'zbm-list'}>
                  {filtered.map((bookmark, idx) => (
                    viewMode === 'grid'
                      ? <GridCard key={bookmark._id} bookmark={bookmark} idx={idx}
                          deleting={deleting} onView={handleViewBlog} onRemove={handleRemoveBookmark} />
                      : <ListCard key={bookmark._id} bookmark={bookmark}
                          deleting={deleting} onView={handleViewBlog} onRemove={handleRemoveBookmark} />
                  ))}
                </div>
              )}
            </div>

          ) : (
            /* ── EMPTY STATE ── */
            <div className="zbm-empty-outer">
              <div className="zbm-empty-card">
                <div className="zbm-ec-glow" />
                <BookmarkX size={56} className="zbm-ec-icon" />
                <h3 className="zbm-ec-title">No bookmarks yet</h3>
                <p className="zbm-ec-desc">
                  Start exploring blogs and bookmark your favourites to create your personal reading list
                </p>
                <button onClick={() => navigate('/blog')} className="zbm-ec-btn">
                  <Sparkles size={16} />Explore Blogs<ArrowRight size={15} />
                </button>
              </div>

              {/* Tips */}
              <div className="zbm-tips-grid">
                {tips.map((tip, i) => {
                  const Icon = tip.icon;
                  return (
                    <div key={i} className="zbm-tip-card">
                      <div className="zbm-tip-icon"><Icon size={18} color="#fff" /></div>
                      <h4 className="zbm-tip-title">{tip.title}</h4>
                      <p className="zbm-tip-desc">{tip.desc}</p>
                    </div>
                  );
                })}
              </div>

              <div className="zbm-explore-cta">
                <div className="zbm-xcta-g1" /><div className="zbm-xcta-g2" />
                <div className="zbm-xcta-inner">
                  <TrendingUp size={22} className="zbm-xcta-icon" />
                  <div>
                    <h3 className="zbm-xcta-title">Discover what's trending</h3>
                    <p className="zbm-xcta-desc">Browse the latest articles from writers around the world</p>
                  </div>
                  <button onClick={() => navigate('/blog')} className="zbm-xcta-btn">
                    Browse Articles <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=Outfit:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .zbm-root { font-family: 'Outfit', sans-serif; background: var(--color-surface-secondary,#F5F5F5); color: var(--color-text-primary,#111); min-height: 100vh; overflow-x: hidden; }

        @keyframes fadeUp { from{opacity:0;transform:translateY(22px);}to{opacity:1;transform:translateY(0);} }
        @keyframes drift { 0%,100%{transform:translate(0,0) scale(1);}40%{transform:translate(20px,-26px) scale(1.06);}70%{transform:translate(-14px,16px) scale(0.96);} }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.4;transform:scale(1.5);} }
        @keyframes shimmer { 0%{background-position:-400px 0;}100%{background-position:400px 0;} }
        @keyframes spin { to{transform:rotate(360deg);} }
        @keyframes float { 0%,100%{transform:translateY(0);}50%{transform:translateY(-10px);} }

        /* ── HERO ── */
        .zbm-hero { position:relative;overflow:hidden;background:linear-gradient(148deg,var(--color-primary-dark,#1A3F8A) 0%,var(--color-primary,#2B64D4) 55%,#2468d4 100%);padding:80px 24px 100px; }
        .zbm-hero-grid { position:absolute;inset:0;pointer-events:none;background-image:linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px);background-size:52px 52px; }
        .zbm-orb { position:absolute;border-radius:50%;filter:blur(80px);pointer-events:none; }
        .zbm-o1 { width:340px;height:340px;top:-80px;left:-60px;background:rgba(255,255,255,0.07);animation:drift 11s ease-in-out infinite; }
        .zbm-o2 { width:260px;height:260px;bottom:-20px;right:-50px;background:rgba(30,138,86,0.18);animation:drift 9s ease-in-out infinite reverse; }
        .zbm-o3 { width:180px;height:180px;top:40%;left:58%;background:rgba(112,64,204,0.12);animation:drift 13s ease-in-out infinite 2s; }

        .zbm-hero-inner { position:relative;z-index:2;max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1fr auto;gap:48px;align-items:center;animation:fadeUp 0.7s ease both; }
        @media(max-width:800px){.zbm-hero-inner{grid-template-columns:1fr;}.zbm-hero-right{display:none;}}

        .zbm-eyebrow { display:inline-flex;align-items:center;gap:7px;background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.22);color:rgba(255,255,255,0.9);backdrop-filter:blur(8px);font-size:11px;font-weight:600;letter-spacing:0.07em;text-transform:uppercase;padding:7px 16px;border-radius:100px;margin-bottom:22px; }
        .zbm-hero-h1 { font-family:'Playfair Display',serif;font-size:clamp(2.6rem,5.5vw,4.5rem);font-weight:800;line-height:1.1;color:#fff;margin-bottom:18px;text-shadow:0 4px 32px rgba(0,0,0,0.2); }
        .zbm-hero-h1 em { font-style:italic;color:rgba(255,255,255,0.7); }
        .zbm-hero-sub { font-size:16px;line-height:1.75;color:rgba(255,255,255,0.62);font-weight:300;max-width:480px;margin-bottom:32px; }

        .zbm-hero-stats { display:flex;align-items:center;gap:20px;flex-wrap:wrap; }
        .zbm-hs { display:flex;flex-direction:column;gap:3px; }
        .zbm-hs-val { font-family:'Playfair Display',serif;font-size:2rem;font-weight:800;color:#fff;line-height:1; }
        .zbm-hs-lbl { font-size:11px;color:rgba(255,255,255,0.5);letter-spacing:0.05em; }
        .zbm-hs-div { width:1px;height:44px;background:rgba(255,255,255,0.2); }

        /* Hero icon card */
        .zbm-hero-icon-card { position:relative;width:200px;height:200px; }
        .zbm-hic-glow { position:absolute;inset:-20px;background:rgba(255,255,255,0.06);border-radius:50%;filter:blur(30px);animation:drift 6s ease-in-out infinite; }
        .zbm-hic-inner { position:relative;width:100%;height:100%;border-radius:24px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);backdrop-filter:blur(12px);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;animation:float 4s ease-in-out infinite; }
        .zbm-hic-icon { color:rgba(255,255,255,0.85); }
        .zbm-hic-label { font-size:13px;font-weight:600;color:rgba(255,255,255,0.7);letter-spacing:0.05em; }
        .zbm-hic-dots { display:flex;gap:6px; }
        .zbm-hic-dot { width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,0.4);animation:pulse 2s ease-in-out infinite; }

        .zbm-wave { position:absolute;bottom:-1px;left:0;right:0;height:64px; }
        .zbm-wave svg { width:100%;height:100%; }

        /* ── MAIN ── */
        .zbm-main { background:var(--color-surface-secondary,#F5F5F5);padding:48px 24px 80px; }
        .zbm-main-inner { max-width:1200px;margin:0 auto; }

        .zbm-alert-wrap { margin-bottom:24px; }

        /* ── LOADING ── */
        .zbm-loading { text-align:center;padding:40px 0; }
        .zbm-spinner { width:44px;height:44px;border:3px solid rgba(43,100,212,0.15);border-top-color:var(--color-primary,#2B64D4);border-radius:50%;animation:spin 0.7s linear infinite;margin:0 auto 16px; }
        .zbm-loading-txt { font-size:15px;color:var(--color-text-secondary,#4A4A48);margin-bottom:32px; }
        .zbm-skeleton-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:24px; }
        @media(max-width:900px){.zbm-skeleton-grid{grid-template-columns:1fr;}}
        .zbm-sk-card { background:var(--color-surface-primary,#fff);border-radius:18px;overflow:hidden;border:1px solid var(--color-border-light,#EEE); }
        .zbm-sk-img { height:180px;background:linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%);background-size:400px 100%;animation:shimmer 1.4s infinite; }
        .zbm-sk-body { padding:20px;display:flex;flex-direction:column;gap:12px; }
        .zbm-sk-line { height:12px;border-radius:6px;background:linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%);background-size:400px 100%;animation:shimmer 1.4s infinite; }
        .zbm-sk-short { width:40%; }
        .zbm-sk-med { width:70%; }

        /* ── TOOLBAR ── */
        .zbm-toolbar { display:flex;align-items:center;justify-content:space-between;gap:14px;margin-bottom:20px;flex-wrap:wrap; }
        .zbm-toolbar-left { display:flex;gap:10px;flex-wrap:wrap;flex:1; }
        .zbm-toolbar-right { display:flex;align-items:center;gap:10px; }

        .zbm-search-wrap { position:relative;flex:1;min-width:220px;max-width:380px; }
        .zbm-search-icon { position:absolute;left:13px;top:50%;transform:translateY(-50%);color:var(--color-text-muted,#B0B0AD);pointer-events:none; }
        .zbm-search-input { width:100%;padding:10px 36px 10px 38px;background:var(--color-surface-primary,#fff);border:1.5px solid var(--color-border-default,#E0E0E0);border-radius:10px;font-family:'Outfit',sans-serif;font-size:13px;color:var(--color-text-primary,#111);outline:none;transition:border-color 0.2s,box-shadow 0.2s; }
        .zbm-search-input::placeholder{color:var(--color-text-muted,#B0B0AD);}
        .zbm-search-input:focus{border-color:var(--color-primary,#2B64D4);box-shadow:0 0 0 4px rgba(43,100,212,0.08);}
        .zbm-search-clear { position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;font-size:16px;color:var(--color-text-muted,#B0B0AD);cursor:pointer;padding:2px 6px;line-height:1; }

        .zbm-sort-wrap { position:relative;display:flex;align-items:center; }
        .zbm-sort-icon { position:absolute;left:11px;color:var(--color-text-muted,#B0B0AD);pointer-events:none;z-index:1; }
        .zbm-sort-select { padding:10px 14px 10px 30px;background:var(--color-surface-primary,#fff);border:1.5px solid var(--color-border-default,#E0E0E0);border-radius:10px;font-family:'Outfit',sans-serif;font-size:13px;color:var(--color-text-primary,#111);outline:none;cursor:pointer;appearance:none; }

        .zbm-count-pill { display:flex;align-items:center;gap:6px;padding:9px 14px;background:var(--color-surface-primary,#fff);border:1px solid var(--color-border-default,#E0E0E0);border-radius:10px;font-size:12px;font-weight:600;color:var(--color-text-secondary,#4A4A48);white-space:nowrap; }
        .zbm-view-toggle { display:flex;background:var(--color-surface-primary,#fff);border:1px solid var(--color-border-default,#E0E0E0);border-radius:10px;overflow:hidden; }
        .zbm-vt-btn { padding:9px 12px;border:none;background:transparent;cursor:pointer;color:var(--color-text-muted,#B0B0AD);transition:all 0.15s; }
        .zbm-vt-btn:hover{color:var(--color-primary,#2B64D4);}
        .zbm-vt-active { background:var(--color-primary,#2B64D4)!important;color:#fff!important; }

        /* Category chips */
        .zbm-cats { display:flex;gap:8px;flex-wrap:wrap;margin-bottom:24px; }
        .zbm-cat-chip { display:inline-flex;align-items:center;gap:5px;padding:6px 14px;background:var(--color-surface-primary,#fff);border:1px solid var(--color-border-default,#E0E0E0);border-radius:100px;font-size:12px;font-weight:500;color:var(--color-text-secondary,#4A4A48);cursor:pointer;transition:all 0.18s; }
        .zbm-cat-chip:hover{border-color:var(--color-primary,#2B64D4);color:var(--color-primary,#2B64D4);}
        .zbm-cc-count { background:var(--color-surface-secondary,#F5F5F5);border-radius:100px;padding:1px 7px;font-size:10px;font-weight:700; }

        /* No results */
        .zbm-no-results { text-align:center;padding:64px 24px; }
        .zbm-nr-icon { color:var(--color-border-default,#E0E0E0);margin:0 auto 16px;display:block; }
        .zbm-nr-txt { font-size:15px;color:var(--color-text-secondary,#4A4A48);margin-bottom:18px; }
        .zbm-nr-btn { padding:10px 22px;background:var(--color-primary,#2B64D4);color:#fff;border:none;border-radius:9px;font-family:'Outfit',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:transform 0.15s; }
        .zbm-nr-btn:hover{transform:translateY(-1px);}

        /* ── GRID VIEW ── */
        .zbm-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:20px; }
        @media(max-width:1000px){.zbm-grid{grid-template-columns:repeat(2,1fr);}}
        @media(max-width:600px){.zbm-grid{grid-template-columns:1fr;}}

        /* ── LIST VIEW ── */
        .zbm-list { display:flex;flex-direction:column;gap:14px; }

        /* ── EMPTY ── */
        .zbm-empty-outer { display:flex;flex-direction:column;gap:28px; }
        .zbm-empty-card { position:relative;text-align:center;background:var(--color-surface-primary,#fff);border:2px dashed var(--color-border-default,#E0E0E0);border-radius:22px;padding:64px 32px;overflow:hidden; }
        .zbm-ec-glow { position:absolute;width:300px;height:300px;border-radius:50%;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(43,100,212,0.04);filter:blur(60px);pointer-events:none; }
        .zbm-ec-icon { color:var(--color-border-default,#E0E0E0);margin:0 auto 20px;display:block;animation:float 4s ease-in-out infinite; }
        .zbm-ec-title { font-family:'Playfair Display',serif;font-size:2rem;font-weight:800;color:var(--color-text-primary,#111);margin-bottom:12px; }
        .zbm-ec-desc { font-size:15px;color:var(--color-text-secondary,#4A4A48);line-height:1.7;max-width:400px;margin:0 auto 28px; }
        .zbm-ec-btn { display:inline-flex;align-items:center;gap:9px;padding:14px 32px;background:linear-gradient(135deg,var(--color-primary,#2B64D4),var(--color-primary-dark,#1A3F8A));color:#fff;border:none;border-radius:10px;font-family:'Outfit',sans-serif;font-size:14px;font-weight:700;cursor:pointer;transition:transform 0.2s,box-shadow 0.2s;box-shadow:0 5px 20px rgba(43,100,212,0.28); }
        .zbm-ec-btn:hover{transform:translateY(-2px);box-shadow:0 10px 30px rgba(43,100,212,0.35);}

        .zbm-tips-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:16px; }
        @media(max-width:700px){.zbm-tips-grid{grid-template-columns:1fr;}}
        .zbm-tip-card { background:var(--color-surface-primary,#fff);border:1px solid var(--color-border-light,#EEE);border-radius:16px;padding:24px 20px;display:flex;flex-direction:column;gap:10px; }
        .zbm-tip-icon { width:42px;height:42px;border-radius:11px;background:linear-gradient(135deg,var(--color-primary,#2B64D4),var(--color-primary-dark,#1A3F8A));display:flex;align-items:center;justify-content:center; }
        .zbm-tip-title { font-family:'Playfair Display',serif;font-size:1rem;font-weight:700;color:var(--color-text-primary,#111); }
        .zbm-tip-desc { font-size:13px;color:var(--color-text-secondary,#4A4A48);line-height:1.6; }

        .zbm-explore-cta { position:relative;overflow:hidden;background:linear-gradient(135deg,var(--color-primary,#2B64D4),var(--color-primary-dark,#1A3F8A));border-radius:18px;padding:32px 28px; }
        .zbm-xcta-g1{position:absolute;width:200px;height:200px;border-radius:50%;top:-60px;right:-40px;background:rgba(255,255,255,0.06);filter:blur(40px);pointer-events:none;}
        .zbm-xcta-g2{position:absolute;width:160px;height:160px;border-radius:50%;bottom:-40px;left:-30px;background:rgba(30,138,86,0.15);filter:blur(35px);pointer-events:none;}
        .zbm-xcta-inner { position:relative;z-index:1;display:flex;align-items:center;gap:20px;flex-wrap:wrap; }
        .zbm-xcta-icon { color:rgba(255,255,255,0.7);flex-shrink:0; }
        .zbm-xcta-title { font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:700;color:#fff;margin-bottom:4px; }
        .zbm-xcta-desc { font-size:13px;color:rgba(255,255,255,0.6); }
        .zbm-xcta-btn { margin-left:auto;display:inline-flex;align-items:center;gap:7px;padding:12px 22px;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.3);color:#fff;border-radius:10px;font-family:'Outfit',sans-serif;font-size:13px;font-weight:600;cursor:pointer;backdrop-filter:blur(8px);transition:all 0.2s;white-space:nowrap; }
        .zbm-xcta-btn:hover{background:rgba(255,255,255,0.25);}
        @media(max-width:600px){.zbm-xcta-btn{margin-left:0;width:100%;justify-content:center;}}

        /* ── RESPONSIVE ── */
        @media(max-width:768px){
          .zbm-hero{padding:60px 18px 90px;}
          .zbm-main{padding:36px 18px 60px;}
          .zbm-toolbar{flex-direction:column;align-items:stretch;}
          .zbm-toolbar-right{justify-content:space-between;}
          .zbm-search-wrap{max-width:100%;}
        }
        @media(max-width:480px){
          .zbm-hero-h1{font-size:2.2rem;}
          .zbm-hero-sub{font-size:14px;}
          .zbm-hs-val{font-size:1.6rem;}
        }
      `}</style>
    </div>
  );
};

/* ══ GRID CARD ══ */
const GridCard = ({ bookmark, idx, deleting, onView, onRemove }) => {
  const accents = [
    'var(--color-primary,#2B64D4)',
    'var(--color-secondary,#1E8A56)',
    'var(--color-accent,#7040CC)',
    'var(--color-warning,#C49A3C)',
  ];
  const accent = accents[idx % accents.length];

  return (
    <article className="zbm-gc" style={{ '--gca': accent, animationDelay: `${idx * 0.06}s` }}>
      <div className="zbm-gc-top-bar" />

      {/* Image */}
      <div className="zbm-gc-img-wrap">
        {bookmark.blog.image
          ? <img src={bookmark.blog.image} alt={bookmark.blog.title} className="zbm-gc-img" />
          : <div className="zbm-gc-no-img"><BookOpen size={32} color="rgba(255,255,255,0.4)" /></div>
        }
        <div className="zbm-gc-img-ov" />
        <div className="zbm-gc-saved-badge"><Bookmark size={11} className="zbm-gc-bk-fill" />Saved</div>
        {bookmark.blog.category?.name && (
          <div className="zbm-gc-cat-badge">{bookmark.blog.category.name}</div>
        )}
      </div>

      {/* Body */}
      <div className="zbm-gc-body">
        <div className="zbm-gc-meta">
          <span className="zbm-gc-meta-item"><Clock size={11} />{new Date(bookmark.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          <span className="zbm-gc-meta-item"><Eye size={11} />{bookmark.blog.readingTime || '5'} min</span>
        </div>

        <h3 className="zbm-gc-title">{bookmark.blog.title}</h3>
        <p className="zbm-gc-desc">{bookmark.blog.description || bookmark.blog.short_description || 'Click to read the full story…'}</p>

        {/* Author */}
        {bookmark.blog.author && (
          <div className="zbm-gc-author">
            <div className="zbm-gc-av">{bookmark.blog.author.name?.charAt(0).toUpperCase()}</div>
            <div>
              <p className="zbm-gc-aname">{bookmark.blog.author.name}</p>
              <p className="zbm-gc-arole">Author</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="zbm-gc-actions">
          <button onClick={() => onView(bookmark.blog._id)} className="zbm-gc-read">
            Read Article <ArrowRight size={14} />
          </button>
          <button
            onClick={() => onRemove(bookmark.blog._id)}
            disabled={deleting === bookmark.blog._id}
            className="zbm-gc-del"
            title="Remove bookmark">
            {deleting === bookmark.blog._id
              ? <div className="zbm-del-spin" />
              : <Trash2 size={15} />
            }
          </button>
        </div>
      </div>
    </article>
  );
};

/* ══ LIST CARD ══ */
const ListCard = ({ bookmark, deleting, onView, onRemove }) => (
  <article className="zbm-lc">
    {/* Image */}
    <div className="zbm-lc-img-wrap">
      {bookmark.blog.image
        ? <img src={bookmark.blog.image} alt={bookmark.blog.title} className="zbm-lc-img" />
        : <div className="zbm-lc-no-img"><BookOpen size={22} color="rgba(255,255,255,0.4)" /></div>
      }
    </div>

    {/* Content */}
    <div className="zbm-lc-body">
      <div className="zbm-lc-top">
        {bookmark.blog.category?.name && <span className="zbm-lc-cat">{bookmark.blog.category.name}</span>}
        <span className="zbm-lc-date"><Clock size={11} />{new Date(bookmark.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
      </div>
      <h3 className="zbm-lc-title">{bookmark.blog.title}</h3>
      <p className="zbm-lc-desc">{bookmark.blog.description || 'Click to read the full story…'}</p>
      {bookmark.blog.author && (
        <div className="zbm-lc-author">
          <div className="zbm-lc-av">{bookmark.blog.author.name?.charAt(0).toUpperCase()}</div>
          <span className="zbm-lc-aname">{bookmark.blog.author.name}</span>
          <span className="zbm-lc-sep">·</span>
          <span className="zbm-lc-read"><Eye size={11} />{bookmark.blog.readingTime || '5'} min read</span>
        </div>
      )}
    </div>

    {/* Actions */}
    <div className="zbm-lc-actions">
      <button onClick={() => onView(bookmark.blog._id)} className="zbm-lc-read">
        Read <ArrowRight size={13} />
      </button>
      <button onClick={() => onRemove(bookmark.blog._id)} disabled={deleting === bookmark.blog._id} className="zbm-lc-del">
        {deleting === bookmark.blog._id ? <div className="zbm-del-spin zbm-del-spin-sm" /> : <Trash2 size={14} />}
      </button>
    </div>

    <style>{`
      /* Grid card styles */
      .zbm-gc { background:var(--color-surface-primary,#fff);border:1px solid var(--color-border-light,#EEE);border-radius:18px;overflow:hidden;box-shadow:0 2px 10px rgba(26,24,22,0.06);transition:transform 0.22s,box-shadow 0.22s;position:relative;animation:fadeUp 0.5s ease both;display:flex;flex-direction:column; }
      .zbm-gc:hover { transform:translateY(-6px);box-shadow:0 16px 40px rgba(26,24,22,0.12); }
      .zbm-gc-top-bar { height:4px;background:var(--gca);flex-shrink:0; }
      .zbm-gc-img-wrap { position:relative;height:180px;overflow:hidden;background:linear-gradient(135deg,var(--gca),rgba(0,0,0,0.6));flex-shrink:0; }
      .zbm-gc-img { width:100%;height:100%;object-fit:cover;transition:transform 0.4s;display:block; }
      .zbm-gc:hover .zbm-gc-img { transform:scale(1.08); }
      .zbm-gc-no-img { width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,var(--gca),rgba(0,0,0,0.5)); }
      .zbm-gc-img-ov { position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.35),transparent 60%);pointer-events:none; }
      .zbm-gc-saved-badge { position:absolute;top:12px;right:12px;display:flex;align-items:center;gap:5px;background:var(--color-warning,#C49A3C);color:#fff;font-size:10px;font-weight:700;padding:5px 11px;border-radius:100px;z-index:2;box-shadow:0 2px 8px rgba(0,0,0,0.15); }
      .zbm-gc-bk-fill { fill:#fff; }
      .zbm-gc-cat-badge { position:absolute;bottom:12px;left:12px;background:var(--gca);color:#fff;font-size:10px;font-weight:700;padding:5px 11px;border-radius:100px;z-index:2;box-shadow:0 2px 8px rgba(0,0,0,0.15); }
      .zbm-gc-body { padding:18px;display:flex;flex-direction:column;gap:11px;flex:1; }
      .zbm-gc-meta { display:flex;gap:12px;flex-wrap:wrap; }
      .zbm-gc-meta-item { display:flex;align-items:center;gap:4px;font-size:11px;color:var(--color-text-muted,#B0B0AD); }
      .zbm-gc-title { font-family:'Playfair Display',serif;font-size:1.08rem;font-weight:700;color:var(--color-text-primary,#111);line-height:1.35;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;transition:color 0.2s;min-height:3rem; }
      .zbm-gc:hover .zbm-gc-title { color:var(--gca); }
      .zbm-gc-desc { font-size:13px;color:var(--color-text-secondary,#4A4A48);line-height:1.6;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:2.4rem; }
      .zbm-gc-author { display:flex;align-items:center;gap:9px;padding-top:12px;border-top:1px solid var(--color-border-light,#EEE);margin-top:auto; }
      .zbm-gc-av { width:34px;height:34px;border-radius:50%;background:var(--gca);color:#fff;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-family:'Playfair Display',serif;box-shadow:0 2px 8px rgba(0,0,0,0.1); }
      .zbm-gc-aname { font-size:12px;font-weight:600;color:var(--color-text-primary,#111); }
      .zbm-gc-arole { font-size:11px;color:var(--color-text-muted,#B0B0AD); }
      .zbm-gc-actions { display:flex;gap:9px; }
      .zbm-gc-read { flex:1;display:flex;align-items:center;justify-content:center;gap:7px;padding:11px;background:var(--gca);color:#fff;border:none;border-radius:9px;font-family:'Outfit',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:transform 0.15s,box-shadow 0.15s,opacity 0.15s;box-shadow:0 3px 12px rgba(0,0,0,0.15); }
      .zbm-gc-read:hover { transform:translateY(-2px);box-shadow:0 6px 20px rgba(0,0,0,0.2);opacity:0.95; }
      .zbm-gc-del { display:flex;align-items:center;justify-content:center;width:44px;height:44px;background:var(--color-error-bg,rgba(204,46,46,0.06));border:1px solid rgba(204,46,46,0.2);color:var(--color-error,#CC2E2E);border-radius:9px;cursor:pointer;transition:all 0.15s;flex-shrink:0;box-shadow:0 2px 8px rgba(0,0,0,0.05); }
      .zbm-gc-del:hover:not(:disabled) { background:var(--color-error,#CC2E2E);color:#fff;transform:translateY(-2px);box-shadow:0 4px 12px rgba(204,46,46,0.3); }
      .zbm-gc-del:disabled { opacity:0.5;cursor:not-allowed; }
      .zbm-del-spin { width:14px;height:14px;border:2px solid currentColor;border-top-color:transparent;border-radius:50%;animation:spin 0.6s linear infinite; }
      .zbm-del-spin-sm { width:12px;height:12px; }

      /* List card */
      .zbm-lc { display:flex;align-items:stretch;gap:16px;background:var(--color-surface-primary,#fff);border:1px solid var(--color-border-light,#EEE);border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(26,24,22,0.05);transition:transform 0.2s,box-shadow 0.2s; }
      .zbm-lc:hover { transform:translateY(-3px);box-shadow:0 10px 24px rgba(26,24,22,0.1); }
      @media(max-width:700px){.zbm-lc{flex-direction:column;align-items:stretch;gap:0;}}
      .zbm-lc-img-wrap { width:140px;height:100px;border-radius:0;overflow:hidden;flex-shrink:0;background:linear-gradient(135deg,var(--color-primary,#2B64D4),rgba(0,0,0,0.6)); }
      @media(max-width:700px){.zbm-lc-img-wrap{width:100%;height:140px;}}
      .zbm-lc-img { width:100%;height:100%;object-fit:cover;transition:transform 0.3s; }
      .zbm-lc:hover .zbm-lc-img { transform:scale(1.05); }
      .zbm-lc-no-img { width:100%;height:100%;display:flex;align-items:center;justify-content:center; }
      .zbm-lc-body { flex:1;min-width:0;display:flex;flex-direction:column;gap:8px;padding:16px 0;padding-right:16px; }
      @media(max-width:700px){.zbm-lc-body{padding:16px;}}
      .zbm-lc-top { display:flex;align-items:center;gap:8px;flex-wrap:wrap; }
      .zbm-lc-cat { font-size:11px;font-weight:700;background:rgba(43,100,212,0.08);color:var(--color-primary,#2B64D4);padding:4px 10px;border-radius:100px;white-space:nowrap; }
      .zbm-lc-date { display:flex;align-items:center;gap:4px;font-size:11px;color:var(--color-text-muted,#B0B0AD); }
      .zbm-lc-title { font-family:'Playfair Display',serif;font-size:1.05rem;font-weight:700;color:var(--color-text-primary,#111);line-height:1.35;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden; }
      .zbm-lc:hover .zbm-lc-title { color:var(--color-primary,#2B64D4); }
      .zbm-lc-desc { font-size:13px;color:var(--color-text-secondary,#4A4A48);line-height:1.6;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden; }
      .zbm-lc-author { display:flex;align-items:center;gap:7px;font-size:12px;margin-top:auto; }
      .zbm-lc-av { width:28px;height:28px;border-radius:50%;background:var(--color-secondary,#1E8A56);color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-family:'Playfair Display',serif; }
      .zbm-lc-aname { font-weight:600;color:var(--color-text-primary,#111);white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }
      .zbm-lc-sep { color:var(--color-border-default,#E0E0E0); }
      .zbm-lc-read { display:flex;align-items:center;gap:4px;font-size:11px;color:var(--color-text-muted,#B0B0AD); }
      .zbm-lc-actions { display:flex;gap:8px;flex-shrink:0;padding:16px 0;padding-right:2px;align-self:center; }
      @media(max-width:700px){.zbm-lc-actions{padding:16px;gap:12px;width:100%;}}
      .zbm-lc-read { display:flex;align-items:center;justify-content:center;gap:6px;padding:10px 16px;background:var(--color-primary,#2B64D4);color:#fff;border:none;border-radius:8px;font-family:'Outfit',sans-serif;font-size:12px;font-weight:600;cursor:pointer;transition:all 0.15s;white-space:nowrap;flex:1; }
      @media(max-width:700px){.zbm-lc-read{flex:auto;}}
      .zbm-lc-read:hover { background:var(--color-primary-dark,#1A3F8A);transform:translateY(-1px); }
      .zbm-lc-del { display:flex;align-items:center;justify-content:center;width:40px;height:40px;background:var(--color-error-bg,rgba(204,46,46,0.06));border:1px solid rgba(204,46,46,0.2);color:var(--color-error,#CC2E2E);border-radius:8px;cursor:pointer;transition:all 0.15s;flex-shrink:0; }
      @media(max-width:700px){.zbm-lc-del{width:100%;height:auto;padding:10px;}}
      .zbm-lc-del:hover:not(:disabled) { background:var(--color-error,#CC2E2E);color:#fff;transform:translateY(-1px); }
      .zbm-lc-del:disabled { opacity:0.5;cursor:not-allowed; }
    `}</style>
  </article>
);

export default Bookmarks;