const mongoose = require('mongoose');
const { logger } = require('./logger');

/**
 * Run a function within a MongoDB session transaction
 * @param {Function} callback - Async function that runs within the transaction
 * @returns {Promise<any>} - Result of the callback function
 */
async function runTransaction(callback) {
  const session = await mongoose.startSession();
  
  try {
    session.startTransaction();
    const result = await callback(session);
    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    logger.error(`Transaction error: ${error.message}`);
    throw error;
  } finally {
    session.endSession();
  }
}

/**
 * Create a new document in the specified model
 * @param {mongoose.Model} model - Mongoose model
 * @param {Object} data - Data to insert
 * @returns {Promise<mongoose.Document>} - Created document
 */
async function createDocument(model, data) {
  try {
    const newDocument = new model(data);
    await newDocument.save();
    return newDocument;
  } catch (error) {
    logger.error(`Error creating document: ${error.message}`);
    throw error;
  }
}

/**
 * Find document by ID
 * @param {mongoose.Model} model - Mongoose model
 * @param {string} id - Document ID
 * @returns {Promise<mongoose.Document>} - Found document
 */
async function findById(model, id) {
  try {
    const document = await model.findById(id);
    return document;
  } catch (error) {
    logger.error(`Error finding document by ID: ${error.message}`);
    throw error;
  }
}

/**
 * Update document by ID
 * @param {mongoose.Model} model - Mongoose model
 * @param {string} id - Document ID
 * @param {Object} data - Update data
 * @returns {Promise<mongoose.Document>} - Updated document
 */
async function updateById(model, id, data) {
  try {
    const updatedDocument = await model.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );
    return updatedDocument;
  } catch (error) {
    logger.error(`Error updating document: ${error.message}`);
    throw error;
  }
}

/**
 * Delete document by ID
 * @param {mongoose.Model} model - Mongoose model
 * @param {string} id - Document ID
 * @returns {Promise<boolean>} - Success status
 */
async function deleteById(model, id) {
  try {
    const result = await model.findByIdAndDelete(id);
    return !!result;
  } catch (error) {
    logger.error(`Error deleting document: ${error.message}`);
    throw error;
  }
}

/**
 * Find documents with pagination
 * @param {mongoose.Model} model - Mongoose model
 * @param {Object} query - Query conditions
 * @param {Object} options - Pagination options
 * @returns {Promise<{data: Array<mongoose.Document>, total: number}>} - Paginated results
 */
async function findWithPagination(model, query = {}, options = {}) {
  const { page = 1, limit = 10, sort = { _id: 1 } } = options;
  const skip = (page - 1) * limit;
  
  try {
    const [data, total] = await Promise.all([
      model.find(query).sort(sort).skip(skip).limit(limit),
      model.countDocuments(query)
    ]);
    
    return {
      data,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    };
  } catch (error) {
    logger.error(`Error finding documents with pagination: ${error.message}`);
    throw error;
  }
}

module.exports = {
  runTransaction,
  createDocument,
  findById,
  updateById,
  deleteById,
  findWithPagination
}; 