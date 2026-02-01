/**
 * API Configuration Utility
 * 
 * This centralizes all API URL handling to ensure:
 * 1. Production uses Render backend (https://zarrin-blogs-backend.onrender.com)
 * 2. Development uses localhost (http://localhost:8200)
 * 3. All requests include proper credentials for authentication
 * 4. CORS headers are properly set
 * 
 * WHY: Eliminates scattered hardcoded URLs and ensures consistency across the app
 */

// Get the API base URL from environment variables
// For production: uses REACT_APP_API_BASE_URL from .env.production
// For development: uses REACT_APP_API_BASE_URL from .env
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8200';

/**
 * Build a complete API endpoint URL
 * @param {string} path - The API path (e.g., '/api/auth/login')
 * @returns {string} - The complete URL
 */
export const getApiUrl = (path) => {
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

/**
 * Fetch with proper production-ready configuration
 * Includes credentials for authentication cookies/JWT
 * 
 * WHY credentials: 'include':
 * - Ensures cookies are sent with cross-origin requests
 * - Required for JWT authentication in production
 * - Without this, auth tokens won't be sent to Render backend
 * 
 * @param {string} url - The API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise} - Fetch promise
 */
export const apiCall = async (url, options = {}) => {
  const defaultOptions = {
    credentials: 'include', // CRITICAL: Include cookies/auth headers
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, defaultOptions);
  
  // Handle authentication errors
  if (response.status === 401) {
    // Unauthorized - token likely expired
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Optionally redirect to login
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  return response;
};

/**
 * Formatted fetch with automatic JSON parsing
 * @param {string} path - API path
 * @param {object} options - Fetch options
 * @returns {Promise<object>} - Parsed JSON response
 */
export const fetchApi = async (path, options = {}) => {
  const url = getApiUrl(path);
  const response = await apiCall(url, options);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API Error: ${response.status}`);
  }
  
  return response.json();
};

const config = {
  API_BASE_URL,
  getApiUrl,
  apiCall,
  fetchApi,
};

export default config;
