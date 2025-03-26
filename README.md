# Cryptocurrency Portfolio Management System

## Introduction

A full-stack web application for managing cryptocurrency portfolios, tracking market prices, and analyzing investment performance. This project demonstrates enterprise software engineering principles and practices.

### Solution Overview

The application is built using a modern tech stack with a focus on scalability, security, and user experience. It features a React-based frontend with Material UI, Node.js/Express backend, and MongoDB database with Mongoose ODM. The architecture follows a modular approach for maintainability and scalability.

### Project Aim & Objectives

**Main Goal**
To create a secure, scalable, and user-friendly platform for cryptocurrency portfolio management that enables users to track their investments, analyze market trends, and make informed investment decisions.

**Key Objectives**
1. Develop a comprehensive portfolio tracking system with real-time price updates and performance analytics
2. Create an intuitive market overview dashboard with search functionality and price trend indicators
3. Implement secure user authentication with profile management and customizable user settings
4. Build a responsive and user-friendly interface with Material UI components
5. Integrate with cryptocurrency APIs to provide accurate market data and portfolio valuations

## Completed Features

The application now includes all planned features:

- **User Authentication**: Secure login and registration with JWT tokens
- **Portfolio Management**: Add, edit, and remove cryptocurrency holdings
- **Portfolio Analytics**: 
  - Calculate current value, profit/loss, and performance metrics with visual charts
  - Search and filter holdings by name or symbol
  - Sort holdings by various criteria (value, price, profit, etc.)
  - Portfolio composition visualization with pie charts
- **Market Overview**: Browse cryptocurrency market data with search and sorting options
- **User Settings**: 
  - Profile information management
  - Dark mode toggle for UI customization
  - Currency selection (USD, EUR, GBP) that affects all financial displays
- **Responsive Design**: Mobile-friendly UI built with Material UI components

## Enterprise Considerations

### Performance
- Efficient MongoDB queries with proper schema design
- React's virtual DOM for optimized rendering
- Separation of concerns for maintainable and scalable code
- Optimized API calls with proper error handling
- Context API for state management to minimize re-renders
- Lazy loading components for improved initial load time

### Scalability
- Modular architecture for independent scaling of components
- Stateless authentication design
- Service-based backend structure
- MongoDB for flexible document storage
- Containerization-ready application structure

### Robustness
- Comprehensive error handling across all layers
- Graceful degradation for failed API calls
- Input validation and sanitization
- Automated testing suite for critical components
- Detailed logging for troubleshooting and monitoring

### Security
- JWT-based authentication
- Password hashing using bcrypt
- Input validation and sanitization
- CORS protection
- Rate limiting for API endpoints
- Environment variable management for secrets

### Deployment
- Primary deployment platform: Render (web services for backend, static sites for frontend)
- Containerization support with Docker and Docker Compose
- GitHub Actions for CI/CD pipeline automation with direct deployment to Render
- Environment-based configuration for development, testing, and production
- Detailed logging and monitoring with Winston and Morgan
- MongoDB Atlas for cloud database hosting
- AWS and Heroku as alternative deployment options

## Architecture

The application follows a three-tier architecture with clear separation of concerns:

### Frontend (User Interface)
```
frontend/
├── src/
    ├── components/     # Reusable UI components
    ├── pages/          # Main application views
    │   ├── Login.js    # Authentication interface
    │   ├── Market.js   # Cryptocurrency market view
    │   ├── Portfolio.js # User's portfolio management
    │   └── Settings.js # User preferences and settings
    ├── services/       # API integration services
    │   ├── api.js      # Base API client setup
    │   ├── authService.js # Authentication API methods
    │   ├── marketService.js # Market data API methods
    │   └── portfolioService.js # Portfolio API methods
    ├── context/        # React context providers
    │   ├── AuthContext.js # User authentication management
    │   ├── ThemeContext.js # Dark/light mode management
    │   └── CurrencyContext.js # Currency preferences and formatting
    ├── utils/          # Utility functions
    └── App.js          # Main application component
```

The frontend layer provides:
- An intuitive user interface with responsive design
- User preferences including dark/light mode and currency selection
- Real-time data visualization with charts and tables
- Client-side state management using React Context
- Consistent error handling and user feedback

### Backend / API

The backend is built with Node.js and Express, following a modular architecture that separates concerns and enables scalable development.

