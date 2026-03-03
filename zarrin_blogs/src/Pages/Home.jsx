import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight, Zap, BookOpen, Sparkles, TrendingUp, Users, Award,
  Quote, CheckCircle, Play, Star, PenLine, Rss, Globe, MessageSquare,
  Share2, Eye, Heart, Bookmark, Clock, ChevronRight, Flame, Bell
} from 'lucide-react'

/* ── FollowButton – existing logic preserved exactly ── */
const FollowButton = ({ writerId, writerName }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem('token');

  const toggleFollow = async (e) => {
    e.stopPropagation();
    if (!token) { alert('Please login to follow writers'); return; }
    try {
      setIsLoading(true);
      const apiBase = process.env.REACT_APP_API_BASE_URL || 'https://zarrin-blogs-backend.onrender.com';
      const apiUrl = apiBase.includes('/api') ? apiBase : `${apiBase}/api`;
      const url = isFollowing ? `${apiUrl}/users/${writerId}/unfollow` : `${apiUrl}/users/${writerId}/follow`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (response.ok) setIsFollowing(!isFollowing);
    } catch (error) { console.error('Error toggling follow:', error); }
    finally { setIsLoading(false); }
  };

  return (
    <button onClick={toggleFollow} disabled={isLoading}
      className={`zh-follow-btn ${isFollowing ? 'zh-follow-on' : ''} ${isLoading ? 'zh-follow-load' : ''}`}>
      {isLoading ? '…' : isFollowing ? '✓ Following' : '+ Follow'}
    </button>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const [featuredBlog, setFeaturedBlog] = useState(null);
  const [trendingBlogs, setTrendingBlogs] = useState([]);
  const [topWriters, setTopWriters] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');

  let API_BASE = process.env.REACT_APP_API_BASE_URL || 'https://zarrin-blogs-backend.onrender.com';
  const API_URL = API_BASE.endsWith('/api') ? API_BASE : `${API_BASE}/api`;

  /* ── EXISTING DATA FETCH – preserved exactly ── */
  const fetchAllData = useCallback(async () => {
    try {
      const blogsRes = await fetch(`${API_URL}/blogs?status=published&sort=createdAt&order=desc`);
      if (blogsRes.ok) {
        const data = await blogsRes.json();
        let blogs = data.data || data.blogs || (Array.isArray(data) ? data : []);
        if (blogs.length > 0) {
          setFeaturedBlog(blogs[0]);
          setTrendingBlogs([...blogs].sort((a,b) => (b.likes?.length||0) - (a.likes?.length||0)).slice(0,3));
        }
      }
      const usersRes = await fetch(`${API_URL}/users`);
      if (usersRes.ok) {
        const users = await usersRes.json();
        if (Array.isArray(users) && users.length > 0) {
          setTopWriters(users.filter(u => u.totalBlogs > 0)
            .sort((a,b) => (b.followers?.length||0) - (a.followers?.length||0))
            .slice(0,3)
            .map(user => ({
              _id: user._id, name: user.name,
              username: `@${user.name?.toLowerCase().replace(/\s+/g,'')}`,
              followers: `${user.followers?.length||0}`, articles: user.totalBlogs||0,
              specialty: user.bio || 'Content Creator',
              verified: Math.random() > 0.3, avatar: user.avatar
            })));
        }
      }
    } catch (err) { console.error('❌ Error fetching home data:', err); }
  }, [API_URL]);

  useEffect(() => { fetchAllData(); }, [fetchAllData]);

  /* ── FILTERED BLOGS BY CATEGORY ── */
  const filteredTrendingBlogs = activeCategory === 'All' 
    ? trendingBlogs 
    : trendingBlogs.filter(blog => blog.category?.[0]?.name === activeCategory);

  /* ── STATIC DATA ── */
  const categories = ['All', 'Technology', 'Design', 'Business', 'Lifestyle', 'Travel', 'Science', 'Culture'];

  const platformStats = [
    { icon: BookOpen, value: "50K+", label: "Articles Published", accent: 'var(--color-primary,#2B64D4)' },
    { icon: Users, value: "1M+", label: "Active Readers", accent: 'var(--color-secondary,#1E8A56)' },
    { icon: TrendingUp, value: "10K+", label: "Writers", accent: 'var(--color-accent,#7040CC)' },
    { icon: Award, value: "4.9/5", label: "User Rating", accent: 'var(--color-success,#5A8C6E)' },
  ];

  const features = [
    { icon: Sparkles, title: "AI-Powered Editor", desc: "Write better with intelligent suggestions, auto-formatting, and smart grammar checks.", color: 'var(--color-primary,#2B64D4)' },
    { icon: TrendingUp, title: "Advanced Analytics", desc: "Track views, read time, followers, and earnings with a beautiful dashboard.", color: 'var(--color-secondary,#1E8A56)' },
    { icon: Users, title: "Engaged Community", desc: "Follow writers, comment on posts, and build genuine relationships around ideas.", color: 'var(--color-accent,#7040CC)' },
    { icon: Award, title: "Monetization", desc: "Earn from your content with our partner program, tips, and premium subscriptions.", color: 'var(--color-warning,#C49A3C)' },
    { icon: Globe, title: "Global Distribution", desc: "Multi-language support and SEO tools that get your writing found worldwide.", color: 'var(--color-error,#CC2E2E)' },
    { icon: Rss, title: "Newsletter Builder", desc: "Turn readers into subscribers with a beautiful built-in email newsletter tool.", color: 'var(--color-success,#5A8C6E)' },
  ];

  const testimonials = [
    { quote: "BlogSphere has transformed how I share my knowledge. The platform is intuitive and the community is incredibly supportive.", author: "Jessica Williams", role: "Senior Developer at TechCorp", rating: 5 },
    { quote: "I've tried many platforms, but BlogSphere stands out. It's perfect for professional writers who care about their work.", author: "Michael Brown", role: "UX Designer & Author", rating: 5 },
    { quote: "The analytics dashboard is incredible. I've grown my following by 300% in just 3 months on Zarrin!", author: "Emily Parker", role: "Content Strategist", rating: 5 },
  ];

  const howItWorks = [
    { step: '01', icon: PenLine, title: 'Create Your Profile', desc: 'Sign up in 30 seconds, add your bio, and tell the world what you write about.', color: 'var(--color-primary,#2B64D4)' },
    { step: '02', icon: BookOpen, title: 'Write Your Story', desc: 'Use our rich, distraction-free editor. Draft, format, embed media, and preview.', color: 'var(--color-secondary,#1E8A56)' },
    { step: '03', icon: Share2, title: 'Publish & Share', desc: 'Hit publish and reach your followers instantly. Auto-generate social share cards.', color: 'var(--color-accent,#7040CC)' },
    { step: '04', icon: TrendingUp, title: 'Grow & Earn', desc: 'Watch your analytics, grow your audience, and unlock monetization features.', color: 'var(--color-warning,#C49A3C)' },
  ];

  const trendingTopics = [
    { tag: '#BuildInPublic', posts: '2.3K posts', hot: true },
    { tag: '#TechTrends2025', posts: '1.8K posts', hot: true },
    { tag: '#WritingTips', posts: '1.5K posts', hot: false },
    { tag: '#StartupLife', posts: '1.2K posts', hot: false },
    { tag: '#DesignThinking', posts: '980 posts', hot: false },
    { tag: '#AITools', posts: '870 posts', hot: true },
    { tag: '#FutureOfWork', posts: '760 posts', hot: false },
    { tag: '#CreatorEconomy', posts: '640 posts', hot: false },
  ];

  const recentActivity = [
    { type: 'new_post', user: 'Priya S.', action: 'published', target: '"Why Slow Travel Changed My Life"', time: '2m ago', avatar: 'P' },
    { type: 'follow', user: 'Rahul M.', action: 'now has', target: '5,000 followers', time: '8m ago', avatar: 'R' },
    { type: 'trending', user: '"The AI Paradox"', action: 'is trending with', target: '12K reads today', time: '14m ago', avatar: '🔥' },
    { type: 'new_post', user: 'Aisha K.', action: 'published', target: '"Building a SaaS in 30 Days"', time: '22m ago', avatar: 'A' },
  ];

  const trendAccents = ['var(--color-primary,#2B64D4)', 'var(--color-secondary,#1E8A56)', 'var(--color-accent,#7040CC)', 'var(--color-warning,#C49A3C)'];

  return (
    <div className="zh-root">

      {/* ══ HERO ══ */}
      <section className="zh-hero">
        <div className="zh-hero-grid"/>
        <div className="zh-orb zh-o1"/><div className="zh-orb zh-o2"/><div className="zh-orb zh-o3"/>

        <div className="zh-hero-inner">
          <div className="zh-hero-left">
            <div className="zh-eyebrow"><Sparkles size={13}/>The #1 Blogging Platform for Modern Writers</div>
            <h1 className="zh-hero-h1">Share Your <em>Ideas</em><br />with the World</h1>
            <p className="zh-hero-sub">
              Join 50,000+ writers sharing stories, building audiences, and earning from their craft on the most beautiful, writer-first blogging platform.
            </p>

            {/* Live activity feed teaser */}
            <div className="zh-live-feed">
              <div className="zh-lf-dot"/><span className="zh-lf-txt">Live: 247 articles published today</span>
              <Bell size={13} className="zh-lf-bell"/>
            </div>

            <div className="zh-hero-btns">
              <a href="/blog/create" className="zh-btn-primary">
                <PenLine size={16}/>Start Writing Free <ArrowRight size={15}/>
              </a>
              <a href="/blog" className="zh-btn-ghost">
                <Play size={14}/>Explore Articles
              </a>
            </div>

            <div className="zh-trust">
              {['Free forever', 'No credit card', '5 min setup'].map((t,i) => (
                <span key={i} className="zh-trust-chip"><CheckCircle size={13} className="zh-tc-icon"/>{t}</span>
              ))}
            </div>
          </div>

          {/* Featured blog card */}
          {featuredBlog && (
            <div className="zh-hero-right">
              <div className="zh-fc" onClick={() => navigate(`/blog/${featuredBlog._id}/preview`)}>
                <div className="zh-fc-img-wrap">
                  <img src={featuredBlog.images?.[0] || '/Assets/beach.png'} alt={featuredBlog.title} className="zh-fc-img"/>
                  <div className="zh-fc-ov"/>
                  <div className="zh-fc-cat">{featuredBlog.category?.[0]?.name || 'Featured'}</div>
                  <div className="zh-fc-live"><span className="zh-fc-live-dot"/>Featured</div>
                </div>
                <div className="zh-fc-body">
                  <h3 className="zh-fc-title">{featuredBlog.title}</h3>
                  <div className="zh-fc-meta">
                    <span>{new Date(featuredBlog.createdAt).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</span>
                    <span className="zh-dot">·</span>
                    <span>{featuredBlog.readingTime||'5'} min read</span>
                  </div>
                  <div className="zh-fc-footer">
                    <div className="zh-fc-author-row">
                      <div className="zh-fc-av">{featuredBlog.author?.name?.charAt(0)||'A'}</div>
                      <div>
                        <p className="zh-fc-aname">{featuredBlog.author?.name||'Author'}</p>
                        <p className="zh-fc-arole">Featured Author</p>
                      </div>
                    </div>
                    <div className="zh-fc-actions">
                      <span className="zh-fc-act"><Heart size={12}/></span>
                      <span className="zh-fc-act"><Bookmark size={12}/></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity feed mini */}
              <div className="zh-mini-feed">
                <p className="zh-mf-label"><Flame size={12}/>Live Activity</p>
                {recentActivity.slice(0,2).map((a,i) => (
                  <div key={i} className="zh-mf-item">
                    <div className="zh-mf-av">{a.avatar}</div>
                    <p className="zh-mf-txt"><strong>{a.user}</strong> {a.action} <span className="zh-mf-target">{a.target}</span></p>
                    <span className="zh-mf-time">{a.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ══ STATS STRIP ══ */}
      <section className="zh-stats">
        {platformStats.map((s,i)=>{ const Icon=s.icon; return(
          <div key={i} className="zh-stat" style={{'--acc':s.accent}}>
            <div className="zh-stat-icon"><Icon size={20} color="#fff"/></div>
            <div className="zh-stat-val">{s.value}</div>
            <div className="zh-stat-lbl">{s.label}</div>
          </div>
        )})}
      </section>

      {/* ══ CATEGORY FILTER + TRENDING ══ */}
      <section className="zh-section">
        <div className="zh-section-inner">
          {/* Category pills */}
          <div className="zh-cat-filter">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`zh-cat-pill ${activeCategory===cat?'zh-cat-active':''}`}>
                {cat}
              </button>
            ))}
          </div>

          <div className="zh-section-head">
            <div>
              <div className="zh-eyebrow-dark"><TrendingUp size={14}/>Trending Now</div>
              <h2 className="zh-section-h2">Most Read This Week</h2>
            </div>
            <a href="/blog" className="zh-see-all">View All <ArrowRight size={14}/></a>
          </div>

          <div className="zh-trend-grid">
            {filteredTrendingBlogs.length > 0 ? filteredTrendingBlogs.map((blog,i) => {
              const colorIdx = (blog._id?.charCodeAt(0) || i) % trendAccents.length;
              return (
              <a key={blog._id} href={`/blog/${blog._id}/preview`}
                className="zh-trend-card" style={{'--ca':trendAccents[colorIdx]}}>
                <div className="zh-tc-top"/>
                <div className="zh-tc-img-wrap">
                  <img src={blog.images?.[0]||'/Assets/beach.png'} alt={blog.title} className="zh-tc-img"/>
                  <div className="zh-tc-ov"/>
                  <div className="zh-tc-badge">{blog.category?.[0]?.name||'Article'}</div>
                  <div className="zh-tc-rank">#{i+1}</div>
                </div>
                <div className="zh-tc-body">
                  <h3 className="zh-tc-title">{blog.title}</h3>
                  <p className="zh-tc-desc">{blog.description||'Discover this insightful story...'}</p>
                  <div className="zh-tc-footer">
                    <div className="zh-tc-author">
                      <div className="zh-tc-av">{blog.author?.name?.charAt(0)||'A'}</div>
                      <div><p className="zh-tc-aname">{blog.author?.name}</p><p className="zh-tc-read">{blog.readingTime||'5'} min</p></div>
                    </div>
                    <div className="zh-tc-stats">
                      <span className="zh-tc-s"><Eye size={11}/>{blog.views||'—'}</span>
                      <span className="zh-tc-s"><Heart size={11}/>{blog.likes?.length||0}</span>
                    </div>
                  </div>
                </div>
              </a>
            );
            }) : (
              <div className="zh-empty">No trending articles in this category</div>
            )}
          </div>
        </div>
      </section>

      {/* ══ TRENDING TOPICS ══ */}
      <section className="zh-section zh-alt">
        <div className="zh-section-inner">
          <div className="zh-section-head zh-center">
            <h2 className="zh-section-h2">Explore by <em>Topic</em></h2>
            <p className="zh-section-sub">Discover what the community is talking about right now</p>
          </div>
          <div className="zh-topics-wrap">
            {trendingTopics.map((t,i) => (
              <a key={i} href="/blog" className="zh-topic-tag">
                {t.hot && <Flame size={11} className="zh-topic-flame"/>}
                <span className="zh-topic-name">{t.tag}</span>
                <span className="zh-topic-count">{t.posts}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section className="zh-section">
        <div className="zh-section-inner">
          <div className="zh-section-head zh-center">
            <div className="zh-eyebrow-dark"><Zap size={14}/>Simple Process</div>
            <h2 className="zh-section-h2">From Idea to <em>Published Story</em></h2>
            <p className="zh-section-sub">Four steps to get your writing in front of the world</p>
          </div>
          <div className="zh-hiw-grid">
            {howItWorks.map((h,i) => { const Icon=h.icon; return(
              <div key={i} className="zh-hiw-card" style={{'--hc':h.color}}>
                <div className="zh-hiw-step">{h.step}</div>
                <div className="zh-hiw-icon"><Icon size={20} color="#fff"/></div>
                <h3 className="zh-hiw-title">{h.title}</h3>
                <p className="zh-hiw-desc">{h.desc}</p>
                {i < howItWorks.length-1 && <div className="zh-hiw-arr">→</div>}
              </div>
            )})}
          </div>
        </div>
      </section>

      {/* ══ FEATURES ══ */}
      <section className="zh-section zh-alt">
        <div className="zh-section-inner">
          <div className="zh-section-head zh-center">
            <div className="zh-eyebrow-dark"><Sparkles size={14}/>Powerful Tools</div>
            <h2 className="zh-section-h2">Everything You Need to <em>Succeed</em></h2>
            <p className="zh-section-sub">Professional tools and features designed for serious writers</p>
          </div>
          <div className="zh-feat-grid">
            {features.map((f,i) => { const Icon=f.icon; return(
              <div key={i} className="zh-feat-card" style={{'--fc':f.color}}>
                <div className="zh-feat-icon"><Icon size={18} color="#fff"/></div>
                <h3 className="zh-feat-title">{f.title}</h3>
                <p className="zh-feat-desc">{f.desc}</p>
                <div className="zh-feat-bar"/>
              </div>
            )})}
          </div>
        </div>
      </section>

      {/* ══ FEATURED WRITERS ══ */}
      <section className="zh-section">
        <div className="zh-section-inner">
          <div className="zh-section-head">
            <div>
              <div className="zh-eyebrow-dark"><Award size={14}/>Community</div>
              <h2 className="zh-section-h2">Featured Writers</h2>
            </div>
            <a href="/following" className="zh-see-all">View All Writers <ArrowRight size={14}/></a>
          </div>

          <div className="zh-writers-grid">
            {topWriters.length > 0 ? topWriters.map((w) => (
              <div key={w._id} className="zh-writer-card" onClick={() => navigate(`/profile/${w._id}`)}>
                <div className="zh-wc-header"/>
                <div className="zh-wc-body">
                  <div className="zh-wc-av-wrap">
                    <div className="zh-wc-av">
                      {w.avatar ? <img src={w.avatar} alt={w.name} className="zh-wc-av-img"/> : w.name?.charAt(0)}
                    </div>
                    {w.verified && <div className="zh-wc-verified"><CheckCircle size={11}/></div>}
                  </div>
                  <h3 className="zh-wc-name">{w.name}</h3>
                  <p className="zh-wc-handle">{w.username}</p>
                  <div className="zh-wc-specialty">{w.specialty}</div>
                  <div className="zh-wc-stats">
                    <div className="zh-wcs"><span className="zh-wcs-v">{w.followers}</span><span className="zh-wcs-l">Followers</span></div>
                    <div className="zh-wcs-div"/>
                    <div className="zh-wcs"><span className="zh-wcs-v">{w.articles}</span><span className="zh-wcs-l">Articles</span></div>
                  </div>
                  <FollowButton writerId={w._id} writerName={w.name}/>
                </div>
              </div>
            )) : <div className="zh-empty zh-empty-span">No writers found yet</div>}
          </div>
        </div>
      </section>

      {/* ══ LIVE ACTIVITY FEED ══ */}
      <section className="zh-section zh-alt">
        <div className="zh-section-inner">
          <div className="zh-section-head zh-center">
            <div className="zh-eyebrow-dark"><Flame size={14}/>Real-Time</div>
            <h2 className="zh-section-h2">What's Happening <em>Right Now</em></h2>
            <p className="zh-section-sub">The Zarrin community is always buzzing with fresh ideas</p>
          </div>
          <div className="zh-activity-grid">
            {recentActivity.map((a,i) => (
              <div key={i} className="zh-act-card">
                <div className="zh-act-av">{a.avatar}</div>
                <div className="zh-act-content">
                  <p className="zh-act-txt"><strong>{a.user}</strong> {a.action} <span className="zh-act-target">{a.target}</span></p>
                  <span className="zh-act-time"><Clock size={11}/>{a.time}</span>
                </div>
                <div className="zh-act-dot"/>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section className="zh-section">
        <div className="zh-section-inner">
          <div className="zh-section-head zh-center">
            <div className="zh-eyebrow-dark"><Star size={14}/>Reviews</div>
            <h2 className="zh-section-h2">What Writers <em>Say About Us</em></h2>
          </div>
          <div className="zh-test-grid">
            {testimonials.map((t,i) => (
              <div key={i} className="zh-test-card">
                <div className="zh-test-stars">{[...Array(t.rating)].map((_,j)=><Star key={j} size={12} className="zh-star"/>)}</div>
                <Quote size={24} className="zh-quote-icon"/>
                <p className="zh-test-text">"{t.quote}"</p>
                <div className="zh-test-author">
                  <div className="zh-test-av">{t.author[0]}</div>
                  <div><p className="zh-test-name">{t.author}</p><p className="zh-test-role">{t.role}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FINAL CTA ══ */}
      <section className="zh-cta">
        <div className="zh-cta-g1"/><div className="zh-cta-g2"/>
        <div className="zh-cta-inner">
          <div className="zh-eyebrow"><Sparkles size={13}/>Start Your Journey Today</div>
          <h2 className="zh-cta-h2">Ready to Share<br /><em>Your Story?</em></h2>
          <p className="zh-cta-p">Join our community of passionate writers. It's free, beautiful, and takes less than a minute to get started.</p>
          <div className="zh-cta-btns">
            <a href="/blog/create" className="zh-cta-primary">Get Started Free <ArrowRight size={15}/></a>
            <a href="/blog" className="zh-cta-ghost">Explore Articles</a>
          </div>
          <p className="zh-cta-fine">No credit card required · Free forever · 50,000+ active writers</p>
        </div>
      </section>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=Outfit:wght@300;400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

        .zh-root{font-family:'Outfit',sans-serif;background:var(--color-surface-primary,#fff);color:var(--color-text-primary,#111);overflow-x:hidden;}

        @keyframes fadeUp{from{opacity:0;transform:translateY(22px);}to{opacity:1;transform:translateY(0);}}
        @keyframes drift{0%,100%{transform:translate(0,0) scale(1);}40%{transform:translate(20px,-26px) scale(1.06);}70%{transform:translate(-14px,16px) scale(0.96);}}
        @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.4;}}

        /* HERO */
        .zh-hero{position:relative;overflow:hidden;background:linear-gradient(148deg,var(--color-primary-dark,#1A3F8A) 0%,var(--color-primary,#2B64D4) 55%,#2468d4 100%);padding:80px 24px 96px;}
        .zh-hero-grid{position:absolute;inset:0;pointer-events:none;background-image:linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px);background-size:52px 52px;}
        .zh-orb{position:absolute;border-radius:50%;filter:blur(80px);pointer-events:none;}
        .zh-o1{width:360px;height:360px;top:-80px;left:-60px;background:rgba(255,255,255,0.07);animation:drift 11s ease-in-out infinite;}
        .zh-o2{width:280px;height:280px;bottom:-20px;right:-50px;background:rgba(30,138,86,0.18);animation:drift 9s ease-in-out infinite reverse;}
        .zh-o3{width:200px;height:200px;top:35%;left:55%;background:rgba(112,64,204,0.12);animation:drift 13s ease-in-out infinite 2s;}

        .zh-hero-inner{position:relative;z-index:2;max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:center;animation:fadeUp 0.7s ease both;}
        @media(max-width:900px){.zh-hero-inner{grid-template-columns:1fr;}.zh-hero-right{display:none;}}

        .zh-eyebrow{display:inline-flex;align-items:center;gap:7px;background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.22);color:rgba(255,255,255,0.9);backdrop-filter:blur(8px);font-size:11px;font-weight:600;letter-spacing:0.07em;padding:7px 15px;border-radius:100px;margin-bottom:22px;}
        .zh-eyebrow-dark{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:700;letter-spacing:0.09em;text-transform:uppercase;color:var(--color-primary,#2B64D4);margin-bottom:8px;}

        .zh-hero-h1{font-family:'Playfair Display',serif;font-size:clamp(2.8rem,5.5vw,4.8rem);font-weight:800;line-height:1.1;color:#fff;margin-bottom:18px;text-shadow:0 4px 32px rgba(0,0,0,0.2);}
        .zh-hero-h1 em{font-style:italic;color:rgba(255,255,255,0.7);}
        .zh-hero-sub{font-size:16px;line-height:1.75;color:rgba(255,255,255,0.65);font-weight:300;max-width:460px;margin-bottom:20px;}

        .zh-live-feed{display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);padding:8px 14px;border-radius:100px;margin-bottom:24px;}
        .zh-lf-dot{width:7px;height:7px;border-radius:50%;background:var(--color-secondary,#1E8A56);animation:pulse 1.8s ease-in-out infinite;flex-shrink:0;}
        .zh-lf-txt{font-size:12px;color:rgba(255,255,255,0.7);}
        .zh-lf-bell{color:rgba(255,255,255,0.4);}

        .zh-hero-btns{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:24px;}
        .zh-btn-primary{display:inline-flex;align-items:center;gap:8px;padding:13px 28px;border-radius:10px;background:var(--color-surface-primary,#fff);color:var(--color-primary,#2B64D4);font-family:'Outfit',sans-serif;font-size:14px;font-weight:700;text-decoration:none;transition:transform 0.2s,box-shadow 0.2s;box-shadow:0 4px 18px rgba(0,0,0,0.15);}
        .zh-btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(0,0,0,0.2);}
        .zh-btn-ghost{display:inline-flex;align-items:center;gap:8px;padding:13px 22px;border-radius:10px;border:2px solid rgba(255,255,255,0.35);color:#fff;font-family:'Outfit',sans-serif;font-size:14px;font-weight:600;text-decoration:none;backdrop-filter:blur(8px);transition:all 0.2s;}
        .zh-btn-ghost:hover{background:rgba(255,255,255,0.1);border-color:rgba(255,255,255,0.65);}

        .zh-trust{display:flex;gap:16px;flex-wrap:wrap;}
        .zh-trust-chip{display:flex;align-items:center;gap:6px;font-size:13px;color:rgba(255,255,255,0.65);}
        .zh-tc-icon{color:var(--color-secondary,#1E8A56);}

        /* Featured card */
        .zh-fc{background:var(--color-surface-primary,#fff);border-radius:18px;overflow:hidden;box-shadow:0 20px 56px rgba(0,0,0,0.24);cursor:pointer;transition:transform 0.25s,box-shadow 0.25s;margin-bottom:12px;}
        .zh-fc:hover{transform:translateY(-4px);box-shadow:0 28px 72px rgba(0,0,0,0.3);}
        .zh-fc-img-wrap{position:relative;height:240px;overflow:hidden;}
        .zh-fc-img{width:100%;height:100%;object-fit:cover;transition:transform 0.4s;}
        .zh-fc:hover .zh-fc-img{transform:scale(1.06);}
        .zh-fc-ov{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.5),transparent 60%);}
        .zh-fc-cat{position:absolute;top:12px;left:12px;background:var(--color-primary,#2B64D4);color:#fff;font-size:10px;font-weight:700;letter-spacing:0.07em;padding:4px 10px;border-radius:100px;}
        .zh-fc-live{position:absolute;top:12px;right:12px;display:flex;align-items:center;gap:5px;background:rgba(0,0,0,0.5);color:#fff;font-size:11px;font-weight:600;padding:5px 10px;border-radius:100px;backdrop-filter:blur(8px);}
        .zh-fc-live-dot{width:6px;height:6px;border-radius:50%;background:var(--color-secondary,#1E8A56);animation:pulse 1.6s ease-in-out infinite;}
        .zh-fc-body{padding:18px;}
        .zh-fc-title{font-family:'Playfair Display',serif;font-size:1.15rem;font-weight:700;color:var(--color-text-primary,#111);margin-bottom:8px;line-height:1.3;}
        .zh-fc-meta{font-size:11px;color:var(--color-text-muted,#B0B0AD);display:flex;gap:5px;margin-bottom:12px;}
        .zh-dot{color:var(--color-border-default,#E0E0E0);}
        .zh-fc-footer{display:flex;align-items:center;justify-content:space-between;padding-top:12px;border-top:1px solid var(--color-border-light,#EEE);}
        .zh-fc-author-row{display:flex;align-items:center;gap:8px;}
        .zh-fc-av{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,var(--color-primary,#2B64D4),var(--color-secondary,#1E8A56));color:#fff;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
        .zh-fc-aname{font-size:12px;font-weight:600;color:var(--color-text-primary,#111);}
        .zh-fc-arole{font-size:10px;color:var(--color-text-muted,#B0B0AD);}
        .zh-fc-actions{display:flex;gap:6px;}
        .zh-fc-act{display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:7px;background:var(--color-surface-secondary,#F5F5F5);color:var(--color-text-secondary,#4A4A48);cursor:pointer;}

        /* Mini feed */
        .zh-mini-feed{background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.15);border-radius:14px;padding:14px;backdrop-filter:blur(8px);}
        .zh-mf-label{display:flex;align-items:center;gap:5px;font-size:11px;font-weight:600;color:rgba(255,255,255,0.6);margin-bottom:10px;letter-spacing:0.06em;text-transform:uppercase;}
        .zh-mf-item{display:flex;align-items:flex-start;gap:9px;margin-bottom:8px;}
        .zh-mf-item:last-child{margin-bottom:0;}
        .zh-mf-av{width:26px;height:26px;border-radius:50%;background:var(--color-primary,#2B64D4);color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
        .zh-mf-txt{font-size:11px;color:rgba(255,255,255,0.65);line-height:1.4;flex:1;}
        .zh-mf-target{color:rgba(255,255,255,0.85);font-weight:500;}
        .zh-mf-time{font-size:10px;color:rgba(255,255,255,0.35);white-space:nowrap;}

        /* STATS STRIP */
        .zh-stats{display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid var(--color-border-light,#EEE);border-bottom:1px solid var(--color-border-light,#EEE);background:var(--color-surface-primary,#fff);}
        @media(max-width:700px){.zh-stats{grid-template-columns:repeat(2,1fr);}}
        .zh-stat{padding:36px 20px;text-align:center;border-right:1px solid var(--color-border-light,#EEE);position:relative;transition:background 0.2s;}
        .zh-stat:last-child{border-right:none;}
        .zh-stat:hover{background:var(--color-surface-secondary,#F5F5F5);}
        .zh-stat::after{content:'';position:absolute;bottom:0;left:0;right:0;height:3px;background:var(--acc);opacity:0;transition:opacity 0.2s;}
        .zh-stat:hover::after{opacity:1;}
        .zh-stat-icon{width:48px;height:48px;border-radius:13px;background:var(--acc);display:flex;align-items:center;justify-content:center;margin:0 auto 14px;transition:transform 0.2s;}
        .zh-stat:hover .zh-stat-icon{transform:scale(1.1);}
        .zh-stat-val{font-family:'Playfair Display',serif;font-size:2.2rem;font-weight:800;color:var(--acc);margin-bottom:4px;}
        .zh-stat-lbl{font-size:12px;color:var(--color-text-secondary,#4A4A48);}

        /* SECTIONS */
        .zh-section{padding:72px 0;}
        .zh-alt{background:var(--color-surface-secondary,#F5F5F5);border-top:1px solid var(--color-border-light,#EEE);border-bottom:1px solid var(--color-border-light,#EEE);}
        .zh-section-inner{max-width:1200px;margin:0 auto;padding:0 24px;}
        .zh-section-head{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:36px;flex-wrap:wrap;gap:14px;}
        .zh-section-head.zh-center{flex-direction:column;align-items:center;text-align:center;}
        .zh-section-h2{font-family:'Playfair Display',serif;font-size:clamp(1.7rem,3.5vw,2.6rem);font-weight:800;color:var(--color-text-primary,#111);line-height:1.2;}
        .zh-section-h2 em{font-style:italic;color:var(--color-primary,#2B64D4);}
        .zh-section-sub{font-size:15px;color:var(--color-text-secondary,#4A4A48);font-weight:300;max-width:500px;margin-top:10px;line-height:1.7;}
        .zh-see-all{display:inline-flex;align-items:center;gap:5px;font-size:13px;font-weight:600;color:var(--color-primary,#2B64D4);text-decoration:none;padding:9px 18px;border:1px solid var(--color-border-default,#E0E0E0);border-radius:8px;transition:all 0.15s;}
        .zh-see-all:hover{border-color:var(--color-primary,#2B64D4);background:rgba(43,100,212,0.04);}

        /* CATEGORY FILTER */
        .zh-cat-filter{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:32px;}
        .zh-cat-pill{padding:7px 16px;border-radius:100px;font-family:'Outfit',sans-serif;font-size:13px;font-weight:500;background:var(--color-surface-secondary,#F5F5F5);border:1px solid var(--color-border-light,#EEE);color:var(--color-text-secondary,#4A4A48);cursor:pointer;transition:all 0.18s;}
        .zh-cat-pill:hover{border-color:var(--color-primary,#2B64D4);color:var(--color-primary,#2B64D4);}
        .zh-cat-active{background:var(--color-primary,#2B64D4)!important;border-color:var(--color-primary,#2B64D4)!important;color:#fff!important;}

        /* TREND CARDS */
        /* ╔══ TRENDING CARDS — Bookmarks-style design ══╗ */
        .zh-trend-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:24px;}
        @media(max-width:1200px){.zh-trend-grid{grid-template-columns:repeat(2,1fr);}}
        @media(max-width:768px){.zh-trend-grid{grid-template-columns:1fr;}}
        
        .zh-trend-card{display:flex;flex-direction:column;border-radius:20px;overflow:hidden;background:var(--color-surface-primary,#fff);border:1px solid rgba(0,0,0,0.04);box-shadow:0 2px 8px rgba(0,0,0,0.08);text-decoration:none;transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1);position:relative;animation:fadeUp 0.5s ease both;}
        .zh-tc-top{height:4px;background:linear-gradient(90deg,var(--ca),rgba(var(--ca),0.5));}
        .zh-trend-card:hover{transform:translateY(-12px);box-shadow:0 20px 40px rgba(0,0,0,0.12);border-color:var(--ca);}
        
        .zh-tc-img-wrap{position:relative;height:200px;overflow:hidden;background:linear-gradient(135deg,var(--ca),rgba(var(--ca),0.6));}
        .zh-tc-img{width:100%;height:100%;object-fit:cover;transition:transform 0.5s cubic-bezier(0.34,1.56,0.64,1);}
        .zh-trend-card:hover .zh-tc-img{transform:scale(1.1) rotate(1deg);}
        .zh-tc-ov{position:absolute;inset:0;background:linear-gradient(180deg,transparent 50%,rgba(0,0,0,0.4) 100%);}
        
        .zh-tc-badge{position:absolute;top:14px;left:14px;background:rgba(255,255,255,0.95);color:var(--ca);font-size:11px;font-weight:700;padding:5px 12px;border-radius:20px;z-index:10;box-shadow:0 4px 12px rgba(0,0,0,0.15);border:1.5px solid var(--ca);}
        .zh-tc-rank{position:absolute;bottom:14px;right:14px;font-family:'Playfair Display',serif;font-size:2.2rem;font-weight:800;color:rgba(255,255,255,0.12);}
        
        .zh-tc-body{padding:20px;flex:1;display:flex;flex-direction:column;gap:10px;}
        .zh-tc-title{font-family:'Playfair Display',serif;font-size:1.15rem;font-weight:800;color:var(--color-text-primary,#111);line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
        .zh-trend-card:hover .zh-tc-title{color:var(--ca);}
        .zh-tc-desc{font-size:13px;color:var(--color-text-secondary,#4A4A48);line-height:1.5;flex:1;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
        
        .zh-tc-footer{display:flex;align-items:center;justify-content:space-between;padding-top:12px;border-top:1px solid rgba(0,0,0,0.05);}
        .zh-tc-author{display:flex;align-items:center;gap:8px;}
        .zh-tc-av{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,var(--ca),rgba(var(--ca),0.7));color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
        .zh-tc-aname{font-size:12px;font-weight:600;color:var(--color-text-primary,#111);}
        .zh-tc-read{font-size:11px;color:var(--color-text-muted,#B0B0AD);}
        .zh-tc-stats{display:flex;gap:10px;margin-left:auto;}
        .zh-tc-s{display:flex;align-items:center;gap:3px;font-size:12px;color:var(--color-text-muted,#B0B0AD);}
        
        @keyframes fadeUp { from{opacity:0;transform:translateY(22px);}to{opacity:1;transform:translateY(0);} }

        /* TRENDING TOPICS */
        .zh-topics-wrap{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;}
        .zh-topic-tag{display:inline-flex;align-items:center;gap:6px;padding:9px 18px;border-radius:100px;background:var(--color-surface-primary,#fff);border:1px solid var(--color-border-default,#E0E0E0);text-decoration:none;transition:all 0.18s;}
        .zh-topic-tag:hover{border-color:var(--color-primary,#2B64D4);background:rgba(43,100,212,0.04);transform:translateY(-2px);}
        .zh-topic-flame{color:var(--color-error,#CC2E2E);}
        .zh-topic-name{font-size:13px;font-weight:600;color:var(--color-text-primary,#111);}
        .zh-topic-count{font-size:11px;color:var(--color-text-muted,#B0B0AD);}

        /* HOW IT WORKS */
        .zh-hiw-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:0;position:relative;}
        @media(max-width:900px){.zh-hiw-grid{grid-template-columns:repeat(2,1fr);gap:16px;}}
        @media(max-width:540px){.zh-hiw-grid{grid-template-columns:1fr;gap:14px;}}
        .zh-hiw-card{position:relative;background:var(--color-surface-primary,#fff);border:1px solid var(--color-border-light,#EEE);border-radius:16px;padding:28px 22px;margin:0 8px;transition:transform 0.22s,box-shadow 0.22s;}
        .zh-hiw-card:first-child{margin-left:0;}.zh-hiw-card:last-child{margin-right:0;}
        .zh-hiw-card:hover{transform:translateY(-4px);box-shadow:0 10px 26px rgba(26,24,22,0.09);}
        @media(max-width:900px){.zh-hiw-card{margin:0;}}
        .zh-hiw-step{font-family:'Playfair Display',serif;font-size:2.5rem;font-weight:800;color:var(--color-border-default,#E0E0E0);line-height:1;margin-bottom:12px;}
        .zh-hiw-icon{width:42px;height:42px;border-radius:11px;background:var(--hc);display:flex;align-items:center;justify-content:center;margin-bottom:14px;}
        .zh-hiw-title{font-family:'Playfair Display',serif;font-size:1rem;font-weight:700;color:var(--color-text-primary,#111);margin-bottom:8px;}
        .zh-hiw-desc{font-size:12px;color:var(--color-text-secondary,#4A4A48);line-height:1.7;}
        .zh-hiw-arr{position:absolute;right:-16px;top:50%;transform:translateY(-50%);font-size:18px;color:var(--color-border-default,#E0E0E0);z-index:2;}
        @media(max-width:900px){.zh-hiw-arr{display:none;}}

        /* FEATURES */
        .zh-feat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;}
        @media(max-width:900px){.zh-feat-grid{grid-template-columns:repeat(2,1fr);}}
        @media(max-width:540px){.zh-feat-grid{grid-template-columns:1fr;}}
        .zh-feat-card{background:var(--color-surface-primary,#fff);border:1px solid var(--color-border-light,#EEE);border-radius:16px;padding:24px 20px;position:relative;overflow:hidden;box-shadow:0 2px 8px rgba(26,24,22,0.05);transition:transform 0.22s,box-shadow 0.22s;}
        .zh-feat-card:hover{transform:translateY(-4px);box-shadow:0 10px 26px rgba(26,24,22,0.09);}
        .zh-feat-icon{width:42px;height:42px;border-radius:11px;background:var(--fc);display:flex;align-items:center;justify-content:center;margin-bottom:14px;}
        .zh-feat-title{font-family:'Playfair Display',serif;font-size:1rem;font-weight:700;color:var(--color-text-primary,#111);margin-bottom:7px;}
        .zh-feat-desc{font-size:12px;color:var(--color-text-secondary,#4A4A48);line-height:1.65;}
        .zh-feat-bar{position:absolute;bottom:0;left:0;right:0;height:2px;background:var(--fc);opacity:0;transition:opacity 0.2s;}
        .zh-feat-card:hover .zh-feat-bar{opacity:1;}

        /* WRITERS */
        .zh-writers-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
        @media(max-width:900px){.zh-writers-grid{grid-template-columns:1fr;}}
        .zh-writer-card{background:var(--color-surface-primary,#fff);border:1px solid var(--color-border-light,#EEE);border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(26,24,22,0.06);cursor:pointer;transition:transform 0.22s,box-shadow 0.22s;}
        .zh-writer-card:hover{transform:translateY(-4px);box-shadow:0 10px 26px rgba(26,24,22,0.1);}
        .zh-wc-header{height:72px;background:linear-gradient(135deg,var(--color-primary,#2B64D4),var(--color-primary-dark,#1A3F8A));}
        .zh-wc-body{padding:0 22px 22px;}
        .zh-wc-av-wrap{position:relative;display:inline-block;margin-top:-32px;margin-bottom:12px;}
        .zh-wc-av{width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,var(--color-primary,#2B64D4),var(--color-secondary,#1E8A56));color:#fff;font-size:24px;font-weight:800;display:flex;align-items:center;justify-content:center;border:3px solid var(--color-surface-primary,#fff);overflow:hidden;font-family:'Playfair Display',serif;}
        .zh-wc-av-img{width:100%;height:100%;object-fit:cover;}
        .zh-wc-verified{position:absolute;bottom:1px;right:1px;width:20px;height:20px;border-radius:50%;background:var(--color-primary,#2B64D4);color:#fff;display:flex;align-items:center;justify-content:center;border:2px solid #fff;}
        .zh-wc-name{font-family:'Playfair Display',serif;font-size:1rem;font-weight:700;color:var(--color-text-primary,#111);margin-bottom:2px;}
        .zh-wc-handle{font-size:11px;color:var(--color-text-muted,#B0B0AD);margin-bottom:9px;}
        .zh-wc-specialty{display:inline-block;font-size:10px;font-weight:600;background:rgba(43,100,212,0.08);color:var(--color-primary,#2B64D4);border:1px solid rgba(43,100,212,0.18);padding:3px 10px;border-radius:100px;margin-bottom:16px;}
        .zh-wc-stats{display:flex;align-items:center;justify-content:center;gap:14px;margin-bottom:16px;}
        .zh-wcs{text-align:center;}
        .zh-wcs-v{font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:800;color:var(--color-text-primary,#111);display:block;}
        .zh-wcs-l{font-size:10px;color:var(--color-text-muted,#B0B0AD);}
        .zh-wcs-div{width:1px;height:28px;background:var(--color-border-light,#EEE);}
        .zh-follow-btn{display:block;width:100%;padding:10px;background:linear-gradient(135deg,var(--color-primary,#2B64D4),var(--color-primary-dark,#1A3F8A));color:#fff;border:none;border-radius:9px;font-family:'Outfit',sans-serif;font-size:12px;font-weight:600;cursor:pointer;transition:transform 0.15s,box-shadow 0.15s;box-shadow:0 3px 12px rgba(43,100,212,0.22);}
        .zh-follow-btn:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 6px 18px rgba(43,100,212,0.32);}
        .zh-follow-on{background:var(--color-surface-secondary,#F5F5F5)!important;color:var(--color-text-primary,#111)!important;box-shadow:none!important;border:1px solid var(--color-border-default,#E0E0E0);}
        .zh-follow-load{opacity:0.6;cursor:not-allowed;}

        /* ACTIVITY FEED */
        .zh-activity-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;}
        @media(max-width:700px){.zh-activity-grid{grid-template-columns:1fr;}}
        .zh-act-card{display:flex;align-items:flex-start;gap:12px;background:var(--color-surface-primary,#fff);border:1px solid var(--color-border-light,#EEE);border-radius:14px;padding:16px;box-shadow:0 2px 8px rgba(26,24,22,0.05);position:relative;}
        .zh-act-av{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,var(--color-primary,#2B64D4),var(--color-secondary,#1E8A56));color:#fff;font-size:14px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
        .zh-act-content{flex:1;}
        .zh-act-txt{font-size:13px;color:var(--color-text-primary,#111);line-height:1.5;margin-bottom:4px;}
        .zh-act-target{color:var(--color-primary,#2B64D4);font-weight:500;}
        .zh-act-time{display:flex;align-items:center;gap:4px;font-size:11px;color:var(--color-text-muted,#B0B0AD);}
        .zh-act-dot{position:absolute;top:14px;right:14px;width:7px;height:7px;border-radius:50%;background:var(--color-secondary,#1E8A56);animation:pulse 2s ease-in-out infinite;}

        /* TESTIMONIALS */
        .zh-test-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;}
        @media(max-width:900px){.zh-test-grid{grid-template-columns:1fr;}}
        .zh-test-card{background:var(--color-surface-primary,#fff);border:1px solid var(--color-border-light,#EEE);border-radius:16px;padding:26px;box-shadow:0 2px 8px rgba(26,24,22,0.06);transition:transform 0.22s,box-shadow 0.22s;}
        .zh-test-card:hover{transform:translateY(-3px);box-shadow:0 8px 22px rgba(26,24,22,0.09);}
        .zh-test-stars{display:flex;gap:3px;margin-bottom:12px;}
        .zh-star{color:var(--color-warning,#C49A3C);fill:var(--color-warning,#C49A3C);}
        .zh-quote-icon{color:rgba(43,100,212,0.12);margin-bottom:10px;}
        .zh-test-text{font-size:14px;line-height:1.7;color:var(--color-text-primary,#111);font-style:italic;margin-bottom:18px;}
        .zh-test-author{display:flex;align-items:center;gap:10px;}
        .zh-test-av{width:38px;height:38px;border-radius:50%;flex-shrink:0;background:linear-gradient(135deg,var(--color-primary,#2B64D4),var(--color-accent,#7040CC));color:#fff;font-size:15px;font-weight:700;display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;}
        .zh-test-name{font-size:13px;font-weight:600;color:var(--color-text-primary,#111);}
        .zh-test-role{font-size:11px;color:var(--color-text-muted,#B0B0AD);}

        /* CTA */
        .zh-cta{position:relative;overflow:hidden;background:linear-gradient(148deg,var(--color-primary-dark,#1A3F8A),var(--color-primary,#2B64D4));padding:90px 24px;text-align:center;}
        .zh-cta-g1{position:absolute;width:380px;height:380px;border-radius:50%;top:-100px;left:-80px;background:rgba(255,255,255,0.05);filter:blur(80px);pointer-events:none;}
        .zh-cta-g2{position:absolute;width:320px;height:320px;border-radius:50%;bottom:-80px;right:-60px;background:rgba(30,138,86,0.18);filter:blur(70px);pointer-events:none;}
        .zh-cta-inner{position:relative;z-index:2;max-width:620px;margin:0 auto;}
        .zh-cta-h2{font-family:'Playfair Display',serif;font-size:clamp(2rem,4.5vw,3.6rem);font-weight:800;line-height:1.15;color:#fff;margin:14px 0 14px;}
        .zh-cta-h2 em{font-style:italic;color:rgba(255,255,255,0.68);}
        .zh-cta-p{font-size:16px;color:rgba(255,255,255,0.6);font-weight:300;line-height:1.75;margin-bottom:32px;}
        .zh-cta-btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:18px;}
        .zh-cta-primary{display:inline-flex;align-items:center;gap:8px;padding:14px 32px;border-radius:10px;background:var(--color-surface-primary,#fff);color:var(--color-primary,#2B64D4);font-family:'Outfit',sans-serif;font-size:14px;font-weight:700;text-decoration:none;transition:transform 0.2s,box-shadow 0.2s;box-shadow:0 5px 20px rgba(0,0,0,0.18);}
        .zh-cta-primary:hover{transform:translateY(-2px);box-shadow:0 10px 30px rgba(0,0,0,0.24);}
        .zh-cta-ghost{display:inline-flex;align-items:center;gap:8px;padding:14px 28px;border-radius:10px;border:2px solid rgba(255,255,255,0.35);color:#fff;font-family:'Outfit',sans-serif;font-size:14px;font-weight:600;text-decoration:none;backdrop-filter:blur(8px);transition:all 0.2s;}
        .zh-cta-ghost:hover{background:rgba(255,255,255,0.1);border-color:rgba(255,255,255,0.65);}
        .zh-cta-fine{font-size:12px;color:rgba(255,255,255,0.35);}

        .zh-empty{text-align:center;padding:40px;color:var(--color-text-secondary,#4A4A48);}
        .zh-empty-span{grid-column:1/-1;}

        /* RESPONSIVE */
        @media(max-width:768px){
          .zh-hero{padding:60px 18px 80px;}
          .zh-section{padding:52px 0;}
          .zh-cta{padding:64px 18px;}
        }
        @media(max-width:480px){
          .zh-hero-h1{font-size:2.2rem;}
          .zh-hero-sub{font-size:14px;}
          .zh-section-h2{font-size:1.6rem;}
          .zh-hiw-grid,.zh-feat-grid{gap:12px;}
        }
      `}</style>
    </div>
  )
}

export default Home