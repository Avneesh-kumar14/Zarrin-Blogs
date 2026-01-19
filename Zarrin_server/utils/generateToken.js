


const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'makeityourown';

const generateToken = (user) => {
  try {
    if (!user || !user._id) throw new Error('User object missing');
    
    const payload = { id: user._id.toString(), role: user.role || 'user', email: user.email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    return token;
  } catch (error) {
    console.error('Token generation error:', error);
    throw new Error('Failed to generate token');
  }
};

module.exports = generateToken;
