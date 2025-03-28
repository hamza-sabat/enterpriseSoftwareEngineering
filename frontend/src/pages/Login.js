import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Box,
  Card,
  CardContent,
  Tabs,
  Tab,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import * as authService from '../services/authService';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // If redirected here from another page, navigate there after login
  const from = location.state?.from?.pathname || '/portfolio';

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { email, password } = formData;
      const data = await authService.login(email, password);
      await login(data);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    const validationErrors = [];
    
    if (!formData.email) {
      validationErrors.push('Email is required');
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      validationErrors.push('Please enter a valid email address');
    }
    
    if (!formData.name) {
      validationErrors.push('Name is required');
    }
    
    if (!formData.password) {
      validationErrors.push('Password is required');
    } else {
      // Password complexity validation
      const passwordErrors = [];
      if (formData.password.length < 8) {
        passwordErrors.push('at least 8 characters long');
      }
      if (!/[A-Z]/.test(formData.password)) {
        passwordErrors.push('one uppercase letter');
      }
      if (!/[a-z]/.test(formData.password)) {
        passwordErrors.push('one lowercase letter');
      }
      if (!/\d/.test(formData.password)) {
        passwordErrors.push('one number');
      }
      if (!/[@$!%*?&]/.test(formData.password)) {
        passwordErrors.push('one special character (@$!%*?&)');
      }
      
      if (passwordErrors.length > 0) {
        validationErrors.push(`Password must contain ${passwordErrors.join(', ')}`);
      }
    }
    
    if (formData.password !== formData.confirmPassword) {
      validationErrors.push('Passwords do not match');
    }
    
    if (validationErrors.length > 0) {
      setError(validationErrors.join('. '));
      return;
    }

    setIsLoading(true);
    try {
      const { email, password, name } = formData;
      const data = await authService.register(email, password, name);
      await register(data);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Welcome to Crypto Tracker
        </Typography>
        <Typography variant="body1" align="center" color="textSecondary">
          Track your cryptocurrency portfolio with ease
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="Login" />
            <Tab label="Sign Up" />
          </Tabs>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          <TabPanel value={tabValue} index={0}>
            <form onSubmit={handleLogin}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                margin="normal"
                required
                disabled={isLoading}
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                margin="normal"
                required
                disabled={isLoading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 3 }}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
              </Button>
            </form>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <form onSubmit={handleSignup}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                margin="normal"
                required
                disabled={isLoading}
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                margin="normal"
                required
                disabled={isLoading}
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                margin="normal"
                required
                disabled={isLoading}
                helperText="Password must contain at least 8 characters, including uppercase, lowercase, number, and special character (@$!%*?&)"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                margin="normal"
                required
                disabled={isLoading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={handleClickShowConfirmPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 3 }}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
              </Button>
            </form>
          </TabPanel>
        </CardContent>
      </Card>
    </Container>
  );
}

export default Login; 