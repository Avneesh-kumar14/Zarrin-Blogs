import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, FileText, Tags, PenLine, User, LogOut, Sparkles
} from "lucide-react";

const SideBar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  const menuItems = [
    { label: "Dashboard",  route: "analytics",  icon: LayoutDashboard, accent: 'var(--color-primary)',   accentBg: 'rgba(43,100,212,0.09)',  accentBorder: 'rgba(43,100,212,0.2)'  },
    { label: "My Blogs",   route: "myblogs",    icon: FileText,        accent: 'var(--color-secondary)', accentBg: 'rgba(30,138,86,0.09)',   accentBorder: 'rgba(30,138,86,0.2)'   },
    { label: "Categories", route: "categories", icon: Tags,            accent: 'var(--color-accent)',    accentBg: 'rgba(112,64,204,0.09)',  accentBorder: 'rgba(112,64,204,0.2)'  },
    { label: "My Drafts",  route: "drafts",     icon: PenLine,         accent: 'var(--color-warning)',   accentBg: 'rgba(196,154,60,0.09)',  accentBorder: 'rgba(196,154,60,0.2)'  },
    { label: "My Profile", route: "profile",    icon: User,            accent: 'var(--color-info)',      accentBg: 'rgba(74,127,165,0.09)',  accentBorder: 'rgba(74,127,165,0.2)'  },
  ];

  const handleLogout = () => { localStorage.clear(); window.location.href = "/"; };

  return (
    <>
      <aside style={{
        ...S.aside,
        transform: isOpen || typeof window !== 'undefined' && window.innerWidth >= 1024 ? 'translateX(0)' : 'translateX(-100%)',
      }}
        className="zn-sidebar"
      >
        <div style={S.inner}>

          {/* Brand */}
          <div style={S.brand}>
            <div style={S.brandIcon}>
              <Sparkles size={16} color="#fff" />
            </div>
            <div>
              <p style={S.brandTitle}>Zarrin</p>
              <p style={S.brandSub}>Creator Dashboard</p>
            </div>
          </div>

          {/* Divider */}
          <div style={S.divider} />

          {/* Nav label */}
          <p style={S.navGroup}>Navigation</p>

          {/* Nav items */}
          <nav style={S.nav}>
            {menuItems.map(({ label, route, icon: Icon, accent, accentBg, accentBorder }) => {
              const isActive = location.pathname.includes(route);
              return (
                <Link
                  key={route}
                  to={`/dashboard/${route}`}
                  onClick={() => setIsOpen(false)}
                  style={{
                    ...S.navItem,
                    background: isActive ? accentBg : 'transparent',
                    border: isActive ? `1px solid ${accentBorder}` : '1px solid transparent',
                    color: isActive ? accent : 'var(--color-text-secondary)',
                  }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'var(--color-neutral-100)'; e.currentTarget.style.color = 'var(--color-text-primary)'; } }}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-secondary)'; } }}
                >
                  <div style={{
                    ...S.navIconWrap,
                    background: isActive ? accent : 'var(--color-neutral-100)',
                    color: isActive ? '#fff' : 'var(--color-text-secondary)',
                  }}>
                    <Icon size={15} />
                  </div>
                  <span style={{ ...S.navLabel, color: isActive ? accent : 'inherit', fontWeight: isActive ? 700 : 500 }}>
                    {label}
                  </span>
                  {isActive && <div style={{ ...S.activeDot, background: accent }} />}
                </Link>
              );
            })}
          </nav>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Divider */}
          <div style={S.divider} />

          {/* Logout */}
          <button
            onClick={handleLogout}
            style={S.logoutBtn}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-error-bg)'; e.currentTarget.style.color = 'var(--color-error)'; e.currentTarget.style.borderColor = 'rgba(204,46,46,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-secondary)'; e.currentTarget.style.borderColor = 'transparent'; }}
          >
            <div style={S.logoutIcon}><LogOut size={15} /></div>
            <span style={S.navLabel}>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={S.overlay}
        />
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800&family=Outfit:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        .zn-sidebar {
          position: fixed;
          top: 64px;
          left: 0;
          z-index: 30;
          height: calc(100vh - 64px);
          width: 240px;
          transform: translateX(-100%);
          transition: transform 0.28s cubic-bezier(0.4,0,0.2,1);
        }
        @media (min-width: 1024px) {
          .zn-sidebar {
            position: static !important;
            transform: translateX(0) !important;
            height: calc(100vh - 64px);
          }
        }
        .zn-sidebar-open {
          transform: translateX(0) !important;
        }
        a { text-decoration: none; }
      `}</style>
    </>
  );
};

const S = {
  aside: {
    background: 'var(--color-surface-primary)',
    borderRight: '1px solid var(--color-border-light)',
    boxShadow: 'var(--card-shadow)',
    fontFamily: "'Outfit', sans-serif",
  },
  inner: {
    display: 'flex', flexDirection: 'column',
    height: '100%', padding: '20px 14px 20px',
  },

  /* Brand */
  brand: {
    display: 'flex', alignItems: 'center', gap: 11,
    padding: '4px 6px 16px',
  },
  brandIcon: {
    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
    background: 'var(--gradient-primary)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(43,100,212,0.28)',
  },
  brandTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1rem', fontWeight: 800,
    color: 'var(--color-text-primary)', lineHeight: 1.1,
  },
  brandSub: {
    fontSize: 10, fontWeight: 600, letterSpacing: '0.06em',
    textTransform: 'uppercase', color: 'var(--color-text-muted)',
  },

  divider: { height: 1, background: 'var(--color-border-light)', margin: '4px 0 14px' },

  navGroup: {
    fontSize: 10, fontWeight: 600, letterSpacing: '0.1em',
    textTransform: 'uppercase', color: 'var(--color-text-muted)',
    padding: '0 8px', marginBottom: 8,
  },
  nav: { display: 'flex', flexDirection: 'column', gap: 3 },

  navItem: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '10px 10px', borderRadius: 12,
    transition: 'all 0.18s', cursor: 'pointer',
    fontFamily: "'Outfit', sans-serif",
    textDecoration: 'none',
  },
  navIconWrap: {
    width: 30, height: 30, borderRadius: 8, flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.18s',
  },
  navLabel: {
    fontSize: 13, display: 'block', transition: 'color 0.18s',
  },
  activeDot: {
    marginLeft: 'auto', width: 6, height: 6,
    borderRadius: '50%', flexShrink: 0,
  },

  logoutBtn: {
    display: 'flex', alignItems: 'center', gap: 10,
    width: '100%', padding: '10px 10px', borderRadius: 12,
    background: 'transparent', border: '1px solid transparent',
    cursor: 'pointer', transition: 'all 0.18s',
    color: 'var(--color-text-secondary)',
    fontFamily: "'Outfit', sans-serif", marginTop: 4,
  },
  logoutIcon: {
    width: 30, height: 30, borderRadius: 8, flexShrink: 0,
    background: 'var(--color-neutral-100)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },

  overlay: {
    position: 'fixed', inset: 0, top: 64,
    background: 'rgba(17,17,16,0.4)',
    backdropFilter: 'blur(4px)',
    zIndex: 20,
  },
};

export default SideBar;