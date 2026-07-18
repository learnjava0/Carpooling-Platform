import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, History, Car, HelpCircle, MessageSquare, Compass } from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();

  const settingsOptions = [
    { icon: <Compass className="w-5 h-5" />, label: 'My Trips', action: () => navigate('/employee/trips') },
    { icon: <Car className="w-5 h-5" />, label: 'My Vehicle', action: () => navigate('/employee/vehicles') },
    { icon: <History className="w-5 h-5" />, label: 'Ride History', action: () => navigate('/employee/trips') },
    { icon: <CreditCard className="w-5 h-5" />, label: 'Payment Methods & Wallet', action: () => navigate('/employee/wallet') },
    { icon: <MapPin className="w-5 h-5" />, label: 'Saved Places', action: () => navigate('/employee/saved-places') },
    { icon: <MessageSquare className="w-5 h-5" />, label: 'Chat', action: () => alert('View your past communications.') },
    { icon: <HelpCircle className="w-5 h-5" />, label: 'Help & Support', action: () => alert('Contact your enterprise administrator for carpooling support.') },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your account preferences, saved places, and payment methods.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <ul className="divide-y divide-slate-100 dark:divide-slate-700/50">
          {settingsOptions.map((option, index) => (
            <li key={index}>
              <button 
                onClick={option.action}
                className="w-full flex items-center px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 mr-4">
                  {option.icon}
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-medium text-slate-900 dark:text-white">{option.label}</h3>
                </div>
                <div className="text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Settings;