```
backend/src/
├── middleware/     # API middleware components
│   ├── auth.js     # Authentication middleware
│   ├── error.js    # Error handling middleware
│   ├── validation.js # Request validation
│   └── logger.js   # Request logging middleware
├── routes/         # API endpoint definitions
│   ├── auth.js     # Authentication routes
│   ├── market.js   # Market data routes
│   └── portfolio.js # Portfolio management routes
├── models/         # Database models and schemas
│   ├── User.js     # User schema with authentication
│   └── Portfolio.js # Portfolio schema with holdings
├── controllers/    # Route handler controllers
│   ├── authController.js # Authentication logic
│   ├── marketController.js # Market data logic
│   └── portfolioController.js # Portfolio management logic
├── services/       # Business logic services
│   ├── authService.js # Authentication operations
│   ├── marketService.js # Market data operations
│   └── portfolioService.js # Portfolio calculations
├── utils/          # Shared utilities
│   ├── logger.js   # Logging service
│   ├── apiError.js # Custom error classes
│   └── validators.js # Input validation utilities
├── config/         # Configuration management
│   └── database.js # Database connection setup
├── app.js          # Express application setup
└── index.js        # Server initialization
```

The backend implements a layered architecture:

1. **Routes Layer**: Defines API endpoints and maps them to controllers
2. **Controller Layer**: Handles request processing and orchestrates service calls
3. **Service Layer**: Contains core business logic and external integrations
4. **Data Access Layer**: Models and database interactions

This architecture provides:
- Clear separation of concerns
- Modular and testable components
- Simplified maintenance and feature extensions
- Consistent error handling across the application

#### Database Implementation

The application uses MongoDB with Mongoose ODM for data persistence, providing a flexible, schema-based solution:

- **User Model**: Manages user authentication, profile information, and application settings.
  - Includes secure password hashing with bcrypt
  - Implements methods for validating credentials
  - Stores user preferences like theme and currency settings
  - Example schema:
  ```javascript
  const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true, minlength: 8 },
    settings: {
      theme: { type: String, enum: ['light', 'dark'], default: 'light' },
      currency: { type: String, enum: ['USD', 'EUR', 'GBP'], default: 'USD' },
      notifications: { type: Boolean, default: true }
    }
  }, { timestamps: true });
  ```

- **Portfolio Model**: Handles cryptocurrency holdings and investment tracking.
  - Schema includes holdings with cryptoId, amount, purchase price, and date
  - Pre-save hooks calculate total investment values
  - Supports custom methods for portfolio analytics
  - Example schema:
  ```javascript
  const portfolioSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, default: 'My Portfolio' },
    holdings: [{
      cryptoId: { type: String, required: true },
      name: { type: String, required: true },
      symbol: { type: String, required: true },
      amount: { type: Number, required: true },
      purchasePrice: { type: Number, required: true },
      purchaseDate: { type: Date, default: Date.now },
      notes: { type: String }
    }],
    totalInvestment: { type: Number, default: 0 }
  }, { timestamps: true });
  ```

#### Services Layer

The services layer encapsulates business logic and external API integrations, providing a clean abstraction from controllers:

- **Auth Service**: Handles JWT token generation, validation, and user authentication
  - User registration with data validation
  - Password hashing and comparison
  - JWT token generation with expiration
  - Profile update operations
  - Example methods: `registerUser`, `authenticateUser`, `generateToken`, `updateUserSettings`

- **Market Service**: Integrates with cryptocurrency APIs to fetch market data
  - Cryptocurrency listings with pricing and market data
  - Global market metrics and statistics
  - Price conversion and historical data
  - Implements caching for frequent requests
  - Example methods: `getListings`, `getGlobalMetrics`, `getCryptocurrencyDetails`

- **Portfolio Service**: Implements portfolio calculations and investment tracking logic
  - CRUD operations for holdings management
  - Performance calculation with real-time market data
  - Historical performance tracking
  - Asset allocation analysis
  - Example methods: `getPortfolio`, `addHolding`, `removeHolding`, `calculatePerformance`

#### Controllers & Routes

The application uses a RESTful API design with controllers that handle request processing, validation, and response formatting:

