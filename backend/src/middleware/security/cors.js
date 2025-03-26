const cors = require('cors');
const { logger } = require('../../logging/logger');

/**
 * Configure CORS middleware with security settings
 * @returns {Function} Configured CORS middleware
 */
const configureCors = () => {
  // Load allowed origins from environment variables
  const allowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',') 
    : ['http://localhost:3000'];
  
  logger.info(`CORS configured with allowed origins: ${JSON.stringify(allowedOrigins)}`);
  
  const corsOptions = {
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, etc)
      if (!origin) {
        return callback(null, true);
      }
      
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
        callback(null, true);
      } else {
        logger.warn(`CORS blocked request from origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    maxAge: 86400 // 24 hours
  };
  
  return cors(corsOptions);
};

module.exports = {
  configureCors
}; 