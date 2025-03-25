const express = require('express');
const { logger } = require('../utils/logger');
const { authenticate } = require('../middleware/auth');
const Portfolio = require('../models/Portfolio');
const { createDocument } = require('../utils/database');

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
    const userId = req.user.id;
    
    // Find user's portfolio
    let portfolio = await Portfolio.findOne({ user: userId });
    
    // If no portfolio exists, create one
    if (!portfolio) {
      portfolio = await createDocument(Portfolio, {
        user: userId,
        name: 'My Portfolio',
        holdings: []
      });
      
      logger.info('Created new portfolio for user', { userId });
    }
    
    res.json(portfolio);
  } catch (error) {
    logger.error(`Get portfolio error: ${error.message}`);
    res.status(500).json({ error: 'Server error retrieving portfolio' });
  }
});

/**
 * @route POST /api/portfolio/holdings
 * @desc Add a cryptocurrency holding to portfolio
 * @access Private
 */
router.post('/holdings', async (req, res) => {
  try {
    const userId = req.user.id;
    const { cryptoId, name, symbol, amount, purchasePrice, purchaseDate, notes } = req.body;
    
    // Validate required fields
    if (!cryptoId || !name || !symbol) {
      return res.status(400).json({ error: 'Missing cryptocurrency information' });
    }
    
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Please provide a valid amount' });
    }
    
    if (!purchasePrice || isNaN(purchasePrice) || purchasePrice <= 0) {
      return res.status(400).json({ error: 'Please provide a valid purchase price' });
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
    
    // Check if holding already exists
    const existingHoldingIndex = portfolio.holdings.findIndex(
      h => h.cryptoId === cryptoId
    );

    if (existingHoldingIndex !== -1) {
      // Update existing holding with new amount
      const existingHolding = portfolio.holdings[existingHoldingIndex];
      const newAmount = existingHolding.amount + parseFloat(amount);
      const newTotalValue = (existingHolding.amount * existingHolding.purchasePrice) + 
                           (parseFloat(amount) * parseFloat(purchasePrice));
      
      // Calculate average purchase price
      const newPurchasePrice = newTotalValue / newAmount;
      
      portfolio.holdings[existingHoldingIndex].amount = newAmount;
      portfolio.holdings[existingHoldingIndex].purchasePrice = newPurchasePrice;
      portfolio.holdings[existingHoldingIndex].notes = notes || existingHolding.notes;

      logger.info('Updated existing holding', { 
        userId,
        symbol,
        newAmount,
        newPurchasePrice
      });
    } else {
      // Add the new holding
      portfolio.holdings.push({
        cryptoId,
        name,
        symbol,
        amount: parseFloat(amount),
        purchasePrice: parseFloat(purchasePrice),
        purchaseDate: purchaseDate || Date.now(),
        notes
      });

      logger.info('Added new holding', { userId, symbol, amount });
    }
    
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
    const userId = req.user.id;
    const { holdingId } = req.params;
    const { amount, purchasePrice, notes } = req.body;
    
    // Validate inputs
    if (amount !== undefined && (isNaN(amount) || amount < 0)) {
      return res.status(400).json({ error: 'Amount must be a positive number' });
    }
    
    if (purchasePrice !== undefined && (isNaN(purchasePrice) || purchasePrice < 0)) {
      return res.status(400).json({ error: 'Purchase price must be a positive number' });
    }
    
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
    if (amount !== undefined) portfolio.holdings[holdingIndex].amount = parseFloat(amount);
    if (purchasePrice !== undefined) portfolio.holdings[holdingIndex].purchasePrice = parseFloat(purchasePrice);
    if (notes !== undefined) portfolio.holdings[holdingIndex].notes = notes;
    
    await portfolio.save();
    
    logger.info('Updated holding', { userId, holdingId });
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
    const userId = req.user.id;
    const { holdingId } = req.params;
    
    // Find user's portfolio
    const portfolio = await Portfolio.findOne({ user: userId });
    
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    
    // Find the holding to remove
    const holdingIndex = portfolio.holdings.findIndex(h => h._id.toString() === holdingId);
    
    if (holdingIndex === -1) {
      return res.status(404).json({ error: 'Holding not found' });
    }
    
    // Remove the holding
    portfolio.holdings.splice(holdingIndex, 1);
    
    await portfolio.save();
    
    logger.info('Removed holding', { userId, holdingId });
    res.json(portfolio);
  } catch (error) {
    logger.error(`Delete holding error: ${error.message}`);
    res.status(500).json({ error: 'Server error removing holding' });
  }
});

module.exports = router; 