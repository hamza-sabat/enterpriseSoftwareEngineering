const User = require('../models/User');
const { generateToken } = require('../../middleware/security/auth');
const { logger } = require('../../utils/logger');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthService {
    async registerUser(userData) {
        try {
            // Check if user already exists
            const existingUser = await User.findOne({ email: userData.email });
            if (existingUser) {
                throw new Error('User already exists');
            }

            // Create new user
            const user = await User.create(userData);
            
            // Generate JWT token
            const token = generateToken(user);

            // Return user data without password
            const userResponse = user.toJSON();
            
            logger.info('User registered successfully', { userId: user.id });
            return { user: userResponse, token };
        } catch (error) {
            logger.error('Error in registerUser service', { error: error.message });
            throw error;
        }
    }

    async loginUser(email, password) {
        try {
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

            // Generate JWT token
            const token = generateToken(user);

            // Return user data without password
            const userResponse = user.toJSON();
            
            logger.info('User logged in successfully', { userId: user.id });
            return { user: userResponse, token };
        } catch (error) {
            logger.error('Error in loginUser service', { error: error.message });
            throw error;
        }
    }

    async getUserById(userId) {
        try {
            const user = await User.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            return user.toJSON();
        } catch (error) {
            logger.error('Error in getUserById service', { error: error.message });
            throw error;
        }
    }

    async updateUserSettings(userId, settings) {
        try {
            const user = await User.findByIdAndUpdate(
                userId,
                { $set: { settings } },
                { new: true, runValidators: true }
            );
            
            if (!user) {
                throw new Error('User not found');
            }
            
            return user.toJSON();
        } catch (error) {
            logger.error('Error in updateUserSettings service', { error: error.message });
            throw error;
        }
    }

    async updateUserProfile(userId, userData) {
        try {
            const user = await User.findByIdAndUpdate(
                userId,
                { $set: userData },
                { new: true, runValidators: true }
            );
            
            if (!user) {
                throw new Error('User not found');
            }
            
            logger.info('User profile updated successfully', { userId });
            return user.toJSON();
        } catch (error) {
            logger.error('Error in updateUserProfile service', { error: error.message });
            throw error;
        }
    }
}

module.exports = new AuthService(); 