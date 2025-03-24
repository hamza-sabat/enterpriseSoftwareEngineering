import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import theme from './theme';
import Navigation from './components/Navigation';
import Login from './pages/Login';
import Market from './pages/Market';
import Portfolio from './pages/Portfolio';
import Settings from './pages/Settings';

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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navigation>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />

            {/* Protected routes - temporarily not protected for development */}
            <Route path="/market" element={<Market />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/settings" element={<Settings />} />

            {/* Redirect root to market */}
            <Route path="/" element={<Navigate to="/market" replace />} />

            {/* Catch all route for 404s */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Navigation>
      </Router>
    </ThemeProvider>
  );
}

export default App;
