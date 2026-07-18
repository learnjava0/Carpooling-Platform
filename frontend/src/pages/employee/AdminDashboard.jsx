import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { ShieldCheck, Activity, Users, Database } from 'lucide-react';

const AdminDashboard = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

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
                  <th className="pb-3 font-medium">Event Type</th>
                  <th className="pb-3 font-medium">User Email</th>
                  <th className="pb-3 font-medium">Details</th>
                  <th className="pb-3 font-medium">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {logs.length > 0 ? logs.map((log, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
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
                    <td colSpan="4" className="py-8 text-center text-slate-500">No events recorded recently.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
