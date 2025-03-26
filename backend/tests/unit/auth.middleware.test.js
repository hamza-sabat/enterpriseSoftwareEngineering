const jsonwebtoken = require('jsonwebtoken');
const { authenticate, generateToken } = require('../../src/middleware/security/auth');
const User = require('../../src/core/models/User');

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

// Mock dependencies
jest.mock('jsonwebtoken');
jest.mock('../../src/core/models/User');

// Setup test data
const mockUserId = '123456789';
const mockUser = {
  _id: mockUserId,
  email: 'test@example.com',
  role: 'user'
};

describe('Auth Middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup request, response and next function
    req = {
      headers: {
        authorization: 'Bearer valid-token'
      }
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    next = jest.fn();
  });

  describe('authenticate middleware', () => {
    it('should set req.user and call next() when token is valid', async () => {
      // Mock implementations
      const userMock = {
        _id: 'user-id',
        email: 'test@example.com',
        role: 'user'
      };
      
      jsonwebtoken.verify.mockReturnValue({ id: 'user-id' });
      User.findById.mockResolvedValue(userMock);
      
      // Call middleware
      await authenticate(req, res, next);
      
      // Assertions
      expect(jsonwebtoken.verify).toHaveBeenCalledWith('valid-token', expect.any(String));
      expect(User.findById).toHaveBeenCalledWith('user-id');
      expect(req.user).toEqual({
        id: 'user-id',
        email: 'test@example.com',
        role: 'user'
      });
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should return 401 when no token is provided', async () => {
      // Update request to not have a token
      req.headers.authorization = undefined;
      
      // Call middleware
      await authenticate(req, res, next);
      
      // Assertions
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.stringContaining('No token provided')
      }));
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 when token format is invalid', async () => {
      // Update request with invalid token format
      req.headers.authorization = 'InvalidFormat';
      
      // Call middleware
      await authenticate(req, res, next);
      
      // Assertions
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.stringContaining('No token provided')
      }));
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 when token verification fails', async () => {
      // Mock implementation for failed verification
      jsonwebtoken.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });
      
      // Call middleware
      await authenticate(req, res, next);
      
      // Assertions
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.stringContaining('Invalid token')
      }));
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 when token is expired', async () => {
      // Mock implementation for expired token
      jsonwebtoken.verify.mockImplementation(() => {
        const error = new Error('Token expired');
        error.name = 'TokenExpiredError';
        throw error;
      });
      
      // Call middleware
      await authenticate(req, res, next);
      
      // Assertions
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.stringContaining('Token expired')
      }));
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 when user is not found', async () => {
      // Mock implementations
      jsonwebtoken.verify.mockReturnValue({ id: 'non-existent-user-id' });
      User.findById.mockResolvedValue(null);
      
      // Call middleware
      await authenticate(req, res, next);
      
      // Assertions
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.stringContaining('User not found')
      }));
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('generateToken function', () => {
    it('should generate a JWT token with user information', () => {
      // Mock implementation
      jsonwebtoken.sign.mockReturnValue('generated-token');
      
      // User data
      const user = {
        _id: 'user-id',
        email: 'test@example.com',
        role: 'user'
      };
      
      // Call function
      const token = generateToken(user);
      
      // Assertions
      expect(jsonwebtoken.sign).toHaveBeenCalledWith(
        {
          id: 'user-id',
          email: 'test@example.com',
          role: 'user'
        },
        expect.any(String),
        { expiresIn: '24h' }
      );
      expect(token).toBe('generated-token');
    });
  });
}); 