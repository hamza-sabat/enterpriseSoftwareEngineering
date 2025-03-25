const authService = require('../services/authService');
const logger = require('../utils/logger');

class AuthController {
    async register(req, res) {
        try {
            const { email, password, name } = req.body;
            
            const result = await authService.registerUser({
                email,
                password,
                name
            });
            
            res.status(201).json(result);
        } catch (error) {
            logger.error('Registration failed', { error: error.message });
            res.status(400).json({ error: error.message });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            
            const result = await authService.loginUser(email, password);
            
            res.json(result);
        } catch (error) {
            logger.error('Login failed', { error: error.message });
            res.status(401).json({ error: error.message });
        }
    }

    async getUserProfile(req, res) {
        try {
            const user = await authService.getUserById(req.user.id);
            res.json(user);
        } catch (error) {
            logger.error('Failed to get user profile', { error: error.message });
            res.status(404).json({ error: error.message });
        }
    }

    async updateUserSettings(req, res) {
        try {
            const user = await authService.updateUserSettings(req.user.id, req.body.settings);
            res.json(user);
        } catch (error) {
            logger.error('Failed to update user settings', { error: error.message });
            res.status(400).json({ error: error.message });
        }
    }

    async updateUserProfile(req, res) {
        try {
            const { name, email } = req.body;
            const userData = { name, email };
            
            const user = await authService.updateUserProfile(req.user.id, userData);
            res.json(user);
        } catch (error) {
            logger.error('Failed to update user profile', { error: error.message, userId: req.user.id });
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new AuthController(); 