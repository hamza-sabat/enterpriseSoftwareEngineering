const marketService = require('../services/marketService');
const { logger } = require('../utils/logger');

/**
 * Controller for handling market-related API requests
 */
class MarketController {
  /**
   * Get cryptocurrency listings
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getListings(req, res) {
    try {
      const { limit, convert, sort, sortDir } = req.query;
      
      const listings = await marketService.getLatestListings({
        limit: limit ? parseInt(limit, 10) : undefined,
        convert,
        sort,
        sortDir,
      });
      
      res.json({
        success: true,
        data: listings,
      });
    } catch (error) {
      logger.error(`Error in getListings controller: ${error.message}`);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch cryptocurrency listings',
        error: error.message,
      });
    }
  }

  /**
   * Get cryptocurrency details
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getCryptoInfo(req, res) {
    try {
      const { symbol } = req.params;
      const { convert } = req.query;
      
      logger.info(`Received request for crypto info: ${symbol}`);
      
      if (!symbol) {
        logger.warn('Missing symbol parameter in request');
        return res.status(400).json({
          success: false,
          message: 'Symbol parameter is required',
        });
      }
      
      // Log parameters being sent to service
      logger.debug(`Requesting crypto details from service: symbol=${symbol}, convert=${convert || 'USD'}`);
      
      const cryptoInfo = await marketService.getCryptocurrencyInfo(symbol, convert);
      
      if (!cryptoInfo) {
        logger.warn(`No data found for symbol: ${symbol}`);
        return res.status(404).json({
          success: false,
          message: `No data found for cryptocurrency ${symbol}`,
        });
      }
      
      // Log the data structure received from the service
      logger.debug(`Data received from service for ${symbol}:`, JSON.stringify({
        hasSymbol: !!cryptoInfo.symbol,
        hasName: !!cryptoInfo.name,
        hasQuote: !!cryptoInfo.quote,
        hasUSD: cryptoInfo.quote && !!cryptoInfo.quote.USD,
        hasPrice: cryptoInfo.quote && cryptoInfo.quote.USD && cryptoInfo.quote.USD.price !== undefined,
        cmc_rank: cryptoInfo.cmc_rank || 'null',
        date_added: cryptoInfo.date_added || 'null'
      }));
      
      logger.info(`Successfully retrieved data for ${symbol}`);
      
      // Send response with data
      res.json({
        success: true,
        data: cryptoInfo,
      });
    } catch (error) {
      logger.error(`Error in getCryptoInfo controller: ${error.message}`);
      
      // Send appropriate status code based on error
      const statusCode = error.message.includes('not found') ? 404 : 500;
      
      res.status(statusCode).json({
        success: false,
        message: `Failed to fetch information for ${req.params.symbol}`,
        error: error.message,
      });
    }
  }

  /**
   * Search for cryptocurrencies
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async searchCryptocurrencies(req, res) {
    try {
      const { query, limit } = req.query;
      
      if (!query) {
        return res.status(400).json({
          success: false,
          message: 'Query parameter is required',
        });
      }
      
      const results = await marketService.searchCryptocurrencies(
        query,
        limit ? parseInt(limit, 10) : undefined
      );
      
      res.json({
        success: true,
        data: results,
      });
    } catch (error) {
      logger.error(`Error in searchCryptocurrencies controller: ${error.message}`);
      res.status(500).json({
        success: false,
        message: 'Failed to search cryptocurrencies',
        error: error.message,
      });
    }
  }

  /**
   * Get global market metrics
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getGlobalMetrics(req, res) {
    try {
      const { convert } = req.query;
      
      const metrics = await marketService.getGlobalMetrics(convert);
      
      res.json({
        success: true,
        data: metrics,
      });
    } catch (error) {
      logger.error(`Error in getGlobalMetrics controller: ${error.message}`);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch global market metrics',
        error: error.message,
      });
    }
  }
}

module.exports = new MarketController(); 