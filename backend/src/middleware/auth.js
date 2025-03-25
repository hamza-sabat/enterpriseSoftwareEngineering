const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { logger } = require('../utils/logger');

// Load JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * Middleware to authenticate user with JWT
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required. No token provided.' });
    }
    
    // Get token from header
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required. No token provided.' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Find user by id from token
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found or token invalid.' });
    }
    
    // Add user to request object
    req.user = {
      id: user._id,
      email: user.email,
      role: user.role
    };
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired. Please login again.' });
    }
    
    logger.error('Authentication error:', error);
    return res.status(401).json({ message: 'Authentication failed. Invalid token.' });
  }
};

/**
 * Middleware to ensure user has admin role
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required.' });
  }
  
  if (req.user.role !== 'admin') {
    logger.warn(`Unauthorized admin access attempt by user: ${req.user.id}`);
    return res.status(403).json({ message: 'Admin access required.' });
  }
  
  next();
};

/**
 * Function to generate JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id,
      email: user.email,
      role: user.role
    }, 
    JWT_SECRET, 
    { expiresIn: '24h' }
  );
};

module.exports = {
  authenticate,
  requireAdmin,
  generateToken
}; 