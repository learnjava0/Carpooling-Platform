import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { ShieldCheck, Activity, Users, Database } from 'lucide-react';

const AdminDashboard = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('logs');
  const [rides, setRides] = useState([]);
  const [editingRide, setEditingRide] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await api.get('/admin/audit/logs');
        setLogs(response.data);
      } catch (err) {
        console.error('Failed to fetch audit logs', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000); // Poll every 5s for live feed
    return () => clearInterval(interval);
  }, []);

  const fetchRides = async () => {
    try {
      const response = await api.get('/admin/rides');
      setRides(response.data);
    } catch (err) {
      console.error('Failed to fetch rides', err);
    }
  };

  useEffect(() => {
    if (activeTab === 'rides') {
      fetchRides();
    }
  }, [activeTab]);

  const handleEditRide = (ride) => {
    setEditingRide(ride.id);
    setEditFormData({
      pickupLocation: ride.pickupLocation,
      destination: ride.destination,
      departureTime: ride.departureTime,
      farePerSeat: ride.farePerSeat,
      routeWaypoints: ride.routeWaypoints || ''
    });
  };

  const handleSaveRide = async (id) => {
    try {
      await api.put(`/admin/rides/${id}`, editFormData);
      setEditingRide(null);
      fetchRides();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update ride. Cannot edit rides with confirmed bookings.');
    }
  };

  const handleDeleteRide = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ride?")) return;
    try {
      await api.delete(`/admin/rides/${id}`);
      fetchRides();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete ride. Cannot delete rides with confirmed bookings.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center">
            <ShieldCheck className="w-6 h-6 mr-2 text-primary-500" />
            Admin Security Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time system analytics powered by ClickHouse OLAP.</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-green-500 font-medium">
          <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
          <span>ClickHouse Cluster Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 border-t-4 border-t-blue-500">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><Users className="w-6 h-6"/></div>
            <div>
              <div className="text-2xl font-bold">14,203</div>
              <div className="text-sm text-slate-500">Active Users</div>
            </div>
          </div>
        </div>
        <div className="card p-6 border-t-4 border-t-green-500">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg"><Activity className="w-6 h-6"/></div>
            <div>
              <div className="text-2xl font-bold">892</div>
              <div className="text-sm text-slate-500">Events / min</div>
            </div>
          </div>
        </div>
        <div className="card p-6 border-t-4 border-t-purple-500">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg"><Database className="w-6 h-6"/></div>
            <div>
              <div className="text-2xl font-bold">2.4M</div>
              <div className="text-sm text-slate-500">Logs Processed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-700">
        <button 
          className={`py-2 px-4 font-semibold ${activeTab === 'logs' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-slate-500 hover:text-slate-700'}`}
          onClick={() => setActiveTab('logs')}
        >
          Security Logs
        </button>
        <button 
          className={`py-2 px-4 font-semibold ${activeTab === 'rides' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-slate-500 hover:text-slate-700'}`}
          onClick={() => setActiveTab('rides')}
        >
          Manage Rides
        </button>
      </div>

      {activeTab === 'logs' && (
      <div className="card p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-slate-500" />
          Live Audit Feed
        </h3>
        {loading ? (
          <div className="text-center p-8">Loading logs from ClickHouse...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-sm text-slate-500">
                  <th className="pb-3 font-medium">Time</th>
                  <th className="pb-3 font-medium">Event Type</th>
                  <th className="pb-3 font-medium">User Email</th>
                  <th className="pb-3 font-medium">Details</th>
                  <th className="pb-3 font-medium">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {logs.length > 0 ? logs.map((log, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                    <td className="py-3 text-sm text-slate-500">{new Date(log.eventTime).toLocaleString()}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        log.eventType === 'USER_LOGIN' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {log.eventType}
                      </span>
                    </td>
                    <td className="py-3 text-sm">{log.userEmail}</td>
                    <td className="py-3 text-sm text-slate-500">{log.details}</td>
                    <td className="py-3 text-sm text-slate-400 font-mono">{log.ipAddress}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-500">No events recorded recently.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      )}

      {activeTab === 'rides' && (
      <div className="card p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <Database className="w-5 h-5 mr-2 text-slate-500" />
          Manage All Rides
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500">
                <th className="pb-3 font-medium">ID</th>
                <th className="pb-3 font-medium">Driver</th>
                <th className="pb-3 font-medium">Pickup & Destination</th>
                <th className="pb-3 font-medium">Departure</th>
                <th className="pb-3 font-medium">Stops</th>
                <th className="pb-3 font-medium">Booked</th>
                <th className="pb-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {rides.map((ride) => {
                const isBooked = ride.availableSeats < (ride.vehicle?.seatingCapacity || ride.availableSeats);
                return (
                <tr key={ride.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <td className="py-3 font-medium">#{ride.id}</td>
                  <td className="py-3">{ride.driver?.firstName} {ride.driver?.lastName}</td>
                  <td className="py-3">
                    {editingRide === ride.id ? (
                      <div className="space-y-1">
                        <input type="text" value={editFormData.pickupLocation} onChange={e => setEditFormData({...editFormData, pickupLocation: e.target.value})} className="border p-1 text-xs w-full" placeholder="Pickup"/>
                        <input type="text" value={editFormData.destination} onChange={e => setEditFormData({...editFormData, destination: e.target.value})} className="border p-1 text-xs w-full" placeholder="Dest"/>
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <span className="text-slate-900 dark:text-slate-100 font-semibold">{ride.pickupLocation}</span>
                        <span className="text-slate-500">to {ride.destination}</span>
                      </div>
                    )}
                  </td>
                  <td className="py-3">
                    {editingRide === ride.id ? (
                      <input type="datetime-local" value={editFormData.departureTime.slice(0, 16)} onChange={e => setEditFormData({...editFormData, departureTime: e.target.value})} className="border p-1 text-xs w-full"/>
                    ) : (
                      new Date(ride.departureTime).toLocaleString([], {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'})
                    )}
                  </td>
                  <td className="py-3 text-xs text-slate-500">
                    {editingRide === ride.id ? (
                       <input type="text" value={editFormData.routeWaypoints} onChange={e => setEditFormData({...editFormData, routeWaypoints: e.target.value})} className="border p-1 text-xs w-full" placeholder="Waypoints"/>
                    ) : (
                       ride.routeWaypoints || '-'
                    )}
                  </td>
                  <td className="py-3">
                    {isBooked ? (
                      <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-bold">Yes</span>
                    ) : (
                      <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs">No</span>
                    )}
                  </td>
                  <td className="py-3 text-right space-x-2">
                    {editingRide === ride.id ? (
                      <>
                        <button onClick={() => handleSaveRide(ride.id)} className="text-green-600 hover:underline text-xs font-bold">Save</button>
                        <button onClick={() => setEditingRide(null)} className="text-slate-500 hover:underline text-xs">Cancel</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEditRide(ride)} disabled={isBooked} className={`text-blue-600 hover:underline text-xs font-bold ${isBooked ? 'opacity-50 cursor-not-allowed' : ''}`}>Edit</button>
                        <button onClick={() => handleDeleteRide(ride.id)} disabled={isBooked} className={`text-red-600 hover:underline text-xs font-bold ${isBooked ? 'opacity-50 cursor-not-allowed' : ''}`}>Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
          {rides.length === 0 && <div className="text-center py-8 text-slate-500">No rides found.</div>}
        </div>
      </div>
      )}
    </div>
  );
};

export default AdminDashboard;
