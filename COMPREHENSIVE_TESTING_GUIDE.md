# 🧪 Comprehensive Testing Guide - Zarrin Blogs Project

A complete testing strategy for your MERN Stack Blog Platform covering unit testing, integration testing, and E2E testing.

---

## 📋 Table of Contents

1. [Testing Overview](#testing-overview)
2. [Frontend Testing](#frontend-testing)
3. [Backend Testing](#backend-testing)
4. [Integration Testing](#integration-testing)
5. [E2E Testing](#e2e-testing)
6. [CI/CD Pipeline](#cicd-pipeline)
7. [Testing Best Practices](#testing-best-practices)

---

## 🎯 Testing Overview

### Test Pyramid

```
        ┌─────────────────┐
        │      E2E        │  ⏱️ Slow, Full App
        ├─────────────────┤
        │  Integration    │  ⏱️ Medium, Multiple Units
        ├─────────────────┤
        │  Unit Tests     │  ⏱️ Fast, Single Units
        └─────────────────┘
```

### Testing Types in Your Project

| Type | Framework | Priority | Count |
|------|-----------|----------|-------|
| **Unit Tests** | Jest + React Testing Library | ⭐⭐⭐ High | 40-60 |
| **Integration Tests** | Jest + Supertest | ⭐⭐⭐ High | 20-30 |
| **E2E Tests** | Cypress/Playwright | ⭐⭐ Medium | 10-15 |

---

## 🎨 Frontend Testing (React)

### Current Setup ✅

Your project already has:
- ✅ Jest (via react-scripts)
- ✅ React Testing Library
- ✅ @testing-library/jest-dom
- ✅ @testing-library/user-event

### Run Frontend Tests

```bash
cd zarrin_blogs
npm test                    # Run in watch mode
npm test -- --coverage      # Generate coverage report
```

---

## 📝 Frontend Unit Tests

### 1. Test Authentication Components

**File:** `zarrin_blogs/src/Component/Common/__tests__/Loginpage.test.js`

```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Loginpage from '../Loginpage';
import { BrowserRouter } from 'react-router-dom';

// Mock navigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Loginpage Component', () => {
  
  test('renders login form with email and password inputs', () => {
    render(
      <BrowserRouter>
        <Loginpage />
      </BrowserRouter>
    );
    
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('shows validation errors for empty fields', async () => {
    render(
      <BrowserRouter>
        <Loginpage />
      </BrowserRouter>
    );
    
    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
  });

  test('validates email format', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <Loginpage />
      </BrowserRouter>
    );
    
    const emailInput = screen.getByPlaceholderText(/email/i);
    await user.type(emailInput, 'invalid-email');
    
    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });
  });

  test('calls login API with correct data', async () => {
    const user = userEvent.setup();
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          token: 'test-token',
          user: { id: '1', email: 'test@example.com' }
        })
      })
    );

    render(
      <BrowserRouter>
        <Loginpage />
      </BrowserRouter>
    );
    
    await user.type(screen.getByPlaceholderText(/email/i), 'test@example.com');
    await user.type(screen.getByPlaceholderText(/password/i), 'Password123');
    
    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/auth/login'),
        expect.any(Object)
      );
    });
  });

  test('shows error message on login failure', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: 'Invalid credentials' })
      })
    );

    render(
      <BrowserRouter>
        <Loginpage />
      </BrowserRouter>
    );
    
    // ... type credentials ...
    
    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  test('stores token in localStorage on successful login', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          token: 'test-token',
          user: { id: '1' }
        })
      })
    );

    render(
      <BrowserRouter>
        <Loginpage />
      </BrowserRouter>
    );
    
    // ... interact with form ...
    
    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('test-token');
    });
  });
});
```

### 2. Test Blog Components

**File:** `zarrin_blogs/src/Component/Main Component/__tests__/BlogPreview.test.js`

```javascript
import { render, screen } from '@testing-library/react';
import BlogPreview from '../BlogPreview';
import { BrowserRouter } from 'react-router-dom';

describe('BlogPreview Component', () => {
  
  const mockBlog = {
    _id: '1',
    title: 'Test Blog',
    description: 'This is a test blog',
    content: '<p>Full content</p>',
    image: 'https://example.com/image.jpg',
    category: 'Technology',
    author: { name: 'John Doe' },
    createdAt: '2024-01-01',
    likes: 5,
    comments: [],
    bookmarks: []
  };

  test('renders blog title and content', () => {
    render(
      <BrowserRouter>
        <BlogPreview blog={mockBlog} />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Test Blog')).toBeInTheDocument();
    expect(screen.getByText('This is a test blog')).toBeInTheDocument();
  });

  test('displays blog metadata', () => {
    render(
      <BrowserRouter>
        <BlogPreview blog={mockBlog} />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/John Doe/)).toBeInTheDocument();
    expect(screen.getByText(/Technology/)).toBeInTheDocument();
  });

  test('renders blog image with correct src', () => {
    render(
      <BrowserRouter>
        <BlogPreview blog={mockBlog} />
      </BrowserRouter>
    );
    
    const image = screen.getByAltText(/test blog/i);
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  test('displays like count', () => {
    render(
      <BrowserRouter>
        <BlogPreview blog={mockBlog} />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/5/)).toBeInTheDocument();
  });
});
```

### 3. Test Utility Functions

**File:** `zarrin_blogs/src/utils/__tests__/dateUtils.test.js`

```javascript
// Create this utils file if it doesn't exist
// src/utils/dateUtils.js
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const getTimeAgo = (date) => {
  const now = new Date();
  const then = new Date(date);
  const seconds = Math.floor((now - then) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};
```

**Test file:** `zarrin_blogs/src/utils/__tests__/dateUtils.test.js`

```javascript
import { formatDate, getTimeAgo } from '../dateUtils';

describe('Date Utilities', () => {
  
  test('formatDate returns correct format', () => {
    const date = '2024-01-15';
    const result = formatDate(date);
    expect(result).toBe('January 15, 2024');
  });

  test('getTimeAgo shows "just now" for recent times', () => {
    const now = new Date();
    expect(getTimeAgo(now)).toBe('just now');
  });

  test('getTimeAgo shows minutes ago', () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60000);
    expect(getTimeAgo(fiveMinutesAgo)).toBe('5m ago');
  });

  test('getTimeAgo shows hours ago', () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 3600000);
    expect(getTimeAgo(twoHoursAgo)).toBe('2h ago');
  });

  test('getTimeAgo shows days ago', () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 86400000);
    expect(getTimeAgo(threeDaysAgo)).toBe('3d ago');
  });
});
```

### 4. Test Context/State Management

**File:** `zarrin_blogs/src/context/__tests__/AuthContext.test.js`

```javascript
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';

const TestComponent = () => {
  const { user, token, isAuthenticated } = useAuth();
  
  return (
    <div>
      {isAuthenticated ? (
        <>
          <div>{user?.email}</div>
          <div>{token}</div>
        </>
      ) : (
        <div>Not authenticated</div>
      )}
    </div>
  );
};

describe('AuthContext', () => {
  
  test('provides initial unauthenticated state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(screen.getByText('Not authenticated')).toBeInTheDocument();
  });

  test('updates state when user logs in', async () => {
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('user', JSON.stringify({ email: 'test@example.com' }));
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });
  });
});
```

---

## 🚀 Backend Testing (Node.js/Express)

### Setup Backend Testing

**Step 1: Install Testing Dependencies**

```bash
cd Zarrin_server

npm install --save-dev jest supertest mongodb-memory-server
```

**Step 2: Update package.json**

```json
{
  "scripts": {
    "test": "jest --detectOpenHandles",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:verbose": "jest --verbose"
  },
  "jest": {
    "testEnvironment": "node",
    "collectCoverageFrom": [
      "src/**/*.js",
      "!src/index.js"
    ],
    "testMatch": [
      "**/__tests__/**/*.js",
      "**/?(*.)+(spec|test).js"
    ]
  }
}
```

**Step 3: Create Jest Config**

**File:** `Zarrin_server/jest.config.js`

```javascript
module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    'controllers/**/*.js',
    'utils/**/*.js',
    'middleware/**/*.js',
    '!**/*.test.js',
    '!**/node_modules/**'
  ],
  coverageThresholds: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1'
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
};
```

**Step 4: Create Jest Setup File**

**File:** `Zarrin_server/jest.setup.js`

```javascript
// Set test environment variables
process.env.JWT_SECRET = 'test_secret_key';
process.env.MONGODB_URI = 'mongodb://localhost:27017/zarrin_test';

// Increase timeout for API tests
jest.setTimeout(30000);

// Mock Cloudinary
jest.mock('cloudinary', () => ({
  v2: {
    uploader: {
      upload: jest.fn().mockResolvedValue({
        secure_url: 'https://example.com/test-image.jpg'
      }),
      destroy: jest.fn().mockResolvedValue({ result: 'ok' })
    }
  }
}));

// Mock email service
jest.mock('./utils/emailService', () => ({
  sendEmail: jest.fn().mockResolvedValue({ success: true })
}));
```

### 1. Unit Tests - Controllers

**File:** `Zarrin_server/controllers/__tests__/signup.test.js`

```javascript
const { signup } = require('../signup');
const User = require('../../models/userModel');
const { sendEmail } = require('../../utils/emailService');

// Mock the User model
jest.mock('../../models/userModel');
jest.mock('../../utils/emailService');

describe('Signup Controller', () => {
  
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123'
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should signup user successfully', async () => {
    User.findOne.mockResolvedValue(null); // User doesn't exist
    User.create.mockResolvedValue({
      _id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      isEmailVerified: false
    });

    await signup(req, res);

    expect(User.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining('OTP'),
        user: expect.objectContaining({
          email: 'john@example.com'
        })
      })
    );
  });

  test('should return error if email already exists', async () => {
    User.findOne.mockResolvedValue({
      _id: '123',
      email: 'john@example.com'
    });

    await signup(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining('already exists')
      })
    );
  });

  test('should validate password requirements', async () => {
    req.body.password = 'weak'; // Invalid password

    await signup(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining('Password')
      })
    );
  });

  test('should send OTP email', async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({
      _id: '123',
      email: 'john@example.com'
    });

    await signup(req, res);

    expect(sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'john@example.com'
      })
    );
  });

  test('should hash password before saving', async () => {
    User.findOne.mockResolvedValue(null);
    const createSpy = jest.spyOn(User, 'create');

    await signup(req, res);

    const savedData = createSpy.mock.calls[0][0];
    expect(savedData.password).not.toBe('Password123'); // Password should be hashed
  });
});
```

### 2. Unit Tests - Models/Schema Validation

**File:** `Zarrin_server/models/__tests__/userModel.test.js`

```javascript
const UserSchema = require('../../models/userModel').schema;
const bcryptjs = require('bcryptjs');

describe('User Model Schema', () => {
  
  test('should validate required fields', () => {
    // Test that name, email, password are required
    const schema = UserSchema;
    const nameField = schema.path('name');
    expect(nameField.required).toBe(true);
  });

  test('should validate email format', () => {
    const schema = UserSchema;
    const emailField = schema.path('email');
    expect(emailField.validate).toBeDefined();
  });

  test('should ensure email is unique', () => {
    const schema = UserSchema;
    const emailField = schema.path('email');
    expect(emailField.options.unique).toBe(true);
  });

  test('should have default role as "user"', () => {
    const schema = UserSchema;
    const roleField = schema.path('role');
    expect(roleField.defaultValue).toBe('user');
  });

  test('should hash password before saving', async () => {
    // Test that pre-save hook hashes password
    const schema = UserSchema;
    const presaveHooks = schema.s.hooks.get('pre').save;
    expect(presaveHooks).toBeDefined();
  });
});
```

### 3. Unit Tests - Utility Functions

**File:** `Zarrin_server/utils/__tests__/passwordValidator.test.js`

```javascript
// Create this utility file if it doesn't exist
// Zarrin_server/utils/passwordValidator.js
const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain an uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain a lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain a number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = { validatePassword };
```

**Test file:** `Zarrin_server/utils/__tests__/passwordValidator.test.js`

```javascript
const { validatePassword } = require('../passwordValidator');

describe('Password Validator', () => {
  
  test('should accept valid passwords', () => {
    const result = validatePassword('ValidPass123');
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('should reject password shorter than 8 characters', () => {
    const result = validatePassword('Short1');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must be at least 8 characters long');
  });

  test('should require uppercase letter', () => {
    const result = validatePassword('noupppercase123');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must contain an uppercase letter');
  });

  test('should require lowercase letter', () => {
    const result = validatePassword('NOUPPPERCASE123');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must contain a lowercase letter');
  });

  test('should require number', () => {
    const result = validatePassword('NoNumbers');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must contain a number');
  });
});
```

---

## 🔗 Integration Tests

### Setup MongoDB for Testing

**File:** `Zarrin_server/__tests__/setup.js`

```javascript
const { MongoMemoryServer } = require('mongodb-memory-server');
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongoServer.getUri();
});

afterAll(async () => {
  await mongoServer.stop();
});
```

### 1. Auth Routes Integration Tests

**File:** `Zarrin_server/routes/__tests__/auth.test.js`

```javascript
const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const authRoutes = require('../auth');
const User = require('../../models/userModel');

let app;
let mongoServer;

beforeAll(async () => {
  // Start in-memory MongoDB
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  // Create Express app
  app = express();
  app.use(express.json());
  app.use('/api/auth', authRoutes);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  // Clear database after each test
  await User.deleteMany({});
});

describe('Auth Routes - POST /api/auth/signup', () => {
  
  test('should signup a new user', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toContain('OTP');
    expect(res.body.user.email).toBe('john@example.com');
  });

  test('should not signup with existing email', async () => {
    // Create a user first
    await User.create({
      name: 'Existing User',
      email: 'existing@example.com',
      password: 'Password123'
    });

    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'John Doe',
        email: 'existing@example.com',
        password: 'Password123'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain('already exists');
  });

  test('should validate password format', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'weakpass' // Missing number and uppercase
      });

    expect(res.statusCode).toBe(400);
  });

  test('should validate email format', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'John Doe',
        email: 'invalid-email', // Invalid email
        password: 'Password123'
      });

    expect(res.statusCode).toBe(400);
  });

  test('should require all fields', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'John Doe'
        // Missing email and password
      });

    expect(res.statusCode).toBe(400);
  });
});

describe('Auth Routes - POST /api/auth/login', () => {
  
  beforeEach(async () => {
    // Create a verified user
    await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'Password123', // Will be hashed by schema pre-save hook
      isEmailVerified: true
    });
  });

  test('should login with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'john@example.com',
        password: 'Password123'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('john@example.com');
  });

  test('should not login with incorrect password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'john@example.com',
        password: 'WrongPassword123'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toContain('Invalid credentials');
  });

  test('should not login with non-existent email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'Password123'
      });

    expect(res.statusCode).toBe(401);
  });
});
```

### 2. Blog Routes Integration Tests

**File:** `Zarrin_server/routes/__tests__/blog.test.js`

```javascript
const request = require('supertest');
const app = require('../../index'); // Your Express app
const Blog = require('../../models/blog');
const User = require('../../models/userModel');
const { generateToken } = require('../../utils/generateToken');

let token;
let userId;

beforeAll(async () => {
  // Create a test user
  const user = await User.create({
    name: 'Test User',
    email: 'test@example.com',
    password: 'Password123'
  });
  userId = user._id;
  token = generateToken(user._id);
});

describe('Blog Routes', () => {
  
  test('should create a new blog', async () => {
    const res = await request(app)
      .post('/api/blog/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Blog',
        description: 'Test Description',
        content: '<p>Test Content</p>',
        category: 'Technology',
        image: 'https://example.com/image.jpg'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.blog.title).toBe('Test Blog');
    expect(res.body.blog.author).toBe(userId.toString());
  });

  test('should get all blogs', async () => {
    const res = await request(app)
      .get('/api/blog/all');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.blogs)).toBe(true);
  });

  test('should get blog by id', async () => {
    const blog = await Blog.create({
      title: 'Test Blog',
      description: 'Test',
      content: 'Test',
      author: userId
    });

    const res = await request(app)
      .get(`/api/blog/${blog._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.blog._id).toBe(blog._id.toString());
  });

  test('should update blog', async () => {
    const blog = await Blog.create({
      title: 'Original Title',
      description: 'Test',
      content: 'Test',
      author: userId
    });

    const res = await request(app)
      .put(`/api/blog/update/${blog._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Updated Title'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.blog.title).toBe('Updated Title');
  });

  test('should delete blog', async () => {
    const blog = await Blog.create({
      title: 'Test Blog',
      description: 'Test',
      content: 'Test',
      author: userId
    });

    const res = await request(app)
      .delete(`/api/blog/delete/${blog._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);

    const deletedBlog = await Blog.findById(blog._id);
    expect(deletedBlog).toBeNull();
  });
});
```

---

## 🌐 E2E Testing (Cypress)

### Setup Cypress

```bash
cd zarrin_blogs

npm install --save-dev cypress

npx cypress open  # Open Cypress UI
```

### 1. E2E Test - User Authentication Flow

**File:** `zarrin_blogs/cypress/e2e/auth.cy.js`

```javascript
describe('Authentication Flow', () => {
  
  beforeEach(() => {
    cy.visit('http://localhost:3000/login');
  });

  it('should login with valid credentials', () => {
    cy.get('input[placeholder*="email"]').type('test@example.com');
    cy.get('input[placeholder*="password"]').type('Password123');
    cy.get('button').contains('Login').click();
    
    cy.url().should('include', '/dashboard');
    cy.get('h1').should('contain', 'Dashboard');
  });

  it('should show error with invalid credentials', () => {
    cy.get('input[placeholder*="email"]').type('test@example.com');
    cy.get('input[placeholder*="password"]').type('WrongPassword');
    cy.get('button').contains('Login').click();
    
    cy.get('.error-message').should('contain', 'Invalid credentials');
  });

  it('should signup and verify email', () => {
    cy.visit('http://localhost:3000/signup');
    cy.get('input[placeholder*="name"]').type('New User');
    cy.get('input[placeholder*="email"]').type('newuser@example.com');
    cy.get('input[placeholder*="password"]').type('NewPass123');
    cy.get('button').contains('Signup').click();
    
    cy.url().should('include', '/verify-otp');
    cy.get('p').should('contain', 'verification');
  });
});
```

### 2. E2E Test - Blog Management

**File:** `zarrin_blogs/cypress/e2e/blog.cy.js`

```javascript
describe('Blog Management', () => {
  
  beforeEach(() => {
    cy.login('test@example.com', 'Password123');
    cy.visit('http://localhost:3000/dashboard');
  });

  it('should create a new blog', () => {
    cy.get('button').contains('Create Blog').click();
    
    cy.get('input[placeholder*="title"]').type('My Test Blog');
    cy.get('input[placeholder*="description"]').type('This is my first blog');
    cy.get('.ql-editor').type('This is the full content of my blog');
    
    cy.get('button').contains('Publish').click();
    cy.get('.success-message').should('contain', 'Blog created');
  });

  it('should search blogs', () => {
    cy.visit('http://localhost:3000/search');
    cy.get('input[placeholder*="search"]').type('technology');
    cy.get('button').contains('Search').click();
    
    cy.get('.blog-card').should('have.length.greaterThan', 0);
  });

  it('should like a blog', () => {
    cy.visit('http://localhost:3000/blog/1');
    cy.get('button').contains('❤️').click();
    
    cy.get('.like-count').should('contain', '1');
  });

  it('should comment on a blog', () => {
    cy.visit('http://localhost:3000/blog/1');
    cy.get('textarea[placeholder*="comment"]').type('Great blog post!');
    cy.get('button').contains('Post Comment').click();
    
    cy.get('.comment').should('contain', 'Great blog post!');
  });
});

// Custom command for login
Cypress.Commands.add('login', (email, password) => {
  cy.visit('http://localhost:3000/login');
  cy.get('input[placeholder*="email"]').type(email);
  cy.get('input[placeholder*="password"]').type(password);
  cy.get('button').contains('Login').click();
  cy.url().should('include', '/dashboard');
});
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Configuration

**File:** `.github/workflows/tests.yml`

```yaml
name: Run Tests

on: [push, pull_request]

jobs:
  # Frontend Tests
  frontend-tests:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [16.x, 18.x]
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - name: Install frontend dependencies
        working-directory: ./zarrin_blogs
        run: npm ci
      
      - name: Run frontend tests
        working-directory: ./zarrin_blogs
        run: npm test -- --coverage --watchAll=false
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./zarrin_blogs/coverage/lcov.info

  # Backend Tests
  backend-tests:
    runs-on: ubuntu-latest
    
    services:
      mongodb:
        image: mongo
        options: >-
          --health-cmd mongosh
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 27017:27017
    
    strategy:
      matrix:
        node-version: [16.x, 18.x]
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - name: Install backend dependencies
        working-directory: ./Zarrin_server
        run: npm ci
      
      - name: Run backend tests
        working-directory: ./Zarrin_server
        run: npm test -- --coverage
        env:
          MONGODB_URI: mongodb://localhost:27017/zarrin_test
          JWT_SECRET: test_secret
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./Zarrin_server/coverage/lcov.info

  # E2E Tests (Optional)
  e2e-tests:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Install dependencies
        run: |
          cd zarrin_blogs && npm ci
          cd ../Zarrin_server && npm ci
      
      - name: Start backend
        working-directory: ./Zarrin_server
        run: npm start &
      
      - name: Start frontend
        working-directory: ./zarrin_blogs
        run: npm start &
      
      - name: Run Cypress tests
        uses: cypress-io/github-action@v5
        with:
          working-directory: ./zarrin_blogs
          start: npm start
          browser: chrome
```

---

## ✅ Testing Best Practices

### 1. **Test Coverage Goals**

```
Target: 80%+ coverage

├─ Statements: 80%+ ✓
├─ Branches: 75%+ ✓
├─ Functions: 80%+ ✓
└─ Lines: 80%+ ✓
```

### 2. **Test File Organization**

```
project/
├── src/
│   ├── components/
│   │   ├── Button.jsx
│   │   └── __tests__/
│   │       └── Button.test.js
│   ├── utils/
│   │   ├── helpers.js
│   │   └── __tests__/
│   │       └── helpers.test.js
│   └── context/
│       ├── AuthContext.jsx
│       └── __tests__/
│           └── AuthContext.test.js
```

### 3. **Test Naming Conventions**

```javascript
// ✅ Good
describe('LoginComponent', () => {
  test('should display login form when not authenticated', () => {});
  test('should show validation error for invalid email', () => {});
  test('should call login API with correct credentials', () => {});
});

// ❌ Bad
describe('Test', () => {
  test('test 1', () => {});
  test('works', () => {});
});
```

### 4. **Mock External Dependencies**

```javascript
// ✅ Good - Mock API calls
jest.mock('axios');
axios.get.mockResolvedValue({ data: { users: [] } });

// ✅ Good - Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
};
global.localStorage = localStorageMock;
```

### 5. **Use Test Data Builders**

```javascript
// ✅ Good - Clear test data
const createMockBlog = (overrides = {}) => ({
  _id: '123',
  title: 'Test Blog',
  description: 'Test',
  author: 'user123',
  ...overrides
});

test('should render blog', () => {
  const blog = createMockBlog({ title: 'Custom Title' });
  render(<BlogComponent blog={blog} />);
  expect(screen.getByText('Custom Title')).toBeInTheDocument();
});
```

### 6. **Test User Interactions**

```javascript
// ✅ Good - Simulate actual user behavior
import userEvent from '@testing-library/user-event';

test('should submit form on button click', async () => {
  const user = userEvent.setup();
  render(<LoginForm />);
  
  await user.type(screen.getByLabelText(/email/i), 'test@example.com');
  await user.click(screen.getByRole('button', { name: /login/i }));
});
```

### 7. **Test Error Scenarios**

```javascript
// ✅ Good - Test error handling
test('should show error message on API failure', async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: false,
      json: () => Promise.resolve({ message: 'Server error' })
    })
  );

  render(<LoginForm />);
  // ... interact with form ...
  
  await waitFor(() => {
    expect(screen.getByText('Server error')).toBeInTheDocument();
  });
});
```

---

## 📊 Testing Checklist

### Before Deployment

- [ ] All unit tests pass
- [ ] Test coverage > 80%
- [ ] All integration tests pass
- [ ] E2E tests pass for critical flows
- [ ] No console errors or warnings
- [ ] All mocks are properly cleaned up
- [ ] Environment variables configured
- [ ] API responses validated
- [ ] Error handling tested
- [ ] Security tests passed

---

## 🚀 Quick Start Commands

```bash
# Frontend
cd zarrin_blogs
npm test                              # Run tests
npm test -- --coverage                # Coverage report
npm test -- --watch                   # Watch mode

# Backend
cd Zarrin_server
npm test                              # Run tests
npm run test:coverage                 # Coverage report
npm run test:watch                    # Watch mode
npm run test:verbose                  # Detailed output

# E2E
cd zarrin_blogs
npx cypress open                      # Open Cypress UI
npx cypress run                       # Run headless
```

---

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Supertest](https://github.com/visionmedia/supertest)
- [Cypress Documentation](https://docs.cypress.io/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

## 🎯 Next Steps

1. **Set up Jest in backend** → `npm install --save-dev jest supertest`
2. **Create test files** → Start with utility functions
3. **Add to CI/CD** → GitHub Actions configuration
4. **Increase coverage** → Target 80%+ gradually
5. **Setup Cypress** → For E2E testing critical flows

---

**Happy Testing! 🎉**
