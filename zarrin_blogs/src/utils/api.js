// API Base URL configuration
const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8200';

/**
 * Make API calls with automatic token attachment
 * @param {string} endpoint - API endpoint (e.g., '/api/blogs')
 * @param {object} options - Fetch options
 * @returns {Promise<Response>}
 */
export const fetchAPI = async (endpoint, options = {}) => {
  const url = `${API_BASE}${endpoint}`;
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

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
