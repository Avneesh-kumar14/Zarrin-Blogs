import React, { useState } from 'react';
import Paragraph from './Paragraph';
import Headings from './Heading';
import Button from './Button';
import Logo from './Logo';
import Alert from './Alert';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

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
      
      const res = await fetch('http://localhost:8200/api/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      });
      
      let data = await res.json();
      
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
          navigate('/otp-verify', { state: { email: trimmedEmail } });
        }, 2000);
        return;
      }

      // Handle other errors
      if (!res.ok) {
        throw new Error(data.message || 'Invalid credentials');
      }
      
      if (!data.token || !data.user) {
        throw new Error('Server error occurred. Please try again.');
      }
      
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 font-font2 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10 dark:opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 dark:bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 dark:bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-md w-full">
        {/* Card Container */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Gradient Header */}
          <div className="h-32 bg-gradient-to-br from-blue-600 dark:from-blue-700 via-blue-500 dark:via-blue-600 to-purple-600 dark:to-purple-700 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full mix-blend-multiply filter blur-xl"></div>
            </div>
            <div className="relative flex items-center gap-3">
              <Logo size="text-4xl" className="text-white" />
              <Headings type="h3" className="text-white font-bold">Zarrin</Headings>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8 space-y-6">
            {/* Welcome Text */}
            <div className="text-center space-y-2">
              <Headings type="h2" className="text-3xl font-bold bg-gradient-to-r from-blue-600 dark:from-blue-400 to-purple-600 dark:to-purple-400 bg-clip-text text-transparent">
                Welcome Back
              </Headings>
              <Paragraph className="text-gray-600 dark:text-gray-300">Sign in to access your blogging dashboard</Paragraph>
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
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-600 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="relative group">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-600 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-700" />
                  <span>Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors">
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                text={loading ? 'Signing in...' : 'Sign In'}
                variant="primary"
                size="lg"
                fullWidth
                disabled={loading}
                loading={loading}
                className="mt-6 shadow-lg hover:shadow-xl"
              />
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            {/* Social Login */}
            <button className="w-full py-3 border-2 border-gray-200 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/></svg>
              <span>Continue with Google</span>
            </button>

            {/* Sign Up Link */}
            <div className="text-center pt-4">
              <Paragraph className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="text-blue-600 font-bold hover:text-blue-700 transition-colors">
                  Create one now
                </Link>
              </Paragraph>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <Paragraph className="text-center text-gray-500 text-sm mt-6">
          Protected by industry-standard security. Your data is safe with us.
        </Paragraph>
      </div>
    </div>
  );
};

export default Login;
