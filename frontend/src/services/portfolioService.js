import apiClient from './api';

/**
 * Service for interacting with the portfolio API
 */
const PortfolioService = {
  /**
   * Get the user's portfolio
   * @returns {Promise<Object>} Portfolio data
   */
  async getPortfolio() {
    try {
      const response = await apiClient.get('/api/portfolio');
      return response.data;
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      // Return empty portfolio structure if not found
      return {
        name: 'My Portfolio',
        holdings: [],
        totalInvestment: 0
      };
    }
  },

  /**
   * Add a new holding to the portfolio
   * @param {Object} holding - Holding data
   * @param {string} holding.cryptoId - Cryptocurrency ID
   * @param {string} holding.name - Cryptocurrency name
   * @param {string} holding.symbol - Cryptocurrency symbol
   * @param {number} holding.amount - Amount of cryptocurrency
   * @param {number} holding.purchasePrice - Purchase price per unit
   * @param {string} [holding.purchaseDate] - Purchase date
   * @param {string} [holding.notes] - Additional notes
   * @returns {Promise<Object>} Updated portfolio data
   */
  async addHolding(holding) {
    try {
      const response = await apiClient.post('/api/portfolio/holdings', holding);
      return response.data;
    } catch (error) {
      console.error('Error adding holding:', error);
      throw new Error(error.response?.data?.error || 'Failed to add holding');
    }
  },

  /**
   * Update an existing holding
   * @param {string} holdingId - ID of the holding to update
   * @param {Object} updates - Updated holding data
   * @returns {Promise<Object>} Updated portfolio data
   */
  async updateHolding(holdingId, updates) {
    try {
      const response = await apiClient.put(`/api/portfolio/holdings/${holdingId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating holding:', error);
      throw new Error(error.response?.data?.error || 'Failed to update holding');
    }
  },

  /**
   * Remove a holding from the portfolio
   * @param {string} holdingId - ID of the holding to remove
   * @returns {Promise<Object>} Updated portfolio data
   */
  async removeHolding(holdingId) {
    try {
      const response = await apiClient.delete(`/api/portfolio/holdings/${holdingId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing holding:', error);
      throw new Error(error.response?.data?.error || 'Failed to remove holding');
    }
  },

  /**
   * Calculate portfolio performance based on current prices
   * @param {Array} holdings - Array of holding objects
   * @param {Object} currentPrices - Object mapping symbols to current price data
   * @returns {Object} Performance metrics
   */
  calculatePerformance(holdings, currentPrices) {
    if (!holdings || holdings.length === 0) {
      return {
        totalValue: 0,
        totalInvestment: 0,
        totalProfit: 0,
        totalProfitPercentage: 0,
        holdings: []
      };
    }

    const holdingsWithPerformance = holdings.map(holding => {
      const currentPriceData = currentPrices[holding.symbol];
      const currentPrice = currentPriceData?.price || 0;
      
      const holdingValue = holding.amount * currentPrice;
      const investmentValue = holding.amount * holding.purchasePrice;
      const profit = holdingValue - investmentValue;
      const profitPercentage = investmentValue > 0 
        ? (profit / investmentValue) * 100 
        : 0;
      
      return {
        ...holding,
        currentPrice,
        holdingValue,
        profit,
        profitPercentage
      };
    });
    
    const totalValue = holdingsWithPerformance.reduce(
      (sum, holding) => sum + holding.holdingValue, 0
    );
    
    const totalInvestment = holdingsWithPerformance.reduce(
      (sum, holding) => sum + (holding.amount * holding.purchasePrice), 0
    );
    
    const totalProfit = totalValue - totalInvestment;
    const totalProfitPercentage = totalInvestment > 0 
      ? (totalProfit / totalInvestment) * 100 
      : 0;
    
    return {
      totalValue,
      totalInvestment,
      totalProfit,
      totalProfitPercentage,
      holdings: holdingsWithPerformance
    };
  }
};

export default PortfolioService; 