import React, { useState } from 'react'
import {
  Sparkles, Users, Zap, TrendingUp, Award, Heart,
  BookOpen, PenLine, Globe, Star, MessageSquare,
  ArrowRight, Play, ChevronRight, Rss, Share2,
  Shield, Lightbulb, Rocket, Target, CheckCircle
} from 'lucide-react'

const AboutUS = () => {
  const [activeValue, setActiveValue] = useState(0)

  // ── EXISTING DATA preserved exactly ──
  const steps = [
    { number: '01', title: 'Ideation', description: 'We brainstorm innovative ideas and select the most impactful stories to bring to life.', highlighted: true },
    { number: '02', title: 'Curate & Analyze', description: 'Our team evaluates content quality to ensure relevance and value for our readers.', highlighted: false },
    { number: '03', title: 'Publish & Share', description: 'Content is seamlessly published, reaching the right audience at the right time.', highlighted: false },
  ]

  const stats = [
    { icon: Users, label: 'Active Creators', value: '50K+', accent: 'var(--color-primary,#2B64D4)', bgClass: 'bg-primary', textClass: 'text-primary' },
    { icon: TrendingUp, label: 'Published Blogs', value: '12K+', accent: 'var(--color-secondary,#1E8A56)', bgClass: 'bg-secondary', textClass: 'text-secondary' },
    { icon: Award, label: 'Featured Authors', value: '800+', accent: 'var(--color-accent,#7040CC)', bgClass: 'bg-accent', textClass: 'text-accent' },
    { icon: Heart, label: 'Community Loves', value: '120K+', accent: 'var(--color-success,#5A8C6E)', bgClass: 'bg-success', textClass: 'text-success' },
  ]

  const values = [
    { icon: Sparkles, title: 'Innovation', description: 'We constantly explore new ways to inspire creativity and push what a blogging platform can do.' },
    { icon: Users, title: 'Community', description: 'Fostering deep connections among writers and readers worldwide — great writing deserves great conversation.' },
    { icon: Zap, title: 'Empowerment', description: 'Providing the tools, visibility, and opportunities every writer needs to amplify their unique voice.' },
  ]

  // ── NEW DATA ──
  const platformFeatures = [
    { icon: PenLine, title: 'Rich Editor', desc: 'A distraction-free, powerful editor with markdown, embeds, and real-time preview.', color: 'var(--color-primary,#2B64D4)' },
    { icon: TrendingUp, title: 'Smart Analytics', desc: 'Deep insights into who reads your work, where they come from, and what resonates.', color: 'var(--color-secondary,#1E8A56)' },
    { icon: Users, title: 'Follow & Feed', desc: 'Follow writers you love. Build a personalized reading feed that gets smarter daily.', color: 'var(--color-accent,#7040CC)' },
    { icon: MessageSquare, title: 'Comments & Threads', desc: 'Spark conversations with threaded comments, reactions, and reply notifications.', color: 'var(--color-warning,#C49A3C)' },
    { icon: Share2, title: 'Social Sharing', desc: 'One-click sharing to Twitter, LinkedIn, and WhatsApp with auto-generated cards.', color: 'var(--color-error,#CC2E2E)' },
    { icon: Shield, title: 'Content Safety', desc: 'AI-assisted moderation ensures Zarrin stays welcoming, respectful, and spam-free.', color: 'var(--color-success,#5A8C6E)' },
    { icon: Rss, title: 'RSS & Newsletter', desc: "Let readers subscribe to your posts via RSS or a built-in email newsletter.", color: 'var(--color-primary,#2B64D4)' },
    { icon: Globe, title: 'Global Reach', desc: 'Multi-language support with auto-translation so your story crosses every border.', color: 'var(--color-secondary,#1E8A56)' },
  ]

  const milestones = [
    { year: '2022', title: 'The Idea', desc: 'Zarrin was born in a Lucknow apartment — two writers tired of platforms that ignored their craft.' },
    { year: '2023', title: 'Beta Launch', desc: 'First 500 writers joined. Community features, comments, and the follow system shipped.' },
    { year: '2024', title: 'Going Global', desc: 'Crossed 50,000 writers across 60 countries. Analytics, newsletters, and mobile app launched.' },
    { year: '2025', title: "What's Next", desc: 'AI writing assistant, monetization tools, and a creator fund for emerging voices.' },
  ]

  const testimonials = [
    { quote: "Zarrin gave me the confidence to share my stories. I now have 8,000 followers I'd never have found elsewhere.", author: "Priya Sharma", role: "Travel Writer, Mumbai", rating: 5 },
    { quote: "The analytics are incredible. I understand my audience so much better. My engagement tripled in 3 months.", author: "Rahul Mehta", role: "Tech Blogger, Bangalore", rating: 5 },
    { quote: "Finally a platform that treats writers like professionals. The editor, the community — everything just works.", author: "Ananya Verma", role: "Fiction Author, Delhi", rating: 5 },
  ]

  const teamValues = [
    { icon: Lightbulb, title: 'Creator Economy', desc: "We believe the best writing deserves sustainable income. We're building monetization that's actually fair." },
    { icon: Rocket, title: 'Ship Fast', desc: 'We release features every two weeks based directly on community feedback. Your voice shapes the product.' },
    { icon: Target, title: 'Quality > Quantity', desc: 'Every decision is measured by whether it helps writers succeed — never by vanity metrics.' },
    { icon: Globe, title: 'Truly Global', desc: 'Hindi, Bengali, Tamil, or English — every language deserves a world-class writing platform.' },
  ]

  return (
    <div className="zau-root">

      {/* ══ HERO ══ */}
      <section className="zau-hero">
        <div className="zau-hero-grid" />
        <div className="zau-orb zau-o1" />
        <div className="zau-orb zau-o2" />
        <div className="zau-orb zau-o3" />

        <div className="zau-hero-inner">
          <div className="zau-badge"><Sparkles size={13} />Our Story</div>
          <h1 className="zau-hero-h1">Empowering<br /><em>Creative Voices</em></h1>
          <p className="zau-hero-sub">
            Zarrin Blogs is a home for writers and readers. We amplify unique stories, inspire creativity, and foster a thriving community where ideas come to life — one post at a time.
          </p>
          <div className="zau-hero-btns">
            <a href="/signup" className="zau-btn-primary"><PenLine size={15} />Start Writing Free</a>
            <a href="/blog" className="zau-btn-ghost"><Play size={14} />Explore Stories</a>
          </div>
        </div>

        <div className="zau-float-pills">
          {[['✍️','50K+','Writers'],['📖','2M+','Readers'],['⭐','4.9','Rating'],['🌍','60+','Countries']].map(([e,v,l],i)=>(
            <div key={i} className="zau-pill" style={{animationDelay:`${i*0.1}s`}}>
              <span>{e}</span><span className="zau-pill-val">{v}</span><span className="zau-pill-lbl">{l}</span>
            </div>
          ))}
        </div>
        <div className="zau-wave"><svg viewBox="0 0 1440 64" fill="none" preserveAspectRatio="none"><path d="M0 32 Q360 64 720 32 Q1080 0 1440 32 L1440 64 L0 64 Z" fill="var(--color-neutral-50,#FAF8F5)"/></svg></div>
      </section>

      {/* ══ STATS ══ */}
      <section className="zau-stats-sec">
        <div className="zau-stats-grid">
          {stats.map((s,i)=>{ const Icon=s.icon; return(
            <div key={i} className="zau-stat-card" style={{'--sa':s.accent}}>
              <div className="zau-sc-bar"/>
              <div className="zau-sc-icon"><Icon size={20} color="#fff"/></div>
              <p className="zau-sc-val">{s.value}</p>
              <p className="zau-sc-lbl">{s.label}</p>
            </div>
          )})}
        </div>
      </section>

      {/* ══ MISSION & VALUES ══ */}
      <section className="zau-mission">
        <div className="zau-mission-inner">
          <div className="zau-mission-text">
            <div className="zau-badge zau-badge-light"><Sparkles size={13}/>Our Mission</div>
            <h2 className="zau-sec-h2">Making<br /><em>Ideas Matter</em></h2>
            <p className="zau-mission-p">
              We provide a platform for creators to share their authentic voices, reach audiences, and grow communities around ideas that inspire and transform. Every post on Zarrin is a statement that your story deserves to be heard.
            </p>
            <div className="zau-val-tabs">
              {values.map((v,i)=>(
                <button key={i} onClick={()=>setActiveValue(i)} className={`zau-val-tab ${activeValue===i?'zau-val-active':''}`}>{v.title}</button>
              ))}
            </div>
            <div className="zau-val-panel">
              {(()=>{const Icon=values[activeValue].icon;return(<><div className="zau-vp-icon"><Icon size={18} color="#fff"/></div><div><p className="zau-vp-title">{values[activeValue].title}</p><p className="zau-vp-desc">{values[activeValue].description}</p></div></>);})()}
            </div>
            <a href="/blog" className="zau-mission-link">Explore our community <ArrowRight size={14}/></a>
          </div>
          <div className="zau-mission-img">
            <div className="zau-img-glow"/>
            <img src="/Assets/group.png" alt="Our Team" className="zau-team-img"/>
            <div className="zau-img-ov"/>
            <div className="zau-img-badge"><Star size={14} className="zau-img-star"/><span className="zau-img-rating">4.9★ Community Rating</span></div>
          </div>
        </div>
      </section>

      {/* ══ PLATFORM FEATURES ══ */}
      <section className="zau-features">
        <div className="zau-feat-inner">
          <div className="zau-cen-head">
            <div className="zau-badge zau-badge-light"><Zap size={13}/>Platform Features</div>
            <h2 className="zau-sec-h2">Everything a Writer <em>Could Need</em></h2>
            <p className="zau-cen-sub">Built by writers, for writers. Every feature exists because our community asked for it.</p>
          </div>
          <div className="zau-feat-grid">
            {platformFeatures.map((f,i)=>{const Icon=f.icon;return(
              <div key={i} className="zau-feat-card" style={{'--fa':f.color}}>
                <div className="zau-fc-icon"><Icon size={17} color="#fff"/></div>
                <h3 className="zau-fc-title">{f.title}</h3>
                <p className="zau-fc-desc">{f.desc}</p>
                <div className="zau-fc-bar"/>
              </div>
            )})}
          </div>
        </div>
      </section>

      {/* ══ HOW WE WORK ══ */}
      <section className="zau-how">
        <div className="zau-how-inner">
          <div className="zau-cen-head">
            <div className="zau-badge zau-badge-light"><BookOpen size={13}/>How We Work</div>
            <h2 className="zau-sec-h2">From Idea to <em>Global Audience</em></h2>
            <p className="zau-cen-sub">Our streamlined process gets your words in front of the right readers, fast.</p>
          </div>

          <div className="zau-steps-row">
            {steps.map((step,i)=>(
              <div key={i} className={`zau-step ${step.highlighted?'zau-step-hl':''}`}>
                <div className="zau-step-num">{step.number}</div>
                <h3 className="zau-step-title">{step.title}</h3>
                <p className="zau-step-desc">{step.description}</p>
                {i<steps.length-1&&<div className="zau-step-arr">→</div>}
              </div>
            ))}
          </div>

          <div className="zau-process-extra">
            {['Auto-save every 30 seconds — never lose a word','SEO-optimized meta tags generated automatically','Social cards created for every published post','Distributed to followers\' feeds within seconds'].map((t,i)=>(
              <div key={i} className="zau-pe"><CheckCircle size={14} className="zau-pe-icon"/><span>{t}</span></div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ JOURNEY TIMELINE ══ */}
      <section className="zau-journey">
        <div className="zau-journey-inner">
          <div className="zau-cen-head">
            <div className="zau-badge zau-badge-light"><Rocket size={13}/>Our Journey</div>
            <h2 className="zau-sec-h2">From Bedroom Startup to <em>Global Platform</em></h2>
          </div>
          <div className="zau-tl">
            <div className="zau-tl-line"/>
            {milestones.map((m,i)=>(
              <div key={i} className={`zau-tl-item ${i%2===0?'zau-tl-l':'zau-tl-r'}`}>
                <div className="zau-tl-card">
                  <span className="zau-tl-year">{m.year}</span>
                  <h3 className="zau-tl-title">{m.title}</h3>
                  <p className="zau-tl-desc">{m.desc}</p>
                </div>
                <div className="zau-tl-dot"/>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ WHAT DRIVES US ══ */}
      <section className="zau-drives">
        <div className="zau-drives-inner">
          <div className="zau-cen-head">
            <div className="zau-badge zau-badge-light"><Target size={13}/>What Drives Us</div>
            <h2 className="zau-sec-h2">Our Commitments to <em>Every Writer</em></h2>
          </div>
          <div className="zau-drives-grid">
            {teamValues.map((tv,i)=>{const Icon=tv.icon;return(
              <div key={i} className="zau-drive-card">
                <div className="zau-drive-icon"><Icon size={20} color="#fff"/></div>
                <h3 className="zau-drive-title">{tv.title}</h3>
                <p className="zau-drive-desc">{tv.desc}</p>
              </div>
            )})}
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section className="zau-tests">
        <div className="zau-tests-inner">
          <div className="zau-cen-head">
            <div className="zau-badge zau-badge-light"><Star size={13}/>Loved by Writers</div>
            <h2 className="zau-sec-h2">Real Stories from <em>Real Writers</em></h2>
          </div>
          <div className="zau-test-grid">
            {testimonials.map((t,i)=>(
              <div key={i} className="zau-test-card">
                <div className="zau-test-stars">{[...Array(t.rating)].map((_,j)=><Star key={j} size={13} className="zau-star"/>)}</div>
                <p className="zau-test-q">"{t.quote}"</p>
                <div className="zau-test-auth"><div className="zau-test-av">{t.author[0]}</div><div><p className="zau-test-name">{t.author}</p><p className="zau-test-role">{t.role}</p></div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="zau-cta">
        <div className="zau-cta-g1"/><div className="zau-cta-g2"/>
        <div className="zau-cta-inner">
          <div className="zau-badge zau-badge-white"><Sparkles size={13}/>Join the Movement</div>
          <h2 className="zau-cta-h2">Join Our Vibrant<br /><em>Community</em></h2>
          <p className="zau-cta-p">Connect with writers, share ideas, and grow together in a platform designed to make your voice heard — by readers all around the world.</p>
          <div className="zau-cta-btns">
            <a href="/signup" className="zau-cta-pri"><Sparkles size={15}/>Join Now — It's Free</a>
            <a href="/contact" className="zau-cta-gho">Contact Us<ChevronRight size={14}/></a>
          </div>
          <p className="zau-cta-fine">No credit card · Cancel anytime · 50K+ writers already here</p>
        </div>
      </section>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=Outfit:wght@300;400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

        .zau-root{font-family:'Outfit',sans-serif;background:var(--color-neutral-50,#FAF8F5);color:var(--color-text-primary,#111);overflow-x:hidden;}

        @keyframes fadeUp{from{opacity:0;transform:translateY(22px);}to{opacity:1;transform:translateY(0);}}
        @keyframes drift{0%,100%{transform:translate(0,0) scale(1);}40%{transform:translate(20px,-26px) scale(1.06);}70%{transform:translate(-14px,16px) scale(0.96);}}
        @keyframes blob{0%,100%{transform:translate(0,0) scale(1);}33%{transform:translate(30px,-40px) scale(1.1);}66%{transform:translate(-20px,20px) scale(0.9);}}
        .animate-blob{animation:blob 8s infinite;}.animation-delay-2000{animation-delay:2s;}.animation-delay-4000{animation-delay:4s;}

        /* HERO */
        .zau-hero{position:relative;overflow:hidden;background:linear-gradient(148deg,var(--color-primary-dark,#1A3F8A) 0%,var(--color-primary,#2B64D4) 55%,#2468d4 100%);padding:90px 24px 80px;text-align:center;display:flex;flex-direction:column;align-items:center;}
        .zau-hero-grid{position:absolute;inset:0;pointer-events:none;background-image:linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px);background-size:52px 52px;}
        .zau-orb{position:absolute;border-radius:50%;filter:blur(80px);pointer-events:none;}
        .zau-o1{width:360px;height:360px;top:-80px;left:-60px;background:rgba(255,255,255,0.07);animation:drift 11s ease-in-out infinite;}
        .zau-o2{width:280px;height:280px;bottom:-20px;right:-50px;background:rgba(30,138,86,0.18);animation:drift 9s ease-in-out infinite reverse;}
        .zau-o3{width:200px;height:200px;top:35%;left:55%;background:rgba(112,64,204,0.12);animation:drift 13s ease-in-out infinite 2s;}
        .zau-hero-inner{position:relative;z-index:2;max-width:720px;margin:0 auto 40px;animation:fadeUp 0.7s ease both;}

        .zau-badge{display:inline-flex;align-items:center;gap:7px;background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.22);color:rgba(255,255,255,0.9);backdrop-filter:blur(8px);font-family:'Outfit',sans-serif;font-size:11px;font-weight:600;letter-spacing:0.07em;text-transform:uppercase;padding:7px 16px;border-radius:100px;margin-bottom:24px;}
        .zau-badge-light{background:rgba(43,100,212,0.08);border-color:rgba(43,100,212,0.25);color:var(--color-primary,#2B64D4);}
        .zau-badge-white{background:rgba(255,255,255,0.14);border-color:rgba(255,255,255,0.28);color:rgba(255,255,255,0.9);}

        .zau-hero-h1{font-family:'Playfair Display',serif;font-size:clamp(2.8rem,6vw,5rem);font-weight:800;line-height:1.1;color:#fff;margin-bottom:18px;text-shadow:0 4px 32px rgba(0,0,0,0.2);}
        .zau-hero-h1 em{font-style:italic;color:rgba(255,255,255,0.7);}
        .zau-hero-sub{font-size:17px;line-height:1.75;color:rgba(255,255,255,0.65);font-weight:300;max-width:560px;margin:0 auto 30px;}
        .zau-hero-btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;}
        .zau-btn-primary{display:inline-flex;align-items:center;gap:8px;padding:13px 28px;border-radius:10px;background:var(--color-surface-primary,#fff);color:var(--color-primary,#2B64D4);font-family:'Outfit',sans-serif;font-size:14px;font-weight:700;text-decoration:none;transition:transform 0.2s,box-shadow 0.2s;box-shadow:0 4px 18px rgba(0,0,0,0.15);}
        .zau-btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(0,0,0,0.2);}
        .zau-btn-ghost{display:inline-flex;align-items:center;gap:8px;padding:13px 24px;border-radius:10px;border:2px solid rgba(255,255,255,0.35);color:#fff;font-family:'Outfit',sans-serif;font-size:14px;font-weight:600;text-decoration:none;backdrop-filter:blur(8px);transition:all 0.2s;}
        .zau-btn-ghost:hover{background:rgba(255,255,255,0.1);border-color:rgba(255,255,255,0.65);}

        .zau-float-pills{position:relative;z-index:3;margin:0;margin-bottom:40px;display:flex;gap:12px;flex-wrap:wrap;justify-content:center;padding:0 24px;width:100%;}
        .zau-pill{display:inline-flex;align-items:center;gap:6px;background:var(--color-surface-primary,#fff);border:1px solid var(--color-border-default,#E0E0E0);padding:10px 18px;border-radius:100px;box-shadow:0 4px 14px rgba(26,24,22,0.1);animation:fadeUp 0.6s ease both;transition:transform 0.2s,box-shadow 0.2s;}
        .zau-pill:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(26,24,22,0.15);}
        .zau-pill-val{font-family:'Playfair Display',serif;font-size:0.95rem;font-weight:800;color:var(--color-primary,#2B64D4);}
        .zau-pill-lbl{font-size:11px;color:var(--color-text-secondary,#4A4A48);}
        .zau-wave{position:absolute;bottom:-1px;left:0;right:0;height:64px;}
        .zau-wave svg{width:100%;height:100%;}

        /* STATS */
        .zau-stats-sec{padding:56px 24px 56px;max-width:1200px;margin:0 auto;}
        .zau-stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;}
        @media(max-width:900px){.zau-stats-grid{grid-template-columns:repeat(2,1fr);}}
        @media(max-width:500px){.zau-stats-grid{grid-template-columns:1fr;}}
        .zau-stat-card{background:var(--color-surface-primary,#fff);border:1px solid var(--color-border-light,#EEE);border-radius:18px;padding:28px 20px;position:relative;overflow:hidden;box-shadow:0 2px 10px rgba(26,24,22,0.06);transition:transform 0.22s,box-shadow 0.22s;animation:fadeUp 0.6s ease both;}
        .zau-stat-card:hover{transform:translateY(-4px);box-shadow:0 10px 28px rgba(26,24,22,0.1);}
        .zau-sc-bar{position:absolute;top:0;left:0;right:0;height:3px;background:var(--sa);}
        .zau-sc-icon{width:44px;height:44px;border-radius:11px;background:var(--sa);display:flex;align-items:center;justify-content:center;margin-bottom:16px;}
        .zau-sc-val{font-family:'Playfair Display',serif;font-size:2.5rem;font-weight:800;color:var(--color-text-primary,#111);line-height:1;margin-bottom:5px;}
        .zau-sc-lbl{font-size:13px;color:var(--color-text-secondary,#4A4A48);}

        /* MISSION */
        .zau-mission{background:var(--color-surface-primary,#fff);padding:72px 24px;}
        .zau-mission-inner{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:72px;align-items:center;}
        @media(max-width:900px){.zau-mission-inner{grid-template-columns:1fr;gap:48px;}}
        .zau-sec-h2{font-family:'Playfair Display',serif;font-size:clamp(1.9rem,3.8vw,3rem);font-weight:800;line-height:1.15;color:var(--color-text-primary,#111);margin-bottom:16px;}
        .zau-sec-h2 em{font-style:italic;color:var(--color-primary,#2B64D4);}
        .zau-mission-p{font-size:15px;line-height:1.8;color:var(--color-text-secondary,#4A4A48);font-weight:300;margin-bottom:22px;}
        .zau-val-tabs{display:flex;gap:7px;margin-bottom:14px;flex-wrap:wrap;}
        .zau-val-tab{padding:7px 16px;border-radius:100px;font-family:'Outfit',sans-serif;font-size:13px;font-weight:500;background:var(--color-surface-secondary,#F5F5F5);border:1px solid var(--color-border-light,#EEE);color:var(--color-text-secondary,#4A4A48);cursor:pointer;transition:all 0.18s;}
        .zau-val-tab:hover{border-color:var(--color-primary,#2B64D4);color:var(--color-primary,#2B64D4);}
        .zau-val-active{background:var(--color-primary,#2B64D4)!important;border-color:var(--color-primary,#2B64D4)!important;color:#fff!important;}
        .zau-val-panel{display:flex;align-items:flex-start;gap:13px;background:var(--color-surface-secondary,#F5F5F5);border:1px solid var(--color-border-light,#EEE);border-radius:13px;padding:18px;margin-bottom:22px;animation:fadeUp 0.3s ease both;}
        .zau-vp-icon{width:38px;height:38px;border-radius:9px;flex-shrink:0;background:var(--color-primary,#2B64D4);display:flex;align-items:center;justify-content:center;}
        .zau-vp-title{font-family:'Playfair Display',serif;font-size:1rem;font-weight:700;color:var(--color-text-primary,#111);margin-bottom:4px;}
        .zau-vp-desc{font-size:13px;color:var(--color-text-secondary,#4A4A48);line-height:1.6;}
        .zau-mission-link{display:inline-flex;align-items:center;gap:7px;font-size:14px;font-weight:600;color:var(--color-primary,#2B64D4);text-decoration:none;transition:gap 0.2s;}
        .zau-mission-link:hover{gap:11px;}

        .zau-mission-img{position:relative;}
        .zau-img-glow{position:absolute;inset:-10px;background:rgba(43,100,212,0.08);border-radius:24px;filter:blur(20px);opacity:0.6;animation:drift 6s ease-in-out infinite;pointer-events:none;}
        .zau-team-img{position:relative;width:100%;border-radius:20px;box-shadow:0 16px 48px rgba(26,24,22,0.15);border:1px solid var(--color-border-default,#E0E0E0);transition:transform 0.4s;display:block;}
        .zau-mission-img:hover .zau-team-img{transform:scale(1.02);}
        .zau-img-ov{position:absolute;inset:0;background:linear-gradient(to top,rgba(43,100,212,0.2),transparent 50%);border-radius:20px;pointer-events:none;}
        .zau-img-badge{position:absolute;bottom:16px;left:16px;background:rgba(255,255,255,0.95);border-radius:12px;padding:11px 15px;display:flex;align-items:center;gap:7px;box-shadow:0 5px 18px rgba(0,0,0,0.12);}
        .zau-img-star{color:var(--color-warning,#C49A3C);}
        .zau-img-rating{font-size:12px;font-weight:600;color:var(--color-text-primary,#111);}

        /* FEATURES */
        .zau-features{background:var(--color-surface-secondary,#F5F5F5);border-top:1px solid var(--color-border-light,#EEE);padding:72px 24px;}
        .zau-feat-inner,.zau-how-inner,.zau-journey-inner,.zau-drives-inner,.zau-tests-inner{max-width:1200px;margin:0 auto;}
        .zau-feat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;}
        @media(max-width:1000px){.zau-feat-grid{grid-template-columns:repeat(2,1fr);}}
        @media(max-width:540px){.zau-feat-grid{grid-template-columns:1fr;}}
        .zau-feat-card{background:var(--color-surface-primary,#fff);border:1px solid var(--color-border-light,#EEE);border-radius:16px;padding:22px 18px;position:relative;overflow:hidden;box-shadow:0 2px 8px rgba(26,24,22,0.05);transition:transform 0.22s,box-shadow 0.22s;}
        .zau-feat-card:hover{transform:translateY(-4px);box-shadow:0 10px 26px rgba(26,24,22,0.09);}
        .zau-fc-icon{width:40px;height:40px;border-radius:10px;background:var(--fa);display:flex;align-items:center;justify-content:center;margin-bottom:12px;}
        .zau-fc-title{font-family:'Playfair Display',serif;font-size:0.95rem;font-weight:700;color:var(--color-text-primary,#111);margin-bottom:6px;}
        .zau-fc-desc{font-size:12px;color:var(--color-text-secondary,#4A4A48);line-height:1.6;}
        .zau-fc-bar{position:absolute;bottom:0;left:0;right:0;height:2px;background:var(--fa);opacity:0;transition:opacity 0.2s;}
        .zau-feat-card:hover .zau-fc-bar{opacity:1;}

        /* Section center header */
        .zau-cen-head{text-align:center;margin-bottom:48px;}
        .zau-cen-sub{font-size:15px;color:var(--color-text-secondary,#4A4A48);font-weight:300;max-width:500px;margin:10px auto 0;line-height:1.7;}

        /* HOW WE WORK */
        .zau-how{background:var(--color-surface-primary,#fff);padding:72px 24px;}
        .zau-steps-row{display:flex;position:relative;margin-bottom:36px;}
        @media(max-width:700px){.zau-steps-row{flex-direction:column;gap:14px;}}
        .zau-step{flex:1;background:var(--color-surface-secondary,#F5F5F5);border:1px solid var(--color-border-light,#EEE);border-radius:16px;padding:28px 22px;margin:0 7px;position:relative;transition:transform 0.22s,box-shadow 0.22s;}
        .zau-step:first-child{margin-left:0;}.zau-step:last-child{margin-right:0;}
        .zau-step:hover{transform:translateY(-4px);box-shadow:0 10px 26px rgba(26,24,22,0.08);}
        .zau-step-hl{background:linear-gradient(135deg,var(--color-primary,#2B64D4),var(--color-primary-dark,#1A3F8A));border-color:transparent;}
        .zau-step-hl .zau-step-num{color:rgba(255,255,255,0.25);}
        .zau-step-hl .zau-step-title{color:#fff;}.zau-step-hl .zau-step-desc{color:rgba(255,255,255,0.72);}
        .zau-step-num{font-family:'Playfair Display',serif;font-size:2.8rem;font-weight:800;color:var(--color-border-default,#E0E0E0);line-height:1;margin-bottom:10px;}
        .zau-step-title{font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:700;color:var(--color-text-primary,#111);margin-bottom:8px;}
        .zau-step-desc{font-size:13px;color:var(--color-text-secondary,#4A4A48);line-height:1.7;}
        .zau-step-arr{position:absolute;right:-20px;top:50%;transform:translateY(-50%);font-size:20px;color:var(--color-border-default,#E0E0E0);z-index:2;}
        @media(max-width:700px){.zau-step-arr{display:none;}}
        .zau-process-extra{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;}
        @media(max-width:540px){.zau-process-extra{grid-template-columns:1fr;}}
        .zau-pe{display:flex;align-items:center;gap:9px;font-size:13px;color:var(--color-text-secondary,#4A4A48);background:var(--color-surface-secondary,#F5F5F5);border:1px solid var(--color-border-light,#EEE);border-radius:9px;padding:11px 14px;}
        .zau-pe-icon{color:var(--color-secondary,#1E8A56);flex-shrink:0;}

        /* TIMELINE */
        .zau-journey{background:var(--color-surface-secondary,#F5F5F5);border-top:1px solid var(--color-border-light,#EEE);padding:72px 24px;}
        .zau-tl{position:relative;max-width:800px;margin:0 auto;}
        .zau-tl-line{position:absolute;left:50%;top:0;bottom:0;width:2px;background:var(--color-border-default,#E0E0E0);transform:translateX(-50%);z-index:0;}
        @media(max-width:640px){.zau-tl-line{left:14px;}}
        .zau-tl-item{display:flex;align-items:center;position:relative;z-index:1;margin-bottom:36px;}
        .zau-tl-l{flex-direction:row;}.zau-tl-r{flex-direction:row-reverse;}
        @media(max-width:640px){.zau-tl-item,.zau-tl-l,.zau-tl-r{flex-direction:row;padding-left:44px;}}
        .zau-tl-card{flex:1;max-width:calc(50% - 32px);background:var(--color-surface-primary,#fff);border:1px solid var(--color-border-light,#EEE);border-radius:15px;padding:22px;box-shadow:0 2px 10px rgba(26,24,22,0.06);animation:fadeUp 0.6s ease both;}
        @media(max-width:640px){.zau-tl-card{max-width:100%;}}
        .zau-tl-year{font-family:'Playfair Display',serif;font-size:1.8rem;font-weight:800;color:var(--color-primary,#2B64D4);display:block;margin-bottom:5px;}
        .zau-tl-title{font-family:'Playfair Display',serif;font-size:1rem;font-weight:700;color:var(--color-text-primary,#111);margin-bottom:5px;}
        .zau-tl-desc{font-size:12px;color:var(--color-text-secondary,#4A4A48);line-height:1.6;}
        .zau-tl-dot{width:16px;height:16px;border-radius:50%;flex-shrink:0;background:var(--color-primary,#2B64D4);border:4px solid var(--color-surface-primary,#fff);box-shadow:0 0 0 3px var(--color-primary,#2B64D4);margin:0 24px;}
        @media(max-width:640px){.zau-tl-dot{position:absolute;left:6px;margin:0;}}

        /* WHAT DRIVES US */
        .zau-drives{background:var(--color-surface-primary,#fff);padding:72px 24px;}
        .zau-drives-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;}
        @media(max-width:900px){.zau-drives-grid{grid-template-columns:repeat(2,1fr);}}
        @media(max-width:540px){.zau-drives-grid{grid-template-columns:1fr;}}
        .zau-drive-card{background:var(--color-surface-secondary,#F5F5F5);border:1px solid var(--color-border-light,#EEE);border-radius:16px;padding:26px 20px;transition:transform 0.22s,box-shadow 0.22s;}
        .zau-drive-card:hover{transform:translateY(-4px);box-shadow:0 10px 26px rgba(26,24,22,0.09);}
        .zau-drive-icon{width:48px;height:48px;border-radius:13px;background:linear-gradient(135deg,var(--color-primary,#2B64D4),var(--color-primary-dark,#1A3F8A));display:flex;align-items:center;justify-content:center;margin-bottom:14px;}
        .zau-drive-title{font-family:'Playfair Display',serif;font-size:1rem;font-weight:700;color:var(--color-text-primary,#111);margin-bottom:7px;}
        .zau-drive-desc{font-size:12px;color:var(--color-text-secondary,#4A4A48);line-height:1.65;}

        /* TESTIMONIALS */
        .zau-tests{background:var(--color-surface-secondary,#F5F5F5);border-top:1px solid var(--color-border-light,#EEE);padding:72px 24px;}
        .zau-test-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;}
        @media(max-width:900px){.zau-test-grid{grid-template-columns:1fr;}}
        .zau-test-card{background:var(--color-surface-primary,#fff);border:1px solid var(--color-border-light,#EEE);border-radius:16px;padding:26px;box-shadow:0 2px 8px rgba(26,24,22,0.06);transition:transform 0.22s,box-shadow 0.22s;}
        .zau-test-card:hover{transform:translateY(-3px);box-shadow:0 8px 22px rgba(26,24,22,0.09);}
        .zau-test-stars{display:flex;gap:3px;margin-bottom:12px;}
        .zau-star{color:var(--color-warning,#C49A3C);fill:var(--color-warning,#C49A3C);}
        .zau-test-q{font-size:14px;line-height:1.7;color:var(--color-text-primary,#111);font-style:italic;margin-bottom:16px;}
        .zau-test-auth{display:flex;align-items:center;gap:10px;}
        .zau-test-av{width:38px;height:38px;border-radius:50%;flex-shrink:0;background:linear-gradient(135deg,var(--color-primary,#2B64D4),var(--color-secondary,#1E8A56));color:#fff;font-size:15px;font-weight:700;font-family:'Playfair Display',serif;display:flex;align-items:center;justify-content:center;}
        .zau-test-name{font-size:13px;font-weight:600;color:var(--color-text-primary,#111);}
        .zau-test-role{font-size:11px;color:var(--color-text-muted,#B0B0AD);}

        /* CTA */
        .zau-cta{position:relative;overflow:hidden;background:linear-gradient(148deg,var(--color-primary-dark,#1A3F8A),var(--color-primary,#2B64D4));padding:90px 24px;text-align:center;}
        .zau-cta-g1{position:absolute;width:380px;height:380px;border-radius:50%;top:-100px;left:-80px;background:rgba(255,255,255,0.05);filter:blur(80px);pointer-events:none;}
        .zau-cta-g2{position:absolute;width:320px;height:320px;border-radius:50%;bottom:-80px;right:-60px;background:rgba(30,138,86,0.18);filter:blur(70px);pointer-events:none;}
        .zau-cta-inner{position:relative;z-index:2;max-width:600px;margin:0 auto;}
        .zau-cta-h2{font-family:'Playfair Display',serif;font-size:clamp(1.9rem,4.5vw,3.4rem);font-weight:800;line-height:1.15;color:#fff;margin:14px 0 14px;}
        .zau-cta-h2 em{font-style:italic;color:rgba(255,255,255,0.68);}
        .zau-cta-p{font-size:16px;color:rgba(255,255,255,0.6);font-weight:300;line-height:1.75;margin-bottom:32px;}
        .zau-cta-btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:18px;}
        .zau-cta-pri{display:inline-flex;align-items:center;gap:8px;padding:13px 30px;border-radius:10px;background:var(--color-surface-primary,#fff);color:var(--color-primary,#2B64D4);font-family:'Outfit',sans-serif;font-size:14px;font-weight:700;text-decoration:none;transition:transform 0.2s,box-shadow 0.2s;box-shadow:0 5px 20px rgba(0,0,0,0.18);}
        .zau-cta-pri:hover{transform:translateY(-2px);box-shadow:0 10px 30px rgba(0,0,0,0.24);}
        .zau-cta-gho{display:inline-flex;align-items:center;gap:8px;padding:13px 26px;border-radius:10px;border:2px solid rgba(255,255,255,0.35);color:#fff;font-family:'Outfit',sans-serif;font-size:14px;font-weight:600;text-decoration:none;backdrop-filter:blur(8px);transition:all 0.2s;}
        .zau-cta-gho:hover{background:rgba(255,255,255,0.1);border-color:rgba(255,255,255,0.65);}
        .zau-cta-fine{font-size:12px;color:rgba(255,255,255,0.35);}

        /* RESPONSIVE */
        @media(max-width:768px){
          .zau-hero{padding:60px 18px 70px;}
          .zau-hero-inner{margin-bottom:32px;}
          .zau-stats-sec,.zau-mission,.zau-features,.zau-how,.zau-journey,.zau-drives,.zau-tests{padding:48px 18px;}
          .zau-cta{padding:64px 18px;}
          .zau-float-pills{gap:10px;padding:0 16px;margin-bottom:28px;}
          .zau-pill{padding:9px 15px;font-size:13px;}
          .zau-pill-val{font-size:0.9rem;}
          .zau-pill-lbl{font-size:10px;}
        }
        @media(max-width:540px){
          .zau-hero{padding:48px 14px 60px;}
          .zau-hero-inner{margin-bottom:28px;}
          .zau-stats-sec{padding:36px 14px 36px;}
          .zau-float-pills{gap:8px;padding:0 12px;margin-bottom:24px;}
          .zau-pill{padding:7px 12px;font-size:12px;gap:5px;}
          .zau-pill-val{font-size:0.85rem;}
          .zau-pill-lbl{font-size:9px;}
          .zau-stats-grid{gap:12px;}
          .zau-stat-card{padding:20px 16px;}
          .zau-sc-val{font-size:2rem;}
          .zau-sc-lbl{font-size:12px;}
        }
        @media(max-width:380px){
          .zau-hero{padding:44px 12px 55px;}
          .zau-hero-inner{margin-bottom:24px;}
          .zau-pill{padding:6px 10px;font-size:11px;}
          .zau-pill-val{font-size:0.8rem;}
          .zau-float-pills{gap:6px;margin-bottom:20px;}
        }
      `}</style>
    </div>
  )
}

export default AboutUS