// Mock the authService module
jest.mock('../../src/core/services/authService', () => ({
  registerUser: jest.fn(),
  loginUser: jest.fn(),
  getUserById: jest.fn(),
  updateUserSettings: jest.fn(),
  updateUserProfile: jest.fn()
}));

// Mock the logger
jest.mock('../../src/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn()
  }
}));

// Import the controller after mocking its dependencies
const authController = require('../../src/core/controllers/authController');
const authService = require('../../src/core/services/authService');

describe('AuthController', () => {
  let req;
  let res;

  beforeEach(() => {
    // Reset all mock function calls between tests
    jest.clearAllMocks();
    
    // Setup basic request and response objects
    req = {
      body: {},
      params: {},
      user: { id: 'user123' }
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('register', () => {
    it('should register a user successfully', async () => {
      // Setup
      const userData = { 
        email: 'test@example.com', 
        password: 'password123',
        name: 'Test User'
      };
      req.body = userData;
      const mockResult = { user: { id: 'user123', email: 'test@example.com' }, token: 'test-token' };
      authService.registerUser.mockResolvedValue(mockResult);

      // Execute
      await authController.register(req, res);

      // Assert
      expect(authService.registerUser).toHaveBeenCalledWith(userData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it('should handle registration failure', async () => {
      // Setup
      req.body = { 
        email: 'test@example.com', 
        password: 'password123',
        name: 'Test User'
      };
      authService.registerUser.mockRejectedValue(new Error('Registration failed'));

      // Execute
      await authController.register(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Registration failed' });
    });
  });

  describe('login', () => {
    it('should login a user successfully', async () => {
      // Setup
      const email = 'test@example.com';
      const password = 'password123';
      req.body = { email, password };
      const mockResult = { token: 'some-token', user: { id: 'user123', email: 'test@example.com' } };
      authService.loginUser.mockResolvedValue(mockResult);

      // Execute
      await authController.login(req, res);

      // Assert
      expect(authService.loginUser).toHaveBeenCalledWith(email, password);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it('should handle login failure', async () => {
      // Setup
      req.body = { email: 'test@example.com', password: 'wrongpassword' };
      authService.loginUser.mockRejectedValue(new Error('Invalid credentials'));

      // Execute
      await authController.login(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
    });
  });

  describe('getUserProfile', () => {
    it('should get user profile successfully', async () => {
      // Setup
      const userId = 'user123';
      req.user = { id: userId };
      const mockUser = { id: userId, email: 'test@example.com', name: 'Test User' };
      authService.getUserById.mockResolvedValue(mockUser);

      // Execute
      await authController.getUserProfile(req, res);

      // Assert
      expect(authService.getUserById).toHaveBeenCalledWith(userId);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it('should handle get profile failure', async () => {
      // Setup
      req.user = { id: 'user123' };
      authService.getUserById.mockRejectedValue(new Error('User not found'));

      // Execute
      await authController.getUserProfile(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
    });
  });
}); 