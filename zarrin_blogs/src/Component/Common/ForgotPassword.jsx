import React, { useState } from 'react';
import Paragraph from './Paragraph';
import Headings from './Heading';
import Button from './Button';
import ZarrinLogo from './ZarrinLogo';
import Alert from './Alert';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, Sparkles, Clock, Shield, Lock } from 'lucide-react';
import { getApiUrl } from '../../utils/apiConfig';

// const ForgotPassword = () => {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [alert, setAlert] = useState(null);
//   const [emailSent, setEmailSent] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const trimmedEmail = email.trim();

//       if (!trimmedEmail) {
//         setAlert({ type: 'warning', message: 'Email is required' });
//         setLoading(false);
//         return;
//       }

//       // Validate email format
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (!emailRegex.test(trimmedEmail)) {
//         setAlert({ type: 'warning', message: 'Please enter a valid email address' });
//         setLoading(false);
//         return;
//       }

//       const res = await fetch(getApiUrl('/api/auth/forgot-password'), {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include', // CRITICAL: include cookies for production CORS
//         body: JSON.stringify({ email: trimmedEmail.toLowerCase() })
//       });

//       const data = await res.json();
      
//       // Handle rate limiting (429)
//       if (res.status === 429) {
//         const retryAfter = data.retryAfter || 15 * 60;
//         throw new Error(`Too many requests. Please try again in ${Math.ceil(retryAfter / 60)} minutes.`);
//       }

//       // Even if the server returns error, show success message for security (don't reveal if email exists)
//       if (!res.ok && res.status !== 200) {
//         console.error('Reset password error:', data.message);
//       }

//       setAlert({ type: 'success', message: 'If an account exists with that email, you will receive a password reset link!' });
//       setEmailSent(true);
//     } catch (err) {
//       setAlert({ type: 'error', message: err.message });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-surface-primary dark:bg-surface-dark px-4 py-8 relative overflow-hidden">
//       {/* Animated background elements */}
//       <div className="absolute inset-0 opacity-10 dark:opacity-5 pointer-events-none">
//         <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 dark:bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
//         <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 dark:bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
//       </div>

//       <div className="relative z-10 w-full max-w-md">
//         {/* Card Container */}
//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
//           {/* Gradient Header */}
//           <div className="h-32 bg-error dark:bg-error-dark flex items-center justify-center relative overflow-hidden">
//             <div className="absolute inset-0 opacity-20">
//               <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full mix-blend-multiply filter blur-xl"></div>
//             </div>
//             <div className="relative flex items-center gap-3">
//               <Logo size="text-4xl" className="text-white" />
//               <Headings type="h3" className="text-white font-bold">Zarrin</Headings>
//             </div>
//           </div>

//           {/* Form Content */}
//           <div className="p-8 space-y-6">
//             {emailSent ? (
//               <>
//                 {/* Success State */}
//                 <div className="text-center space-y-4">
//                   <div className="flex justify-center">
//                     <CheckCircle size={64} className="text-green-500" />
//                   </div>
//                   <Headings type="h2" className="text-2xl font-bold text-green-600">
//                     Check Your Email
//                   </Headings>
//                   <Paragraph className="text-gray-600 dark:text-gray-300">
//                     We've sent a password reset link to <span className="font-semibold">{email}</span>
//                   </Paragraph>
//                 </div>

//                 {/* Instructions */}
//                 <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded">
//                   <Paragraph className="text-sm text-blue-800 dark:text-blue-200">
//                     ✓ The link will expire in 1 hour<br/>
//                     ✓ Click the link to reset your password<br/>
//                     ✓ If you didn't request this, ignore the email
//                   </Paragraph>
//                 </div>

//                 {/* Back to Login */}
//                 <Button
//                   text="Back to Login"
//                   variant="primary"
//                   size="lg"
//                   fullWidth
//                   onClick={() => navigate('/login')}
//                   className="shadow-lg hover:shadow-xl"
//                 />

//                 {/* Resend Option */}
//                 <div className="text-center">
//                   <Paragraph className="text-gray-600 dark:text-gray-300 text-sm">
//                     Didn't receive it?{' '}
//                     <button
//                       onClick={() => {
//                         setEmailSent(false);
//                         setEmail('');
//                       }}
//                       className="text-blue-600 dark:text-blue-400 font-bold hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
//                     >
//                       Try again
//                     </button>
//                   </Paragraph>
//                 </div>
//               </>
//             ) : (
//               <>
//                 {/* Welcome Text */}
//                 <div className="text-center space-y-2">
//                   <Headings type="h2" className="text-3xl font-bold text-error dark:text-error-light">
//                     Reset Password
//                   </Headings>
//                   <Paragraph className="text-gray-600 dark:text-gray-300">
//                     Enter your email to receive a password reset link
//                   </Paragraph>
//                 </div>

//                 {/* Alert Messages */}
//                 {alert && (
//                   <Alert 
//                     message={alert.message}
//                     type={alert.type}
//                     onClose={() => setAlert(null)}
//                     duration={5000}
//                   />
//                 )}

//                 {/* Forgot Password Form */}
//                 <form className="space-y-5" onSubmit={handleSubmit}>
//                   {/* Email Input */}
//                   <div className="relative group">
//                     <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
//                       Email Address
//                     </label>
//                     <div className="relative">
//                       <Mail className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-orange-600 transition-colors" size={20} />
//                       <input
//                         type="email"
//                         id="email"
//                         name="email"
//                         value={email}
//                         onChange={e => setEmail(e.target.value)}
//                         placeholder="you@example.com"
//                         className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-orange-600 dark:focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
//                         required
//                       />
//                     </div>
//                   </div>

//                   {/* Submit Button */}
//                   <Button
//                     text={loading ? 'Sending reset link...' : 'Send Reset Link'}
//                     variant="primary"
//                     size="lg"
//                     fullWidth
//                     disabled={loading}
//                     loading={loading}
//                     className="mt-6 shadow-lg hover:shadow-xl"
//                   />
//                 </form>

//                 {/* Divider */}
//                 <div className="relative">
//                   <div className="absolute inset-0 flex items-center">
//                     <div className="w-full border-t border-gray-200 dark:border-gray-600"></div>
//                   </div>
//                   <div className="relative flex justify-center text-sm">
//                     <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">or</span>
//                   </div>
//                 </div>

//                 {/* Back to Login Link */}
//                 <button
//                   onClick={() => navigate('/login')}
//                   className="w-full py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
//                 >
//                   <ArrowLeft size={20} />
//                   Back to Login
//                 </button>

//                 {/* Footer Text */}
//                 <Paragraph className="text-center text-gray-500 text-sm">
//                   Remember your password?{' '}
//                   <Link to="/login" className="text-orange-600 dark:text-orange-400 font-bold hover:text-orange-700 dark:hover:text-orange-300 transition-colors">
//                     Sign in here
//                   </Link>
//                 </Paragraph>
//               </>
//             )}
//           </div>
//         </div>

//         {/* Footer Text */}
//         <Paragraph className="text-center text-gray-500 text-sm mt-6">
//           Secure password recovery. Your email will never be shared.
//         </Paragraph>
//       </div>
//     </div>
//   );
// };

// export default ForgotPassword;

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [emailSent, setEmailSent] = useState(false);

  /* ── EXISTING handleSubmit — preserved exactly ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const trimmedEmail = email.trim();
      if (!trimmedEmail) {
        setAlert({ type: 'warning', message: 'Email is required' });
        setLoading(false);
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        setAlert({ type: 'warning', message: 'Please enter a valid email address' });
        setLoading(false);
        return;
      }
      const res = await fetch(getApiUrl('/api/auth/forgot-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: trimmedEmail.toLowerCase() })
      });
      const data = await res.json();
      if (res.status === 429) {
        const retryAfter = data.retryAfter || 15 * 60;
        throw new Error(`Too many requests. Please try again in ${Math.ceil(retryAfter / 60)} minutes.`);
      }
      if (!res.ok && res.status !== 200) {
        console.error('Reset password error:', data.message);
      }
      setAlert({ type: 'success', message: 'If an account exists with that email, you will receive a password reset link!' });
      setEmailSent(true);
    } catch (err) {
      setAlert({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="zfp-root">
      {/* Background */}
      <div className="zfp-bg-grid" />
      <div className="zfp-orb zfp-o1" />
      <div className="zfp-orb zfp-o2" />
      <div className="zfp-orb zfp-o3" />

      <div className="zfp-center">
        {/* Card */}
        <div className="zfp-card">

          {/* Header */}
          <div className="zfp-card-hd">
            <div className="zfp-hd-glow" />
            <div className="zfp-hd-inner">
              <div className="zfp-logo-wrap">
                <ZarrinLogo variant="light" size="md" />
              </div>
              <div className="zfp-hd-text">
                <div className="zfp-eyebrow"><Sparkles size={11} />Zarrin Blogs</div>
                <Headings type="h3" className="zfp-hd-title">
                  {emailSent ? 'Check Your Email' : 'Reset Password'}
                </Headings>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="zfp-card-body">
            {emailSent ? (
              /* ── SUCCESS STATE ── */
              <div className="zfp-success">
                <div className="zfp-success-icon-wrap">
                  <div className="zfp-success-glow" />
                  <CheckCircle size={52} className="zfp-success-icon" />
                </div>
                <Headings type="h2" className="zfp-success-title">Email Sent!</Headings>
                <Paragraph className="zfp-success-desc">
                  We've sent a password reset link to <strong>{email}</strong>
                </Paragraph>

                {/* Instructions */}
                <div className="zfp-instructions">
                  {[
                    { icon: Clock, text: 'The link will expire in 1 hour' },
                    { icon: Mail, text: 'Click the link to reset your password' },
                    { icon: Shield, text: "If you didn't request this, ignore the email" },
                  ].map(({ icon: Icon, text }, i) => (
                    <div key={i} className="zfp-instr-row">
                      <div className="zfp-instr-icon"><Icon size={13} /></div>
                      <span>{text}</span>
                    </div>
                  ))}
                </div>

                <Button text="Back to Login" variant="primary" size="lg" fullWidth onClick={() => navigate('/login')} />

                <p className="zfp-resend-txt">
                  Didn't receive it?{' '}
                  <button onClick={() => { setEmailSent(false); setEmail(''); }} className="zfp-link">
                    Try again
                  </button>
                </p>
              </div>
            ) : (
              /* ── FORM STATE ── */
              <div className="zfp-form-wrap">
                <div className="zfp-form-header">
                  <Headings type="h2" className="zfp-form-title">Forgot your password?</Headings>
                  <Paragraph className="zfp-form-sub">Enter your email and we'll send you a reset link</Paragraph>
                </div>

                {alert && (
                  <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} duration={5000} />
                )}

                <form className="zfp-form" onSubmit={handleSubmit}>
                  <div className="zfp-field">
                    <label htmlFor="email" className="zfp-label">Email Address</label>
                    <div className="zfp-input-wrap">
                      <Mail size={17} className="zfp-input-icon" />
                      <input
                        type="email" id="email" name="email"
                        value={email} onChange={e => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="zfp-input" required
                      />
                    </div>
                  </div>

                  <Button
                    text={loading ? 'Sending reset link…' : 'Send Reset Link'}
                    variant="primary" size="lg" fullWidth
                    disabled={loading} loading={loading}
                  />
                </form>

                <div className="zfp-divider"><span>or</span></div>

                <button onClick={() => navigate('/login')} className="zfp-back-btn">
                  <ArrowLeft size={16} />Back to Login
                </button>

                <p className="zfp-footer-txt">
                  Remember your password?{' '}
                  <Link to="/login" className="zfp-link">Sign in here</Link>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom note */}
        <p className="zfp-bottom-note">
          <Lock size={12} />Secure password recovery. Your email will never be shared.
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=Outfit:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .zfp-root { font-family: 'Outfit', sans-serif; min-height: 100vh; background: var(--color-surface-secondary,#F5F5F5); display: flex; align-items: center; justify-content: center; padding: 32px 20px; position: relative; overflow: hidden; }

        @keyframes fadeUp { from{opacity:0;transform:translateY(22px);}to{opacity:1;transform:translateY(0);} }
        @keyframes drift { 0%,100%{transform:translate(0,0)scale(1);}40%{transform:translate(20px,-26px)scale(1.06);}70%{transform:translate(-14px,16px)scale(0.96);} }
        @keyframes spin { to{transform:rotate(360deg);} }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.35;transform:scale(1.6);} }

        .zfp-bg-grid { position:absolute;inset:0;pointer-events:none;background-image:linear-gradient(rgba(43,100,212,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(43,100,212,0.05) 1px,transparent 1px);background-size:52px 52px; }
        .zfp-orb { position:absolute;border-radius:50%;filter:blur(80px);pointer-events:none; }
        .zfp-o1{width:380px;height:380px;top:-100px;left:-100px;background:rgba(43,100,212,0.08);animation:drift 11s ease-in-out infinite;}
        .zfp-o2{width:280px;height:280px;bottom:-60px;right:-60px;background:rgba(204,46,46,0.07);animation:drift 9s ease-in-out infinite reverse;}
        .zfp-o3{width:200px;height:200px;top:50%;left:55%;background:rgba(112,64,204,0.06);animation:drift 13s ease-in-out infinite 2s;}

        .zfp-center { position:relative;z-index:2;width:100%;max-width:460px;display:flex;flex-direction:column;align-items:center;gap:18px;animation:fadeUp 0.6s ease both; }

        .zfp-card { width:100%;background:var(--color-surface-primary,#fff);border-radius:24px;overflow:hidden;box-shadow:0 8px 40px rgba(26,24,22,0.12),0 2px 8px rgba(26,24,22,0.06);border:1px solid var(--color-border-light,#EEE); }

        /* CARD HEADER */
        .zfp-card-hd { position:relative;overflow:hidden;background:linear-gradient(148deg,var(--color-error-dark,#A01D1D) 0%,var(--color-error,#CC2E2E) 60%,#d43a3a 100%);padding:28px 32px;display:flex;align-items:center;gap:16px; }
        .zfp-hd-glow { position:absolute;width:200px;height:200px;border-radius:50%;top:-60px;right:-40px;background:rgba(255,255,255,0.07);filter:blur(40px);pointer-events:none; }
        .zfp-hd-inner { position:relative;z-index:1;display:flex;align-items:center;gap:16px; }
        .zfp-logo-wrap { width:50px;height:50px;border-radius:13px;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.25);display:flex;align-items:center;justify-content:center;flex-shrink:0; }
        .zfp-logo { color:#fff !important; }
        .zfp-eyebrow { display:inline-flex;align-items:center;gap:5px;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.2);color:rgba(255,255,255,0.8);font-size:9px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;padding:4px 10px;border-radius:100px;margin-bottom:6px; }
        .zfp-hd-title { font-family:'Playfair Display',serif;font-size:1.4rem;font-weight:800;color:#fff;line-height:1.1; }

        /* CARD BODY */
        .zfp-card-body { padding:32px; }

        /* SUCCESS STATE */
        .zfp-success { display:flex;flex-direction:column;align-items:center;gap:20px;text-align:center; }
        .zfp-success-icon-wrap { position:relative;width:80px;height:80px;display:flex;align-items:center;justify-content:center; }
        .zfp-success-glow { position:absolute;inset:0;border-radius:50%;background:rgba(30,138,86,0.12);animation:drift 4s ease-in-out infinite; }
        .zfp-success-icon { color:var(--color-secondary,#1E8A56);position:relative;z-index:1; }
        .zfp-success-title { font-family:'Playfair Display',serif;font-size:1.6rem;font-weight:800;color:var(--color-secondary,#1E8A56); }
        .zfp-success-desc { font-size:14px;color:var(--color-text-secondary,#4A4A48);line-height:1.65; }
        .zfp-success-desc strong { color:var(--color-text-primary,#111);font-weight:700; }

        .zfp-instructions { width:100%;background:var(--color-surface-secondary,#F5F5F5);border:1px solid var(--color-border-light,#EEE);border-radius:14px;padding:18px 20px;display:flex;flex-direction:column;gap:10px;text-align:left;border-left:3px solid var(--color-secondary,#1E8A56); }
        .zfp-instr-row { display:flex;align-items:flex-start;gap:10px;font-size:13px;color:var(--color-text-secondary,#4A4A48); }
        .zfp-instr-icon { width:26px;height:26px;border-radius:7px;background:rgba(30,138,86,0.1);color:var(--color-secondary,#1E8A56);display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:-1px; }

        .zfp-resend-txt { font-size:13px;color:var(--color-text-secondary,#4A4A48); }

        /* FORM STATE */
        .zfp-form-wrap { display:flex;flex-direction:column;gap:20px; }
        .zfp-form-header { text-align:center; }
        .zfp-form-title { font-family:'Playfair Display',serif;font-size:1.6rem;font-weight:800;color:var(--color-error,#CC2E2E);margin-bottom:6px; }
        .zfp-form-sub { font-size:14px;color:var(--color-text-secondary,#4A4A48); }

        .zfp-form { display:flex;flex-direction:column;gap:16px; }

        .zfp-field { display:flex;flex-direction:column;gap:7px; }
        .zfp-label { font-size:13px;font-weight:600;color:var(--color-text-primary,#111); }
        .zfp-input-wrap { position:relative; }
        .zfp-input-icon { position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--color-text-muted,#B0B0AD);pointer-events:none;transition:color 0.2s; }
        .zfp-input-wrap:focus-within .zfp-input-icon { color:var(--color-error,#CC2E2E); }
        .zfp-input { width:100%;padding:12px 16px 12px 42px;background:var(--color-surface-secondary,#F5F5F5);border:1.5px solid var(--color-border-default,#E0E0E0);border-radius:11px;font-family:'Outfit',sans-serif;font-size:14px;color:var(--color-text-primary,#111);outline:none;transition:border-color 0.2s,box-shadow 0.2s; }
        .zfp-input::placeholder { color:var(--color-text-muted,#B0B0AD); }
        .zfp-input:focus { border-color:var(--color-error,#CC2E2E);box-shadow:0 0 0 4px rgba(204,46,46,0.08);background:var(--color-surface-primary,#fff); }

        .zfp-divider { position:relative;text-align:center;margin:4px 0; }
        .zfp-divider::before { content:'';position:absolute;top:50%;left:0;right:0;height:1px;background:var(--color-border-light,#EEE); }
        .zfp-divider span { position:relative;background:var(--color-surface-primary,#fff);padding:0 12px;font-size:12px;color:var(--color-text-muted,#B0B0AD); }

        .zfp-back-btn { width:100%;padding:12px 20px;background:var(--color-surface-secondary,#F5F5F5);border:1.5px solid var(--color-border-default,#E0E0E0);border-radius:11px;font-family:'Outfit',sans-serif;font-size:14px;font-weight:600;color:var(--color-text-primary,#111);cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:all 0.18s; }
        .zfp-back-btn:hover { border-color:var(--color-primary,#2B64D4);color:var(--color-primary,#2B64D4); }

        .zfp-footer-txt { font-size:13px;color:var(--color-text-secondary,#4A4A48);text-align:center; }
        .zfp-link { color:var(--color-error,#CC2E2E);font-weight:700;cursor:pointer;background:none;border:none;padding:0;font-family:inherit;font-size:inherit;text-decoration:none;transition:color 0.15s; }
        .zfp-link:hover { color:var(--color-error-dark,#A01D1D); }

        .zfp-bottom-note { display:flex;align-items:center;gap:6px;font-size:12px;color:var(--color-text-muted,#B0B0AD); }

        @media(max-width:480px) { .zfp-card-hd{padding:22px 22px;}.zfp-card-body{padding:24px 22px;} }
      `}</style>
    </div>
  );
};

export default ForgotPassword;