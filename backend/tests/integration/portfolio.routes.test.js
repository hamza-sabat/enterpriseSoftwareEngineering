const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../../src/core/models/User');
const Portfolio = require('../../src/core/models/Portfolio');
const jwt = require('jsonwebtoken');

// Mock the logger
jest.mock('../../src/utils/logger', () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    http: jest.fn()
  },
  stream: {
    write: jest.fn()
  }
}));

// Create Express app for testing
const express = require('express');
const cors = require('cors');
const { authenticate } = require('../../src/middleware/security/auth');
const portfolioRoutes = require('../../src/core/routes/portfolio');

// Setup environment variables for testing
process.env.JWT_SECRET = 'test_jwt_secret';

// Create a test app
const app = express();
app.use(express.json());
app.use(cors());

// Mock the authenticate middleware
jest.mock('../../src/middleware/security/auth', () => ({
  authenticate: jest.fn((req, res, next) => {
    // If auth header exists, set user and proceed
    if (req.headers.authorization) {
      req.user = { id: req.headers.authorization };
      return next();
    }
    // Otherwise return 401
    return res.status(401).json({ message: 'Unauthorized' });
  })
}));

// Setup error handler for tests
app.use((err, req, res, next) => {
  console.error('Test error:', err.message);
  res.status(500).json({ message: 'Server error during test' });
});

// Apply portfolio routes
app.use('/api/portfolio', portfolioRoutes);

// Setup in-memory MongoDB for testing
let mongoServer;
let testUser;
let testPortfolio;

// Increase the test timeout for slow systems
jest.setTimeout(30000);

beforeAll(async () => {
  // Start MongoDB memory server
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  // Connect mongoose to the memory server
  await mongoose.connect(mongoUri);
  
  console.log('MongoDB memory server connected');
});

afterAll(async () => {
  // Disconnect and stop the server
  await mongoose.disconnect();
  await mongoServer.stop();
  console.log('MongoDB memory server disconnected');
});

beforeEach(async () => {
  // Clear collections before each test
  await User.deleteMany({});
  await Portfolio.deleteMany({});
  
  // Create a test user
  testUser = await User.create({
    email: 'portfolio-test@example.com',
    password: 'Password1!',
    name: 'Portfolio Test User'
  });
  
  // Create a test portfolio
  testPortfolio = await Portfolio.create({
    user: testUser._id,
    name: 'Test Portfolio',
    holdings: [
      {
        cryptoId: '1',
        name: 'Bitcoin',
        symbol: 'BTC',
        amount: 1.5,
        purchasePrice: 40000
      }
    ]
  });
});

describe('Portfolio Routes', () => {
  describe('GET /api/portfolio', () => {
    it('should return user portfolio', async () => {
      // Make request with authentication
      const response = await request(app)
        .get('/api/portfolio')
        .set('Authorization', testUser._id.toString());
      
      // Check response
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('name', 'Test Portfolio');
      expect(response.body.holdings).toHaveLength(1);
      expect(response.body.holdings[0].symbol).toBe('BTC');
    });
    
    it('should return 401 without authentication', async () => {
      // Make request without authentication
      const response = await request(app)
        .get('/api/portfolio');
      
      // Check response
      expect(response.statusCode).toBe(401);
    });
  });
  
  describe('POST /api/portfolio/holdings', () => {
    it('should add a holding to portfolio', async () => {
      // Holding data
      const holdingData = {
        cryptoId: '2',
        name: 'Ethereum',
        symbol: 'ETH',
        amount: 10,
        purchasePrice: 2000
      };
      
      // Make request with authentication
      const response = await request(app)
        .post('/api/portfolio/holdings')
        .set('Authorization', testUser._id.toString())
        .send(holdingData);
      
      // Check response
      expect(response.statusCode).toBe(201);
      expect(response.body.holdings).toHaveLength(2);
      expect(response.body.holdings[1].symbol).toBe('ETH');
      expect(response.body.holdings[1].amount).toBe(10);
      
      // Verify in database
      const updatedPortfolio = await Portfolio.findOne({ user: testUser._id });
      expect(updatedPortfolio.holdings).toHaveLength(2);
    });
    
    it('should return 400 with invalid holding data', async () => {
      // Invalid holding data (missing required fields)
      const invalidData = {
        symbol: 'ETH',
        amount: 10
      };
      
      // Make request with authentication
      const response = await request(app)
        .post('/api/portfolio/holdings')
        .set('Authorization', testUser._id.toString())
        .send(invalidData);
      
      // Check response
      expect(response.statusCode).toBe(400);
    });
  });
  
  describe('PUT /api/portfolio/holdings/:id', () => {
    it('should update a holding', async () => {
      // Get the ID of the existing holding
      const holdingId = testPortfolio.holdings[0]._id.toString();
      
      // Update data
      const updateData = {
        amount: 2.5,
        purchasePrice: 38000
      };
      
      // Make request with authentication
      const response = await request(app)
        .put(`/api/portfolio/holdings/${holdingId}`)
        .set('Authorization', testUser._id.toString())
        .send(updateData);
      
      // Check response
      expect(response.statusCode).toBe(200);
      expect(response.body.holdings[0].amount).toBe(2.5);
      expect(response.body.holdings[0].purchasePrice).toBe(38000);
      
      // Verify in database
      const updatedPortfolio = await Portfolio.findOne({ user: testUser._id });
      expect(updatedPortfolio.holdings[0].amount).toBe(2.5);
    });
    
    it('should return 404 for non-existent holding', async () => {
      // Non-existent holding ID
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      
      // Make request with authentication
      const response = await request(app)
        .put(`/api/portfolio/holdings/${nonExistentId}`)
        .set('Authorization', testUser._id.toString())
        .send({ amount: 3.0 });
      
      // Check response
      expect(response.statusCode).toBe(404);
    });
  });
  
  describe('DELETE /api/portfolio/holdings/:id', () => {
    it('should delete a holding', async () => {
      // Get the ID of the existing holding
      const holdingId = testPortfolio.holdings[0]._id.toString();
      
      // Make request with authentication
      const response = await request(app)
        .delete(`/api/portfolio/holdings/${holdingId}`)
        .set('Authorization', testUser._id.toString());
      
      // Check response
      expect(response.statusCode).toBe(200);
      expect(response.body.holdings).toHaveLength(0);
      
      // Verify in database
      const updatedPortfolio = await Portfolio.findOne({ user: testUser._id });
      expect(updatedPortfolio.holdings).toHaveLength(0);
    });
    
    it('should return 404 for non-existent holding', async () => {
      // Non-existent holding ID
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      
      // Make request with authentication
      const response = await request(app)
        .delete(`/api/portfolio/holdings/${nonExistentId}`)
        .set('Authorization', testUser._id.toString());
      
      // Check response
      expect(response.statusCode).toBe(404);
    });
  });
}); 