const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../../src/models/User');

// Mock bcrypt functions
jest.mock('bcryptjs', () => ({
  genSalt: jest.fn().mockResolvedValue('salt'),
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn()
}));

describe('User Model', () => {
  // Clear mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('comparePassword method', () => {
    it('should return true for matching passwords', async () => {
      // Mock bcrypt.compare to return true
      bcrypt.compare.mockResolvedValue(true);

      const user = new User({
        email: 'test@example.com',
        password: 'hashedPassword'
      });

      const result = await user.comparePassword('Password123!');
      expect(bcrypt.compare).toHaveBeenCalledWith('Password123!', 'hashedPassword');
      expect(result).toBe(true);
    });

    it('should return false for non-matching passwords', async () => {
      // Mock bcrypt.compare to return false
      bcrypt.compare.mockResolvedValue(false);

      const user = new User({
        email: 'test@example.com',
        password: 'hashedPassword'
      });

      const result = await user.comparePassword('WrongPassword');
      expect(bcrypt.compare).toHaveBeenCalledWith('WrongPassword', 'hashedPassword');
      expect(result).toBe(false);
    });
  });

  describe('User schema validation', () => {
    it('should require an email', () => {
      const user = new User({
        password: 'ValidPassword123!'
      });
      
      const validationError = user.validateSync();
      expect(validationError.errors.email).toBeDefined();
      expect(validationError.errors.email.message).toContain('required');
    });
    
    it('should require a valid email format', () => {
      const user = new User({
        email: 'notavalidemail',
        password: 'ValidPassword123!'
      });
      
      const validationError = user.validateSync();
      expect(validationError.errors.email).toBeDefined();
      expect(validationError.errors.email.message).toContain('valid email');
    });
    
    it('should require a password', () => {
      const user = new User({
        email: 'valid@example.com'
      });
      
      const validationError = user.validateSync();
      expect(validationError.errors.password).toBeDefined();
      expect(validationError.errors.password.message).toContain('required');
    });
  });
}); 