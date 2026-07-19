import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { rideService } from '../../services/rideService';
import { tripService } from '../../services/tripService';
import { MapPin, Clock, Users, Play, CheckCircle2, CheckSquare, Car, CarFront } from 'lucide-react';

const ActiveRides = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [otpInputs, setOtpInputs] = useState({});
  const [status, setStatus] = useState({ id: null, message: '', type: '' });
  const [editingRide, setEditingRide] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const fetchRides = async () => {
    setLoading(true);
    try {
      const data = await rideService.getDriverRides();
      // Filter out rides whose departure time is in the past, or are COMPLETED
      const activeData = data.filter(r => new Date(r.departureTime) >= new Date() && r.status !== 'COMPLETED');
      setRides(activeData);
    } catch (err) {
      console.error(err);
      setRides([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();
  }, []);

  const handleStartTrip = async (tripId) => {
    const otp = otpInputs[tripId];
    if (!otp || otp.length !== 4) {
      setStatus({ id: tripId, message: 'Please enter a valid 4-digit OTP', type: 'error' });
      return;
    }

    setStatus({ id: tripId, message: 'Verifying...', type: 'processing' });
    try {
      await tripService.verifyOtpAndStart(tripId, otp);
      setStatus({ id: tripId, message: 'Trip Started Successfully! SMS Sent.', type: 'success' });
      fetchRides(); // Refresh to update status
    } catch (err) {
      setStatus({ id: tripId, message: err.response?.data?.message || 'Invalid OTP', type: 'error' });
    }
  };

  const handleCompleteTrip = async (tripId) => {
    setStatus({ id: tripId, message: 'Completing...', type: 'processing' });
    try {
      await tripService.updateTripStatus(tripId, 'COMPLETED');
      setStatus({ id: tripId, message: 'Trip Completed! User can now pay.', type: 'success' });
      fetchRides();
    } catch (err) {
      setStatus({ id: tripId, message: 'Failed to complete trip', type: 'error' });
    }
  };

  const handleAcceptTrip = async (tripId) => {
    setStatus({ id: tripId, message: 'Accepting...', type: 'processing' });
    try {
      await tripService.acceptTrip(tripId);
      setStatus({ id: tripId, message: 'Trip accepted! OTP sent to passenger.', type: 'success' });
      fetchRides();
    } catch (err) {
      setStatus({ id: tripId, message: 'Failed to accept trip', type: 'error' });
    }
  };

  const handleRejectTrip = async (tripId) => {
    setStatus({ id: tripId, message: 'Rejecting...', type: 'processing' });
    try {
      await tripService.rejectTrip(tripId);
      setStatus({ id: tripId, message: 'Trip rejected.', type: 'success' });
      fetchRides();
    } catch (err) {
      setStatus({ id: tripId, message: 'Failed to reject trip', type: 'error' });
    }
  };

  const handleEditRide = (ride) => {
    setEditingRide(ride.id);
    setEditFormData({
      pickupLocation: ride.pickupLocation,
      destination: ride.destination,
      departureTime: ride.departureTime,
      farePerSeat: ride.farePerSeat,
      routeWaypoints: ride.routeWaypoints || ''
    });
  };

  const handleSaveRide = async (id) => {
    try {
      await rideService.updateMyRide(id, editFormData);
      setEditingRide(null);
      fetchRides();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update ride.');
    }
  };

  if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center">
            <CarFront className="w-6 h-6 mr-3 text-primary-500" />
            {user?.firstName}'s Active Rides
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage rides you are currently offering as a driver.</p>
      </div>

      <div className="space-y-6">
        {rides.map(ride => (
          <div key={ride.id} className="card p-0 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">
              {editingRide === ride.id ? (
                <div className="space-y-4">
                  <div className="flex space-x-4">
                    <input type="text" value={editFormData.pickupLocation} onChange={e => setEditFormData({...editFormData, pickupLocation: e.target.value})} className="input-field text-sm flex-1" placeholder="Pickup"/>
                    <input type="text" value={editFormData.destination} onChange={e => setEditFormData({...editFormData, destination: e.target.value})} className="input-field text-sm flex-1" placeholder="Destination"/>
                  </div>
                  <div className="flex space-x-4">
                    <input type="datetime-local" value={editFormData.departureTime.slice(0, 16)} onChange={e => setEditFormData({...editFormData, departureTime: e.target.value})} className="input-field text-sm flex-1"/>
                    <input type="number" value={editFormData.farePerSeat} onChange={e => setEditFormData({...editFormData, farePerSeat: e.target.value})} className="input-field text-sm flex-1" placeholder="Fare"/>
                    <input type="text" value={editFormData.routeWaypoints} onChange={e => setEditFormData({...editFormData, routeWaypoints: e.target.value})} className="input-field text-sm flex-1" placeholder="Waypoints (stops)"/>
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={() => handleSaveRide(ride.id)} className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium">Save</button>
                    <button onClick={() => setEditingRide(null)} className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center text-slate-900 dark:text-white font-semibold">
                      <MapPin className="w-4 h-4 mr-2 text-green-500" /> {ride.pickupLocation}
                    </div>
                    <div className="flex items-center text-slate-900 dark:text-white font-semibold">
                      <MapPin className="w-4 h-4 mr-2 text-red-500" /> {ride.destination}
                    </div>
                    {ride.routeWaypoints && (
                      <div className="text-xs text-slate-500 mt-1 ml-6">
                        Stops: {ride.routeWaypoints}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="flex justify-end space-x-2 mb-2">
                       {ride.trips?.length === 0 && (
                         <button onClick={() => handleEditRide(ride)} className="text-blue-600 hover:underline text-sm font-medium">Edit Ride</button>
                       )}
                    </div>
                    <div className="text-lg font-bold text-slate-900 dark:text-white">₹{ride.farePerSeat} <span className="text-sm font-normal text-slate-500">/seat</span></div>
                    <div className="text-sm text-slate-500 flex items-center justify-end mt-1">
                      <Clock className="w-3 h-3 mr-1" /> {new Date(ride.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center">
                <Users className="w-4 h-4 mr-2 text-slate-500" />
                Colleagues ({ride.trips?.length || 0})
              </h3>

              {ride.trips?.length === 0 ? (
                <div className="text-center py-6 text-slate-500 text-sm border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                  No bookings yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {ride.trips?.map(trip => (
                    <div key={trip.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl">
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {trip.passenger.firstName} {trip.passenger.lastName}
                        </div>
                        <div className="text-sm text-slate-500 mt-0.5">Seats Booked: {trip.bookedSeats}</div>
                      </div>

                      <div className="mt-4 sm:mt-0">
                        {status.id === trip.id && status.message && (
                          <div className={`text-xs mb-2 ${status.type === 'success' ? 'text-green-600' : status.type === 'error' ? 'text-red-600' : 'text-blue-600'}`}>
                            {status.message}
                          </div>
                        )}
                        
                        {trip.status === 'PENDING' ? (
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleAcceptTrip(trip.id)}
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                              Accept
                            </button>
                            <button 
                              onClick={() => handleRejectTrip(trip.id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        ) : trip.status === 'ACCEPTED' ? (
                          <div className="flex items-center space-x-2">
                            <input 
                              type="text" 
                              maxLength="4"
                              placeholder="Enter OTP"
                              className="input-field py-2 text-center w-24 text-sm font-bold tracking-widest"
                              value={otpInputs[trip.id] || ''}
                              onChange={(e) => setOtpInputs({...otpInputs, [trip.id]: e.target.value.replace(/\D/g, '')})}
                            />
                            <button 
                              onClick={() => handleStartTrip(trip.id)}
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                            >
                              <Play className="w-4 h-4 mr-1.5" /> Start
                            </button>
                            <button 
                              onClick={() => navigate('/employee/track', { state: { trip } })}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                            >
                              <MapPin className="w-4 h-4 mr-1.5" /> Track
                            </button>
                          </div>
                        ) : trip.status === 'REJECTED' ? (
                          <div className="flex items-center text-red-600 font-medium text-sm px-4 py-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                            Rejected
                          </div>
                        ) : trip.status === 'STARTED' ? (
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => navigate('/employee/track', { state: { trip } })}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                            >
                              <MapPin className="w-4 h-4 mr-1.5" /> Track
                            </button>
                            <button 
                              onClick={() => handleCompleteTrip(trip.id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                            >
                              <CheckSquare className="w-4 h-4 mr-1.5" /> Complete
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center text-green-600 font-medium text-sm px-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <CheckCircle2 className="w-4 h-4 mr-1.5" /> Completed
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {rides.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 card border-dashed">
            <Car className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p>You don't have any active rides.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveRides;
