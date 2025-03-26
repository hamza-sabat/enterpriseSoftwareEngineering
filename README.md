# Cryptocurrency Portfolio Management System

## Introduction

A full-stack web application for managing cryptocurrency portfolios, tracking market prices, and analyzing investment performance. This project demonstrates enterprise software engineering principles and practices.

## Solution Overview

This Cryptocurrency Portfolio Manager is a full-stack web application that provides comprehensive tools for managing cryptocurrency investments. The application is built with a **clear separation between layers**:

1. **React Frontend** - Modern, responsive UI built with React.js
2. **Express Middleware Layer** - Request processing, validation, and security
3. **Backend Services Layer** - Core business logic and data operations
4. **MongoDB Backend** - Data persistence and storage

The application allows users to track their cryptocurrency investments, view real-time market data, and analyze portfolio performance through an intuitive dashboard interface.

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

### Architecture

The application follows a **distinct three-layer architecture** that ensures separation of concerns:

#### Frontend Layer (React.js)
- **Technology**: Built with React.js, React Router, and Context API
- **Location**: `/frontend` directory
- **Responsibility**: User interface, state management, and API communication
- **Key Components**: 
  - React components (`/frontend/src/components`)
  - Pages (`/frontend/src/pages`)
  - Context providers (`/frontend/src/context`)
  - API service clients (`/frontend/src/services`)
  - **App.js**: Central routing configuration that defines the application's navigation flow using React Router with protected routes and context providers

#### Middleware Layer (Express.js)
- **Technology**: Express.js middleware functions
- **Location**: `/backend/src/middleware` directory
- **Responsibility**: Request processing, authentication, validation, error handling, logging, caching
- **Key Components**:
  - **Security** (`middleware/security/`): 
    - Authentication middleware with JWT (`auth.js`)
    - Rate limiting to prevent abuse (`rateLimiter.js`)
    - CORS configuration for cross-origin requests (`cors.js`)
  - **Performance** (`middleware/performance/`): 
    - Response caching for improved performance (`cache.js`)
  - **Logging** (`middleware/logging/`): 
    - Winston logger configuration (`logger.js`)
    - Request/response logging functionality
  - **Error Handling** (`middleware/error/`): 
    - Centralized error processing (`errorHandler.js`)
  - **Database** (`middleware/database/`): 
    - MongoDB connection management (`config.js`)
  - **Request Processing** (`middleware/request/`): 
    - Input validation middleware (`validation.js`)

#### Services Layer
- **Technology**: Node.js service modules
- **Location**: `/backend/src/services` directory
- **Responsibility**: Business logic implementation, external API interactions
- **Key Components**:
  - Authentication services (`/backend/src/services/auth.js`)
  - Market data services (`/backend/src/services/market.js`) 
  - Portfolio calculation services (`/backend/src/services/portfolio.js`)

#### Backend Core (Business Logic)
- **Technology**: Node.js, Express.js, Mongoose
- **Location**: `/backend/src/core` directory
- **Responsibility**: Business logic, data manipulation, API endpoints
- **Key Components**:
  - **Models** (`core/models/`): 
    - MongoDB schemas and models (`User.js`, `Portfolio.js`)
  - **Controllers** (`core/controllers/`): 
    - Route handler logic (`authController.js`, `portfolioController.js`)
  - **Services** (`core/services/`): 
    - Business logic implementation (`authService.js`, `marketService.js`)
  - **Routes** (`core/routes/`): 
    - API endpoint definitions (`auth.js`, `portfolio.js`)
  - **Utilities** (`core/utils/`): 
    - Business logic utilities and helpers (`database.js`, `dbUtils.js`)

This clear separation ensures maintainability, testability, and scalability.

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
│   ├── security/   # Authentication, rate limiting, CORS
│   ├── performance/ # Caching, compression
│   ├── logging/    # Logger configuration and request logging
│   ├── error/      # Error handling middleware
│   ├── database/   # Database connection management
│   ├── request/    # Request validation and processing
│   └── index.js    # Middleware exports and configuration
├── core/             # Core backend business logic
│   ├── controllers/  # Route handler controllers
│   ├── models/       # Database models and schemas
│   ├── routes/       # API endpoint definitions
│   ├── services/     # Business logic services
│   └── utils/        # Backend utility functions
├── app.js            # Express application setup
└── index.js          # Server initialization
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

