import React, { useState, useEffect } from 'react';
import { rideService } from '../../services/rideService';
import { vehicleService } from '../../services/vehicleService';
import { MapPin, Calendar, CheckCircle2, AlertCircle, Send } from 'lucide-react';

const PublishRide = () => {
  const [formData, setFormData] = useState({
    pickupLocation: '',
    destination: '',
    departureTime: '',
    availableSeats: 3,
    farePerSeat: 150,
  });

  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [vehicleId, setVehicleId] = useState(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const vehicles = await vehicleService.getUserVehicles();
        if (vehicles && vehicles.length > 0) {
          setVehicleId(vehicles[0].id);
        } else {
          setStatus({ type: 'error', message: 'You need an onboarded vehicle to publish rides.' });
        }
      } catch (err) {
        setStatus({ type: 'error', message: 'Failed to fetch your vehicle information.' });
      }
    };
    fetchVehicles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!vehicleId) {
      setStatus({ type: 'error', message: 'Cannot publish ride without an assigned vehicle.' });
      return;
    }

    setIsLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await rideService.publishRide({
        ...formData,
        vehicleId: vehicleId
      });
      setStatus({ type: 'success', message: 'Ride successfully published!' });
      setFormData({ pickupLocation: '', destination: '', departureTime: '', availableSeats: 3, farePerSeat: 150 });
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Failed to publish ride.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Publish a Ride</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Offer empty seats to your colleagues and share travel costs.</p>
      </div>

      {status.message && (
        <div className={`p-4 rounded-xl border flex items-start space-x-3 ${status.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
          {status.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <p className="font-medium text-sm">{status.message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card p-6 sm:p-8 space-y-6">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Pickup Location</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MapPin className="h-4 w-4 text-slate-400" />
              </div>
              <input type="text" name="pickupLocation" value={formData.pickupLocation} onChange={handleChange} required className="input-field pl-10 text-sm" placeholder="e.g. IT Park Main Gate" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Destination</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MapPin className="h-4 w-4 text-slate-400" />
              </div>
              <input type="text" name="destination" value={formData.destination} onChange={handleChange} required className="input-field pl-10 text-sm" placeholder="e.g. Metro Station Sector 21" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Departure Time</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Calendar className="h-4 w-4 text-slate-400" />
                </div>
                <input type="datetime-local" name="departureTime" step="1" value={formData.departureTime} onChange={handleChange} required className="input-field pl-10 text-sm" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Available Seats</label>
              <input type="number" name="availableSeats" min="1" max="8" value={formData.availableSeats} onChange={handleChange} required className="input-field w-full pl-4 text-sm" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Fare Per Seat (₹)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 font-medium">₹</span>
                <input type="number" name="farePerSeat" min="1" value={formData.farePerSeat} onChange={handleChange} required className="input-field pl-10 text-sm" />
              </div>
            </div>
          </div>

          <div className="flex items-center mt-2">
            <input type="checkbox" id="recurringRide" name="isRecurring" className="w-4 h-4 text-primary-600 bg-slate-100 border-slate-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600" />
            <label htmlFor="recurringRide" className="ml-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              Set as a Recurring Ride (Daily Commute)
            </label>
          </div>
        </div>

        <button type="submit" disabled={isLoading} className="w-full btn-primary py-3 flex items-center justify-center">
          {isLoading ? 'Publishing...' : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Publish Ride
            </>
          )}
        </button>
      </form>

      {/* Calculated Route Confirmation (Appears when both locations are entered) */}
      {formData.pickupLocation.length > 2 && formData.destination.length > 2 && (
        <div className="card p-6 mt-6 border-2 border-primary-100 dark:border-primary-900/30">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Calculated Route Confirmation</h3>
          
          <div className="h-48 bg-slate-200 dark:bg-slate-800 relative w-full flex items-center justify-center rounded-xl overflow-hidden shadow-inner">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            
            <div className="relative w-full max-w-md mx-auto h-24 flex items-center justify-between px-8 mt-2">
              <div className="relative flex flex-col items-center">
                <div className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase absolute -top-6 whitespace-nowrap bg-white/80 dark:bg-slate-900/80 px-2 py-0.5 rounded shadow-sm">{formData.pickupLocation}</div>
                <div className="w-4 h-4 bg-primary-600 rounded-full z-10 ring-4 ring-primary-200"></div>
              </div>
              
              <div className="flex-1 h-1 bg-primary-300 dark:bg-primary-700/50 relative overflow-hidden mx-2 border-t-2 border-dashed border-primary-500">
              </div>
              
              <div className="relative flex flex-col items-center">
                <div className="text-xs font-bold text-red-600 dark:text-red-400 uppercase absolute -top-8 text-center whitespace-nowrap bg-white/80 dark:bg-slate-900/80 px-2 py-0.5 rounded shadow-sm">{formData.destination}</div>
                <MapPin className="text-red-500 w-6 h-6 z-10 -mt-2" />
              </div>
            </div>

            <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-2 rounded-lg shadow flex items-center space-x-3">
              <div>
                <div className="text-[10px] text-slate-500 font-semibold uppercase">Est. Distance</div>
                <div className="text-sm font-bold text-slate-800 dark:text-white">12.5 km</div>
              </div>
              <div className="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>
              <div>
                <div className="text-[10px] text-slate-500 font-semibold uppercase">Est. Time</div>
                <div className="text-sm font-bold text-primary-600">35 mins</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublishRide;
