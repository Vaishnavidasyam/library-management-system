import axios from 'axios';

// client/src/services/api.js
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_BASE_URL = `${API_BASE}/api`;
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error.response?.data || error)
);

export default api;
