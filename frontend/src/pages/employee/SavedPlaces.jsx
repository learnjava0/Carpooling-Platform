import React, { useState } from 'react';
import { MapPin, Home, Briefcase, Plus, Trash2 } from 'lucide-react';

const SavedPlaces = () => {
  const [places, setPlaces] = useState([
    { id: 1, type: 'home', label: 'Home', address: '123 Main St, New Delhi' },
    { id: 2, type: 'work', label: 'Work', address: 'Cyber City, Gurgaon' }
  ]);
  const [newPlace, setNewPlace] = useState('');

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Saved Places</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your frequently visited locations for quick booking.</p>
      </div>

      <div className="card p-6">
        <div className="space-y-4">
          {places.map(place => (
            <div key={place.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${place.type === 'home' ? 'bg-indigo-100 text-indigo-600' : 'bg-amber-100 text-amber-600'}`}>
                  {place.type === 'home' ? <Home className="w-5 h-5" /> : <Briefcase className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">{place.label}</h4>
                  <p className="text-sm text-slate-500">{place.address}</p>
                </div>
              </div>
              <button 
                onClick={() => setPlaces(places.filter(p => p.id !== place.id))}
                className="text-slate-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700/50">
          <div className="flex space-x-3">
            <input 
              type="text" 
              value={newPlace}
              onChange={(e) => setNewPlace(e.target.value)}
              placeholder="Search for a new place to save..." 
              className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-500"
            />
            <button 
              onClick={() => {
                if(newPlace) {
                  setPlaces([...places, { id: Date.now(), type: 'other', label: 'Custom Place', address: newPlace }]);
                  setNewPlace('');
                }
              }}
              className="bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-lg flex items-center transition"
            >
              <Plus className="w-5 h-5 mr-1" /> Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedPlaces;
