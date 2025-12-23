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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10 dark:opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 dark:bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 dark:bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Gradient Header */}
          <div className="h-32 bg-gradient-to-br from-purple-600 dark:from-purple-700 via-blue-500 dark:via-blue-600 to-blue-600 dark:to-blue-700 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full mix-blend-multiply filter blur-xl"></div>
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
              <Headings type="h2" className="text-3xl font-bold bg-gradient-to-r from-purple-600 dark:from-purple-400 to-blue-600 dark:to-blue-400 bg-clip-text text-transparent">
                Join Zarrin
              </Headings>
              <Paragraph className="text-gray-600 dark:text-gray-300">Create your account to start writing amazing blogs</Paragraph>
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
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-purple-600 transition-colors" size={20} />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-purple-600 dark:focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    required
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="relative group">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-purple-600 transition-colors" size={20} />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-purple-600 dark:focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
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
                  <Lock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-purple-600 transition-colors" size={20} />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-purple-600 dark:focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-gray-400 hover:text-purple-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <Paragraph className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                  {validatePassword(password) ? (
                    <><CheckCircle size={14} className="text-green-500" /> Strong password</>
                  ) : (
                    <>At least 8 characters</>
                  )}
                </Paragraph>
              </div>

              {/* Confirm Password Input */}
              <div className="relative group">
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-purple-600 transition-colors" size={20} />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••"
                    className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-purple-600 dark:focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-3.5 text-gray-400 hover:text-purple-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {password && (
                  <Paragraph className="text-xs mt-1 flex items-center gap-1 dark:text-gray-300">
                    {passwordsMatch ? (
                      <><CheckCircle size={14} className="text-green-500" /> Passwords match</>
                    ) : (
                      <>❌ Passwords don't match</>
                    )}
                  </Paragraph>
                )}
              </div>

              {/* Terms & Conditions */}
              <label className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-200 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 mt-1 rounded border-gray-300 dark:border-gray-600 text-purple-600 focus:ring-purple-500 dark:bg-gray-700" required />
                <span>I agree to the <button type="button" className="text-purple-600 dark:text-purple-400 font-semibold hover:text-purple-700 dark:hover:text-purple-300 transition-colors">Terms & Conditions</button> and <button type="button" className="text-purple-600 dark:text-purple-400 font-semibold hover:text-purple-700 dark:hover:text-purple-300 transition-colors">Privacy Policy</button></span>
              </label>

              {/* Submit Button */}
              <Button
                text={loading ? 'Creating Account...' : 'Create Account'}
                variant="secondary"
                size="lg"
                fullWidth
                disabled={loading || !passwordsMatch}
                loading={loading}
                className="mt-6 shadow-lg hover:shadow-xl"
              />
            </form>

            {/* Sign In Link */}
            <div className="text-center pt-4">
              <Paragraph className="text-gray-600 dark:text-gray-300">
                Already have an account?{' '}
                <Link to="/login" className="text-purple-600 dark:text-purple-400 font-bold hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
                  Sign in here
                </Link>
              </Paragraph>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <Paragraph className="text-center text-gray-500 dark:text-gray-400 text-sm mt-6">
          Join thousands of writers sharing their stories on Zarrin
        </Paragraph>
      </div>
    </div>
  );
};

export default Signup;
