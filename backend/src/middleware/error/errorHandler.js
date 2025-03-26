const { logger } = require('../../utils/logger');

/**
 * Centralized error handling middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const errorHandler = (err, req, res, next) => {
  // Set default error values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errorCode = err.code || 'SERVER_ERROR';
  
  // Log error details
  logger.error(`${errorCode}: ${message}`, {
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
    statusCode,
    userId: req.user ? req.user.id : 'unauthenticated'
  });
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
    errorCode = 'VALIDATION_ERROR';
  } else if (err.name === 'UnauthorizedError' || err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid or expired authentication token';
    errorCode = 'INVALID_TOKEN';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token expired';
    errorCode = 'TOKEN_EXPIRED';
  } else if (err.name === 'MongoError' && err.code === 11000) {
    statusCode = 409;
    message = 'Duplicate data found';
    errorCode = 'DUPLICATE_ERROR';
  }
  
  // Send error response
  res.status(statusCode).json({
    success: false,
    error: {
      message,
      code: errorCode,
      status: statusCode
    }
  });
};

module.exports = {
  errorHandler
}; 