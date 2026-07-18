import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Car, Search, Hash, Users, Edit } from 'lucide-react';

const ManageVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const data = await adminService.getVehicles();
      setVehicles(data);
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVehicles = vehicles.filter(v => 
    v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Manage Vehicles</h1>
        <p className="text-slate-500 text-sm mt-1">Monitor all registered vehicles and driver information</p>
      </div>

      <div className="card">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by make, model, or license plate..." 
              className="input-field pl-10"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <div className="w-8 h-8 border-4 border-[#171a20] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map(vehicle => (
              <div key={vehicle.id} className="border border-slate-200 rounded-md p-5 hover:border-[#171a20] transition-colors relative group bg-white shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-md flex items-center justify-center">
                    <Car className="w-6 h-6 text-[#171a20]" />
                  </div>
                  <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2 py-1 rounded-md flex items-center">
                    <Hash className="w-3 h-3 mr-1" />
                    {vehicle.registrationNumber}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 mb-1">{vehicle.model}</h3>
                <div className="flex space-x-4 mb-4 text-sm text-slate-500">
                  <span className="flex items-center"><Users className="w-4 h-4 mr-1"/> {vehicle.seatingCapacity} Seats</span>
                </div>
                
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    Owned by ID: <span className="font-semibold text-slate-900">#{vehicle.userId}</span>
                  </div>
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">View Details</button>
                </div>
              </div>
            ))}
            
            {filteredVehicles.length === 0 && (
              <div className="col-span-full py-12 text-center">
                <Car className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-slate-900">No vehicles found</h3>
                <p className="text-slate-500">No registered vehicles match your search.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageVehicles;
