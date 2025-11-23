
const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');
const { auth, admin } = require('../middleware/auth');

const router = express.Router();

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
  // If the auth middleware passes, the token is valid
  res.status(200).json({ 
    valid: true, 
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
});

// Register
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log('Signup attempt for email:', email);

    if (!name || !email || !password) {
      console.log('Missing required fields');
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Normalize email and trim password
    const normalizedEmail = email.toLowerCase().trim();
    const trimmedPassword = password.trim();
    
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      console.log('User already exists with email:', normalizedEmail);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user - password will be hashed by the model's pre-save middleware
    console.log('Creating new user...');
    const user = new User({ 
      name, 
      email: normalizedEmail, 
      password: trimmedPassword 
    });
    
    // Save user
    await user.save();
    console.log('User created successfully with email:', normalizedEmail);
    
    // Generate token
    const token = generateToken(user);
    console.log('Token generated successfully for new user');
    
    // Send back the same response structure as login
    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);

    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Normalize email and trim password
    const normalizedEmail = email.toLowerCase().trim();
    const trimmedPassword = password.trim();
    
    console.log('Looking for user with email:', normalizedEmail);
    
    // Find user
    const foundUser = await User.findOne({ email: normalizedEmail });
    if (!foundUser) {
        console.log('No user found with email:', normalizedEmail);
        return res.status(400).json({ message: 'Invalid credentials' });
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
      user: { 
        id: foundUser._id, 
        name: foundUser.name, 
        email: foundUser.email, 
        role: foundUser.role 
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

module.exports = router;
