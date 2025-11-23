const express = require('express');
const Contact = require('../models/contact');

const router = express.Router();

// Submit contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ 
        success: false,
        message: `Please provide ${[
          !name && 'name',
          !email && 'email',
          !phone && 'phone',
          !message && 'message'
        ].filter(Boolean).join(', ')}`
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Create new contact entry
    const contact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully!',
      data: contact
    });
  } catch (err) {
    console.error('Error in contact form submission:', err);
    
    // Handle duplicate key error
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'This contact information has already been submitted'
      });
    }

    // Handle validation errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: Object.values(err.errors).map(error => error.message).join(', ')
      });
    }

    res.status(500).json({ 
      success: false,
      message: 'Failed to send message. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

module.exports = router;
