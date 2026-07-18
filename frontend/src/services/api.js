/**
 * api.js — centralised service layer for all backend domains
 * All calls use the axios instance that auto-attaches the JWT.
 */
import axiosInstance from './axiosInstance';

// ─── Rides ──────────────────────────────────────────────────────────────────

/**
 * Search available rides.
 * Backend: GET /api/rides/search?pickupLocation=&destination=&departureTime=&seats=
 * departureTime must be ISO-8601 datetime string.
 */
export const searchRides = ({ pickupLocation, destination, departureTime, seats }) =>
  axiosInstance.get('/rides/search', {
    params: { pickupLocation, destination, departureTime, seats },
  }).then((r) => r.data);

/**
 * Get rides offered by the current user (driver).
 * Backend: GET /api/rides/me
 */
export const getMyRides = () =>
  axiosInstance.get('/rides/me').then((r) => r.data);

/**
 * Offer / publish a new ride.
 * Backend: POST /api/rides
 * payload: { vehicleId, pickupLocation, destination, departureTime, availableSeats, farePerSeat }
 */
export const publishRide = (payload) =>
  axiosInstance.post('/rides', payload).then((r) => r.data);

// ─── Trips ──────────────────────────────────────────────────────────────────

/**
 * Get trips booked by the current user (passenger).
 * Backend: GET /api/trips/me
 */
export const getMyTrips = () =>
  axiosInstance.get('/trips/me').then((r) => r.data);

/**
 * Book a trip (join a ride as passenger).
 * Backend: POST /api/trips
 * payload: { rideId, bookedSeats }
 */
export const bookTrip = (payload) =>
  axiosInstance.post('/trips', payload).then((r) => r.data);

/**
 * Update trip status (driver action: CONFIRMED / CANCELLED / COMPLETED).
 * Backend: PATCH /api/trips/{tripId}/status?status=
 */
export const updateTripStatus = (tripId, status) =>
  axiosInstance.patch(`/trips/${tripId}/status`, null, { params: { status } }).then((r) => r.data);

// ─── Vehicles ────────────────────────────────────────────────────────────────

/**
 * Get vehicles owned by the current user.
 * Backend: GET /api/vehicles
 */
export const getMyVehicles = () =>
  axiosInstance.get('/vehicles').then((r) => r.data);

/**
 * Register / add a new vehicle.
 * Backend: POST /api/vehicles
 * payload: { model, registrationNumber, seatingCapacity }
 */
export const addVehicle = (payload) =>
  axiosInstance.post('/vehicles', payload).then((r) => r.data);

// ─── Wallet ──────────────────────────────────────────────────────────────────

/**
 * Get the current user's wallet.
 * Backend: GET /api/payments/wallet
 */
export const getWallet = () =>
  axiosInstance.get('/payments/wallet').then((r) => r.data);

/**
 * Recharge the wallet.
 * Backend: POST /api/payments/wallet/recharge
 * payload: { amount, paymentMethod }
 */
export const rechargeWallet = (payload) =>
  axiosInstance.post('/payments/wallet/recharge', payload).then((r) => r.data);

/**
 * Get wallet transactions.
 * Backend: GET /api/payments/transactions
 */
export const getTransactions = () =>
  axiosInstance.get('/payments/transactions').then((r) => r.data);

// ─── Analytics (admin) ───────────────────────────────────────────────────────

/**
 * Get admin analytics dashboard.
 * Backend: GET /api/analytics/dashboard  (requires COMPANY_ADMIN role)
 */
export const getAnalyticsDashboard = () =>
  axiosInstance.get('/analytics/dashboard').then((r) => r.data);

// ─── Live Tracking ──────────────────────────────────────────────────────────

export const updateLiveLocation = (tripId, payload) =>
  axiosInstance.post(`/tracking/${tripId}/location`, payload).then((r) => r.data);

export const getLiveLocation = (tripId) =>
  axiosInstance.get(`/tracking/${tripId}/location`).then((r) => r.data);
