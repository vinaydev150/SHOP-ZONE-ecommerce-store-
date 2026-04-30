import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// Request interceptor — runs before every request
// Automatically attaches JWT token to every outgoing request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — runs after every response
// If token expired or invalid, auto logout and redirect to login
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;