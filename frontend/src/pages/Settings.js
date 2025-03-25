import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Switch,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import * as authService from '../services/authService';

function Settings() {
  const { currentUser, updateUserProfile } = useAuth();
  
  // User profile settings
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Application preferences
  const [preferences, setPreferences] = useState({
    darkMode: false,
    notifications: true,
    currency: 'USD',
    refreshRate: '30',
    theme: 'light',
  });

  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  // Load user profile data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        if (currentUser) {
          // Pre-fill the form with current user data
          setUserForm({
            ...userForm,
            name: currentUser.name || '',
            email: currentUser.email || '',
          });
        }
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to load profile data.' });
      } finally {
        setProfileLoading(false);
      }
    };

    loadProfile();
  }, [currentUser]);

  const handleUserFormChange = (e) => {
    const { name, value } = e.target;
    setUserForm({
      ...userForm,
      [name]: value,
    });
  };

  const handlePreferencesChange = (e) => {
    const { name, value, checked } = e.target;
    setPreferences({
      ...preferences,
      [name]: e.target.type === 'checkbox' ? checked : value,
    });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Only update profile details (not password)
      const profileData = {
        name: userForm.name,
        email: userForm.email,
      };

      const updatedUser = await authService.updateUserProfile(profileData);
      updateUserProfile(updatedUser);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    // Client-side validation
    const validationErrors = [];
    
    if (!userForm.currentPassword) {
      validationErrors.push('Current password is required');
    }
    
    if (!userForm.newPassword) {
      validationErrors.push('New password is required');
    } else {
      // Password complexity validation
      const passwordErrors = [];
      if (userForm.newPassword.length < 8) {
        passwordErrors.push('at least 8 characters long');
      }
      if (!/[A-Z]/.test(userForm.newPassword)) {
        passwordErrors.push('one uppercase letter');
      }
      if (!/[a-z]/.test(userForm.newPassword)) {
        passwordErrors.push('one lowercase letter');
      }
      if (!/\d/.test(userForm.newPassword)) {
        passwordErrors.push('one number');
      }
      if (!/[@$!%*?&]/.test(userForm.newPassword)) {
        passwordErrors.push('one special character (@$!%*?&)');
      }
      
      if (passwordErrors.length > 0) {
        validationErrors.push(`New password must contain ${passwordErrors.join(', ')}`);
      }
    }
    
    // Validate passwords match
    if (userForm.newPassword !== userForm.confirmPassword) {
      validationErrors.push('New passwords do not match');
    }
    
    if (validationErrors.length > 0) {
      setMessage({ type: 'error', text: validationErrors.join('. ') });
      return;
    }
    
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await authService.updatePassword(
        userForm.currentPassword,
        userForm.newPassword
      );
      
      // Clear password fields
      setUserForm({
        ...userForm,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      setMessage({ type: 'success', text: 'Password updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to update password.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSavePreferences = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // TODO: We'll connect this to a user preferences API endpoint later
      console.log('Saving preferences:', preferences);
      setMessage({ type: 'success', text: 'Preferences saved successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save preferences.' });
    } finally {
      setLoading(false);
    }
  };

  if (profileLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ pt: 2, pb: 6 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Settings
        </Typography>

        {message.text && (
          <Alert severity={message.type} sx={{ mb: 3 }}>
            {message.text}
          </Alert>
        )}

        <Grid container spacing={4}>
          {/* Profile Settings */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Profile Settings
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Box component="form" onSubmit={handleSaveProfile} sx={{ mt: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Name"
                        name="name"
                        value={userForm.name}
                        onChange={handleUserFormChange}
                        disabled={loading}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={userForm.email}
                        onChange={handleUserFormChange}
                        disabled={loading}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                        sx={{ mt: 2 }}
                        disabled={loading}
                      >
                        Save Profile
                      </Button>
                    </Grid>
                  </Grid>
                </Box>

                {/* Password Change Form */}
                <Box component="form" onSubmit={handleChangePassword} sx={{ mt: 4 }}>
                  <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                    Change Password
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Current Password"
                        name="currentPassword"
                        type="password"
                        value={userForm.currentPassword}
                        onChange={handleUserFormChange}
                        disabled={loading}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="New Password"
                        name="newPassword"
                        type="password"
                        value={userForm.newPassword}
                        onChange={handleUserFormChange}
                        disabled={loading}
                        helperText="Password must contain at least 8 characters, including uppercase, lowercase, number, and special character (@$!%*?&)"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Confirm New Password"
                        name="confirmPassword"
                        type="password"
                        value={userForm.confirmPassword}
                        onChange={handleUserFormChange}
                        disabled={loading}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                        sx={{ mt: 2 }}
                        disabled={loading || !userForm.currentPassword || !userForm.newPassword || !userForm.confirmPassword}
                      >
                        Update Password
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Application Preferences */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Application Preferences
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Box component="form" onSubmit={handleSavePreferences} sx={{ mt: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            name="darkMode"
                            checked={preferences.darkMode}
                            onChange={handlePreferencesChange}
                            color="primary"
                            disabled={loading}
                          />
                        }
                        label="Dark Mode"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            name="notifications"
                            checked={preferences.notifications}
                            onChange={handlePreferencesChange}
                            color="primary"
                            disabled={loading}
                          />
                        }
                        label="Enable Notifications"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl component="fieldset" sx={{ mt: 2 }}>
                        <FormLabel component="legend">Default Currency</FormLabel>
                        <RadioGroup
                          name="currency"
                          value={preferences.currency}
                          onChange={handlePreferencesChange}
                          row
                        >
                          <FormControlLabel value="USD" control={<Radio disabled={loading} />} label="USD" />
                          <FormControlLabel value="EUR" control={<Radio disabled={loading} />} label="EUR" />
                          <FormControlLabel value="GBP" control={<Radio disabled={loading} />} label="GBP" />
                          <FormControlLabel value="BTC" control={<Radio disabled={loading} />} label="BTC" />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        select
                        fullWidth
                        label="Data Refresh Rate"
                        name="refreshRate"
                        value={preferences.refreshRate}
                        onChange={handlePreferencesChange}
                        SelectProps={{
                          native: true,
                        }}
                        disabled={loading}
                      >
                        <option value="15">15 seconds</option>
                        <option value="30">30 seconds</option>
                        <option value="60">1 minute</option>
                        <option value="300">5 minutes</option>
                      </TextField>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        select
                        fullWidth
                        label="Theme"
                        name="theme"
                        value={preferences.theme}
                        onChange={handlePreferencesChange}
                        SelectProps={{
                          native: true,
                        }}
                        disabled={loading}
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="system">System Default</option>
                      </TextField>
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                        sx={{ mt: 2 }}
                        disabled={loading}
                      >
                        Save Preferences
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default Settings; 