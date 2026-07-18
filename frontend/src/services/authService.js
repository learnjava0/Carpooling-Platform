import axiosInstance from './axiosInstance';

export const authService = {
  async login(credentials) {
    const { data } = await axiosInstance.post('/auth/login', credentials);
    return data;
  },

  async register(payload) {
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      if (key === 'confirmPassword') return;
      if (key === 'profileImage') {
        if (value?.[0]) formData.append('profileImage', value[0]);
        return;
      }
      formData.append(key, value);
    });

    const { data } = await axiosInstance.post('/auth/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return data;
  },

  async refreshToken(refreshToken) {
    const { data } = await axiosInstance.post('/auth/refresh', { refreshToken });
    return data;
  },

  async getCurrentUser() {
    const { data } = await axiosInstance.get('/users/me');
    return data;
  },
};
