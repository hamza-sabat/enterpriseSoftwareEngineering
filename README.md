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
- **Code Snippets**:
  ```jsx
  // frontend/src/context/AuthContext.js
  const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    
    // Load user from token on initial mount
    useEffect(() => {
      const loadUser = async () => {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setIsLoading(false);
          return;
        }
        
        try {
          const response = await authService.getCurrentUser();
          setUser(response.data);
          setIsAuthenticated(true);
        } catch (error) {
          localStorage.removeItem('token');
        } finally {
          setIsLoading(false);
        }
      };
      
      loadUser();
    }, []);
    
    // Login function used by Login component
    const login = async (credentials) => {
      const response = await authService.login(credentials);
      const { token, user } = response.data;
      
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
      <AuthContext.Provider value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        updateUser: (userData) => setUser(userData)
      }}>
        {children}
      </AuthContext.Provider>
    );
  };
  
  // Protected Route implementation
  const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    
    if (isLoading) {
      return <CircularProgress />;
    }
    
    return isAuthenticated ? children : <Navigate to="/login" />;
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
  - Dynamic currency formatting based on user preferences via Context API
  - Performance optimized data grid with virtual scrolling for large datasets
- **Code Snippets**:
  ```jsx
  // frontend/src/pages/Market.js
  const Market = () => {
    const { currency } = useCurrency();
    const [cryptocurrencies, setCryptocurrencies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'market_cap', direction: 'desc' });
    const [filters, setFilters] = useState({
      priceMin: '',
      priceMax: '',
      marketCapMin: '',
      marketCapMax: '',
      changeFilter: 'all' // 'positive', 'negative', 'all'
    });
    
    // Fetch cryptocurrency listings from API
    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await marketService.getListings({ currency });
          setCryptocurrencies(response.data);
        } catch (error) {
          console.error('Failed to fetch market data:', error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchData();
      
      // Auto-refresh market data every 60 seconds
      const interval = setInterval(fetchData, 60000);
      return () => clearInterval(interval);
    }, [currency]);
    
    // Apply search, filters, and sorting
    const filteredCryptos = useMemo(() => {
      return cryptocurrencies
        .filter(crypto => {
          // Search filter
          if (searchTerm && !crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
              !crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())) {
            return false;
          }
          
          // Price filter
          if (filters.priceMin && crypto.price < parseFloat(filters.priceMin)) return false;
          if (filters.priceMax && crypto.price > parseFloat(filters.priceMax)) return false;
          
          // Market cap filter
          if (filters.marketCapMin && crypto.market_cap < parseFloat(filters.marketCapMin)) return false;
          if (filters.marketCapMax && crypto.market_cap > parseFloat(filters.marketCapMax)) return false;
          
          // Change filter
          if (filters.changeFilter === 'positive' && crypto.percent_change_24h <= 0) return false;
          if (filters.changeFilter === 'negative' && crypto.percent_change_24h >= 0) return false;
          
          return true;
        })
        .sort((a, b) => {
          // Handle sorting
          if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
          }
          if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
          }
          return 0;
        });
    }, [cryptocurrencies, searchTerm, filters, sortConfig]);
    
    return (
      <Container maxWidth="xl">
        <Typography variant="h4" component="h1" gutterBottom>
          Cryptocurrency Market
        </Typography>
        
        {/* Search and filter controls */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Search by name or symbol"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Grid>
            
            {/* Additional filter controls omitted for brevity */}
          </Grid>
        </Paper>
        
        {/* Market data table */}
        <MarketTable 
          data={filteredCryptos} 
          loading={loading} 
          sortConfig={sortConfig} 
          onSort={setSortConfig} 
        />
      </Container>
    );
  };
  ```
- **Endpoints**: 
  - `GET /api/market/listings` - Get cryptocurrency listings with optional query parameters for pagination and filtering
  - `GET /api/market/global` - Get global market metrics (total market cap, volume, etc.)
  - `GET /api/market/search?query=bitcoin` - Search cryptocurrencies by name or symbol
  - `GET /api/market/crypto/:symbol` - Get detailed information for a specific cryptocurrency

### Portfolio Management
- **Purpose**: Comprehensive crypto portfolio tracking system with real-time valuation, performance analytics, and visualization tools
- **Location**: 
  - Frontend: `frontend/src/pages/Portfolio.js`, `frontend/src/components/AddHoldingModal.js`
  - Backend: `backend/src/core/routes/portfolio.js`, `backend/src/core/services/portfolioService.js`
- **Key Components**:
  - CRUD operations for cryptocurrency holdings with user-friendly forms
  - Automatic calculation of current values and profit/loss metrics in real-time
  - Performance analytics including ROI, total value, and cost basis
  - Interactive data visualization with customizable charts (pie, line, bar)
  - Powerful search, filter, and sort capabilities for holdings management
  - Best and worst performers identification with intelligent ranking
  - Responsive design for both desktop and mobile viewing
- **Code Snippets**:
  ```jsx
  // frontend/src/pages/Portfolio.js
  const Portfolio = () => {
    const { currency, formatCurrency } = useCurrency();
    const [portfolio, setPortfolio] = useState(null);
    const [marketData, setMarketData] = useState({});
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('value');
    const [sortDirection, setSortDirection] = useState('desc');
    
    // Fetch portfolio data
    const fetchPortfolio = useCallback(async () => {
      try {
        setLoading(true);
        const response = await portfolioService.getPortfolio();
        setPortfolio(response.data);
        
        // Fetch current market prices for all holdings
        if (response.data?.holdings?.length) {
          const symbols = response.data.holdings.map(h => h.symbol).join(',');
          const marketResponse = await marketService.getMarketDataBySymbols(symbols, currency);
          
          // Create a map of symbol -> market data for easy lookup
          const marketDataMap = {};
          marketResponse.data.forEach(crypto => {
            marketDataMap[crypto.symbol] = crypto;
          });
          
          setMarketData(marketDataMap);
        }
      } catch (error) {
        console.error('Failed to fetch portfolio:', error);
      } finally {
        setLoading(false);
      }
    }, [currency]);
    
    useEffect(() => {
      fetchPortfolio();
    }, [fetchPortfolio]);
    
    // Calculate portfolio metrics with current market prices
    const portfolioMetrics = useMemo(() => {
      if (!portfolio?.holdings?.length || Object.keys(marketData).length === 0) {
        return {
          totalValue: 0,
          totalCost: 0,
          totalProfit: 0,
          totalProfitPercentage: 0
        };
      }
      
      // Calculate totals
      const metrics = portfolio.holdings.reduce((acc, holding) => {
        const currentPrice = marketData[holding.symbol]?.price || 0;
        const currentValue = holding.amount * currentPrice;
        const cost = holding.amount * holding.purchasePrice;
        const profit = currentValue - cost;
        const profitPercentage = cost > 0 ? (profit / cost) * 100 : 0;
        
        return {
          totalValue: acc.totalValue + currentValue,
          totalCost: acc.totalCost + cost,
          totalProfit: acc.totalProfit + profit,
          holdings: [
            ...acc.holdings,
            {
              ...holding,
              currentPrice,
              currentValue,
              profit,
              profitPercentage
            }
          ]
        };
      }, { totalValue: 0, totalCost: 0, totalProfit: 0, holdings: [] });
      
      metrics.totalProfitPercentage = metrics.totalCost > 0 
        ? (metrics.totalProfit / metrics.totalCost) * 100 
        : 0;
        
      // Sort and filter holdings  
      let processedHoldings = metrics.holdings;
      
      if (searchTerm) {
        processedHoldings = processedHoldings.filter(
          h => h.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
               h.symbol.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      processedHoldings.sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];
        
        if (typeof aValue === 'string') {
          return sortDirection === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      });
      
      metrics.holdings = processedHoldings;
      
      return metrics;
    }, [portfolio, marketData, searchTerm, sortBy, sortDirection]);
    
    return (
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          {/* Portfolio Summary Cards */}
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Total Value</Typography>
              <Typography variant="h4">{formatCurrency(portfolioMetrics.totalValue)}</Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Total Cost</Typography>
              <Typography variant="h4">{formatCurrency(portfolioMetrics.totalCost)}</Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Total Profit/Loss</Typography>
              <Typography 
                variant="h4" 
                color={portfolioMetrics.totalProfit >= 0 ? 'success.main' : 'error.main'}
              >
                {formatCurrency(portfolioMetrics.totalProfit)}
                {' '}
                <Typography component="span" color="textSecondary">
                  ({portfolioMetrics.totalProfitPercentage.toFixed(2)}%)
                </Typography>
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Button 
              fullWidth 
              variant="contained" 
              onClick={() => setModalOpen(true)}
              sx={{ height: '100%' }}
            >
              Add New Holding
            </Button>
          </Grid>
          
          {/* Portfolio Composition Chart */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Portfolio Composition</Typography>
              <PortfolioPieChart 
                holdings={portfolioMetrics.holdings} 
                currency={currency} 
              />
            </Paper>
          </Grid>
          
          {/* Performance Chart */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Performance by Asset</Typography>
              <PerformanceBarChart 
                holdings={portfolioMetrics.holdings} 
                currency={currency} 
              />
            </Paper>
          </Grid>
          
          {/* Holdings Table */}
          <Grid item xs={12}>
            <Paper>
              <PortfolioTable 
                holdings={portfolioMetrics.holdings}
                loading={loading}
                onSort={(field) => {
                  if (sortBy === field) {
                    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                  } else {
                    setSortBy(field);
                    setSortDirection('desc');
                  }
                }}
                sortBy={sortBy}
                sortDirection={sortDirection}
                onDelete={handleDeleteHolding}
                onEdit={handleEditHolding}
                currency={currency}
              />
            </Paper>
          </Grid>
        </Grid>
        
        {/* Add/Edit Holding Modal */}
        <AddHoldingModal 
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleAddHolding}
          currency={currency}
        />
      </Container>
    );
  };
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
  - Unified settings interface with responsive design
  - Context API implementation for global state management
- **Code Snippets**:
  ```jsx
  // frontend/src/context/ThemeContext.js
  const ThemeProvider = ({ children }) => {
    // Initialize theme from localStorage or system preference
    const getInitialTheme = () => {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) return savedTheme;
      
      // Check for system preference
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDarkMode ? 'dark' : 'light';
    };
    
    const [themeMode, setThemeMode] = useState(getInitialTheme);
    
    // Create and memoize the theme object
    const theme = useMemo(() => 
      createTheme({
        palette: {
          mode: themeMode,
          primary: {
            main: '#2196f3',
          },
          secondary: {
            main: '#f50057',
          },
          background: {
            default: themeMode === 'light' ? '#f5f5f5' : '#121212',
            paper: themeMode === 'light' ? '#ffffff' : '#1e1e1e',
          },
        },
        components: {
          MuiTableRow: {
            styleOverrides: {
              root: {
                '&:nth-of-type(odd)': {
                  backgroundColor: themeMode === 'light' 
                    ? 'rgba(0, 0, 0, 0.03)' 
                    : 'rgba(255, 255, 255, 0.03)',
                },
              },
            },
          },
        },
      }),
    [themeMode]);
    
    // Toggle theme function
    const toggleTheme = () => {
      setThemeMode(prevMode => {
        const newMode = prevMode === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', newMode);
        return newMode;
      });
    };
    
    return (
      <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </MuiThemeProvider>
      </ThemeContext.Provider>
    );
  };
  
  // frontend/src/context/CurrencyContext.js
  const CurrencyProvider = ({ children }) => {
    // Initialize from localStorage or default to USD
    const [currency, setCurrency] = useState(
      localStorage.getItem('currency') || 'USD'
    );
    
    // Currency formatter function using Intl API
    const formatCurrency = useCallback((value) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(value);
    }, [currency]);
    
    // Format large numbers without currency symbol
    const formatNumber = useCallback((value, digits = 2) => {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits
      }).format(value);
    }, []);
    
    // Change currency with localStorage persistence
    const changeCurrency = useCallback((newCurrency) => {
      setCurrency(newCurrency);
      localStorage.setItem('currency', newCurrency);
    }, []);
    
    return (
      <CurrencyContext.Provider 
        value={{ 
          currency, 
          setCurrency: changeCurrency, 
          formatCurrency, 
          formatNumber,
          currencySymbol: currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£'
        }}
      >
        {children}
      </CurrencyContext.Provider>
    );
  };
  
  // frontend/src/pages/Settings.js (partial)
  const Settings = () => {
    const { user, updateUser } = useAuth();
    const { themeMode, toggleTheme } = useTheme();
    const { currency, setCurrency } = useCurrency();
    
    const [profileForm, setProfileForm] = useState({
      name: user?.name || '',
      email: user?.email || '',
    });
    
    const [passwordForm, setPasswordForm] = useState({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    
    const handleProfileSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await authService.updateProfile(profileForm);
        updateUser(response.data);
        toast.success('Profile updated successfully');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to update profile');
      }
    };
    
    const handlePasswordSubmit = async (e) => {
      e.preventDefault();
      
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        toast.error('New passwords do not match');
        return;
      }
      
      try {
        await authService.updatePassword(passwordForm);
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        toast.success('Password updated successfully');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to update password');
      }
    };
    
    return (
      <Container maxWidth="md">
        <Typography variant="h4" component="h1" gutterBottom>
          Settings
        </Typography>
        
        <Grid container spacing={4}>
          {/* Profile Information */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Profile Information
              </Typography>
              
              <form onSubmit={handleProfileSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Name"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="primary">
                      Update Profile
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
          
          {/* Appearance & Currency Settings */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h5" gutterBottom>
                Appearance & Currency
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Theme Mode" 
                    secondary={themeMode === 'light' ? 'Light Mode' : 'Dark Mode'} 
                  />
                  <Switch
                    edge="end"
                    checked={themeMode === 'dark'}
                    onChange={toggleTheme}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemText 
                    primary="Currency" 
                    secondary="Select your preferred currency" 
                  />
                  <Select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    size="small"
                  >
                    <MenuItem value="USD">USD ($)</MenuItem>
                    <MenuItem value="EUR">EUR (€)</MenuItem>
                    <MenuItem value="GBP">GBP (£)</MenuItem>
                  </Select>
                </ListItem>
              </List>
            </Paper>
          </Grid>
          
          {/* Password Management */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h5" gutterBottom>
                Password Management
              </Typography>
              
              <form onSubmit={handlePasswordSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Current Password"
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="New Password"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                      helperText="Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Confirm New Password"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                      error={passwordForm.newPassword !== passwordForm.confirmPassword}
                      helperText={passwordForm.newPassword !== passwordForm.confirmPassword ? "Passwords don't match" : ""}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Button 
                      type="submit" 
                      variant="contained" 
                      color="primary"
                      disabled={!passwordForm.currentPassword || !passwordForm.newPassword || passwordForm.newPassword !== passwordForm.confirmPassword}
                    >
                      Update Password
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    );
  };
  ```

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