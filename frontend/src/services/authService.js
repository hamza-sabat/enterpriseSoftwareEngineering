import axios from 'axios';

// Create axios instance with base URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to include the token in requests
api.interceptors.request.use(
  (config) => {
    // Get the latest token from localStorage each time a request is made
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Login failed');
    }
    throw new Error('Network error. Please check your connection.');
  }
};

export const register = async (email, password, name) => {
  try {
    const response = await api.post('/auth/register', { email, password, name });
    return response.data;
  } catch (error) {
    // Check if this is a validation error with specific field errors
    if (error.response && error.response.data && error.response.data.errors) {
      const errorMessages = [];
      const errors = error.response.data.errors;
      
      // Format validation errors
      Object.keys(errors).forEach(field => {
        errorMessages.push(`${errors[field]}`);
      });
      
      throw new Error(errorMessages.join('. '));
    } else if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    
    throw new Error('Network error. Please check your connection.');
  }
};

export const getUserProfile = async () => {
  try {
    const response = await api.get('/auth/profile');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch profile');
  }
};

export const updateUserProfile = async (userData) => {
  try {
    console.log('Sending profile update request with data:', userData);
    const response = await api.put('/auth/profile', userData);
    console.log('Profile update response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Profile update error:', error);
    console.error('Error response:', error.response?.data);
    
    // Provide more detailed error information
    let errorMessage = 'Failed to update profile';
    if (error.response && error.response.data) {
      errorMessage = error.response.data.message || error.response.data.error || errorMessage;
      // If there are validation errors, join them
      if (error.response.data.errors) {
        const validationErrors = Object.values(error.response.data.errors).join('. ');
        errorMessage = `${errorMessage}: ${validationErrors}`;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};

export const updatePassword = async (currentPassword, newPassword) => {
  try {
    const response = await api.put('/auth/password', { currentPassword, newPassword });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update password');
  }
};

export default {
  login,
  register,
  getUserProfile,
  updateUserProfile,
  updatePassword,
}; 