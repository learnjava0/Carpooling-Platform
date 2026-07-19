import React, { useState } from 'react';
import { rideService } from '../services/rideService';
import { X } from 'lucide-react';

const EditRideModal = ({ ride, onClose, onSuccess }) => {
  const [pickupLocation, setPickupLocation] = useState(ride.pickupLocation || '');
  const [destination, setDestination] = useState(ride.destination || '');
  const [departureTime, setDepartureTime] = useState(
    ride.departureTime ? new Date(ride.departureTime).toISOString().slice(0, 16) : ''
  );
  const [farePerSeat, setFarePerSeat] = useState(ride.farePerSeat || 0);
  const [routeWaypoints, setRouteWaypoints] = useState(ride.routeWaypoints || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const updatedRide = {
        pickupLocation,
        destination,
        departureTime: new Date(departureTime),
        farePerSeat,
        routeWaypoints,
      };
      await rideService.updateMyRide(ride.id, updatedRide);
      onSuccess();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update ride');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Edit Ride</h2>
        {error && (
          <div className="mb-4 text-sm text-red-600 border border-red-200 rounded p-2 bg-red-50">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Pickup Location</label>
            <input
              type="text"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className="w-full rounded border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Destination</label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full rounded border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Departure Time</label>
            <input
              type="datetime-local"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              className="w-full rounded border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Fare per Seat (₹)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={farePerSeat}
              onChange={(e) => setFarePerSeat(parseFloat(e.target.value))}
              className="w-full rounded border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Route Waypoints (comma separated)</label>
            <input
              type="text"
              value={routeWaypoints}
              onChange={(e) => setRouteWaypoints(e.target.value)}
              className="w-full rounded border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 hover:bg-gray-300 dark:hover:bg-slate-500 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 transition"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRideModal;
