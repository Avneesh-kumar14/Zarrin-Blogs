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
    const imageUrl = await uploadToCloudinary(req.file.buffer, req.file.originalname);
    
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
      uploadToCloudinary(file.buffer, file.originalname)
    );

    const imageUrls = await Promise.all(uploadPromises);

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

module.exports = router;
