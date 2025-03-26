const portfolioService = require('../services/portfolioService');
const logger = require('../../utils/logger').logger;

class PortfolioController {
    async getPortfolio(req, res) {
        try {
            const portfolio = await portfolioService.getPortfolio(req.user.id);
            res.json(portfolio);
        } catch (error) {
            logger.error('Failed to get portfolio', { error: error.message });
            res.status(404).json({ error: error.message });
        }
    }

    async addHolding(req, res) {
        try {
            const portfolio = await portfolioService.addHolding(req.user.id, req.body);
            res.status(201).json(portfolio);
        } catch (error) {
            logger.error('Failed to add holding', { error: error.message });
            res.status(400).json({ error: error.message });
        }
    }

    async updateHolding(req, res) {
        try {
            const portfolio = await portfolioService.updateHolding(
                req.user.id,
                req.params.holdingId,
                req.body
            );
            res.json(portfolio);
        } catch (error) {
            logger.error('Failed to update holding', { error: error.message });
            res.status(400).json({ error: error.message });
        }
    }

    async deleteHolding(req, res) {
        try {
            const portfolio = await portfolioService.deleteHolding(
                req.user.id,
                req.params.holdingId
            );
            res.json(portfolio);
        } catch (error) {
            logger.error('Failed to delete holding', { error: error.message });
            res.status(400).json({ error: error.message });
        }
    }

    async updatePortfolioName(req, res) {
        try {
            const portfolio = await portfolioService.updatePortfolioName(
                req.user.id,
                req.body.name
            );
            res.json(portfolio);
        } catch (error) {
            logger.error('Failed to update portfolio name', { error: error.message });
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new PortfolioController(); 