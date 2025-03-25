import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Save as SaveIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useThemeContext } from '../context/ThemeContext';
import * as authService from '../services/authService';

function Settings() {
  const { currentUser, updateUserProfile } = useAuth();
  const { darkMode, toggleDarkMode } = useThemeContext();
  
  // User profile settings
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  // Toggle password visibility handlers
  const handleClickShowCurrentPassword = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };

  const handleClickShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

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

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Only update profile details (not password)
      const profileData = {
        name: userForm.name !== undefined ? userForm.name : '',
        email: userForm.email,
      };

      console.log('Submitting profile data:', profileData);
      
      const updatedUser = await authService.updateUserProfile(profileData);
      console.log('Profile update successful:', updatedUser);
      
      // Make sure we update the context with the latest user data
      updateUserProfile(updatedUser);
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      console.error('Profile update failed:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'Failed to update profile. Please try again.' 
      });
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
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={userForm.currentPassword}
                        onChange={handleUserFormChange}
                        disabled={loading}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle current password visibility"
                                onClick={handleClickShowCurrentPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                              >
                                {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="New Password"
                        name="newPassword"
                        type={showNewPassword ? 'text' : 'password'}
                        value={userForm.newPassword}
                        onChange={handleUserFormChange}
                        disabled={loading}
                        helperText="Password must contain at least 8 characters, including uppercase, lowercase, number, and special character (@$!%*?&)"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle new password visibility"
                                onClick={handleClickShowNewPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                              >
                                {showNewPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Confirm New Password"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={userForm.confirmPassword}
                        onChange={handleUserFormChange}
                        disabled={loading}
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

          {/* Dark Mode Settings */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Appearance
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Box sx={{ mt: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={darkMode}
                            onChange={toggleDarkMode}
                            color="primary"
                          />
                        }
                        label="Dark Mode"
                      />
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