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
    const response = await api.post('/auth/register', driverData);
    return response.data;
  },

  deleteEmployee: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  updateEmployeeRole: async (id, role) => {
    const response = await api.put(`/admin/users/${id}/role?role=${role}`);
    return response.data;
  },

  deleteVehicle: async (id) => {
    const response = await api.delete(`/admin/vehicles/${id}`);
    return response.data;
  }
};
