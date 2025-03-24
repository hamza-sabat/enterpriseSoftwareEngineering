import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Navigation from './components/Navigation';

// Test commit - This is a simple comment for demonstration
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
  // TODO: Implement proper authentication
  // For now, we'll assume the user is authenticated for easier development
  const isAuthenticated = true; // This will be managed by your auth system

  return (
    <React.Suspense fallback={<LoadingFallback />}>
      <Navigation>
        <Routes>
          {/* Public routes */}
          <Route 
            path="/login" 
            element={<Login />} 
          />

          {/* Protected routes - temporarily not protected for development */}
          <Route path="/market" element={<Market />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/settings" element={<Settings />} />

          {/* Redirect root to market */}
          <Route
            path="/"
            element={<Navigate to="/market" />}
          />

          {/* Catch all route for 404s */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Navigation>
    </React.Suspense>
  );
}

export default App;
