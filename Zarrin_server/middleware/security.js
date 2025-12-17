// ================================================
// SECURITY MIDDLEWARE - Protect from Cyber Attacks
// ================================================

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { validationResult, body, query, param } = require('express-validator');
const xss = require('xss');

// ✅ 1. HELMET.JS - Set Security HTTP Headers
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
      connectSrc: ["'self'", 'https://api.cloudinary.com'],
      fontSrc: ["'self'", 'https:'],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
  frameguard: { action: 'deny' },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
});

// ✅ 2. RATE LIMITING - Prevent Brute Force & DDoS

// General rate limiter for all requests (DISABLED for localhost development)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.ip === '127.0.0.1' || req.ip === '::1', // Skip localhost for testing
});

// Rate limiter for authentication routes (login, signup, forgot-password, verify-otp)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 requests per 15 minutes per email/IP (increased from 5)
  message: 'Too many authentication attempts, please try again in 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.body.email || req.ip, // Rate limit by email if provided, otherwise IP
  handler: (req, res) => {
    console.warn(`Rate limit exceeded for ${req.body.email || req.ip} on ${req.path}`);
    res.status(429).json({ 
      message: 'Too many authentication attempts. Please wait 15 minutes before trying again.',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  },
});

// Strict rate limiter for search/filtering (prevent data scraping)
const searchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 searches per minute (increased from 30)
  message: 'Too many search requests, please try again later',
  skip: (req) => req.ip === '127.0.0.1' || req.ip === '::1', // Skip localhost
});

// Rate limiter for file uploads
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 uploads per hour (increased from 20)
  message: 'Upload limit exceeded, try again later',
  skip: (req) => req.ip === '127.0.0.1' || req.ip === '::1', // Skip localhost
});

// Rate limiter for API write operations (POST, PUT, DELETE) - DISABLED for localhost
const writeLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 500, // 500 write operations per 5 minutes (increased from 50)
  message: 'Too many write operations, please try again later',
  skip: (req) => {
    // Skip rate limiting for localhost
    if (req.ip === '127.0.0.1' || req.ip === '::1') return true;
    // Only apply to actual write methods
    return !['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method);
  },
});

// ✅ 3. INPUT VALIDATION & SANITIZATION

// Validation middleware for blog creation/update
const validateBlog = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3, max: 200 }).withMessage('Title must be 3-200 characters')
    .matches(/^[a-zA-Z0-9\s\-_.!?,']+$/).withMessage('Title contains invalid characters'),
  
  body('content')
    .trim()
    .notEmpty().withMessage('Content is required')
    .isLength({ min: 10 }).withMessage('Content must be at least 10 characters'),
  
  body('shortDesc')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 5, max: 500 }).withMessage('Description must be 5-500 characters'),
  
  body('category')
    .optional()
    .isArray().withMessage('Category must be an array'),
  
  body('images')
    .optional()
    .isArray().withMessage('Images must be an array'),
  
  // Custom validation function to sanitize
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: errors.array() 
      });
    }
    
    // Sanitize XSS
    req.body.title = xss(req.body.title);
    req.body.content = xss(req.body.content);
    req.body.shortDesc = xss(req.body.shortDesc);
    
    next();
  }
];

// Validation middleware for user auth
const validateAuth = [
  body('email')
    .trim()
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain uppercase, lowercase, and number'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: errors.array() 
      });
    }
    next();
  }
];

// Validation middleware for comments
const validateComment = [
  body('content')
    .trim()
    .notEmpty().withMessage('Comment cannot be empty')
    .isLength({ min: 1, max: 1000 }).withMessage('Comment must be 1-1000 characters'),
  
  param('blogId')
    .isMongoId().withMessage('Invalid blog ID'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: errors.array() 
      });
    }
    
    // Sanitize comment content
    req.body.content = xss(req.body.content);
    
    next();
  }
];

// Validation middleware for search queries
const validateSearch = [
  query('q')
    .trim()
    .notEmpty().withMessage('Search query is required')
    .isLength({ min: 1, max: 100 }).withMessage('Search query must be 1-100 characters')
    .matches(/^[a-zA-Z0-9\s\-_.]+$/).withMessage('Search query contains invalid characters'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: errors.array() 
      });
    }
    
    // Sanitize search query
    req.query.q = xss(req.query.q);
    
    next();
  }
];

// Validation middleware for MongoDB ObjectId
const validateObjectId = [
  param('id')
    .isMongoId().withMessage('Invalid ID format'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Invalid ID',
        errors: errors.array() 
      });
    }
    next();
  }
];

// ✅ 4. GLOBAL ERROR HANDLER
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation error',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      message: `${field} already exists`
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token expired' });
  }

  // Default error
  res.status(err.statusCode || 500).json({
    message: err.message || 'Server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// ✅ 5. CORS VALIDATION
const validateCORS = (req, res, next) => {
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://zarrin-blogs-frontend.vercel.app',
    process.env.FRONTEND_URL || ''
  ].filter(Boolean);

  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  next();
};

// ✅ 6. PREVENT PARAMETER POLLUTION
const preventParameterPollution = (req, res, next) => {
  // Keep only last value for each parameter
  for (const key in req.query) {
    if (Array.isArray(req.query[key])) {
      req.query[key] = req.query[key].slice(-1)[0];
    }
  }
  next();
};

// ✅ 7. SECURITY LOGGING
const securityLogger = (req, res, next) => {
  // Log suspicious activities
  const suspiciousPatterns = [
    /(\bselect\b|\bunion\b|\bdrop\b|\binsert\b|\bupdate\b|\bdelete\b)/gi, // SQL injection
    /<script|javascript:/gi, // XSS
    /\.\.\//gi, // Path traversal
  ];

  const queryString = JSON.stringify(req.query);
  const bodyString = JSON.stringify(req.body);
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(queryString) || pattern.test(bodyString)) {
      console.warn(`🚨 SUSPICIOUS REQUEST DETECTED:`, {
        method: req.method,
        path: req.path,
        ip: req.ip,
        query: req.query,
        timestamp: new Date()
      });
    }
  }
  
  next();
};

module.exports = {
  securityHeaders,
  generalLimiter,
  authLimiter,
  searchLimiter,
  uploadLimiter,
  writeLimiter,
  validateBlog,
  validateAuth,
  validateComment,
  validateSearch,
  validateObjectId,
  errorHandler,
  validateCORS,
  preventParameterPollution,
  securityLogger,
};
