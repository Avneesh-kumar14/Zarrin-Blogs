import React, { useState, useEffect } from 'react';
import Paragraph from './Paragraph';
import Headings from './Heading';
import Button from './Button';
import ZarrinLogo from './ZarrinLogo';
import Alert from './Alert';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, Sparkles, Shield } from 'lucide-react';
import { getApiUrl } from '../../utils/apiConfig';

// const ResetPassword = () => {
//   const { token } = useParams();
//   const navigate = useNavigate();
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [verifying, setVerifying] = useState(true);
//   const [tokenValid, setTokenValid] = useState(false);
//   const [alert, setAlert] = useState(null);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [resetSuccess, setResetSuccess] = useState(false);

//   // Verify token on component mount
//   useEffect(() => {
//     const verifyToken = async () => {
//       if (!token) {
//         setAlert({ type: 'error', message: 'Invalid reset link' });
//         setVerifying(false);
//         return;
//       }

//       try {
//         const res = await fetch(getApiUrl('/api/auth/verify-reset-token'), {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           credentials: 'include', // CRITICAL: include cookies for production CORS
//           body: JSON.stringify({ token })
//         });

//         const data = await res.json();

//         if (!res.ok) {
//           throw new Error(data.message || 'Invalid or expired reset link');
//         }

//         setTokenValid(true);
//       } catch (err) {
//         setAlert({ type: 'error', message: err.message });
//       } finally {
//         setVerifying(false);
//       }
//     };

//     verifyToken();
//   }, [token]);

//   const validatePassword = (pass) => {
//     if (pass.length < 8) return false;
//     if (!/[a-z]/.test(pass)) return false;
//     if (!/[A-Z]/.test(pass)) return false;
//     if (!/\d/.test(pass)) return false;
//     return true;
//   };

//   const passwordsMatch = password === confirmPassword && password.length > 0;

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     // Validation
//     if (!validatePassword(password)) {
//       setAlert({ type: 'warning', message: 'Password must be 8+ chars with uppercase, lowercase, and number (e.g., MyPass123)' });
//       setLoading(false);
//       return;
//     }

//     if (!passwordsMatch) {
//       setAlert({ type: 'warning', message: 'Passwords do not match' });
//       setLoading(false);
//       return;
//     }

//     try {
//       const res = await fetch(getApiUrl('/api/auth/reset-password-with-token'), {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include', // CRITICAL: include cookies for production CORS
//         body: JSON.stringify({ token, newPassword: password, confirmPassword })
//       });

//       const data = await res.json();

//       if (!res.ok) throw new Error(data.message || 'Password reset failed');

//       setAlert({ type: 'success', message: 'Password reset successful!' });
//       setResetSuccess(true);
      
//       setTimeout(() => {
//         navigate('/login');
//       }, 2000);
//     } catch (err) {
//       setAlert({ type: 'error', message: err.message });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Verifying token state
//   if (verifying) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-surface-primary dark:bg-surface-dark">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <Paragraph>Verifying reset link...</Paragraph>
//         </div>
//       </div>
//     );
//   }

//   // Invalid token state
//   if (!tokenValid) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-surface-primary dark:bg-surface-dark px-4">
//         <div className="relative z-10 w-full max-w-md">
//           <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
//             <div className="h-32 bg-success dark:bg-success-dark flex items-center justify-center relative overflow-hidden">
//               <div className="relative flex items-center gap-3">
//                 <AlertCircle size={40} className="text-white" />
//                 <Headings type="h3" className="text-white font-bold">Error</Headings>
//               </div>
//             </div>

//             <div className="p-8 text-center space-y-6">
//               <Headings type="h2" className="text-2xl font-bold text-red-600">
//                 Invalid Reset Link
//               </Headings>
//               <Paragraph className="text-gray-600 dark:text-gray-300">
//                 {alert?.message || 'This password reset link is invalid or has expired.'}
//               </Paragraph>

//               <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded">
//                 <Paragraph className="text-sm text-red-800 dark:text-red-200">
//                   Reset links expire after 1 hour for security reasons.
//                 </Paragraph>
//               </div>

