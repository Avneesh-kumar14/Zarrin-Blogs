console.log('[STARTUP] Initializing server...');
require('dotenv').config({ quiet: true });

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const logger = require('./utils/logger');
const { swaggerUi, swaggerSpec } = require('./swagger');
const connectDB = require('./connection');
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

const app = express();

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

// 4. Body Parser (JSON)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// 5. Parameter Pollution Prevention
app.use(preventParameterPollution);

// 6. General Rate Limiter (applies to all requests)
app.use(generalLimiter);

// 7. Write Operations Rate Limiter
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

// ✅ Reading Progress routes (protected by auth middleware)
app.use('/api/reading-progress', readingProgressRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Catch-all 404 handler for unknown API routes
app.use((req, res) => {
    res.status(404).json({ error: 'API route not found' });
});

// ✅ GLOBAL ERROR HANDLER (Must be last)
app.use(errorHandler);

// Connect to MongoDB before starting the server
const startServer = async () => {
  try {
    console.log('[DEBUG] Starting server...');
    console.log('[DEBUG] Connecting to MongoDB...');
    await connectDB();
    console.log('[DEBUG] MongoDB connected, starting Express server...');
    app.listen(PORT, () => {
      logger.info('✅ Backend API running', {
        url: `http://localhost:${PORT}`,
        mongoState: mongoose.connection.readyState,
        environment: process.env.NODE_ENV || 'development',
      });
    });
  } catch (error) {
    logger.error('❌ Failed to start server:', { error: error.message, stack: error.stack });
    process.exit(1);
  }
};

startServer();

module.exports = app;
