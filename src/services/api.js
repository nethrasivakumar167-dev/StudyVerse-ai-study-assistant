import axios from 'axios';

// Base API configuration prepared for future backend integration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  // Generous client timeout (75s) to allow multi-stage public AI synthesis
  timeout: 75000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach superhero auth token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('studyverse_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with graceful error degradation
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.warn('[Studyverse API Alert] Backend not currently reachable. Falling back to local Intelligence Core simulation.', error.message);
    return Promise.reject(error);
  }
);

export default api;
