/**
 * Response Optimization Middleware (Node.js Backend)
 * Handles: compression, caching headers, selective field returns, ETag
 * 
 * Usage in index.js:
 * app.use(require('./middleware/responseOptimization'));
 */

const crypto = require('crypto');

/**
 * Generate ETag for response
 */
const generateETag = (data) => {
  return crypto
    .createHash('md5')
    .update(JSON.stringify(data))
    .digest('hex');
};

/**
 * Cache control middleware for different resource types
 */
const cacheControl = (req, res, next) => {
  // Set default cache headers
  const setCacheHeaders = (type = 'default') => {
    const cacheConfigs = {
      // Long-term caching for static assets
      static: 'public, max-age=31536000, immutable',
      // Cache API responses
      api: 'public, max-age=3600, must-revalidate',
      // Cache images longer
      image: 'public, max-age=2592000, immutable',
      // No cache for sensitive data
      noCache: 'private, no-cache, no-store, must-revalidate',
      // Default
      default: 'public, max-age=300, must-revalidate'
    };

    return cacheConfigs[type] || cacheConfigs.default;
  };

  // Determine resource type and set appropriate cache headers
  const path = req.path;
  
  if (path.includes('/api/users') || path.includes('/api/auth')) {
    res.setHeader('Cache-Control', setCacheHeaders('noCache'));
  } else if (path.includes('/api/blogs') || path.includes('/api/categories')) {
    res.setHeader('Cache-Control', setCacheHeaders('api'));
  } else if (path.includes('/images') || path.includes('/static')) {
    res.setHeader('Cache-Control', setCacheHeaders('static'));
  }

  // Add CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Type, ETag');

  next();
};

/**
 * ETag middleware for conditional requests
 */
const etagMiddleware = (req, res, next) => {
  const originalJson = res.json;

  res.json = function(data) {
    // Generate ETag for the response
    const etag = generateETag(data);
    
    res.setHeader('ETag', `"${etag}"`);

    // Check if client has matching ETag
    const clientEtag = req.headers['if-none-match'];
    if (clientEtag === `"${etag}"`) {
      return res.status(304).end(); // Not Modified
    }

    // Call original json method
    return originalJson.call(this, data);
  };

  next();
};

/**
 * Compression middleware (response gzip compression)
 * Note: Express usually has compression middleware, this is a reminder
 */
const compressionMiddleware = (req, res, next) => {
  // Check if client supports gzip
  const acceptEncoding = req.headers['accept-encoding'] || '';
  
  if (!acceptEncoding.includes('gzip')) {
    return next();
  }

  // Add header indicating response is gzipped
  res.setHeader('Content-Encoding', 'gzip');

  next();
};

/**
 * Pagination optimization middleware
 */
const paginationOptimization = (req, res, next) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10)); // Max 100 items

  // Store in req for use in controllers
  req.pagination = {
    page,
    limit,
    skip: (page - 1) * limit
  };

  const originalJson = res.json;

  res.json = function(data) {
    // If it's a paginated response, add pagination metadata
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      if (data.data && Array.isArray(data.data)) {
        const totalPages = data.totalItems 
          ? Math.ceil(data.totalItems / limit)
          : 1;

        data.pagination = {
          currentPage: page,
          pageSize: limit,
          totalPages,
          totalItems: data.totalItems || data.data.length,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1
        };
      }
    }

    return originalJson.call(this, data);
  };

  next();
};

/**
 * Selective field return middleware
 * Allows clients to request only specific fields
 * Usage: ?fields=id,title,description
 */
const selectiveFieldsMiddleware = (req, res, next) => {
  const fields = req.query.fields?.split(',').map(f => f.trim());

  const originalJson = res.json;

  res.json = function(data) {
    if (!fields || fields.length === 0) {
      return originalJson.call(this, data);
    }

    // Filter fields from response
    const filterFields = (obj) => {
      if (Array.isArray(obj)) {
        return obj.map(filterFields);
      }

      if (obj && typeof obj === 'object') {
        const filtered = {};
        fields.forEach(field => {
          if (field in obj) {
            filtered[field] = obj[field];
          }
        });
        return filtered;
      }

      return obj;
    };

    const filtered = filterFields(data);
    return originalJson.call(this, filtered);
  };

  next();
};

/**
 * Response time tracking middleware
 */
const responseTimingMiddleware = (req, res, next) => {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    res.setHeader('X-Response-Time', `${duration}ms`);

    // Log slow requests
    if (duration > 1000) {
      console.warn(`⚠️ Slow request: ${req.method} ${req.path} took ${duration}ms`);
    }
  });

  next();
};

/**
 * Request size limiting middleware
 */
const requestSizeLimitMiddleware = (req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    // Check Content-Length header
    const contentLength = parseInt(req.headers['content-length'] || 0);
    
    if (contentLength > 50 * 1024 * 1024) { // 50MB limit
      return res.status(413).json({
        error: 'Payload too large',
        message: 'Request body exceeds 50MB limit'
      });
    }
  }

  next();
};

/**
 * Combine all response optimization middlewares
 */
const responseOptimization = [
  requestSizeLimitMiddleware,
  responseTimingMiddleware,
  cacheControl,
  etagMiddleware,
  paginationOptimization,
  selectiveFieldsMiddleware
];

module.exports = responseOptimization;
