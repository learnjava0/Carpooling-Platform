/**
 * Axios instance — automatically attaches JWT from localStorage
 * and handles 401 by dispatching auth:logout.
 */
import axios from 'axios';
import { clearStorage, getAccessToken } from '../utils/storage';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api',
});

axiosInstance.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearStorage();
      window.dispatchEvent(new Event('auth:logout'));
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
