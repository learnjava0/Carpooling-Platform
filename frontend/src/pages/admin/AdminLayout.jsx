import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Users, UserPlus, LogOut, Car } from 'lucide-react';

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', end: true, icon: LayoutDashboard },
    { name: 'Manage Users', path: '/admin/users', end: false, icon: Users },
    { name: 'Onboard Driver', path: '/admin/onboard', end: false, icon: UserPlus },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-700">
          <Car className="w-6 h-6 text-primary-500 mr-2" />
          <span className="text-xl font-bold text-slate-900 dark:text-white">Admin Panel</span>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) => 
                `flex items-center px-3 py-2.5 rounded-xl transition-colors font-medium text-sm ${
                  isActive 
                    ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-200'
                }`
              }
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </NavLink>
          ))}
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-700 dark:text-primary-400 font-bold mr-3">
              {user?.firstName?.charAt(0)}
            </div>
            <div>
              <div className="text-sm font-medium text-slate-900 dark:text-white">{user?.firstName}</div>
              <div className="text-xs text-slate-500 truncate w-32">{user?.email}</div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 md:hidden">
          <div className="flex items-center">
            <Car className="w-6 h-6 text-primary-500 mr-2" />
            <span className="text-lg font-bold text-slate-900 dark:text-white">Admin Panel</span>
          </div>
          <button onClick={handleLogout} className="p-2 text-slate-500">
            <LogOut className="w-5 h-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
