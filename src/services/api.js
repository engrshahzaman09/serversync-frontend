 
import axios from 'axios';

const API_BASE_URL = 'http://52.72.156.170:8085/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);

// Server APIs
export const getAllServers = () => api.get('/servers');
export const addServer = (data) => api.post('/servers', data);
export const deleteServer = (id) => api.delete(`/servers/${id}`);

// Deployment APIs
export const getAllDeployments = () => api.get('/deployments');
export const createDeployment = (data) => api.post('/deployments', data);

// Script APIs
export const getAllScripts = () => api.get('/scripts');
export const executeScript = (id) => api.post(`/scripts/${id}/execute`);

export default api;