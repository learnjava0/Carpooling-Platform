import React, { useState } from 'react';
import { rideService } from '../../services/rideService';
import { tripService } from '../../services/tripService';
import { Search, MapPin, Calendar, Clock, User, IndianRupee, ArrowRight, ShieldCheck, Car } from 'lucide-react';

const DiscoverRides = () => {
  const [searchParams, setSearchParams] = useState({
    source: '',
    destination: '',
    date: ''
  });
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingStatus, setBookingStatus] = useState({ id: null, status: '' });

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const searchDate = searchParams.date || new Date().toISOString();
      const results = await rideService.searchRides(searchParams.source, searchParams.destination, searchDate, 1);
      setRides(results || []);
    } catch (err) {
      console.error(err);
      setRides([]); // Removed fallback mock data for real-time validation
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (rideId) => {
    setBookingStatus({ id: rideId, status: 'booking' });
    try {
      const response = await tripService.bookTrip({ rideId, bookedSeats: 1 });
      setBookingStatus({ id: rideId, status: 'success', otp: response.startOtp });
    } catch (err) {
      setBookingStatus({ id: rideId, status: 'error' });
    }
  };

  return (
    <div className="space-y-8">
      {/* Search Header */}
      <div className="bg-[#171a20] dark:bg-white rounded-md p-8 sm:p-12 text-white dark:text-[#171a20] shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Find a Ride. Share the Journey.</h1>
          <p className="text-primary-100 text-lg mb-8">Commute with trusted colleagues and save up to 40% on daily travel.</p>
          
          <form onSubmit={handleSearch} className="bg-white dark:bg-slate-800 p-4 rounded-2xl flex flex-col md:flex-row gap-4 shadow-lg">
            <div className="flex-1 relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Leaving from..." 
                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-xl focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white"
                value={searchParams.source}
                onChange={e => setSearchParams({...searchParams, source: e.target.value})}
              />
            </div>
            <div className="flex-1 relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Going to..." 
                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-xl focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white"
                value={searchParams.destination}
                onChange={e => setSearchParams({...searchParams, destination: e.target.value})}
              />
            </div>
            <div className="flex-1 relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="date" 
                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-xl focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white"
                value={searchParams.date}
                onChange={e => setSearchParams({...searchParams, date: e.target.value})}
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary py-3 px-8 flex items-center justify-center shrink-0">
              {loading ? 'Searching...' : <><Search className="w-5 h-5 mr-2" /> Search</>}
            </button>
          </form>
          
          <div className="mt-4 flex items-center">
            <input type="checkbox" id="searchRecurring" className="w-4 h-4 text-primary-600 bg-slate-100/50 border-slate-300/50 rounded focus:ring-primary-500" />
            <label htmlFor="searchRecurring" className="ml-2 text-sm font-medium text-white/90">
              Show only Recurring Rides (Daily Commutes)
            </label>
          </div>
        </div>
      </div>

      {/* Calculated Route Confirmation (Appears when both locations are searched) */}
      {searchParams.source.length > 2 && searchParams.destination.length > 2 && (
        <div className="card p-6 mt-2 border-2 border-primary-100 dark:border-primary-900/30">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Calculated Route</h3>
          
          <div className="h-32 bg-slate-200 dark:bg-slate-800 relative w-full flex items-center justify-center rounded-xl overflow-hidden shadow-inner">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            
            <div className="relative w-full max-w-2xl mx-auto h-24 flex items-center justify-between px-8 mt-2">
              <div className="relative flex flex-col items-center">
                <div className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase absolute -top-6 whitespace-nowrap bg-white/80 dark:bg-slate-900/80 px-2 py-0.5 rounded shadow-sm">{searchParams.source}</div>
                <div className="w-4 h-4 bg-primary-600 rounded-full z-10 ring-4 ring-primary-200"></div>
              </div>
              
              <div className="flex-1 h-1 bg-primary-300 dark:bg-primary-700/50 relative overflow-hidden mx-2 border-t-2 border-dashed border-primary-500">
              </div>
              
              <div className="relative flex flex-col items-center">
                <div className="text-xs font-bold text-red-600 dark:text-red-400 uppercase absolute -top-8 text-center whitespace-nowrap bg-white/80 dark:bg-slate-900/80 px-2 py-0.5 rounded shadow-sm">{searchParams.destination}</div>
                <MapPin className="text-red-500 w-6 h-6 z-10 -mt-2" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Available Rides</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {rides.map(ride => (
            <div key={ride.id} className="card hover:shadow-lg transition-shadow group">
              <div className="flex justify-between items-start mb-4 border-b border-slate-100 dark:border-slate-700/50 pb-4">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 rounded-full bg-[#171a20] text-white flex items-center justify-center font-bold text-xs mr-3">
                      {ride.driver?.firstName?.charAt(0)}
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Offered by</div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">{ride.driver?.firstName} {ride.driver?.lastName}</h3>
                    <div className="flex items-center text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      <ShieldCheck className="w-3 h-3 mr-1" />
                      Verified Colleague
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">₹{ride.farePerSeat}</div>
                  <div className="text-xs text-slate-500">per seat</div>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start">
                  <div className="flex flex-col items-center mr-4">
                    <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                    <div className="w-0.5 h-8 bg-slate-200 dark:bg-slate-700 my-1"></div>
                    <div className="w-3 h-3 rounded-full border-2 border-primary-500 bg-white dark:bg-slate-800"></div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-white">{ride.pickupLocation}</div>
                      <div className="text-xs text-slate-500 flex items-center mt-1">
                        <Clock className="w-3 h-3 mr-1" /> {new Date(ride.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-white">{ride.destination}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700/50">
                <div className="flex space-x-4 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex items-center bg-slate-100 dark:bg-slate-700/50 px-2 py-1 rounded-md">
                    <Car className="w-4 h-4 mr-1.5" />
                    {ride.vehicle?.model}
                  </div>
                  <div className="flex items-center bg-slate-100 dark:bg-slate-700/50 px-2 py-1 rounded-md">
                    <User className="w-4 h-4 mr-1.5" />
                    {ride.availableSeats} seats left
                  </div>
                </div>
                
                {bookingStatus.id === ride.id && bookingStatus.status === 'success' ? (
                  <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-semibold flex items-center">
                    Pending Approval... OTP for Travel: {bookingStatus.otp}
                  </div>
                ) : (
                  <button 
                    onClick={() => handleBook(ride.id)}
                    disabled={bookingStatus.id === ride.id}
                    className="btn-primary py-2 px-6 text-sm flex items-center"
                  >
                    {bookingStatus.id === ride.id ? 'Booking...' : 'Book Seat'}
                  </button>
                )}
              </div>
            </div>
          ))}
          
          {rides.length === 0 && !loading && (
             <div className="col-span-full py-12 text-center text-slate-500">
                <Car className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                <p>Search for a route to see available rides.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscoverRides;
