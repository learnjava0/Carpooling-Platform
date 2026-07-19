import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { X, MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

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

const TripMapModal = ({ isOpen, onClose, trip }) => {
  const [routeInfo, setRouteInfo] = useState({
    startCoords: null,
    endCoords: null,
    path: null,
    loading: false
  });

  useEffect(() => {
    if (isOpen && trip) {
      const fetchRoute = async () => {
        setRouteInfo(prev => ({ ...prev, loading: true }));
        try {
          const getCoords = async (query) => {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
            const data = await res.json();
            if (data && data.length > 0) return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
            return null;
          };

          const sourceStr = trip.ride?.pickupLocation || trip.pickupLocation;
          const destStr = trip.ride?.destination || trip.destination;

          const start = await getCoords(sourceStr + ", India");
          const end = await getCoords(destStr + ", India");

          if (start && end) {
            const osrmRes = await fetch(`https://router.project-osrm.org/route/v1/driving/${start.lon},${start.lat};${end.lon},${end.lat}?geometries=geojson`);
            const osrmData = await osrmRes.json();
            
            if (osrmData.routes && osrmData.routes.length > 0) {
              const route = osrmData.routes[0];
              const coords = route.geometry.coordinates.map(c => [c[1], c[0]]);
              
              setRouteInfo({
                startCoords: [start.lat, start.lon],
                endCoords: [end.lat, end.lon],
                path: coords,
                loading: false
              });
            } else {
              setRouteInfo(prev => ({ ...prev, loading: false }));
            }
          } else {
            setRouteInfo(prev => ({ ...prev, loading: false }));
          }
        } catch (err) {
          console.error("Error fetching route:", err);
          setRouteInfo(prev => ({ ...prev, loading: false }));
        }
      };
      
      fetchRoute();
    }
  }, [isOpen, trip]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-slate-100 dark:border-slate-700/50 flex justify-between items-center bg-white dark:bg-slate-800 z-10 relative">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-primary-500" /> Trip Route Map
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500 dark:text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="relative flex-1 bg-slate-100 dark:bg-slate-900 min-h-[400px]">
          {routeInfo.loading && (
            <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[1000]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-2"></div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Loading map route...</p>
              </div>
            </div>
          )}
          
          {routeInfo.path ? (
            <MapContainer 
              center={routeInfo.startCoords} 
              zoom={13} 
              style={{ height: '400px', width: '100%' }}
              zoomControl={true}
            >
              <ChangeView bounds={[routeInfo.startCoords, routeInfo.endCoords]} />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={routeInfo.startCoords}>
                <Popup className="dark:text-slate-900 font-medium">Pickup Location</Popup>
              </Marker>
              <Marker position={routeInfo.endCoords}>
                <Popup className="dark:text-slate-900 font-medium">Destination</Popup>
              </Marker>
              <Polyline 
                positions={routeInfo.path} 
                color="#0ea5e9" 
                weight={6} 
                opacity={0.8}
                lineCap="round"
                lineJoin="round"
              />
            </MapContainer>
          ) : !routeInfo.loading && (
            <div className="absolute inset-0 flex items-center justify-center text-slate-500">
              <p>Map route not available for these locations.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripMapModal;
