

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

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
  credentials: true
}));
app.use(express.json());

const PORT = process.env.PORT || 8200;

app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/upload', uploadRoutes);



// Catch-all 404 handler for unknown API routes
app.use('/api', (req, res) => {
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
    await connectDB(); // Call the connectDB function
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log('MongoDB Connection State:', mongoose.connection.readyState);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;

