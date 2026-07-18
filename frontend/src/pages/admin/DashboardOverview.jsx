import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analyticsService';
import { TrendingUp, Users, Activity, Car, Leaf, DollarSign } from 'lucide-react';

const DashboardOverview = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const result = await analyticsService.getDashboard();
        setData(result);
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div></div>;
  if (error) return <div className="text-red-500 bg-red-50 p-4 rounded-xl">{error}</div>;

  const kpis = [
    { 
      title: 'Total Trips', 
      value: data?.totalTrips || 0, 
      icon: Activity, 
      color: 'text-blue-500', 
      bg: 'bg-blue-100 dark:bg-blue-900/30' 
    },
    { 
      title: 'Total Distance', 
      value: `${data?.totalDistance || 0} km`, 
      icon: TrendingUp, 
      color: 'text-indigo-500', 
      bg: 'bg-indigo-100 dark:bg-indigo-900/30' 
    },
    { 
      title: 'Fuel Saved', 
      value: `${data?.fuelConsumption || 0} L`, 
      icon: Leaf, 
      color: 'text-emerald-500', 
      bg: 'bg-emerald-100 dark:bg-emerald-900/30' 
    },
    { 
      title: 'Total Cost Saved', 
      value: `₹${(data?.totalDistance || 0) * (data?.costPerKm || 10)}`, 
      icon: DollarSign, 
      color: 'text-purple-500', 
      bg: 'bg-purple-100 dark:bg-purple-900/30' 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Platform Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Overview of your company's carpooling impact.</p>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="card flex items-center p-5">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${kpi.bg} mr-4`}>
              <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-500 dark:text-slate-400">{kpi.title}</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{kpi.value}</div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Chart Placeholder (In a real app, integrate Recharts here) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card min-h-[400px] flex flex-col items-center justify-center text-slate-400 border-dashed">
          <Activity className="w-12 h-12 mb-3 text-slate-300 dark:text-slate-600" />
          <p>Usage Trends Chart (Coming Soon)</p>
        </div>
        <div className="card min-h-[400px] flex flex-col items-center justify-center text-slate-400 border-dashed">
          <Leaf className="w-12 h-12 mb-3 text-slate-300 dark:text-slate-600" />
          <p>Environmental Impact (Coming Soon)</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
