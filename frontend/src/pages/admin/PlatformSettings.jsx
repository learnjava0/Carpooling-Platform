import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Settings, Fuel, Map, IndianRupee, Save } from 'lucide-react';

const PlatformSettings = () => {
  const [settings, setSettings] = useState({
    baseFare: 0,
    fuelCostPerKm: 0,
    travelCostDeduction: 0
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await adminService.getSettings();
      setSettings(data);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const data = await adminService.updateSettings(settings);
      setSettings(data);
      setMessage('Settings updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Failed to update settings:', error);
      setMessage('Failed to update settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <div className="w-8 h-8 border-4 border-[#171a20] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Platform Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Configure organization-specific carpooling settings and operational rules</p>
      </div>

      {message && (
        <div className={`p-4 rounded-md font-medium text-sm ${message.includes('successfully') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Settings Navigation Sidebar */}
        <div className="md:col-span-1 space-y-2">
          <button className="w-full flex items-center px-4 py-3 bg-[#171a20] text-white rounded-md font-medium text-sm transition-colors shadow-sm">
            <IndianRupee className="w-5 h-5 mr-3" /> Cost Configurations
          </button>
          <button className="w-full flex items-center px-4 py-3 bg-white text-slate-600 border border-slate-200 rounded-md font-medium text-sm hover:bg-slate-50 transition-colors">
            <Settings className="w-5 h-5 mr-3" /> General System
          </button>
        </div>

        {/* Main Settings Form */}
        <div className="md:col-span-2">
          <div className="card">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center border-b border-slate-100 pb-4">
              <Fuel className="w-5 h-5 mr-2 text-[#171a20]" /> Travel & Fuel Costs
            </h2>
            
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                    Base Fare (₹)
                    <span className="ml-2 text-xs font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">Flat Rate</span>
                  </label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                      type="number" 
                      step="0.01"
                      className="input-field pl-10"
                      value={settings.baseFare}
                      onChange={e => setSettings({...settings, baseFare: parseFloat(e.target.value)})}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">The minimum starting fare for any carpool trip.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                    Fuel Cost per Km (₹)
                  </label>
                  <div className="relative">
                    <Fuel className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                      type="number" 
                      step="0.01"
                      className="input-field pl-10"
                      value={settings.fuelCostPerKm}
                      onChange={e => setSettings({...settings, fuelCostPerKm: parseFloat(e.target.value)})}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Used to calculate recommended compensation for drivers based on distance.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                    Corporate Travel Cost Deduction (₹)
                    <span className="ml-2 text-xs font-normal text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">Enterprise</span>
                  </label>
                  <div className="relative">
                    <Map className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                      type="number" 
                      step="0.01"
                      className="input-field pl-10"
                      value={settings.travelCostDeduction}
                      onChange={e => setSettings({...settings, travelCostDeduction: parseFloat(e.target.value)})}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Company sponsored subsidy deducted from the total trip cost for the rider.</p>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end">
                <button 
                  type="submit" 
                  disabled={saving}
                  className="btn-primary flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Configuration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformSettings;
