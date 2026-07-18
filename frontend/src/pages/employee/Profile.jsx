import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, MapPin, Phone, Mail, Building, ShieldCheck, CheckCircle2 } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState({ type: '', message: '' });
  
  // Basic mock profile save
  const handleSave = (e) => {
    e.preventDefault();
    setStatus({ type: 'success', message: 'Profile updated successfully!' });
    setTimeout(() => setStatus({ type: '', message: '' }), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Profile & Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your account information and preferences.</p>
      </div>

      {status.message && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-start space-x-3">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <p className="font-medium text-sm">{status.message}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6 bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-2xl">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-primary-500" />
              Personal Information
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">First Name</label>
                  <input type="text" defaultValue={user?.firstName || ''} className="input-field w-full" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Last Name</label>
                  <input type="text" defaultValue={user?.lastName || ''} className="input-field w-full" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email (Corporate)</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="email" disabled value={user?.email || ''} className="input-field w-full pl-9 bg-slate-50 text-slate-500" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="tel" defaultValue={user?.phoneNumber || ''} className="input-field w-full pl-9" />
                  </div>
                </div>
              </div>
              <div className="pt-2">
                <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-xl font-medium transition-colors">
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          <div className="card p-6 bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-2xl">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-primary-500" />
              Saved Places
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center mr-3">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Home</p>
                    <p className="text-xs text-slate-500">Not set yet</p>
                  </div>
                </div>
                <button className="text-primary-600 text-sm font-medium hover:underline">Add</button>
              </div>
              <div className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg flex items-center justify-center mr-3">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Office</p>
                    <p className="text-xs text-slate-500">{user?.companyName || 'Not set yet'}</p>
                  </div>
                </div>
                <button className="text-primary-600 text-sm font-medium hover:underline">Edit</button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6 bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800/30 rounded-2xl">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-primary-100 dark:bg-primary-800/50 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 text-2xl font-bold mb-3">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">{user?.firstName} {user?.lastName}</h3>
              <p className="text-sm text-slate-500">{user?.role}</p>
              
              <div className="mt-4 px-4 py-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center w-full justify-center">
                <ShieldCheck className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Verified Account</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
