import React, { useState } from 'react';
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
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';

function Settings() {
  // User profile settings
  const [userForm, setUserForm] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
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

  const handleSaveProfile = (e) => {
    e.preventDefault();
    console.log('Saving profile:', userForm);
    // TODO: Implement actual profile save logic
  };

  const handleSavePreferences = (e) => {
    e.preventDefault();
    console.log('Saving preferences:', preferences);
    // TODO: Implement actual preferences save logic
  };

  const handleSave = async () => {
    try {
      // TODO: Implement save settings logic
      console.log('Saving settings:', { userForm, preferences });
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
    }
  };

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
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                        Change Password
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Current Password"
                        name="currentPassword"
                        type="password"
                        value={userForm.currentPassword}
                        onChange={handleUserFormChange}
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
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={<SaveIcon />}
                        sx={{ mt: 2 }}
                      >
                        Save Profile
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
                          <FormControlLabel value="USD" control={<Radio />} label="USD" />
                          <FormControlLabel value="EUR" control={<Radio />} label="EUR" />
                          <FormControlLabel value="GBP" control={<Radio />} label="GBP" />
                          <FormControlLabel value="BTC" control={<Radio />} label="BTC" />
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
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="system">System</option>
                      </TextField>
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={<SaveIcon />}
                        sx={{ mt: 2 }}
                      >
                        Save Preferences
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Danger Zone */}
          <Grid item xs={12}>
            <Card sx={{ borderTop: '4px solid #f44336' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="error">
                  Danger Zone
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="subtitle1">Delete Account</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Once you delete your account, there is no going back. This action cannot be undone.
                    </Typography>
                  </Box>
                  <Button variant="outlined" color="error">
                    Delete Account
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Settings; 