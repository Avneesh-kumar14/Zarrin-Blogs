import React, { useState } from 'react';
import Paragraph from './Paragraph';
import Button from './Button';
import Headings from './Heading';
import Logo from './Logo';
import Alert from './Alert';
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';

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
      const res = await fetch('http://localhost:8200/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-700">
          {/* Gradient Header */}
          <div className="h-32 bg-gradient-to-r from-indigo-600 via-pink-600 to-amber-600 dark:from-indigo-700 dark:via-pink-700 dark:to-amber-700 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full mix-blend-multiply filter blur-xl"></div>
            </div>
            <div className="relative text-center">
              <Headings type="h2" className="text-white font-bold text-3xl">Zarrin Blog </Headings>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8 space-y-6">
            {/* Welcome Text */}
            <div className="text-center space-y-2">
              <Headings type="h3" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-pink-600 to-amber-600 dark:from-indigo-400 dark:via-pink-400 dark:to-amber-400 bg-clip-text text-transparent">
                Create Account
              </Headings>
              <Paragraph className="text-slate-600 dark:text-slate-400">Start your blogging journey today</Paragraph>
            </div>

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
              <div className="relative group">
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors" size={20} />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-slate-600 rounded-xl focus:border-indigo-600 dark:focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition-all duration-300 bg-slate-50 dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500"
                    required
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="relative group">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors" size={20} />
                  <input
                    id="email"
                    type="email"
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
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••"
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
                <Paragraph className="text-xs text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-1">
                  {validatePassword(password) ? (
                    <><CheckCircle size={14} className="text-emerald-500" /> Strong password</>
                  ) : (
                    <>At least 8 characters with uppercase, lowercase, and number</>
                  )}
                </Paragraph>
              </div>

              {/* Confirm Password Input */}
              <div className="relative group">
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors" size={20} />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••"
                    className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 dark:border-slate-600 rounded-xl focus:border-indigo-600 dark:focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition-all duration-300 bg-slate-50 dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-3.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {password && (
                  <Paragraph className="text-xs mt-1 flex items-center gap-1 dark:text-slate-300">
                    {passwordsMatch ? (
                      <><CheckCircle size={14} className="text-emerald-500" /> Passwords match</>
                    ) : (
                      <>❌ Passwords don't match</>
                    )}
                  </Paragraph>
                )}
              </div>

              {/* Terms & Conditions */}
              <label className="flex items-start gap-2 text-sm text-gray-700 dark:text-slate-300 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 mt-1 rounded border-gray-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 dark:bg-slate-700" required />
                <span>I agree to the <button type="button" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:text-pink-600 dark:hover:text-pink-400 transition-colors">Terms & Conditions</button> and <button type="button" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:text-pink-600 dark:hover:text-pink-400 transition-colors">Privacy Policy</button></span>
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !passwordsMatch}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 dark:hover:from-indigo-500 dark:hover:to-pink-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 mt-6"
              >
                {loading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  <span>Create Account</span>
                )}
              </button>
            </form>

            {/* Sign In Link */}
            <div className="text-center pt-4 border-t border-gray-200 dark:border-slate-700">
              <Paragraph className="text-slate-600 dark:text-slate-400">
                Already have an account?{' '}
                <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-bold hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
                  Sign in
                </Link>
              </Paragraph>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <Paragraph className="text-center text-slate-500 dark:text-slate-400 text-sm mt-6">
          Join thousands of writers sharing their stories
        </Paragraph>
      </div>
    </div>
  );
};

export default Signup;
