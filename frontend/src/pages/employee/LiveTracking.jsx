import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapPin, Navigation, Clock, User, Phone, MessageSquare, ArrowLeft, ShieldCheck } from 'lucide-react';

const LiveTracking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const trip = location.state?.trip;
  
  const [eta, setEta] = useState('15 mins');
  const [distance, setDistance] = useState('4.2 km');

  useEffect(() => {
    if (!trip) {
      navigate('/employee/trips');
    }
    // Simulate real-time ETA updates
    const interval = setInterval(() => {
      setEta(prev => {
        const mins = parseInt(prev) - 1;
        return mins > 0 ? `${mins} mins` : 'Arriving now';
      });
    }, 60000);
    return () => clearInterval(interval);
  }, [trip, navigate]);

  if (!trip) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back
      </button>

      <div className="card p-0 overflow-hidden">
        {/* Mock Map Area */}
        <div className="h-64 bg-slate-200 dark:bg-slate-800 relative w-full flex items-center justify-center">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          
          {/* Animated Route Line & Marker */}
          <div className="relative w-full max-w-md mx-auto h-32 flex items-center justify-between px-8 mt-4">
            <div className="relative flex flex-col items-center">
              <div className="text-xs font-bold text-slate-500 uppercase absolute -top-6">Pickup</div>
              <div className="w-4 h-4 bg-primary-600 rounded-full z-10 animate-pulse ring-4 ring-primary-200"></div>
            </div>
            
            <div className="flex-1 h-1 bg-slate-300 dark:bg-slate-600 relative overflow-hidden mx-2">
               <div className="absolute top-0 left-0 h-full bg-primary-500 w-1/2 animate-[progress_10s_ease-in-out_infinite]"></div>
            </div>
            
            <div className="relative flex flex-col items-center">
              <div className="text-xs font-bold text-red-500 uppercase absolute -top-8 text-center whitespace-nowrap">Destination</div>
              <MapPin className="text-red-500 w-6 h-6 z-10 -mt-2" />
            </div>
          </div>

          <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-3 rounded-xl shadow-lg flex items-center space-x-4">
            <div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">ETA</div>
              <div className="text-xl font-bold text-primary-600">{eta}</div>
            </div>
            <div className="w-px h-8 bg-slate-200 dark:bg-slate-700"></div>
            <div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Distance</div>
              <div className="text-xl font-bold text-slate-800 dark:text-white">{distance}</div>
            </div>
          </div>

          {/* Current Trip Status Badge */}
          <div className="absolute top-4 right-4 bg-emerald-500/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg flex items-center text-white">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse mr-2"></div>
            <span className="text-xs font-bold uppercase tracking-wider">Live: {trip.status || 'STARTED'}</span>
          </div>
        </div>

        {/* Trip Info Area */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Trip Progress</h2>
          
          <div className="flex flex-col sm:flex-row justify-between gap-6">
            <div className="flex-1 space-y-4">
              <div className="flex items-start">
                <div className="flex flex-col items-center mr-4 mt-1">
                  <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                  <div className="w-0.5 h-10 bg-slate-200 dark:bg-slate-700 my-1"></div>
                  <div className="w-3 h-3 rounded-full border-2 border-primary-500 bg-white dark:bg-slate-800"></div>
                </div>
                <div className="flex-1 space-y-5">
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">{trip.ride?.pickupLocation}</div>
                    <div className="text-xs text-slate-500 flex items-center mt-0.5">
                      <Clock className="w-3 h-3 mr-1" /> {new Date(trip.ride?.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">{trip.ride?.destination}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50">
               <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-3">Driver Info</div>
               <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-600 font-bold">
                       {trip.ride?.driver?.firstName?.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">{trip.ride?.driver?.firstName} {trip.ride?.driver?.lastName}</div>
                      <div className="text-xs flex items-center text-emerald-600 dark:text-emerald-400">
                         <ShieldCheck className="w-3 h-3 mr-1" /> Verified
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="w-10 h-10 rounded-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-600 hover:text-primary-600 hover:border-primary-500 transition-colors shadow-sm">
                      <Phone className="w-4 h-4" />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-600 hover:text-primary-600 hover:border-primary-500 transition-colors shadow-sm">
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTracking;
