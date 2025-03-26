const mongoose = require('mongoose');
const { logger } = require('../../middleware/logging/logger');

const holdingSchema = new mongoose.Schema({
  cryptoId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  symbol: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  purchasePrice: {
    type: Number,
    required: true,
    min: 0
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String
  }
});

const portfolioSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    default: 'My Portfolio'
  },
  holdings: [holdingSchema],
  totalInvestment: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate total investment before saving
portfolioSchema.pre('save', function(next) {
  try {
    // Calculate total investment
    this.totalInvestment = this.holdings.reduce((total, holding) => {
      return total + (holding.amount * holding.purchasePrice);
    }, 0);
    
    // Update the updatedAt field
    this.updatedAt = Date.now();
    next();
  } catch (error) {
    logger.error('Error in Portfolio pre-save hook', { error: error.message });
    next(error);
  }
});

// Create a virtual for the ID that can be included in JSON responses
portfolioSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

// Ensure virtual fields are serialized
portfolioSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

// Create the Portfolio model
const Portfolio = mongoose.model('Portfolio', portfolioSchema);

module.exports = Portfolio; 