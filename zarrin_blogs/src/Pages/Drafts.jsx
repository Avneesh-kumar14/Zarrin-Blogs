import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Trash2, Edit2, Plus, Sparkles, Clock, PenLine } from 'lucide-react';
import Alert from '../Component/Common/Alert';
import { getApiUrl } from '../utils/apiConfig';

const Drafts = ({ isAuthenticated, currentUser }) => {
  const navigate = useNavigate();
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const user = currentUser || JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const isAuth = isAuthenticated !== undefined ? isAuthenticated : !!token;

  useEffect(() => {
    const userData = user || JSON.parse(localStorage.getItem('user') || '{}');
    if (!isAuth) { navigate('/login'); return; }
    if (userData?._id) fetchDrafts();
    else setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuth, navigate]);

  const fetchDrafts = async () => {
    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const token = localStorage.getItem('token');
      const userId = userData?._id || userData?.id;
      if (!userId || !token) throw new Error('Invalid user data. Please login again.');
      const res = await fetch(getApiUrl(`/api/users/${userId}/drafts`), {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      if (!res.ok) { const err = await res.json(); throw new Error(err.message || 'Failed to fetch drafts'); }
      const data = await res.json();
      setDrafts(Array.isArray(data) ? data : []);
    } catch (err) {
      setAlert({ type: 'error', message: err.message });
      setDrafts([]);
    } finally { setLoading(false); }
  };

  const handleDeleteDraft = async (blogId) => {
    setAlert({
      type: 'warning',
      message: 'Delete this draft? This action cannot be undone.',
      isConfirmation: true,
      onConfirm: async () => {
        try {
          setDeleting(blogId);
          const token = localStorage.getItem('token');
          const res = await fetch(getApiUrl(`/api/blogs/${blogId}`), {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
            credentials: 'include'
          });
          if (!res.ok) throw new Error('Failed to delete draft');
          setDrafts(drafts.filter(d => d._id !== blogId));
          setAlert({ type: 'success', message: 'Draft deleted successfully!' });
        } catch (err) {
          setAlert({ type: 'error', message: 'Failed to delete draft: ' + err.message });
        } finally { setDeleting(null); }
      }
    });
  };

  const handleEditDraft = (blogId) => navigate(`/blog/${blogId}/edit`);

  return (
    <div style={D.root}>
      {/* Ambient orbs */}
      <div style={D.orb1} />
      <div style={D.orb2} />

      {/* ── HERO HEADER ── */}
      <div style={D.hero}>
        <div style={D.heroGrid} />
        <div style={D.heroInner}>
          <div style={D.heroLeft}>
            <div style={D.heroBadge}><PenLine size={13} />My Drafts</div>
            <h1 style={D.heroTitle}>Your Writing<br /><em style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.7)' }}>In Progress</em></h1>
            <p style={D.heroSub}>Create, refine, and manage your blog posts before sharing them with the world.</p>
          </div>
          <button
            onClick={() => navigate('/blog/create')}
            style={D.newBtn}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(0,0,0,0.22)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 18px rgba(0,0,0,0.14)'; }}
          >
            <Plus size={18} />New Draft
          </button>
        </div>

        {/* Stat pills */}
        <div style={D.heroPills}>
          <div style={D.pill}><span>📝</span><span style={D.pillVal}>{drafts.length}</span><span style={D.pillLbl}>Drafts</span></div>
          <div style={D.pill}><span>✍️</span><span style={D.pillVal}>Write</span><span style={D.pillLbl}>Anytime</span></div>
          <div style={D.pill}><span>🚀</span><span style={D.pillVal}>Publish</span><span style={D.pillLbl}>When Ready</span></div>
        </div>

        <div style={D.wave}>
          <svg viewBox="0 0 1440 64" fill="none" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
            <path d="M0 32 Q360 64 720 32 Q1080 0 1440 32 L1440 64 L0 64 Z" fill="var(--color-neutral-50)" />
          </svg>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={D.main}>
        {alert && (
          <div style={{ marginBottom: 24 }}>
            <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)}
              duration={alert.isConfirmation ? 0 : 4000}
              isConfirmation={alert.isConfirmation}
              onConfirm={alert.onConfirm}
              onCancel={() => setAlert(null)} />
          </div>
        )}

        {loading ? (
          <div style={D.centerState}>
            <div style={D.spinner} />
            <p style={{ marginTop: 16, color: 'var(--color-text-secondary)', fontSize: 14 }}>Loading your drafts…</p>
          </div>
        ) : drafts.length > 0 ? (
          <>
            {/* Section label */}
            <div style={D.sectionRow}>
              <div style={D.sectionLine} />
              <span style={D.sectionLabel}><FileText size={13} />{drafts.length} draft{drafts.length !== 1 ? 's' : ''} saved</span>
              <div style={D.sectionLine} />
            </div>

            <div style={D.grid}>
              {drafts.map((draft, idx) => (
                <DraftCard
                  key={draft._id}
                  draft={draft}
                  idx={idx}
                  deleting={deleting}
                  onEdit={handleEditDraft}
                  onDelete={handleDeleteDraft}
                />
              ))}
            </div>
          </>
        ) : (
          <div style={D.emptyWrap}>
            <div style={D.emptyGlow} />
            <div style={D.emptyInner}>
              <div style={D.emptyIcon}><FileText size={36} style={{ color: 'var(--color-text-muted)' }} /></div>
              <h2 style={D.emptyTitle}>No drafts yet</h2>
              <p style={D.emptySub}>Start writing your next blog post! Save your ideas as drafts and publish when you're ready.</p>
              <button
                onClick={() => navigate('/blog/create')}
                style={D.emptyBtn}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 22px rgba(43,100,212,0.35)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(43,100,212,0.25)'; }}
              >
                <Plus size={16} />Create Your First Draft
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=Outfit:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes dfFadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes dfSpin   { to { transform: rotate(360deg); } }
        @keyframes dfDrift  { 0%,100%{transform:translate(0,0);}40%{transform:translate(20px,-26px);}70%{transform:translate(-14px,16px);} }
        @media (max-width:900px) { .df-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width:560px) { .df-grid { grid-template-columns: 1fr !important; } .df-hero-inner { flex-direction: column !important; gap: 18px !important; } }
      `}</style>
    </div>
  );
};

/* ── Draft Card ── */
const accentPalette = [
  { bar: 'var(--color-primary)',   light: 'rgba(43,100,212,0.07)',  border: 'rgba(43,100,212,0.18)'  },
  { bar: 'var(--color-secondary)', light: 'rgba(30,138,86,0.07)',   border: 'rgba(30,138,86,0.18)'   },
  { bar: 'var(--color-accent)',    light: 'rgba(112,64,204,0.07)',  border: 'rgba(112,64,204,0.18)'  },
  { bar: 'var(--color-warning)',   light: 'rgba(196,154,60,0.07)',  border: 'rgba(196,154,60,0.18)'  },
  { bar: 'var(--color-info)',      light: 'rgba(74,127,165,0.07)',  border: 'rgba(74,127,165,0.18)'  },
  { bar: 'var(--color-success)',   light: 'rgba(90,140,110,0.07)',  border: 'rgba(90,140,110,0.18)'  },
];

const DraftCard = ({ draft, idx, deleting, onEdit, onDelete }) => {
  const [hovered, setHovered] = useState(false);
  const accent = accentPalette[idx % accentPalette.length];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...D.card,
        boxShadow: hovered ? 'var(--card-shadow-hover)' : 'var(--card-shadow)',
        transform: hovered ? 'translateY(-4px)' : 'none',
        borderColor: hovered ? accent.border : 'var(--color-border-light)',
        animationDelay: `${idx * 0.05}s`,
      }}
    >
      {/* Top accent bar */}
      <div style={{ ...D.cardBar, background: accent.bar }} />

      {/* Cover image */}
      {draft.images?.length > 0 && (
        <div style={D.cardImg}>
          <img src={draft.images[0]} alt={draft.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s', transform: hovered ? 'scale(1.06)' : 'scale(1)' }} />
          <div style={D.cardImgOverlay} />
        </div>
      )}

      <div style={D.cardBody}>
        {/* Badge + Title */}
        <div style={D.cardTop}>
          <span style={{ ...D.draftBadge, background: accent.light, color: accent.bar, border: `1px solid ${accent.border}` }}>📝 Draft</span>
        </div>
        <h3 style={{ ...D.cardTitle, color: hovered ? accent.bar : 'var(--color-text-primary)' }}>
          {draft.title || 'Untitled Draft'}
        </h3>
        {draft.short_description && (
          <p style={D.cardDesc}>{draft.short_description}</p>
        )}

        {/* Meta */}
        <div style={D.cardMeta}>
          <Clock size={12} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
            Updated {new Date(draft.updatedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
          </span>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'var(--color-border-light)', margin: '14px 0' }} />

        {/* Actions */}
        <div style={D.cardActions}>
          <button
            onClick={() => onEdit(draft._id)}
            style={{ ...D.editBtn, background: accent.bar }}
            onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.88)'}
            onMouseLeave={e => e.currentTarget.style.filter = 'none'}
          >
            <Edit2 size={14} />Edit Draft
          </button>
          <button
            onClick={() => onDelete(draft._id)}
            disabled={deleting === draft._id}
            style={{ ...D.deleteBtn, opacity: deleting === draft._id ? 0.5 : 1 }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-error)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'var(--color-error)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-error-bg)'; e.currentTarget.style.color = 'var(--color-error)'; e.currentTarget.style.borderColor = 'rgba(204,46,46,0.3)'; }}
          >
            {deleting === draft._id ? '…' : <Trash2 size={15} />}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   Styles — 100% CSS custom properties
───────────────────────────────────────── */
const D = {
  root: {
    fontFamily: "'Outfit', sans-serif",
    background: 'var(--color-neutral-50)',
    minHeight: '100vh',
    position: 'relative',
    overflowX: 'hidden',
  },
  orb1: { position: 'fixed', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0, width: 500, height: 500, top: -140, left: -140, background: 'rgba(43,100,212,0.05)' },
  orb2: { position: 'fixed', borderRadius: '50%', filter: 'blur(90px)', pointerEvents: 'none', zIndex: 0, width: 380, height: 380, bottom: 0, right: -100, background: 'rgba(112,64,204,0.04)' },

  /* Hero */
  hero: {
    position: 'relative', overflow: 'hidden',
    background: 'linear-gradient(148deg, var(--color-primary-dark) 0%, var(--color-primary) 60%, #2468d4 100%)',
    padding: '72px 24px 130px', zIndex: 1,
  },
  heroGrid: {
    position: 'absolute', inset: 0, pointerEvents: 'none',
    backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)',
    backgroundSize: '52px 52px',
  },
  heroInner: {
    position: 'relative', zIndex: 2,
    maxWidth: 1100, margin: '0 auto',
    display: 'flex', alignItems: 'flex-end',
    justifyContent: 'space-between', gap: 28, flexWrap: 'wrap',
    animation: 'dfFadeUp 0.6s ease both',
  },
  heroLeft: {},
  heroBadge: {
    display: 'inline-flex', alignItems: 'center', gap: 7,
    background: 'rgba(255,255,255,0.13)', border: '1px solid rgba(255,255,255,0.22)',
    color: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)',
    fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase',
    padding: '7px 16px', borderRadius: 100, marginBottom: 18,
  },
  heroTitle: {
    fontFamily: "'Playfair Display', serif", fontWeight: 800,
    fontSize: 'clamp(2.2rem,5vw,3.8rem)', lineHeight: 1.1,
    color: '#fff', marginBottom: 14,
    textShadow: '0 4px 24px rgba(0,0,0,0.2)',
  },
  heroSub: { fontSize: 15, color: 'rgba(255,255,255,0.65)', fontWeight: 300, maxWidth: 500, lineHeight: 1.7 },
  newBtn: {
    display: 'inline-flex', alignItems: 'center', gap: 9,
    padding: '14px 28px', borderRadius: 12,
    background: 'var(--color-surface-primary)', color: 'var(--color-primary)',
    fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 700,
    border: 'none', cursor: 'pointer',
    boxShadow: '0 4px 18px rgba(0,0,0,0.14)', transition: 'all 0.2s',
    flexShrink: 0,
  },
  heroPills: {
    position: 'absolute', zIndex: 10, bottom: 20, left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center',
  },
  pill: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: 'var(--color-surface-primary)',
    border: '1px solid var(--color-border-default)',
    padding: '9px 18px', borderRadius: 100,
    boxShadow: '0 4px 14px rgba(26,24,22,0.1)',
    animation: 'dfFadeUp 0.6s ease both',
  },
  pillVal: { fontFamily: "'Playfair Display',serif", fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-primary)' },
  pillLbl: { fontSize: 11, color: 'var(--color-text-secondary)' },
  wave: { position: 'absolute', bottom: -1, left: 0, right: 0, height: 64 },

  /* Main */
  main: { maxWidth: 1100, margin: '0 auto', padding: '60px 22px 80px', position: 'relative', zIndex: 1 },

  /* Section label */
  sectionRow: { display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 },
  sectionLine: { flex: 1, height: 1, background: 'var(--color-border-light)' },
  sectionLabel: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase',
    color: 'var(--color-text-muted)',
    background: 'var(--color-surface-primary)',
    border: '1px solid var(--color-border-light)',
    padding: '5px 14px', borderRadius: 100,
    boxShadow: 'var(--card-shadow)',
  },

  /* Grid */
  grid: {
    display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
    gap: 20,
  },

  /* Card */
  card: {
    background: 'var(--color-surface-primary)',
    border: '1px solid var(--color-border-light)',
    borderRadius: 'var(--card-border-radius-lg)',
    overflow: 'hidden', position: 'relative',
    transition: 'all 0.25s',
    animation: 'dfFadeUp 0.4s ease both',
  },
  cardBar: { height: 3, width: '100%' },
  cardImg: { height: 180, overflow: 'hidden', position: 'relative', background: 'var(--color-neutral-100)' },
  cardImgOverlay: { position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.12)' },
  cardBody: { padding: '18px 20px 20px' },
  cardTop: { marginBottom: 8 },
  draftBadge: {
    display: 'inline-block', fontSize: 10, fontWeight: 600,
    letterSpacing: '0.06em', textTransform: 'uppercase',
    padding: '4px 10px', borderRadius: 100,
  },
  cardTitle: {
    fontFamily: "'Playfair Display',serif", fontSize: '1.05rem', fontWeight: 700,
    lineHeight: 1.35, marginBottom: 8, transition: 'color 0.2s',
    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
  },
  cardDesc: {
    fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.65,
    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
    marginBottom: 12,
  },
  cardMeta: { display: 'flex', alignItems: 'center', gap: 6 },
  cardActions: { display: 'flex', gap: 8 },
  editBtn: {
    flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    padding: '10px 14px', borderRadius: 10,
    color: '#fff', fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 600,
    border: 'none', cursor: 'pointer', transition: 'filter 0.18s',
    boxShadow: '0 3px 10px rgba(0,0,0,0.15)',
  },
  deleteBtn: {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: 42, height: 42, borderRadius: 10, flexShrink: 0,
    background: 'var(--color-error-bg)', color: 'var(--color-error)',
    border: '1px solid rgba(204,46,46,0.3)',
    cursor: 'pointer', transition: 'all 0.18s',
  },

  /* Empty */
  emptyWrap: {
    position: 'relative', borderRadius: 24,
    border: '2px dashed var(--color-border-default)',
    overflow: 'hidden', textAlign: 'center',
    padding: '80px 32px',
    background: 'var(--color-surface-primary)',
    boxShadow: 'var(--card-shadow)',
  },
  emptyGlow: {
    position: 'absolute', inset: 0, pointerEvents: 'none',
    background: 'radial-gradient(ellipse at 50% 40%, rgba(43,100,212,0.04) 0%, transparent 65%)',
  },
  emptyInner: { position: 'relative', zIndex: 1 },
  emptyIcon: {
    width: 80, height: 80, borderRadius: '50%',
    background: 'var(--color-neutral-100)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 20px',
  },
  emptyTitle: {
    fontFamily: "'Playfair Display',serif", fontSize: '1.6rem',
    fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: 8,
  },
  emptySub: { fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.7, maxWidth: 400, margin: '0 auto 28px' },
  emptyBtn: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '13px 28px', borderRadius: 12,
    background: 'var(--color-primary)', color: '#fff',
    fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 700,
    border: 'none', cursor: 'pointer', transition: 'all 0.2s',
    boxShadow: '0 4px 14px rgba(43,100,212,0.25)',
  },

  /* Loading */
  centerState: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '80px 24px',
    background: 'var(--color-surface-primary)',
    border: '1px solid var(--color-border-light)',
    borderRadius: 20, boxShadow: 'var(--card-shadow)',
  },
  spinner: {
    width: 40, height: 40,
    border: '3px solid var(--color-border-default)',
    borderTopColor: 'var(--color-primary)',
    borderRadius: '50%', animation: 'dfSpin 0.7s linear infinite',
  },
};

export default Drafts;