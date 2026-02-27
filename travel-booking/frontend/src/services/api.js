import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchPrediction = async () => {
  try {
    const response = await api.get('/predict');
    return response.data;
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please try again.');
    } else if (error.response) {
      throw new Error(`Server error: ${error.response.status}`);
    } else if (error.request) {
      throw new Error('Cannot connect to backend. Please ensure the server is running at http://localhost:8000');
    } else {
      throw new Error('An unexpected error occurred.');
    }
  }
};

export default api;
