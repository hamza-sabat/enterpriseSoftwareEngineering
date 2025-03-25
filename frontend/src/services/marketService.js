import apiClient from './api';

/**
 * Service for interacting with the market API
 */
const MarketService = {
  /**
   * Get cryptocurrency listings
   * @param {Object} options - Query options
   * @param {number} options.limit - Number of results to return
   * @param {string} options.convert - Currency to convert prices to (e.g., 'USD')
   * @param {string} options.sort - Sort results by
   * @param {string} options.sortDir - Sort direction ('asc' or 'desc')
   * @returns {Promise<Array>} Array of cryptocurrency data
   */
  async getListings(options = {}) {
    try {
      const response = await apiClient.get('/api/market/listings', {
        params: options,
      });
      
      if (!response.data || !response.data.data) {
        console.error('Invalid response structure:', response);
        throw new Error('Invalid API response structure');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('Error fetching cryptocurrency listings:', error);
      if (error.response) {
        console.error('Server response:', error.response.data);
      }
      throw new Error('Failed to fetch cryptocurrency listings');
    }
  },

  /**
   * Search for cryptocurrencies
   * @param {string} query - Search query
   * @param {number} limit - Number of results to return
   * @returns {Promise<Array>} Array of search results
   */
  async searchCryptocurrencies(query, limit = 10) {
    if (!query) {
      throw new Error('Search query is required');
    }
    
    try {
      const response = await apiClient.get('/api/market/search', {
        params: { query, limit },
      });
      
      if (!response.data || !response.data.data) {
        console.error('Invalid response structure:', response);
        throw new Error('Invalid API response structure');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('Error searching cryptocurrencies:', error);
      if (error.response) {
        console.error('Server response:', error.response.data);
      }
      throw new Error('Failed to search cryptocurrencies');
    }
  },

  /**
   * Get global market metrics
   * @param {string} convert - Currency to convert values to (e.g., 'USD')
   * @returns {Promise<Object>} Global market data
   */
  async getGlobalMetrics(convert = 'USD') {
    try {
      const response = await apiClient.get('/api/market/global', {
        params: { convert },
      });
      
      if (!response.data || !response.data.data) {
        console.error('Invalid response structure:', response);
        throw new Error('Invalid API response structure');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('Error fetching global market metrics:', error);
      if (error.response) {
        console.error('Server response:', error.response.data);
      }
      throw new Error('Failed to fetch global market metrics');
    }
  },
};

export default MarketService; 