
const express = require('express');
const bcrypt = require('bcryptjs');
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

// Validate token
router.get('/validate', auth, (req, res) => {
  try {
    // If the auth middleware passes, the token is valid
    res.status(200).json({ 
      valid: true, 
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        isEmailVerified: req.user.isEmailVerified
      }
    });
  } catch (err) {
    console.error('Validate endpoint error:', err);
    res.status(500).json({ 
      message: 'Server error during validation', 
      error: err.message 
    });
  }
});

// ✅ SIGNUP - Send OTP to Email
router.post('/signup', validateSignup, validateAuth, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    logger.info('Signup attempt', { email, name });

    // Normalize email and trim password
    const normalizedEmail = email.toLowerCase().trim();
    const trimmedPassword = password.trim();
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      logger.warn('Signup failed: user already exists', { email: normalizedEmail });
      return res.status(400).json({ message: 'User already exists. Please login instead.' });
    }

    // Generate OTP (6 digits)
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create user with OTP (email not verified yet)
    logger.debug('Creating new user with OTP', { email: normalizedEmail });
    const user = new User({ 
      name, 
      email: normalizedEmail, 
      password: trimmedPassword,
      otp: otp,
      otpExpires: otpExpires,
      isEmailVerified: false
    });
    
    // Save user
    await user.save();
    console.log('User created successfully with email:', normalizedEmail);

    // Send OTP to email
    const emailResult = await sendOTPEmail(normalizedEmail, otp);
    
    if (!emailResult.success) {
      return res.status(500).json({ 
        message: 'User created but failed to send OTP. Please request OTP again.',
        error: emailResult.message 
      });
    }
    
    res.status(201).json({
      message: 'Signup successful! OTP has been sent to your email. Please verify within 10 minutes.',
      email: normalizedEmail,
      requiresVerification: true
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ VERIFY OTP - Confirm Email
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find user
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already verified
    if (user.isEmailVerified) {
      return res.status(400).json({ message: 'Email already verified. Please login.' });
    }

    // Check if OTP matches
    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
    }

    // Check if OTP expired
    if (new Date() > user.otpExpires) {
      return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
    }

    // Mark email as verified and clear OTP
    user.isEmailVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    // Send welcome email
    await sendWelcomeEmail(normalizedEmail, user.name);

    // Generate token
    const token = generateToken(user);

    console.log('Email verified successfully for:', normalizedEmail);

    res.status(200).json({
      message: 'Email verified successfully!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      },
      token
    });
  } catch (err) {
    console.error('OTP verification error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ RESEND OTP - Send New OTP (No auth validator needed)
router.post('/resend-otp', async (req, res) => {
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

    const normalizedEmail = email.toLowerCase().trim();

    // Find user
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Check if already verified
    if (user.isEmailVerified) {
      return res.status(400).json({ message: 'Email already verified. Please login.' });
    }

    // Generate new OTP
    const newOtp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user with new OTP
    user.otp = newOtp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send OTP to email
    const emailResult = await sendOTPEmail(normalizedEmail, newOtp);

    if (!emailResult.success) {
      return res.status(500).json({ 
        message: 'Failed to resend OTP',
        error: emailResult.message 
      });
    }

    console.log('New OTP sent to:', normalizedEmail);

    res.status(200).json({
      message: 'New OTP has been sent to your email. Valid for 10 minutes.',
      email: normalizedEmail
    });
  } catch (err) {
    console.error('Resend OTP error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ LOGIN
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;
    logger.info('Login attempt', { email });

    // Normalize email and trim password
    const normalizedEmail = email.toLowerCase().trim();
    const trimmedPassword = password.trim();
    
    logger.debug('Looking for user', { email: normalizedEmail });
    
    // Find user
    const foundUser = await User.findOne({ email: normalizedEmail });
    if (!foundUser) {
        logger.warn('Login failed: user not found', { email: normalizedEmail });
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    // ✅ Check if email is verified
    if (!foundUser.isEmailVerified) {
      logger.warn('Login failed: email not verified', { email: normalizedEmail });
      return res.status(403).json({ 
        message: 'Email not verified. Please verify your email first.',
        requiresVerification: true,
        email: normalizedEmail
      });
    }

    // Add detailed error handling for password comparison
    let passwordMatch;
    try {
      passwordMatch = await foundUser.comparePassword(trimmedPassword);
      console.log('Password comparison result:', passwordMatch);
    } catch (error) {
      console.error('Error during password comparison:', error);
      return res.status(500).json({ message: 'Error verifying password' });
    }

    if (!passwordMatch) {
        console.log('Password verification failed for user:', normalizedEmail);
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('Password verified successfully for:', normalizedEmail);
    
    console.log('Generating token for user:', {
      id: foundUser._id,
      email: foundUser.email,
      role: foundUser.role
    });

    // Generate token
    const token = generateToken(foundUser);
    
    if (!token) {
      console.error('Token generation failed');
      throw new Error('Failed to generate authentication token');
    }

    console.log('Token generated successfully, sending response');
    
    // Send response
    res.json({ 
      message: 'Login successful',
      user: { 
        id: foundUser._id, 
        name: foundUser.name, 
        email: foundUser.email, 
        role: foundUser.role,
        isEmailVerified: foundUser.isEmailVerified
      }, 
      token 
    });
  } catch (err) {
    console.error('Login error details:', {
      message: err.message,
      stack: err.stack,
      name: err.name
    });
    res.status(500).json({ message: 'Server error', error: err.message });
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
router.post('/forgot-password', async (req, res) => {
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

module.exports = router;
