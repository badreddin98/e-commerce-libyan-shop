const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://libyan-shop.herokuapp.com/api'
  : 'http://localhost:5000/api';

const API_CONFIG = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
};

export default API_BASE_URL;
export { API_CONFIG };
