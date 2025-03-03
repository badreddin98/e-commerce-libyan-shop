const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? '/api'  // In production, use relative path
  : 'http://localhost:5000/api';

export default API_BASE_URL;
