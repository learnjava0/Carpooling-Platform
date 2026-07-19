import api from './api';

export const vehicleService = {
  getUserVehicles: async () => {
    const response = await api.get('/vehicles');
    return response.data;
  },
  registerVehicle: async (vehicleData) => {
    const response = await api.post('/vehicles', vehicleData);
    return response.data;
  },
  updateVehicle: async (id, vehicleData) => {
    const response = await api.put(`/vehicles/${id}`, vehicleData);
    return response.data;
  }
};
