#!/usr/bin/env node
/**
 * Environment Diagnostic Script
 * Run: node env-diagnostic.js
 * Checks all environment variables and connections
 */

const fs = require('fs');
const path = require('path');

console.log('\n' + '='.repeat(60));
console.log('🔍 ENVIRONMENT DIAGNOSTIC TOOL');
console.log('='.repeat(60) + '\n');

// 1. Check .env file exists
const envPath = path.join(__dirname, '.env');
const envExists = fs.existsSync(envPath);

console.log('1️⃣  .ENV FILE CHECK');
console.log('-'.repeat(60));
if (envExists) {
  console.log('✅ .env file exists at:', envPath);
  
  // Read .env content
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n').filter(line => line && !line.startsWith('#'));
  
  console.log(`✅ Found ${lines.length} environment variables in .env\n`);
  
  // Show masked values
  lines.forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      const maskedValue = value.length > 10 
        ? value.substring(0, 3) + '*'.repeat(Math.max(5, value.length - 6)) + value.substring(value.length - 3)
        : '*'.repeat(value.length);
      console.log(`  ${key.trim()}: ${maskedValue}`);
    }
  });
} else {
  console.log('❌ .env file NOT found at:', envPath);
  console.log('📝 Create .env file by copying .env.example\n');
  process.exit(1);
}

// 2. Load and check environment variables
console.log('\n2️⃣  ENVIRONMENT VARIABLES CHECK');
console.log('-'.repeat(60));

require('dotenv').config();

const requiredVars = [
  { name: 'PORT', default: '8200', required: true },
  { name: 'MONGO_URI', default: null, required: true },
  { name: 'JWT_SECRET', default: 'makeityourown', required: true },
  { name: 'CLOUDINARY_CLOUD_NAME', default: null, required: false },
  { name: 'CLOUDINARY_API_KEY', default: null, required: false },
  { name: 'CLOUDINARY_API_SECRET', default: null, required: false },
  { name: 'GMAIL_EMAIL', default: null, required: false },
  { name: 'GMAIL_APP_PASSWORD', default: null, required: false },
  { name: 'FRONTEND_URL', default: 'http://localhost:3000', required: false },
  { name: 'CORS_ORIGIN', default: 'http://localhost:3000', required: false }
];

let allCriticalPresent = true;

requiredVars.forEach(({ name, default: defaultVal, required }) => {
  const value = process.env[name];
  const status = value ? '✅' : '❌';
  const label = required ? '(REQUIRED)' : '(optional)';
  
  if (!value && required) {
    allCriticalPresent = false;
  }
  
  console.log(`${status} ${name.padEnd(30)} ${label}`);
  if (value) {
    const display = value.length > 20 
      ? value.substring(0, 10) + '...' 
      : value;
    console.log(`   └─ Value: ${display}`);
  } else if (defaultVal) {
    console.log(`   └─ Using default: ${defaultVal}`);
  }
});

// 3. Critical Variables Summary
console.log('\n3️⃣  CRITICAL VARIABLES SUMMARY');
console.log('-'.repeat(60));

const criticalVars = {
  'Database (MONGO_URI)': !!process.env.MONGO_URI,
  'JWT Secret (JWT_SECRET)': !!process.env.JWT_SECRET,
  'Port (PORT)': !!process.env.PORT,
};

Object.entries(criticalVars).forEach(([name, present]) => {
  const status = present ? '✅' : '❌';
  console.log(`${status} ${name}`);
});

// 4. File structure check
console.log('\n4️⃣  REQUIRED FILES CHECK');
console.log('-'.repeat(60));

const requiredFiles = [
  'index.js',
  'connection.js',
  'package.json',
  'utils/cloudinary.js',
  'services/emailService.js',
  'models/userModel.js',
  'models/conversation.js',
  'models/message.js'
];

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  const exists = fs.existsSync(filePath);
  const status = exists ? '✅' : '❌';
  console.log(`${status} ${file}`);
});

// 5. Summary and recommendations
console.log('\n5️⃣  RECOMMENDATIONS');
console.log('-'.repeat(60));

if (!allCriticalPresent) {
  console.log('❌ CRITICAL: Some required environment variables are missing!');
  console.log('\n📋 Required variables:');
  requiredVars.filter(v => v.required && !process.env[v.name]).forEach(v => {
    console.log(`  - ${v.name}`);
  });
  console.log('\n✏️  Update your .env file with these values.');
  process.exit(1);
} else {
  console.log('✅ All critical environment variables are present!');
}

// Check optional variables
const missingOptional = requiredVars.filter(v => !v.required && !process.env[v.name]);
if (missingOptional.length > 0) {
  console.log('\n⚠️  Optional variables not set (email & file upload may not work):');
  missingOptional.forEach(v => {
    console.log(`  - ${v.name}`);
  });
}

console.log('\n6️⃣  NEXT STEPS');
console.log('-'.repeat(60));
console.log('✅ To start the server, run:');
console.log('   npm start');
console.log('\n✅ To test the environment, you can also run:');
console.log('   node debug-start.js');
console.log('\n' + '='.repeat(60) + '\n');

process.exit(allCriticalPresent ? 0 : 1);
