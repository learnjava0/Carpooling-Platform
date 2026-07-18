import api from './api';

export const savedLocationService = {
  getSavedLocations: async () => {
    const response = await api.get('/users/saved-places');
    return response.data;
  },

  addSavedLocation: async (locationData) => {
    const response = await api.post('/users/saved-places', locationData);
    return response.data;
  },

  deleteSavedLocation: async (id) => {
    const response = await api.delete(`/users/saved-places/${id}`);
    return response.data;
  }
};
