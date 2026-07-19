import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { ShieldCheck, Activity, Users, Database, Car, Trash2, Edit } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('logs');
  
  // Rides State
  const [rides, setRides] = useState([]);
  const [editingRide, setEditingRide] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  
  // Logs State
  const [logSearch, setLogSearch] = useState('');
  const [logFilter, setLogFilter] = useState('ALL');
  
  // Users & Vehicles State
  const [users, setUsers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalTrips: 0 });

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
    
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/dashboard/stats');
        setStats(response.data);
      } catch (err) {
        console.error('Failed to fetch stats', err);
      }
    };

    fetchLogs();
    fetchStats();
    const interval = setInterval(() => {
      fetchLogs();
      fetchStats();
    }, 5000); // Poll every 5s for live feed
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

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  };

  const fetchVehicles = async () => {
    try {
      const response = await api.get('/admin/vehicles');
      setVehicles(response.data);
    } catch (err) {
      console.error('Failed to fetch vehicles', err);
    }
  };

  useEffect(() => {
    if (activeTab === 'rides') fetchRides();
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'vehicles') fetchVehicles();
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

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user? This cannot be undone.")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role?role=${newRole}`);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user role.');
    }
  };

  const handleDeleteVehicle = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?")) return;
    try {
      await api.delete(`/admin/vehicles/${id}`);
      fetchVehicles();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete vehicle.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center">
            <ShieldCheck className="w-6 h-6 mr-2 text-primary-500" />
            Hello {user?.firstName}, Admin Dashboard
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
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <div className="text-sm text-slate-500">Registered Users</div>
            </div>
          </div>
        </div>
        <div className="card p-6 border-t-4 border-t-green-500">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg"><Activity className="w-6 h-6"/></div>
            <div>
              <div className="text-2xl font-bold">{stats.totalTrips}</div>
              <div className="text-sm text-slate-500">Total Trips</div>
            </div>
          </div>
        </div>
        <div className="card p-6 border-t-4 border-t-purple-500">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg"><Database className="w-6 h-6"/></div>
            <div>
              <div className="text-2xl font-bold">{logs.length}</div>
              <div className="text-sm text-slate-500">Recent Logs Processing</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-700 overflow-x-auto whitespace-nowrap">
        <button 
          className={`py-3 px-6 font-semibold transition-colors ${activeTab === 'logs' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white'}`}
          onClick={() => setActiveTab('logs')}
        >
          Security Logs
        </button>
        <button 
          className={`py-3 px-6 font-semibold transition-colors ${activeTab === 'rides' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white'}`}
          onClick={() => setActiveTab('rides')}
        >
          Manage Rides
        </button>
        <button 
          className={`py-3 px-6 font-semibold transition-colors ${activeTab === 'users' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white'}`}
          onClick={() => setActiveTab('users')}
        >
          Manage Users
        </button>
        <button 
          className={`py-3 px-6 font-semibold transition-colors ${activeTab === 'vehicles' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white'}`}
          onClick={() => setActiveTab('vehicles')}
        >
          Manage Vehicles
        </button>
      </div>

      {activeTab === 'logs' && (
      <div className="card border-0 shadow-xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-800/80 backdrop-blur-xl overflow-hidden rounded-2xl">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-xl font-bold flex items-center text-slate-900 dark:text-white">
            <Activity className="w-6 h-6 mr-3 text-primary-500" />
            Live Audit Feed
          </h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="text" 
              placeholder="Search user or details..." 
              value={logSearch}
              onChange={(e) => setLogSearch(e.target.value)}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary-500 w-full sm:w-64 transition-all"
            />
            <select 
              value={logFilter}
              onChange={(e) => setLogFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary-500"
            >
              <option value="ALL">All Events</option>
              <option value="USER_LOGIN">Logins</option>
              <option value="USER_REGISTER">Registrations</option>
              <option value="RIDE_PUBLISHED">Rides Published</option>
              <option value="TRIP_BOOKED">Trips Booked</option>
              <option value="TRIP_STATUS_UPDATED">Status Updates</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 text-slate-500">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mb-4"></div>
             Loading logs from ClickHouse...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
                  <th className="px-6 py-4 rounded-tl-xl">Timestamp</th>
                  <th className="px-6 py-4">Event Type</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Details</th>
                  <th className="px-6 py-4 rounded-tr-xl">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {logs
                  .filter(log => logFilter === 'ALL' || log.eventType === logFilter)
                  .filter(log => log.userEmail?.toLowerCase().includes(logSearch.toLowerCase()) || log.details?.toLowerCase().includes(logSearch.toLowerCase()))
                  .length > 0 ? (
                  logs
                    .filter(log => logFilter === 'ALL' || log.eventType === logFilter)
                    .filter(log => log.userEmail?.toLowerCase().includes(logSearch.toLowerCase()) || log.details?.toLowerCase().includes(logSearch.toLowerCase()))
                    .map((log, i) => (
                      <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors group">
                        <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                          {new Date(log.eventTime).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 shadow-sm
                            ${log.eventType === 'USER_LOGIN' ? 'bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-900/30 dark:border-blue-800/50' : 
                              log.eventType === 'USER_REGISTER' ? 'bg-purple-50 text-purple-600 border border-purple-200 dark:bg-purple-900/30 dark:border-purple-800/50' : 
                              log.eventType.includes('RIDE') ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800/50' : 
                              'bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-900/30 dark:border-amber-800/50'
                            }`}>
                            {log.eventType === 'USER_LOGIN' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>}
                            {log.eventType === 'USER_REGISTER' && <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>}
                            {log.eventType.includes('RIDE') && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                            {log.eventType.includes('TRIP') && <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>}
                            {log.eventType.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-300 mr-2 uppercase">
                              {log.userEmail ? log.userEmail.charAt(0) : '?'}
                            </div>
                            <span className="text-sm font-medium text-slate-900 dark:text-slate-200">{log.userEmail || 'System'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 max-w-xs truncate group-hover:whitespace-normal group-hover:break-words transition-all duration-300">
                          {log.details}
                        </td>
                        <td className="px-6 py-4 text-xs font-mono text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-transparent">
                          {log.ipAddress}
                        </td>
                      </tr>
                  ))) : (
                  <tr>
                    <td colSpan="5" className="py-12 text-center">
                       <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 mb-3">
                          <Activity className="w-6 h-6 text-slate-400" />
                       </div>
                       <h3 className="text-sm font-semibold text-slate-900 dark:text-white">No logs found</h3>
                       <p className="text-xs text-slate-500 mt-1">Adjust your search or filter to see results.</p>
                    </td>
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
      {activeTab === 'users' && (
      <div className="card p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2 text-slate-500" />
          Manage Users
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500">
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Email</th>
                <th className="pb-3 font-medium">Phone</th>
                <th className="pb-3 font-medium">Role</th>
                <th className="pb-3 font-medium">Company</th>
                <th className="pb-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <td className="py-3 font-medium text-slate-900 dark:text-white">{u.firstName} {u.lastName}</td>
                  <td className="py-3">{u.email}</td>
                  <td className="py-3">{u.phoneNumber || '-'}</td>
                  <td className="py-3">
                    <select 
                      value={u.role} 
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="text-xs border border-slate-200 dark:border-slate-700 rounded p-1 bg-white dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300"
                    >
                      <option value="EMPLOYEE">Employee</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </td>
                  <td className="py-3">{u.companyName || '-'}</td>
                  <td className="py-3 text-right">
                    <button onClick={() => handleDeleteUser(u.id)} className="text-red-500 hover:text-red-700 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {activeTab === 'vehicles' && (
      <div className="card p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <Car className="w-5 h-5 mr-2 text-slate-500" />
          Manage Vehicles
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500">
                <th className="pb-3 font-medium">ID</th>
                <th className="pb-3 font-medium">Model</th>
                <th className="pb-3 font-medium">Registration</th>
                <th className="pb-3 font-medium">Capacity</th>
                <th className="pb-3 font-medium">Owner ID</th>
                <th className="pb-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {vehicles.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <td className="py-3 font-medium">#{v.id}</td>
                  <td className="py-3 text-slate-900 dark:text-white font-medium">{v.model}</td>
                  <td className="py-3 font-mono">{v.registrationNumber}</td>
                  <td className="py-3">{v.seatingCapacity} seats</td>
                  <td className="py-3">#{v.userId}</td>
                  <td className="py-3 text-right">
                    <button onClick={() => handleDeleteVehicle(v.id)} className="text-red-500 hover:text-red-700 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}

    </div>
  );
};

export default AdminDashboard;
