import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Response interceptor to normalize error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMessage = 'Unable to connect to the server. Please try again.';

    if (error.response) {
      if (error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.response.status === 409) {
        errorMessage = 'A book with this ID already exists.';
      } else if (error.response.status === 404) {
        errorMessage = 'Requested book not found.';
      } else if (error.response.status === 400) {
        errorMessage = 'Invalid request. Please check input values.';
      } else if (error.response.status >= 500) {
        errorMessage = 'Internal server error occurred on the backend.';
      }
    } else if (error.request) {
      errorMessage = 'Unable to connect to the server. Please ensure the backend is running at ' + API_BASE_URL;
    }

    const enhancedError = new Error(errorMessage);
    enhancedError.originalError = error;
    enhancedError.response = error.response;
    return Promise.reject(enhancedError);
  }
);

export default api;

