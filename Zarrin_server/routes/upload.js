const express = require('express');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { uploadToCloudinary } = require('../utils/cloudinary');

const router = express.Router();

// Upload single image
router.post('/upload', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    console.log('Uploading file:', req.file.originalname);
    
    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, req.file.originalname, 'zarrin_blogs/photos');
    const imageUrl = typeof result === 'string' ? result : result.secure_url;
    
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
router.post('/upload-multiple', auth, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No image files provided' });
    }

    console.log(`Uploading ${req.files.length} files`);

    // Upload all files to Cloudinary
    const uploadPromises = req.files.map(file =>
      uploadToCloudinary(file.buffer, file.originalname, 'zarrin_blogs/photos')
    );

    const results = await Promise.all(uploadPromises);
    const imageUrls = results.map(result => typeof result === 'string' ? result : result.secure_url);

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
