const winston = require('winston');
const path = require('path');

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Tell winston that we want to link the colors
winston.addColors(colors);

// Define the format for our logs
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// Define which transports we want to use
const transports = [
  // Write all logs with level 'error' and below to 'error.log'
  new winston.transports.File({
    filename: path.join(__dirname, '../../logs/error.log'),
    level: 'error',
  }),
  // Write all logs with level 'info' and below to 'combined.log'
  new winston.transports.File({
    filename: path.join(__dirname, '../../logs/combined.log'),
  }),
];

// If we're not in production, log to the console as well
if (process.env.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    })
  );
}

// Create the logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels,
  format,
  transports,
});

// Create a stream object with a write function that will be used by Morgan
const stream = {
  write: (message) => logger.http(message.trim()),
};

/**
 * Middleware to log incoming requests and their responses
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();
  const { method, originalUrl, ip } = req;
  
  // Log request details
  logger.info(`${method} ${originalUrl} - Request received`, {
    method,
    url: originalUrl,
    ip,
    userAgent: req.headers['user-agent'],
    userId: req.user ? req.user.id : 'unauthenticated'
  });
  
  // Capture original response methods
  const originalSend = res.send;
  const originalJson = res.json;
  
  // Override res.send
  res.send = function(body) {
    const duration = Date.now() - start;
    const size = body ? Buffer.byteLength(body instanceof Buffer ? body : String(body)) : 0;
    
    logger.info(`${method} ${originalUrl} ${res.statusCode} - ${duration}ms - ${size} bytes`, {
      method,
      url: originalUrl,
      status: res.statusCode,
      duration,
      responseSize: size,
      userId: req.user ? req.user.id : 'unauthenticated'
    });
    
    return originalSend.call(this, body);
  };
  
  // Override res.json
  res.json = function(body) {
    const duration = Date.now() - start;
    const size = body ? Buffer.byteLength(JSON.stringify(body)) : 0;
    
    logger.info(`${method} ${originalUrl} ${res.statusCode} - ${duration}ms - ${size} bytes`, {
      method,
      url: originalUrl,
      status: res.statusCode,
      duration,
      responseSize: size,
      userId: req.user ? req.user.id : 'unauthenticated'
    });
    
    return originalJson.call(this, body);
  };
  
  next();
};

module.exports = {
  logger,
  stream,
  requestLogger
}; 