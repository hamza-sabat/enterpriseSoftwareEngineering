const express = require('express');
const { authenticate } = require('../middleware/auth');
const Portfolio = require('../models/Portfolio');
const { logger } = require('../utils/logger');
const { createDocument, findById, updateById, deleteById, findWithPagination } = require('../utils/dbUtils');

const router = express.Router();

// Apply authentication middleware to all portfolio routes
router.use(authenticate);

/**
 * @route GET /api/portfolio
 * @desc Get user's portfolio
 * @access Private
 */
router.get('/', async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Find the user's portfolio
    let portfolio = await Portfolio.findOne({ user: userId });
    
    // If user doesn't have a portfolio yet, create an empty one
    if (!portfolio) {
      portfolio = await createDocument(Portfolio, {
        user: userId,
        name: 'My Portfolio',
        holdings: []
      });
    }
    
    res.json(portfolio);
  } catch (error) {
    logger.error(`Get portfolio error: ${error.message}`);
    res.status(500).json({ error: 'Server error getting portfolio' });
  }
});

/**
 * @route POST /api/portfolio/holdings
 * @desc Add a cryptocurrency holding to portfolio
 * @access Private
 */
router.post('/holdings', async (req, res) => {
  try {
    const userId = req.user._id;
    const { cryptoId, name, symbol, amount, purchasePrice, purchaseDate, notes } = req.body;
    
    // Validate required fields
    if (!cryptoId || !name || !symbol || !amount || !purchasePrice) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Find user's portfolio
    let portfolio = await Portfolio.findOne({ user: userId });
    
    // If no portfolio exists, create one
    if (!portfolio) {
      portfolio = await createDocument(Portfolio, {
        user: userId,
        name: 'My Portfolio',
        holdings: []
      });
    }
    
    // Add the new holding
    portfolio.holdings.push({
      cryptoId,
      name,
      symbol,
      amount,
      purchasePrice,
      purchaseDate: purchaseDate || Date.now(),
      notes
    });
    
    await portfolio.save();
    
    res.status(201).json(portfolio);
  } catch (error) {
    logger.error(`Add holding error: ${error.message}`);
    res.status(500).json({ error: 'Server error adding holding' });
  }
});

/**
 * @route PUT /api/portfolio/holdings/:holdingId
 * @desc Update a cryptocurrency holding
 * @access Private
 */
router.put('/holdings/:holdingId', async (req, res) => {
  try {
    const userId = req.user._id;
    const { holdingId } = req.params;
    const { amount, purchasePrice, notes } = req.body;
    
    // Find user's portfolio
    const portfolio = await Portfolio.findOne({ user: userId });
    
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    
    // Find the holding to update
    const holdingIndex = portfolio.holdings.findIndex(h => h._id.toString() === holdingId);
    
    if (holdingIndex === -1) {
      return res.status(404).json({ error: 'Holding not found' });
    }
    
    // Update the holding
    if (amount !== undefined) portfolio.holdings[holdingIndex].amount = amount;
    if (purchasePrice !== undefined) portfolio.holdings[holdingIndex].purchasePrice = purchasePrice;
    if (notes !== undefined) portfolio.holdings[holdingIndex].notes = notes;
    
    await portfolio.save();
    
    res.json(portfolio);
  } catch (error) {
    logger.error(`Update holding error: ${error.message}`);
    res.status(500).json({ error: 'Server error updating holding' });
  }
});

/**
 * @route DELETE /api/portfolio/holdings/:holdingId
 * @desc Remove a cryptocurrency holding
 * @access Private
 */
router.delete('/holdings/:holdingId', async (req, res) => {
  try {
    const userId = req.user._id;
    const { holdingId } = req.params;
    
    // Find user's portfolio
    const portfolio = await Portfolio.findOne({ user: userId });
    
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    
    // Remove the holding
    portfolio.holdings = portfolio.holdings.filter(h => h._id.toString() !== holdingId);
    
    await portfolio.save();
    
    res.json({ message: 'Holding removed', portfolio });
  } catch (error) {
    logger.error(`Delete holding error: ${error.message}`);
    res.status(500).json({ error: 'Server error removing holding' });
  }
});

module.exports = router; 