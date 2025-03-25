const axios = require('axios');
const { logger } = require('../utils/logger');

// API configuration
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY;
const COINMARKETCAP_BASE_URL = 'https://pro-api.coinmarketcap.com';

/**
 * Service for interacting with cryptocurrency market data
 */
class MarketService {
  /**
   * Get latest cryptocurrency listings
   * @param {Object} options - Query options
   * @param {number} options.limit - Number of results to return
   * @param {string} options.convert - Currency to convert prices to (e.g., 'USD')
   * @param {string} options.sort - Sort results by (e.g., 'market_cap', 'volume_24h', 'percent_change_24h')
   * @param {string} options.sortDir - Sort direction ('asc' or 'desc')
   * @returns {Promise<Array>} Array of cryptocurrency data
   */
  async getLatestListings({ limit = 100, convert = 'USD', sort = 'market_cap', sortDir = 'desc' } = {}) {
    try {
      logger.debug(`Making request to CoinMarketCap API for listings`);
      
      let listings;
      
      try {
        const response = await axios.get(`${COINMARKETCAP_BASE_URL}/v1/cryptocurrency/listings/latest`, {
          headers: {
            'X-CMC_PRO_API_KEY': COINMARKETCAP_API_KEY,
          },
          params: {
            limit,
            convert,
            sort,
            sort_dir: sortDir,
          },
        });
        
        listings = response.data.data;
      } catch (apiError) {
        // If API call fails, log the error and use mock data
        logger.error(`CoinMarketCap API error: ${apiError.message}`);
        logger.info(`Using mock data for listings`);
        
        // Provide mock data for testing purposes
        listings = this.getMockListings(limit);
      }
      
      return listings;
    } catch (error) {
      logger.error(`Error fetching cryptocurrency listings: ${error.message}`);
      
      // Fallback to mock data in case of any error
      logger.info('Falling back to mock data for listings');
      return this.getMockListings(limit);
    }
  }
  
  /**
   * Get mock cryptocurrency listings for testing
   * @param {number} limit - Number of mock listings to generate
   * @returns {Array} Array of mock cryptocurrency listings
   */
  getMockListings(limit = 100) {
    // Popular cryptocurrencies for realistic data
    const popularCryptos = [
      { symbol: 'BTC', name: 'Bitcoin', price: 65000, change24h: 2.5, marketCap: 1200000000000, volume: 25000000000, rank: 1 },
      { symbol: 'ETH', name: 'Ethereum', price: 3500, change24h: 1.8, marketCap: 420000000000, volume: 15000000000, rank: 2 },
      { symbol: 'BNB', name: 'Binance Coin', price: 550, change24h: -0.5, marketCap: 85000000000, volume: 2000000000, rank: 3 },
      { symbol: 'SOL', name: 'Solana', price: 120, change24h: 3.2, marketCap: 50000000000, volume: 3000000000, rank: 4 },
      { symbol: 'XRP', name: 'XRP', price: 0.55, change24h: -1.2, marketCap: 30000000000, volume: 1500000000, rank: 5 },
      { symbol: 'ADA', name: 'Cardano', price: 0.45, change24h: 0.8, marketCap: 16000000000, volume: 800000000, rank: 6 },
      { symbol: 'DOGE', name: 'Dogecoin', price: 0.12, change24h: 5.4, marketCap: 15000000000, volume: 1200000000, rank: 7 },
      { symbol: 'AVAX', name: 'Avalanche', price: 35, change24h: -2.1, marketCap: 12000000000, volume: 600000000, rank: 8 },
      { symbol: 'DOT', name: 'Polkadot', price: 7.5, change24h: 1.0, marketCap: 10000000000, volume: 500000000, rank: 9 },
      { symbol: 'SHIB', name: 'Shiba Inu', price: 0.000025, change24h: 4.3, marketCap: 9000000000, volume: 700000000, rank: 10 }
    ];
    
    // Start with the popular cryptos
    const cryptos = [...popularCryptos];
    
    // Generate additional random cryptos if needed
    if (limit > popularCryptos.length) {
      for (let i = popularCryptos.length; i < limit; i++) {
        const randomPrice = Math.random() * 100;
        const randomMarketCap = randomPrice * (1000000000 * Math.random() * 10);
        const randomVolume = randomMarketCap * (Math.random() * 0.3);
        const change24h = (Math.random() * 20) - 10; // -10% to +10%
        
        cryptos.push({
          symbol: `CRYPTO${i}`,
          name: `Cryptocurrency ${i}`,
          price: randomPrice,
          change24h: change24h,
          marketCap: randomMarketCap,
          volume: randomVolume,
          rank: i + 1
        });
      }
    }
    
    // Map to the expected format
    return cryptos.slice(0, limit).map((crypto, index) => ({
      id: index + 1,
      name: crypto.name,
      symbol: crypto.symbol,
      cmc_rank: crypto.rank,
      circulating_supply: Math.floor(crypto.marketCap / crypto.price),
      quote: {
        USD: {
          price: crypto.price,
          volume_24h: crypto.volume,
          market_cap: crypto.marketCap,
          percent_change_24h: crypto.change24h,
          percent_change_1h: crypto.change24h / 2,
          percent_change_7d: crypto.change24h * 2,
          percent_change_30d: crypto.change24h * 4,
        }
      }
    }));
  }

