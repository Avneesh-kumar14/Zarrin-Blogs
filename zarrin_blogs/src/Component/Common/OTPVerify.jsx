import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Paragraph from './Paragraph';
import Headings from './Heading';
import Button from './Button';
import Logo from './Logo';
import Alert from './Alert';
import { Mail, Lock } from 'lucide-react';

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
    setLoading(true);

    if (!otp || otp.length !== 6) {
      setAlert({ type: 'warning', message: 'Please enter a valid 6-digit OTP' });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:8200/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otp.trim() })
      });

      const data = await res.json();

      if (res.status === 429) {
        setAlert({ type: 'warning', message: 'Too many attempts. Please try again later.' });
        setLoading(false);
        return;
      }

      if (!res.ok) {
        throw new Error(data.message || 'OTP verification failed');
      }

      // Save token and user data to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setAlert({ type: 'success', message: 'Email verified! Redirecting to dashboard...' });
      setTimeout(() => {
        navigate('/dashboard/analytics');
      }, 1500);
    } catch (err) {
      setAlert({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);

    try {
      const res = await fetch('http://localhost:8200/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (res.status === 429) {
        setAlert({ type: 'warning', message: 'Too many requests. Please try again in a few minutes.' });
        setCountdown(300); // 5 minutes
        setResendLoading(false);
        return;
      }

      if (!res.ok) {
        throw new Error(data.message || 'Failed to resend OTP');
      }

      setAlert({ type: 'success', message: 'OTP sent to your email!' });
      setCountdown(60); // 60 seconds cooldown
      setOtp('');
    } catch (err) {
      setAlert({ type: 'error', message: err.message });
    } finally {
      setResendLoading(false);
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
          <div className="h-32 bg-gradient-to-br from-green-600 dark:from-green-700 via-blue-500 dark:via-blue-600 to-blue-600 dark:to-blue-700 flex items-center justify-center relative overflow-hidden">
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
              <Headings type="h2" className="text-3xl font-bold bg-gradient-to-r from-green-600 dark:from-green-400 to-blue-600 dark:to-blue-400 bg-clip-text text-transparent">
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
