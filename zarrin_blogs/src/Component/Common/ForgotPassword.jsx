import React, { useState } from 'react';
import Paragraph from './Paragraph';
import Headings from './Heading';
import Button from './Button';
import Logo from './Logo';
import Alert from './Alert';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [emailSent, setEmailSent] = useState(false);

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

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        setAlert({ type: 'warning', message: 'Please enter a valid email address' });
        setLoading(false);
        return;
      }

      const res = await fetch('http://localhost:8200/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail.toLowerCase() })
      });

      const data = await res.json();
      
      // Handle rate limiting (429)
      if (res.status === 429) {
        const retryAfter = data.retryAfter || 15 * 60;
        throw new Error(`Too many requests. Please try again in ${Math.ceil(retryAfter / 60)} minutes.`);
      }

      // Even if the server returns error, show success message for security (don't reveal if email exists)
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
          <div className="h-32 bg-gradient-to-br from-orange-600 dark:from-orange-700 via-red-500 dark:via-red-600 to-red-600 dark:to-red-700 flex items-center justify-center relative overflow-hidden">
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
            {emailSent ? (
              <>
                {/* Success State */}
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <CheckCircle size={64} className="text-green-500" />
                  </div>
                  <Headings type="h2" className="text-2xl font-bold text-green-600">
                    Check Your Email
                  </Headings>
                  <Paragraph className="text-gray-600 dark:text-gray-300">
                    We've sent a password reset link to <span className="font-semibold">{email}</span>
                  </Paragraph>
                </div>

                {/* Instructions */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded">
                  <Paragraph className="text-sm text-blue-800 dark:text-blue-200">
                    ✓ The link will expire in 1 hour<br/>
                    ✓ Click the link to reset your password<br/>
                    ✓ If you didn't request this, ignore the email
                  </Paragraph>
                </div>

                {/* Back to Login */}
                <Button
                  text="Back to Login"
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => navigate('/login')}
                  className="shadow-lg hover:shadow-xl"
                />

                {/* Resend Option */}
                <div className="text-center">
                  <Paragraph className="text-gray-600 dark:text-gray-300 text-sm">
                    Didn't receive it?{' '}
                    <button
                      onClick={() => {
                        setEmailSent(false);
                        setEmail('');
                      }}
                      className="text-blue-600 dark:text-blue-400 font-bold hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                      Try again
                    </button>
                  </Paragraph>
                </div>
              </>
            ) : (
              <>
                {/* Welcome Text */}
                <div className="text-center space-y-2">
                  <Headings type="h2" className="text-3xl font-bold bg-gradient-to-r from-orange-600 dark:from-orange-400 to-red-600 dark:to-red-400 bg-clip-text text-transparent">
                    Reset Password
                  </Headings>
                  <Paragraph className="text-gray-600 dark:text-gray-300">
                    Enter your email to receive a password reset link
                  </Paragraph>
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

                {/* Forgot Password Form */}
                <form className="space-y-5" onSubmit={handleSubmit}>
                  {/* Email Input */}
                  <div className="relative group">
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-orange-600 transition-colors" size={20} />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-orange-600 dark:focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    text={loading ? 'Sending reset link...' : 'Send Reset Link'}
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
                    <div className="w-full border-t border-gray-200 dark:border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">or</span>
                  </div>
                </div>

                {/* Back to Login Link */}
                <button
                  onClick={() => navigate('/login')}
                  className="w-full py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={20} />
                  Back to Login
                </button>

                {/* Footer Text */}
                <Paragraph className="text-center text-gray-500 text-sm">
                  Remember your password?{' '}
                  <Link to="/login" className="text-orange-600 dark:text-orange-400 font-bold hover:text-orange-700 dark:hover:text-orange-300 transition-colors">
                    Sign in here
                  </Link>
                </Paragraph>
              </>
            )}
          </div>
        </div>

        {/* Footer Text */}
        <Paragraph className="text-center text-gray-500 text-sm mt-6">
          Secure password recovery. Your email will never be shared.
        </Paragraph>
      </div>
    </div>
  );
};

export default ForgotPassword;
