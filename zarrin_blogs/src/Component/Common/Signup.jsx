import React, { useState, useEffect, useRef } from 'react';
import Alert from './Alert';
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, CheckCircle, XCircle, ArrowRight, PenLine } from 'lucide-react';
import { getApiUrl } from '../../utils/apiConfig';

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focused, setFocused] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(0); // tracks progress 0-4
  const canvasRef = useRef(null);

  const validatePassword = (pass) => pass.length >= 8 && /[a-z]/.test(pass) && /[A-Z]/.test(pass) && /\d/.test(pass);
  const passwordsMatch = password === confirmPassword && password.length > 0;

  const pwChecks = [
    { label: '8+ characters', ok: password.length >= 8 },
    { label: 'Uppercase letter', ok: /[A-Z]/.test(password) },
    { label: 'Lowercase letter', ok: /[a-z]/.test(password) },
    { label: 'A number', ok: /\d/.test(password) },
  ];
  const pwStrength = pwChecks.filter(c => c.ok).length;
  const strengthConfig = [
    null,
    { label: 'Weak', color: 'var(--color-error,#CC2E2E)' },
    { label: 'Fair', color: 'var(--color-warning,#C49A3C)' },
    { label: 'Good', color: 'var(--color-secondary,#1E8A56)' },
    { label: 'Strong', color: 'var(--color-secondary-dark,#156B44)' },
  ];

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Geometric floating shapes
    const shapes = Array.from({ length: 12 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 40 + 15,
      vx: (Math.random() - 0.5) * 0.1,
      vy: (Math.random() - 0.5) * 0.1,
      rot: Math.random() * Math.PI * 2,
      vrot: (Math.random() - 0.5) * 0.003,
      type: Math.floor(Math.random() * 3), // 0=square, 1=triangle, 2=circle
      o: Math.random() * 0.07 + 0.02,
    }));

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      shapes.forEach(s => {
        s.x += s.vx; s.y += s.vy; s.rot += s.vrot;
        if (s.x < -60) s.x = canvas.width + 60;
        if (s.x > canvas.width + 60) s.x = -60;
        if (s.y < -60) s.y = canvas.height + 60;
        if (s.y > canvas.height + 60) s.y = -60;

        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rot);
        ctx.globalAlpha = s.o;
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;

        if (s.type === 0) {
          ctx.strokeRect(-s.size / 2, -s.size / 2, s.size, s.size);
        } else if (s.type === 1) {
          ctx.beginPath();
          ctx.moveTo(0, -s.size / 2);
          ctx.lineTo(s.size / 2, s.size / 2);
          ctx.lineTo(-s.size / 2, s.size / 2);
          ctx.closePath();
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, s.size / 2, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  // Update progress step
  useEffect(() => {
    let s = 0;
    if (name.trim()) s++;
    if (email.trim()) s++;
    if (validatePassword(password)) s++;
    if (passwordsMatch) s++;
    setStep(s);
  }, [name, email, password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // VALIDATION: Perform validations BEFORE setting loading
    // This prevents state flickering and improves UX
    
    if (!validatePassword(password)) {
      setAlert({ 
        type: 'warning', 
        message: 'Password must be 8+ chars with uppercase, lowercase, and number (e.g., MyPass123)' 
      });
      // Don't set loading, validation failed early
      return;
    }

    if (!passwordsMatch) {
      setAlert({ 
        type: 'warning', 
        message: 'Passwords do not match' 
      });
      // Don't set loading, validation failed early
      return;
    }

    // LOADING: Now start loading after all validations pass
    setLoading(true);

    try {
      // API CALL: Send signup request to backend
      // getApiUrl() handles both localhost and production URLs
      const res = await fetch(getApiUrl('/api/auth/signup'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Include cookies for CORS requests
        body: JSON.stringify({ 
          name: name.trim(),
          email: email.trim(),
          password: password.trim()
        }),
      });

      // RESPONSE PARSING: Parse JSON response from backend
      const data = await res.json();

      // ERROR HANDLING: Check for HTTP errors
      if (!res.ok) {
        // Backend returns error messages in data.message or data.error
        throw new Error(data.message || data.error || 'Signup failed');
      }

      // SUCCESS: User created, show success message
      setAlert({ 
        type: 'success', 
        message: 'Account created! Welcome to Zarrin Blogs 🎉' 
      });

      // NAVIGATION: Redirect to home page (Instagram/Facebook style)
      // Users can verify email later from settings if needed
      // Use setTimeout to let user see success message before redirect
      setTimeout(() => {
        navigate('/');
      }, 1500);

    } catch (err) {
      // ERROR RESPONSE: Show error message to user
      setAlert({ 
        type: 'error', 
        message: err.message || 'Signup failed. Please try again.' 
      });
      console.error('Signup error:', err);
    } finally {
      // CLEANUP: Always reset loading state (try/catch/finally pattern)
      // This ensures loading spinner goes away even if error occurs
      setLoading(false);
    }
  };

  return (
    <div className={`zs-root ${mounted ? 'zs-mounted' : ''}`}>
      {/* ── Left Brand Panel ── */}
      <aside className="zs-brand">
        <canvas ref={canvasRef} className="zs-canvas" />
        <div className="zs-glow zs-g1" />
        <div className="zs-glow zs-g2" />
        <div className="zs-glow zs-g3" />

        {/* Corner brackets */}
        <div className="zs-brk zs-tl" /><div className="zs-brk zs-tr" />
        <div className="zs-brk zs-bl" /><div className="zs-brk zs-br" />

        <div className="zs-brand-inner">
          {/* Icon badge */}
          <div className="zs-pen-badge">
            <PenLine size={22} />
          </div>

          <div className="zs-eyebrow">
            <div className="zs-eyebrow-line" /><span>Join True Blogs</span><div className="zs-eyebrow-line" />
          </div>

          <h1 className="zs-headline">Start your<br /><em>writing</em><br />journey</h1>

          <p className="zs-tagline">
            Craft stories, share expertise, and build an audience that cares.
          </p>

          {/* Progress visual */}
          <div className="zs-progress-card">
            <p className="zs-progress-label">Profile completion</p>
            <div className="zs-progress-track">
              <div className="zs-progress-fill" style={{ width: `${(step / 4) * 100}%` }} />
            </div>
            <div className="zs-progress-steps">
              {['Name', 'Email', 'Password', 'Confirm'].map((s, i) => (
                <div key={s} className={`zs-step ${step > i ? 'zs-step-done' : step === i ? 'zs-step-active' : ''}`}>
                  <div className="zs-step-dot">
                    {step > i ? <CheckCircle size={10} /> : <span>{i + 1}</span>}
                  </div>
                  <span className="zs-step-name">{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Writer perks */}
          <div className="zs-perks">
            {[
              { icon: '✍️', text: 'Rich text editor built for writers' },
              { icon: '📈', text: 'Analytics to grow your readership' },
              { icon: '💬', text: 'Built-in community & comments' },
            ].map((p, i) => (
              <div key={i} className="zs-perk" style={{ animationDelay: `${0.5 + i * 0.12}s` }}>
                <span className="zs-perk-icon">{p.icon}</span>
                <span>{p.text}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* ── Right Form Panel ── */}
      <main className="zs-form-side">
        <div className="zs-bg-accent" />
        <div className="zs-form-wrap">

          {/* Mobile logo */}
          <div className="zs-mobile-logo">
            <PenLine size={20} />
            <span>Zarrin Blogs</span>
          </div>

          <div className="zs-form-head">
            <h2 className="zs-form-title">Create your account</h2>
            <p className="zs-form-sub">Join thousands of writers sharing their story</p>
          </div>

          {alert && (
            <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} duration={5000} />
          )}

          <form onSubmit={handleSubmit} className="zs-form">
            {/* Name & Email row on wide screens */}
            <div className="zs-row">
              <Field id="name" label="Full Name" type="text" value={name}
                onChange={e => setName(e.target.value)} placeholder="Your full name"
                focused={focused} setFocused={setFocused} Icon={User} required />
              <Field id="email" label="Email" type="email" value={email}
                onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                focused={focused} setFocused={setFocused} Icon={Mail} required />
            </div>

            {/* Password */}
            <div className="zs-field">
              <label className="zs-label" htmlFor="password">Password</label>
              <div className={`zs-input-wrap ${focused === 'password' ? 'zs-active' : ''}`}>
                <Lock className="zs-icon" size={16} />
                <input id="password" type={showPassword ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocused('password')} onBlur={() => setFocused(null)}
                  placeholder="Create a strong password" className="zs-input" required />
                <button type="button" className="zs-eye" onClick={() => setShowPassword(v => !v)}>
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              {password.length > 0 && (
                <>
                  {/* Strength bar */}
                  <div className="zs-strength-bar">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="zs-seg"
                        style={{ background: pwStrength >= i ? strengthConfig[pwStrength]?.color : 'var(--color-border-default,#E0E0E0)' }} />
                    ))}
                    {strengthConfig[pwStrength] && (
                      <span className="zs-strength-txt" style={{ color: strengthConfig[pwStrength].color }}>
                        {strengthConfig[pwStrength].label}
                      </span>
                    )}
                  </div>

                  {/* Check grid */}
                  {focused === 'password' && (
                    <div className="zs-checklist">
                      {pwChecks.map((c, i) => (
                        <div key={i} className={`zs-chk ${c.ok ? 'zs-chk-ok' : ''}`}>
                          {c.ok
                            ? <CheckCircle size={11} />
                            : <XCircle size={11} />}
                          <span>{c.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Confirm Password */}
            <div className="zs-field">
              <label className="zs-label" htmlFor="confirmPassword">Confirm Password</label>
              <div className={`zs-input-wrap
                ${focused === 'confirm' ? 'zs-active' : ''}
                ${confirmPassword && !passwordsMatch ? 'zs-error' : ''}
                ${passwordsMatch ? 'zs-valid' : ''}
              `}>
                <Lock className="zs-icon" size={16} />
                <input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  onFocus={() => setFocused('confirm')} onBlur={() => setFocused(null)}
                  placeholder="Repeat your password" className="zs-input" required />
                <button type="button" className="zs-eye" onClick={() => setShowConfirmPassword(v => !v)}>
                  {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
                {passwordsMatch && (
                  <CheckCircle size={15} style={{ position:'absolute', right:38, color:'var(--color-secondary,#1E8A56)' }} />
                )}
              </div>
              {confirmPassword && !passwordsMatch && (
                <p className="zs-mismatch">Passwords don't match</p>
              )}
            </div>

            {/* Terms */}
            <label className="zs-terms-row">
              <input type="checkbox" className="zs-checkbox" required />
              <span>I agree to the <Link to="/terms" className="zs-link">Terms of Service</Link> and <Link to="/privacy" className="zs-link">Privacy Policy</Link></span>
            </label>

            {/* Submit */}
            <button type="submit" disabled={loading || !passwordsMatch || !validatePassword(password)} className="zs-btn">
              <span className="zs-btn-shimmer" />
              {loading ? (
                <span className="zs-btn-inner"><span className="zs-spin" />Creating account…</span>
              ) : (
                <span className="zs-btn-inner">Create Account <ArrowRight size={17} /></span>
              )}
            </button>
          </form>

          <div className="zs-signin-row">
            <div className="zs-sr-line" />
            <span>Already have an account? <Link to="/login" className="zs-signin-link">Sign in →</Link></span>
            <div className="zs-sr-line" />
          </div>
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=Outfit:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .zs-root {
          display: flex; min-height: 100vh;
          font-family: 'Outfit', sans-serif;
          background: var(--color-surface-primary,#fff);
          opacity: 0; transition: opacity 0.5s ease;
        }
        .zs-mounted { opacity: 1; }

        /* ── Brand ── */
        .zs-brand {
          position: relative; flex: 0 0 42%;
          background: linear-gradient(160deg,
            #0d3b1a 0%,
            var(--color-secondary-dark,#156B44) 40%,
            var(--color-secondary,#1E8A56) 100%
          );
          display: flex; align-items: center; justify-content: center;
          padding: 56px 48px; overflow: hidden;
        }
        .zs-canvas { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }

        .zs-glow {
          position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none;
        }
        .zs-g1 {
          width: 320px; height: 320px; top: -80px; left: -60px;
          background: rgba(43,100,212,0.2);
          animation: drift 10s ease-in-out infinite;
        }
        .zs-g2 {
          width: 260px; height: 260px; bottom: -40px; right: -60px;
          background: rgba(30,138,86,0.3);
          animation: drift 8s ease-in-out infinite reverse;
        }
        .zs-g3 {
          width: 180px; height: 180px; top: 50%; left: 60%;
          background: rgba(255,255,255,0.05);
          animation: drift 13s ease-in-out infinite 3s;
        }
        @keyframes drift {
          0%,100% { transform: translate(0,0) scale(1); }
          40% { transform: translate(18px,-25px) scale(1.05); }
          70% { transform: translate(-14px,16px) scale(0.96); }
        }

        .zs-brk {
          position: absolute; width: 26px; height: 26px;
          border-color: rgba(255,255,255,0.18); border-style: solid;
        }
        .zs-tl { top: 18px; left: 18px; border-width: 1px 0 0 1px; }
        .zs-tr { top: 18px; right: 18px; border-width: 1px 1px 0 0; }
        .zs-bl { bottom: 18px; left: 18px; border-width: 0 0 1px 1px; }
        .zs-br { bottom: 18px; right: 18px; border-width: 0 1px 1px 0; }

        .zs-brand-inner {
          position: relative; z-index: 2;
          display: flex; flex-direction: column; align-items: center; text-align: center;
          animation: fadeUp 0.8s ease both;
        }
        @keyframes fadeUp { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }

        .zs-pen-badge {
          width: 52px; height: 52px; border-radius: 14px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.2);
          display: flex; align-items: center; justify-content: center;
          color: #fff; margin-bottom: 24px;
          backdrop-filter: blur(8px);
        }

        .zs-eyebrow {
          display: flex; align-items: center; gap: 12px; margin-bottom: 20px;
        }
        .zs-eyebrow-line { width: 32px; height: 1px; background: rgba(255,255,255,0.25); }
        .zs-eyebrow span { font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(255,255,255,0.5); }

        .zs-headline {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.6rem, 4vw, 3.8rem); font-weight: 800;
          line-height: 1.1; color: #fff; margin-bottom: 18px;
          text-shadow: 0 4px 30px rgba(0,0,0,0.2);
        }
        .zs-headline em { font-style: italic; color: rgba(255,255,255,0.75); }

        .zs-tagline {
          font-size: 14px; line-height: 1.65; font-weight: 300;
          color: rgba(255,255,255,0.55); max-width: 260px; margin-bottom: 32px;
        }

        /* Progress card */
        .zs-progress-card {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: 14px; padding: 18px 20px;
          backdrop-filter: blur(12px); margin-bottom: 28px; width: 100%; max-width: 300px;
        }
        .zs-progress-label {
          font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase;
          color: rgba(255,255,255,0.4); margin-bottom: 10px; text-align: left;
        }
        .zs-progress-track {
          height: 4px; background: rgba(255,255,255,0.12); border-radius: 99px;
          margin-bottom: 14px; overflow: hidden;
        }
        .zs-progress-fill {
          height: 100%; border-radius: 99px;
          background: linear-gradient(90deg, rgba(255,255,255,0.6), rgba(255,255,255,0.9));
          transition: width 0.4s cubic-bezier(.4,0,.2,1);
        }
        .zs-progress-steps { display: flex; justify-content: space-between; }
        .zs-step { display: flex; flex-direction: column; align-items: center; gap: 5px; }
        .zs-step-dot {
          width: 20px; height: 20px; border-radius: 50%;
          background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
          display: flex; align-items: center; justify-content: center;
          font-size: 9px; color: rgba(255,255,255,0.4);
          transition: all 0.3s ease;
        }
        .zs-step-done .zs-step-dot { background: rgba(255,255,255,0.25); color: #fff; border-color: rgba(255,255,255,0.5); }
        .zs-step-active .zs-step-dot { border-color: rgba(255,255,255,0.8); background: rgba(255,255,255,0.15); color: rgba(255,255,255,0.8); }
        .zs-step-name { font-size: 10px; color: rgba(255,255,255,0.3); }
        .zs-step-done .zs-step-name, .zs-step-active .zs-step-name { color: rgba(255,255,255,0.6); }

        /* Perks */
        .zs-perks { display: flex; flex-direction: column; gap: 10px; width: 100%; max-width: 290px; }
        .zs-perk {
          display: flex; align-items: center; gap: 10px;
          font-size: 13px; color: rgba(255,255,255,0.5); text-align: left;
          animation: fadeUp 0.6s ease both;
        }
        .zs-perk-icon { font-size: 16px; flex-shrink: 0; }

        /* ── Form Side ── */
        .zs-form-side {
          flex: 1; display: flex; align-items: center; justify-content: center;
          padding: 48px 40px; position: relative;
          background: var(--color-surface-primary, #fff);
          overflow-y: auto;
        }
        .zs-bg-accent {
          position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(ellipse at 20% 80%, rgba(30,138,86,0.04) 0%, transparent 55%),
                      radial-gradient(ellipse at 80% 10%, rgba(43,100,212,0.03) 0%, transparent 45%);
        }

        .zs-form-wrap {
          width: 100%; max-width: 500px; position: relative; z-index: 1;
          animation: fadeUp 0.6s 0.15s ease both;
        }

        .zs-mobile-logo {
          display: none; align-items: center; gap: 10px;
          justify-content: center; margin-bottom: 32px;
          font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700;
          color: var(--color-text-primary,#111);
        }
        .zs-mobile-logo svg { color: var(--color-secondary,#1E8A56); }

        .zs-form-head { margin-bottom: 32px; }
        .zs-form-title {
          font-family: 'Playfair Display', serif;
          font-size: 2rem; font-weight: 700; line-height: 1.2;
          color: var(--color-text-primary,#111); margin-bottom: 7px;
        }
        .zs-form-sub { font-size: 14px; color: var(--color-text-tertiary,#7A7A77); font-weight: 300; }

        .zs-form { display: flex; flex-direction: column; gap: 20px; }

        .zs-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 480px) { .zs-row { grid-template-columns: 1fr; } }

        .zs-field { display: flex; flex-direction: column; gap: 7px; }

        .zs-label {
          font-size: 11px; font-weight: 600; letter-spacing: 0.08em;
          text-transform: uppercase; color: var(--color-text-secondary,#4A4A48);
        }

        .zs-input-wrap {
          position: relative; display: flex; align-items: center;
          background: var(--color-surface-secondary,#F5F5F5);
          border: 1.5px solid var(--color-border-default,#E0E0E0);
          border-radius: 10px;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .zs-active {
          border-color: var(--color-secondary,#1E8A56);
          background: #fff;
          box-shadow: 0 0 0 4px rgba(30,138,86,0.08);
        }
        .zs-valid {
          border-color: var(--color-secondary,#1E8A56);
        }
        .zs-error {
          border-color: var(--color-error,#CC2E2E);
          box-shadow: 0 0 0 3px rgba(204,46,46,0.06);
        }

        .zs-icon {
          position: absolute; left: 13px;
          color: var(--color-text-muted,#B0B0AD);
          pointer-events: none; transition: color 0.2s;
        }
        .zs-active .zs-icon { color: var(--color-secondary,#1E8A56); }

        .zs-input {
          width: 100%; padding: 12px 40px 12px 40px;
          border: none; outline: none; background: transparent;
          font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 400;
          color: var(--color-text-primary,#111);
        }
        .zs-input::placeholder { color: var(--color-text-muted,#B0B0AD); }

        .zs-eye {
          position: absolute; right: 13px;
          background: none; border: none; cursor: pointer; padding: 0;
          color: var(--color-text-muted,#B0B0AD); display: flex;
          align-items: center; transition: color 0.15s;
        }
        .zs-eye:hover { color: var(--color-text-secondary,#4A4A48); }

        /* Strength */
        .zs-strength-bar {
          display: flex; align-items: center; gap: 4px; margin-top: 6px;
        }
        .zs-seg {
          flex: 1; height: 3px; border-radius: 99px;
          transition: background 0.3s;
        }
        .zs-strength-txt {
          font-size: 11px; font-weight: 600; margin-left: 4px; min-width: 36px;
        }

        .zs-checklist {
          display: grid; grid-template-columns: 1fr 1fr; gap: 4px 12px; margin-top: 8px;
        }
        .zs-chk {
          display: flex; align-items: center; gap: 6px;
          font-size: 11px; color: var(--color-text-muted,#B0B0AD);
          transition: color 0.2s;
        }
        .zs-chk svg { flex-shrink: 0; }
        .zs-chk-ok { color: var(--color-secondary,#1E8A56); }
        .zs-chk-ok svg { color: var(--color-secondary,#1E8A56); }

        .zs-mismatch {
          font-size: 12px; color: var(--color-error,#CC2E2E); margin-top: 3px;
        }

        .zs-terms-row {
          display: flex; align-items: flex-start; gap: 10px;
          font-size: 13px; color: var(--color-text-tertiary,#7A7A77); cursor: pointer;
          line-height: 1.5;
        }
        .zs-checkbox {
          width: 15px; height: 15px; margin-top: 1px; cursor: pointer; flex-shrink: 0;
          accent-color: var(--color-secondary,#1E8A56);
        }
        .zs-link { color: var(--color-secondary,#1E8A56); font-weight: 500; text-decoration: none; }
        .zs-link:hover { text-decoration: underline; }

        /* Submit */
        .zs-btn {
          position: relative; width: 100%; padding: 15px; overflow: hidden;
          background: var(--gradient-secondary, linear-gradient(135deg,#1E8A56,#156B44));
          color: var(--color-on-secondary,#fff);
          border: none; border-radius: 10px;
          font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 600;
          letter-spacing: 0.05em; cursor: pointer;
          box-shadow: 0 4px 20px rgba(30,138,86,0.3);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .zs-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(30,138,86,0.4);
        }
        .zs-btn:active:not(:disabled) { transform: translateY(0); }
        .zs-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .zs-btn-shimmer {
          position: absolute; inset: 0;
          background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%);
          transform: translateX(-100%); transition: transform 0.55s ease;
          pointer-events: none;
        }
        .zs-btn:hover .zs-btn-shimmer { transform: translateX(100%); }
        .zs-btn-inner {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          position: relative; z-index: 1;
        }

        .zs-spin {
          display: inline-block; width: 15px; height: 15px;
          border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
          border-radius: 50%; animation: spin 0.65s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Sign-in row */
        .zs-signin-row {
          display: flex; align-items: center; gap: 12px; margin-top: 22px;
          font-size: 13px; color: var(--color-text-muted,#B0B0AD);
        }
        .zs-sr-line { flex: 1; height: 1px; background: var(--color-border-light,#EEE); }
        .zs-signin-link { color: var(--color-primary,#2B64D4); font-weight: 600; text-decoration: none; }
        .zs-signin-link:hover { text-decoration: underline; }

        @media (max-width: 820px) {
          .zs-brand { display: none; }
          .zs-mobile-logo { display: flex; }
          .zs-form-side { padding: 32px 20px; }
        }
      `}</style>
    </div>
  );
};

/* Reusable field */
const Field = ({ id, label, type, value, onChange, placeholder, focused, setFocused, Icon, required }) => (
  <div className="zs-field">
    <label className="zs-label" htmlFor={id}>{label}</label>
    <div className={`zs-input-wrap ${focused === id ? 'zs-active' : ''} ${value ? 'zs-filled' : ''}`}>
      <Icon className="zs-icon" size={16} />
      <input id={id} type={type} value={value} onChange={onChange}
        onFocus={() => setFocused(id)} onBlur={() => setFocused(null)}
        placeholder={placeholder} className="zs-input" required={required}
        autoComplete={id}
      />
    </div>
  </div>
);

export default Signup;