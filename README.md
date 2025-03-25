# Cryptocurrency Portfolio Management System

## Introduction

A full-stack web application for managing cryptocurrency portfolios, tracking market prices, and analyzing investment performance. This project demonstrates enterprise software engineering principles and practices.

## Solution Overview

The application is built using a modern tech stack with a focus on scalability, security, and user experience. It features a React-based frontend, Node.js/Express backend, and PostgreSQL database, all containerized using Docker for consistent deployment.

## Project Aim & Objectives

### Main Goal
To create a secure, scalable, and user-friendly platform for cryptocurrency portfolio management that enables users to track their investments, analyze market trends, and make informed investment decisions.

### Key Objectives
1. Develop a comprehensive portfolio tracking system with real-time price updates and transaction history
2. Create an intuitive market overview dashboard with search functionality and price trend indicators
3. Implement secure user authentication with profile management and customisable user settings
4. Build a responsive and user-friendly interface with mobile-first design principles
5. Integrate with cryptocurrency APIs to provide accurate market data and portfolio valuations

## Enterprise Considerations

### Performance
- Implemented efficient database queries with proper indexing
- Used React's virtual DOM for optimized rendering
- Implemented caching strategies for frequently accessed data
- Optimized bundle sizes for faster load times

### Scalability
- Microservices architecture for independent scaling of components
- Containerized deployment using Docker
- Stateless design for horizontal scaling
- Database connection pooling and query optimization

### Robustness
- Comprehensive error handling across all layers
- Graceful degradation for failed API calls
- Input validation and sanitization
- Automated testing suite for critical components

### Security
- JWT-based authentication
- Password hashing using bcrypt
- HTTPS encryption
- Input validation and sanitization
- CORS protection
- Rate limiting for API endpoints

### Deployment
- Docker containerization
- GitHub Actions for CI/CD
- Environment-based configuration
- Monitoring and logging setup

## Architecture

The application follows a three-tier architecture with clear separation of concerns:

### Frontend (User Interface)
```
frontend/
├── src/
    ├── components/     # Reusable UI components (Navigation, etc.)
    ├── pages/          # Main application views
    │   ├── Login.js    # Authentication interface
    │   ├── Market.js   # Cryptocurrency market view
    │   ├── Portfolio.js # User's portfolio management
    │   └── Settings.js # User preferences and settings
    ├── theme.js        # UI theme configuration
    └── App.js          # Main application component
```

The frontend layer is responsible for:
- Providing an intuitive user interface
- Handling user interactions and form submissions
- Managing client-side state and data presentation
- Communicating with the middleware through API calls
- Implementing responsive design for multiple device sizes

### Middleware / Services
```
backend/src/
├── middleware/    # API middleware components
├── routes/        # API endpoint definitions
├── controllers/   # Request handlers and business logic
└── utils/         # Shared utilities
    ├── dbUtils.js # Database operations
    └── logger.js  # Logging service
```

The middleware layer acts as a bridge between the frontend and backend, handling:
- API routing and request processing
- Authentication and authorization
- Business logic implementation
- Error handling and logging
- Request validation
- Rate limiting and security measures

### Backend (Data Storage & Processing)
```
backend/src/
├── database/     # Database configuration and connection
├── models/       # Database models and schemas
└── index.js      # Main server configuration
```

The backend layer is responsible for:
- Database connection management
- Data modeling and relationships
- Data persistence and retrieval
- Data validation and integrity
- Complex query execution

This architecture ensures:
- Clear separation of concerns
- Scalable and maintainable codebase
- Secure data handling
- Efficient communication between layers
- Independent development and testing of each layer

## Installation & Usage Instructions

### Prerequisites
- Node.js (v14 or higher)
- Docker and Docker Compose
- PostgreSQL (v13 or higher)
- Git

### Setup Steps

1. Clone the repository:
```bash
git clone https://github.com/hamza-sabat/enterpriseSoftwareEngineering.git
cd enterpriseSoftwareEngineering
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
DB_HOST=localhost
DB_PORT=5432
DB_NAME=crypto_portfolio
DB_USER=your_username
DB_PASSWORD=your_password
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

## Feature Overview

### Authentication System
- Location: `frontend/src/pages/Login.js`
- Purpose: Secure user authentication and registration
- Components: Login form, Registration form, JWT token management

### Market Overview
- Location: `frontend/src/pages/Market.js`
- Purpose: Display real-time cryptocurrency prices and market trends
- Features: Search functionality, Price tracking, 24h change indicators

### Portfolio Management
- Location: `frontend/src/pages/Portfolio.js`
- Purpose: Track and manage cryptocurrency holdings
- Features: Portfolio value calculation, Holdings table, Add/Remove assets

### User Settings
- Location: `frontend/src/pages/Settings.js`
- Purpose: Manage user preferences and account settings
- Features: Profile settings, Display preferences, Notification settings

### Navigation
- Location: `frontend/src/components/Navigation.js`
- Purpose: Provide consistent navigation across the application
- Features: Responsive sidebar, Route management, User menu

## Project Structure

```
enterpriseSoftwareEngineering/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── theme.js
│   │   └── App.js
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.