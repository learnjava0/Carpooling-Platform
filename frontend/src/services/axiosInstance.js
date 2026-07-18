import axios from 'axios';
import {
  clearStorage,
  getAccessToken,
  getRefreshToken,
  saveTokens,
} from '../utils/storage';

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
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest?._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        throw new Error('Refresh token is missing');
      }

      const { data } = await axios.post('http://localhost:8080/api/auth/refresh', {
        refreshToken,
      });

      saveTokens(data);
      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

      return axiosInstance(originalRequest);
    } catch (refreshError) {
      clearStorage();
      window.dispatchEvent(new Event('auth:logout'));
      return Promise.reject(refreshError);
    }
  },
);

export default axiosInstance;