- **Auth Controller/Routes**: `/api/auth/`
  - `POST /api/auth/register`: User registration
  - `POST /api/auth/login`: User authentication and token generation
  - `GET /api/auth/me`: Get authenticated user profile
  - `PUT /api/auth/profile`: Update user profile
  - `PUT /api/auth/password`: Change user password
  - `PUT /api/auth/settings`: Update user settings

- **Market Controller/Routes**: `/api/market/`
  - `GET /api/market/listings`: Get cryptocurrency listings with filters
  - `GET /api/market/global`: Get global market metrics
  - `GET /api/market/crypto/:id`: Get detailed data for a specific cryptocurrency
  - `GET /api/market/search`: Search cryptocurrencies by name or symbol

- **Portfolio Controller/Routes**: `/api/portfolio/`
  - `GET /api/portfolio`: Get user's portfolio data
  - `POST /api/portfolio/holdings`: Add a new holding
  - `PUT /api/portfolio/holdings/:id`: Update an existing holding
  - `DELETE /api/portfolio/holdings/:id`: Remove a holding
  - `GET /api/portfolio/performance`: Get portfolio performance metrics

#### Error Handling & Logging

The backend implements comprehensive error handling to ensure consistent API responses and proper debugging information:

- **Centralized Error Handling**:
  - Custom error classes for different types of errors (AuthError, ValidationError, etc.)
  - Global error handling middleware that formats error responses
  - Consistent error structure across all API endpoints
  - Example error response:
  ```json
  {
    "error": {
      "message": "Authentication required",
      "code": "AUTH_REQUIRED",
      "status": 401
    }
  }
  ```

- **Logging System**:
  - Winston-based logging with different levels (info, error, debug)
  - File and console transports for development and production
  - Request/response logging for API calls
  - Error stack traces for debugging
  - Log rotation for production environments

- **Validation**:
  - Request data validation using Joi or Express-validator
  - Input sanitization to prevent security vulnerabilities
  - Detailed validation error messages for client feedback

## Middleware Layer

The middleware layer plays a critical role in the application architecture, functioning as the intermediary processing layer between incoming requests and route handlers. This layer enhances the application's security, performance, and maintainability.

### Key Middleware Components

- **Authentication Middleware**: Validates JWT tokens to ensure users are authenticated before accessing protected routes. This middleware extracts user information from tokens and makes it available to route handlers.
  ```javascript
  const authenticate = async (req, res, next) => {
    try {
      // Extract token from request header
      const token = req.header('Authorization')?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ error: { message: 'Authentication required', code: 'AUTH_REQUIRED' } });
      }
      
      // Verify token and extract user data
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Look up user in database to confirm they exist
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ error: { message: 'User not found', code: 'USER_NOT_FOUND' } });
      }
      
      // Make user data available for route handlers
      req.user = user;
      next();
    } catch (error) {
      logger.error(`Authentication error: ${error.message}`);
      res.status(401).json({ error: { message: 'Invalid authentication token', code: 'INVALID_TOKEN' } });
    }
  };
  ```

- **Error Handling Middleware**: Provides centralized error processing, ensuring consistent error responses across the API and proper logging of errors for troubleshooting.
  ```javascript
  const errorHandler = (err, req, res, next) => {
    // Log the error
    logger.error(`${err.name}: ${err.message}`, { stack: err.stack });
    
    // Set default status code and message
    let statusCode = err.statusCode || 500;
    let errorMessage = err.message || 'Internal Server Error';
    let errorCode = err.code || 'SERVER_ERROR';
    
    // Handle specific error types
    if (err.name === 'ValidationError') {
      statusCode = 400;
      errorMessage = err.message;
      errorCode = 'VALIDATION_ERROR';
    } else if (err.name === 'JsonWebTokenError') {
      statusCode = 401;
      errorMessage = 'Invalid token';
      errorCode = 'INVALID_TOKEN';
    }
    
    // Send error response
    res.status(statusCode).json({
      error: {
        message: errorMessage,
        code: errorCode,
        status: statusCode
      }
    });
  };
  ```

- **Request Validation Middleware**: Validates incoming request data against defined schemas to ensure data integrity before it reaches the database or business logic.
  ```javascript
  const validateRequest = (schema) => {
    return (req, res, next) => {
      const { error } = schema.validate(req.body);
      
      if (error) {
        return res.status(400).json({
          error: {
            message: error.details.map(detail => detail.message).join(', '),
            code: 'VALIDATION_ERROR',
            status: 400
          }
        });
      }
      
      next();
    };
  };
  ```

