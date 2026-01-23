const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing MongoDB connection...');
console.log('URI:', process.env.MONGO_URI?.substring(0, 50) + '...');

const timeout = setTimeout(() => {
  console.log('⏱️  TIMEOUT after 5 seconds - Mongoose is hanging');
  process.exit(1);
}, 5000);

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 3000,
  socketTimeoutMS: 3000,
  connectTimeoutMS: 3000,
  maxPoolSize: 1,
  family: 4
})
.then(conn => {
  clearTimeout(timeout);
  console.log('✅ Connected:', conn.connection.host);
  mongoose.connection.close();
  process.exit(0);
})
.catch(err => {
  clearTimeout(timeout);
  console.log('❌ Error:', err.message);
  process.exit(1);
});
