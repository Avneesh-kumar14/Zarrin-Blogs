const express = require('express');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { uploadToCloudinary } = require('../utils/cloudinary');

const router = express.Router();

// Custom error handler for multer
const handleUploadError = (err, req, res, next) => {
  if (err) {
    console.error('Multer error:', err);
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large', error: err.message });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ message: 'Too many files', error: err.message });
    }
    if (err.message && err.message.includes('Unexpected end of form')) {
      return res.status(400).json({ message: 'Form upload incomplete - malformed request', error: err.message });
    }
    return res.status(400).json({ message: 'File upload error', error: err.message });
  }
  next();
};

// Upload single image
router.post('/upload', auth, (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Upload middleware error:', err);
      if (err.message && err.message.includes('Unexpected end of form')) {
        return res.status(400).json({ 
          success: false,
          message: 'Invalid file upload - please try again', 
          error: 'Malformed form data' 
        });
      }
      return res.status(400).json({ 
        success: false,
        message: 'File upload failed', 
        error: err.message 
      });
    }
    next();
  });
}, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    console.log('📸 Uploading file:', req.file.originalname, 'Size:', req.file.size);
    
    // Validate file exists and has data
    if (!req.file.buffer || req.file.buffer.length === 0) {
      throw new Error('File buffer is empty');
    }
    
    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, req.file.originalname, 'zarrin_blogs/photos');
    const imageUrl = typeof result === 'string' ? result : result.secure_url;
    
    if (!imageUrl) {
      throw new Error('No URL returned from Cloudinary');
    }
    
    res.status(200).json({
      success: true,
      url: imageUrl,
      message: 'Image uploaded successfully'
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to upload image', 
      error: err.message 
    });
  }
});

// Upload multiple images
router.post('/upload-multiple', auth, (req, res, next) => {
  upload.array('images', 10)(req, res, (err) => {
    if (err) {
      console.error('Upload middleware error:', err);
      return res.status(400).json({ 
        success: false,
        message: 'Batch upload failed', 
        error: err.message 
      });
    }
    next();
  });
}, async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No image files provided' });
    }

    console.log(`📸 Uploading ${req.files.length} files`);

    // Upload all files to Cloudinary
    const uploadPromises = req.files.map(file => {
      if (!file.buffer || file.buffer.length === 0) {
        return Promise.reject(new Error(`${file.originalname} has empty buffer`));
      }
      return uploadToCloudinary(file.buffer, file.originalname, 'zarrin_blogs/photos');
    });

    const results = await Promise.all(uploadPromises);
    const imageUrls = results.map(result => typeof result === 'string' ? result : result.secure_url);

    if (imageUrls.length === 0) {
      throw new Error('No images uploaded successfully');
    }

    res.status(200).json({
      success: true,
      urls: imageUrls,
      message: `${imageUrls.length} images uploaded successfully`
    });
  } catch (err) {
    console.error('Batch upload error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to upload images', 
      error: err.message 
    });
  }
});

// Proxy endpoint for Cloudinary images (avoids tracking prevention warnings)
// Usage: /api/upload/proxy?url=<cloudinary-url>
router.get('/proxy', async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url || !url.includes('res.cloudinary.com')) {
      return res.status(400).json({ 
        error: 'Invalid Cloudinary URL' 
      });
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      return res.status(response.status).json({ 
        error: 'Failed to fetch image from Cloudinary' 
      });
    }

    // Set proper headers to avoid tracking prevention
    res.set('Content-Type', response.headers.get('content-type'));
    res.set('Cache-Control', 'public, max-age=31536000'); // 1 year cache
    res.set('Access-Control-Allow-Origin', '*');
    
    // Pipe the response
    response.body.pipe(res);
  } catch (err) {
    console.error('Image proxy error:', err);
    res.status(500).json({ 
      error: 'Failed to proxy image', 
      message: err.message 
    });
  }
});

module.exports = router;