//               <Button
//                 text="Request New Reset Link"
//                 variant="primary"
//                 size="lg"
//                 fullWidth
//                 onClick={() => navigate('/forgot-password')}
//                 className="shadow-lg hover:shadow-xl"
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

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
//           {/* Solid Header */}
//           <div className="h-32 bg-success dark:bg-success-dark flex items-center justify-center relative overflow-hidden">
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
//             {resetSuccess ? (
//               <>
//                 {/* Success State */}
//                 <div className="text-center space-y-4">
//                   <div className="flex justify-center">
//                     <CheckCircle size={64} className="text-green-500" />
//                   </div>
//                   <Headings type="h2" className="text-2xl font-bold text-green-600">
//                     Password Reset!
//                   </Headings>
//                   <Paragraph className="text-gray-600 dark:text-gray-300">
//                     Your password has been successfully reset. You can now login with your new password.
//                   </Paragraph>
//                 </div>

//                 {/* Redirect Message */}
//                 <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded">
//                   <Paragraph className="text-sm text-green-800 dark:text-green-200">
//                     Redirecting to login page...
//                   </Paragraph>
//                 </div>
//               </>
//             ) : (
//               <>
//                 {/* Welcome Text */}
//                 <div className="text-center space-y-2">
//                   <Headings type="h2" className="text-3xl font-bold text-on-success">
//                     Create New Password
//                   </Headings>
//                   <Paragraph className="text-gray-600 dark:text-gray-300">
//                     Enter a strong password to secure your account
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

//                 {/* Password Reset Form */}
//                 <form className="space-y-5" onSubmit={handleSubmit}>
//                   {/* New Password Input */}
//                   <div className="relative group">
//                     <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
//                       New Password
//                     </label>
//                     <div className="relative">
//                       <Lock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-green-600 transition-colors" size={20} />
//                       <input
//                         type={showPassword ? "text" : "password"}
//                         id="password"
//                         name="password"
//                         value={password}
//                         onChange={e => setPassword(e.target.value)}
//                         placeholder="••••••••"
//                         className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-green-600 dark:focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
//                         required
//                       />
//                       <button
//                         type="button"
//                         onClick={() => setShowPassword(!showPassword)}
//                         className="absolute right-4 top-3.5 text-gray-400 hover:text-green-600 transition-colors"
//                       >
//                         {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                       </button>
//                     </div>
//                   </div>

//                   {/* Confirm Password Input */}
//                   <div className="relative group">
//                     <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
//                       Confirm Password
//                     </label>
//                     <div className="relative">
//                       <Lock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-green-600 transition-colors" size={20} />
//                       <input
//                         type={showConfirmPassword ? "text" : "password"}
//                         id="confirmPassword"
//                         name="confirmPassword"
//                         value={confirmPassword}
//                         onChange={e => setConfirmPassword(e.target.value)}
//                         placeholder="••••••••"
//                         className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-green-600 dark:focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
//                         required
//                       />
//                       <button
//                         type="button"
//                         onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                         className="absolute right-4 top-3.5 text-gray-400 hover:text-green-600 transition-colors"
//                       >
//                         {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                       </button>
//                     </div>
//                   </div>

//                   {/* Password Requirements */}
//                   <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded">
//                     <Paragraph className="text-sm text-blue-800 dark:text-blue-200 font-semibold mb-2">
//                       Password must contain:
//                     </Paragraph>
//                     <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
//                       <li>✓ At least 8 characters</li>
//                       <li>✓ Uppercase letter (A-Z)</li>
//                       <li>✓ Lowercase letter (a-z)</li>
//                       <li>✓ Number (0-9)</li>
//                     </ul>
//                   </div>

//                   {/* Match Status */}
//                   {confirmPassword && (
//                     <div className={`p-3 rounded ${passwordsMatch ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
//                       <Paragraph className="text-sm">
//                         {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
//                       </Paragraph>
//                     </div>
//                   )}

//                   {/* Submit Button */}
//                   <Button
//                     text={loading ? 'Resetting password...' : 'Reset Password'}
//                     variant="primary"
//                     size="lg"
//                     fullWidth
//                     disabled={loading || !passwordsMatch}
//                     loading={loading}
//                     className="mt-6 shadow-lg hover:shadow-xl"
//                   />
//                 </form>
//               </>
//             )}
//           </div>
//         </div>

//         {/* Footer Text */}
//         <Paragraph className="text-center text-gray-500 text-sm mt-6">
//           Creating a strong password helps protect your account.
//         </Paragraph>
//       </div>
//     </div>
//   );
// };

// export default ResetPassword;


