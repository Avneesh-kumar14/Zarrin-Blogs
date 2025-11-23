const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload file to Cloudinary
const uploadToCloudinary = async (fileBuffer, fileName) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        public_id: `zarrin_blogs/${Date.now()}-${fileName}`,
        folder: 'zarrin_blogs'
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(new Error(`Upload failed: ${error.message}`));
        } else {
          console.log('File uploaded to Cloudinary:', result.secure_url);
          resolve(result.secure_url);
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

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
  cloudinary
};
