import api from './api';

export const tripService = {
  bookTrip: async (tripRequest) => {
    const response = await api.post('/trips', tripRequest);
    return response.data;
  },
  getMyTrips: async () => {
    const response = await api.get('/trips/me');
    return response.data;
  },
  updateTripStatus: async (tripId, status) => {
    const response = await api.patch(`/trips/${tripId}/status`, null, { params: { status } });
    return response.data;
  },
  verifyOtpAndStart: async (tripId, otp) => {
    const response = await api.post(`/trips/${tripId}/verify-otp`, null, { params: { otp } });
    return response.data;
  },
  cancelTrip: async (tripId) => {
    const response = await api.patch(`/trips/${tripId}/cancel`);
    return response.data;
  },
  acceptTrip: async (tripId) => {
    const response = await api.post(`/trips/${tripId}/accept`);
    return response.data;
  },
  rejectTrip: async (tripId) => {
    const response = await api.post(`/trips/${tripId}/reject`);
    return response.data;
  }
};
