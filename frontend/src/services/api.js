import axios from 'axios';

// Default API URL from environment
const DEFAULT_API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: DEFAULT_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to discover the API server port in case of redirection
const discoverApiPort = async () => {
  try {
    // Try contacting the default port
    await axios.get(`${DEFAULT_API_URL}/api/health`);
    return DEFAULT_API_URL;
  } catch (error) {
    if (error.response) {
      // Server responded even with an error, so the port is correct
      return DEFAULT_API_URL;
    }
    
    // If connection refused, server might be on a different port
    // Try some alternatives
    for (let port = 3002; port <= 3010; port++) {
      const alternativeUrl = `http://localhost:${port}`;
      try {
        await axios.get(`${alternativeUrl}/api/health`);
        console.log(`Discovered API on port ${port}`);
        // Update the base URL for future requests
        apiClient.defaults.baseURL = alternativeUrl;
        return alternativeUrl;
      } catch (error) {
        if (error.response) {
          // Server responded even with an error, so the port is correct
          console.log(`Discovered API on port ${port}`);
          // Update the base URL for future requests
          apiClient.defaults.baseURL = alternativeUrl;
          return alternativeUrl;
        }
        // Continue to next port if connection refused
      }
    }
    
    // If all alternatives fail, return the default
    return DEFAULT_API_URL;
  }
};

// Interceptor for handling token authentication
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add it to the headers
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor for handling response errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If server returns 401 Unauthorized
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh token or redirect to login
        // This depends on your authentication flow
        window.location.href = '/login';
        return Promise.reject(error);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Discover the API port on startup
discoverApiPort().catch(console.error);

export default apiClient; 