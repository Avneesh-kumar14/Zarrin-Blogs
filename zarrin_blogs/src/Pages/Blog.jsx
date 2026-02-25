import React, { useState } from 'react'
import OurBlogs from '../Component/Main Component/OurBlogs'
import { Sparkles, Flame, Star, Clock, TrendingUp, ArrowRight } from 'lucide-react'

const Blog = () => {
  const [activeFilter, setActiveFilter] = useState('featured')

  const topics = [
    { title: "Technology", description: "Latest trends in tech, software, and innovation", icon: "💻", accent: 'var(--color-primary,#2B64D4)' },
    { title: "Design", description: "UI/UX, graphic design, and creative inspiration", icon: "🎨", accent: 'var(--color-secondary,#1E8A56)' },
    { title: "Business", description: "Entrepreneurship, startups, and business insights", icon: "📈", accent: 'var(--color-accent,#7040CC)' },
    { title: "Lifestyle", description: "Health, wellness, travel, and personal growth", icon: "✨", accent: 'var(--color-success,#5A8C6E)' }
  ]

  const filters = [
    { key: 'featured', icon: Star, label: 'Featured' },
    { key: 'trending', icon: Flame, label: 'Trending' },
    { key: 'new', icon: Clock, label: 'Latest' },
  ]

  const statPills = [
    { val: '10K+', lbl: 'Articles' },
    { val: '100K+', lbl: 'Readers' },
    { val: '500+', lbl: 'Authors' },
    { val: '4.9★', lbl: 'Rating' },
  ]

  return (
    <div className="zbl-root">

      {/* ── Hero ── */}
      <section className="zbl-hero">
        <div className="zbl-hero-grid" />
        <div className="zbl-hero-orb zbl-o1" />
        <div className="zbl-hero-orb zbl-o2" />

        <div className="zbl-hero-inner">
          <div className="zbl-badge">
            <Sparkles size={14} />Discover Amazing Stories
          </div>

          <h1 className="zbl-hero-h1">
            Explore Stories That<br /><em>Inspire & Educate</em>
          </h1>

          <p className="zbl-hero-sub">
            Discover thoughtfully crafted articles, expert insights, and inspiring stories from our diverse community of writers and thought leaders.
          </p>

          {/* Stats row */}
          <div className="zbl-stats-row">
            {statPills.map((s,i) => (
              <div key={i} className="zbl-stat-pill">
                <span className="zbl-stat-val">{s.val}</span>
                <span className="zbl-stat-lbl">{s.lbl}</span>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="zbl-filters">
            {filters.map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={`zbl-filter-btn ${activeFilter === key ? 'zbl-filter-active' : ''}`}
              >
                <Icon size={15} />{label}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom wave */}
        <div className="zbl-wave">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 30 Q360 60 720 30 Q1080 0 1440 30 L1440 60 L0 60 Z" fill="var(--color-surface-primary,#fff)" />
          </svg>
        </div>
      </section>

      {/* ── Blog listing ── */}
      <section className="zbl-listing">
        <OurBlogs />
      </section>

      {/* ── Topics ── */}
      <section className="zbl-topics">
        <div className="zbl-topics-inner">
          <div className="zbl-topics-head">
            <div className="zbl-topics-eyebrow"><TrendingUp size={15} />Popular Categories</div>
            <h2 className="zbl-topics-h2">Explore by Topic</h2>
            <p className="zbl-topics-sub">
              Dive deeper into topics that interest you most and discover curated content from expert writers.
            </p>
          </div>

          <div className="zbl-topics-grid">
            {topics.map((topic, i) => (
              <a
                key={i}
                href="/blog"
                className="zbl-topic-card"
                style={{ '--ta': topic.accent }}
              >
                <div className="zbl-topic-accent-bar" />
                <div className="zbl-topic-icon">{topic.icon}</div>
                <h3 className="zbl-topic-name">{topic.title}</h3>
                <p className="zbl-topic-desc">{topic.description}</p>
                <div className="zbl-topic-cta">
                  Explore <ArrowRight size={14} className="zbl-topic-arrow" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=Outfit:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin:0; padding:0; }

        .zbl-root {
          font-family: 'Outfit', sans-serif;
          background: var(--color-surface-primary,#fff);
          color: var(--color-text-primary,#111);
          overflow-x: hidden;
        }

        @keyframes fadeUp { from{opacity:0;transform:translateY(22px);}to{opacity:1;transform:translateY(0);} }
        @keyframes drift {
          0%,100%{transform:translate(0,0) scale(1);}
          40%{transform:translate(22px,-28px) scale(1.06);}
          70%{transform:translate(-14px,18px) scale(0.96);}
        }

        /* ── Hero ── */
        .zbl-hero {
          position: relative; overflow: hidden;
          background: linear-gradient(150deg, var(--color-primary-dark,#1A3F8A) 0%, var(--color-primary,#2B64D4) 55%, #2468d4 100%);
          padding: 90px 24px 80px;
          text-align: center;
        }
        .zbl-hero-grid {
          position: absolute; inset: 0;
          background-image: linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),
            linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px);
          background-size: 52px 52px; pointer-events: none;
        }
        .zbl-hero-orb {
          position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none;
        }
        .zbl-o1 { width: 350px; height: 350px; top: -80px; left: -60px; background: rgba(255,255,255,0.08); animation: drift 10s ease-in-out infinite; }
        .zbl-o2 { width: 300px; height: 300px; bottom: 20px; right: -60px; background: rgba(30,138,86,0.18); animation: drift 12s ease-in-out infinite reverse; }

        .zbl-hero-inner {
          position: relative; z-index: 2;
          max-width: 760px; margin: 0 auto;
          animation: fadeUp 0.7s ease both;
        }

        .zbl-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.22);
          color: rgba(255,255,255,0.9); backdrop-filter: blur(8px);
          font-size: 12px; font-weight: 600; letter-spacing: 0.07em;
          padding: 8px 18px; border-radius: 100px; margin-bottom: 28px;
        }

        .zbl-hero-h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.4rem, 5.5vw, 4.5rem); font-weight: 800; line-height: 1.15;
          color: #fff; margin-bottom: 20px;
          text-shadow: 0 4px 32px rgba(0,0,0,0.2);
        }
        .zbl-hero-h1 em { font-style: italic; color: rgba(255,255,255,0.7); }

        .zbl-hero-sub {
          font-size: 17px; line-height: 1.75; color: rgba(255,255,255,0.65);
          font-weight: 300; max-width: 600px; margin: 0 auto 44px;
        }

        /* Stats pills */
        .zbl-stats-row {
          display: flex; justify-content: center; gap: 16px;
          flex-wrap: wrap; margin-bottom: 40px;
        }
        .zbl-stat-pill {
          display: flex; flex-direction: column; align-items: center;
          background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15);
          padding: 14px 24px; border-radius: 14px; backdrop-filter: blur(8px);
          min-width: 90px;
        }
        .zbl-stat-val {
          font-family: 'Playfair Display', serif;
          font-size: 1.6rem; font-weight: 800; color: #fff; line-height: 1;
        }
        .zbl-stat-lbl { font-size: 11px; color: rgba(255,255,255,0.5); margin-top: 4px; letter-spacing: 0.06em; }

        /* Filters */
        .zbl-filters {
          display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;
        }
        .zbl-filter-btn {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 11px 22px; border-radius: 100px;
          background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
          color: rgba(255,255,255,0.8); backdrop-filter: blur(8px);
          font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 500;
          cursor: pointer; transition: all 0.2s;
        }
        .zbl-filter-btn:hover { background: rgba(255,255,255,0.18); border-color: rgba(255,255,255,0.4); color: #fff; }
        .zbl-filter-active {
          background: var(--color-surface-primary,#fff) !important;
          color: var(--color-primary,#2B64D4) !important;
          border-color: transparent !important;
          font-weight: 700;
          box-shadow: 0 4px 16px rgba(0,0,0,0.12);
        }

        /* Wave */
        .zbl-wave {
          position: absolute; bottom: -1px; left: 0; right: 0;
          height: 60px;
        }
        .zbl-wave svg { width: 100%; height: 100%; }

        /* Listing */
        .zbl-listing {
          background: var(--color-surface-primary,#fff);
          padding: 60px 0;
        }

        /* Topics */
        .zbl-topics {
          background: var(--color-surface-secondary,#F5F5F5);
          border-top: 1px solid var(--color-border-light,#EEE);
          padding: 80px 24px;
        }
        .zbl-topics-inner { max-width: 1200px; margin: 0 auto; }

        .zbl-topics-head { text-align: center; margin-bottom: 52px; }
        .zbl-topics-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 12px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--color-primary,#2B64D4); margin-bottom: 12px;
        }
        .zbl-topics-h2 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 4vw, 3rem); font-weight: 800;
          color: var(--color-text-primary,#111); margin-bottom: 14px;
        }
        .zbl-topics-sub {
          font-size: 16px; color: var(--color-text-secondary,#4A4A48);
          font-weight: 300; max-width: 540px; margin: 0 auto; line-height: 1.7;
        }

        .zbl-topics-grid {
          display: grid; grid-template-columns: repeat(4,1fr); gap: 20px;
        }
        @media(max-width:900px){.zbl-topics-grid{grid-template-columns:repeat(2,1fr);}}
        @media(max-width:500px){.zbl-topics-grid{grid-template-columns:1fr;}}

        .zbl-topic-card {
          position: relative;
          background: var(--color-surface-primary,#fff);
          border: 1px solid var(--color-border-light,#EEE);
          border-radius: 18px; padding: 32px 24px;
          text-decoration: none;
          box-shadow: var(--card-shadow);
          transition: transform 0.22s, box-shadow 0.22s;
          overflow: hidden;
          display: flex; flex-direction: column; gap: 8px;
        }
        .zbl-topic-card:hover { transform: translateY(-5px); box-shadow: var(--card-shadow-hover); }

        .zbl-topic-accent-bar {
          position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: var(--ta);
        }

        /* Hover glow */
        .zbl-topic-card::after {
          content: '';
          position: absolute; top: -40px; right: -40px;
          width: 120px; height: 120px; border-radius: 50%;
          background: var(--ta); opacity: 0;
          filter: blur(50px); transition: opacity 0.3s;
          pointer-events: none;
        }
        .zbl-topic-card:hover::after { opacity: 0.12; }

        .zbl-topic-icon { font-size: 40px; margin-bottom: 6px; }
        .zbl-topic-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.2rem; font-weight: 700; color: var(--ta);
        }
        .zbl-topic-desc { font-size: 13px; color: var(--color-text-secondary,#4A4A48); line-height: 1.6; flex: 1; }
        .zbl-topic-cta {
          display: flex; align-items: center; gap: 6px;
          font-size: 13px; font-weight: 600; color: var(--ta);
          margin-top: 8px; transition: gap 0.2s;
        }
        .zbl-topic-arrow { transition: transform 0.2s; }
        .zbl-topic-card:hover .zbl-topic-cta { gap: 9px; }
        .zbl-topic-card:hover .zbl-topic-arrow { transform: translateX(3px); }
      `}</style>
    </div>
  )
}

export default Blog