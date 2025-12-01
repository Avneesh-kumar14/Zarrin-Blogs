

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

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

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'https://zarrin-blogs-frontend.vercel.app',
    process.env.CORS_ORIGIN || '*'
  ],
  credentials: true
}));
app.use(express.json());

const PORT = process.env.PORT || 8200;

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/likes', likesRoutes);
app.use('/api/bookmarks', bookmarksRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/trending', trendingRoutes);
app.use('/api/related', relatedRoutes);
app.use('/api/users', usersRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Catch-all 404 handler for unknown API routes
app.use((req, res) => {
    res.status(404).json({ error: 'API route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : undefined
  });
});

// Connect to MongoDB before starting the server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ Backend API running on http://localhost:${PORT}`);
      console.log('📊 MongoDB Connection State:', mongoose.connection.readyState);
      console.log('🔧 Environment:', process.env.NODE_ENV || 'development');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
