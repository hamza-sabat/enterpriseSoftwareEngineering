# Cryptocurrency Portfolio Management System

## Introduction

A full-stack web application for managing cryptocurrency portfolios, tracking market prices, and analyzing investment performance. This project demonstrates enterprise software engineering principles and practices.

## Solution Overview

The application is built using a modern tech stack with a focus on scalability, security, and user experience. It features a React-based frontend with Material UI, Node.js/Express backend, and MongoDB database with Mongoose ODM. The architecture follows a modular approach for maintainability and scalability.

## Project Aim & Objectives

### Main Goal
To create a secure, scalable, and user-friendly platform for cryptocurrency portfolio management that enables users to track their investments, analyze market trends, and make informed investment decisions.

### Key Objectives
1. Develop a comprehensive portfolio tracking system with real-time price updates and performance analytics
2. Create an intuitive market overview dashboard with search functionality and price trend indicators
3. Implement secure user authentication with profile management and customizable user settings
4. Build a responsive and user-friendly interface with Material UI components
5. Integrate with cryptocurrency APIs to provide accurate market data and portfolio valuations

## Current Features

### Implemented
- **User Authentication**: Secure login and registration with JWT tokens
- **Portfolio Management**: Add, edit, and remove cryptocurrency holdings
- **Portfolio Analytics**: Calculate current value, profit/loss, and performance metrics
- **Market Overview**: Browse cryptocurrency market data with search and sorting options
- **User Settings**: Manage profile preferences including theme and currency settings
- **Responsive Design**: Mobile-friendly UI built with Material UI components

## Enterprise Considerations

### Performance
- Efficient MongoDB queries with proper schema design
- React's virtual DOM for optimized rendering
- Separation of concerns for maintainable and scalable code
- Optimized API calls with proper error handling

### Scalability
- Modular architecture for independent scaling of components
- Stateless authentication design
- Service-based backend structure
- MongoDB for flexible document storage

### Robustness
- Comprehensive error handling across all layers
- Graceful degradation for failed API calls
- Input validation and sanitization
- Automated testing suite for critical components

### Security
- JWT-based authentication
- Password hashing using bcrypt
- Input validation and sanitization
- CORS protection
- Rate limiting for API endpoints

### Deployment
- 
- GitHub Actions for CI/CD
- Environment-based configuration
- Monitoring and logging setup

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
    ├── utils/          # Utility functions
    ├── theme.js        # UI theme configuration
    └── App.js          # Main application component
