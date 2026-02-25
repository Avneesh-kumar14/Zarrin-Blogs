import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Heading from '../Common/Heading';
import Paragraph from '../Common/Paragraph';
import Image from '../Common/Image';
import Comments from '../Common/Comments';
import LikeBookmarkButtons from '../Common/LikeBookmarkButtons';
import RelatedBlogs from './RelatedBlogs';
import { ArrowLeft, Calendar, User, Clock, Share2, BookOpen } from 'lucide-react';
import { getApiUrl } from '../../utils/apiConfig';

const BlogPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [readTime, setReadTime] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [scrollPct, setScrollPct] = useState(0);

  const isAuthenticated = !!localStorage.getItem('token');

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
      setScrollPct(Math.min(100, pct));
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const fetchBlog = async () => {
      const res = await fetch(getApiUrl(`/api/blogs/${id}`), {
        credentials: 'include'
      });
      const data = await res.json();
      setBlog(data);

      if (data.blog_content) {
        const words = data.blog_content.split(/\s+/).length;
        setReadTime(Math.ceil(words / 200));
      }

      setLoading(false);
      window.scrollTo(0, 0);
    };

    if (isAuthenticated) {
      const user = localStorage.getItem('user');
      if (user) setCurrentUser(JSON.parse(user));
    }

    fetchBlog();
  }, [id, isAuthenticated]);

  if (loading) {
    return (
      <div className="zbp-loading">
        <div className="zbp-spinner-ring" />
        <p className="zbp-loading-txt">Loading article…</p>
      </div>
    );
  }

  if (!blog) return null;

  return (
    <div className="zbp-root">
      {/* Reading progress bar */}
      <div className="zbp-progress" style={{ width: `${scrollPct}%` }} />

      <article className="zbp-article">

        

        {/* Category pill */}
        <div className="zbp-category">
          {blog.category?.[0]?.name || 'Article'}
        </div>

        {/* Title */}
        <h1 className="zbp-title">{blog.title}</h1>

        {/* Description */}
        {blog.short_description && (
          <p className="zbp-deck">{blog.short_description}</p>
        )}

        {/* Meta bar */}
        <div className="zbp-meta">
          <div className="zbp-meta-author">
            <div className="zbp-meta-avatar">
              {blog.author?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <p className="zbp-meta-name">{blog.author?.name}</p>
              <p className="zbp-meta-date">{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
          </div>
          <div className="zbp-meta-right">
            {readTime > 0 && (
              <div className="zbp-meta-chip">
                <Clock size={13} />{readTime} min read
              </div>
            )}
            <div className="zbp-meta-chip">
              <BookOpen size={13} />Article
            </div>
          </div>
        </div>

        {/* Hero image */}
        {blog.images?.[0] && (
          <div className="zbp-hero-img">
            <Image src={blog.images[0]} alt={blog.title} className="zbp-img" />
            <div className="zbp-img-overlay" />
          </div>
        )}

        {/* Content */}
        <div className="zbp-content">
          <div dangerouslySetInnerHTML={{ __html: blog.blog_content }} />
        </div>

        {/* Gallery */}
        {blog.images && blog.images.length > 1 && (
          <div className="zbp-gallery">
            {blog.images.slice(1).map((img, idx) => (
              <div key={idx} className="zbp-gallery-item">
                <Image src={img} alt={`Gallery ${idx + 1}`} className="zbp-gallery-img" />
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="zbp-actions">
          <div className="zbp-actions-inner">
            <LikeBookmarkButtons blogId={id} isAuthenticated={isAuthenticated} />
          </div>
        </div>

        {/* Author card */}
        <div className="zbp-author-card">
          <div className="zbp-author-avatar-lg">
            {blog.author?.name?.charAt(0) || 'A'}
          </div>
          <div>
            <p className="zbp-author-label">Written by</p>
            <p className="zbp-author-name">{blog.author?.name}</p>
            <div className="zbp-author-meta">
              <Calendar size={12} />
              {new Date(blog.createdAt).toDateString()}
              {readTime > 0 && <><span>·</span><Clock size={12} />{readTime} min</>}
            </div>
          </div>
        </div>

        {/* Comments */}
        <div className="zbp-comments">
          <h3 className="zbp-section-head">Discussion</h3>
          <Comments blogId={id} currentUser={currentUser} isAuthenticated={isAuthenticated} />
        </div>

        {/* Related */}
        <div className="zbp-related">
          <h3 className="zbp-section-head">Continue Reading</h3>
          <RelatedBlogs blogId={id} />
        </div>

      </article>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,400;1,700&family=Lora:ital,wght@0,400;0,500;1,400&family=Outfit:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin:0; padding:0; }

        .zbp-root {
          background: var(--color-surface-primary, #fff);
          min-height: 100vh;
          font-family: 'Outfit', sans-serif;
        }

        /* Progress bar */
        .zbp-progress {
          position: fixed; top: 0; left: 0; height: 3px; z-index: 100;
          background: linear-gradient(90deg, var(--color-primary,#2B64D4), var(--color-secondary,#1E8A56));
          transition: width 0.1s linear;
          box-shadow: 0 0 8px rgba(43,100,212,0.4);
        }

        .zbp-loading {
          min-height: 100vh; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 20px;
          background: var(--color-surface-primary,#fff);
          font-family: 'Outfit', sans-serif;
        }
        .zbp-spinner-ring {
          width: 44px; height: 44px;
          border: 3px solid var(--color-border-light,#EEE);
          border-top-color: var(--color-primary,#2B64D4);
          border-radius: 50%; animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .zbp-loading-txt { font-size: 14px; color: var(--color-text-secondary,#4A4A48); }

        .zbp-article {
          max-width: 720px; margin: 0 auto; padding: 48px 24px 80px;
          animation: fadeUp 0.5s ease both;
        }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }

        /* Back button */
        .zbp-back {
          display: inline-flex; align-items: center; gap: 8px;
          margin-bottom: 32px;
          padding: 9px 18px; border-radius: 8px;
          background: var(--color-surface-secondary,#F5F5F5);
          border: 1px solid var(--color-border-light,#EEE);
          color: var(--color-text-secondary,#4A4A48);
          font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 500;
          cursor: pointer; transition: all 0.15s;
        }
        .zbp-back:hover {
          background: var(--color-surface-primary,#fff);
          border-color: var(--color-primary,#2B64D4);
          color: var(--color-primary,#2B64D4);
        }
        .zbp-back-icon { transition: transform 0.15s; }
        .zbp-back:hover .zbp-back-icon { transform: translateX(-3px); }

        /* Category */
        .zbp-category {
          display: inline-block;
          font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--color-primary,#2B64D4);
          background: rgba(43,100,212,0.08);
          border: 1px solid rgba(43,100,212,0.2);
          padding: 6px 14px; border-radius: 100px; margin-bottom: 20px;
        }

        /* Title */
        .zbp-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 5vw, 3rem); font-weight: 800; line-height: 1.2;
          color: var(--color-text-primary,#111); margin-bottom: 18px;
          letter-spacing: -0.01em;
        }

        /* Deck */
        .zbp-deck {
          font-family: 'Lora', serif;
          font-size: 19px; line-height: 1.7; font-style: italic;
          color: var(--color-text-secondary,#4A4A48);
          margin-bottom: 28px;
          padding-left: 20px;
          border-left: 3px solid var(--color-primary,#2B64D4);
        }

        /* Meta bar */
        .zbp-meta {
          display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;
          padding: 20px 0; border-top: 1px solid var(--color-border-light,#EEE);
          border-bottom: 1px solid var(--color-border-light,#EEE);
          margin-bottom: 40px;
        }
        .zbp-meta-author { display: flex; align-items: center; gap: 12px; }
        .zbp-meta-avatar {
          width: 44px; height: 44px; border-radius: 50%;
          background: linear-gradient(135deg, var(--color-primary,#2B64D4), var(--color-secondary,#1E8A56));
          color: #fff; font-size: 18px; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Playfair Display', serif;
        }
        .zbp-meta-name { font-size: 14px; font-weight: 600; color: var(--color-text-primary,#111); }
        .zbp-meta-date { font-size: 12px; color: var(--color-text-muted,#B0B0AD); margin-top: 1px; }
        .zbp-meta-right { display: flex; align-items: center; gap: 8px; }
        .zbp-meta-chip {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 12px; color: var(--color-text-secondary,#4A4A48);
          background: var(--color-surface-secondary,#F5F5F5);
          border: 1px solid var(--color-border-light,#EEE);
          padding: 5px 12px; border-radius: 100px;
        }

        /* Hero image */
        .zbp-hero-img {
          position: relative; border-radius: 16px; overflow: hidden;
          margin-bottom: 44px;
          box-shadow: var(--card-shadow-elevated);
        }
        .zbp-img { width: 100%; display: block; transition: transform 0.4s ease; }
        .zbp-hero-img:hover .zbp-img { transform: scale(1.02); }
        .zbp-img-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(43,100,212,0.12), transparent 40%);
          pointer-events: none;
        }

        /* Content typography */
        .zbp-content {
          font-family: 'Lora', serif;
          font-size: 18px; line-height: 1.85; color: var(--color-text-primary,#111);
          margin-bottom: 48px;
        }
        .zbp-content h1, .zbp-content h2, .zbp-content h3 {
          font-family: 'Playfair Display', serif;
          color: var(--color-text-primary,#111);
          margin: 2em 0 0.75em; line-height: 1.25;
        }
        .zbp-content h2 { font-size: 1.6rem; }
        .zbp-content h3 { font-size: 1.3rem; }
        .zbp-content p { margin-bottom: 1.4em; }
        .zbp-content a { color: var(--color-primary,#2B64D4); font-weight: 500; }
        .zbp-content blockquote {
          border-left: 4px solid var(--color-primary,#2B64D4);
          padding-left: 20px; margin: 2em 0;
          font-style: italic; color: var(--color-text-secondary,#4A4A48);
        }
        .zbp-content img { border-radius: 10px; max-width: 100%; }
        .zbp-content ul, .zbp-content ol { padding-left: 28px; margin-bottom: 1.4em; }
        .zbp-content li { margin-bottom: 0.5em; }

        /* Gallery */
        .zbp-gallery {
          display: grid; grid-template-columns: repeat(2,1fr); gap: 16px;
          margin-bottom: 48px;
        }
        .zbp-gallery-item { border-radius: 12px; overflow: hidden; box-shadow: var(--card-shadow); }
        .zbp-gallery-img { width: 100%; display: block; transition: transform 0.3s ease; }
        .zbp-gallery-item:hover .zbp-gallery-img { transform: scale(1.04); }

        /* Actions */
        .zbp-actions {
          border-top: 1px solid var(--color-border-light,#EEE);
          border-bottom: 1px solid var(--color-border-light,#EEE);
          padding: 24px 0; margin-bottom: 40px;
        }
        .zbp-actions-inner { display: flex; align-items: center; gap: 12px; }

        /* Author card */
        .zbp-author-card {
          display: flex; align-items: center; gap: 20px;
          background: var(--color-surface-secondary,#F5F5F5);
          border: 1px solid var(--color-border-light,#EEE);
          border-radius: 16px; padding: 24px;
          margin-bottom: 48px;
        }
        .zbp-author-avatar-lg {
          width: 64px; height: 64px; border-radius: 50%; flex-shrink: 0;
          background: linear-gradient(135deg, var(--color-primary,#2B64D4), var(--color-secondary,#1E8A56));
          color: #fff; font-size: 26px; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Playfair Display', serif;
        }
        .zbp-author-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-text-muted,#B0B0AD); margin-bottom: 4px; }
        .zbp-author-name { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; color: var(--color-text-primary,#111); margin-bottom: 6px; }
        .zbp-author-meta { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--color-text-muted,#B0B0AD); }

        /* Section heads */
        .zbp-section-head {
          font-family: 'Playfair Display', serif;
          font-size: 1.6rem; font-weight: 800;
          color: var(--color-text-primary,#111); margin-bottom: 28px;
        }

        .zbp-comments { margin-bottom: 48px; }

        .zbp-related {
          padding-top: 48px;
          border-top: 1px solid var(--color-border-light,#EEE);
        }
      `}</style>
    </div>
  );
};

export default BlogPreview;