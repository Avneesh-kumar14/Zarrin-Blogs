const { body, query, param, validationResult } = require('express-validator');
const logger = require('./logger');

/**
 * Validation middleware to handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    logger.warn('Validation failed', {
      ip: req.ip,
      endpoint: req.path,
      method: req.method,
      errors: errors.array(),
    });
    
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array().map(err => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  
  next();
};

// ==================== AUTH VALIDATION ====================

const validateSignup = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 3 }).withMessage('Name must be at least 3 characters')
    .isLength({ max: 50 }).withMessage('Name must be less than 50 characters')
    .matches(/^[a-zA-Z\s]*$/).withMessage('Name can only contain letters and spaces'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Email must be valid')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number'),
  
  handleValidationErrors,
];

const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Email must be valid')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required'),
  
  handleValidationErrors,
];

const validateOTP = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Email must be valid'),
  
  handleValidationErrors,
];

const validateVerifyEmail = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Email must be valid'),
  
  body('otp')
    .notEmpty().withMessage('OTP is required')
    .isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
  
  handleValidationErrors,
];

const validateResetPassword = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Email must be valid'),
  
  handleValidationErrors,
];

const validateNewPassword = [
  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number'),
  
  handleValidationErrors,
];

// ==================== BLOG VALIDATION ====================

const validateBlogCreate = [
  body('title')
    .trim()
    .notEmpty().withMessage('Blog title is required')
    .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
  
  body('blog_content')
    .trim()
    .notEmpty().withMessage('Blog content is required')
    .isLength({ min: 10 }).withMessage('Content must be at least 10 characters'),
  
  body('short_description')
    .trim()
    .isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
  
  body('category')
    .isArray().withMessage('Category must be an array')
    .notEmpty().withMessage('At least one category is required'),
  
  body('readTime')
    .optional()
    .isInt({ min: 1, max: 1000 }).withMessage('Read time must be between 1 and 1000 minutes'),
  
  handleValidationErrors,
];

const validateBlogUpdate = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
  
  body('blog_content')
    .optional()
    .trim()
    .isLength({ min: 10 }).withMessage('Content must be at least 10 characters'),
  
  body('short_description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
  
  body('category')
    .optional()
    .isArray().withMessage('Category must be an array'),
  
  param('id')
    .isMongoId().withMessage('Invalid blog ID format'),
  
  handleValidationErrors,
];

const validateBlogId = [
  param('id')
    .isMongoId().withMessage('Invalid blog ID format'),
  
  handleValidationErrors,
];

// ==================== COMMENT VALIDATION ====================

const validateCommentCreate = [
  body('blogId')
    .notEmpty().withMessage('Blog ID is required')
    .isMongoId().withMessage('Invalid blog ID format'),
  
  body('content')
    .trim()
    .notEmpty().withMessage('Comment content is required')
    .isLength({ min: 1, max: 1000 }).withMessage('Comment must be between 1 and 1000 characters'),
  
  handleValidationErrors,
];

const validateCommentId = [
  param('id')
    .isMongoId().withMessage('Invalid comment ID format'),
  
  handleValidationErrors,
];

// ==================== SEARCH VALIDATION ====================

const validateSearch = [
  query('query')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Search query must be less than 100 characters'),
  
  query('category')
    .optional()
    .isMongoId().withMessage('Invalid category ID format'),
  
  query('author')
    .optional()
    .isMongoId().withMessage('Invalid author ID format'),
  
  query('minViews')
    .optional()
    .isInt({ min: 0 }).withMessage('Minimum views must be a positive number'),
  
  query('maxViews')
    .optional()
    .isInt({ min: 0 }).withMessage('Maximum views must be a positive number'),
  
  query('minReadTime')
    .optional()
    .isInt({ min: 0 }).withMessage('Minimum read time must be a positive number'),
  
  query('maxReadTime')
    .optional()
    .isInt({ min: 0 }).withMessage('Maximum read time must be a positive number'),
  
  query('sortBy')
    .optional()
    .isIn(['newest', 'oldest', 'trending', 'popular', 'mostLiked'])
    .withMessage('Invalid sort option'),
  
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive number'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  
  handleValidationErrors,
];

// ==================== READING PROGRESS VALIDATION ====================

const validateReadingProgressSave = [
  param('blogId')
    .notEmpty().withMessage('Blog ID is required')
    .isMongoId().withMessage('Invalid blog ID format'),
  
  body('scrollPosition')
    .notEmpty().withMessage('Scroll position is required')
    .isInt({ min: 0, max: 100 }).withMessage('Scroll position must be between 0 and 100'),
  
  body('timeSpent')
    .notEmpty().withMessage('Time spent is required')
    .isInt({ min: 0 }).withMessage('Time spent must be a positive number'),
  
  body('isCompleted')
    .optional()
    .isBoolean().withMessage('isCompleted must be a boolean'),
  
  handleValidationErrors,
];

const validateReadingProgressGet = [
  param('blogId')
    .notEmpty().withMessage('Blog ID is required')
    .isMongoId().withMessage('Invalid blog ID format'),
  
  handleValidationErrors,
];

// ==================== ADMIN VALIDATION ====================

const validateAdminDeleteUser = [
  param('userId')
    .notEmpty().withMessage('User ID is required')
    .isMongoId().withMessage('Invalid user ID format'),
  
  handleValidationErrors,
];

const validateAdminUpdateBlogStatus = [
  param('blogId')
    .notEmpty().withMessage('Blog ID is required')
    .isMongoId().withMessage('Invalid blog ID format'),
  
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['draft', 'published', 'scheduled']).withMessage('Invalid status value'),
  
  handleValidationErrors,
];

const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive number'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  
  handleValidationErrors,
];

module.exports = {
  // Auth validations
  validateSignup,
  validateLogin,
  validateOTP,
  validateVerifyEmail,
  validateResetPassword,
  validateNewPassword,
  
  // Blog validations
  validateBlogCreate,
  validateBlogUpdate,
  validateBlogId,
  
  // Comment validations
  validateCommentCreate,
  validateCommentId,
  
  // Search validations
  validateSearch,
  
  // Reading progress validations
  validateReadingProgressSave,
  validateReadingProgressGet,
  
  // Admin validations
  validateAdminDeleteUser,
  validateAdminUpdateBlogStatus,
  validatePagination,
  
  // Utility
  handleValidationErrors,
};
