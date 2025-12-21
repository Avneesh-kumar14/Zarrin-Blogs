console.log('1. Env config');
require('dotenv').config();

console.log('2. Dependencies');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

console.log('3. Utils');
const logger = require('./utils/logger');
const { swaggerUi, swaggerSpec } = require('./swagger');
const connectDB = require('./connection');

console.log('4. Routes - testing one by one');
try {
  const authRoutes = require('./routes/auth');
  console.log('Auth routes loaded');
} catch(e) { console.error('Auth error:', e.message); }

try {
  const blogRoutes = require('./routes/blog');
  console.log('Blog routes loaded');
} catch(e) { console.error('Blog error:', e.message); }

try {
  const categoryRoutes = require('./routes/category');
  console.log('Category routes loaded');
} catch(e) { console.error('Category error:', e.message); }

try {
  const contactRoutes = require('./routes/contact');
  console.log('Contact routes loaded');
} catch(e) { console.error('Contact error:', e.message); }

try {
  const statsRoutes = require('./routes/stats');
  console.log('Stats routes loaded');
} catch(e) { console.error('Stats error:', e.message); }

try {
  const uploadRoutes = require('./routes/upload');
  console.log('Upload routes loaded');
} catch(e) { console.error('Upload error:', e.message); }

try {
  const commentsRoutes = require('./routes/comments');
  console.log('Comments routes loaded');
} catch(e) { console.error('Comments error:', e.message); }

try {
  const likesRoutes = require('./routes/likes');
  console.log('Likes routes loaded');
} catch(e) { console.error('Likes error:', e.message); }

try {
  const bookmarksRoutes = require('./routes/bookmarks');
  console.log('Bookmarks routes loaded');
} catch(e) { console.error('Bookmarks error:', e.message); }

try {
  const searchRoutes = require('./routes/search');
  console.log('Search routes loaded');
} catch(e) { console.error('Search error:', e.message); }

try {
  const trendingRoutes = require('./routes/trending');
  console.log('Trending routes loaded');
} catch(e) { console.error('Trending error:', e.message); }

try {
  const relatedRoutes = require('./routes/related');
  console.log('Related routes loaded');
} catch(e) { console.error('Related error:', e.message); }

try {
  const usersRoutes = require('./routes/users');
  console.log('Users routes loaded');
} catch(e) { console.error('Users error:', e.message); }

try {
  const adminRoutes = require('./routes/admin');
  console.log('Admin routes loaded');
} catch(e) { console.error('Admin error:', e.message); }

try {
  const readingProgressRoutes = require('./routes/readingProgress');
  console.log('ReadingProgress routes loaded');
} catch(e) { console.error('ReadingProgress error:', e.message); }

console.log('5. All route tests complete');


