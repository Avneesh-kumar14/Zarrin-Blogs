import React, { useState, useEffect, useRef } from 'react';
import Alert from './Alert';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { getApiUrl } from '../../utils/apiConfig';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [rateLimitReset, setRateLimitReset] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();

    const dots = Array.from({ length: 22 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.4,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
      o: Math.random() * 0.35 + 0.08,
    }));

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.forEach(d => {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0) d.x = canvas.width;
        if (d.x > canvas.width) d.x = 0;
        if (d.y < 0) d.y = canvas.height;
        if (d.y > canvas.height) d.y = 0;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${d.o})`;
        ctx.fill();
      });
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x, dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.strokeStyle = `rgba(255,255,255,${0.05 * (1 - dist / 90)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // VALIDATION: Perform input validation BEFORE setting loading
    // This prevents state flickering and improves UX
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setAlert({ 
        type: 'warning', 
        message: 'Email and password are required' 
      });
      // Don't set loading, validation failed early
      return;
    }

    if (trimmedPassword.length < 6) {
      setAlert({ 
        type: 'warning', 
        message: 'Password must be at least 6 characters long' 
      });
      // Don't set loading, validation failed early
      return;
    }

    // LOADING: Now start loading after all validations pass
    setLoading(true);

    try {
      // API CALL: Send login request to backend
      const loginData = { 
        email: trimmedEmail.toLowerCase(), 
        password: trimmedPassword 
      };

      const res = await fetch(getApiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Include cookies for session management
        body: JSON.stringify(loginData),
      });

      // RESPONSE PARSING: Parse JSON response
      let data = await res.json();

      // RATE LIMITING: Handle rate limit errors (429)
      if (res.status === 429) {
        const retryAfter = data.retryAfter || 15 * 60;
        setRateLimitReset(retryAfter);
        throw new Error(`Too many login attempts. Please try again in ${Math.ceil(retryAfter / 60)} minutes.`);
      }

      // ERROR HANDLING: Check for other HTTP errors
      if (!res.ok) {
        throw new Error(data.message || data.details?.[0]?.message || 'Invalid credentials');
      }

      // RESPONSE VALIDATION: Ensure required data is present
      if (!data.token || !data.user) {
        throw new Error('Server error: Missing authentication data');
      }

      // TOKEN STORAGE: Store authentication tokens in localStorage
      // Normalize user object to ensure consistent id field
      const normalizedUser = { 
        ...data.user, 
        id: data.user._id || data.user.id 
      };

      // Clear old auth data
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');

      // Store new auth data
      localStorage.setItem('token', data.token);
      if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(normalizedUser));

      // SUCCESS: Show success message
      setAlert({ 
        type: 'success', 
        message: 'Login successful!' 
      });

      // NAVIGATION: Redirect to dashboard
      // ⚠️ REMOVED: Unnecessary '/api/auth/validate' call
      // The backend already returned a valid token, no need to verify it again
      // This saves one API call and improves login speed
      setTimeout(() => {
        navigate('/');
      }, 1500);

    } catch (err) {
      // ERROR RESPONSE: Show error message to user
      setAlert({ 
        type: 'error', 
        message: err.message || 'Login failed. Please check your credentials.' 
      });
      console.error('Login error:', err);

      // CLEANUP: Clear failed auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');

    } finally {
      // CLEANUP: Always reset loading state (try/catch/finally pattern)
      // This ensures loading spinner goes away even if error occurs
      setLoading(false);
    }
  };

  return (
    <div className={`zl-root ${mounted ? 'zl-mounted' : ''}`}>
      {/* ── Left Brand Panel ── */}
      <aside className="zl-brand">
        <canvas ref={canvasRef} className="zl-canvas" />
        <div className="zl-brand-glow zl-glow-1" />
        <div className="zl-brand-glow zl-glow-2" />

        {/* Corner brackets */}
        <div className="zl-bracket zl-tl" /><div className="zl-bracket zl-tr" />
        <div className="zl-bracket zl-bl" /><div className="zl-bracket zl-br" />

        <div className="zl-brand-inner">
          <div className="zl-overline">
            <div className="zl-overline-rule" /><span>Zarrin</span><div className="zl-overline-rule" />
          </div>

          <h1 className="zl-wordmark">Blogs</h1>

          <p className="zl-brand-desc">
            Where ideas breathe, stories live, and voices find their audience.
          </p>

          <div className="zl-divider">
            <div className="zl-divider-line" />
            <span className="zl-divider-glyph">◆</span>
            <div className="zl-divider-line" />
          </div>

          <div className="zl-testimonial">
            <p className="zl-quote">"Zarrin transformed how I share my thoughts. My readership grew 10× in three months."</p>
            <div className="zl-attr">
              <div className="zl-attr-avatar">S</div>
              <div>
                <p className="zl-attr-name">Sana Mirza</p>
                <p className="zl-attr-role">Tech Writer · 12k readers</p>
              </div>
            </div>
          </div>

          <div className="zl-stats-row">
            {[['40k+', 'Writers'], ['2M+', 'Readers'], ['4.9★', 'Rating']].map(([n, l], i) => (
              <React.Fragment key={l}>
                {i > 0 && <div className="zl-stat-sep" />}
                <div className="zl-stat">
                  <span className="zl-stat-num">{n}</span>
                  <span className="zl-stat-label">{l}</span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </aside>

      {/* ── Right Form Panel ── */}
      <main className="zl-form-side">
        <div className="zl-form-wrap">
          {/* Mobile logo */}
          <div className="zl-mobile-mark">
            <div className="zl-mobile-dot" />
            <span>Zarrin Blogs</span>
          </div>

          <div className="zl-header">
            <h2 className="zl-title">Welcome back</h2>
            <p className="zl-subtitle">Sign in to your creative space</p>
          </div>

          {alert && (
            <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} duration={5000} />
          )}

          <form onSubmit={handleSubmit} className="zl-form">
            {/* Email */}
            <div className="zl-field">
              <label htmlFor="email" className="zl-label">Email Address</label>
              <div className={`zl-input-wrap ${focused === 'email' ? 'zl-active' : ''} ${email ? 'zl-filled' : ''}`}>
                <Mail className="zl-icon" size={16} />
                <input
                  id="email" type="email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  placeholder="you@example.com"
                  className="zl-input" required
                />
                {email && <div className="zl-filled-dot" />}
              </div>
            </div>

            {/* Password */}
            <div className="zl-field">
              <div className="zl-label-row">
                <label htmlFor="password" className="zl-label">Password</label>
                <Link to="/forgot-password" className="zl-forgot">Forgot password?</Link>
              </div>
              <div className={`zl-input-wrap ${focused === 'password' ? 'zl-active' : ''}`}>
                <Lock className="zl-icon" size={16} />
                <input
                  id="password" type={showPassword ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  placeholder="••••••••"
                  className="zl-input" required
                />
                <button type="button" className="zl-eye" onClick={() => setShowPassword(v => !v)}>
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} className="zl-btn">
              <span className="zl-btn-shimmer" />
              {loading ? (
                <span className="zl-btn-inner"><span className="zl-spin" />Signing in…</span>
              ) : (
                <span className="zl-btn-inner">Sign In <ArrowRight size={17} /></span>
              )}
            </button>
          </form>

          <div className="zl-divider-row">
            <div className="zl-dr-line" /><span className="zl-dr-text">new here?</span><div className="zl-dr-line" />
          </div>

          <Link to="/signup" className="zl-signup-btn">
            Create a free account
          </Link>

          <p className="zl-terms">
            Protected by <span>256-bit encryption</span>. We never share your data.
          </p>
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=Outfit:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .zl-root {
          display: flex; min-height: 100vh;
          font-family: 'Outfit', sans-serif;
          background: var(--color-surface-primary, #fff);
          opacity: 0; transition: opacity 0.5s ease;
        }
        .zl-mounted { opacity: 1; }

        /* ── Brand Panel ── */
        .zl-brand {
          position: relative; flex: 0 0 45%;
          background: linear-gradient(155deg, var(--color-primary, #2B64D4) 0%, var(--color-primary-dark, #1A3F8A) 60%, #0f2660 100%);
          display: flex; align-items: center; justify-content: center;
          padding: 64px 52px; overflow: hidden;
        }
        .zl-canvas { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }

        .zl-brand-glow {
          position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none;
        }
        .zl-glow-1 {
          width: 350px; height: 350px; top: -100px; right: -80px;
          background: rgba(80,137,227,0.35);
          animation: drift 9s ease-in-out infinite;
        }
        .zl-glow-2 {
          width: 250px; height: 250px; bottom: -60px; left: -60px;
          background: rgba(30,138,86,0.25);
          animation: drift 11s ease-in-out infinite reverse;
        }
        @keyframes drift {
          0%,100% { transform: translate(0,0) scale(1); }
          40% { transform: translate(20px,-30px) scale(1.06); }
          70% { transform: translate(-15px,18px) scale(0.95); }
        }

        /* Corner brackets */
        .zl-bracket {
          position: absolute; width: 28px; height: 28px;
          border-color: rgba(255,255,255,0.2); border-style: solid;
        }
        .zl-tl { top: 20px; left: 20px; border-width: 1px 0 0 1px; }
        .zl-tr { top: 20px; right: 20px; border-width: 1px 1px 0 0; }
        .zl-bl { bottom: 20px; left: 20px; border-width: 0 0 1px 1px; }
        .zl-br { bottom: 20px; right: 20px; border-width: 0 1px 1px 0; }

        .zl-brand-inner {
          position: relative; z-index: 2;
          display: flex; flex-direction: column; align-items: center; text-align: center;
          animation: fadeUp 0.8s ease both;
        }
        @keyframes fadeUp { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }

        .zl-overline {
          display: flex; align-items: center; gap: 12px; margin-bottom: 16px;
        }
        .zl-overline-rule { width: 36px; height: 1px; background: rgba(255,255,255,0.25); }
        .zl-overline span {
          font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase;
          color: rgba(255,255,255,0.5); font-weight: 500;
        }

        .zl-wordmark {
          font-family: 'Playfair Display', serif;
          font-size: clamp(3.5rem, 5.5vw, 5rem);
          font-weight: 800; line-height: 1; color: #fff;
          text-shadow: 0 4px 40px rgba(0,0,0,0.25);
          margin-bottom: 20px; letter-spacing: -0.02em;
        }

        .zl-brand-desc {
          font-size: 15px; line-height: 1.65; font-weight: 300;
          color: rgba(255,255,255,0.55); max-width: 280px; margin-bottom: 32px;
        }

        .zl-divider {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 32px; width: 200px;
        }
        .zl-divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.15); }
        .zl-divider-glyph { font-size: 8px; color: rgba(255,255,255,0.25); }

        .zl-testimonial {
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 14px; padding: 22px 24px;
          backdrop-filter: blur(10px); margin-bottom: 36px;
          max-width: 320px;
        }
        .zl-quote {
          font-size: 13.5px; line-height: 1.65; font-style: italic;
          color: rgba(255,255,255,0.7); margin-bottom: 16px;
        }
        .zl-attr { display: flex; align-items: center; gap: 12px; }
        .zl-attr-avatar {
          width: 34px; height: 34px; border-radius: 50%;
          background: linear-gradient(135deg, var(--color-secondary,#1E8A56), var(--color-secondary-light,#3FA06F));
          color: #fff; font-size: 14px; font-weight: 700;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .zl-attr-name { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.85); }
        .zl-attr-role { font-size: 11px; color: rgba(255,255,255,0.4); margin-top: 1px; }

        .zl-stats-row { display: flex; align-items: center; gap: 20px; }
        .zl-stat { display: flex; flex-direction: column; align-items: center; gap: 2px; }
        .zl-stat-num {
          font-family: 'Playfair Display', serif;
          font-size: 22px; font-weight: 700; color: #fff;
        }
        .zl-stat-label { font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.35); }
        .zl-stat-sep { width: 1px; height: 32px; background: rgba(255,255,255,0.12); }

        /* ── Form Side ── */
        .zl-form-side {
          flex: 1; display: flex; align-items: center; justify-content: center;
          padding: 48px 40px;
          background: var(--color-surface-primary, #fff);
          position: relative;
        }
        .zl-form-side::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 80% 20%, rgba(43,100,212,0.03) 0%, transparent 60%);
          pointer-events: none;
        }

        .zl-form-wrap {
          width: 100%; max-width: 420px;
          animation: fadeUp 0.6s 0.15s ease both;
        }

        .zl-mobile-mark {
          display: none; align-items: center; gap: 8px;
          justify-content: center; margin-bottom: 36px;
        }
        .zl-mobile-dot {
          width: 10px; height: 10px; border-radius: 50%;
          background: var(--color-primary, #2B64D4);
        }
        .zl-mobile-mark span {
          font-family: 'Playfair Display', serif;
          font-size: 22px; font-weight: 700;
          color: var(--color-text-primary, #111);
        }

        .zl-header { margin-bottom: 36px; }
        .zl-title {
          font-family: 'Playfair Display', serif;
          font-size: 2.2rem; font-weight: 700; line-height: 1.2;
          color: var(--color-text-primary, #111); margin-bottom: 8px;
        }
        .zl-subtitle { font-size: 14px; color: var(--color-text-tertiary, #7A7A77); font-weight: 300; }

        .zl-form { display: flex; flex-direction: column; gap: 22px; }

        .zl-field { display: flex; flex-direction: column; gap: 8px; }
        .zl-label-row { display: flex; align-items: center; justify-content: space-between; }

        .zl-label {
          font-size: 12px; font-weight: 600; letter-spacing: 0.07em;
          text-transform: uppercase; color: var(--color-text-secondary, #4A4A48);
        }
        .zl-forgot {
          font-size: 12px; font-weight: 500;
          color: var(--color-primary, #2B64D4); text-decoration: none;
          transition: opacity 0.15s;
        }
        .zl-forgot:hover { opacity: 0.7; }

        .zl-input-wrap {
          position: relative; display: flex; align-items: center;
          background: var(--color-surface-secondary, #F5F5F5);
          border: 1.5px solid var(--color-border-default, #E0E0E0);
          border-radius: 10px;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .zl-active {
          border-color: var(--color-primary, #2B64D4);
          background: #fff;
          box-shadow: 0 0 0 4px rgba(43,100,212,0.08);
        }
        .zl-filled { border-color: var(--color-border-dark, #CCC); }

        .zl-icon {
          position: absolute; left: 14px;
          color: var(--color-text-muted, #B0B0AD);
          transition: color 0.2s; pointer-events: none;
        }
        .zl-active .zl-icon { color: var(--color-primary, #2B64D4); }

        .zl-input {
          width: 100%; padding: 13px 42px 13px 42px;
          border: none; outline: none; background: transparent;
          font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 400;
          color: var(--color-text-primary, #111);
        }
        .zl-input::placeholder { color: var(--color-text-muted, #B0B0AD); }

        .zl-filled-dot {
          position: absolute; right: 14px;
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--color-secondary, #1E8A56);
        }

        .zl-eye {
          position: absolute; right: 14px;
          background: none; border: none; cursor: pointer; padding: 0;
          color: var(--color-text-muted, #B0B0AD); transition: color 0.15s;
          display: flex; align-items: center;
        }
        .zl-eye:hover { color: var(--color-text-secondary, #4A4A48); }

        /* Submit */
        .zl-btn {
          position: relative; width: 100%; padding: 15px;
          background: var(--gradient-primary, linear-gradient(135deg,#2B64D4,#1A3F8A));
          color: var(--color-on-primary, #fff);
          border: none; border-radius: 10px; overflow: hidden;
          font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 600;
          letter-spacing: 0.05em; cursor: pointer;
          box-shadow: 0 4px 20px rgba(43,100,212,0.3);
          transition: transform 0.2s, box-shadow 0.2s;
          margin-top: 6px;
        }
        .zl-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(43,100,212,0.4);
        }
        .zl-btn:active:not(:disabled) { transform: translateY(0); }
        .zl-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .zl-btn-shimmer {
          position: absolute; inset: 0;
          background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%);
          transform: translateX(-100%); transition: transform 0.55s ease;
          pointer-events: none;
        }
        .zl-btn:hover .zl-btn-shimmer { transform: translateX(100%); }

        .zl-btn-inner {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          position: relative; z-index: 1;
        }

        .zl-spin {
          display: inline-block; width: 15px; height: 15px;
          border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
          border-radius: 50%; animation: spin 0.65s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Divider row */
        .zl-divider-row {
          display: flex; align-items: center; gap: 14px; margin: 24px 0 16px;
        }
        .zl-dr-line { flex: 1; height: 1px; background: var(--color-border-light, #EEE); }
        .zl-dr-text { font-size: 12px; color: var(--color-text-muted, #B0B0AD); letter-spacing: 0.05em; white-space: nowrap; }

        /* Secondary CTA */
        .zl-signup-btn {
          display: block; width: 100%; padding: 14px;
          background: transparent;
          border: 1.5px solid var(--color-border-dark, #CCC);
          border-radius: 10px; text-align: center;
          font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 500;
          color: var(--color-text-primary, #111); text-decoration: none;
          transition: border-color 0.2s, background 0.2s, color 0.2s;
        }
        .zl-signup-btn:hover {
          border-color: var(--color-primary, #2B64D4);
          color: var(--color-primary, #2B64D4);
          background: rgba(43,100,212,0.03);
        }

        .zl-terms {
          font-size: 11px; color: var(--color-text-muted, #B0B0AD);
          text-align: center; margin-top: 20px; line-height: 1.5;
        }
        .zl-terms span { color: var(--color-text-tertiary, #7A7A77); }

        @media (max-width: 820px) {
          .zl-brand { display: none; }
          .zl-mobile-mark { display: flex; }
          .zl-form-side { padding: 32px 24px; }
        }
      `}</style>
    </div>
  );
};

export default Login;