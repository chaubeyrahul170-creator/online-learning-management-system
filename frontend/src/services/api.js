import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Request Interceptor: Har request ke sath auto JWT Token bhejne ke liye
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('edulearn_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
