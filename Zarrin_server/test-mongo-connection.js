#!/usr/bin/env node

const mongoose = require('mongoose');
require('dotenv').config();

console.log('[TEST] Starting MongoDB connection test...');
console.log('[TEST] MONGO_URI present:', !!process.env.MONGO_URI);
console.log('[TEST] MONGO_URI (masked):', process.env.MONGO_URI?.replace(/:[^:]*@/, ':****@'));

const connectWithTimeout = async (timeoutMs = 15000) => {
  return Promise.race([
    mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      family: 4,
      retryWrites: true,
      w: 'majority'
    }),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Connection timeout after ' + timeoutMs + 'ms')), timeoutMs)
    )
  ]);
};

(async () => {
  try {
    console.log('[TEST] Attempting to connect...');
    const conn = await connectWithTimeout(15000);
    console.log('[TEST] ✅ Connected to MongoDB');
    console.log('[TEST] Host:', conn.connection.host);
    console.log('[TEST] DB Name:', conn.connection.name);
    console.log('[TEST] Connection State:', conn.connection.readyState === 1 ? 'CONNECTED' : 'NOT CONNECTED');
    
    // Try to get collection names
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('[TEST] Collections:', collections.map(c => c.name).join(', '));
    
    await mongoose.connection.close();
    console.log('[TEST] ✅ Connection closed successfully');
    process.exit(0);
  } catch (error) {
    console.error('[TEST] ❌ Error:', error.message);
    console.error('[TEST] Stack:', error.stack);
    process.exit(1);
  }
})();
