
const express = require('express');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');
const { auth, admin } = require('../middleware/auth');
const { generateOTP, sendOTPEmail, sendWelcomeEmail } = require('../utils/emailService');
const { validateAuth } = require('../middleware/security');
const logger = require('../utils/logger');
const {
  validateSignup,
  validateLogin,
  validateOTP,
  validateVerifyEmail,
  validateResetPassword,
  validateNewPassword,
} = require('../utils/validators');

const router = express.Router();

// ✅ Rate limiter for sensitive auth endpoints (login, signup, OTP, password reset)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Allow 10 attempts per 15 minutes per IP
  message: 'Too many authentication attempts, please try again in 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => (req.body && req.body.email) ? req.body.email : req.ip,
  handler: (req, res) => {
    const identifier = (req.body && req.body.email) ? req.body.email : req.ip;
    console.warn(`Rate limit exceeded for ${identifier} on ${req.path}`);
    res.status(429).json({ 
      message: 'Too many authentication attempts. Please wait 15 minutes before trying again.',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  },
  skip: (req) => req.ip === '127.0.0.1' || req.ip === '::1', // Skip localhost
});

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User authentication endpoints
 */

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 description: Must contain uppercase, lowercase, and number
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user: { $ref: '#/components/schemas/User' }
 *                 token: { type: string }
 *       400:
 *         description: Invalid input or email already exists
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user: { $ref: '#/components/schemas/User' }
 *                 token: { type: string }
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /api/auth/send-otp:
 *   post:
 *     summary: Send OTP for email verification
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       400:
 *         description: Invalid email
 */

/**
 * @swagger
 * /api/auth/verify-email:
 *   post:
 *     summary: Verify email with OTP
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp]
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email verified
 *       400:
 *         description: Invalid or expired OTP
 */

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset email sent
 *       400:
 *         description: User not found
 */

/**
 * @swagger
 * /api/auth/reset-password/{token}:
 *   post:
 *     summary: Reset password with token
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [password]
 *             properties:
 *               password:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid or expired token
 */


