

import React, { useState } from 'react';
import Paragraph from './Paragraph';
import Headings from './Heading';
import Button from './Button';
import Logo from './Logo';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      // Validate inputs
      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();

      if (!trimmedEmail || !trimmedPassword) {
        setError("Email and password are required");
        setLoading(false);
        return;
      }

      if (trimmedPassword.length < 6) {
        setError("Password must be at least 6 characters long");
        setLoading(false);
        return;
      }

      const loginData = { 
        email: trimmedEmail.toLowerCase(),
        password: trimmedPassword
      };
      console.log('Attempting login with:', { email: loginData.email }); // Don't log password
      
      // First, verify the credentials
      const res = await fetch('http://localhost:8200/api/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      });
      
      let data = await res.json();
      console.log('Server response:', {
        status: res.status,
        success: res.ok,
        data: data
      });
      
      if (!res.ok) {
        throw new Error(data.message || 'Invalid credentials');
      }
      
      if (!data.token || !data.user) {
        console.error('Invalid server response:', data);
        throw new Error('Server error occurred. Please try again.');
      }
      
      // Clear any old auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Store new auth data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setSuccess('Login successful!');
      
      console.log('Authentication successful, storing data and redirecting...');
      
      // Validate the token immediately after login
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

      // Navigate to dashboard/analytics
      navigate('/dashboard/analytics');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
      // Clear any old auth data on error
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-tertiary px-4 font-font2">
      <div className="max-w-md w-full space-y-6 bg-tertiary p-8 rounded-xl shadow-md">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Headings type='h4' className=" font-bold text-dark font-font1">Zarrrin Blog</Headings>
          <Logo size="text-3xl" className="text-secondary" />
        </div>
        <div className="text-center">
          <Headings type='h4' className="mt-6 text-3xl font-bold text-dark font-font1 leading-custom-heading">Welcome</Headings>
          <Paragraph className="mt-2 text-sm text-secondary leading-custom-para">Enter your email and password to access your account.</Paragraph>
        </div>
        {error && <Paragraph className="text-red-500">{error}</Paragraph>}
        {success && <Paragraph className="text-green-600">{success}</Paragraph>}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-secondary">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                required
                className="mt-1 w-full px-4 py-2 border border-secondaryGray rounded-md shadow-sm focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-secondary">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="mt-1 w-full px-4 py-2 border border-secondaryGray rounded-md shadow-sm focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
          <Button
            type="submit"
            variant="primary"
            className="w-full py-2 px-4 rounded-md font-semibold"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        <div className="text-center mt-4">
          <Paragraph className="text-sm text-secondary">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary font-bold hover:underline">Sign up</Link>
          </Paragraph>
        </div>
      </div>
    </div>
  );
};

export default Login;
