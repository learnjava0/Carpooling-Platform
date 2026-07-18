import api from './api';

export const adminService = {
  getSettings: async () => {
    const response = await api.get('/admin/settings');
    return response.data;
  },

  updateSettings: async (settings) => {
    const response = await api.put('/admin/settings', settings);
    return response.data;
  },

  getEmployees: async () => {
    const response = await api.get('/admin/employees');
    return response.data;
  },

  getVehicles: async () => {
    const response = await api.get('/admin/vehicles');
    return response.data;
  },

  onboardDriver: async (driverData) => {
    const response = await api.post('/auth/register', driverData); // use auth register since everyone is an employee
    return response.data;
  }
};
