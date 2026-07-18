import api from './api';

export const adminService = {
  getUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },
  getVehicles: async () => {
    const response = await api.get('/admin/vehicles');
    return response.data;
  },
  onboardDriver: async (driverData) => {
    const response = await api.post('/admin/drivers/onboard', driverData);
    return response.data;
  }
};
