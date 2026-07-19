import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { MapPin, Navigation, ArrowLeft, Phone, MessageSquare, Clock } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

import carIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const carIcon = new L.Icon({
  iconUrl: carIconPng,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] !== 0) {
      map.setView(center, 15);
    }
  }, [center, map]);
  return null;
}

const LiveTracking = () => {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [driverLocation, setDriverLocation] = useState([23.0225, 72.5714]); 
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const [tripDetails, setTripDetails] = useState({
    driverName: "Loading...",
    vehicleInfo: "...",
    eta: "...",
  });

  useEffect(() => {
    // Connect to WebSocket using STOMP over SockJS
    const socket = new SockJS('http://localhost:8080/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      debug: function (str) {
        console.log(str);
      },
      onConnect: () => {
        setConnectionStatus("connected");
        client.subscribe(`/topic/location/${rideId}`, (message) => {
          if (message.body) {
            const data = JSON.parse(message.body);
            if (data.latitude && data.longitude) {
              setDriverLocation([data.latitude, data.longitude]);
            }
          }
        });
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
        setConnectionStatus("error");
      }
    });

    client.activate();

    // Cleanup on unmount
    return () => {
      client.deactivate();
    };
  }, [rideId]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/employee/my-trips')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
              Live Tracking
              <span className={`ml-3 text-xs font-semibold px-2.5 py-0.5 rounded-full ${connectionStatus === 'connected' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                {connectionStatus === 'connected' ? 'Live' : 'Connecting...'}
              </span>
            </h1>
            <p className="text-sm text-slate-500">Ride #{rideId}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Container */}
        <div className="lg:col-span-2 card p-2 h-[600px] flex flex-col relative z-0">
          <div className="absolute top-4 left-4 z-[1000] bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-2 text-primary-600 dark:text-primary-400 font-semibold">
              <Navigation className="w-5 h-5" />
              <span>Driver is on the way</span>
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Updating in real-time
            </div>
          </div>
          
          <div className="flex-1 rounded-xl overflow-hidden relative">
            <MapContainer 
              center={driverLocation} 
              zoom={15} 
              style={{ height: '100%', width: '100%' }}
            >
              <ChangeView center={driverLocation} />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={driverLocation} icon={carIcon}>
                <Popup>Driver's current location</Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>

        {/* Ride Info Sidebar */}
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Driver Details</h3>
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-xl border-4 border-white dark:border-slate-800 shadow-sm">
                D
              </div>
              <div>
                <div className="font-semibold text-lg text-slate-900 dark:text-white">{tripDetails.driverName}</div>
                <div className="text-sm text-slate-500">{tripDetails.vehicleInfo}</div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-white py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center">
                <Phone className="w-4 h-4 mr-2" /> Call
              </button>
              <button className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-white py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center">
                <MessageSquare className="w-4 h-4 mr-2" /> Chat
              </button>
            </div>
          </div>
          
          <div className="card p-6">
             <h3 className="font-bold text-slate-900 dark:text-white mb-4">Trip Progress</h3>
             <div className="relative pl-6 space-y-6 before:absolute before:inset-y-0 before:left-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
               
               <div className="relative z-10">
                 <div className="absolute -left-[1.35rem] w-4 h-4 rounded-full bg-primary-500 border-4 border-white dark:border-slate-800 shadow-sm"></div>
                 <div className="font-semibold text-slate-900 dark:text-white">Current Location</div>
                 <div className="text-sm text-slate-500 mt-0.5">Tracking live...</div>
               </div>
               
               <div className="relative z-10">
                 <div className="absolute -left-[1.35rem] w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-600 border-4 border-white dark:border-slate-800 shadow-sm"></div>
                 <div className="font-semibold text-slate-900 dark:text-white">Destination</div>
                 <div className="text-sm text-slate-500 mt-0.5">Arriving soon</div>
               </div>
               
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTracking;
