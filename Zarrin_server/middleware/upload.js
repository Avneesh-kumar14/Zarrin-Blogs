const multer = require('multer');
const path = require('path');

// Configure multer for memory storage (we'll upload to Cloudinary)
const storage = multer.memoryStorage();

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  // Allowed image types
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/octet-stream'];
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  
  // Check MIME type or file extension
  const ext = file.originalname.toLowerCase().slice(file.originalname.lastIndexOf('.'));
  
  if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Only image files are allowed. Received: ${file.mimetype}`), false);
  }
};

// Create multer instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit per file
  }
});

module.exports = upload;
