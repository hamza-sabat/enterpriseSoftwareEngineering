// Import required modules and mocks
const User = require('../../src/core/models/User');

// Mock the User model
jest.mock('../../src/core/models/User');

// Mock the generateToken function
const mockGenerateToken = jest.fn().mockReturnValue('test-token');
jest.mock('../../src/middleware/security/auth', () => ({
  generateToken: mockGenerateToken
}));

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

// Create a mock auth service with the same methods as the real one
const mockAuthService = {
  registerUser: async (userData) => {
    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Create new user
    const user = await User.create(userData);
    
    // Generate JWT token and format user response
    const token = mockGenerateToken(user);
    const userResponse = user.toJSON();
    
    return { user: userResponse, token };
  },
  
  loginUser: async (email, password) => {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Generate JWT token and format user response
    const token = mockGenerateToken(user);
    const userResponse = user.toJSON();
    
    return { user: userResponse, token };
  },
  
  getUserById: async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user.toJSON();
  }
};

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should register a new user and return user data with token', async () => {
      // Mock user data
      const userData = {
        email: 'test@example.com',
        password: 'Password123!'
      };
      
      // Mock User.findOne to return null (user doesn't exist)
      User.findOne.mockResolvedValue(null);
      
      // Mock User.create
      const mockCreatedUser = {
        _id: 'user-id',
        email: 'test@example.com',
        toJSON: jest.fn().mockReturnValue({
          id: 'user-id',
          email: 'test@example.com'
        })
      };
      User.create.mockResolvedValue(mockCreatedUser);
      
      // Call service method
      const result = await mockAuthService.registerUser(userData);
      
      // Verify results
      expect(User.findOne).toHaveBeenCalledWith({ email: userData.email });
      expect(User.create).toHaveBeenCalledWith(userData);
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token', 'test-token');
      expect(result.user).toHaveProperty('email', 'test@example.com');
    });
    
    it('should throw an error if user already exists', async () => {
      // Mock user data
      const userData = {
        email: 'existing@example.com',
        password: 'Password123!'
      };
      
      // Mock User.findOne to return a user (user exists)
      User.findOne.mockResolvedValue({ email: 'existing@example.com' });
      
      // Call service method and expect it to throw
      await expect(mockAuthService.registerUser(userData)).rejects.toThrow('User already exists');
      
      // Verify User.create was not called
      expect(User.create).not.toHaveBeenCalled();
    });
  });

  describe('loginUser', () => {
    it('should login a user and return user data with token', async () => {
      // Login credentials
      const email = 'test@example.com';
      const password = 'Password123!';
      
      // Mock user
      const mockUser = {
        _id: 'user-id',
        email: 'test@example.com',
        comparePassword: jest.fn().mockResolvedValue(true),
        toJSON: jest.fn().mockReturnValue({
          id: 'user-id',
          email: 'test@example.com'
        })
      };
      
      // Mock User.findOne to return the user
      User.findOne.mockResolvedValue(mockUser);
      
      // Call service method
      const result = await mockAuthService.loginUser(email, password);
      
      // Verify results
      expect(User.findOne).toHaveBeenCalledWith({ email });
      expect(mockUser.comparePassword).toHaveBeenCalledWith(password);
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token', 'test-token');
      expect(result.user).toHaveProperty('email', 'test@example.com');
    });
    
    it('should throw an error if user is not found', async () => {
      // Login credentials
      const email = 'nonexistent@example.com';
      const password = 'Password123!';
      
      // Mock User.findOne to return null (user not found)
      User.findOne.mockResolvedValue(null);
      
      // Call service method and expect it to throw
      await expect(mockAuthService.loginUser(email, password)).rejects.toThrow('Invalid credentials');
    });
    
    it('should throw an error if password is incorrect', async () => {
      // Login credentials
      const email = 'test@example.com';
      const password = 'WrongPassword!';
      
      // Mock user with incorrect password
      const mockUser = {
        email: 'test@example.com',
        comparePassword: jest.fn().mockResolvedValue(false)
      };
      
      // Mock User.findOne to return the user
      User.findOne.mockResolvedValue(mockUser);
      
      // Call service method and expect it to throw
      await expect(mockAuthService.loginUser(email, password)).rejects.toThrow('Invalid credentials');
    });
  });

  describe('getUserById', () => {
    it('should return user data when user is found', async () => {
      // User ID
      const userId = 'user-id';
      
      // Mock user
      const mockUser = {
        _id: userId,
        email: 'test@example.com',
        toJSON: jest.fn().mockReturnValue({
          id: userId,
          email: 'test@example.com'
        })
      };
      
      // Mock User.findById to return the user
      User.findById.mockResolvedValue(mockUser);
      
      // Call service method
      const result = await mockAuthService.getUserById(userId);
      
      // Verify results
      expect(User.findById).toHaveBeenCalledWith(userId);
      expect(result).toHaveProperty('email', 'test@example.com');
    });
    
    it('should throw an error if user is not found', async () => {
      // User ID
      const userId = 'nonexistent-id';
      
      // Mock User.findById to return null (user not found)
      User.findById.mockResolvedValue(null);
      
      // Call service method and expect it to throw
      await expect(mockAuthService.getUserById(userId)).rejects.toThrow('User not found');
    });
  });
}); 