### Middleware Implementation

The application implements middleware at different levels:

1. **Global Middleware (app.js)**: Applied to all routes
   - Helmet (security headers)
   - CORS configuration
   - Global rate limiting
   - Body parsing (express.json and urlencoded)
   - Compression
   - Basic error handling

2. **Route-Level Middleware**: Applied to specific route groups
   - Authentication middleware for protected routes
   
3. **Custom Middleware Files**:
   - Authentication (`backend/src/middleware/security/auth.js`)
   - Cache management (`backend/src/middleware/performance/cache.js`)
   - Rate limiting (`backend/src/middleware/security/rateLimiter.js`)
   - CORS configuration (`backend/src/middleware/security/cors.js`)
   - Request logging (`backend/src/middleware/logging/logger.js`)
   - Error handling (`backend/src/middleware/error/errorHandler.js`)
   - Request validation (`backend/src/middleware/request/validation.js`)

### Key Middleware Components

#### Authentication Middleware (auth.js)
Validates JWT tokens and provides user identification:
```javascript
// auth.js
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Extract and verify token
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Find user by id from token
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found or token invalid' });
    }
    
    // Add user to request object
    req.user = { id: user._id, email: user.email, role: user.role };
    
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed' });
  }
};
```

#### Cache Middleware (cache.js)
Improves performance by caching API responses:
```javascript
// cache.js
const cacheMiddleware = (ttl = 300) => {
  return (req, res, next) => {
    // Skip caching for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }
    
    // Generate cache key and check for cached response
    const cacheKey = `${req.originalUrl || req.url}`;
    const cachedResponse = cache.get(cacheKey);
    
    if (cachedResponse) {
      return res.json(cachedResponse);
    }
    
    // Override res.json to cache successful responses
    const originalJson = res.json;
    res.json = function(body) {
      res.json = originalJson;
      
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cache.set(cacheKey, body, ttl);
      }
      
      return res.json(body);
    };
    
    next();
  };
};
```

#### Rate Limiting (rateLimiter.js & app.js)
Prevents API abuse by limiting request frequency:
```javascript
// rateLimiter.js
const rateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  standardHeaders: true,
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      message: 'Too many requests, please try again later.',
    });
  },
});
```

