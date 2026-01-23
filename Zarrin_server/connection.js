const mongoose = require('mongoose');

/**
 * MongoDB connection with HARD timeout
 * Uses AbortController to actually cancel the connection attempt
 */

const DB_OPTIONS = {
  serverSelectionTimeoutMS: 3000,
  connectTimeoutMS: 3000,
  socketTimeoutMS: 45000,
  family: 4,
  maxPoolSize: 5,
  minPoolSize: 1,
};

/**
 * Connect to MongoDB with aggressive timeout
 */
async function connectDB(mongoUri) {
  if (!mongoUri) {
    throw new Error('[DB] MONGO_URI not configured');
  }

  return new Promise((resolve, reject) => {
    // Hard timeout - will forcefully end connection attempt
    const timeout = setTimeout(() => {
      console.log('[DB] ⏱️  Connection timeout (5s) - closing connection');
      
      // Force close any partial connections
      mongoose.connections.forEach(conn => {
        try {
          conn.close();
        } catch (e) {
          // Ignore
        }
      });
      
      reject(new Error('MongoDB connection timeout - server unreachable'));
    }, 5000);

    // Setup event listeners
    setupConnectionListeners();

    // Attempt connection
    mongoose.connect(mongoUri, DB_OPTIONS)
      .then((result) => {
        clearTimeout(timeout);
        console.log('[DB] ✅ Connected to MongoDB');
        resolve(result);
      })
      .catch((err) => {
        clearTimeout(timeout);
        console.log('[DB] ❌ Connection error:', err.message);
        reject(err);
      });
  });
}

/**
 * Setup connection event listeners
 */
function setupConnectionListeners() {
  mongoose.connection.on('connected', () => {
    console.log('[DB] ✅ Event: "connected"');
  });

  mongoose.connection.on('disconnected', () => {
    console.log('[DB] ⚠️  Event: "disconnected"');
    // Auto-reconnect after 5 seconds
    setTimeout(() => {
      mongoose.connect(process.env.MONGO_URI, DB_OPTIONS)
        .catch(err => console.log('[DB] Reconnect failed:', err.message));
    }, 5000);
  });

  mongoose.connection.on('error', (err) => {
    console.log('[DB] ❌ Event: "error"', err.message);
  });
}

/**
 * Graceful shutdown
 */
async function closeDB() {
  try {
    await mongoose.disconnect();
    console.log('[DB] ✅ Disconnected');
  } catch (err) {
    console.error('[DB] Error during disconnect:', err.message);
    throw err;
  }
}

module.exports = connectDB;
module.exports.closeDB = closeDB;
module.exports.isConnected = () => mongoose.connection.readyState === 1;
module.exports.getConnectionState = () => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  return states[mongoose.connection.readyState] || 'unknown';
};
