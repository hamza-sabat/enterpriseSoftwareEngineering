const Portfolio = require('../models/Portfolio');
const logger = require('../utils/logger');

class PortfolioService {
    async getPortfolio(userId) {
        try {
            let portfolio = await Portfolio.findOne({ userId });
            
            // If no portfolio exists, create an empty one
            if (!portfolio) {
                portfolio = await Portfolio.create({
                    userId,
                    name: 'My Portfolio',
                    holdings: [],
                    totalInvestment: 0
                });
            }
            
            return portfolio;
        } catch (error) {
            logger.error('Error in getPortfolio service', { error: error.message });
            throw error;
        }
    }

    async addHolding(userId, holdingData) {
        try {
            let portfolio = await Portfolio.findOne({ userId });
            
            // If no portfolio exists, create one
            if (!portfolio) {
                portfolio = await Portfolio.create({
                    userId,
                    name: 'My Portfolio',
                    holdings: [],
                    totalInvestment: 0
                });
            }
            
            // Add new holding
            portfolio.holdings.push(holdingData);
            
            // Save and return updated portfolio
            await portfolio.save();
            return portfolio;
        } catch (error) {
            logger.error('Error in addHolding service', { error: error.message });
            throw error;
        }
    }

    async updateHolding(userId, holdingId, holdingData) {
        try {
            const portfolio = await Portfolio.findOne({ userId });
            if (!portfolio) {
                throw new Error('Portfolio not found');
            }
            
            // Find and update the holding
            const holdingIndex = portfolio.holdings.findIndex(
                holding => holding._id.toString() === holdingId
            );
            
            if (holdingIndex === -1) {
                throw new Error('Holding not found');
            }
            
            // Update holding data
            portfolio.holdings[holdingIndex] = {
                ...portfolio.holdings[holdingIndex].toObject(),
                ...holdingData
            };
            
            // Save and return updated portfolio
            await portfolio.save();
            return portfolio;
        } catch (error) {
            logger.error('Error in updateHolding service', { error: error.message });
            throw error;
        }
    }

    async deleteHolding(userId, holdingId) {
        try {
            const portfolio = await Portfolio.findOne({ userId });
            if (!portfolio) {
                throw new Error('Portfolio not found');
            }
            
            // Remove the holding
            portfolio.holdings = portfolio.holdings.filter(
                holding => holding._id.toString() !== holdingId
            );
            
            // Save and return updated portfolio
            await portfolio.save();
            return portfolio;
        } catch (error) {
            logger.error('Error in deleteHolding service', { error: error.message });
            throw error;
        }
    }

    async updatePortfolioName(userId, name) {
        try {
            const portfolio = await Portfolio.findOneAndUpdate(
                { userId },
                { name },
                { new: true, runValidators: true }
            );
            
            if (!portfolio) {
                throw new Error('Portfolio not found');
            }
            
            return portfolio;
        } catch (error) {
            logger.error('Error in updatePortfolioName service', { error: error.message });
            throw error;
        }
    }
}

module.exports = new PortfolioService(); 