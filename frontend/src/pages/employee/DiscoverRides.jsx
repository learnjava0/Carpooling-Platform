import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
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

const fuzzyMatch = (pattern, str) => {
  if (!pattern) return true;
  pattern = pattern.toLowerCase();
  str = str.toLowerCase();
  
  let patternIdx = 0;
  let strIdx = 0;
  
  while (patternIdx < pattern.length && strIdx < str.length) {
    if (pattern[patternIdx] === str[strIdx]) {
      patternIdx++;
    }
    strIdx++;
  }
  return patternIdx === pattern.length;
};

const DiscoverRides = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useState({
    source: '',
    destination: '',
    date: ''
  });

  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [bookingStatus, setBookingStatus] = useState({ id: null, status: '' });
  const [availableLocations, setAvailableLocations] = useState({ pickupLocations: [], destinations: [] });
  const [savedPlaces] = useState([
    { id: 1, type: 'home', label: 'Home', address: '123 Main St, New Delhi' },
    { id: 2, type: 'work', label: 'Work', address: 'Cyber City, Gurgaon' }
  ]);
  
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);

  const [routeInfo, setRouteInfo] = useState({
    startCoords: null,
    endCoords: null,
    path: null,
    distance: null,
    duration: null,
    loading: false
  });

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await rideService.getAvailableLocations();
        setAvailableLocations(data);
      } catch (err) {
        console.error("Failed to fetch locations", err);
      }
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    const source = searchParams.source;
    const destination = searchParams.destination;
    setHasSearched(false);
    setRides([]); // Clear rides when changing search params

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
    setHasSearched(true);
    try {
      let searchDate = searchParams.date || new Date().toISOString();
      if (searchDate && !searchDate.includes('T')) {
        searchDate = `${searchDate}T00:00:00`;
      }
      const results = await rideService.searchRides(
        searchParams.source, 
        searchParams.destination, 
        searchDate
      );
      setRides(results);
    } catch (err) {
      console.error('Failed to search rides', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookRide = async (rideId) => {
    setBookingStatus({ id: rideId, status: 'booking' });
    try {
      await tripService.bookTrip({ rideId, bookedSeats: 1 });
      setBookingStatus({ id: rideId, status: 'success' });
      let searchDate = searchParams.date || new Date().toISOString();
      if (searchDate && !searchDate.includes('T')) {
        searchDate = `${searchDate}T00:00:00`;
      }
      const results = await rideService.searchRides(searchParams.source, searchParams.destination, searchDate);
      setRides(results);
      setTimeout(() => setBookingStatus({ id: null, status: '' }), 3000);
    } catch (err) {
      setBookingStatus({ id: rideId, status: 'error' });
      setTimeout(() => setBookingStatus({ id: null, status: '' }), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#171a20] dark:bg-white rounded-md p-8 sm:p-12 text-white dark:text-[#171a20] shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Hello {user?.firstName}! Find a Ride. Share the Journey.</h1>
          <p className="text-primary-100 text-lg mb-8">Commute with trusted colleagues and save up to 40% on daily travel.</p>
          
          <form onSubmit={handleSearch} className="bg-white dark:bg-slate-800 p-4 rounded-2xl flex flex-col md:flex-row gap-4 shadow-lg">
            <div className="flex-1 relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Leaving from..." 
                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-xl focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white"
                value={searchParams.source}
                onChange={e => { setSearchParams({...searchParams, source: e.target.value}); setShowSourceDropdown(true); }}
                onFocus={() => setShowSourceDropdown(true)}
                onBlur={() => setTimeout(() => setShowSourceDropdown(false), 200)}
              />
              {showSourceDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto">
                  {savedPlaces.map(place => (
                     <div key={place.id} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer flex items-center border-b border-slate-100 dark:border-slate-700/50" onClick={() => { setSearchParams({...searchParams, source: place.address}); setShowSourceDropdown(false); }}>
                        <MapPin className="w-4 h-4 mr-2 text-primary-500" />
                        <div>
                           <div className="text-sm font-semibold text-slate-900 dark:text-white">{place.label}</div>
                           <div className="text-xs text-slate-500">{place.address}</div>
                        </div>
                     </div>
                  ))}
                  {availableLocations.pickupLocations.filter(loc => fuzzyMatch(searchParams.source, loc)).map((loc, i) => (
                    <div key={`pickup-${i}`} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer flex items-center text-sm text-slate-700 dark:text-slate-300" onClick={() => { setSearchParams({...searchParams, source: loc}); setShowSourceDropdown(false); }}>
                      <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                      {loc}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex-1 relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Going to..." 
                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-xl focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white"
                value={searchParams.destination}
                onChange={e => { setSearchParams({...searchParams, destination: e.target.value}); setShowDestDropdown(true); }}
                onFocus={() => setShowDestDropdown(true)}
                onBlur={() => setTimeout(() => setShowDestDropdown(false), 200)}
              />
              {showDestDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto">
                  {savedPlaces.map(place => (
                     <div key={place.id} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer flex items-center border-b border-slate-100 dark:border-slate-700/50" onClick={() => { setSearchParams({...searchParams, destination: place.address}); setShowDestDropdown(false); }}>
                        <MapPin className="w-4 h-4 mr-2 text-primary-500" />
                        <div>
                           <div className="text-sm font-semibold text-slate-900 dark:text-white">{place.label}</div>
                           <div className="text-xs text-slate-500">{place.address}</div>
                        </div>
                     </div>
                  ))}
                  {availableLocations.destinations.filter(loc => fuzzyMatch(searchParams.destination, loc)).map((loc, i) => (
                    <div key={`dest-${i}`} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer flex items-center text-sm text-slate-700 dark:text-slate-300" onClick={() => { setSearchParams({...searchParams, destination: loc}); setShowDestDropdown(false); }}>
                      <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                      {loc}
                    </div>
                  ))}
                </div>
              )}
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
      {hasSearched && searchParams.source.length > 2 && searchParams.destination.length > 2 && (
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
          
          <div className="h-64 bg-slate-100 dark:bg-slate-800 relative w-full flex items-center justify-center rounded-xl overflow-hidden shadow-inner border border-slate-200 dark:border-slate-700 z-0">
            {routeInfo.loading && (
              <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[1000]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-2"></div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Calculating driving route...</p>
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
                  <p>Enter both locations to preview route map</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {hasSearched && rides.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
            <span className="bg-primary-500 text-white w-8 h-8 rounded-lg flex items-center justify-center mr-3">{rides.length}</span>
            Available Rides Found
          </h2>
          {rides.map(ride => (
            <div key={ride.id} className="card p-6 hover:shadow-lg transition-shadow border-2 border-transparent hover:border-primary-100 dark:hover:border-primary-900/50">
              <div className="flex flex-col md:flex-row gap-6">
                
                {/* Driver Info */}
                <div className="flex items-start md:w-1/4 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-700/50 pb-4 md:pb-0 md:pr-6">
                  <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-lg shrink-0">
                    {ride.driver?.firstName?.charAt(0) || 'D'}
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-slate-900 dark:text-white flex items-center">
                      {ride.driver?.firstName} {ride.driver?.lastName}
                      {ride.driver?.verified && <ShieldCheck className="w-4 h-4 text-green-500 ml-1" />}
                    </h3>
                    <div className="flex items-center text-sm text-slate-500 mt-1">
                      <Car className="w-3.5 h-3.5 mr-1" />
                      <span>{ride.vehicle?.model} • {ride.vehicle?.registrationNumber}</span>
                    </div>
                  </div>
                </div>

                {/* Ride Details */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center text-slate-900 dark:text-white font-medium mb-2">
                        <span className="w-2 h-2 rounded-full bg-primary-500 mr-3"></span>
                        {ride.pickupLocation}
                      </div>
                      <div className="flex items-center text-slate-900 dark:text-white font-medium">
                        <span className="w-2 h-2 rounded-full bg-red-500 mr-3"></span>
                        {ride.destination}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                        ₹{ride.farePerSeat}
                      </div>
                      <div className="text-sm text-slate-500">per seat</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700/50">
                    <div className="flex items-center space-x-6 text-sm text-slate-600 dark:text-slate-300">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-slate-400" />
                        {new Date(ride.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-slate-400" />
                        {ride.availableSeats} seats left
                      </div>
                    </div>
                    <button 
                      onClick={() => handleBookRide(ride.id)}
                      disabled={bookingStatus.id === ride.id}
                      className="btn-primary py-2 px-6 flex items-center"
                    >
                      {bookingStatus.id === ride.id ? (
                         bookingStatus.status === 'booking' ? 'Booking...' : 
                         bookingStatus.status === 'success' ? 'Confirmed!' : 'Failed'
                      ) : (
                        <>Book Seat <ArrowRight className="w-4 h-4 ml-2" /></>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        hasSearched && !loading && (
          <div className="text-center py-16 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
            <Car className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No rides found</h3>
            <p className="text-slate-500 max-w-md mx-auto">We couldn't find any exact matches for your route. Try adjusting your locations or search for a different date.</p>
          </div>
        )
      )}
    </div>
  );
};

export default DiscoverRides;
