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
        b.blog.category?.[0]?.name?.toLowerCase().includes(q)
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

        /* ═══ NEW BEAUTIFUL GRID CARD STYLES ═══ */
        .zbm-gc-new {
          position: relative;
          background: var(--color-surface-primary, #fff);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: flex;
          flex-direction: column;
          animation: fadeUp 0.5s ease both;
          border: 1px solid rgba(0, 0, 0, 0.04);
        }

        .zbm-gc-new:hover {
          transform: translateY(-12px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
          border-color: var(--accent);
        }

        .zbm-gc-backdrop {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--accent-light), transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .zbm-gc-new:hover .zbm-gc-backdrop {
          opacity: 1;
        }

        .zbm-gc-img-container {
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
        }

        .zbm-gc-img-wrapper {
          position: relative;
          width: 100%;
          height: 200px;
          overflow: hidden;
          background: linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%);
        }

        .zbm-gc-img-new {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .zbm-gc-new:hover .zbm-gc-img-new {
          transform: scale(1.1) rotate(1deg);
        }

        .zbm-gc-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--accent), var(--accent-dark));
        }

        .zbm-gc-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 50%, rgba(0, 0, 0, 0.4) 100%);
        }

        .zbm-gc-saved-badge-new {
          position: absolute;
          top: 14px;
          right: 14px;
          display: flex;
          align-items: center;
          gap: 6px;
          background: linear-gradient(135deg, var(--color-warning, #C49A3C), #b8891e);
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          padding: 6px 14px;
          border-radius: 24px;
          z-index: 10;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(4px);
        }

        .zbm-gc-category-badge {
          position: absolute;
          bottom: 14px;
          left: 14px;
          background: rgba(255, 255, 255, 0.95);
          color: var(--accent);
          font-size: 11px;
          font-weight: 700;
          padding: 5px 12px;
          border-radius: 20px;
          z-index: 10;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          border: 1.5px solid var(--accent);
        }

        .zbm-gc-bookmark-icon {
          fill: currentColor;
        }

        .zbm-gc-content {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          flex: 1;
        }

        .zbm-gc-meta-new {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .zbm-gc-meta-item-new {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          color: var(--color-text-secondary, #4A4A48);
          font-weight: 500;
        }

        .zbm-gc-meta-item-new svg {
          color: var(--accent);
          flex-shrink: 0;
        }

        .zbm-gc-title-new {
          font-family: 'Playfair Display', serif;
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--color-text-primary, #111);
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          transition: color 0.3s ease;
          margin: 4px 0;
        }

        .zbm-gc-new:hover .zbm-gc-title-new {
          color: var(--accent);
        }

        .zbm-gc-desc-new {
          font-size: 14px;
          color: var(--color-text-secondary, #4A4A48);
          line-height: 1.65;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .zbm-gc-author-new {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-top: 14px;
          border-top: 1px solid rgba(0, 0, 0, 0.06);
          margin-top: auto;
        }

        .zbm-gc-avatar-new {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--accent), var(--accent-dark));
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-family: 'Playfair Display', serif;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .zbm-gc-author-info {
          flex: 1;
          min-width: 0;
        }

        .zbm-gc-author-name {
          font-size: 13px;
          font-weight: 600;
          color: var(--color-text-primary, #111);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .zbm-gc-actions-new {
          display: flex;
          gap: 10px;
          margin-top: 8px;
        }

        .zbm-gc-read-btn-new {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 12px;
          background: linear-gradient(135deg, var(--accent), var(--accent-dark));
          color: #fff;
          border: none;
          border-radius: 12px;
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .zbm-gc-read-btn-new:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }

        .zbm-gc-read-btn-new:active {
          transform: translateY(-1px);
        }

        .zbm-gc-delete-btn-new {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(204, 46, 46, 0.08);
          border: 1.5px solid rgba(204, 46, 46, 0.2);
          color: var(--color-error, #CC2E2E);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .zbm-gc-delete-btn-new:hover:not(:disabled) {
          background: var(--color-error, #CC2E2E);
          color: #fff;
          transform: translateY(-3px);
          box-shadow: 0 6px 16px rgba(204, 46, 46, 0.3);
        }

        .zbm-gc-delete-btn-new:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .zbm-spinner-mini {
          display: inline-block;
          width: 14px;
          height: 14px;
          border: 2px solid currentColor;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        /* ═══ NEW BEAUTIFUL LIST CARD STYLES ═══ */
        .zbm-lc-new {
          display: flex;
          align-items: stretch;
          gap: 0;
          background: var(--color-surface-primary, #fff);
          border: 1px solid rgba(0, 0, 0, 0.04);
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .zbm-lc-new:hover {
          transform: translateY(-8px);
          box-shadow: 0 16px 32px rgba(0, 0, 0, 0.12);
        }

        .zbm-lc-image-side {
          width: 160px;
          flex-shrink: 0;
          overflow: hidden;
        }

        .zbm-lc-img-wrapper-new {
          position: relative;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, var(--accent), var(--accent-dark));
          overflow: hidden;
        }

        .zbm-lc-img-new {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .zbm-lc-new:hover .zbm-lc-img-new {
          transform: scale(1.1);
        }

        .zbm-lc-placeholder-new {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--accent), var(--accent-dark));
        }

        .zbm-lc-image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.2));
          pointer-events: none;
        }

        .zbm-lc-content-side {
          flex: 1;
          min-width: 0;
          padding: 18px 22px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .zbm-lc-header {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .zbm-lc-tag {
          font-size: 11px;
          font-weight: 700;
          padding: 5px 12px;
          border-radius: 16px;
          border: 1.5px solid;
          white-space: nowrap;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .zbm-lc-date {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: var(--color-text-secondary, #4A4A48);
          margin-left: auto;
        }

        .zbm-lc-title-new {
          font-family: 'Playfair Display', serif;
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--color-text-primary, #111);
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          transition: color 0.3s ease;
        }

        .zbm-lc-new:hover .zbm-lc-title-new {
          color: var(--accent);
        }

        .zbm-lc-desc-new {
          font-size: 14px;
          color: var(--color-text-secondary, #4A4A48);
          line-height: 1.65;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .zbm-lc-footer {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-top: 10px;
          margin-top: auto;
          flex-wrap: wrap;
        }

        .zbm-lc-author-badge {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .zbm-lc-author-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          color: #fff;
          font-size: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-family: 'Playfair Display', serif;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .zbm-lc-author-name-new {
          font-size: 13px;
          font-weight: 600;
          color: var(--color-text-primary, #111);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .zbm-lc-reading-time {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: var(--color-text-secondary, #4A4A48);
          white-space: nowrap;
          margin-left: auto;
        }

        .zbm-lc-actions-side {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 18px 16px;
          flex-shrink: 0;
        }

        .zbm-lc-read-btn-new {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 10px 18px;
          background: linear-gradient(135deg, var(--accent), var(--accent-dark));
          color: #fff;
          border: none;
          border-radius: 10px;
          font-family: 'Outfit', sans-serif;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
        }

        .zbm-lc-read-btn-new:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }

        .zbm-lc-delete-btn-new {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: rgba(204, 46, 46, 0.08);
          border: 1.5px solid rgba(204, 46, 46, 0.2);
          color: var(--color-error, #CC2E2E);
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .zbm-lc-delete-btn-new:hover:not(:disabled) {
          background: var(--color-error, #CC2E2E);
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(204, 46, 46, 0.3);
        }

        .zbm-lc-delete-btn-new:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 900px) {
          .zbm-lc-image-side {
            width: 140px;
          }
        }

        @media (max-width: 700px) {
          .zbm-lc-new {
            flex-direction: column;
          }

          .zbm-lc-image-side {
            width: 100%;
            height: 160px;
          }

          .zbm-lc-content-side {
            padding: 16px;
          }

          .zbm-lc-actions-side {
            padding: 14px 16px;
            gap: 10px;
            width: 100%;
          }

          .zbm-lc-date {
            margin-left: 0;
          }

          .zbm-lc-reading-time {
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  );
};

/* ══ GRID CARD ══ */
const GridCard = ({ bookmark, idx, deleting, onView, onRemove }) => {
  const colorPalette = [
    { accent: '#2B64D4', light: 'rgba(43,100,212,0.08)', dark: '#1A3F8A' },      // Primary Blue
    { accent: '#1E8A56', light: 'rgba(30,138,86,0.08)', dark: '#156B44' },       // Jade Green
    { accent: '#7040CC', light: 'rgba(112,64,204,0.08)', dark: '#4A2680' },      // Violet
    { accent: '#C49A3C', light: 'rgba(196,154,60,0.08)', dark: '#A07C28' },      // Gold
  ];
  const color = colorPalette[idx % colorPalette.length];

  return (
    <article className="zbm-gc-new" style={{ '--accent': color.accent, '--accent-light': color.light, '--accent-dark': color.dark, animationDelay: `${idx * 0.06}s` }}>
      {/* Gradient backdrop */}
      <div className="zbm-gc-backdrop" />

      {/* Image Container */}
      <div className="zbm-gc-img-container">
        <div className="zbm-gc-img-wrapper">
          {bookmark.blog.images?.[0]
            ? <img src={bookmark.blog.images[0]} alt={bookmark.blog.title} className="zbm-gc-img-new" />
            : <div className="zbm-gc-placeholder"><BookOpen size={40} color="rgba(255,255,255,0.5)" /></div>
          }
          <div className="zbm-gc-overlay" />
        </div>

        {/* Category Badge */}
        {bookmark.blog.category?.[0]?.name && (
          <div className="zbm-gc-category-badge">{bookmark.blog.category[0].name}</div>
        )}
        
        {/* Saved Badge */}
        <div className="zbm-gc-saved-badge-new">
          <Bookmark size={12} className="zbm-gc-bookmark-icon" />
          Saved
        </div>
      </div>

      {/* Content */}
      <div className="zbm-gc-content">
        {/* Meta Info */}
        <div className="zbm-gc-meta-new">
          <span className="zbm-gc-meta-item-new">
            <Clock size={12} />
            {new Date(bookmark.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
          <span className="zbm-gc-meta-item-new">
            <Eye size={12} />
            {bookmark.blog.readingTime || '5'} min read
          </span>
        </div>

        {/* Title */}
        <h3 className="zbm-gc-title-new">{bookmark.blog.title}</h3>

        {/* Description */}
        <p className="zbm-gc-desc-new">{bookmark.blog.description || bookmark.blog.short_description || 'Click to read the full story…'}</p>

        {/* Author Info */}
        {bookmark.blog.author && (
          <div className="zbm-gc-author-new">
            <div className="zbm-gc-avatar-new">{bookmark.blog.author.name?.charAt(0).toUpperCase()}</div>
            <div className="zbm-gc-author-info">
              <p className="zbm-gc-author-name">{bookmark.blog.author.name}</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="zbm-gc-actions-new">
          <button onClick={() => onView(bookmark.blog._id)} className="zbm-gc-read-btn-new">
            <span>Read Article</span>
            <ArrowRight size={14} />
          </button>
          <button
            onClick={() => onRemove(bookmark.blog._id)}
            disabled={deleting === bookmark.blog._id}
            className="zbm-gc-delete-btn-new"
            title="Remove bookmark"
          >
            {deleting === bookmark.blog._id ? <span className="zbm-spinner-mini" /> : <Trash2 size={16} />}
          </button>
        </div>
      </div>
    </article>
  );
};

/* ══ LIST CARD ══ */
const ListCard = ({ bookmark, deleting, onView, onRemove }) => {
  const colorPalette = [
    { accent: '#2B64D4', light: 'rgba(43,100,212,0.08)', dark: '#1A3F8A' },
    { accent: '#1E8A56', light: 'rgba(30,138,86,0.08)', dark: '#156B44' },
    { accent: '#7040CC', light: 'rgba(112,64,204,0.08)', dark: '#4A2680' },
    { accent: '#C49A3C', light: 'rgba(196,154,60,0.08)', dark: '#A07C28' },
  ];
  const color = colorPalette[Object.keys(bookmark).length % colorPalette.length];

  return (
    <article className="zbm-lc-new" style={{ '--accent': color.accent, '--accent-dark': color.dark }}>
      {/* Left side - Image */}
      <div className="zbm-lc-image-side">
        <div className="zbm-lc-img-wrapper-new">
          {bookmark.blog.images?.[0]
            ? <img src={bookmark.blog.images[0]} alt={bookmark.blog.title} className="zbm-lc-img-new" />
            : <div className="zbm-lc-placeholder-new"><BookOpen size={28} color="rgba(255,255,255,0.5)" /></div>
          }
          <div className="zbm-lc-image-overlay" />
        </div>
      </div>

      {/* Middle - Content */}
      <div className="zbm-lc-content-side">
        <div className="zbm-lc-header">
          {bookmark.blog.category?.[0]?.name && (
            <span className="zbm-lc-tag" style={{ backgroundColor: color.light, borderColor: color.accent }}>
              {bookmark.blog.category[0].name}
            </span>
          )}
          <span className="zbm-lc-date">
            <Clock size={12} />
            {new Date(bookmark.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
          </span>
        </div>

        <h3 className="zbm-lc-title-new">{bookmark.blog.title}</h3>
        <p className="zbm-lc-desc-new">{bookmark.blog.description || 'Click to read the full story…'}</p>

        {bookmark.blog.author && (
          <div className="zbm-lc-footer">
            <div className="zbm-lc-author-badge">
              <span className="zbm-lc-author-avatar" style={{ backgroundColor: color.accent }}>
                {bookmark.blog.author.name?.charAt(0).toUpperCase()}
              </span>
              <span className="zbm-lc-author-name-new">{bookmark.blog.author.name}</span>
            </div>
            <span className="zbm-lc-reading-time">
              <Eye size={12} />
              {bookmark.blog.readingTime || '5'} min
            </span>
          </div>
        )}
      </div>

      {/* Right side - Actions */}
      <div className="zbm-lc-actions-side">
        <button onClick={() => onView(bookmark.blog._id)} className="zbm-lc-read-btn-new">
          <span>Read</span>
          <ArrowRight size={14} />
        </button>
        <button
          onClick={() => onRemove(bookmark.blog._id)}
          disabled={deleting === bookmark.blog._id}
          className="zbm-lc-delete-btn-new"
          title="Remove bookmark"
        >
          {deleting === bookmark.blog._id ? <span className="zbm-spinner-mini" /> : <Trash2 size={16} />}
        </button>
      </div>
    </article>
  );
};

export default Bookmarks;