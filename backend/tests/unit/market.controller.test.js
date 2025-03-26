const marketController = require('../../src/core/controllers/marketController');
const marketService = require('../../src/core/services/marketService');

// Mock dependencies
jest.mock('../../src/core/services/marketService');

// Mock logger
jest.mock('../../src/utils/logger', () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    http: jest.fn()
  }
}));

describe('Market Controller', () => {
  let req, res;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup mock request and response
    req = {
      params: {},
      query: {},
      user: { id: 'user-id' }
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });
  
  describe('getListings', () => {
    it('should return a list of cryptocurrencies', async () => {
      // Mock service response
      const mockCryptos = [
        { symbol: 'BTC', name: 'Bitcoin', quote: { USD: { price: 60000 } } },
        { symbol: 'ETH', name: 'Ethereum', quote: { USD: { price: 3000 } } }
      ];
      marketService.getLatestListings.mockResolvedValue(mockCryptos);
      
      // Call controller method
      await marketController.getListings(req, res);
      
      // Verify response
      expect(marketService.getLatestListings).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: mockCryptos
      }));
    });
    
    it('should handle errors and return 500 status', async () => {
      // Mock service error
      const mockError = new Error('Service error');
      marketService.getLatestListings.mockRejectedValue(mockError);
      
      // Call controller method
      await marketController.getListings(req, res);
      
      // Verify response
      expect(marketService.getLatestListings).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        message: expect.any(String)
      }));
    });
  });
  
  describe('getCryptoInfo', () => {
    it('should return details for a specific cryptocurrency', async () => {
      // Setup params
      req.params.symbol = 'BTC';
      
      // Mock service response
      const mockCryptoInfo = {
        symbol: 'BTC',
        name: 'Bitcoin',
        quote: { USD: { price: 60000 } }
      };
      marketService.getCryptocurrencyInfo.mockResolvedValue(mockCryptoInfo);
      
      // Call controller method
      await marketController.getCryptoInfo(req, res);
      
      // Verify response
      expect(marketService.getCryptocurrencyInfo).toHaveBeenCalledWith('BTC', undefined);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: mockCryptoInfo
      }));
    });
    
    it('should handle errors and return 500 status', async () => {
      // Setup params
      req.params.symbol = 'INVALID';
      
      // Mock service error
      const mockError = new Error('Service error');
      marketService.getCryptocurrencyInfo.mockRejectedValue(mockError);
      
      // Call controller method
      await marketController.getCryptoInfo(req, res);
      
      // Verify response
      expect(marketService.getCryptocurrencyInfo).toHaveBeenCalledWith('INVALID', undefined);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        message: expect.any(String)
      }));
    });
  });
  
  describe('getGlobalMetrics', () => {
    it('should return global market metrics', async () => {
      // Mock service response
      const mockMetrics = {
        total_market_cap: 2500000000000,
        btc_dominance: 45.5,
        total_volume_24h: 120000000000
      };
      marketService.getGlobalMetrics.mockResolvedValue(mockMetrics);
      
      // Call controller method
      await marketController.getGlobalMetrics(req, res);
      
      // Verify response
      expect(marketService.getGlobalMetrics).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: mockMetrics
      }));
    });
    
    it('should handle errors and return 500 status', async () => {
      // Mock service error
      const mockError = new Error('Service error');
      marketService.getGlobalMetrics.mockRejectedValue(mockError);
      
      // Call controller method
      await marketController.getGlobalMetrics(req, res);
      
      // Verify response
      expect(marketService.getGlobalMetrics).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        message: expect.any(String)
      }));
    });
  });
}); 