const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [alert, setAlert] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  /* ── EXISTING verifyToken — preserved exactly ── */
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setAlert({ type: 'error', message: 'Invalid reset link' });
        setVerifying(false);
        return;
      }
      try {
        const res = await fetch(getApiUrl('/api/auth/verify-reset-token'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ token })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Invalid or expired reset link');
        setTokenValid(true);
      } catch (err) {
        setAlert({ type: 'error', message: err.message });
      } finally {
        setVerifying(false);
      }
    };
    verifyToken();
  }, [token]);

  /* ── EXISTING validatePassword — preserved exactly ── */
  const validatePassword = (pass) => {
    if (pass.length < 8) return false;
    if (!/[a-z]/.test(pass)) return false;
    if (!/[A-Z]/.test(pass)) return false;
    if (!/\d/.test(pass)) return false;
    return true;
  };

  const passwordsMatch = password === confirmPassword && password.length > 0;

  /* ── EXISTING handleSubmit — preserved exactly ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!validatePassword(password)) {
      setAlert({ type: 'warning', message: 'Password must be 8+ chars with uppercase, lowercase, and number (e.g., MyPass123)' });
      setLoading(false);
      return;
    }
    if (!passwordsMatch) {
      setAlert({ type: 'warning', message: 'Passwords do not match' });
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(getApiUrl('/api/auth/reset-password-with-token'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ token, newPassword: password, confirmPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Password reset failed');
      setAlert({ type: 'success', message: 'Password reset successful!' });
      setResetSuccess(true);
      setTimeout(() => { navigate('/login'); }, 2000);
    } catch (err) {
      setAlert({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  /* ── VERIFYING STATE ── */
  if (verifying) {
    return (
      <div className="zrp-root">
        <div className="zrp-bg-grid" /><div className="zrp-orb zrp-o1" /><div className="zrp-orb zrp-o2" />
        <div className="zrp-center" style={{ minHeight: '100vh', justifyContent: 'center' }}>
          <div className="zrp-verifying">
            <div className="zrp-spinner" />
            <Paragraph className="zrp-verify-txt">Verifying reset link…</Paragraph>
          </div>
        </div>
        <style>{styles}</style>
      </div>
    );
  }

  /* ── INVALID TOKEN STATE ── */
  if (!tokenValid) {
    return (
      <div className="zrp-root">
        <div className="zrp-bg-grid" /><div className="zrp-orb zrp-o1" /><div className="zrp-orb zrp-o2" />
        <div className="zrp-center">
          <div className="zrp-card">
            {/* Header - error */}
            <div className="zrp-card-hd zrp-hd-error">
              <div className="zrp-hd-glow" />
              <div className="zrp-hd-inner">
                <div className="zrp-logo-wrap"><AlertCircle size={26} color="#fff" /></div>
                <div>
                  <div className="zrp-eyebrow"><Sparkles size={11} />Zarrin Blogs</div>
                  <Headings type="h3" className="zrp-hd-title">Link Invalid</Headings>
                </div>
              </div>
            </div>
            <div className="zrp-card-body">
              <div className="zrp-invalid-wrap">
                <div className="zrp-invalid-icon-wrap">
                  <AlertCircle size={48} className="zrp-invalid-icon" />
                </div>
                <Headings type="h2" className="zrp-invalid-title">Invalid Reset Link</Headings>
                <Paragraph className="zrp-invalid-desc">
                  {alert?.message || 'This password reset link is invalid or has expired.'}
                </Paragraph>
                <div className="zrp-warn-box">
                  <Shield size={14} className="zrp-warn-icon" />
                  <span>Reset links expire after 1 hour for security reasons.</span>
                </div>
                <Button text="Request New Reset Link" variant="primary" size="lg" fullWidth onClick={() => navigate('/forgot-password')} />
              </div>
            </div>
          </div>
          <p className="zrp-bottom-note"><Lock size={12} />Secure password recovery. Your account is safe.</p>
        </div>
        <style>{styles}</style>
      </div>
    );
  }

  /* ── MAIN FORM ── */
  return (
    <div className="zrp-root">
      <div className="zrp-bg-grid" />
      <div className="zrp-orb zrp-o1" /><div className="zrp-orb zrp-o2" /><div className="zrp-orb zrp-o3" />

      <div className="zrp-center">
        <div className="zrp-card">

          {/* Header */}
          <div className="zrp-card-hd zrp-hd-success">
            <div className="zrp-hd-glow" />
            <div className="zrp-hd-inner">
              <div className="zrp-logo-wrap">
                <ZarrinLogo variant="light" size="md" />
              </div>
              <div>
                <div className="zrp-eyebrow"><Sparkles size={11} />Zarrin Blogs</div>
                <Headings type="h3" className="zrp-hd-title">
                  {resetSuccess ? 'Password Reset!' : 'New Password'}
                </Headings>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="zrp-card-body">
            {resetSuccess ? (
              /* ── SUCCESS STATE ── */
              <div className="zrp-success">
                <div className="zrp-success-icon-wrap">
                  <div className="zrp-success-glow" />
                  <CheckCircle size={52} className="zrp-success-icon" />
                </div>
                <Headings type="h2" className="zrp-success-title">Password Reset!</Headings>
                <Paragraph className="zrp-success-desc">
                  Your password has been successfully reset. You can now login with your new password.
                </Paragraph>
                <div className="zrp-redirect-box">
                  <div className="zrp-redir-dot" />
                  <span>Redirecting to login page…</span>
                </div>
              </div>
            ) : (
              /* ── FORM ── */
              <div className="zrp-form-wrap">
                <div className="zrp-form-header">
                  <Headings type="h2" className="zrp-form-title">Create New Password</Headings>
                  <Paragraph className="zrp-form-sub">Enter a strong password to secure your account</Paragraph>
                </div>

                {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} duration={5000} />}

                <form className="zrp-form" onSubmit={handleSubmit}>
                  {/* New Password */}
                  <div className="zrp-field">
                    <label htmlFor="password" className="zrp-label">New Password</label>
                    <div className="zrp-input-wrap">
                      <Lock size={17} className="zrp-input-icon" />
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password" name="password"
                        value={password} onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••" className="zrp-input" required
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="zrp-eye-btn">
                        {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="zrp-field">
                    <label htmlFor="confirmPassword" className="zrp-label">Confirm Password</label>
                    <div className="zrp-input-wrap">
                      <Lock size={17} className="zrp-input-icon" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword" name="confirmPassword"
                        value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="••••••••" className="zrp-input" required
                      />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="zrp-eye-btn">
                        {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    </div>
                  </div>

                  {/* Password requirements */}
                  <div className="zrp-req-box">
                    <p className="zrp-req-title">Password must contain:</p>
                    {[
                      { check: password.length >= 8, text: 'At least 8 characters' },
                      { check: /[A-Z]/.test(password), text: 'Uppercase letter (A–Z)' },
                      { check: /[a-z]/.test(password), text: 'Lowercase letter (a–z)' },
                      { check: /\d/.test(password), text: 'Number (0–9)' },
                    ].map(({ check, text }, i) => (
                      <div key={i} className={`zrp-req-row ${check && password ? 'zrp-req-ok' : ''}`}>
                        <div className="zrp-req-dot" />
                        <span>{text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Match indicator */}
                  {confirmPassword && (
                    <div className={`zrp-match ${passwordsMatch ? 'zrp-match-ok' : 'zrp-match-err'}`}>
                      {passwordsMatch ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                      <span>{passwordsMatch ? 'Passwords match' : 'Passwords do not match'}</span>
                    </div>
                  )}

                  <Button
                    text={loading ? 'Resetting password…' : 'Reset Password'}
                    variant="primary" size="lg" fullWidth
                    disabled={loading || !passwordsMatch} loading={loading}
                  />
                </form>
              </div>
            )}
          </div>
        </div>

        <p className="zrp-bottom-note"><Lock size={12} />Creating a strong password helps protect your account.</p>
      </div>

      <style>{styles}</style>
    </div>
  );
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=Outfit:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .zrp-root { font-family: 'Outfit', sans-serif; min-height: 100vh; background: var(--color-surface-secondary,#F5F5F5); display: flex; align-items: center; justify-content: center; padding: 32px 20px; position: relative; overflow: hidden; }

  @keyframes fadeUp { from{opacity:0;transform:translateY(22px);}to{opacity:1;transform:translateY(0);} }
  @keyframes drift { 0%,100%{transform:translate(0,0)scale(1);}40%{transform:translate(20px,-26px)scale(1.06);}70%{transform:translate(-14px,16px)scale(0.96);} }
  @keyframes spin { to{transform:rotate(360deg);} }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.35;transform:scale(1.6);} }

  .zrp-bg-grid { position:absolute;inset:0;pointer-events:none;background-image:linear-gradient(rgba(43,100,212,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(43,100,212,0.05) 1px,transparent 1px);background-size:52px 52px; }
  .zrp-orb { position:absolute;border-radius:50%;filter:blur(80px);pointer-events:none; }
  .zrp-o1{width:380px;height:380px;top:-100px;left:-100px;background:rgba(30,138,86,0.07);animation:drift 11s ease-in-out infinite;}
  .zrp-o2{width:280px;height:280px;bottom:-60px;right:-60px;background:rgba(43,100,212,0.07);animation:drift 9s ease-in-out infinite reverse;}
  .zrp-o3{width:200px;height:200px;top:50%;left:55%;background:rgba(112,64,204,0.05);animation:drift 13s ease-in-out infinite 2s;}

  .zrp-center { position:relative;z-index:2;width:100%;max-width:460px;display:flex;flex-direction:column;align-items:center;gap:18px;animation:fadeUp 0.6s ease both; }

  .zrp-card { width:100%;background:var(--color-surface-primary,#fff);border-radius:24px;overflow:hidden;box-shadow:0 8px 40px rgba(26,24,22,0.12),0 2px 8px rgba(26,24,22,0.06);border:1px solid var(--color-border-light,#EEE); }

  /* VERIFYING */
  .zrp-verifying { text-align:center;display:flex;flex-direction:column;align-items:center;gap:16px; }
  .zrp-spinner { width:44px;height:44px;border:3px solid rgba(43,100,212,0.15);border-top-color:var(--color-primary,#2B64D4);border-radius:50%;animation:spin 0.7s linear infinite; }
  .zrp-verify-txt { font-size:15px;color:var(--color-text-secondary,#4A4A48); }

  /* CARD HEADER */
  .zrp-card-hd { position:relative;overflow:hidden;padding:28px 32px;display:flex;align-items:center;gap:16px; }
  .zrp-hd-success { background:linear-gradient(148deg,#1A6A3A 0%,var(--color-secondary,#1E8A56) 60%,#25a266 100%); }
  .zrp-hd-error { background:linear-gradient(148deg,var(--color-error-dark,#A01D1D) 0%,var(--color-error,#CC2E2E) 60%,#d43a3a 100%); }
  .zrp-hd-glow { position:absolute;width:200px;height:200px;border-radius:50%;top:-60px;right:-40px;background:rgba(255,255,255,0.07);filter:blur(40px);pointer-events:none; }
  .zrp-hd-inner { position:relative;z-index:1;display:flex;align-items:center;gap:16px; }
  .zrp-logo-wrap { width:50px;height:50px;border-radius:13px;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.25);display:flex;align-items:center;justify-content:center;flex-shrink:0; }
  .zrp-logo { color:#fff !important; }
  .zrp-eyebrow { display:inline-flex;align-items:center;gap:5px;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.2);color:rgba(255,255,255,0.8);font-size:9px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;padding:4px 10px;border-radius:100px;margin-bottom:6px; }
  .zrp-hd-title { font-family:'Playfair Display',serif;font-size:1.4rem;font-weight:800;color:#fff;line-height:1.1; }

  /* CARD BODY */
  .zrp-card-body { padding:32px; }

  /* INVALID TOKEN */
  .zrp-invalid-wrap { display:flex;flex-direction:column;align-items:center;gap:20px;text-align:center; }
  .zrp-invalid-icon-wrap { width:80px;height:80px;border-radius:50%;background:rgba(204,46,46,0.08);display:flex;align-items:center;justify-content:center; }
  .zrp-invalid-icon { color:var(--color-error,#CC2E2E); }
  .zrp-invalid-title { font-family:'Playfair Display',serif;font-size:1.5rem;font-weight:800;color:var(--color-error,#CC2E2E); }
  .zrp-invalid-desc { font-size:14px;color:var(--color-text-secondary,#4A4A48);line-height:1.65; }
  .zrp-warn-box { width:100%;display:flex;align-items:flex-start;gap:10px;background:rgba(204,46,46,0.05);border:1px solid rgba(204,46,46,0.15);border-left:3px solid var(--color-error,#CC2E2E);border-radius:10px;padding:14px 16px;font-size:13px;color:var(--color-text-secondary,#4A4A48);text-align:left; }
  .zrp-warn-icon { color:var(--color-error,#CC2E2E);flex-shrink:0;margin-top:1px; }

  /* SUCCESS STATE */
  .zrp-success { display:flex;flex-direction:column;align-items:center;gap:20px;text-align:center; }
  .zrp-success-icon-wrap { position:relative;width:80px;height:80px;display:flex;align-items:center;justify-content:center; }
  .zrp-success-glow { position:absolute;inset:0;border-radius:50%;background:rgba(30,138,86,0.12);animation:drift 4s ease-in-out infinite; }
  .zrp-success-icon { color:var(--color-secondary,#1E8A56);position:relative;z-index:1; }
  .zrp-success-title { font-family:'Playfair Display',serif;font-size:1.6rem;font-weight:800;color:var(--color-secondary,#1E8A56); }
  .zrp-success-desc { font-size:14px;color:var(--color-text-secondary,#4A4A48);line-height:1.65; }
  .zrp-redirect-box { display:flex;align-items:center;gap:10px;background:rgba(30,138,86,0.07);border:1px solid rgba(30,138,86,0.2);border-radius:10px;padding:12px 18px;font-size:13px;color:var(--color-secondary,#1E8A56);font-weight:500; }
  .zrp-redir-dot { width:8px;height:8px;border-radius:50%;background:var(--color-secondary,#1E8A56);animation:pulse 1.4s ease-in-out infinite;flex-shrink:0; }

  /* FORM */
  .zrp-form-wrap { display:flex;flex-direction:column;gap:20px; }
  .zrp-form-header { text-align:center; }
  .zrp-form-title { font-family:'Playfair Display',serif;font-size:1.5rem;font-weight:800;color:var(--color-secondary,#1E8A56);margin-bottom:6px; }
  .zrp-form-sub { font-size:14px;color:var(--color-text-secondary,#4A4A48); }

  .zrp-form { display:flex;flex-direction:column;gap:16px; }

  .zrp-field { display:flex;flex-direction:column;gap:7px; }
  .zrp-label { font-size:13px;font-weight:600;color:var(--color-text-primary,#111); }
  .zrp-input-wrap { position:relative; }
  .zrp-input-icon { position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--color-text-muted,#B0B0AD);pointer-events:none;transition:color 0.2s; }
  .zrp-input-wrap:focus-within .zrp-input-icon { color:var(--color-secondary,#1E8A56); }
  .zrp-input { width:100%;padding:12px 44px 12px 42px;background:var(--color-surface-secondary,#F5F5F5);border:1.5px solid var(--color-border-default,#E0E0E0);border-radius:11px;font-family:'Outfit',sans-serif;font-size:14px;color:var(--color-text-primary,#111);outline:none;transition:border-color 0.2s,box-shadow 0.2s; }
  .zrp-input::placeholder { color:var(--color-text-muted,#B0B0AD); }
  .zrp-input:focus { border-color:var(--color-secondary,#1E8A56);box-shadow:0 0 0 4px rgba(30,138,86,0.08);background:var(--color-surface-primary,#fff); }
  .zrp-eye-btn { position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:var(--color-text-muted,#B0B0AD);padding:4px;display:flex;align-items:center;transition:color 0.2s; }
  .zrp-eye-btn:hover { color:var(--color-secondary,#1E8A56); }

  .zrp-req-box { background:var(--color-surface-secondary,#F5F5F5);border:1px solid var(--color-border-light,#EEE);border-left:3px solid var(--color-primary,#2B64D4);border-radius:11px;padding:16px 18px;display:flex;flex-direction:column;gap:8px; }
  .zrp-req-title { font-size:12px;font-weight:700;color:var(--color-text-primary,#111);margin-bottom:2px; }
  .zrp-req-row { display:flex;align-items:center;gap:9px;font-size:12px;color:var(--color-text-muted,#B0B0AD);transition:color 0.2s; }
  .zrp-req-dot { width:6px;height:6px;border-radius:50%;background:var(--color-border-default,#E0E0E0);flex-shrink:0;transition:background 0.2s; }
  .zrp-req-ok { color:var(--color-secondary,#1E8A56); }
  .zrp-req-ok .zrp-req-dot { background:var(--color-secondary,#1E8A56); }

  .zrp-match { display:flex;align-items:center;gap:8px;padding:11px 14px;border-radius:10px;font-size:13px;font-weight:600; }
  .zrp-match-ok { background:rgba(30,138,86,0.07);color:var(--color-secondary,#1E8A56);border:1px solid rgba(30,138,86,0.18); }
  .zrp-match-err { background:rgba(204,46,46,0.06);color:var(--color-error,#CC2E2E);border:1px solid rgba(204,46,46,0.15); }

  .zrp-bottom-note { display:flex;align-items:center;gap:6px;font-size:12px;color:var(--color-text-muted,#B0B0AD); }

  @media(max-width:480px) { .zrp-card-hd{padding:22px;}.zrp-card-body{padding:24px 22px;} }
`;

export default ResetPassword;