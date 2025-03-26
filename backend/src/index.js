const { logger } = require('./middleware/logging/logger');
const app = require('./app');

// Load environment variables
require('dotenv').config();

// Set port (default: 3001)
const PORT = process.env.PORT || 3001;

// Try to start the server with alternative port if in use
const startServer = (port) => {
  app.listen(port, () => {
    logger.info(`Server running on port ${port}`);
  }).on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      logger.warn(`Port ${port} is already in use, trying port ${port + 1}`);
      startServer(port + 1);
    } else {
      logger.error('Error starting server:', error);
      process.exit(1);
    }
  });
};

// Start the server
startServer(PORT);

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
}); 