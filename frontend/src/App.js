import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, CircularProgress } from '@mui/material';
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Market from './pages/Market';
import Portfolio from './pages/Portfolio';
import Settings from './pages/Settings';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useThemeContext } from './context/ThemeContext';
import { CurrencyProvider } from './context/CurrencyContext';

// Loading component for lazy-loaded routes
const LoadingFallback = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
    <CircularProgress />
  </Box>
);

// Main App wrapper that uses the theme from ThemeContext
const AppContent = () => {
  const { theme } = useThemeContext();

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navigation>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/market" element={<Market />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            {/* Redirect root to market */}
            <Route path="/" element={<Navigate to="/portfolio" replace />} />

            {/* Catch all route for 404s */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Navigation>
      </Router>
    </MuiThemeProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CurrencyProvider>
          <AppContent />
        </CurrencyProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
