import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Paragraph from './Paragraph';
import Headings from './Heading';
import Button from './Button';
import Logo from './Logo';
import Alert from './Alert';
import { Lock } from 'lucide-react';
import { getApiUrl } from '../../utils/apiConfig';

const OTPVerify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (!email) {
      navigate('/login');
    }
  }, [email, navigate]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleOTPVerify = async (e) => {
    e.preventDefault();

    // VALIDATION: Perform validations BEFORE setting loading
    if (!otp || otp.length !== 6) {
      setAlert({ 
        type: 'warning', 
        message: 'Please enter a valid 6-digit OTP' 
      });
      // Don't set loading, validation failed early
      return;
    }

    // LOADING: Now start loading after validation passes
    setLoading(true);

    try {
      // API CALL: Send OTP verification request to backend
      const res = await fetch(getApiUrl('/api/auth/verify-otp'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // ✅ CRITICAL: include cookies for production CORS
        body: JSON.stringify({ 
          email: email.trim(), 
          otp: otp.trim() 
        })
      });

      // RESPONSE PARSING: Parse JSON response
      const data = await res.json();

      // RATE LIMITING: Handle rate limit errors (429)
      if (res.status === 429) {
        setAlert({ 
          type: 'warning', 
          message: 'Too many attempts. Please try again later.' 
        });
        // Don't reset loading here, let finally handle it
        throw new Error('Rate limited');
      }

      // ERROR HANDLING: Check for HTTP errors
      if (!res.ok) {
        throw new Error(data.message || data.error || 'OTP verification failed');
      }

      // RESPONSE VALIDATION: Ensure required tokens are present
      if (!data.token) {
        throw new Error('Server error: Missing authentication token');
      }

      // TOKEN STORAGE: Save authentication data to localStorage
      localStorage.setItem('token', data.token);
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }
      
      // Normalize user object to ensure consistent id field
      const normalizedUser = { 
        ...data.user, 
        id: data.user._id || data.user.id 
      };
      localStorage.setItem('user', JSON.stringify(normalizedUser));

      // SUCCESS: Show success message
      setAlert({ 
        type: 'success', 
        message: 'Email verified! Redirecting to dashboard...' 
      });

      // NAVIGATION: Redirect to dashboard
      // Use setTimeout to let user see success message before redirect
      setTimeout(() => {
        navigate('/dashboard/analytics');
      }, 1500);

    } catch (err) {
      // ERROR RESPONSE: Show error message to user
      // Only show alert if not already set (e.g., rate limit alert)
      if (!alert || alert.type !== 'warning') {
        setAlert({ 
          type: 'error', 
          message: err.message || 'OTP verification failed. Please try again.' 
        });
      }
      console.error('OTP verification error:', err);

    } finally {
      // CLEANUP: Always reset loading state (try/catch/finally pattern)
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    // LOADING: Start loading
    setResendLoading(true);

    try {
      // API CALL: Send resend OTP request to backend
      const res = await fetch(getApiUrl('/api/auth/resend-otp'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // ✅ CRITICAL: include cookies for production CORS
        body: JSON.stringify({ email: email.trim() })
      });

      // RESPONSE PARSING: Parse JSON response
      const data = await res.json();

      // RATE LIMITING: Handle rate limit errors (429)
      if (res.status === 429) {
        setAlert({ 
          type: 'warning', 
          message: 'Too many requests. Please try again in a few minutes.' 
        });
        setCountdown(300); // 5 minutes cooldown
        // Let finally reset resendLoading
        return;
      }

      // ERROR HANDLING: Check for HTTP errors
      if (!res.ok) {
        throw new Error(data.message || data.error || 'Failed to resend OTP');
      }

      // SUCCESS: Show success message
      setAlert({ 
        type: 'success', 
        message: 'OTP sent to your email!' 
      });

      // COOLDOWN: Set 60 seconds before allowing another resend
      setCountdown(60);

      // CLEANUP: Clear the OTP input field
      setOtp('');

    } catch (err) {
      // ERROR RESPONSE: Show error message to user
      setAlert({ 
        type: 'error', 
        message: err.message || 'Failed to resend OTP. Please try again.' 
      });
      console.error('Resend OTP error:', err);

    } finally {
      // CLEANUP: Always reset loading state (try/catch/finally pattern)
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-primary dark:bg-surface-dark px-4 py-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10 dark:opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 dark:bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 dark:bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Solid Header */}
          <div className="h-32 bg-success dark:bg-success-dark flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full mix-blend-multiply filter blur-xl"></div>
            </div>
            <div className="relative flex items-center gap-3">
              <Logo size="text-4xl" className="text-white" />
              <Headings type="h3" className="text-white font-bold">Verify</Headings>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8 space-y-6">
            {/* Welcome Text */}
            <div className="text-center space-y-2">
              <Headings type="h2" className="text-3xl font-bold text-on-success">
                Verify Email
              </Headings>
              <Paragraph className="text-gray-600 dark:text-gray-300">
                Enter the 6-digit OTP sent to<br />
                <span className="font-semibold text-gray-900 dark:text-gray-100">{email}</span>
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

            {/* OTP Verification Form */}
            <form className="space-y-5" onSubmit={handleOTPVerify}>
              {/* OTP Input */}
              <div className="relative group">
                <label htmlFor="otp" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  One-Time Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-green-600 transition-colors" size={20} />
                  <input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    maxLength="6"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-green-600 dark:focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-mono tracking-widest text-lg text-center"
                    required
                  />
                </div>
                <Paragraph className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Check your email inbox and spam folder
                </Paragraph>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </Button>
            </form>

            {/* Resend OTP */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <Paragraph className="text-sm text-gray-600 dark:text-gray-300">
                Didn't receive OTP?
              </Paragraph>
              <Button
                type="button"
                onClick={handleResendOTP}
                disabled={resendLoading || countdown > 0}
                className="text-sm bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 py-1 px-3"
              >
                {countdown > 0 ? `Resend in ${countdown}s` : resendLoading ? 'Sending...' : 'Resend OTP'}
              </Button>
            </div>

            {/* Back to Login */}
            <div className="text-center">
              <Paragraph className="text-sm text-gray-600 dark:text-gray-300">
                Already verified?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-semibold transition-colors"
                >
                  Go to Login
                </button>
              </Paragraph>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerify;
