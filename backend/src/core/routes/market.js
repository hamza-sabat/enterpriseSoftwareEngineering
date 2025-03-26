const express = require('express');
const marketController = require('../controllers/marketController');
const { authenticate } = require('../../middleware/security/auth');
const { rateLimiter } = require('../../middleware/security/rateLimiter');
const { cacheMiddleware, flushCache, getCacheStats } = require('../../middleware/performance/cache');

const router = express.Router();

// Cache TTL values in seconds
const LISTINGS_CACHE_TTL = 60; // 1 minute
const CRYPTO_INFO_CACHE_TTL = 300; // 5 minutes
const GLOBAL_METRICS_CACHE_TTL = 120; // 2 minutes

/**
 * @route   GET /api/market/listings
 * @desc    Get cryptocurrency listings
 * @access  Public
 */
router.get('/listings', 
  rateLimiter,
  cacheMiddleware(LISTINGS_CACHE_TTL),
  async (req, res) => {
    await marketController.getListings(req, res);
  }
);

/**
 * @route   GET /api/market/crypto/:symbol
 * @desc    Get details for a specific cryptocurrency
 * @access  Public
 */
router.get('/crypto/:symbol', 
  rateLimiter,
  cacheMiddleware(CRYPTO_INFO_CACHE_TTL),
  async (req, res) => {
    await marketController.getCryptoInfo(req, res);
  }
);

/**
 * @route   GET /api/market/search
 * @desc    Search for cryptocurrencies
 * @access  Public
 */
router.get('/search', 
  rateLimiter,
  cacheMiddleware(LISTINGS_CACHE_TTL),
  async (req, res) => {
    await marketController.searchCryptocurrencies(req, res);
  }
);

/**
 * @route   GET /api/market/global
 * @desc    Get global market metrics
 * @access  Public
 */
router.get('/global', 
  rateLimiter,
  cacheMiddleware(GLOBAL_METRICS_CACHE_TTL),
  async (req, res) => {
    await marketController.getGlobalMetrics(req, res);
  }
);

/**
 * @route   POST /api/market/cache/clear
 * @desc    Clear all cache
 * @access  Authenticated users
 */
router.post('/cache/clear', 
  authenticate,
  async (req, res) => {
    try {
      const deletedKeys = flushCache();
      res.json({
        success: true,
        message: `Cache cleared successfully. Deleted ${deletedKeys} keys.`,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to clear cache',
        error: error.message,
      });
    }
  }
);

/**
 * @route   GET /api/market/cache/stats
 * @desc    Get cache statistics
 * @access  Authenticated users
 */
router.get('/cache/stats', 
  authenticate,
  async (req, res) => {
    try {
      const stats = getCacheStats();
      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get cache statistics',
        error: error.message,
      });
    }
  }
);

module.exports = router; 