const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Zarrin Blogs API',
      version: '1.0.0',
      description: 'Complete Blog Management Platform API - Full CRUD operations for blogs, users, comments, likes, and bookmarks',
      contact: {
        name: 'Zarrin Blogs',
        url: 'https://zarrin-blogs.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:8200',
        description: 'Development Server'
      },
      {
        url: 'https://api.zarrin-blogs.com',
        description: 'Production Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token for authentication'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'User ID' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['user', 'admin'] },
            avatar: { type: 'string' },
            bio: { type: 'string' },
            followers: { type: 'array', items: { type: 'string' } },
            following: { type: 'array', items: { type: 'string' } },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Blog: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            blog_content: { type: 'string' },
            short_description: { type: 'string' },
            author: { type: 'string', description: 'User ID' },
            category: { type: 'array', items: { type: 'string' } },
            tags: { type: 'array', items: { type: 'string' } },
            status: { type: 'string', enum: ['draft', 'published', 'scheduled'] },
            views: { type: 'number' },
            likes: { type: 'array', items: { type: 'string' } },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Comment: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            text: { type: 'string' },
            author: { type: 'string' },
            blog: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    },
    security: []
  },
  apis: [
    './routes/auth.js',
    './routes/blog.js',
    './routes/search.js',
    './routes/trending.js',
    './routes/comments.js',
    './routes/likes.js',
    './routes/bookmarks.js',
    './routes/users.js',
    './routes/admin.js'
  ]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };
