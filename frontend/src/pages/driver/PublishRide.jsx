import React, { useState, useEffect } from 'react';
import { rideService } from '../../services/rideService';
import { vehicleService } from '../../services/vehicleService';
import { MapPin, Calendar, CheckCircle2, AlertCircle, Send } from 'lucide-react';

const PublishRide = () => {
  const [formData, setFormData] = useState({
    pickupLocation: '',
    destination: '',
    departureTime: '',
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
      setFormData({ pickupLocation: '', destination: '', departureTime: '', farePerSeat: 150 });
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
                <input type="datetime-local" name="departureTime" value={formData.departureTime} onChange={handleChange} required className="input-field pl-10 text-sm" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Fare Per Seat (₹)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 font-medium">₹</span>
                <input type="number" name="farePerSeat" min="1" value={formData.farePerSeat} onChange={handleChange} required className="input-field pl-10 text-sm" />
              </div>
            </div>
          </div>
        </div>

        <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white font-medium py-3 rounded-xl shadow-lg shadow-green-500/30 flex items-center justify-center transition-all">
          {isLoading ? 'Publishing...' : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Publish Ride
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default PublishRide;
