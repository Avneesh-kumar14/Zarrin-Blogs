const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('Auth header:', authHeader ? 'Present' : 'Missing');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Received token:', token.substring(0, 20) + '...');

    // Get JWT_SECRET from environment or use fallback
    const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-key-make-this-long-and-secure-123';
    console.log('Using JWT_SECRET:', JWT_SECRET.substring(0, 5) + '...');

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log('Token decoded successfully:', { 
        userId: decoded.id,
        role: decoded.role,
        email: decoded.email
      });

      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        console.log('User not found for ID:', decoded.id);
        return res.status(401).json({ message: 'User not found' });
      }

      console.log('User found:', { 
        id: user._id,
        email: user.email,
        role: user.role 
      });

      req.user = user;
      next();
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError.message);
      return res.status(401).json({ 
        message: 'Token is not valid', 
        error: jwtError.message 
      });
    }
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    return res.status(500).json({ 
      message: 'Server error during authentication', 
      error: err.message 
    });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Admin access required' });
  }
};

module.exports = { auth, admin };

// const jwt = require('jsonwebtoken');
// const User = require('../models/userModel');

// const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-key-make-this-long-and-secure-123';

// exports.auth = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({ message: 'No token provided' });
//     }

//     const token = authHeader.split(' ')[1];
//     const decoded = jwt.verify(token, JWT_SECRET);
//     req.user = await User.findById(decoded.id).select('-password');

//     if (!req.user) {
//       return res.status(401).json({ message: 'Invalid token user' });
//     }

//     next();
//   } catch (error) {
//     console.error('Auth middleware error:', error);
//     res.status(401).json({ message: 'Invalid or expired token' });
//   }
// };

// // Admin middleware
// exports.admin = (req, res, next) => {
//   if (req.user && req.user.role === 'admin') next();
//   else res.status(403).json({ message: 'Admin access denied' });
// };
