const multer = require('multer');
const path = require('path');

// Configure multer for memory storage (we'll upload to Cloudinary)
const storage = multer.memoryStorage();

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  // Allowed image types (including HEIC/HEIF)
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/heic',
    'image/heif',
    'image/x-heic',
    'image/x-heif',
    'application/octet-stream' // Fallback for some HEIC uploads
  ];
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.heic', '.heif'];
  
  // Check MIME type or file extension
  const ext = file.originalname.toLowerCase().slice(file.originalname.lastIndexOf('.'));
  
  if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Only image files are allowed. Received: ${file.mimetype}`), false);
  }
};

// Create multer instance with enhanced configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per file (increased from 5MB for safety)
    fields: 10,
    files: 20  // Allow up to 20 files in a batch
  },
  onError: (err, next) => {
    console.error('Multer error:', err);
    next(err);
  }
});

module.exports = upload;
module.exports.uploadMulter = upload;
