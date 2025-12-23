#!/usr/bin/env node

try {
  // Suppress dotenv output
  process.env.DOTENV_SILENT = 'true';
  
  console.log('🔍 Debug: Starting server...');
  console.log('🔍 Current directory:', process.cwd());
  console.log('🔍 Node version:', process.version);

  require('dotenv').config({ silent: true });
  console.log('✅ Dotenv loaded');

  const express = require('express');
  const cors = require('cors');
  const mongoose = require('mongoose');
  
  console.log('✅ Core modules loaded');

  const logger = require('./utils/logger');
  console.log('✅ Logger loaded');

  const { swaggerUi, swaggerSpec } = require('./swagger');
  console.log('✅ Swagger loaded');

  const connectDB = require('./connection');
  console.log('✅ DB connection loaded');

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
  
  console.log('✅ All routes loaded');

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
  
  console.log('✅ Security middleware loaded');

  const app = express();
  console.log('✅ Express app created');

  app.use(securityHeaders);
  app.use(securityLogger);
  app.use(cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'https://zarrin-blogs-frontend.vercel.app',
      process.env.CORS_ORIGIN || '*'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  
  console.log('✅ CORS configured');

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));
  app.use(preventParameterPollution);
  app.use(generalLimiter);
  app.use(writeLimiter);

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      persistAuthorization: true
    }
  }));

  const PORT = process.env.PORT || 8200;

  app.use('/api/auth', authLimiter, authRoutes);
  app.use('/api/blogs', blogRoutes);
  app.use('/api/search', searchLimiter, searchRoutes);
  app.use('/api/upload', uploadLimiter, uploadRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/contact', contactRoutes);
  app.use('/api/stats', statsRoutes);
  app.use('/api/comments', commentsRoutes);
  app.use('/api/likes', likesRoutes);
  app.use('/api/bookmarks', bookmarksRoutes);
  app.use('/api/trending', trendingRoutes);
  app.use('/api/related', relatedRoutes);
  app.use('/api/users', usersRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/reading-progress', readingProgressRoutes);

  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use((req, res) => {
    res.status(404).json({ error: 'API route not found' });
  });

  app.use(errorHandler);

  console.log('✅ All routes and middleware configured');

  const startServer = async () => {
    try {
      console.log('🔗 Connecting to MongoDB...');
      await connectDB();
      console.log('✅ MongoDB connected');
      
      app.listen(PORT, () => {
        logger.info('✅ Backend API running', {
          url: `http://localhost:${PORT}`,
          mongoState: mongoose.connection.readyState,
          environment: process.env.NODE_ENV || 'development',
        });
        console.log(`✅ Server listening on port ${PORT}`);
      });
    } catch (error) {
      console.error('❌ Failed to start server:', error.message);
      console.error('Stack:', error.stack);
      process.exit(1);
    }
  };

  startServer();

} catch (error) {
  console.error('❌ FATAL ERROR:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}
