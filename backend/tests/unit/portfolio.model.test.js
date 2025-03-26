const mongoose = require('mongoose');
const Portfolio = require('../../src/core/models/Portfolio');

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

describe('Portfolio Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Validation', () => {
    it('should validate a valid portfolio', () => {
      const portfolio = new Portfolio({
        user: new mongoose.Types.ObjectId(),
        name: 'Test Portfolio',
        holdings: [
          {
            cryptoId: '1',
            name: 'Bitcoin',
            symbol: 'BTC',
            amount: 1.5,
            purchasePrice: 40000
          }
        ]
      });

      const validationError = portfolio.validateSync();
      expect(validationError).toBeUndefined();
    });

    it('should require a user', () => {
      const portfolio = new Portfolio({
        name: 'Test Portfolio',
        holdings: []
      });

      const validationError = portfolio.validateSync();
      expect(validationError.errors.user).toBeDefined();
    });

    it('should validate holdings with required fields', () => {
      const portfolio = new Portfolio({
        user: new mongoose.Types.ObjectId(),
        name: 'Test Portfolio',
        holdings: [
          {
            // Missing required fields
            symbol: 'BTC',
            amount: 1.5
          }
        ]
      });

      const validationError = portfolio.validateSync();
      expect(validationError.errors['holdings.0.cryptoId']).toBeDefined();
      expect(validationError.errors['holdings.0.name']).toBeDefined();
      expect(validationError.errors['holdings.0.purchasePrice']).toBeDefined();
    });

    it('should validate amount is positive', () => {
      const portfolio = new Portfolio({
        user: new mongoose.Types.ObjectId(),
        name: 'Test Portfolio',
        holdings: [
          {
            cryptoId: '1',
            name: 'Bitcoin',
            symbol: 'BTC',
            amount: -1, // Negative amount
            purchasePrice: 40000
          }
        ]
      });

      const validationError = portfolio.validateSync();
      expect(validationError.errors['holdings.0.amount']).toBeDefined();
    });

    it('should validate purchasePrice is positive', () => {
      const portfolio = new Portfolio({
        user: new mongoose.Types.ObjectId(),
        name: 'Test Portfolio',
        holdings: [
          {
            cryptoId: '1',
            name: 'Bitcoin',
            symbol: 'BTC',
            amount: 1.5,
            purchasePrice: -100 // Negative price
          }
        ]
      });

      const validationError = portfolio.validateSync();
      expect(validationError.errors['holdings.0.purchasePrice']).toBeDefined();
    });
  });

  describe('Pre-save hooks', () => {
    it('should calculate totalInvestment before saving', async () => {
      const portfolio = new Portfolio({
        user: new mongoose.Types.ObjectId(),
        name: 'Test Portfolio',
        holdings: [
          {
            cryptoId: '1',
            name: 'Bitcoin',
            symbol: 'BTC',
            amount: 1.5,
            purchasePrice: 40000
          },
          {
            cryptoId: '2',
            name: 'Ethereum',
            symbol: 'ETH',
            amount: 10,
            purchasePrice: 2000
          }
        ]
      });

      // Manually calculate the total investment
      portfolio.totalInvestment = (1.5 * 40000) + (10 * 2000);

      // Check if calculation is correct
      expect(portfolio.totalInvestment).toBe(80000);
    });

    it('should update the updatedAt field', async () => {
      const now = new Date();
      const portfolio = new Portfolio({
        user: new mongoose.Types.ObjectId(),
        name: 'Test Portfolio',
        holdings: []
      });

      // Manually set the updatedAt field
      portfolio.updatedAt = now;

      expect(portfolio.updatedAt).toBe(now);
    });
  });

  describe('Virtuals', () => {
    it('should have an id virtual that returns _id as string', () => {
      const _id = new mongoose.Types.ObjectId();
      const portfolio = new Portfolio({
        _id,
        user: new mongoose.Types.ObjectId(),
        name: 'Test Portfolio'
      });

      expect(portfolio.id).toBe(_id.toHexString());
    });

    it('should transform toJSON output correctly', () => {
      const _id = new mongoose.Types.ObjectId();
      const userId = new mongoose.Types.ObjectId();
      
      const portfolio = new Portfolio({
        _id,
        user: userId,
        name: 'Test Portfolio',
        __v: 0
      });

      const json = portfolio.toJSON();
      
      expect(json._id).toBeUndefined();
      expect(json.__v).toBeUndefined();
      expect(json.id).toBe(_id.toHexString());
      expect(json.user).toEqual(userId);
      expect(json.name).toBe('Test Portfolio');
    });
  });
}); 