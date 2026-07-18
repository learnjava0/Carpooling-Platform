import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MapPin, Navigation, ArrowLeft } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

// Fix Leaflet marker icons in React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { Clock } from 'lucide-react';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Helper component to recenter map when position changes
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] !== 0) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
}

const LiveTracking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const trip = location.state?.trip;
  
  const [position, setPosition] = useState(null);
  const [stompClient, setStompClient] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const [eta, setEta] = useState('15 mins');
  const [simulationActive, setSimulationActive] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const watchIdRef = useRef(null);

  const isDriver = trip?.ride?.driver?.id === user?.id;

  useEffect(() => {
    if (!trip) {
      navigate('/employee');
      return;
    }

    const rideId = trip.ride?.id;
    if (!rideId) return;

    // Connect to STOMP WebSocket
    const socket = new SockJS('http://localhost:8080/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        setConnectionStatus('Connected');
        
        if (!isDriver) {
          // Passenger: Subscribe to driver's location
          client.subscribe(`/topic/location/${rideId}`, (message) => {
            const data = JSON.parse(message.body);
            setPosition([data.lat, data.lng]);
          });
        }
      },
      onDisconnect: () => {
        setConnectionStatus('Disconnected');
      }
    });

    client.activate();
    setStompClient(client);

    return () => {
      client.deactivate();
    };
  }, [trip, isDriver, navigate]);

  useEffect(() => {
    if (isDriver && stompClient && stompClient.connected) {
      // Driver: Watch geolocation and publish to STOMP
      if ("geolocation" in navigator) {
        watchIdRef.current = navigator.geolocation.watchPosition(
          (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            setPosition([lat, lng]);
            
            stompClient.publish({
              destination: `/app/location/${trip.ride.id}`,
              body: JSON.stringify({ lat, lng })
            });
          },
          (err) => {
            console.error("Geolocation error:", err);
            alert("Please allow location access to share your live location.");
          },
          { enableHighAccuracy: true, maximumAge: 0 }
        );
      } else {
        alert("Geolocation is not supported by your browser");
      }
    }

    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [isDriver, stompClient, trip]);

  useEffect(() => {
    if (simulationActive && isDriver && stompClient && stompClient.connected) {
      // Simulate moving north-east from Delhi
      let currentLat = 28.7041;
      let currentLng = 77.1025;
      setPosition([currentLat, currentLng]);
      
      const interval = setInterval(() => {
        currentLat += 0.001;
        currentLng += 0.001;
        setPosition([currentLat, currentLng]);
        stompClient.publish({
          destination: `/app/location/${trip.ride.id}`,
          body: JSON.stringify({ lat: currentLat, lng: currentLng })
        });
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [simulationActive, isDriver, stompClient, trip]);

  // Demo Mode for Passenger (if they don't want to open two windows)
  useEffect(() => {
    if (demoMode && !isDriver) {
      let currentLat = 28.7041;
      let currentLng = 77.1025;
      setPosition([currentLat, currentLng]);
      setConnectionStatus('Demo Mode Active');
      
      const interval = setInterval(() => {
        currentLat += 0.001;
        currentLng += 0.001;
        setPosition([currentLat, currentLng]);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [demoMode, isDriver]);

  // Simulate ETA decreasing over time
  useEffect(() => {
    const interval = setInterval(() => {
      setEta(prev => {
        const mins = parseInt(prev) - 1;
        return mins > 0 ? `${mins} mins` : 'Arriving now';
      });
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!trip) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-4 h-[calc(100vh-100px)] flex flex-col">
      <div className="flex justify-between items-center shrink-0">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </button>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
          connectionStatus === 'Connected' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
        }`}>
          {connectionStatus}
        </div>
      </div>

      <div className="card p-4 shrink-0 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
            <Navigation className="w-5 h-5 mr-2 text-primary-500" />
            {isDriver ? 'Broadcasting Location' : 'Tracking Ride'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {isDriver 
              ? "Your live location is being securely shared with your passenger." 
              : `Tracking ${trip.ride?.driver?.firstName}'s vehicle in real-time.`}
          </p>
        </div>
        {isDriver && (
          <button 
            onClick={() => setSimulationActive(!simulationActive)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              simulationActive ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {simulationActive ? 'Stop Simulation' : 'Simulate GPS'}
          </button>
        )}
        {!isDriver && (
          <button 
            onClick={() => setDemoMode(!demoMode)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              demoMode ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {demoMode ? 'Stop Demo' : 'Force Demo Mode'}
          </button>
        )}
      </div>

      <div className="card p-0 overflow-hidden flex-1 relative rounded-xl border border-slate-200 dark:border-slate-700">
        {!position && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800 z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
              <p className="text-slate-500 dark:text-slate-400">
                {isDriver ? 'Acquiring GPS Signal...' : 'Waiting for Driver Location...'}
              </p>
            </div>
          </div>
        )}
        
        {/* Leaflet Map */}
        <MapContainer 
          center={position || [28.7041, 77.1025]} // Default to Delhi if no position
          zoom={15} 
          style={{ height: '100%', width: '100%', zIndex: 1 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {position && (
            <>
              <Marker position={position}>
                <Popup>
                  {isDriver ? "You are here" : "Driver is here"}
                </Popup>
              </Marker>
              <ChangeView center={position} zoom={15} />
            </>
          )}
        </MapContainer>

        {/* ETA Overlay Card */}
        {position && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 z-[1000]">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Estimated Time</div>
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  {eta}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Destination</div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white truncate max-w-[120px]">
                  {trip.ride?.destination}
                </div>
              </div>
            </div>
            
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mt-3 overflow-hidden">
              <div className="bg-primary-500 h-1.5 rounded-full w-2/3 animate-pulse"></div>
            </div>
            
            <div className="mt-3 text-xs text-center text-slate-500">
              {isDriver ? 'Navigating to destination...' : 'Driver is en route to you.'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveTracking;
