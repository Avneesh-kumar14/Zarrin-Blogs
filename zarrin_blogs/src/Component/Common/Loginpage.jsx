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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-md w-full">
        {/* Card Container */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-700">
          {/* Gradient Header */}
          <div className="h-32 bg-gradient-to-r from-indigo-600 via-pink-600 to-amber-600 dark:from-indigo-700 dark:via-pink-700 dark:to-amber-700 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full mix-blend-multiply filter blur-xl"></div>
            </div>
            <div className="relative text-center">
              <Headings type="h2" className="text-white font-bold text-3xl">Log  in </Headings>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8 space-y-6">
            {/* Welcome Text */}
            <div className="text-center space-y-2">
              <Headings type="h3" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-pink-600 to-amber-600 dark:from-indigo-400 dark:via-pink-400 dark:to-amber-400 bg-clip-text text-transparent">
                Welcome Back to zarrin
              </Headings>
              <Paragraph className="text-slate-600 dark:text-slate-400">Sign in to your account</Paragraph>
            </div>

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
              <div className="relative group">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors" size={20} />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-slate-600 rounded-xl focus:border-indigo-600 dark:focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition-all duration-300 bg-slate-50 dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="relative group">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 dark:border-slate-600 rounded-xl focus:border-indigo-600 dark:focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition-all duration-300 bg-slate-50 dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-700 dark:text-slate-300 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 dark:bg-slate-700" />
                  <span>Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-indigo-600 dark:text-indigo-400 hover:text-pink-600 dark:hover:text-pink-400 font-semibold transition-colors">
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 dark:hover:from-indigo-500 dark:hover:to-pink-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 mt-6"
              >
                {loading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center pt-4 border-t border-gray-200 dark:border-slate-700">
              <Paragraph className="text-slate-600 dark:text-slate-400">
                Don't have an account?{' '}
                <Link to="/signup" className="text-indigo-600 dark:text-indigo-400 font-bold hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
                  Sign up here
                </Link>
              </Paragraph>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <Paragraph className="text-center text-slate-500 dark:text-slate-400 text-sm mt-6">
          Your data is protected with industry-standard security.
        </Paragraph>
      </div>
    </div>
  );
};

export default Login;
