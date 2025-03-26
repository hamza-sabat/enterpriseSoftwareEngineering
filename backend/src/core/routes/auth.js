const express = require('express');
const { generateToken, authenticate } = require('../../middleware/security/auth');
const User = require('../models/User');
const { logger } = require('../../middleware/logging/logger');
const mongoose = require('mongoose');

const router = express.Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    // Create new user
    const user = new User({
      email,
      password,
      name
    });
    
    await user.save();
    
    // Generate token
    const token = generateToken(user);
    
    // Don't send password back to client
    const userResponse = {
      id: user._id,
      email: user.email,
      name: user.name,
    };
    
    res.status(201).json({
      message: 'User registered successfully',
      user: userResponse,
      token,
    });
  } catch (error) {
    logger.error('Error in user registration:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = {};
      
      // Extract specific validation error messages
      for (const field in error.errors) {
        validationErrors[field] = error.errors[field].message;
      }
      
      return res.status(400).json({
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    
    // Handle other errors
    res.status(500).json({ message: 'Server error during registration' });
  }
});

/**
 * @route POST /api/auth/login
 * @desc Login user
 * @access Public
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Generate token
    const token = generateToken(user);
    
    // Don't send password back to client
    const userResponse = {
      id: user._id,
      email: user.email,
      name: user.name,
    };
    
    res.status(200).json({
      message: 'Login successful',
      user: userResponse,
      token,
    });
  } catch (error) {
    logger.error('Error in user login:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Get user profile
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    logger.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
});

// Update user profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    console.log('Profile update request received:', req.body);
    console.log('User from token:', req.user);
    
    // Make sure we have a valid user ID
    if (!req.user || !req.user.id) {
      console.error('No user ID found in request');
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const { name, email } = req.body;
    
    console.log('Attempting to find user with ID:', req.user.id);
    
    // Find user and update - Convert string ID to ObjectId if needed
    let userId;
    try {
      userId = mongoose.Types.ObjectId(req.user.id);
    } catch (e) {
      console.error('Invalid ID format:', e);
      userId = req.user.id; // fallback to using the ID as is
    }
    
    const user = await User.findById(userId);
    if (!user) {
      console.error('User not found with ID:', req.user.id);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User found:', user.email);
    
    // Only update fields that were provided
    if (name !== undefined) {
      console.log('Updating name to:', name);
      user.name = name;
    }
    
    if (email !== undefined && email !== user.email) {
      console.log('Updating email from', user.email, 'to:', email);
      // If changing email, check if the new email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      user.email = email;
    }

    // Update the updatedAt field
    user.updatedAt = Date.now();

    console.log('User object before save:', JSON.stringify(user.toObject ? user.toObject() : user, null, 2));
    
    try {
      // Save the user
      await user.save();
      console.log('User saved successfully');
    } catch (saveError) {
      console.error('Error during user.save():', saveError);
      if (saveError.name === 'ValidationError') {
        console.error('Validation errors:', saveError.errors);
        return res.status(400).json({ 
          message: 'Validation failed', 
          errors: Object.keys(saveError.errors).reduce((acc, key) => {
            acc[key] = saveError.errors[key].message;
            return acc;
          }, {})
        });
      }
      throw saveError; // rethrow if it's not a validation error
    }

    // Return updated user without password
    const updatedUser = await User.findById(userId).select('-password');
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error.name, error.message);
    console.error('Error stack:', error.stack);
    logger.error('Error updating user profile:', { error: error.message, stack: error.stack });
    res.status(500).json({ message: 'Server error while updating profile', error: error.message });
  }
});

// Update user password
router.put('/password', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }
    
    // Find user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    logger.error('Error updating password:', error);
    res.status(500).json({ message: 'Server error while updating password' });
  }
});

module.exports = router; 