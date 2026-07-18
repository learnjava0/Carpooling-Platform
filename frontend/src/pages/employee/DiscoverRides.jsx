import React, { useState, useEffect } from 'react';
import { rideService } from '../../services/rideService';
import { tripService } from '../../services/tripService';
import { Search, MapPin, Calendar, Clock, User, IndianRupee, ArrowRight, ShieldCheck, Car } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet marker icons in React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Helper component to recenter map when route bounds change
function ChangeView({ center, zoom, bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds[0] && bounds[1]) {
      map.fitBounds(bounds, { padding: [40, 40] });
    } else if (center && center[0] !== 0) {
      map.setView(center, zoom);
    }
  }, [center, zoom, bounds, map]);
  return null;
}

const DiscoverRides = () => {
  const [searchParams, setSearchParams] = useState({
    source: '',
    destination: '',
    date: ''
  });
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingStatus, setBookingStatus] = useState({ id: null, status: '' });

  const [routeInfo, setRouteInfo] = useState({
    startCoords: null,
    endCoords: null,
    path: null,
    distance: null,
    duration: null,
    loading: false
  });

  useEffect(() => {
    const source = searchParams.source;
    const destination = searchParams.destination;

    if (!source || source.length < 3 || !destination || destination.length < 3) {
      setRouteInfo({ startCoords: null, endCoords: null, path: null, distance: null, duration: null, loading: false });
      return;
    }

    const timer = setTimeout(async () => {
      setRouteInfo(prev => ({ ...prev, loading: true }));
      try {
        const getCoords = async (query) => {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
          const data = await res.json();
          if (data && data.length > 0) return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
          return null;
        };

        const start = await getCoords(source + ", India");
        const end = await getCoords(destination + ", India");

        if (start && end) {
          const osrmRes = await fetch(`https://router.project-osrm.org/route/v1/driving/${start.lon},${start.lat};${end.lon},${end.lat}?geometries=geojson`);
          const osrmData = await osrmRes.json();
          
          if (osrmData.routes && osrmData.routes.length > 0) {
            const route = osrmData.routes[0];
            const coords = route.geometry.coordinates.map(c => [c[1], c[0]]);
            const distanceKm = (route.distance / 1000).toFixed(1);
            const durationMins = Math.round(route.duration / 60);

            setRouteInfo({
              startCoords: [start.lat, start.lon],
              endCoords: [end.lat, end.lon],
              path: coords,
              distance: `${distanceKm} km`,
              duration: `${durationMins} mins`,
              loading: false
            });
          } else {
             setRouteInfo(prev => ({ ...prev, loading: false }));
          }
        } else {
           setRouteInfo(prev => ({ ...prev, loading: false }));
        }
      } catch (err) {
        console.error("Error fetching route in DiscoverRides:", err);
        setRouteInfo(prev => ({ ...prev, loading: false }));
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [searchParams.source, searchParams.destination]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let searchDate = searchParams.date || new Date().toISOString();
      if (searchDate && !searchDate.includes('T')) {
        searchDate = `${searchDate}T00:00:00`;
      }
      const pickupLat = routeInfo.startCoords ? routeInfo.startCoords[0] : null;
      const pickupLng = routeInfo.startCoords ? routeInfo.startCoords[1] : null;
      const destinationLat = routeInfo.endCoords ? routeInfo.endCoords[0] : null;
      const destinationLng = routeInfo.endCoords ? routeInfo.endCoords[1] : null;

      const results = await rideService.searchRides(
        searchParams.source, 
        searchParams.destination, 
        searchDate, 
        1,
        pickupLat,
        pickupLng,
        destinationLat,
        destinationLng
      );
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

      {/* Calculated Route Map Confirmation */}
      {searchParams.source.length > 2 && searchParams.destination.length > 2 && (
        <div className="card p-6 mt-2 border-2 border-primary-100 dark:border-primary-900/30">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-primary-500" />
              Calculated Driving Route
            </h3>
            {routeInfo.distance && (
              <span className="text-sm font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-slate-800 px-3 py-1 rounded-full border border-primary-100 dark:border-slate-700">
                {routeInfo.distance} • {routeInfo.duration}
              </span>
            )}
          </div>
          
          <div className="h-64 bg-slate-100 dark:bg-slate-800 relative w-full rounded-xl overflow-hidden shadow-inner border border-slate-200 dark:border-slate-700">
            {routeInfo.loading && (
              <div className="absolute inset-0 bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-[1000]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-2"></div>
                  <p className="text-sm text-slate-500 font-medium">Calculating route details...</p>
                </div>
              </div>
            )}
            
            {routeInfo.path ? (
              <MapContainer 
                center={routeInfo.startCoords} 
                zoom={13} 
                style={{ height: '100%', width: '100%', zIndex: 1 }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={routeInfo.startCoords}>
                  <Popup>
                    <div className="text-xs font-semibold">Start: {searchParams.source}</div>
                  </Popup>
                </Marker>
                <Marker position={routeInfo.endCoords}>
                  <Popup>
                    <div className="text-xs font-semibold">Destination: {searchParams.destination}</div>
                  </Popup>
                </Marker>
                <Polyline 
                  positions={routeInfo.path} 
                  color="#3b82f6" 
                  weight={5} 
                  opacity={0.8} 
                />
                <ChangeView 
                  center={routeInfo.startCoords} 
                  zoom={13} 
                  bounds={[routeInfo.startCoords, routeInfo.endCoords]} 
                />
              </MapContainer>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-400">
                {!routeInfo.loading && (
                  <p className="text-sm text-center px-4">Enter valid locations in India to plot route path on map</p>
                )}
              </div>
            )}
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
