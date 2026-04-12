import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const login = async (email, password) => {
  const formData = new URLSearchParams();
  formData.append('username', email);
  formData.append('password', password);
  const response = await api.post('/auth/login', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return response.data;
};

export const signup = async (email, password, role, airlineId) => {
  const response = await api.post('/auth/signup', {
    email,
    password,
    role,
    airline_id: airlineId,
  });
  return response.data;
};

export const fetchLounges = async () => {
  const response = await api.get('/lounges/');
  return response.data;
};

export const fetchLounge = async (loungeId) => {
  const response = await api.get(`/lounges/${loungeId}`);
  return response.data;
};

export const fetchForecast = async (loungeId) => {
  const response = await api.get(`/lounges/${loungeId}/forecast`);
  return response.data;
};

export const fetchPrediction = async () => {
  const response = await api.get('/predict');
  return response.data;
};

export default api;