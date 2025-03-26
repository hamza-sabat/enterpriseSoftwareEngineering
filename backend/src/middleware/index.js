// Security middleware
const { authenticate, generateToken } = require('./security/auth');
const { rateLimiter } = require('./security/rateLimiter');
const { configureCors } = require('./security/cors');

// Performance middleware
const { cacheMiddleware, invalidateCache, flushCache } = require('./performance/cache');

// Logging and Request middleware
const { logger, requestLogger } = require('../utils/logger');
const { validateRequest } = require('./request/validation');

// Error middleware
const { errorHandler } = require('./error/errorHandler');

/**
 * Apply global middleware to Express app
 * @param {Object} app - Express application instance
 */
const applyGlobalMiddleware = (app) => {
  const helmet = require('helmet');
  const compression = require('compression');
  const express = require('express');
  
  // Security middleware
  app.use(helmet());
  app.use(configureCors());
  
  // Body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  
  // Logging middleware
  app.use(requestLogger);
  
  // Performance middleware
  app.use(compression());
  
  // Error handling middleware (should be registered last)
  app.use(errorHandler);
};

module.exports = {
  // Security middleware exports
  authenticate,
  generateToken,
  rateLimiter,
  configureCors,
  
  // Performance middleware exports
  cacheMiddleware,
  invalidateCache,
  flushCache,
  
  // Logging and Request middleware exports
  logger,
  requestLogger,
  validateRequest,
  
  // Error middleware exports
  errorHandler,
  
  // Utility function to apply global middleware
  applyGlobalMiddleware
}; 