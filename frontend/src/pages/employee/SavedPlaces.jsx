import React, { useState, useEffect } from 'react';
import { savedLocationService } from '../../services/savedLocationService';
import { MapPin, Plus, Trash2, Home, Briefcase, RefreshCw, Star } from 'lucide-react';

const SavedPlaces = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [formData, setFormData] = useState({ name: '', address: '' });

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const data = await savedLocationService.getSavedLocations();
      setLocations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.address) return;
    
    setAdding(true);
    try {
      await savedLocationService.addSavedLocation(formData);
      setFormData({ name: '', address: '' });
      fetchLocations();
    } catch (err) {
      alert('Failed to save location.');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Remove this saved place?')) {
      try {
        await savedLocationService.deleteSavedLocation(id);
        fetchLocations();
      } catch (err) {
        alert('Failed to delete location.');
      }
    }
  };

  const getIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes('home')) return <Home className="w-5 h-5" />;
    if (n.includes('office') || n.includes('work')) return <Briefcase className="w-5 h-5" />;
    return <Star className="w-5 h-5" />;
  };

  if (loading) return <div className="flex justify-center p-12"><RefreshCw className="w-8 h-8 text-primary-500 animate-spin" /></div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Saved Places</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your frequently used locations for quick ride searches.</p>
      </div>

      <form onSubmit={handleAdd} className="card p-6 flex flex-col sm:flex-row gap-4 items-end bg-slate-50 dark:bg-slate-800/50">
        <div className="w-full">
          <label className="text-xs font-semibold text-slate-500 mb-1 block">Label (e.g., Home)</label>
          <input 
            type="text" 
            value={formData.name} 
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="input-field py-2" 
            placeholder="Home" 
            required 
          />
        </div>
        <div className="w-full">
          <label className="text-xs font-semibold text-slate-500 mb-1 block">Address / Location</label>
          <div className="relative">
            <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={formData.address} 
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className="input-field py-2 pl-9" 
              placeholder="123 Main St" 
              required 
            />
          </div>
        </div>
        <button type="submit" disabled={adding} className="btn-primary py-2 px-6 h-[42px] whitespace-nowrap">
          {adding ? 'Saving...' : <><Plus className="w-4 h-4 mr-1" /> Add</>}
        </button>
      </form>

      <div className="space-y-4">
        {locations.map(loc => (
          <div key={loc.id} className="card p-4 flex items-center justify-between group hover:border-primary-200 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600">
                {getIcon(loc.name)}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">{loc.name}</h3>
                <p className="text-sm text-slate-500">{loc.address}</p>
              </div>
            </div>
            <button 
              onClick={() => handleDelete(loc.id)}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}

        {locations.length === 0 && (
          <div className="text-center py-12 card border-dashed border-2">
            <MapPin className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500">You haven't saved any places yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedPlaces;
