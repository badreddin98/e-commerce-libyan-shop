const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://million-project-backend-eeb52b8b30d1.herokuapp.com/api'
  : 'http://localhost:5000/api';

export default API_BASE_URL;
