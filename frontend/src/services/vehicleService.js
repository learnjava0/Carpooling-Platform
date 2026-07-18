import api from './api';

export const vehicleService = {
  getUserVehicles: async () => {
    const response = await api.get('/vehicles');
    return response.data;
  },
  registerVehicle: async (vehicleData) => {
    const response = await api.post('/vehicles', vehicleData);
    return response.data;
  }
};
