import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Navigation from './components/Navigation';

// Lazy load our pages for better performance
const Login = React.lazy(() => import('./pages/Login'));
const Market = React.lazy(() => import('./pages/Market'));
const Portfolio = React.lazy(() => import('./pages/Portfolio'));
const Settings = React.lazy(() => import('./pages/Settings'));

// Loading component for lazy-loaded routes
const LoadingFallback = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
    Loading...
  </Box>
);

function App() {
  // You might want to add authentication state management here
  const isAuthenticated = false; // This will be managed by your auth system

  return (
    <React.Suspense fallback={<LoadingFallback />}>
      <Navigation>
        <Routes>
          {/* Public routes */}
          <Route 
            path="/login" 
            element={!isAuthenticated ? <Login /> : <Navigate to="/market" />} 
          />

          {/* Protected routes */}
          <Route
            path="/market"
            element={isAuthenticated ? <Market /> : <Navigate to="/login" />}
          />
          <Route
            path="/portfolio"
            element={isAuthenticated ? <Portfolio /> : <Navigate to="/login" />}
          />
          <Route
            path="/settings"
            element={isAuthenticated ? <Settings /> : <Navigate to="/login" />}
          />

          {/* Redirect root to market or login based on auth status */}
          <Route
            path="/"
            element={<Navigate to={isAuthenticated ? "/market" : "/login"} />}
          />

          {/* Catch all route for 404s */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Navigation>
    </React.Suspense>
  );
}

export default App;