#### Error Handling (app.js)
Centralized error handling to provide consistent responses:
```javascript
// app.js
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`);
  res.status(500).json({ message: 'Server error' });
});
```

### Middleware Registration

Middleware is registered in the Express application in a specific order:

```javascript
// app.js
// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000'
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
});
app.use(limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Compression
app.use(compression());
```

For routes that require authentication, the middleware is applied at the router level:

```javascript
// routes/portfolio.js
const router = express.Router();

// Apply authentication middleware to all portfolio routes
router.use(authenticate);

// Route handlers follow...
```

This organization ensures that:
1. Security measures are applied first
2. Body parsing happens before route processing
3. Authentication is applied only to routes that need it
4. Error handling catches any issues in the pipeline

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
- **Purpose**: Secure user authentication with JWT tokens and password hashing, providing seamless login/signup experience and protected routes throughout the application
- **Location**: 
  - Frontend: `frontend/src/pages/Login.js`, `frontend/src/context/AuthContext.js`
  - Backend: `backend/src/core/routes/auth.js`, `backend/src/middleware/security/auth.js`
- **Key Components**:
  - JWT token-based authentication with secure storage in localStorage
  - Password hashing with bcrypt for secure storage
  - Login and registration forms with comprehensive validation
  - Protected route wrapper for authenticated access control
  - Persistent auth state with React Context API
- **Frontend Code**:
  ```jsx
  // frontend/src/context/AuthContext.js (simplified)
  const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    // Login function used by Login component
    const login = async (credentials) => {
      const { token, user } = (await authService.login(credentials)).data;
      localStorage.setItem('token', token);
      setUser(user);
      setIsAuthenticated(true);
      return user;
    };
    
    // Logout function
    const logout = () => {
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
    };
    
    return (
      <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
  };
  
  // Protected Route implementation
  const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" />;
  };
  ```
- **Backend Code**:
  ```javascript
  // backend/src/core/routes/auth.js
  const express = require('express');
  const router = express.Router();
  const authController = require('../controllers/authController');
  const { authenticate } = require('../../middleware/security/auth');
  const { validateRequest } = require('../../middleware/request/validation');

  // Auth routes
  router.post('/register', validateRequest('register'), authController.register);
  router.post('/login', validateRequest('login'), authController.login);
  router.get('/me', authenticate, authController.getCurrentUser);
  router.put('/profile', authenticate, validateRequest('updateProfile'), authController.updateProfile);
  router.put('/password', authenticate, validateRequest('updatePassword'), authController.updatePassword);

  module.exports = router;
  
  // backend/src/core/controllers/authController.js (simplified)
  const AuthService = require('../services/authService');
  const authService = new AuthService();
  
  class AuthController {
    async login(req, res, next) {
      try {
        const { email, password } = req.body;
        const result = await authService.authenticateUser(email, password);
        res.json(result);
      } catch (error) {
        next(error);
      }
    }
    
    async register(req, res, next) {
      try {
        const userData = req.body;
        const result = await authService.registerUser(userData);
        res.status(201).json(result);
      } catch (error) {
        next(error);
      }
    }
    
    async getCurrentUser(req, res, next) {
      try {
        const userId = req.user.id;
        const user = await authService.getUserById(userId);
        res.json(user);
      } catch (error) {
        next(error);
      }
    }
  }
  
  module.exports = new AuthController();
  
  // backend/src/middleware/security/auth.js (simplified) 
  const authenticate = async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ message: 'Invalid token' });
      }
      
      req.user = { id: user._id, email: user.email };
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Authentication failed' });
    }
  };
  ```
- **Endpoints**: 
  - `POST /api/auth/login` - Authenticate user and return JWT token
  - `POST /api/auth/register` - Register new user account
  - `GET /api/auth/me` - Get current authenticated user details
  - `PUT /api/auth/profile` - Update user profile information

### Market Overview
- **Purpose**: Display real-time cryptocurrency market data with comprehensive search, filtering, and sorting capabilities, providing users with up-to-date market intelligence
- **Location**: 
  - Frontend: `frontend/src/pages/Market.js`, `frontend/src/components/MarketTable.js`
  - Backend: `backend/src/core/routes/market.js`, `backend/src/core/services/marketService.js`
- **Key Components**:
  - Real-time cryptocurrency prices and market trends with auto-refresh
  - Advanced search with typeahead functionality to find specific coins
  - Multi-criteria filtering (market cap, price range, volume, etc.)
  - Customizable sorting by various metrics with visual indicators
  - 24h change indicators with color-coded visual cues
  - Dynamic currency formatting based on user preferences
- **Frontend Code**:
  ```jsx
  // frontend/src/pages/Market.js (simplified)
  const Market = () => {
    const { currency } = useCurrency();
    const [cryptocurrencies, setCryptocurrencies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'market_cap', direction: 'desc' });
    
    // Fetch cryptocurrency listings from API with auto-refresh
    useEffect(() => {
      const fetchData = async () => {
        const response = await marketService.getListings({ currency });
        setCryptocurrencies(response.data);
      };
      
      fetchData();
      const interval = setInterval(fetchData, 60000); // Refresh every minute
      return () => clearInterval(interval);
    }, [currency]);
    
    // Apply search, filters, and sorting
    const filteredCryptos = useMemo(() => {
      return cryptocurrencies
        .filter(/* filtering logic */)
        .sort(/* sorting logic */);
    }, [cryptocurrencies, searchTerm, /* other dependencies */]);
    
    return (
      <Container>
        {/* Search controls */}
        <TextField 
          label="Search by name or symbol"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        {/* Market data table */}
        <MarketTable 
          data={filteredCryptos} 
          sortConfig={sortConfig} 
          onSort={setSortConfig} 
        />
      </Container>
    );
  };
  ```
- **Backend Code**:
  ```javascript
  // backend/src/core/routes/market.js
  const express = require('express');
  const router = express.Router();
  const marketController = require('../controllers/marketController');
  const { cacheMiddleware } = require('../../middleware/performance/cache');

  // Market data routes with caching
  router.get('/listings', cacheMiddleware(300), marketController.getListings);
  router.get('/global', cacheMiddleware(600), marketController.getGlobalMetrics);
  router.get('/search', marketController.searchCryptocurrencies);
  router.get('/crypto/:symbol', cacheMiddleware(300), marketController.getCryptoDetails);

  module.exports = router;
  
  // backend/src/core/controllers/marketController.js (simplified)
  const MarketService = require('../services/marketService');
  const marketService = new MarketService();
  
  const getListings = async (req, res, next) => {
    try {
      const { limit = 100, page = 1, currency = 'USD' } = req.query;
      const result = await marketService.getListings({
        limit: parseInt(limit),
        page: parseInt(page),
        currency
      });
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
  
  const searchCryptocurrencies = async (req, res, next) => {
    try {
      const { query } = req.query;
      if (!query) {
        return res.status(400).json({ message: 'Search query is required' });
      }
      
      const results = await marketService.searchCryptocurrencies(query);
      res.json(results);
    } catch (error) {
      next(error);
    }
  };
  
  // backend/src/core/services/marketService.js (simplified)
  class MarketService {
    constructor() {
      this.apiUrl = process.env.CRYPTO_API_URL;
      this.apiKey = process.env.CRYPTO_API_KEY;
    }
    
    async getListings(options = {}) {
      const { limit = 100, page = 1, currency = 'USD' } = options;
      
      try {
        const response = await axios.get(`${this.apiUrl}/listings/latest`, {
          headers: { 'X-CMC_PRO_API_KEY': this.apiKey },
          params: {
            limit,
            start: (page - 1) * limit + 1,
            convert: currency
          }
        });
        
        // Process and format the response data
        return this.formatListingsResponse(response.data, currency);
      } catch (error) {
        logger.error('Error fetching market listings:', error);
        throw new Error('Failed to fetch market data');
      }
    }
    
    formatListingsResponse(data, currency) {
      const currencyKey = currency.toLowerCase();
      
      return {
        data: data.data.map(crypto => ({
          id: crypto.id,
          name: crypto.name,
          symbol: crypto.symbol,
          price: crypto.quote[currency].price,
          market_cap: crypto.quote[currency].market_cap,
          volume_24h: crypto.quote[currency].volume_24h,
          percent_change_24h: crypto.quote[currency].percent_change_24h,
          percent_change_7d: crypto.quote[currency].percent_change_7d,
          last_updated: crypto.quote[currency].last_updated
        })),
        pagination: {
          total: data.status.total_count,
          limit,
          page
        }
      };
    }
  }
  ```
- **Endpoints**: 
  - `GET /api/market/listings` - Get cryptocurrency listings with optional query parameters 
  - `GET /api/market/global` - Get global market metrics
  - `GET /api/market/search?query=bitcoin` - Search cryptocurrencies
  - `GET /api/market/crypto/:symbol` - Get detailed information for a cryptocurrency

### Portfolio Management
- **Purpose**: Comprehensive crypto portfolio tracking system with real-time valuation, performance analytics, and visualization tools
- **Location**: 
  - Frontend: `frontend/src/pages/Portfolio.js`, `frontend/src/components/AddHoldingModal.js`
  - Backend: `backend/src/core/routes/portfolio.js`, `backend/src/core/services/portfolioService.js`
- **Key Components**:
  - CRUD operations for cryptocurrency holdings with user-friendly forms
  - Automatic calculation of current values and profit/loss metrics in real-time
  - Performance analytics including ROI, total value, and cost basis
  - Interactive data visualization with customizable charts
  - Powerful search, filter, and sort capabilities for holdings management
- **Frontend Code**:
  ```jsx
  // frontend/src/pages/Portfolio.js (simplified)
  const Portfolio = () => {
    const { formatCurrency } = useCurrency();
    const [portfolio, setPortfolio] = useState(null);
    const [marketData, setMarketData] = useState({});
    
    // Fetch portfolio and market data
    useEffect(() => {
      const fetchData = async () => {
        const portfolioData = await portfolioService.getPortfolio();
        setPortfolio(portfolioData.data);
        
        // Fetch prices for holdings
        const symbols = portfolioData.data?.holdings?.map(h => h.symbol).join(',');
        const marketResponse = await marketService.getMarketDataBySymbols(symbols);
        setMarketData(marketResponse.data.reduce((acc, crypto) => {
          acc[crypto.symbol] = crypto;
          return acc;
        }, {}));
      };
      
      fetchData();
    }, []);
    
    // Calculate portfolio metrics
    const metrics = useMemo(() => {
      if (!portfolio?.holdings?.length) return { totalValue: 0, totalCost: 0, totalProfit: 0 };
      
      return portfolio.holdings.reduce((acc, holding) => {
        const currentPrice = marketData[holding.symbol]?.price || 0;
        const currentValue = holding.amount * currentPrice;
        const cost = holding.amount * holding.purchasePrice;
        
        return {
          totalValue: acc.totalValue + currentValue,
          totalCost: acc.totalCost + cost,
          totalProfit: acc.totalProfit + (currentValue - cost),
          // Additional metrics calculation
        };
      }, { totalValue: 0, totalCost: 0, totalProfit: 0 });
    }, [portfolio, marketData]);
    
    return (
      <Container>
        {/* Summary Cards */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Typography>Total Value</Typography>
            <Typography>{formatCurrency(metrics.totalValue)}</Typography>
          </Grid>
          
          {/* Portfolio visualization */}
          <PortfolioPieChart holdings={portfolio?.holdings || []} />
          
          {/* Holdings table */}
          <PortfolioTable 
            holdings={portfolio?.holdings || []} 
            marketData={marketData}
          />
        </Grid>
      </Container>
    );
  };
  ```
- **Backend Code**:
  ```javascript
  // backend/src/core/routes/portfolio.js
  const express = require('express');
  const router = express.Router();
  const portfolioController = require('../controllers/portfolioController');
  const { authenticate } = require('../../middleware/security/auth');
  const { validateRequest } = require('../../middleware/request/validation');

  // Apply authentication middleware to all portfolio routes
  router.use(authenticate);

  // Portfolio management routes
  router.get('/', portfolioController.getPortfolio);
  router.post('/holdings', validateRequest('addHolding'), portfolioController.addHolding);
  router.put('/holdings/:id', validateRequest('updateHolding'), portfolioController.updateHolding);
  router.delete('/holdings/:id', portfolioController.removeHolding);
  router.get('/performance', portfolioController.getPerformance);

  module.exports = router;
  
  // backend/src/core/controllers/portfolioController.js (simplified)
  const PortfolioService = require('../services/portfolioService');
  const portfolioService = new PortfolioService();
  
  class PortfolioController {
    async getPortfolio(req, res, next) {
      try {
        const userId = req.user.id;
        const portfolio = await portfolioService.getPortfolioByUserId(userId);
        res.json(portfolio);
      } catch (error) {
        next(error);
      }
    }
    
    async addHolding(req, res, next) {
      try {
        const userId = req.user.id;
        const holdingData = req.body;
        
        const result = await portfolioService.addHolding(userId, holdingData);
        res.status(201).json(result);
      } catch (error) {
        next(error);
      }
    }
    
    async updateHolding(req, res, next) {
      try {
        const userId = req.user.id;
        const holdingId = req.params.id;
        const holdingData = req.body;
        
        const result = await portfolioService.updateHolding(userId, holdingId, holdingData);
        res.json(result);
      } catch (error) {
        next(error);
      }
    }
    
    async removeHolding(req, res, next) {
      try {
        const userId = req.user.id;
        const holdingId = req.params.id;
        
        await portfolioService.removeHolding(userId, holdingId);
        res.status(204).end();
      } catch (error) {
        next(error);
      }
    }
  }
  
  // backend/src/core/services/portfolioService.js (simplified)
  class PortfolioService {
    async getPortfolioByUserId(userId) {
      try {
        // Find or create portfolio for user
        let portfolio = await Portfolio.findOne({ user: userId });
        
        if (!portfolio) {
          portfolio = await Portfolio.create({
            user: userId,
            holdings: []
          });
        }
        
        return portfolio;
      } catch (error) {
        logger.error(`Error fetching portfolio for user ${userId}:`, error);
        throw new Error('Failed to fetch portfolio');
      }
    }
    
    async addHolding(userId, holdingData) {
      try {
        const portfolio = await this.getPortfolioByUserId(userId);
        
        // Add new holding to portfolio
        portfolio.holdings.push({
          cryptoId: holdingData.cryptoId,
          name: holdingData.name,
          symbol: holdingData.symbol,
          amount: holdingData.amount,
          purchasePrice: holdingData.purchasePrice,
          purchaseDate: holdingData.purchaseDate || new Date(),
          notes: holdingData.notes || ''
        });
        
        // Save updated portfolio
        await portfolio.save();
        
        return portfolio;
      } catch (error) {
        logger.error(`Error adding holding for user ${userId}:`, error);
        throw new Error('Failed to add holding');
      }
    }
  }
  ```
- **Endpoints**: 
  - `GET /api/portfolio` - Get user's portfolio with all holdings
  - `POST /api/portfolio/holdings` - Add a new cryptocurrency holding
  - `PUT /api/portfolio/holdings/:id` - Update an existing holding
  - `DELETE /api/portfolio/holdings/:id` - Remove a holding
  - `GET /api/portfolio/performance` - Get portfolio performance metrics

### User Settings
- **Purpose**: Comprehensive preference management allowing users to customize their experience with appearance, currency, and account settings
- **Location**: 
  - Frontend: `frontend/src/pages/Settings.js`, `frontend/src/context/ThemeContext.js`, `frontend/src/context/CurrencyContext.js`
  - Backend: `backend/src/core/routes/auth.js` (for profile updates)
- **Key Components**:
  - Profile information management with validation
  - Dark/light mode toggle with local storage persistence
  - Currency preference selection affecting all monetary values across the app
  - Password management with strong security validation
- **Frontend Code**:
  ```jsx
  // frontend/src/context/ThemeContext.js (simplified)
  const ThemeProvider = ({ children }) => {
    const [themeMode, setThemeMode] = useState(
      localStorage.getItem('theme') || 'light'
    );
    
    // Toggle theme function
    const toggleTheme = () => {
      const newMode = themeMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newMode);
      setThemeMode(newMode);
    };
    
    // Create theme with appropriate colors
    const theme = createTheme({
      palette: {
        mode: themeMode,
        // Theme configuration
      }
    });
    
    return (
      <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </MuiThemeProvider>
      </ThemeContext.Provider>
    );
  };
  
  // frontend/src/pages/Settings.js (simplified)
  const Settings = () => {
    const { user } = useAuth();
    const { themeMode, toggleTheme } = useTheme();
    const { currency, setCurrency } = useCurrency();
    
    return (
      <Container>
        <Typography variant="h4">Settings</Typography>
        
        {/* Profile Form */}
        <Paper>
          <Typography variant="h5">Profile Information</Typography>
          <TextField label="Name" defaultValue={user?.name} />
          <TextField label="Email" defaultValue={user?.email} />
          <Button variant="contained">Update Profile</Button>
        </Paper>
        
        {/* Theme & Currency Settings */}
        <Paper>
          <Typography variant="h5">Appearance & Currency</Typography>
          <Switch 
            checked={themeMode === 'dark'} 
            onChange={toggleTheme} 
          />
          <Select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <MenuItem value="USD">USD ($)</MenuItem>
            <MenuItem value="EUR">EUR (€)</MenuItem>
            <MenuItem value="GBP">GBP (£)</MenuItem>
          </Select>
        </Paper>
      </Container>
    );
  };
  ```
- **Backend Code**:
  ```javascript
  // backend/src/core/routes/auth.js (settings-related routes)
  const express = require('express');
  const router = express.Router();
  const authController = require('../controllers/authController');
  const { authenticate } = require('../../middleware/security/auth');
  const { validateRequest } = require('../../middleware/request/validation');

  // User settings routes (part of auth routes)
  router.put('/profile', authenticate, validateRequest('updateProfile'), authController.updateProfile);
  router.put('/settings', authenticate, validateRequest('updateSettings'), authController.updateSettings);
  router.put('/password', authenticate, validateRequest('updatePassword'), authController.updatePassword);

  module.exports = router;
  
  // backend/src/core/controllers/authController.js (settings-related methods)
  class AuthController {
    // ... other auth methods ...
    
    async updateProfile(req, res, next) {
      try {
        const userId = req.user.id;
        const { name, email } = req.body;
        
        const updatedUser = await authService.updateUserProfile(userId, { name, email });
        res.json(updatedUser);
      } catch (error) {
        next(error);
      }
    }
    
    async updateSettings(req, res, next) {
      try {
        const userId = req.user.id;
        const { theme, currency } = req.body;
        
        const updatedSettings = await authService.updateUserSettings(userId, { theme, currency });
        res.json(updatedSettings);
      } catch (error) {
        next(error);
      }
    }
    
    async updatePassword(req, res, next) {
      try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;
        
        await authService.updateUserPassword(userId, currentPassword, newPassword);
        res.json({ message: 'Password updated successfully' });
      } catch (error) {
        next(error);
      }
    }
  }
  
  // backend/src/core/services/authService.js (settings-related methods)
  class AuthService {
    // ... other auth methods ...
    
    async updateUserProfile(userId, profileData) {
      try {
        const user = await User.findById(userId);
        
        if (!user) {
          throw new Error('User not found');
        }
        
        // Update user profile fields
        if (profileData.name) user.name = profileData.name;
        if (profileData.email) {
          // Check if email is already in use
          const existingUser = await User.findOne({ email: profileData.email });
          if (existingUser && existingUser._id.toString() !== userId) {
            throw new Error('Email is already in use');
          }
          user.email = profileData.email;
        }
        
        await user.save();
        
        return {
          id: user._id,
          name: user.name,
          email: user.email,
          settings: user.settings
        };
      } catch (error) {
        logger.error(`Error updating profile for user ${userId}:`, error);
        throw error;
      }
    }
    
    async updateUserSettings(userId, settingsData) {
      try {
        const user = await User.findById(userId);
        
        if (!user) {
          throw new Error('User not found');
        }
        
        // Update user settings
        if (settingsData.theme) user.settings.theme = settingsData.theme;
        if (settingsData.currency) user.settings.currency = settingsData.currency;
        
        await user.save();
        
        return user.settings;
      } catch (error) {
        logger.error(`Error updating settings for user ${userId}:`, error);
        throw error;
      }
    }
  }
  ```
- **Endpoints**: 
  - `PUT /api/auth/profile` - Update user profile information
  - `PUT /api/auth/settings` - Update user application settings
  - `PUT /api/auth/password` - Update user password

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

## Project Structure

```
crypto-portfolio-management/
├── frontend/                 # React frontend application
│   ├── public/               # Static files
│   └── src/                  # Source files
│       ├── components/       # Reusable UI components
│       ├── context/          # React context providers
│       ├── pages/            # Page components
│       ├── services/         # API service integrations
│       └── utils/            # Utility functions
└── backend/                  # Node.js backend application
    ├── logs/                 # Application logs
    └── src/                  # Source files
        ├── middleware/       # Express middleware
        │   ├── database/     # Database connection
        │   ├── error/        # Error handling
        │   ├── performance/  # Caching and optimization
        │   ├── request/      # Request validation
        │   └── security/     # Authentication and security
        ├── core/             # Backend core functionality
        │   ├── controllers/  # Request handlers
        │   ├── models/       # Mongoose data models
        │   ├── routes/       # API route definitions
        │   ├── services/     # Business logic
        │   └── utils/        # Core utilities
        ├── utils/            # Shared utilities
        │   └── logger.js     # Centralized logging service
        ├── app.js            # Express app setup
        └── index.js          # Entry point
```

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.