import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analyticsService';
import { TrendingUp, Users, Activity, Car, Leaf, DollarSign, Download, ShieldAlert } from 'lucide-react';

const DashboardOverview = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingAnalytics, setDownloadingAnalytics] = useState(false);
  const [downloadingAudit, setDownloadingAudit] = useState(false);

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

  const handleDownloadAnalytics = async () => {
    setDownloadingAnalytics(true);
    try {
      const dataBlob = await analyticsService.downloadDashboardPdf();
      const blob = new Blob([dataBlob], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'admin-platform-analytics.pdf');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      alert('Failed to download Platform Analytics PDF.');
    } finally {
      setDownloadingAnalytics(false);
    }
  };

  const handleDownloadAudit = async () => {
    setDownloadingAudit(true);
    try {
      const dataBlob = await analyticsService.downloadAuditPdf();
      const blob = new Blob([dataBlob], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'admin-system-audit-logs.pdf');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      alert('Failed to download Audit Logs PDF.');
    } finally {
      setDownloadingAudit(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div></div>;
  if (error) return <div className="text-red-500 bg-red-50 p-4 rounded-xl">{error}</div>;

  const kpis = [
    { 
      title: 'Total Trips', 
      value: data?.totalTrips || 0, 
      icon: Activity, 
      color: 'text-blue-500', 
      bg: 'bg-blue-50 dark:bg-blue-900/30' 
    },
    { 
      title: 'Total Distance', 
      value: `${(data?.totalDistanceTravelledKm || 0).toFixed(1)} km`, 
      icon: TrendingUp, 
      color: 'text-indigo-500', 
      bg: 'bg-indigo-50 dark:bg-indigo-900/30' 
    },
    { 
      title: 'Estimated Fuel Saved', 
      value: `${(data?.estimatedFuelConsumptionLiters || 0).toFixed(1)} L`, 
      icon: Leaf, 
      color: 'text-emerald-500', 
      bg: 'bg-emerald-50 dark:bg-emerald-900/30' 
    },
    { 
      title: 'Total Cost Saved', 
      value: `₹${(data?.totalCostSaved || 0).toFixed(2)}`, 
      icon: DollarSign, 
      color: 'text-purple-500', 
      bg: 'bg-purple-50 dark:bg-purple-900/30' 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Platform Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Overview of your company's carpooling impact.</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleDownloadAudit}
            disabled={downloadingAudit}
            className="flex items-center space-x-2 px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition"
          >
            {downloadingAudit ? (
              <span className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></span>
            ) : (
              <ShieldAlert className="w-4 h-4" />
            )}
            <span>Export Audit PDF</span>
          </button>
          
          <button
            onClick={handleDownloadAnalytics}
            disabled={downloadingAnalytics}
            className="btn-primary flex items-center space-x-2 py-2"
          >
            {downloadingAnalytics ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>Export Analytics PDF</span>
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="card flex items-center p-5 bg-white dark:bg-slate-800">
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
        <div className="lg:col-span-2 card bg-white dark:bg-slate-800 min-h-[400px] flex flex-col items-center justify-center text-slate-400 border-dashed">
          <Activity className="w-12 h-12 mb-3 text-slate-300 dark:text-slate-600" />
          <p>Usage Trends Chart (Coming Soon)</p>
        </div>
        <div className="card bg-white dark:bg-slate-800 min-h-[400px] flex flex-col items-center justify-center text-slate-400 border-dashed">
          <Leaf className="w-12 h-12 mb-3 text-slate-300 dark:text-slate-600" />
          <p>Environmental Impact (Coming Soon)</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
