// const jwt = require('jsonwebtoken');

// // Use the same secret key as in auth middleware
// const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-key-make-this-long-and-secure-123';

// const generateToken = (user) => {
//     try {
//         if (!user || !user._id) {
//             console.error('Invalid user object:', user);
//             throw new Error('Valid user object is required for token generation');
//         }

//         const payload = {
//             id: user._id.toString(),
//             role: user.role || 'user',
//             email: user.email
//         };

//         console.log('Generating token for user:', {
//             id: payload.id,
//             email: payload.email,
//             role: payload.role
//         });

//         const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
        
//         if (!token) {
//             throw new Error('Token generation failed');
//         }

//         console.log('Token generated successfully');
//         return token;
    
//     console.log('Token generated successfully');
//     return token;
//   } catch (error) {
//     console.error('Token generation error:', error);
//     throw new Error('Failed to generate authentication token');
//   }
// };

// module.exports = generateToken;


const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-key-make-this-long-and-secure-123';

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
