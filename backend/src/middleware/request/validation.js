const { logger } = require('../../logging/logger');

/**
 * Middleware factory to validate incoming request data against a schema
 * @param {Object} schema - Joi schema to validate against
 * @returns {Function} Express middleware function
 */
const validateRequest = (schema) => {
  return (req, res, next) => {
    if (!schema) {
      return next();
    }

    const { error } = schema.validate(req.body);
    
    if (error) {
      logger.warn(`Validation error: ${error.message}`, {
        path: req.path,
        body: req.body,
        error: error.details
      });

      return res.status(400).json({
        success: false,
        message: error.details.map(detail => detail.message).join(', '),
        errors: error.details
      });
    }
    
    next();
  };
};

module.exports = {
  validateRequest
}; 