- **Logging Middleware**: Records API requests and responses for monitoring, debugging, and audit purposes using Winston logger.
  ```javascript
  const requestLogger = (req, res, next) => {
    const start = Date.now();
    
    // Log request details
    logger.info(`${req.method} ${req.originalUrl}`, {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userId: req.user ? req.user._id : 'unauthenticated'
    });
    
    // Capture response
    const originalSend = res.send;
    res.send = function(body) {
      const duration = Date.now() - start;
      
      // Log response details
      logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`, {
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        duration: duration,
        userId: req.user ? req.user._id : 'unauthenticated'
      });
      
      return originalSend.call(this, body);
    };
    
    next();
  };
  ```

- **CORS Middleware**: Manages Cross-Origin Resource Sharing to control which domains can interact with the API, enhancing security.
  ```javascript
  const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS.split(','),
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400 // 24 hours
  };
  
  app.use(cors(corsOptions));
  ```

- **Rate Limiting Middleware**: Prevents abuse of the API by limiting the number of requests from a single client within a specified time window.
  ```javascript
  const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
      error: {
        message: 'Too many requests, please try again later.',
        code: 'RATE_LIMIT_EXCEEDED',
        status: 429
      }
    }
  });
  
  // Apply rate limiting to all routes
  app.use('/api/', rateLimiter);
  ```

### Middleware Pipeline

The middleware components are arranged in a pipeline where each request passes through a series of processing steps:

1. **Request Logging**: Log incoming request details
2. **CORS Handling**: Process cross-origin requests
3. **Body Parsing**: Parse JSON and URL-encoded bodies
4. **Rate Limiting**: Apply request rate limits
5. **Authentication**: Validate user tokens (for protected routes)
6. **Request Validation**: Validate request data
7. **Route Handler**: Process the request in the appropriate controller
8. **Error Handling**: Catch and process any errors
9. **Response**: Send the response back to the client

This structured approach ensures that each request is properly processed, validated, and secured before reaching the business logic.

### Middleware Registration

Middleware is registered in the Express application in a specific order to create the processing pipeline:

```javascript
// app.js
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { requestLogger, errorHandler } = require('./middleware');
const routes = require('./routes');

const app = express();

// Global middleware (applied to all routes)
app.use(requestLogger);
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', rateLimiter);

// API routes with their specific middleware
app.use('/api/auth', require('./routes/auth'));
app.use('/api/market', require('./routes/market'));
app.use('/api/portfolio', authenticate, require('./routes/portfolio'));

// Error handling middleware (must be registered last)
app.use(errorHandler);
```

Protected routes use the authentication middleware at the router level:

```javascript
// routes/portfolio.js
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');
const portfolioController = require('../controllers/portfolioController');
const { portfolioSchema } = require('../utils/validators');

// All routes in this router require authentication
router.use(authenticate);

router.get('/', portfolioController.getPortfolio);
router.post('/holdings', validateRequest(portfolioSchema), portfolioController.addHolding);
// ... other routes

module.exports = router;
```

This organization allows for:
- Global middleware that applies to all requests
- Route-specific middleware for protecting certain endpoints
- Specific validation for each endpoint type
- Centralized error handling

## Installation & Usage Instructions

### Prerequisites

To run this application, you'll need the following technologies installed on your system:

- **Node.js** (v14.0.0 or higher)
- **npm** (v6.0.0 or higher) or **yarn** (v1.22.0 or higher)
- **MongoDB** (v4.4 or higher)
- **Git** (for cloning the repository)

### Setup Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/crypto-portfolio.git
   cd crypto-portfolio
   ```

2. **Install dependencies**:
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   # or with yarn
   # yarn install

   # Install frontend dependencies
   cd ../frontend
   npm install
   # or with yarn
   # yarn install
   ```

3. **Configure environment variables**:

   Create `.env` files in both the backend and frontend directories:

   **Backend (.env)**:
   ```
   # Server configuration
   PORT=3001
   NODE_ENV=development

   # Database configuration
   MONGODB_URI=mongodb://localhost:27017/crypto_portfolio
   
   # Authentication
   JWT_SECRET=your_secure_jwt_secret_key
   JWT_EXPIRATION=7d
   
   # API keys for external services (if applicable)
   CRYPTO_API_KEY=your_api_key_here
   
   # CORS settings
   ALLOWED_ORIGINS=http://localhost:3000
   ```

   **Frontend (.env)**:
   ```
   REACT_APP_API_URL=http://localhost:3001/api
   REACT_APP_ENV=development
   ```

4. **Set up MongoDB**:
   - Make sure MongoDB is running on your system
   - The application will automatically create the required database and collections

### Running the Application

1. **Start the backend server**:
   ```bash
   cd backend
   npm run dev
   # or with yarn
   # yarn dev
   ```
   The server will start at: `http://localhost:3001`