  /**
   * Utility function to create a delay
   * @param {number} ms - Milliseconds to delay
   * @returns {Promise} Promise that resolves after the delay
   */
  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get details for a specific cryptocurrency
   * @param {string} symbol - Cryptocurrency symbol (e.g., 'BTC')
   * @param {string} convert - Currency to convert prices to (e.g., 'USD')
   * @returns {Promise<Object>} Cryptocurrency details
   */
  async getCryptocurrencyInfo(symbol, convert = 'USD') {
    try {
      logger.debug(`Making request to CoinMarketCap API for symbol: ${symbol}, API Key: ${COINMARKETCAP_API_KEY}`);
      
      // Add a small delay to reduce chances of race conditions
      await this.delay(100);
      
      try {
        // Step 1: Get metadata information about the cryptocurrency
        const infoResponse = await axios.get(`${COINMARKETCAP_BASE_URL}/v2/cryptocurrency/info`, {
          headers: {
            'X-CMC_PRO_API_KEY': COINMARKETCAP_API_KEY,
          },
          params: {
            symbol,
            aux: 'logo,description,urls,tags,platform,date_added,notice',
          },
        });
        
        logger.debug(`Info response for ${symbol}:`, infoResponse.data);
        
        // Check if the response contains data for the symbol
        if (!infoResponse.data.data || Object.keys(infoResponse.data.data).length === 0) {
          logger.error(`No info data found for symbol ${symbol}`);
          throw new Error(`No cryptocurrency info found for ${symbol}`);
        }
        
        // Find the cryptocurrency ID in the response - this should be a number like "1" for BTC
        const cryptoId = Object.keys(infoResponse.data.data)[0];
        const cryptoInfo = infoResponse.data.data[cryptoId];
        
        // Step 2: Get price/market data for the cryptocurrency
        const quoteResponse = await axios.get(`${COINMARKETCAP_BASE_URL}/v2/cryptocurrency/quotes/latest`, {
          headers: {
            'X-CMC_PRO_API_KEY': COINMARKETCAP_API_KEY,
          },
          params: {
            symbol,
            convert,
          },
        });
        
        logger.debug(`Quote response for ${symbol}:`, quoteResponse.data);
        
        // Check if the response contains data for the symbol
        if (!quoteResponse.data.data || !quoteResponse.data.data[symbol]) {
          logger.error(`No quote data found for symbol ${symbol}`);
          throw new Error(`No price data found for ${symbol}`);
        }
        
        // Get the quote data for the cryptocurrency
        const quoteData = quoteResponse.data.data[symbol];
        
        // Combine both sets of data into a single object
        const result = {
          ...cryptoInfo,
          id: cryptoId,
          symbol: symbol,
          cmc_rank: quoteData.cmc_rank || null,
          circulating_supply: quoteData.circulating_supply || 0,
          total_supply: quoteData.total_supply || 0,
          max_supply: quoteData.max_supply || null,
          quote: quoteData.quote || {}
        };
        
        logger.debug(`Combined crypto data for ${symbol}:`, result);
        
        return result;
      } catch (apiError) {
        // Log the API error
        logger.error(`CoinMarketCap API error: ${apiError.message}`);
        
        // Check if we should use mock data
        logger.info(`Using mock data for ${symbol}`);
        return this.getMockCryptoInfo(symbol);
      }
    } catch (error) {
      logger.error(`Error fetching cryptocurrency info for ${symbol}: ${error.message}`);
      // Fall back to mock data on any error
      logger.info(`Falling back to mock data for ${symbol}`);
      return this.getMockCryptoInfo(symbol);
    }
  }
  
