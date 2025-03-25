const { logger } = require('./logger');

/**
 * Create a new document
 * @param {Model} model - Mongoose model to create document for
 * @param {Object} data - Data to create document with
 * @returns {Promise<Object>} Created document
 */
const createDocument = async (model, data) => {
  try {
    const document = await model.create(data);
    logger.info(`Created new ${model.modelName}`, { id: document.id });
    return document;
  } catch (error) {
    logger.error(`Error creating ${model.modelName}`, { error: error.message });
    throw error;
  }
};

/**
 * Find a document by ID
 * @param {Model} model - Mongoose model to search
 * @param {string} id - Document ID
 * @returns {Promise<Object>} Found document
 */
const findById = async (model, id) => {
  try {
    const document = await model.findById(id);
    if (!document) {
      throw new Error(`${model.modelName} not found with id: ${id}`);
    }
    return document;
  } catch (error) {
    logger.error(`Error finding ${model.modelName}`, { id, error: error.message });
    throw error;
  }
};

/**
 * Update a document by ID
 * @param {Model} model - Mongoose model to update
 * @param {string} id - Document ID
 * @param {Object} data - Data to update document with
 * @returns {Promise<Object>} Updated document
 */
const updateById = async (model, id, data) => {
  try {
    const document = await model.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    );
    
    if (!document) {
      throw new Error(`${model.modelName} not found with id: ${id}`);
    }
    
    logger.info(`Updated ${model.modelName}`, { id });
    return document;
  } catch (error) {
    logger.error(`Error updating ${model.modelName}`, { id, error: error.message });
    throw error;
  }
};

/**
 * Delete a document by ID
 * @param {Model} model - Mongoose model to delete from
 * @param {string} id - Document ID
 * @returns {Promise<boolean>} True if document was deleted
 */
const deleteById = async (model, id) => {
  try {
    const result = await model.findByIdAndDelete(id);
    
    if (!result) {
      throw new Error(`${model.modelName} not found with id: ${id}`);
    }
    
    logger.info(`Deleted ${model.modelName}`, { id });
    return true;
  } catch (error) {
    logger.error(`Error deleting ${model.modelName}`, { id, error: error.message });
    throw error;
  }
};

/**
 * Find documents with pagination
 * @param {Model} model - Mongoose model to search
 * @param {Object} query - Query to filter documents
 * @param {Object} options - Options for pagination (page, limit, sort)
 * @returns {Promise<Object>} Paginated result {data, pagination}
 */
const findWithPagination = async (model, query = {}, options = {}) => {
  try {
    const page = parseInt(options.page) || 1;
    const limit = parseInt(options.limit) || 10;
    const skip = (page - 1) * limit;
    const sort = options.sort || { createdAt: -1 };
    
    const [data, total] = await Promise.all([
      model.find(query).sort(sort).skip(skip).limit(limit),
      model.countDocuments(query)
    ]);
    
    const totalPages = Math.ceil(total / limit);
    
    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
  } catch (error) {
    logger.error(`Error fetching ${model.modelName} with pagination`, {
      error: error.message,
      query,
      options
    });
    throw error;
  }
};

module.exports = {
  createDocument,
  findById,
  updateById,
  deleteById,
  findWithPagination
}; 