```

The frontend layer is responsible for:
- Providing an intuitive user interface
- Handling user interactions and form submissions
- Managing client-side state and data presentation
- Communicating with the backend through service APIs
- Implementing responsive design for multiple device sizes

### Backend / API

The backend is built with Node.js and Express, following a modular architecture that separates concerns and enables scalable development.

```
backend/src/
├── middleware/     # API middleware components
├── routes/         # API endpoint definitions
│   ├── auth.js     # Authentication routes
│   ├── market.js   # Market data routes
│   └── portfolio.js # Portfolio management routes
├── models/         # Database models and schemas
│   ├── User.js     # User schema with authentication
│   └── Portfolio.js # Portfolio schema with holdings
├── services/       # Business logic services
├── utils/          # Shared utilities
│   └── logger.js   # Logging service
├── app.js          # Express application setup
└── index.js        # Server initialization
```

#### Database Implementation

The application uses MongoDB with Mongoose ODM for data persistence, providing a flexible, schema-based solution:

- **User Model**: Manages user authentication, profile information, and application settings.
  - Includes secure password hashing with bcrypt
  - Implements methods for validating credentials
  - Stores user preferences like theme and currency settings

- **Portfolio Model**: Handles cryptocurrency holdings and investment tracking.
  - Schema includes holdings with cryptoId, amount, purchase price, and date
  - Pre-save hooks calculate total investment values
  - Supports custom methods for portfolio analytics

#### Services Layer

The services layer encapsulates business logic and external API integrations:

- **Auth Service**: Handles JWT token generation, validation, and user authentication
- **Market Service**: Integrates with cryptocurrency APIs to fetch market data
- **Portfolio Service**: Implements portfolio calculations and investment tracking logic

#### Controllers & Routes

The application uses a RESTful API design with controllers for managing resource operations:

- **Auth Routes**: `/api/auth/`
  - Registration, login, and user information endpoints
  - Token-based authentication

- **Market Routes**: `/api/market/`
  - Cryptocurrency listings with pricing information
  - Global market data and metrics
  - Search and filtering capabilities

- **Portfolio Routes**: `/api/portfolio/`
  - CRUD operations for portfolio holdings
  - Performance calculation endpoints
  - User-specific portfolio data

#### Error Handling & Logging

The backend implements comprehensive error handling:

- Centralized error processing for consistent API responses
- Detailed logging with Winston for debugging and monitoring
- Error categorization with appropriate HTTP status codes

The backend layer is responsible for:
- API routing and request processing
- Authentication and authorization
- Business logic implementation
- Database operations and data modeling
- Error handling and logging

## Middleware Layer

The middleware layer plays a critical role in the application architecture, functioning as the intermediary processing layer between incoming requests and route handlers. This layer enhances the application's security, performance, and maintainability.

### Key Middleware Components

- **Authentication Middleware**: Validates JWT tokens to ensure users are authenticated before accessing protected routes. This middleware extracts user information from tokens and makes it available to route handlers.

- **Error Handling Middleware**: Provides centralized error processing, ensuring consistent error responses across the API and proper logging of errors for troubleshooting.

- **Request Validation**: Validates incoming request data against defined schemas to ensure data integrity before it reaches the database or business logic.

- **Logging Middleware**: Records API requests and responses for monitoring, debugging, and audit purposes using Winston logger.

- **CORS Middleware**: Manages Cross-Origin Resource Sharing to control which domains can interact with the API, enhancing security.

### Middleware Implementation

```javascript
// Example of the authentication middleware
const authenticate = async (req, res, next) => {
  try {
    // Extract token from request header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Verify token and extract user data
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Make user data available for route handlers
    req.user = decoded;
    next();
  } catch (error) {
    logger.error(`Authentication error: ${error.message}`);
    res.status(401).json({ error: 'Invalid authentication token' });
  }
};
```

The middleware layer provides these key benefits:

- **Separation of Concerns**: Keeps authentication, validation, and other cross-cutting concerns separate from business logic
- **Code Reusability**: Common operations like authentication are implemented once and used across multiple routes
- **Security Enhancement**: Consistent application of security checks before request processing
- **Maintainability**: Centralized implementation of cross-cutting functionality makes the codebase easier to maintain

## Installation & Usage Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4 or higher)
- Git

### Setup Steps

1. Clone the repository:
```bash
git clone https://github.com/yourusername/crypto-portfolio.git
cd crypto-portfolio
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Configure environment variables:
```bash
# Backend (.env)
PORT=3001
MONGODB_URI=mongodb://localhost:27017/crypto_portfolio
JWT_SECRET=your_jwt_secret

# Frontend (.env)
REACT_APP_API_URL=http://localhost:3001
```

4. Start the application:
```bash
# Start backend server
cd backend
npm run dev

# Start frontend development server
cd frontend
npm start
```

## Feature Details

### Authentication System
- Location: `frontend/src/pages/Login.js` & `backend/src/routes/auth.js`
- Secure user authentication with JWT tokens
- Password hashing with bcrypt
- Login and registration forms with validation

### Market Overview
- Location: `frontend/src/pages/Market.js` & `backend/src/routes/market.js`
- Display real-time cryptocurrency prices and market trends
- Search and filtering functionality
- Sorting options by various metrics
- 24h change indicators with visual cues

### Portfolio Management
- Location: `frontend/src/pages/Portfolio.js` & `backend/src/routes/portfolio.js`
- Add, edit, and remove cryptocurrency holdings
- Automatic calculation of current values and profit/loss
- Performance metrics including total portfolio value
- Support for notes and purchase date tracking

### User Settings
- Location: `frontend/src/pages/Settings.js`
- Profile information management
- Theme preferences (light/dark mode)
- Currency display options
- Notification settings

## Project Structure

```
crypto-portfolio/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── theme.js
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

## Known Issues & Future Enhancements

### Current Limitations

- **Live Updates**: Portfolio values are currently updated only on page refresh or manual update, not live to the second.
- **Market Data Frequency**: Market data is fetched from external APIs with rate limiting considerations.
- **Mobile Responsiveness**: While the UI is responsive, some complex data tables may require optimization for very small screens.
- **Browser Support**: The application is optimized for modern browsers; some features may have limited functionality in older browsers.

### Planned Enhancements

1. **Transaction History**
   - Implement detailed transaction logging
   - Add filtering and search capabilities for transaction history
   - Generate transaction reports and analytics

2. **Advanced Analytics Dashboard**
   - Create visual representations of portfolio performance over time
   - Implement asset allocation charts and distribution analysis
   - Add comparison benchmarks against major cryptocurrencies and indices

3. **Notification System**
   - Develop price alerts for user-defined thresholds
   - Implement email and in-app notifications
   - Add scheduled reports and performance summaries

4. **API Enhancements**
   - Implement caching strategies to reduce external API calls
   - Add more robust error handling for API failures
   - Expand market data sources for more comprehensive coverage

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.