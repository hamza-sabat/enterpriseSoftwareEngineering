const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const mongoose = require('./middleware/database/config');
const authRoutes = require('./core/routes/auth');
const portfolioRoutes = require('./core/routes/portfolio');
const marketRoutes = require('./core/routes/market');
const { logger } = require('./utils/logger');
const { rateLimiter } = require('./middleware/security/rateLimiter');
const { errorHandler } = require('./middleware/error/errorHandler');

// Load environment variables
require('dotenv').config();

// Initialize express app
const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000'
}));

// Rate limiting
app.use(rateLimiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Compression
app.use(compression());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    message: 'Server is running'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/market', marketRoutes);

// Error handling middleware
app.use(errorHandler);

module.exports = app; 