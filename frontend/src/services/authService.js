import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  registerEmployee: async (employeeData) => {
    const response = await api.post('/auth/register', employeeData);
    return response.data;
  },

  resetPassword: async (email, oldPassword, newPassword) => {
    const response = await api.put('/users/reset-password', {
      email,
      oldPassword,
      newPassword
    });
    return response.data;
  }
};
