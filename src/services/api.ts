import axios from 'axios';

// API base URL — set VITE_API_BASE_URL in .env for production (e.g. Render/Railway backend)
// Development default: http://localhost:8000/api/v1
const API_BASE_URL =
  (import.meta as any).env?.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to attach JWT access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('krishi_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses for token refresh or redirect
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — caller handles logout/redirect
    }
    return Promise.reject(error);
  }
);
