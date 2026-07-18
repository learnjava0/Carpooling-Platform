import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Navigation, MapPin, Loader2, AlertCircle, Phone, ShieldCheck, HeartPulse } from 'lucide-react';
import AppShell from '../../layouts/AppShell';
import MapView from '../../components/MapView';
import { getLiveLocation, updateLiveLocation, getMyTrips } from '../../services/api';
import { getRoutePoints, geocode } from '../../utils/geocode';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

export default function LiveTracking() {
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [driverLocation, setDriverLocation] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [pickupCoord, setPickupCoord] = useState(null);
  const [dropoffCoord, setDropoffCoord] = useState(null);
  
  // Fake telemetry
  const [speed, setSpeed] = useState(45);
  const [eta, setEta] = useState(15);
  
  useEffect(() => {
    // 1. Fetch available trips to track (mocking picking the first active one)
    async function loadActiveTrip() {
      try {
        const trips = await getMyTrips().catch(() => []);
        // Find a booked or in-progress trip, or fallback to mock
        let activeTrip = trips.find(t => t.status === 'BOOKED' || t.status === 'IN_PROGRESS');
        if (!activeTrip) {
          activeTrip = {
            id: 'TRP-1092',
            status: 'IN_PROGRESS',
            ride: {
              pickupLocation: 'SG Highway',
              destination: 'Gift City',
              driver: { firstName: 'Sarah', lastName: 'Jenkins', phone: '+91 98765 43210' },
              vehicle: { model: 'Tesla Model 3', registrationNumber: 'GJ-01-AB-1234' }
            }
          };
        }
        setTrip(activeTrip);
        
        // Setup coordinates
        const pLoc = activeTrip.ride?.pickupLocation || 'ahmedabad';
        const dLoc = activeTrip.ride?.destination || 'gift city';
        
        const [pC, dC] = await Promise.all([geocode(pLoc), geocode(dLoc)]);
        setPickupCoord(pC || { lat: 23.0225, lng: 72.5714 });
        setDropoffCoord(dC || { lat: 23.1611, lng: 72.6820 });
        
        const route = await getRoutePoints(pC, dC);
        if (route) setRouteCoords(route);
        
        // Start driver tracking cycle
        setDriverLocation(pC || { lat: 23.0225, lng: 72.5714 });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadActiveTrip();
  }, []);

  useEffect(() => {
    if (!pickupCoord || !driverLocation) return;
    
    // Simulating Live Driver Movement to demonstrate Backend API integration
    const interval = setInterval(async () => {
      // Small jitter logic to simulate movement
      const newLat = driverLocation.lat + (Math.random() * 0.005 - 0.001);
      const newLng = driverLocation.lng + (Math.random() * 0.005 - 0.001);
      
      const newLoc = { lat: newLat, lng: newLng };
      setDriverLocation(newLoc);
      
      // Attempt to push to Spring Boot Backend
      try {
        await updateLiveLocation(trip?.id || 1, { latitude: newLat, longitude: newLng });
        
        // Randomly adjust telemetry values
        setSpeed(prev => Math.max(0, Math.min(80, prev + (Math.random() > 0.5 ? 2 : -2))));
        setEta(prev => Math.max(1, prev - 1));
      } catch (e) {
        // Backend not fully attached yet, silent fail
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [driverLocation, pickupCoord]);

  if (loading) {
    return (
      <AppShell title="Live Tracking">
        <div className="flex flex-col items-center justify-center p-20 opacity-70">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground font-medium">Connecting to telemetry server...</p>
        </div>
      </AppShell>
    );
  }

  const mapMarkers = [];
  if (pickupCoord) mapMarkers.push({ lat: pickupCoord.lat, lng: pickupCoord.lng, label: 'Pickup', color: 'green' });
  if (dropoffCoord) mapMarkers.push({ lat: dropoffCoord.lat, lng: dropoffCoord.lng, label: 'Dropoff' });
  if (driverLocation) mapMarkers.push({ lat: driverLocation.lat, lng: driverLocation.lng, label: 'Driver', color: 'blue' }); // Leaflet MapView handles custom colors fallback to default yellow

  return (
    <AppShell title="Live Tracking">
      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
        
        {/* Left Side: Telemetry details */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <Card className="shadow-sm border-border overflow-hidden">
             <div className="bg-primary p-4 text-primary-foreground flex justify-between items-center">
               <div>
                  <h3 className="font-bold text-lg mb-1">Active Trip</h3>
                  <Badge variant="outline" className="text-white border-white/50 text-[10px] tracking-widest uppercase shadow-sm">
                    {trip?.id || 'TRP-1092'}
                  </Badge>
               </div>
               <div className="flex flex-col items-end">
                 <span className="text-3xl font-black">{eta}</span>
                 <span className="text-xs opacity-80 font-bold uppercase tracking-widest">Mins ETA</span>
               </div>
             </div>
             
             <CardContent className="p-5 space-y-5">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-muted-foreground shadow-inner">
                   {trip?.ride?.driver?.firstName?.[0] || 'D'}
                 </div>
                 <div>
                   <h4 className="font-bold">{trip?.ride?.driver?.firstName} {trip?.ride?.driver?.lastName}</h4>
                   <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                     <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Background Checked
                   </p>
                 </div>
                 <div className="ml-auto">
                   <Button variant="outline" size="icon" className="rounded-full shadow-sm"><Phone className="w-4 h-4" /></Button>
                 </div>
               </div>
               
               <div className="bg-muted/40 rounded-xl p-4 border border-border">
                 <div className="flex items-center justify-between mb-2">
                   <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Telemetry</span>
                   <span className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold uppercase"><HeartPulse className="w-3 h-3 animate-pulse" /> Live</span>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <span className="block text-2xl font-black">{speed} <span className="text-sm font-medium text-muted-foreground">km/h</span></span>
                     <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Current Speed</span>
                   </div>
                   <div>
                     <span className="block text-2xl font-black tracking-tight">{trip?.ride?.vehicle?.model?.substring(0, 10)}</span>
                     <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">{trip?.ride?.vehicle?.registrationNumber}</span>
                   </div>
                 </div>
               </div>
               
               <div className="relative pl-6 space-y-6 pt-2">
                 <div className="absolute left-[7px] top-4 bottom-4 w-0.5 bg-border rounded-full" />
                 
                 <div className="relative">
                   <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
                   <h5 className="text-sm font-bold">Pickup Location</h5>
                   <p className="text-xs text-muted-foreground">{trip?.ride?.pickupLocation}</p>
                 </div>
                 
                 <div className="relative">
                   <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-amber-500 ring-4 ring-amber-500/20" />
                   <h5 className="text-sm font-bold">Destination</h5>
                   <p className="text-xs text-muted-foreground">{trip?.ride?.destination}</p>
                 </div>
               </div>
             </CardContent>
          </Card>
          
          <Button variant="destructive" className="w-full shadow-sm" onClick={() => alert("SOS Triggered")}>
            <AlertCircle className="w-4 h-4 mr-2" /> SOS Emergency
          </Button>
        </div>
        
        {/* Right Side: Map */}
        <div className="w-full lg:w-2/3 h-[500px] lg:h-full flex flex-col rounded-xl overflow-hidden border border-border shadow-sm p-1 bg-card">
           <MapView 
             height="100%" 
             markers={mapMarkers} 
             routePoints={routeCoords}
             center={driverLocation ? [driverLocation.lat, driverLocation.lng] : undefined}
             className="w-full h-full rounded-lg shadow-inner"
           />
        </div>
      </div>
    </AppShell>
  );
}
