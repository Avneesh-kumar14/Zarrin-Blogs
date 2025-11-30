

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    // connection.js - Add connection pooling and retry logic

    dotenv.config();

    const connectDB = async () => {
      try {
        const conn = await mongoose.connect(process.env.MONGO_URL, {
          maxPoolSize: 10,
          minPoolSize: 5,
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
          retryWrites: true,
          w: 'majority'
        });
        
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        
        mongoose.connection.on('disconnected', () => console.log('⚠️ MongoDB disconnected'));
        mongoose.connection.on('reconnected', () => console.log('🔄 MongoDB reconnected'));
        mongoose.connection.on('error', (err) => console.error('❌ MongoDB Error:', err));

        return conn;
      } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
      }
    };

    module.exports = connectDB;
    
    mongoose.connection.on('disconnected', () => console.log('⚠️ MongoDB disconnected'));
    mongoose.connection.on('reconnected', () => console.log('🔄 MongoDB reconnected'));
    mongoose.connection.on('error', (err) => console.error('❌ MongoDB Error:', err));

    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
