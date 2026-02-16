


const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'makeityourown';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refresh-key-makeityourown';

const generateToken = (user) => {
  try {
    if (!user || !user._id) throw new Error('User object missing');
    
    const payload = { id: user._id.toString(), role: user.role || 'user', email: user.email };
    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    return accessToken;
  } catch (error) {
    console.error('Token generation error:', error);
    throw new Error('Failed to generate token');
  }
};

const generateTokenPair = (user) => {
  try {
    if (!user || !user._id) throw new Error('User object missing');
    
    const payload = { id: user._id.toString(), role: user.role || 'user', email: user.email };
    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
    const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: '30d' });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error('Token generation error:', error);
    throw new Error('Failed to generate token');
  }
};

module.exports = generateToken;
module.exports.generateTokenPair = generateTokenPair;
module.exports.JWT_SECRET = JWT_SECRET;
module.exports.REFRESH_SECRET = REFRESH_SECRET;
