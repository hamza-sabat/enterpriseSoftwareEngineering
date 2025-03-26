const NodeCache = require('node-cache');
const { logger } = require('../../utils/logger');

// Create a new cache instance with standard TTL of 5 minutes and check period of 10 minutes
const cache = new NodeCache({
  stdTTL: 300, // 5 minutes in seconds
  checkperiod: 600, // 10 minutes in seconds
});

/**
 * Cache middleware factory
 * @param {number} ttl - Time to live in seconds (optional, defaults to 5 minutes)
 * @returns {Function} Express middleware function
 */
const cacheMiddleware = (ttl = 300) => {
  return (req, res, next) => {
    // Skip caching for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }
    
    // Generate a cache key based on the route and query parameters
    const cacheKey = `${req.originalUrl || req.url}`;
    
    // Check if we have a cached response
    const cachedResponse = cache.get(cacheKey);
    
    if (cachedResponse) {
      logger.debug(`Cache hit for ${cacheKey}`);
      return res.json(cachedResponse);
    }
    
    // Store the original res.json method
    const originalJson = res.json;
    
    // Override the res.json method to store the response in cache
    res.json = function(body) {
      // Restore the original res.json method
      res.json = originalJson;
      
      // Only cache successful responses
      if (res.statusCode >= 200 && res.statusCode < 300) {
        logger.debug(`Caching response for ${cacheKey}`);
        cache.set(cacheKey, body, ttl);
      }
      
      // Call the original method with all arguments
      return res.json(body);
    };
    
    next();
  };
};

/**
 * Invalidate cache for a specific key
 * @param {string} key - Cache key to invalidate
 * @returns {boolean} True if deleted, false otherwise
 */
const invalidateCache = (key) => {
  logger.debug(`Invalidating cache for ${key}`);
  return cache.del(key);
};

/**
 * Invalidate all cache
 * @returns {number} Number of deleted keys
 */
const flushCache = () => {
  logger.debug('Flushing all cache');
  return cache.flushAll();
};

/**
 * Get cache statistics
 * @returns {Object} Cache statistics
 */
const getCacheStats = () => {
  return cache.getStats();
};

module.exports = {
  cacheMiddleware,
  invalidateCache,
  flushCache,
  getCacheStats,
  cache,
}; 