2. **Start the frontend development server**:
   ```bash
   cd frontend
   npm start
   # or with yarn
   # yarn start
   ```
   The application will open at: `http://localhost:3000`

### Testing the Application

1. **Run backend tests**:
   ```bash
   cd backend
   npm test
   # or with yarn
   # yarn test
   ```

2. **Run frontend tests**:
   ```bash
   cd frontend
   npm test
   # or with yarn
   # yarn test
   ```

### Building for Production

1. **Build the frontend**:
   ```bash
   cd frontend
   npm run build
   # or with yarn
   # yarn build
   ```

2. **Run in production mode**:
   ```bash
   # Backend in production mode
   cd backend
   npm run start
   # or with yarn
   # yarn start
   ```

### Deploying to Render

The application is configured for easy deployment to Render:

1. **Backend Deployment**:
   - Create a new Web Service on Render
   - Connect your GitHub repository
   - Use the following settings:
     - Runtime: Node
     - Build Command: `cd backend && npm install`
     - Start Command: `cd backend && npm start`
   - Add environment variables from your backend `.env` file
   - For MongoDB, use MongoDB Atlas or Render's managed PostgreSQL with an adapter

2. **Frontend Deployment**:
   - Create a new Static Site on Render
   - Connect your GitHub repository
   - Use the following settings:
     - Build Command: `cd frontend && npm install && npm run build`
     - Publish Directory: `frontend/build`
   - Add an environment variable: `REACT_APP_API_URL=https://your-backend-service-url.onrender.com/api`

3. **Connect Frontend to Backend**:
   - After deploying both services, update the frontend's REACT_APP_API_URL to point to your backend service URL
   - If needed, update the CORS settings in your backend to allow your frontend's domain

The Render deployment will automatically handle building and deploying your application whenever you push changes to your GitHub repository.

### Troubleshooting

- **MongoDB Connection Issues**: Ensure MongoDB is running and the connection string in the backend `.env` file is correct
- **API Request Errors**: Check that the frontend `.env` file has the correct API URL pointing to your backend
- **JWT Authentication Errors**: Verify that the JWT_SECRET is set correctly and is the same across backend restarts

### API Documentation

The API is available at `http://localhost:3001/api` with the following main endpoints:
- `/api/auth` - Authentication endpoints
- `/api/market` - Market data endpoints
- `/api/portfolio` - Portfolio management endpoints

## Feature Overview

### Authentication System
- **Purpose**: Secure user authentication with JWT tokens and password hashing
- **Location**: `frontend/src/pages/Login.js` & `backend/src/routes/auth.js`
- **Key Components**:
  - JWT token-based authentication
  - Password hashing with bcrypt
  - Login and registration forms with validation
  - Endpoints: `/api/auth/login`, `/api/auth/register`, `/api/auth/me`

### Market Overview
- **Purpose**: Display real-time cryptocurrency market data with search and filtering capabilities
- **Location**: `frontend/src/pages/Market.js` & `backend/src/routes/market.js`
- **Key Components**:
  - Real-time cryptocurrency prices and market trends
  - Search and filtering functionality
  - Sorting options by various metrics
  - 24h change indicators with visual cues
  - Currency formatting based on user preferences
  - Endpoints: `/api/market/listings`, `/api/market/global`, `/api/market/search`

### Portfolio Management
- **Purpose**: Track cryptocurrency holdings with real-time valuations and performance metrics
- **Location**: `frontend/src/pages/Portfolio.js` & `backend/src/routes/portfolio.js`
- **Key Components**:
  - Add, edit, and remove cryptocurrency holdings
  - Automatic calculation of current values and profit/loss
  - Performance metrics including total portfolio value
  - Visual charts for portfolio composition
  - Search and sort functionality for holdings
  - Best and worst performers identification
  - Endpoints: `/api/portfolio`, `/api/portfolio/holdings/:id`

