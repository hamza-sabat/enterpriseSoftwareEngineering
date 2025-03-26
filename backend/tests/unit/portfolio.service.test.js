const portfolioService = require('../../src/core/services/portfolioService');
const Portfolio = require('../../src/core/models/Portfolio');
const mongoose = require('mongoose');

// Mock dependencies
jest.mock('../../src/core/models/Portfolio');

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

describe('Portfolio Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPortfolio', () => {
    it('should return user portfolio when found', async () => {
      // Mock data
      const userId = 'user-id';
      const mockPortfolio = {
        _id: 'portfolio-id',
        user: userId,
        name: 'Test Portfolio',
        holdings: [],
        toJSON: jest.fn().mockReturnThis()
      };
      
      // Mock Portfolio.findOne to return portfolio
      Portfolio.findOne.mockResolvedValue(mockPortfolio);
      
      // Call service method
      const result = await portfolioService.getPortfolio(userId);
      
      // Verify results
      expect(Portfolio.findOne).toHaveBeenCalledWith({ userId });
      expect(result).toBe(mockPortfolio);
    });
    
    it('should create a new portfolio when none exists', async () => {
      // Mock data
      const userId = 'user-id';
      const mockCreatedPortfolio = {
        _id: 'new-portfolio-id',
        user: userId,
        name: 'My Portfolio',
        holdings: [],
        toJSON: jest.fn().mockReturnThis()
      };
      
      // Mock Portfolio.findOne to return null
      Portfolio.findOne.mockResolvedValue(null);
      
      // Mock Portfolio.create
      Portfolio.create.mockResolvedValue(mockCreatedPortfolio);
      
      // Call service method
      const result = await portfolioService.getPortfolio(userId);
      
      // Verify results
      expect(Portfolio.findOne).toHaveBeenCalledWith({ userId });
      expect(Portfolio.create).toHaveBeenCalledWith({
        userId,
        name: 'My Portfolio',
        holdings: [],
        totalInvestment: 0
      });
      expect(result).toBe(mockCreatedPortfolio);
    });
  });

  describe('addHolding', () => {
    it('should add a holding to a portfolio', async () => {
      // Mock data
      const userId = 'user-id';
      const holdingData = {
        cryptoId: '1',
        name: 'Bitcoin',
        symbol: 'BTC',
        amount: 1.5,
        purchasePrice: 40000
      };
      
      const mockPortfolio = {
        _id: 'portfolio-id',
        user: userId,
        name: 'Test Portfolio',
        holdings: [],
        save: jest.fn().mockResolvedValue({ 
          _id: 'portfolio-id',
          user: userId,
          name: 'Test Portfolio',
          holdings: [holdingData],
          toJSON: jest.fn().mockReturnThis()
        }),
        toJSON: jest.fn().mockReturnThis()
      };
      
      // Mock Portfolio.findOne
      Portfolio.findOne.mockResolvedValue(mockPortfolio);
      
      // Call service method
      const result = await portfolioService.addHolding(userId, holdingData);
      
      // Verify results
      expect(Portfolio.findOne).toHaveBeenCalledWith({ userId });
      expect(mockPortfolio.save).toHaveBeenCalled();
    });
    
    it('should throw an error if portfolio is not found', async () => {
      // Mock data
      const userId = 'user-id';
      const holdingData = {
        cryptoId: '1',
        name: 'Bitcoin',
        symbol: 'BTC',
        amount: 1.5,
        purchasePrice: 40000
      };
      
      // Mock Portfolio.findOne to return null
      Portfolio.findOne.mockResolvedValue(null);
      
      // Call service method and expect it to throw
      await expect(portfolioService.addHolding(userId, holdingData))
        .rejects.toThrow();
    });
  });

  describe('updateHolding', () => {
    it('should update a holding in a portfolio', async () => {
      // Mock data
      const userId = 'user-id';
      const holdingId = 'holding-id';
      const updateData = {
        amount: 2.0,
        purchasePrice: 38000
      };
      
      const mockHolding = {
        _id: holdingId,
        cryptoId: '1',
        name: 'Bitcoin',
        symbol: 'BTC',
        amount: 1.5,
        purchasePrice: 40000,
        toObject: jest.fn().mockReturnValue({
          _id: holdingId,
          cryptoId: '1',
          name: 'Bitcoin',
          symbol: 'BTC',
          amount: 1.5,
          purchasePrice: 40000
        })
      };
      
      const mockPortfolio = {
        _id: 'portfolio-id',
        user: userId,
        name: 'Test Portfolio',
        holdings: [mockHolding],
        save: jest.fn().mockResolvedValue({
          _id: 'portfolio-id',
          user: userId,
          name: 'Test Portfolio',
          holdings: [{
            _id: holdingId,
            cryptoId: '1',
            name: 'Bitcoin',
            symbol: 'BTC',
            amount: 2.0,
            purchasePrice: 38000
          }],
          toJSON: jest.fn().mockReturnThis()
        }),
        toJSON: jest.fn().mockReturnThis()
      };
      
      // Mock Portfolio.findOne
      Portfolio.findOne.mockResolvedValue(mockPortfolio);
      
      // Call service method
      const result = await portfolioService.updateHolding(userId, holdingId, updateData);
      
      // Verify results
      expect(Portfolio.findOne).toHaveBeenCalledWith({ userId });
      expect(mockPortfolio.save).toHaveBeenCalled();
    });
    
    it('should throw an error if holding is not found', async () => {
      // Mock data
      const userId = 'user-id';
      const holdingId = 'nonexistent-id';
      const updateData = { amount: 2.0 };
      
      const mockPortfolio = {
        _id: 'portfolio-id',
        user: userId,
        name: 'Test Portfolio',
        holdings: [{ _id: 'different-id', name: 'Bitcoin' }]
      };
      
      // Mock Portfolio.findOne
      Portfolio.findOne.mockResolvedValue(mockPortfolio);
      
      // Call service method and expect it to throw
      await expect(portfolioService.updateHolding(userId, holdingId, updateData))
        .rejects.toThrow();
    });
  });

  describe('deleteHolding', () => {
    it('should delete a holding from a portfolio', async () => {
      // Mock data
      const userId = 'user-id';
      const holdingId = 'holding-id';
      
      const mockHolding = {
        _id: holdingId,
        cryptoId: '1',
        name: 'Bitcoin',
        symbol: 'BTC',
        amount: 1.5,
        purchasePrice: 40000,
        toString: jest.fn().mockReturnValue(holdingId)
      };
      
      const mockPortfolio = {
        _id: 'portfolio-id',
        user: userId,
        name: 'Test Portfolio',
        holdings: [mockHolding],
        save: jest.fn().mockResolvedValue({
          _id: 'portfolio-id',
          user: userId,
          name: 'Test Portfolio',
          holdings: [],
          toJSON: jest.fn().mockReturnThis()
        }),
        toJSON: jest.fn().mockReturnThis()
      };
      
      // Mock Portfolio.findOne
      Portfolio.findOne.mockResolvedValue(mockPortfolio);
      
      // Call service method
      const result = await portfolioService.deleteHolding(userId, holdingId);
      
      // Verify results
      expect(Portfolio.findOne).toHaveBeenCalledWith({ userId });
      expect(mockPortfolio.save).toHaveBeenCalled();
    });
    
    it('should throw an error if holding is not found', async () => {
      // Mock data
      const userId = 'user-id';
      const holdingId = 'nonexistent-id';
      
      const mockPortfolio = {
        _id: 'portfolio-id',
        user: userId,
        name: 'Test Portfolio',
        holdings: [{ _id: 'different-id', name: 'Bitcoin' }]
      };
      
      // Mock Portfolio.findOne
      Portfolio.findOne.mockResolvedValue(mockPortfolio);
      
      // Call service method and expect it to throw
      await expect(portfolioService.deleteHolding(userId, holdingId))
        .rejects.toThrow();
    });
  });
}); 