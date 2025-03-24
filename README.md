# Crypto Portfolio Tracker

A full-stack application for tracking cryptocurrency portfolios, built with React.js, Express.js, and MongoDB.

## Project Overview

This application allows users to:
- Track their cryptocurrency portfolio
- Monitor real-time market prices
- Add, edit, and delete transactions
- Calculate portfolio performance and PnL
- Manage account settings

## Tech Stack

- **Frontend**: React.js
- **Backend**: Express.js
- **Database**: MongoDB Atlas
- **API**: CoinMarketCap API

## Project Structure

```
crypto-portfolio-tracker/
├── frontend/                 # React.js frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Main application pages
│   │   ├── services/       # API integration services
│   │   ├── context/        # React context for state management
│   │   └── utils/          # Helper functions
├── backend/                 # Express.js backend
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   └── utils/          # Helper functions
└── README.md
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- CoinMarketCap API key

## Setup Instructions

1. Clone the repository
```bash
git clone [repository-url]
cd crypto-portfolio-tracker
```

2. Install Frontend Dependencies
```bash
cd frontend
npm install
```

3. Install Backend Dependencies
```bash
cd ../backend
npm install
```

4. Environment Setup
- Create `.env` files in both frontend and backend directories
- Add necessary environment variables (see `.env.example` files)

5. Start Development Servers
```bash
# Start backend server
cd backend
npm run dev

# Start frontend server (in a new terminal)
cd frontend
npm start
```

## Feature Branches

The project follows a feature branch workflow:
- `main`: Production-ready code
- `feature/*`: New features

## License

MIT License