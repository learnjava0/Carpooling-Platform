import React, { useState, useEffect } from 'react';
import { tripService } from '../../services/tripService';
import api from '../../services/api';
import { BarChart3, Download, Car, Calendar, DollarSign, Leaf, MapPin, CheckCircle2 } from 'lucide-react';

const Analytics = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const data = await tripService.getMyTrips();
        setTrips(data || []);
      } catch (err) {
        setError('Failed to fetch personal analytics data.');
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  const handleDownloadPdf = async () => {
    setDownloading(true);
    try {
      const response = await api.get('/trips/me/pdf', { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'my-trips-report.pdf');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      alert('Failed to generate and download PDF report.');
    } finally {
      setDownloading(false);
    }
  };

  // Calculations
  const completedTrips = trips.filter(t => t.status === 'COMPLETED' || t.status === 'STARTED');
  const totalMoneySpent = trips
    .filter(t => t.status !== 'CANCELLED' && t.status !== 'REJECTED')
    .reduce((sum, t) => sum + (t.totalFare || 0), 0);
  const totalDistance = completedTrips.length * 15.0; // Estimate 15km per trip
  const co2Saved = totalDistance * 0.2; // 0.2kg CO2 saved per km carpooled

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Personal Ride Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Track your financial savings, green footprint, and trip history.
          </p>
        </div>
        <button
          onClick={handleDownloadPdf}
          disabled={downloading}
          className="btn-primary flex items-center space-x-2 py-2.5"
        >
          {downloading ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span>{downloading ? 'Generating Report...' : 'Download PDF Report'}</span>
        </button>
      </div>

      {error && <div className="text-red-500 bg-red-50 dark:bg-red-950/20 p-4 rounded-xl">{error}</div>}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6 bg-white dark:bg-slate-800 flex items-center">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 mr-4">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Rides booked</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{trips.length}</div>
          </div>
        </div>

        <div className="card p-6 bg-white dark:bg-slate-800 flex items-center">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-500 mr-4">
            <Leaf className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400">CO2 Emissions Saved</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{co2Saved.toFixed(1)} kg</div>
          </div>
        </div>

        <div className="card p-6 bg-white dark:bg-slate-800 flex items-center">
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-500 mr-4">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Estimated Money Spent</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">₹{totalMoneySpent.toFixed(2)}</div>
          </div>
        </div>

        <div className="card p-6 bg-white dark:bg-slate-800 flex items-center">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-500 mr-4">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Distance Travelled</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{totalDistance.toFixed(1)} km</div>
          </div>
        </div>
      </div>

      {/* Trip breakdown */}
      <div className="card p-6 bg-white dark:bg-slate-800">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Riding Trip List</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 text-sm font-semibold">
                <th className="pb-3">Trip ID</th>
                <th className="pb-3">Driver / Partner</th>
                <th className="pb-3 width-full">Route</th>
                <th className="pb-3">Seats</th>
                <th className="pb-3">Fare</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {trips.map(trip => (
                <tr key={trip.id} className="border-b border-slate-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300">
                  <td className="py-3 font-medium text-slate-900 dark:text-white">#{trip.id}</td>
                  <td className="py-3">{trip.ride?.driver?.firstName || 'Unknown'}</td>
                  <td className="py-3 max-w-xs truncate">
                    <span className="flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400 shrink-0" />
                      {trip.ride?.pickupLocation} ➔ {trip.ride?.destination}
                    </span>
                  </td>
                  <td className="py-3">{trip.bookedSeats}</td>
                  <td className="py-3 font-semibold text-slate-900 dark:text-white">₹{trip.totalFare}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      trip.status === 'COMPLETED' ? 'bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400' :
                      trip.status === 'STARTED' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400' :
                      trip.status === 'ACCEPTED' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400' :
                      trip.status === 'PENDING' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400' :
                      trip.status === 'REJECTED' ? 'bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400' :
                      trip.status === 'BOOKED' ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/20 dark:text-teal-400' : 'bg-slate-50 text-slate-600'
                    }`}>
                      {trip.status}
                    </span>
                  </td>
                </tr>
              ))}
              {trips.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 font-medium">
                    No rides taken yet. Book a ride to populate your metrics.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
