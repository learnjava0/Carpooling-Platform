import React, { useState, useEffect } from 'react';
import { vehicleService } from '../../services/vehicleService';
import { Car, Plus, AlertCircle, CheckCircle2 } from 'lucide-react';

const MyVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    model: '',
    registrationNumber: '',
    seatingCapacity: 4,
  });

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const data = await vehicleService.getUserVehicles();
      setVehicles(data || []);
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: 'Failed to load vehicles.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    
    try {
      await vehicleService.registerVehicle(formData);
      setStatus({ type: 'success', message: 'Vehicle registered successfully!' });
      setFormData({ model: '', registrationNumber: '', seatingCapacity: 4 });
      setShowAddForm(false);
      fetchVehicles();
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Failed to register vehicle.' });
    }
  };

  if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Vehicles</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage vehicles you use for offering rides.</p>
        </div>
        {!showAddForm && (
          <button 
            onClick={() => setShowAddForm(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl flex items-center font-medium transition-colors w-full sm:w-auto justify-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Vehicle
          </button>
        )}
      </div>

      {status.message && (
        <div className={`p-4 rounded-xl border flex items-start space-x-3 ${status.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
          {status.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <p className="font-medium text-sm">{status.message}</p>
        </div>
      )}

      {showAddForm && (
        <div className="card p-6 bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-2xl">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Register New Vehicle</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Vehicle Model</label>
                <input type="text" name="model" value={formData.model} onChange={handleChange} required className="input-field w-full" placeholder="e.g. Honda City" />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Registration Number</label>
                <input type="text" name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} required className="input-field w-full uppercase" placeholder="e.g. MH-01-AB-1234" />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Seating Capacity (Excluding Yourself)</label>
                <input type="number" name="seatingCapacity" min="1" max="8" value={formData.seatingCapacity} onChange={handleChange} required className="input-field w-full" />
              </div>
            </div>
            
            <div className="flex space-x-3 pt-4">
              <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-xl font-medium transition-colors">
                Save Vehicle
              </button>
              <button type="button" onClick={() => setShowAddForm(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 px-6 py-2 rounded-xl font-medium transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {vehicles.map(vehicle => (
          <div key={vehicle.id} className="card p-6 bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-2xl flex items-start space-x-4">
            <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center shrink-0">
              <Car className="text-primary-600 dark:text-primary-400 w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{vehicle.model}</h3>
              <p className="text-slate-500 font-mono mt-1 uppercase tracking-wider">{vehicle.registrationNumber}</p>
              <div className="mt-3 flex items-center text-sm text-slate-600 dark:text-slate-400 font-medium">
                <span className="bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-md">
                  Capacity: {vehicle.seatingCapacity} seats
                </span>
              </div>
            </div>
          </div>
        ))}

        {!loading && vehicles.length === 0 && !showAddForm && (
          <div className="col-span-full py-12 text-center text-slate-500 card border-dashed">
            <Car className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p>You haven't registered any vehicles yet.</p>
            <p className="text-sm mt-1">Register a vehicle to start offering rides.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyVehicles;
