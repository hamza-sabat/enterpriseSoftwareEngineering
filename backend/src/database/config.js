const mongoose = require('mongoose');
const { logger } = require('../utils/logger');
require('dotenv').config();

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/crypto_portfolio';

// MongoDB connection options
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Connect to MongoDB
mongoose.connect(MONGODB_URI, mongoOptions)
  .then(() => {
    logger.info('Connected to MongoDB Atlas successfully');
  })
  .catch((err) => {
    logger.error(`MongoDB connection error: ${err}`);
    process.exit(1);
  });

// Handle connection events
mongoose.connection.on('error', (err) => {
  logger.error(`MongoDB connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});

// If Node process ends, close the MongoDB connection
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  logger.info('MongoDB connection closed due to app termination');
  process.exit(0);
});

module.exports = mongoose; 