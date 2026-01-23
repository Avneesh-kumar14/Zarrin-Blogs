#!/usr/bin/env node

// Global error handlers - prevent process crash
process.on('unhandledRejection', (reason, promise) => {
  console.error('[FATAL] Unhandled Promise Rejection:', reason);
  console.error('Promise:', promise);
});

process.on('uncaughtException', (error) => {
  console.error('[FATAL] Uncaught Exception:', error.message);
  console.error('Stack:', error.stack);
  // Don't exit - let server continue running
});

try {
  console.log('[STARTUP] Initializing server...');

  // Load environment variables with error handling
  const result = require('dotenv').config();
  if (result.error) {
    console.warn('[⚠️ DOTENV] Warning: Could not read .env file:', result.error.message);
  } else {
    console.log('[✅ DOTENV] Environment variables loaded successfully');
    console.log('[INFO] Loaded variables count:', Object.keys(result.parsed || {}).length);
  }

  // Verify critical environment variables
  const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET', 'PORT'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  if (missingVars.length > 0) {
    console.error('❌ CRITICAL: Missing environment variables:', missingVars);
    console.error('Please ensure .env file contains:', missingVars.join(', '));
    process.exit(1);
  }

  console.log('[✅ ENV VALIDATION] All critical environment variables are present');
  console.log('[INFO] Environment:', {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI ? '✅ Set' : '❌ Missing',
    JWT_SECRET: process.env.JWT_SECRET ? '✅ Set' : '❌ Missing',
    NODE_ENV: process.env.NODE_ENV || 'development'
  });

  // Require all dependencies INSIDE the try block
  const express = require('express');
  const cors = require('cors');
  const mongoose = require('mongoose');
  const http = require('http');
  const socketIO = require('socket.io');

  console.log('[STARTUP] Core modules loaded');

  const logger = require('./utils/logger');
  const { swaggerUi, swaggerSpec } = require('./swagger');
  const connectDB = require('./connection');
  const SocketHandler = require('./services/socketHandler');

  console.log('[STARTUP] Database and Socket.IO loaded');

  // Load all routes
  const authRoutes = require('./routes/auth');
  const blogRoutes = require('./routes/blog');
  const categoryRoutes = require('./routes/category');
  const contactRoutes = require('./routes/contact');
  const statsRoutes = require('./routes/stats');
  const uploadRoutes = require('./routes/upload');
  const commentsRoutes = require('./routes/comments');
  const likesRoutes = require('./routes/likes');
  const bookmarksRoutes = require('./routes/bookmarks');
  const searchRoutes = require('./routes/search');
  const trendingRoutes = require('./routes/trending');
  const relatedRoutes = require('./routes/related');
  const usersRoutes = require('./routes/users');
  const adminRoutes = require('./routes/admin');
  const readingProgressRoutes = require('./routes/readingProgress');
  const settingsRoutes = require('./routes/settings');
  const notificationsRoutes = require('./routes/notifications');
  const chatRoutes = require('./routes/chat');

  console.log('[STARTUP] All routes loaded');

  // Security middleware
  const {
    securityHeaders,
    generalLimiter,
    authLimiter,
    searchLimiter,
    uploadLimiter,
    writeLimiter,
    errorHandler,
    validateCORS,
    preventParameterPollution,
    securityLogger
  } = require('./middleware/security');

  console.log('[STARTUP] Security middleware loaded');

  // Create Express app
  const app = express();
  console.log('[STARTUP] Express app created');

  // ✅ SECURITY MIDDLEWARE STACK (Applied in order)

  // 1. Security Headers (Helmet.js)
  app.use(securityHeaders);

  // 2. Security Logging
  app.use(securityLogger);

  // 3. CORS Protection - Fixed configuration
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'https://zarrin-blogs-frontend.vercel.app',
    process.env.CORS_ORIGIN
  ].filter(Boolean);

  app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  console.log('[STARTUP] CORS configured');

  // 4. Body Parser (JSON)
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  // 5. File Upload Middleware (Multer)
  const multer = require('multer');
  const generalUpload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB
    },
    fileFilter: (req, file, cb) => {
      // Allow only image files
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed'));
      }
    }
  });

  // Apply multer to general upload route (chat uploads will be handled in their route)
  app.use('/api/upload', generalUpload.single('image'));

  // 6. Parameter Pollution Prevention
  app.use(preventParameterPollution);

  // 7. General Rate Limiter (applies to all requests)
  app.use(generalLimiter);

  // 8. Write Operations Rate Limiter
  app.use(writeLimiter);

  console.log('[STARTUP] Middleware configured');

  // ✅ SWAGGER API DOCUMENTATION
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      persistAuthorization: true
    }
  }));

  const PORT = process.env.PORT || 8200;

  // ✅ API ROUTES with specific rate limiters

  // Auth routes - rate limiting applied per endpoint, not globally
  app.use('/api/auth', authRoutes);

  // Blog routes
  app.use('/api/blogs', blogRoutes);

  // Search routes with rate limiting
  app.use('/api/search', searchLimiter, searchRoutes);

  // Upload routes with rate limiting
  app.use('/api/upload', uploadLimiter, uploadRoutes);

  // Other routes
  app.use('/api/categories', categoryRoutes);
  app.use('/api/contact', contactRoutes);
  app.use('/api/stats', statsRoutes);
  app.use('/api/comments', commentsRoutes);
  app.use('/api/likes', likesRoutes);
  app.use('/api/bookmarks', bookmarksRoutes);
  app.use('/api/trending', trendingRoutes);
  app.use('/api/related', relatedRoutes);
  app.use('/api/users', usersRoutes);

  // ✅ Admin routes (protected by auth middleware)
  app.use('/api/admin', adminRoutes);

  // ✅ Settings routes (protected by auth middleware)
  app.use('/api/settings', settingsRoutes);

  // ✅ Notifications routes (protected by auth middleware)
  app.use('/api/notifications', notificationsRoutes);

  // ✅ Chat routes (protected by auth middleware)
  app.use('/api/chat', chatRoutes);

  // ✅ Reading Progress routes (protected by auth middleware)
  app.use('/api/reading-progress', readingProgressRoutes);

  // ✅ Professional Health Check Endpoint (For K8s / Load Balancers / Monitoring)
  app.get('/health', (req, res) => {
    const connectDB = require('./connection');
    const dbState = connectDB.getConnectionState();
    const isHealthy = dbState === 'connected';
    
    const response = {
      status: isHealthy ? 'UP' : 'DEGRADED',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: {
        state: dbState,
        connected: dbState === 'connected'
      },
      memory: process.memoryUsage()
    };
    
    // Return 200 if healthy, 503 if DB is down
    res.status(isHealthy ? 200 : 503).json(response);
  });

  // Catch-all 404 handler for unknown API routes
  app.use((req, res) => {
    res.status(404).json({ error: 'API route not found' });
  });

  // ✅ GLOBAL ERROR HANDLER (Must be last)
  app.use(errorHandler);

  console.log('[STARTUP] All routes and middleware configured');

  // Development-First Startup (Start server, connect to DB async)
  const startServer = async () => {
    try {
      console.log('[STARTUP] Starting server...');
      
      let mongoConnected = false;
      
      // Attempt MongoDB connection asynchronously (don't block startup)
      setImmediate(() => {
        console.log('[STARTUP] [Async] Attempting MongoDB connection...');
        
        try {
          connectDB(process.env.MONGO_URI)
            .then(() => {
              mongoConnected = true;
              console.log('[DB] ✅ MongoDB now available');
              
              // Load models now that DB is connected
              try {
                console.log('[MODELS] Loading models...');
                require('./models/userModel');
                require('./models/blog');
                require('./models/comment');
                require('./models/like');
                require('./models/bookmark');
                require('./models/conversation');
                require('./models/message');
                require('./models/chatActivity');
                require('./models/notification');
                require('./models/image');
                require('./models/blogCategory');
                require('./models/contact');
                require('./models/readingProgress');
                console.log('[MODELS] ✅ All models loaded and registered');
              } catch (err) {
                console.error('[MODELS] ⚠️  Failed to load models:', err.message);
              }
            })
            .catch((err) => {
              console.log('[DB] ⚠️  MongoDB unavailable:', err.message);
              console.log('[DB] Running in OFFLINE mode');
            });
        } catch (err) {
          console.error('[DB] ❌ Unexpected error during async connection:', err.message);
        }
      });
      
      // Create HTTP server for Socket.IO  (Start immediately)
      const server = http.createServer(app);
      console.log('[SERVER] HTTP server created');

      // Initialize Socket.IO with CORS and connection settings
      const io = socketIO(server, {
        cors: {
          origin: allowedOrigins,
          credentials: true,
          methods: ['GET', 'POST', 'PUT', 'DELETE']
        },
        transports: ['websocket', 'polling'],
        pingInterval: 25000,
        pingTimeout: 60000,
        maxHttpBufferSize: 1e6,
        path: '/socket.io'
      });

      // Initialize Socket handlers with the /chat namespace
      try {
        new SocketHandler(io);
        console.log('[SOCKET.IO] ✅ Socket.IO initialized');
      } catch (socketError) {
        console.error('[SOCKET.IO] ⚠️  Error:', socketError.message);
      }

      // Start the server IMMEDIATELY (don't wait for MongoDB)
      server.listen(PORT, () => {
        console.log('\n' + '='.repeat(70));
        console.log('✅ BACKEND SERVER STARTED SUCCESSFULLY');
        console.log('='.repeat(70));
        
        const status = {
          url: `http://localhost:${PORT}`,
          apiDocs: `http://localhost:${PORT}/api-docs`,
          socketIO: `ws://localhost:${PORT}/chat`,
          health: `http://localhost:${PORT}/health`,
          environment: process.env.NODE_ENV || 'development',
          timestamp: new Date().toISOString()
        };
        
        logger.info('✅ Backend API running', status);
        console.log('📱 Frontend: http://localhost:3000');
        console.log('📚 API Docs:', status.apiDocs);
        console.log('💬 WebSocket:', status.socketIO);
        console.log('🏥 Health Check:', status.health);
        console.log('🌍 Environment:', status.environment);
        console.log('='.repeat(70) + '\n');
        console.log('ℹ️  Connecting to MongoDB asynchronously...\n');
      });

      // Graceful shutdown handler
      process.on('SIGTERM', () => {
        console.log('[SHUTDOWN] SIGTERM signal received: closing HTTP server');
        server.close(() => {
          console.log('[SHUTDOWN] HTTP server closed');
          if (mongoConnected) {
            require('./connection').closeDB().then(() => {
              console.log('[SHUTDOWN] MongoDB connection closed');
              process.exit(0);
            }).catch(err => {
              console.error('[SHUTDOWN] Error closing DB:', err.message);
              process.exit(1);
            });
          } else {
            process.exit(0);
          }
        });
      });

      process.on('SIGINT', () => {
        console.log('[SHUTDOWN] SIGINT signal received: closing HTTP server');
        server.close(() => {
          console.log('[SHUTDOWN] HTTP server closed');
          if (mongoConnected) {
            require('./connection').closeDB().then(() => {
              console.log('[SHUTDOWN] MongoDB connection closed');
              process.exit(0);
            }).catch(err => {
              console.error('[SHUTDOWN] Error closing DB:', err.message);
              process.exit(1);
            });
          } else {
            process.exit(0);
          }
        });
      });

    } catch (error) {
      console.error('\n❌ FATAL: Failed to start server');
      console.error('Error:', error.message);
      
      if (logger) {
        logger.error('Server startup failed', { error: error.message });
      }
      
      process.exit(1);
    }
  };

  // Start the server
  startServer();

} catch (error) {
  console.error('❌ FATAL ERROR during server initialization');
  console.error('Error message:', error.message);
  console.error('Error stack:', error.stack);
  process.exit(1);
}

// Note: app is defined inside try block, so we don't export it from this entry point
// For imports, create a separate exports.js if needed
