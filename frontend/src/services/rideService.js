import api from './api';

export const rideService = {
  searchRides: async (pickupLocation, destination, departureTime, seats = 1) => {
    const response = await api.get('/rides/search', { 
      params: { pickupLocation, destination, departureTime, seats } 
    });
    return response.data;
  },
  publishRide: async (rideData) => {
    const response = await api.post('/rides', rideData);
    return response.data;
  },
  getDriverRides: async () => {
    const response = await api.get('/rides/me');
    return response.data;
  },
  updateMyRide: async (id, rideData) => {
    const response = await api.put(`/rides/${id}`, rideData);
    return response.data;
  },
  getAvailableLocations: async () => {
    const response = await api.get('/rides/locations');
    return response.data;
  },
  deleteRide: async (id) => {
    const response = await api.delete(`/rides/${id}`);
    return response.data;
  }
};
