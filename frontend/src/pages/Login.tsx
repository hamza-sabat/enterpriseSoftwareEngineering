import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  Link,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';

interface TabPanelProps {
  children: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const Login = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login with:', formData.email, formData.password);
    // TODO: Implement actual login logic
    navigate('/market');
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Signup with:', formData);
    // TODO: Implement actual signup logic
    navigate('/market');
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h4" sx={{ mb: 2 }}>
          Crypto Portfolio Tracker
        </Typography>
        <Card sx={{ width: '100%', borderRadius: 2, boxShadow: 3 }}>
          <CardContent>
            <Tabs value={tabValue} onChange={handleTabChange} centered>
              <Tab label="Login" />
              <Tab label="Sign Up" />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              <Box component="form" onSubmit={handleLogin} noValidate>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={formData.email}
                  onChange={handleChange}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Login
                </Button>
                <Grid container>
                  <Grid item xs>
                    <Link href="#" variant="body2">
                      Forgot password?
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link href="#" variant="body2" onClick={() => setTabValue(1)}>
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Box component="form" onSubmit={handleSignup} noValidate>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="signup-email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="signup-password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirm-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign Up
                </Button>
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Link href="#" variant="body2" onClick={() => setTabValue(0)}>
                      Already have an account? Login
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </TabPanel>
          </CardContent>
        </Card>
        <Box mt={4}>
          <Divider sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => navigate('/market')}
            sx={{ mb: 2 }}
          >
            Continue as Guest
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Login; 