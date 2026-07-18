import api from './api';

export const chatService = {
  getChatHistory: async (tripId) => {
    const response = await api.get(`/chat/${tripId}`);
    return response.data;
  }
};
