import React, { useState, useEffect } from 'react';
import Paragraph from './Paragraph';
import Headings from './Heading';
import Button from './Button';
import Logo from './Logo';
import Alert from './Alert';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { getApiUrl } from '../../utils/apiConfig';

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

  // Verify token on component mount
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
          credentials: 'include', // CRITICAL: include cookies for production CORS
          body: JSON.stringify({ token })
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Invalid or expired reset link');
        }

        setTokenValid(true);
      } catch (err) {
        setAlert({ type: 'error', message: err.message });
      } finally {
        setVerifying(false);
      }
    };

    verifyToken();
  }, [token]);

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
      const res = await fetch(getApiUrl('/api/auth/reset-password-with-token'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // CRITICAL: include cookies for production CORS
        body: JSON.stringify({ token, newPassword: password, confirmPassword })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Password reset failed');

      setAlert({ type: 'success', message: 'Password reset successful!' });
      setResetSuccess(true);
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setAlert({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  // Verifying token state
  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <Paragraph>Verifying reset link...</Paragraph>
        </div>
      </div>
    );
  }

  // Invalid token state
  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">
        <div className="relative z-10 w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="h-32 bg-gradient-to-br from-red-600 dark:from-red-700 via-pink-500 dark:via-pink-600 to-pink-600 dark:to-pink-700 flex items-center justify-center relative overflow-hidden">
              <div className="relative flex items-center gap-3">
                <AlertCircle size={40} className="text-white" />
                <Headings type="h3" className="text-white font-bold">Error</Headings>
              </div>
            </div>

            <div className="p-8 text-center space-y-6">
              <Headings type="h2" className="text-2xl font-bold text-red-600">
                Invalid Reset Link
              </Headings>
              <Paragraph className="text-gray-600 dark:text-gray-300">
                {alert?.message || 'This password reset link is invalid or has expired.'}
              </Paragraph>

              <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded">
                <Paragraph className="text-sm text-red-800 dark:text-red-200">
                  Reset links expire after 1 hour for security reasons.
                </Paragraph>
              </div>

              <Button
                text="Request New Reset Link"
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => navigate('/forgot-password')}
                className="shadow-lg hover:shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          <div className="h-32 bg-gradient-to-br from-green-600 dark:from-green-700 via-emerald-500 dark:via-emerald-600 to-emerald-600 dark:to-emerald-700 flex items-center justify-center relative overflow-hidden">
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
            {resetSuccess ? (
              <>
                {/* Success State */}
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <CheckCircle size={64} className="text-green-500" />
                  </div>
                  <Headings type="h2" className="text-2xl font-bold text-green-600">
                    Password Reset!
                  </Headings>
                  <Paragraph className="text-gray-600 dark:text-gray-300">
                    Your password has been successfully reset. You can now login with your new password.
                  </Paragraph>
                </div>

                {/* Redirect Message */}
                <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded">
                  <Paragraph className="text-sm text-green-800 dark:text-green-200">
                    Redirecting to login page...
                  </Paragraph>
                </div>
              </>
            ) : (
              <>
                {/* Welcome Text */}
                <div className="text-center space-y-2">
                  <Headings type="h2" className="text-3xl font-bold bg-gradient-to-r from-green-600 dark:from-green-400 to-emerald-600 dark:to-emerald-400 bg-clip-text text-transparent">
                    Create New Password
                  </Headings>
                  <Paragraph className="text-gray-600 dark:text-gray-300">
                    Enter a strong password to secure your account
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

                {/* Password Reset Form */}
                <form className="space-y-5" onSubmit={handleSubmit}>
                  {/* New Password Input */}
                  <div className="relative group">
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-green-600 transition-colors" size={20} />
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-green-600 dark:focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-3.5 text-gray-400 hover:text-green-600 transition-colors"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password Input */}
                  <div className="relative group">
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-green-600 transition-colors" size={20} />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-green-600 dark:focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-3.5 text-gray-400 hover:text-green-600 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  {/* Password Requirements */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded">
                    <Paragraph className="text-sm text-blue-800 dark:text-blue-200 font-semibold mb-2">
                      Password must contain:
                    </Paragraph>
                    <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                      <li>✓ At least 8 characters</li>
                      <li>✓ Uppercase letter (A-Z)</li>
                      <li>✓ Lowercase letter (a-z)</li>
                      <li>✓ Number (0-9)</li>
                    </ul>
                  </div>

                  {/* Match Status */}
                  {confirmPassword && (
                    <div className={`p-3 rounded ${passwordsMatch ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                      <Paragraph className="text-sm">
                        {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
                      </Paragraph>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    text={loading ? 'Resetting password...' : 'Reset Password'}
                    variant="primary"
                    size="lg"
                    fullWidth
                    disabled={loading || !passwordsMatch}
                    loading={loading}
                    className="mt-6 shadow-lg hover:shadow-xl"
                  />
                </form>
              </>
            )}
          </div>
        </div>

        {/* Footer Text */}
        <Paragraph className="text-center text-gray-500 text-sm mt-6">
          Creating a strong password helps protect your account.
        </Paragraph>
      </div>
    </div>
  );
};

export default ResetPassword;
