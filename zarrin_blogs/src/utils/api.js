/**
 * Auth Debug (VERY IMPORTANT):
 * Ensure all protected routes:
 * - Send Authorization: Bearer <token>
 * - Handle 401 responses properly
 * - Do not clear user state unnecessarily
 *
 * This fixes random logout alerts.
 */

// API Base URL configuration
const API_BASE = process.env.REACT_APP_API_BASE_URL || 'https://zarrin-blogs-backend.onrender.com';

// Track if we're currently refreshing token to prevent infinite loops
let isRefreshingToken = false;
let refreshTokenPromise = null;

/**
 * Refresh the access token using the refresh token
 * @returns {Promise<string|null>} New access token or null if refresh fails
 */
export const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      console.log('No refresh token available');
      return null;
    }

    const response = await fetch(`${API_BASE}/api/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refreshToken })
    });

    if (!response.ok) {
      console.error('Token refresh failed:', response.status);
      // Clear tokens on refresh failure
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      // Logout user
      window.dispatchEvent(new Event('logout'));
      return null;
    }

    const data = await response.json();
    const newAccessToken = data.accessToken;
    const newRefreshToken = data.refreshToken;

    // Store new tokens
    localStorage.setItem('token', newAccessToken);
    localStorage.setItem('refreshToken', newRefreshToken);

    console.log('✅ Token refreshed successfully');
    return newAccessToken;
  } catch (error) {
    console.error('Token refresh error:', error);
    // Clear tokens on error
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    // Logout user
    window.dispatchEvent(new Event('logout'));
    return null;
  }
};

/**
 * Make API calls with automatic token attachment and refresh on 401
 * @param {string} endpoint - API endpoint (e.g., '/api/blogs')
 * @param {object} options - Fetch options
 * @returns {Promise<Response>}
 */
export const fetchAPI = async (endpoint, options = {}) => {
  const url = `${API_BASE}${endpoint}`;
  let token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response = await fetch(url, {
    ...options,
    headers
  });

  // If 401 and we have a refresh token, try to refresh and retry
  if (response.status === 401 && localStorage.getItem('refreshToken')) {
    console.log('🔄 Access token expired, attempting refresh...');
    
    // Prevent multiple simultaneous refresh attempts
    if (isRefreshingToken) {
      if (!refreshTokenPromise) {
        // This shouldn't happen, but just in case
        isRefreshingToken = false;
      } else {
        // Wait for the existing refresh to complete
        await refreshTokenPromise;
        token = localStorage.getItem('token');
      }
    } else {
      isRefreshingToken = true;
      refreshTokenPromise = refreshAccessToken();
      token = await refreshTokenPromise;
      isRefreshingToken = false;
      refreshTokenPromise = null;
    }

    if (token) {
      // Retry with new token
      const retryHeaders = {
        ...headers,
        'Authorization': `Bearer ${token}`
      };

      response = await fetch(url, {
        ...options,
        headers: retryHeaders
      });
    }
  }

  return response;
};

/**
 * Make API call and parse JSON response
 */
export const fetchAPIJSON = async (endpoint, options = {}) => {
  const response = await fetchAPI(endpoint, options);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || `API Error: ${response.status}`);
  }
  
  return response.json();
};

export default API_BASE;