// Password reset for existing users (rehash with bcryptjs)
router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Email and new password are required' });
    }
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Password reset error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ VALIDATE TOKEN - Check if JWT is still valid
router.get('/validate', auth, (req, res) => {
  try {
    // If the auth middleware passes, the token is valid
    // The middleware would have rejected invalid tokens
    return res.status(200).json({ 
      success: true,
      valid: true, 
      user: {
        id: req.user._id,
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        isEmailVerified: req.user.isEmailVerified,
        avatar: req.user.avatar || ''
      }
    });
  } catch (err) {
    logger.error('Validate endpoint error', { error: err.message });
    // Prevent hanging requests
    return res.status(500).json({ 
      success: false,
      message: 'Server error during validation', 
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// ✅ SIGNUP - Send OTP to Email
router.post('/signup', authLimiter, validateSignup, validateAuth, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    logger.info('Signup attempt', { email, name });

    // VALIDATION: Normalize and trim inputs
    const normalizedEmail = email.toLowerCase().trim();
    const trimmedPassword = password.trim();
    
    // DATABASE: Check if user already exists (prevents duplicate)
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      logger.warn('Signup failed: user already exists', { email: normalizedEmail });
      return res.status(400).json({ 
        success: false,
        message: 'User already exists. Please login instead.' 
      });
    }

    // OTP GENERATION: Create 6-digit OTP valid for 10 minutes
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // USER CREATION: Save user with OTP (email NOT verified yet)
    logger.debug('Creating new user with OTP', { email: normalizedEmail });
    const user = new User({ 
      name, 
      email: normalizedEmail, 
      password: trimmedPassword,
      otp: otp,
      otpExpires: otpExpires,
      isEmailVerified: false
      // Password is auto-hashed by userModel.pre('save') middleware
    });
    
    // Save to MongoDB
    await user.save();
    logger.info('User account created successfully', { email: normalizedEmail });

    // ⚠️ EMAIL SENDING: Non-blocking send (fire-and-forget)
    // We respond immediately, then send email asynchronously
    // This prevents hangingloading spinners in production
    sendOTPEmail(normalizedEmail, otp).catch(err => {
      logger.error('Failed to send OTP email (non-blocking)', { email: normalizedEmail, error: err.message });
      // Note: User was already created, but email failed. They can use resend-otp endpoint.
    });
    
    // RESPONSE: Return 201 Created immediately (don't wait for email)
    return res.status(201).json({
      success: true,
      message: 'Signup successful! OTP has been sent to your email. Please verify within 10 minutes.',
      email: normalizedEmail,
      requiresVerification: true
    });

  } catch (err) {
    logger.error('Signup error', { error: err.message, stack: err.stack });
    console.error('Signup error details:', err);
    
    // Prevent hanging requests - always return a response
    return res.status(500).json({ 
      success: false,
      message: 'Server error during signup',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// ✅ VERIFY OTP - Confirm Email
router.post('/verify-otp', authLimiter, async (req, res) => {
  try {
    const { email, otp } = req.body;

    // VALIDATION: Ensure email and OTP are provided
    if (!email || !otp) {
      return res.status(400).json({ 
        success: false,
        message: 'Email and OTP are required' 
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // DATABASE: Find user by email
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // OTP CHECK: Already verified
    if (user.isEmailVerified) {
      return res.status(400).json({ 
        success: false,
        message: 'Email already verified. Please login.' 
      });
    }

    // OTP CHECK: OTP matches
    if (user.otp !== otp) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid OTP. Please try again.' 
      });
    }

    // OTP CHECK: OTP not expired
    if (new Date() > user.otpExpires) {
      return res.status(400).json({ 
        success: false,
        message: 'OTP expired. Please request a new one.' 
      });
    }

    // ✅ VERIFICATION: Mark email as verified and clear OTP
    user.isEmailVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();
    logger.info('Email verified successfully', { email: normalizedEmail });

    // ⚠️ EMAIL SENDING: Non-blocking send (fire-and-forget)
    // Send welcome email in background, don't wait for it
    sendWelcomeEmail(normalizedEmail, user.name).catch(err => {
      logger.error('Failed to send welcome email (non-blocking)', { email: normalizedEmail, error: err.message });
      // User was already verified, email failure is not critical
    });

    // TOKEN GENERATION: Create access and refresh tokens
    const { generateTokenPair } = require('../utils/generateToken');
    const { accessToken, refreshToken } = generateTokenPair(user);

    // RESPONSE: Return user data and tokens (status 200 for verification success)
    return res.status(200).json({
      success: true,
      message: 'Email verified successfully!',
      user: {
        _id: user._id,
        id: user._id, // Normalized for frontend
        name: user.name,
        email: user.email,
        avatar: user.avatar || '',
        role: user.role,
        isEmailVerified: user.isEmailVerified
      },
      token: accessToken,
      refreshToken
    });

  } catch (err) {
    logger.error('OTP verification error', { error: err.message, stack: err.stack });
    console.error('OTP verification error details:', err);
    
    // Prevent hanging requests
    return res.status(500).json({ 
      success: false,
      message: 'Server error during verification',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// ✅ RESEND OTP - Send New OTP Code to Email
router.post('/resend-otp', authLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    // VALIDATION: Email is required
    if (!email) {
      return res.status(400).json({ 
        success: false,
        message: 'Email is required' 
      });
    }

    // VALIDATION: Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false,
        message: 'Valid email is required' 
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // DATABASE: Find user by email
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      // Security: Don't reveal if email exists
      return res.status(400).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // STATUS CHECK: Already verified
    if (user.isEmailVerified) {
      return res.status(400).json({ 
        success: false,
        message: 'Email already verified. Please login.' 
      });
    }

    // OTP GENERATION: Create new 6-digit OTP valid for 10 minutes
    const newOtp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // DATABASE: Update user with new OTP
    user.otp = newOtp;
    user.otpExpires = otpExpires;
    await user.save();
    logger.info('New OTP generated for resend', { email: normalizedEmail });

    // ⚠️ EMAIL SENDING: Non-blocking send (fire-and-forget)
    // Send OTP in background, respond immediately
    sendOTPEmail(normalizedEmail, newOtp).catch(err => {
      logger.error('Failed to send OTP email in resend (non-blocking)', { 
        email: normalizedEmail, 
        error: err.message 
      });
    });

    // RESPONSE: Return 200 immediately (email is sent asynchronously)
    return res.status(200).json({
      success: true,
      message: 'New OTP has been sent to your email. Valid for 10 minutes.',
      email: normalizedEmail
    });

  } catch (err) {
    logger.error('Resend OTP error', { error: err.message, stack: err.stack });
    // Prevent hanging requests
    return res.status(500).json({ 
      success: false,
      message: 'Server error during OTP resend',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// ✅ LOGIN - Authenticate user with email and password
router.post('/login', authLimiter, validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;
    logger.info('Login attempt initiated', { email });

    // VALIDATION: Normalize inputs
    const normalizedEmail = email.toLowerCase().trim();
    const trimmedPassword = password.trim();
    
    logger.debug('Looking up user in database', { email: normalizedEmail });
    
    // DATABASE: Find user by email
    const foundUser = await User.findOne({ email: normalizedEmail });
    if (!foundUser) {
      logger.warn('Login failed: user not found', { email: normalizedEmail });
      // Security: Don't reveal if email exists (vague error)
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    // EMAIL VERIFICATION: Not required for login (optional verification later from settings)
    // This allows users to login immediately after signup, following Instagram/Facebook pattern
    logger.debug('Email verification status', { email: normalizedEmail, isVerified: foundUser.isEmailVerified });

    // PASSWORD VERIFICATION: Compare plaintext with hashed password
    logger.debug('Initiating password comparison', { email: normalizedEmail });
    let passwordMatch;
    
    try {
      // await is critical here - bcrypt.compare is async
      passwordMatch = await foundUser.comparePassword(trimmedPassword);
      logger.debug('Password comparison completed', { email: normalizedEmail, match: passwordMatch });
    } catch (bcryptError) {
      logger.error('Error during password comparison', { error: bcryptError.message });
      // Return generic 500 error (don't leak that bcrypt failed)
      return res.status(500).json({ 
        success: false,
        message: 'Server error during authentication' 
      });
    }

    // PASSWORD CHECK: Ensure password matches
    if (!passwordMatch) {
      logger.warn('Login failed: invalid password', { email: normalizedEmail });
      // Security: Same vague error as user not found
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    logger.info('Password verified successfully', { email: normalizedEmail });
    
    // TOKEN GENERATION: Create access and refresh tokens
    logger.debug('Generating token pair', {
      userId: foundUser._id,
      email: foundUser.email,
      role: foundUser.role
    });

    const { generateTokenPair } = require('../utils/generateToken');
    const { accessToken, refreshToken } = generateTokenPair(foundUser);
    
    // VALIDATION: Ensure tokens were generated (should never fail, but check anyway)
    if (!accessToken || !refreshToken) {
      logger.error('Token generation failed unexpectedly');
      return res.status(500).json({ 
        success: false,
        message: 'Failed to generate authentication tokens' 
      });
    }

    logger.info('Login successful - tokens generated', { 
      email: normalizedEmail,
      userId: foundUser._id 
    });
    
    // RESPONSE: Return user data and tokens with consistent 200 status
    return res.status(200).json({ 
      success: true,
      message: 'Login successful',
      user: { 
        _id: foundUser._id,
        id: foundUser._id, // Normalized id field for frontend
        name: foundUser.name, 
        email: foundUser.email, 
        role: foundUser.role,
        avatar: foundUser.avatar || '',
        isEmailVerified: foundUser.isEmailVerified
      }, 
      token: accessToken,
      refreshToken 
    });

  } catch (err) {
    logger.error('Unexpected login error', {
      message: err.message,
      stack: err.stack,
      name: err.name
    });
    // Prevent hanging requests with explicit return
    return res.status(500).json({ 
      success: false,
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  res.json(req.user);
});

// Admin: get all users
router.get('/all', auth, admin, async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

// ✅ FORGOT PASSWORD - Send reset link to email (No auth validator needed)
router.post('/forgot-password', authLimiter, async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Valid email is required' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      // Don't reveal if email exists (security best practice)
      return res.status(200).json({ message: 'If email exists, reset link sent' });
    }

    // Generate reset token (random 32 character string)
    const crypto = require('crypto');
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Save token and expiry (1 hour)
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Create reset link
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
    
    // Send email
    const { sendPasswordResetEmail } = require('../utils/emailService');
    await sendPasswordResetEmail(user.email, resetLink);

    console.log('Password reset email sent to:', user.email);
    res.status(200).json({ message: 'If email exists, reset link sent' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ VERIFY RESET TOKEN
router.post('/verify-reset-token', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ message: 'Reset token is required' });
    }

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    res.status(200).json({ message: 'Token is valid', email: user.email });
  } catch (err) {
    console.error('Verify token error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ RESET PASSWORD - Set new password with token
router.post('/reset-password-with-token', async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;
    
    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }
    if (!/[a-z]/.test(newPassword) || !/[A-Z]/.test(newPassword) || !/\d/.test(newPassword)) {
      return res.status(400).json({ message: 'Password must contain uppercase, lowercase, and number' });
    }

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Update password
    user.password = newPassword;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();

    console.log('Password reset successful for:', user.email);
    res.status(200).json({ message: 'Password reset successful. Please login with your new password.' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ REFRESH TOKEN endpoint - Generate new access token from refresh token
router.post('/refresh-token', async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: 'No refresh token provided' });
    }

    const { REFRESH_SECRET } = require('../utils/generateToken');
    const jwt = require('jsonwebtoken');

    try {
      const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // Generate new token pair
      const { generateTokenPair } = require('../utils/generateToken');
      const { accessToken, refreshToken: newRefreshToken } = generateTokenPair(user);

      res.json({
        accessToken,
        refreshToken: newRefreshToken,
        user: {
          _id: user._id,
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar || ''
        }
      });
    } catch (jwtError) {
      console.error('Refresh token verification failed:', jwtError.message);
      return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }
  } catch (err) {
    console.error('Refresh token error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
