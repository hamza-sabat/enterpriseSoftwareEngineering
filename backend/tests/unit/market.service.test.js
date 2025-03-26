const marketService = require('../../src/core/services/marketService');
const axios = require('axios');

// Mock axios
jest.mock('axios');

// Mock logger
jest.mock('../../src/utils/logger', () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    http: jest.fn()
  },
  stream: {
    write: jest.fn()
  }
}));

describe('Market Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getLatestListings', () => {
    it('should return cryptocurrency listings from API when request succeeds', async () => {
      // Mock successful API response
      const mockApiResponse = {
        data: {
          data: [
            { id: 1, name: 'Bitcoin', symbol: 'BTC', quote: { USD: { price: 60000 } } },
            { id: 2, name: 'Ethereum', symbol: 'ETH', quote: { USD: { price: 3000 } } }
          ]
        }
      };
      
      axios.get.mockResolvedValue(mockApiResponse);
      
      // Call service method
      const result = await marketService.getLatestListings({ limit: 2 });
      
      // Verify results
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Bitcoin');
      expect(result[1].name).toBe('Ethereum');
      expect(axios.get).toHaveBeenCalledTimes(1);
    });
    
    it('should return mock data when API request fails', async () => {
      // Mock API failure
      axios.get.mockRejectedValue(new Error('API Error'));
      
      // Call service method
      const result = await marketService.getLatestListings({ limit: 5 });
      
      // Verify results - should get mock data
      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('symbol');
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('quote.USD.price');
    });
  });

  describe('getMockListings', () => {
    it('should return the requested number of mock listings', () => {
      const mockListings = marketService.getMockListings(5);
      expect(mockListings).toHaveLength(5);
    });
    
    it('should return listings with required properties', () => {
      const mockListings = marketService.getMockListings(1);
      expect(mockListings[0]).toHaveProperty('symbol');
      expect(mockListings[0]).toHaveProperty('name');
      expect(mockListings[0]).toHaveProperty('quote.USD.price');
      expect(mockListings[0]).toHaveProperty('quote.USD.percent_change_24h');
      expect(mockListings[0]).toHaveProperty('quote.USD.market_cap');
    });
  });

  describe('getMockCryptoInfo', () => {
    it('should return mock data for Bitcoin', () => {
      const result = marketService.getMockCryptoInfo('BTC');
      expect(result.name).toBe('Bitcoin');
      expect(result.symbol).toBe('BTC');
      expect(result.quote.USD.price).toBe(65000);
    });
    
    it('should return mock data for any symbol', () => {
      const result = marketService.getMockCryptoInfo('TEST');
      expect(result.name).toBe('TEST Coin');
      expect(result.symbol).toBe('TEST');
      expect(result.quote.USD).toBeDefined();
    });
  });
}); 