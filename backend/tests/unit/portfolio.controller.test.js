const portfolioController = require('../../src/core/controllers/portfolioController');
const portfolioService = require('../../src/core/services/portfolioService');

// Mock dependencies
jest.mock('../../src/core/services/portfolioService');
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

describe('Portfolio Controller', () => {
  let req;
  let res;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Set up req and res mocks
    req = {
      user: { id: 'test-user-id' },
      body: {},
      params: {}
    };
    
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
  });
  
  describe('getPortfolio', () => {
    it('should return the portfolio when found', async () => {
      // Mock implementation
      const mockPortfolio = { 
        id: 'portfolio-id', 
        userId: 'test-user-id', 
        holdings: [] 
      };
      portfolioService.getPortfolio.mockResolvedValue(mockPortfolio);
      
      // Call controller method
      await portfolioController.getPortfolio(req, res);
      
      // Assertions
      expect(portfolioService.getPortfolio).toHaveBeenCalledWith('test-user-id');
      expect(res.json).toHaveBeenCalledWith(mockPortfolio);
      expect(res.status).not.toHaveBeenCalled();
    });
    
    it('should return 404 when portfolio is not found', async () => {
      // Mock implementation
      portfolioService.getPortfolio.mockRejectedValue(new Error('Portfolio not found'));
      
      // Call controller method
      await portfolioController.getPortfolio(req, res);
      
      // Assertions
      expect(portfolioService.getPortfolio).toHaveBeenCalledWith('test-user-id');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Portfolio not found' });
    });
  });
  
  describe('addHolding', () => {
    it('should add a holding and return updated portfolio', async () => {
      // Mock implementation
      const mockHolding = {
        cryptoId: '1',
        name: 'Bitcoin',
        symbol: 'BTC',
        amount: 1.5,
        purchasePrice: 40000
      };
      const mockUpdatedPortfolio = {
        id: 'portfolio-id',
        userId: 'test-user-id',
        holdings: [mockHolding]
      };
      
      req.body = mockHolding;
      portfolioService.addHolding.mockResolvedValue(mockUpdatedPortfolio);
      
      // Call controller method
      await portfolioController.addHolding(req, res);
      
      // Assertions
      expect(portfolioService.addHolding).toHaveBeenCalledWith('test-user-id', mockHolding);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockUpdatedPortfolio);
    });
    
    it('should return 400 when adding a holding fails', async () => {
      // Mock implementation
      req.body = { cryptoId: '1', name: 'Invalid Holding' };
      portfolioService.addHolding.mockRejectedValue(new Error('Invalid holding data'));
      
      // Call controller method
      await portfolioController.addHolding(req, res);
      
      // Assertions
      expect(portfolioService.addHolding).toHaveBeenCalledWith('test-user-id', req.body);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid holding data' });
    });
  });
  
  describe('updateHolding', () => {
    it('should update a holding and return updated portfolio', async () => {
      // Mock implementation
      const holdingId = 'holding-id';
      const updateData = {
        amount: 2.0,
        purchasePrice: 38000
      };
      const mockUpdatedPortfolio = {
        id: 'portfolio-id',
        userId: 'test-user-id',
        holdings: [{
          _id: holdingId,
          cryptoId: '1',
          name: 'Bitcoin',
          symbol: 'BTC',
          amount: 2.0,
          purchasePrice: 38000
        }]
      };
      
      req.params.holdingId = holdingId;
      req.body = updateData;
      portfolioService.updateHolding.mockResolvedValue(mockUpdatedPortfolio);
      
      // Call controller method
      await portfolioController.updateHolding(req, res);
      
      // Assertions
      expect(portfolioService.updateHolding).toHaveBeenCalledWith(
        'test-user-id', 
        holdingId, 
        updateData
      );
      expect(res.json).toHaveBeenCalledWith(mockUpdatedPortfolio);
    });
    
    it('should return 400 when updating a holding fails', async () => {
      // Mock implementation
      const holdingId = 'holding-id';
      req.params.holdingId = holdingId;
      req.body = { amount: -1 }; // Invalid amount
      
      portfolioService.updateHolding.mockRejectedValue(new Error('Invalid holding data'));
      
      // Call controller method
      await portfolioController.updateHolding(req, res);
      
      // Assertions
      expect(portfolioService.updateHolding).toHaveBeenCalledWith('test-user-id', holdingId, req.body);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid holding data' });
    });
  });
  
  describe('deleteHolding', () => {
    it('should delete a holding and return updated portfolio', async () => {
      // Mock implementation
      const holdingId = 'holding-id';
      const mockUpdatedPortfolio = {
        id: 'portfolio-id',
        userId: 'test-user-id',
        holdings: [] // Empty after deletion
      };
      
      req.params.holdingId = holdingId;
      portfolioService.deleteHolding.mockResolvedValue(mockUpdatedPortfolio);
      
      // Call controller method
      await portfolioController.deleteHolding(req, res);
      
      // Assertions
      expect(portfolioService.deleteHolding).toHaveBeenCalledWith('test-user-id', holdingId);
      expect(res.json).toHaveBeenCalledWith(mockUpdatedPortfolio);
    });
    
    it('should return 400 when deleting a holding fails', async () => {
      // Mock implementation
      const holdingId = 'non-existent-id';
      req.params.holdingId = holdingId;
      
      portfolioService.deleteHolding.mockRejectedValue(new Error('Holding not found'));
      
      // Call controller method
      await portfolioController.deleteHolding(req, res);
      
      // Assertions
      expect(portfolioService.deleteHolding).toHaveBeenCalledWith('test-user-id', holdingId);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Holding not found' });
    });
  });
  
  describe('updatePortfolioName', () => {
    it('should update portfolio name and return updated portfolio', async () => {
      // Mock implementation
      const newName = 'My Crypto Portfolio';
      const mockUpdatedPortfolio = {
        id: 'portfolio-id',
        userId: 'test-user-id',
        name: newName,
        holdings: []
      };
      
      req.body.name = newName;
      portfolioService.updatePortfolioName.mockResolvedValue(mockUpdatedPortfolio);
      
      // Call controller method
      await portfolioController.updatePortfolioName(req, res);
      
      // Assertions
      expect(portfolioService.updatePortfolioName).toHaveBeenCalledWith('test-user-id', newName);
      expect(res.json).toHaveBeenCalledWith(mockUpdatedPortfolio);
    });
    
    it('should return 400 when updating portfolio name fails', async () => {
      // Mock implementation
      req.body.name = ''; // Invalid name
      
      portfolioService.updatePortfolioName.mockRejectedValue(new Error('Invalid portfolio name'));
      
      // Call controller method
      await portfolioController.updatePortfolioName(req, res);
      
      // Assertions
      expect(portfolioService.updatePortfolioName).toHaveBeenCalledWith('test-user-id', '');
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid portfolio name' });
    });
  });
}); 