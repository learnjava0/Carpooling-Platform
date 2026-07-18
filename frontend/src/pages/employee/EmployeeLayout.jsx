import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Search, MapPin, LogOut, Car, History, PlusCircle, CarFront, Settings, UserCircle } from 'lucide-react';

const EmployeeLayout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Discover Rides', path: '/employee', end: true, icon: Search },
    { name: 'My Trips', path: '/employee/trips', end: false, icon: History },
    { name: 'Active Rides', path: '/employee/active-rides', end: false, icon: CarFront },
    { name: 'Publish Ride', path: '/employee/publish', end: false, icon: PlusCircle },
    { name: 'My Vehicles', path: '/employee/vehicles', end: false, icon: Car },
    { name: 'Profile & Settings', path: '/employee/profile', end: false, icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      {/* Top Navigation */}
      <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 sm:px-8 shrink-0 z-20 shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
            <Car className="text-white w-4 h-4" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600">
            RideConnect
          </span>
        </div>
        
        <nav className="hidden md:flex space-x-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) => 
                `flex items-center px-4 py-2 rounded-lg transition-colors font-medium text-sm ${
                  isActive 
                    ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                }`
              }
            >
              <item.icon className="w-4 h-4 mr-2" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-3 text-sm">
            <span className="font-medium text-slate-700 dark:text-slate-200">Hi, {user?.firstName}</span>
            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-700 font-bold">
              {user?.firstName?.charAt(0)}
            </div>
          </div>
          <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default EmployeeLayout;
