import React, { useState } from 'react';
import { adminService } from '../../services/adminService';
import { UserPlus, UploadCloud, CheckCircle2, AlertCircle } from 'lucide-react';

const OnboardDriver = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    drivingLicenseNumber: '',
    model: '',
    registrationNumber: '',
    capacity: 4,
    farePerKm: 10,
    insuranceDocumentUrl: 'doc_insurance.pdf', // Mocked upload
    pollutionCertificateUrl: 'doc_pollution.pdf' // Mocked upload
  });

  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await adminService.onboardDriver(formData);
      setStatus({ type: 'success', message: 'Driver successfully onboarded! They can now log in and set their password.' });
      setFormData({
        firstName: '', lastName: '', email: '', phoneNumber: '',
        drivingLicenseNumber: '', model: '', registrationNumber: '',
        capacity: 4, farePerKm: 10, insuranceDocumentUrl: 'doc_insurance.pdf', pollutionCertificateUrl: 'doc_pollution.pdf'
      });
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Failed to onboard driver.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Onboard New Driver</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Register a driver and link their vehicle documents in one step.</p>
      </div>

      {status.message && (
        <div className={`p-4 rounded-xl border flex items-start space-x-3 ${status.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
          {status.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <p className="font-medium text-sm">{status.message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card">
        {/* Personal Details Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">1. Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">First Name</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="input-field py-2.5 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Last Name</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="input-field py-2.5 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email (For Login)</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="input-field py-2.5 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Phone Number</label>
              <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required className="input-field py-2.5 text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Driving License Number</label>
              <input type="text" name="drivingLicenseNumber" value={formData.drivingLicenseNumber} onChange={handleChange} required className="input-field py-2.5 text-sm uppercase" />
            </div>
          </div>
        </div>

        {/* Vehicle Details Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">2. Vehicle Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Vehicle Model</label>
              <input type="text" name="model" value={formData.model} onChange={handleChange} required placeholder="e.g. Maruti Swift Dzire" className="input-field py-2.5 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Registration Number (Plate)</label>
              <input type="text" name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} required className="input-field py-2.5 text-sm uppercase" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Passenger Capacity</label>
              <input type="number" min="1" max="10" name="capacity" value={formData.capacity} onChange={handleChange} required className="input-field py-2.5 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Fare Per Km (₹)</label>
              <input type="number" min="1" step="0.5" name="farePerKm" value={formData.farePerKm} onChange={handleChange} required className="input-field py-2.5 text-sm" />
            </div>
          </div>
        </div>

        {/* Documents Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">3. Legal Documents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <UploadCloud className="w-8 h-8 text-primary-500 mb-2" />
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Upload Insurance</div>
              <div className="text-xs text-slate-500 mt-1">PDF or JPG (Max 5MB)</div>
            </div>
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <UploadCloud className="w-8 h-8 text-primary-500 mb-2" />
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Upload Pollution Cert.</div>
              <div className="text-xs text-slate-500 mt-1">PDF or JPG (Max 5MB)</div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
          <button type="submit" disabled={isLoading} className="btn-primary flex items-center">
            {isLoading ? 'Processing...' : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Register Driver & Vehicle
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OnboardDriver;
