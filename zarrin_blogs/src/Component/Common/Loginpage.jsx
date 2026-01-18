import React, { useState } from 'react';
import Paragraph from './Paragraph';
import Headings from './Heading';
import Button from './Button';
import Logo from './Logo';
import Alert from './Alert';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rateLimitReset, setRateLimitReset] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Validate inputs
      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();

      if (!trimmedEmail || !trimmedPassword) {
        setAlert({ type: 'warning', message: 'Email and password are required' });
        setLoading(false);
        return;
      }

      if (trimmedPassword.length < 6) {
        setAlert({ type: 'warning', message: 'Password must be at least 6 characters long' });
        setLoading(false);
        return;
      }

      const loginData = { 
        email: trimmedEmail.toLowerCase(),
        password: trimmedPassword
      };
      
      console.log('📤 Login attempt with:', { email: loginData.email, password: '***' });
      
      const res = await fetch('http://localhost:8200/api/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      });
      
      let data = await res.json();
      console.log('📥 Login response:', res.status, data);
      
      // Handle rate limiting (429)
      if (res.status === 429) {
        const retryAfter = data.retryAfter || 15 * 60; // Default to 15 minutes
        setRateLimitReset(retryAfter);
        throw new Error(`Too many login attempts. Please try again in ${Math.ceil(retryAfter / 60)} minutes.`);
      }

      // Handle email not verified (403)
      if (res.status === 403) {
        setAlert({ 
          type: 'warning', 
          message: data.message || 'Email not verified. Please check your email for OTP verification.'
        });
        setLoading(false);
        setTimeout(() => {
          navigate('/verify-otp', { state: { email: trimmedEmail } });
        }, 2000);
        return;
      }

      // Handle other errors
      if (!res.ok) {
        console.error('❌ Login error details:', data);
        throw new Error(data.message || data.details?.[0]?.message || 'Invalid credentials');
      }
      
      if (!data.token || !data.user) {
        throw new Error('Server error occurred. Please try again.');
      }
      
      // Normalize user data: ensure both _id and id fields exist
      const normalizedUser = {
        ...data.user,
        id: data.user._id || data.user.id // Ensure id field exists
      };
      
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(normalizedUser));
      
      setAlert({ type: 'success', message: 'Login successful!' });
      
      const validateRes = await fetch('http://localhost:8200/api/auth/validate', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${data.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!validateRes.ok) {
        throw new Error('Token validation failed');
      }

      setTimeout(() => navigate('/dashboard/analytics'), 1500);
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Login failed. Please check your credentials.' });
      localStorage.removeItem('token');
      localStorage.removeItem('user');
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

      <div className="max-w-md w-full relative z-10">
        {/* Card Container */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden backdrop-blur">
          {/* Gradient Header */}
          <div className="h-1 bg-gradient-to-r from-[#6366F1] via-[#EC4899] to-[#8B5CF6]"></div>

          {/* Header */}
          <div className="p-8 text-center border-b border-gray-100 dark:border-slate-800 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900">
            <Headings type="h2" className="bg-gradient-to-r from-[#6366F1] to-[#EC4899] bg-clip-text text-transparent text-2xl mb-2 font-bold">
              Welcome Back
            </Headings>
            <Paragraph variant="muted" className="text-sm">
              Sign in to access your creative dashboard
            </Paragraph>
          </div>

          {/* Form Content */}
          <div className="p-8 space-y-6">
            {/* Error & Success Messages */}
            {alert && (
              <Alert 
                message={alert.message}
                type={alert.type}
                onClose={() => setAlert(null)}
                duration={5000}
              />
            )}

            {/* Login Form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-3.5 text-slate-400 pointer-events-none group-focus-within:text-[#6366F1] transition-colors" size={18} />
                  <input
                    type="email"
                    id="email"
                    name="email"
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
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-lg focus:border-[#6366F1] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 transition-all duration-200 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
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
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <Link to="/forgot-password" className="text-sm bg-gradient-to-r from-[#6366F1] to-[#EC4899] bg-clip-text text-transparent hover:opacity-80 font-semibold transition-opacity">
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-[#6366F1] to-[#EC4899] hover:from-[#5558E3] hover:to-[#E23DA5] text-white font-bold rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    Sign In <ArrowRight size={18} />
                  </div>
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center pt-6 border-t border-gray-100 dark:border-slate-800">
              <Paragraph variant="sm" className="text-slate-600 dark:text-slate-400">
                Don't have an account?{' '}
                <Link to="/signup" className="bg-gradient-to-r from-[#6366F1] to-[#EC4899] bg-clip-text text-transparent hover:opacity-80 font-semibold transition-opacity">
                  Create one
                </Link>
              </Paragraph>
            </div>

            {/* Demo Info */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                Demo: Use any email with password (8+ chars)
              </p>
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

export default Login;
