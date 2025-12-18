import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

// Mock Login Component for testing
// In real project, import from '../Loginpage'
const MockLoginComponent = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Invalid email format');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    // Simulate API call
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <div role="alert" className="error">{error}</div>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

import React from 'react';

describe('Login Component', () => {
  
  beforeEach(() => {
    localStorage.clear();
  });

  test('should render login form with email and password inputs', () => {
    render(
      <BrowserRouter>
        <MockLoginComponent />
      </BrowserRouter>
    );
    
    expect(screen.getByPlaceholderText(/enter email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('should show error when email is empty', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <MockLoginComponent />
      </BrowserRouter>
    );
    
    const loginButton = screen.getByRole('button', { name: /login/i });
    await user.click(loginButton);
    
    expect(screen.getByRole('alert')).toHaveTextContent('Email and password are required');
  });

  test('should show error for invalid email format', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <MockLoginComponent />
      </BrowserRouter>
    );
    
    const emailInput = screen.getByPlaceholderText(/enter email/i);
    const passwordInput = screen.getByPlaceholderText(/enter password/i);
    
    await user.type(emailInput, 'invalidemail');
    await user.type(passwordInput, 'ValidPass123');
    
    const loginButton = screen.getByRole('button', { name: /login/i });
    await user.click(loginButton);
    
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid email format');
  });

  test('should show error for short password', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <MockLoginComponent />
      </BrowserRouter>
    );
    
    const emailInput = screen.getByPlaceholderText(/enter email/i);
    const passwordInput = screen.getByPlaceholderText(/enter password/i);
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'short');
    
    const loginButton = screen.getByRole('button', { name: /login/i });
    await user.click(loginButton);
    
    expect(screen.getByRole('alert')).toHaveTextContent('Password must be at least 8 characters');
  });

  test('should accept valid credentials and attempt login', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          token: 'test-token-123',
          user: { id: '1', email: 'test@example.com', name: 'Test User' }
        })
      })
    );

    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <MockLoginComponent />
      </BrowserRouter>
    );
    
    const emailInput = screen.getByPlaceholderText(/enter email/i);
    const passwordInput = screen.getByPlaceholderText(/enter password/i);
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'ValidPass123');
    
    const loginButton = screen.getByRole('button', { name: /login/i });
    await user.click(loginButton);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/auth/login',
        expect.any(Object)
      );
    });
  });

  test('should store token in localStorage on successful login', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          token: 'test-token-xyz',
          user: { id: '1', email: 'test@example.com' }
        })
      })
    );

    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <MockLoginComponent />
      </BrowserRouter>
    );
    
    const emailInput = screen.getByPlaceholderText(/enter email/i);
    const passwordInput = screen.getByPlaceholderText(/enter password/i);
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'ValidPass123');
    
    const loginButton = screen.getByRole('button', { name: /login/i });
    await user.click(loginButton);
    
    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('test-token-xyz');
    });
  });

  test('should show error on failed login', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: 'Invalid credentials' })
      })
    );

    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <MockLoginComponent />
      </BrowserRouter>
    );
    
    const emailInput = screen.getByPlaceholderText(/enter email/i);
    const passwordInput = screen.getByPlaceholderText(/enter password/i);
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'ValidPass123');
    
    const loginButton = screen.getByRole('button', { name: /login/i });
    await user.click(loginButton);
    
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Invalid credentials');
    });
  });
});
