const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Validate Cloudinary credentials
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.warn('[⚠️ CLOUDINARY] Warning: Cloudinary credentials not fully configured in .env');
  console.warn('[⚠️ CLOUDINARY] Required: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
} else {
  console.log('[✅ CLOUDINARY] Credentials validated');
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log('[INFO] Cloudinary config status:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? '✅' : '❌',
  api_key: process.env.CLOUDINARY_API_KEY ? '✅' : '❌',
  api_secret: process.env.CLOUDINARY_API_SECRET ? '✅' : '❌'
});

// Upload file to Cloudinary
const uploadToCloudinary = async (fileBuffer, fileName, folder = 'zarrin_blogs') => {
  return new Promise((resolve, reject) => {
    // Check if credentials are configured
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      return reject(new Error('Cloudinary cloud name not configured'));
    }

    // Handle HEIC/HEIF files - convert them during upload
    const uploadOptions = {
      resource_type: 'auto',
      public_id: `${folder}/${Date.now()}-${fileName}`,
      folder: folder,
      quality: 'auto',
      fetch_format: 'auto' // Auto-convert HEIC to jpg/webp if needed
    };

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error('[❌ CLOUDINARY] Upload error:', error);
          reject(new Error(`Upload failed: ${error.message}`));
        } else {
          console.log('[✅ CLOUDINARY] File uploaded:', result.secure_url);
          resolve(result);
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};

// Delete file from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log('File deleted from Cloudinary:', publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error;
  }
};

// Convert Cloudinary URL to proxy URL to avoid tracking prevention warnings
const getProxyUrl = (cloudinaryUrl) => {
  // Just return the Cloudinary URL directly - CORS is already configured
  // The tracking prevention warning is just a console warning, not a blocker
  return cloudinaryUrl;
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
  cloudinary,
  getProxyUrl};