import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Car, Search, Hash, Users, Edit, Trash2, Eye } from 'lucide-react';

const ManageVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewVehicle, setViewVehicle] = useState(null);

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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?")) return;
    try {
      await adminService.deleteVehicle(id);
      fetchVehicles();
    } catch (error) {
      alert("Failed to delete vehicle.");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      await adminService.updateVehicle(editForm.id, editForm);
      setShowEditModal(false);
      fetchVehicles();
    } catch (error) {
      console.error('Failed to update vehicle:', error);
      alert('Failed to update vehicle');
    } finally {
      setEditLoading(false);
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
                  <div className="flex space-x-2">
                    <button onClick={() => { setViewVehicle(vehicle); setShowViewModal(true); }} className="text-sm font-medium text-blue-500 hover:text-blue-700 transition-colors p-1 rounded hover:bg-blue-50">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => { setEditForm(vehicle); setShowEditModal(true); }} className="text-sm font-medium text-orange-500 hover:text-orange-700 transition-colors p-1 rounded hover:bg-orange-50">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(vehicle.id)} className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors p-1 rounded hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
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

      {/* Edit Modal */}
      {showEditModal && editForm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-md max-w-md w-full p-6 shadow-xl relative animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Edit Vehicle</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Model</label>
                <input type="text" required className="input-field py-2" value={editForm.model} onChange={e => setEditForm({...editForm, model: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Registration Number</label>
                <input type="text" required className="input-field py-2" value={editForm.registrationNumber} onChange={e => setEditForm({...editForm, registrationNumber: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Seating Capacity</label>
                <input type="number" min="1" max="10" required className="input-field py-2" value={editForm.seatingCapacity} onChange={e => setEditForm({...editForm, seatingCapacity: e.target.value})} />
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 btn-secondary py-2">Cancel</button>
                <button type="submit" disabled={editLoading} className="flex-1 btn-primary py-2 flex justify-center items-center">
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && viewVehicle && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-md max-w-md w-full p-6 shadow-xl relative animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Vehicle Details</h2>
            <div className="space-y-3 text-sm">
              <p><span className="font-semibold w-24 inline-block text-slate-500">ID:</span> #{viewVehicle.id}</p>
              <p><span className="font-semibold w-24 inline-block text-slate-500">Model:</span> {viewVehicle.model}</p>
              <p><span className="font-semibold w-24 inline-block text-slate-500">Registration:</span> {viewVehicle.registrationNumber}</p>
              <p><span className="font-semibold w-24 inline-block text-slate-500">Capacity:</span> {viewVehicle.seatingCapacity} seats</p>
              <p><span className="font-semibold w-24 inline-block text-slate-500">Owner ID:</span> #{viewVehicle.userId}</p>
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={() => setShowViewModal(false)} className="btn-secondary py-2 px-4">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageVehicles;
