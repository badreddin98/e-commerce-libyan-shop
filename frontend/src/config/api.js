const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? '/api'  // Use relative path in production for better reliability
  : 'http://localhost:5000/api';

const API_CONFIG = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true,
  timeout: 30000 // 30 second timeout
};

export default API_BASE_URL;
export { API_CONFIG };
