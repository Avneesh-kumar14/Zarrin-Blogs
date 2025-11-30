const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Test Cloudinary Connection
const testCloudinaryConnection = async () => {
  try {
    console.log('🔗 Testing Cloudinary Connection...');
    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary Connected Successfully!');
    console.log('   Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
    return true;
  } catch (error) {
    console.error('❌ Cloudinary Connection Failed:', error.message);
    return false;
  }
};

// Test MongoDB Connection
const testMongoDBConnection = async () => {
  try {
    console.log('🔗 Testing MongoDB Connection...');
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ MongoDB Connected Successfully!');
    console.log('   Database:', mongoose.connection.name);
    return true;
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error.message);
    return false;
  }
};

// Upload images from local assets to Cloudinary
const uploadAssetsToCloudinary = async () => {
  const assetsPath = path.join(__dirname, '../zarrin_blogs/public/Assets');
  
  if (!fs.existsSync(assetsPath)) {
    console.error('❌ Assets folder not found at:', assetsPath);
    return [];
  }

  const files = fs.readdirSync(assetsPath);
  const uploadedUrls = {};

  console.log(`\n📤 Found ${files.length} images. Starting upload...\n`);

  for (const file of files) {
    try {
      const filePath = path.join(assetsPath, file);
      const fileBuffer = fs.readFileSync(filePath);
      
      console.log(`⏳ Uploading: ${file}...`);
      
      const result = await cloudinary.uploader.upload(filePath, {
        public_id: `zarrin_blogs_assets/${path.parse(file).name}`,
        folder: 'zarrin_blogs_assets',
        overwrite: true,
        resource_type: 'auto'
      });

      uploadedUrls[file] = result.secure_url;
      console.log(`✅ ${file} → ${result.secure_url}\n`);
    } catch (error) {
      console.error(`❌ Failed to upload ${file}: ${error.message}\n`);
    }
  }

  return uploadedUrls;
};

// Generate URLs reference file
const generateUrlsFile = (uploadedUrls) => {
  const content = `// Cloudinary URLs for all asset images
// Generated on: ${new Date().toISOString()}

const CLOUDINARY_ASSETS = {
${Object.entries(uploadedUrls)
  .map(([filename, url]) => `  '${filename}': '${url}',`)
  .join('\n')}
};

// Usage in React:
// <img src={CLOUDINARY_ASSETS['beach.png']} alt="Beach" />

module.exports = CLOUDINARY_ASSETS;
`;

  const outputPath = path.join(__dirname, '../zarrin_blogs/src/utils/cloudinaryAssets.js');
  fs.writeFileSync(outputPath, content);
  console.log(`\n📝 Generated: ${outputPath}`);
};

// Main execution
const main = async () => {
  console.log('========================================');
  console.log('  🚀 Zarrin Blogs - Connection Tester');
  console.log('========================================\n');

  // Test Cloudinary
  const cloudinaryOk = await testCloudinaryConnection();
  
  // Test MongoDB
  const mongodbOk = await testMongoDBConnection();

  if (!cloudinaryOk || !mongodbOk) {
    console.error('\n❌ Connection tests failed. Please check your .env file.');
    process.exit(1);
  }

  console.log('\n✅ All connections successful!\n');

  // Upload images
  const uploadedUrls = await uploadAssetsToCloudinary();

  if (Object.keys(uploadedUrls).length > 0) {
    generateUrlsFile(uploadedUrls);
    console.log('\n========================================');
    console.log('  ✅ Upload Summary');
    console.log('========================================');
    console.log(`Total uploaded: ${Object.keys(uploadedUrls).length}`);
    console.log('\n📋 Image URLs:');
    Object.entries(uploadedUrls).forEach(([name, url]) => {
      console.log(`   ${name}: ${url}`);
    });
  }

  // Disconnect MongoDB
  await mongoose.disconnect();
  console.log('\n✅ All done! Database disconnected.');
  process.exit(0);
};

// Run
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