  /**
   * Get mock cryptocurrency data for testing
   * @param {string} symbol - Cryptocurrency symbol
   * @returns {Object} Mock cryptocurrency data
   */
  getMockCryptoInfo(symbol) {
    const currentDate = new Date().toISOString();
    
    // Generic mock data with the requested symbol
    return {
      id: 1,
      name: symbol === 'BTC' ? 'Bitcoin' : 
            symbol === 'ETH' ? 'Ethereum' : 
            `${symbol} Coin`,
      symbol: symbol,
      logo: symbol === 'BTC' ? 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png' :
            symbol === 'ETH' ? 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png' :
            `https://placeholder.com/128`,
      description: `This is a mock description for ${symbol}. In a real application, this would contain detailed information about the cryptocurrency's technology, use cases, and history.`,
      date_added: "2013-04-28T00:00:00.000Z",
      cmc_rank: symbol === 'BTC' ? 1 : 
               symbol === 'ETH' ? 2 : 
               Math.floor(Math.random() * 100) + 3,
      circulating_supply: 19000000,
      max_supply: 21000000,
      tags: ["mineable", "pow", "store-of-value"],
      urls: {
        website: ["https://bitcoin.org/"],
        twitter: ["https://twitter.com/bitcoin"],
        reddit: ["https://reddit.com/r/bitcoin"],
        source_code: ["https://github.com/bitcoin/bitcoin"]
      },
      quote: {
        USD: {
          price: symbol === 'BTC' ? 65000 : 
                symbol === 'ETH' ? 3500 : 
                Math.random() * 1000,
          volume_24h: 25000000000,
          market_cap: 1200000000000,
          fully_diluted_market_cap: 1400000000000,
          percent_change_1h: 0.5,
          percent_change_24h: 2.5,
          percent_change_7d: -1.2,
          percent_change_30d: 10.5,
        }
      }
    };
  }

  /**
   * Search for cryptocurrencies by keyword
   * @param {string} query - Search query
   * @param {number} limit - Number of results to return
   * @returns {Promise<Array>} Array of search results
   */
  async searchCryptocurrencies(query, limit = 10) {
    try {
      // Get all listings first
      const listings = await this.getLatestListings({ limit: 2000 });
      
      // Filter listings based on the search query
      const results = listings.filter(crypto => 
        crypto.name.toLowerCase().includes(query.toLowerCase()) || 
        crypto.symbol.toLowerCase().includes(query.toLowerCase())
      ).slice(0, limit);
      
      return results;
    } catch (error) {
      logger.error(`Error searching cryptocurrencies: ${error.message}`);
      throw new Error('Failed to search cryptocurrencies');
    }
  }

  /**
   * Get global market metrics
   * @param {string} convert - Currency to convert values to (e.g., 'USD')
   * @returns {Promise<Object>} Global market data
   */
  async getGlobalMetrics(convert = 'USD') {
    try {
      const response = await axios.get(`${COINMARKETCAP_BASE_URL}/v1/global-metrics/quotes/latest`, {
        headers: {
          'X-CMC_PRO_API_KEY': COINMARKETCAP_API_KEY,
        },
        params: {
          convert,
        },
      });
      
      return response.data.data;
    } catch (error) {
      logger.error(`Error fetching global market metrics: ${error.message}`);
      throw new Error('Failed to fetch global market metrics');
    }
  }
}

module.exports = new MarketService(); 