### User Settings
- **Purpose**: Manage user preferences including appearance and currency display options
- **Location**: `frontend/src/pages/Settings.js`
- **Key Components**:
  - Profile information management
  - Dark mode toggle with persistent preferences
  - Currency selection (USD, EUR, GBP) with persistent preferences
  - Password management with security validation

## Known Issues & Future Enhancements

### Current Limitations

- **Live Updates**: Portfolio values are currently updated only on page refresh or manual update, not live to the second.
- **Market Data Frequency**: Market data is fetched from external APIs with rate limiting considerations.
- **Mobile Responsiveness**: While the UI is responsive, some complex data tables may require optimization for very small screens.
- **Browser Support**: The application is optimized for modern browsers; some features may have limited functionality in older browsers.

### Planned Enhancements

1. **Historical Performance Tracking**
   - Track portfolio value over time with historical charts
   - Implement date range selection for performance analysis
   - Compare performance against market benchmarks

2. **Advanced Analytics Dashboard**
   - Create visual representations of portfolio performance over time
   - Implement asset allocation charts and distribution analysis 
   - Add risk assessment metrics (volatility, drawdown, etc.)
   - Portfolio diversification recommendations

3. **Notification System**
   - Develop price alerts for user-defined thresholds
   - Implement email and in-app notifications
   - Add scheduled reports and performance summaries

4. **API Enhancements**
   - Implement caching strategies to reduce external API calls
   - Add more robust error handling for API failures
   - Expand market data sources for more comprehensive coverage
   - Real-time price updates using WebSockets

5. **Additional Settings & Customization**
   - Add more currency options beyond USD, EUR, and GBP
   - Implement additional UI theme options
   - Create customizable dashboards for personalized user experience
   - User-defined portfolio categories and tags

## Architecture

The application follows a three-tier architecture with clear separation of concerns:

### Frontend (User Interface)
```
frontend/
├── src/
    ├── components/     # Reusable UI components
    ├── pages/          # Main application views
    │   ├── Login.js    # Authentication interface
    │   ├── Market.js   # Cryptocurrency market view
    │   ├── Portfolio.js # User's portfolio management
    │   └── Settings.js # User preferences and settings
    ├── services/       # API integration services
    │   ├── api.js      # Base API client setup
    │   ├── authService.js # Authentication API methods
    │   ├── marketService.js # Market data API methods
    │   └── portfolioService.js # Portfolio API methods
    ├── context/        # React context providers
    │   ├── AuthContext.js # User authentication management
    │   ├── ThemeContext.js # Dark/light mode management
    │   └── CurrencyContext.js # Currency preferences and formatting
    ├── utils/          # Utility functions
    └── App.js          # Main application component
```

### Backend / API

The backend is built with Node.js and Express, following a modular architecture that separates concerns and enables scalable development.

```
backend/src/
├── middleware/     # API middleware components
│   ├── auth.js     # Authentication middleware
│   ├── error.js    # Error handling middleware
│   ├── validation.js # Request validation
│   └── logger.js   # Request logging middleware
├── routes/         # API endpoint definitions
│   ├── auth.js     # Authentication routes
│   ├── market.js   # Market data routes
│   └── portfolio.js # Portfolio management routes
├── models/         # Database models and schemas
│   ├── User.js     # User schema with authentication
│   └── Portfolio.js # Portfolio schema with holdings
├── controllers/    # Route handler controllers
│   ├── authController.js # Authentication logic
│   ├── marketController.js # Market data logic
│   └── portfolioController.js # Portfolio management logic
├── services/       # Business logic services
│   ├── authService.js # Authentication operations
│   ├── marketService.js # Market data operations
│   └── portfolioService.js # Portfolio calculations
├── utils/          # Shared utilities
│   ├── logger.js   # Logging service
│   ├── apiError.js # Custom error classes
│   └── validators.js # Input validation utilities
├── config/         # Configuration management
│   └── database.js # Database connection setup
├── app.js          # Express application setup
└── index.js        # Server initialization
```

## Project Structure

```
crypto-portfolio/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   │   ├── AuthContext.js
│   │   │   ├── ThemeContext.js
│   │   │   └── CurrencyContext.js
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   └── App.js
│   └── package.json
├── backend/
│   ├── logs/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.