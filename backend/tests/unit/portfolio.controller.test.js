const portfolioController = require('../../src/core/controllers/portfolioController');
const portfolioService = require('../../src/core/services/portfolioService');

// Mock dependencies
jest.mock('../../src/core/services/portfolioService');

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

describe('Portfolio Controller', () => {
  let req, res;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup mock request and response
    req = {
      body: {},
      params: {},
      user: { id: 'user-id' }
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });
  
  describe('getPortfolio', () => {
    it('should return user portfolio', async () => {
      // Mock service response
      const mockPortfolio = {
        id: 'portfolio-id',
        name: 'My Portfolio',
        holdings: [
          { symbol: 'BTC', amount: 1.5, purchasePrice: 40000 }
        ]
      };
      
      portfolioService.getPortfolio.mockResolvedValue(mockPortfolio);
      
      // Call controller method
      await portfolioController.getPortfolio(req, res);
      
      // Expect service to be called with user ID
      expect(portfolioService.getPortfolio).toHaveBeenCalledWith(req.user.id);
      
      // Expect successful response
      expect(res.json).toHaveBeenCalledWith(mockPortfolio);
    });
  });
  
  describe('addHolding', () => {
    it('should add a holding to portfolio', async () => {
      // Setup request body
      req.body = {
        cryptoId: '1',
        name: 'Bitcoin',
        symbol: 'BTC',
        amount: 1.5,
        purchasePrice: 40000
      };
      
      // Mock service response
      const mockUpdatedPortfolio = {
        id: 'portfolio-id',
        name: 'My Portfolio',
        holdings: [
          { symbol: 'BTC', amount: 1.5, purchasePrice: 40000 }
        ]
      };
      
      portfolioService.addHolding.mockResolvedValue(mockUpdatedPortfolio);
      
      // Call controller method
      await portfolioController.addHolding(req, res);
      
      // Expect service to be called with correct data
      expect(portfolioService.addHolding).toHaveBeenCalledWith(
        req.user.id,
        req.body
      );
      
      // Expect successful response
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockUpdatedPortfolio);
    });
  });
  
  describe('updateHolding', () => {
    it('should update a holding in portfolio', async () => {
      // Setup params and body
      req.params.holdingId = 'holding-id';
      req.body = {
        amount: 2.0,
        purchasePrice: 38000
      };
      
      // Mock service response
      const mockUpdatedPortfolio = {
        id: 'portfolio-id',
        name: 'My Portfolio',
        holdings: [
          { id: 'holding-id', symbol: 'BTC', amount: 2.0, purchasePrice: 38000 }
        ]
      };
      
      portfolioService.updateHolding.mockResolvedValue(mockUpdatedPortfolio);
      
      // Call controller method
      await portfolioController.updateHolding(req, res);
      
      // Expect service to be called with correct data
      expect(portfolioService.updateHolding).toHaveBeenCalledWith(
        req.user.id,
        req.params.holdingId,
        req.body
      );
      
      // Expect successful response
      expect(res.json).toHaveBeenCalledWith(mockUpdatedPortfolio);
    });
  });
  
  describe('deleteHolding', () => {
    it('should delete a holding from portfolio', async () => {
      // Setup params
      req.params.holdingId = 'holding-id';
      
      // Mock service response
      const mockUpdatedPortfolio = {
        id: 'portfolio-id',
        name: 'My Portfolio',
        holdings: []
      };
      
      portfolioService.deleteHolding.mockResolvedValue(mockUpdatedPortfolio);
      
      // Call controller method
      await portfolioController.deleteHolding(req, res);
      
      // Expect service to be called with correct data
      expect(portfolioService.deleteHolding).toHaveBeenCalledWith(
        req.user.id,
        req.params.holdingId
      );
      
      // Expect successful response
      expect(res.json).toHaveBeenCalledWith(mockUpdatedPortfolio);
    });
  });
  
  describe('updatePortfolioName', () => {
    it('should update portfolio name', async () => {
      // Setup body
      req.body.name = 'New Portfolio Name';
      
      // Mock service response
      const mockUpdatedPortfolio = {
        id: 'portfolio-id',
        name: 'New Portfolio Name',
        holdings: []
      };
      
      portfolioService.updatePortfolioName.mockResolvedValue(mockUpdatedPortfolio);
      
      // Call controller method
      await portfolioController.updatePortfolioName(req, res);
      
      // Expect service to be called with correct data
      expect(portfolioService.updatePortfolioName).toHaveBeenCalledWith(
        req.user.id,
        req.body.name
      );
      
      // Expect successful response
      expect(res.json).toHaveBeenCalledWith(mockUpdatedPortfolio);
    });
  });
}); 