import React, { useState } from 'react';
import Paragraph from './Paragraph';
import Headings from './Heading';
import Alert from './Alert';
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, CheckCircle, ArrowRight } from 'lucide-react';
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

  const validatePassword = (pass) => {
    if (pass.length < 8) return false;
    if (!/[a-z]/.test(pass)) return false;
    if (!/[A-Z]/.test(pass)) return false;
    if (!/\d/.test(pass)) return false;
    return true;
  };
  
  const passwordsMatch = password === confirmPassword && password.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
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
      const res = await fetch(getApiUrl('/api/auth/signup'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // CRITICAL: include cookies for production CORS
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Signup failed');
      
      // Signup successful - redirect to OTP verification page
      setAlert({ type: 'success', message: 'Account created! Check your email for OTP.' });
      setTimeout(() => {
        navigate('/verify-otp', { 
          state: { email: email.toLowerCase().trim() } 
        });
      }, 1500);
    } catch (err) {
      setAlert({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 md:p-8 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-300 to-pink-300 dark:from-purple-600 dark:to-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-blue-300 to-indigo-300 dark:from-blue-600 dark:to-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Card Container */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden backdrop-blur">
          {/* Gradient Header */}
          <div className="h-1 bg-gradient-to-r from-[#6366F1] via-[#EC4899] to-[#8B5CF6]"></div>

          {/* Header */}
          <div className="p-8 text-center border-b border-gray-100 dark:border-slate-800 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900">
            <Headings type="h2" className="bg-gradient-to-r from-[#6366F1] to-[#EC4899] bg-clip-text text-transparent text-2xl mb-2 font-bold">
              Create Your Journey
            </Headings>
            <Paragraph variant="muted" className="text-sm">
              Join thousands of amazing writers
            </Paragraph>
          </div>

          {/* Form Content */}
          <div className="p-8 space-y-6">
            {/* Alert Messages */}
            {alert && (
              <Alert 
                message={alert.message}
                type={alert.type}
                onClose={() => setAlert(null)}
                duration={5000}
              />
            )}

            {/* Signup Form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Name Input */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent mb-2">
                  Full Name
                </label>
                <div className="relative group">
                  <User className="absolute left-3 top-3.5 text-slate-400 pointer-events-none group-focus-within:text-[#6366F1] transition-colors" size={18} />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-lg focus:border-[#6366F1] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 transition-all duration-200 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                    required
                  />
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-3.5 text-slate-400 pointer-events-none group-focus-within:text-[#6366F1] transition-colors" size={18} />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-lg focus:border-[#6366F1] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 transition-all duration-200 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent mb-2">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3.5 text-slate-400 pointer-events-none group-focus-within:text-[#6366F1] transition-colors" size={18} />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-lg focus:border-[#6366F1] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 transition-all duration-200 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <Paragraph variant="sm" className={`mt-2 flex items-center gap-1 font-medium ${validatePassword(password) ? 'text-green-600 dark:text-green-400' : 'text-slate-500'}`}>
                  {validatePassword(password) ? (
                    <><CheckCircle size={14} /> Strong password</>
                  ) : (
                    <>8+ chars with uppercase, lowercase, number</>
                  )}
                </Paragraph>
              </div>

              {/* Confirm Password Input */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent mb-2">
                  Confirm Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3.5 text-slate-400 pointer-events-none group-focus-within:text-[#6366F1] transition-colors" size={18} />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••"
                    className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-lg focus:border-[#6366F1] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 transition-all duration-200 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {password && (
                  <Paragraph variant="sm" className={`mt-2 flex items-center gap-1 font-medium ${passwordsMatch ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {passwordsMatch ? (
                      <><CheckCircle size={14} /> Passwords match</>
                    ) : (
                      <>Passwords don't match</>
                    )}
                  </Paragraph>
                )}
              </div>

              {/* Terms & Conditions */}
              <label className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 mt-1 rounded border-slate-300 dark:border-slate-700 text-[#6366F1] focus:ring-[#6366F1] dark:bg-slate-800 accent-gradient" required />
                <span>I agree to the <span className="bg-gradient-to-r from-[#6366F1] to-[#EC4899] bg-clip-text text-transparent font-semibold">Terms & Conditions</span> and <span className="bg-gradient-to-r from-[#6366F1] to-[#EC4899] bg-clip-text text-transparent font-semibold">Privacy Policy</span></span>
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !passwordsMatch}
                className="w-full py-3 bg-gradient-to-r from-[#6366F1] to-[#EC4899] hover:from-[#5558E3] hover:to-[#E23DA5] text-white font-bold rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Creating Account...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    Create Account <ArrowRight size={18} />
                  </div>
                )}
              </button>
            </form>

            {/* Sign In Link */}
            <div className="text-center pt-6 border-t border-gray-100 dark:border-slate-800">
              <Paragraph variant="sm" className="text-slate-600 dark:text-slate-400">
                Already have an account?{' '}
                <Link to="/login" className="bg-gradient-to-r from-[#6366F1] to-[#EC4899] bg-clip-text text-transparent hover:opacity-80 font-semibold transition-opacity">
                  Sign in
                </Link>
              </Paragraph>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default Signup;
