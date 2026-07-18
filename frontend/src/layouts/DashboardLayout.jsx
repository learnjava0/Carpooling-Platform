import { Link, useLocation } from 'react-router-dom';
import { 
  Home, Search, PlusCircle, Car, Map, Wallet, MessageSquare, 
  Bell, Settings, LogOut, Shield
} from 'lucide-react';
import Logo from '../components/Logo';
import { useAuth } from '../hooks/useAuth';

function DashboardLayout({ children, title }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Find Ride', path: '/find-ride', icon: Search },
    { name: 'Offer Ride', path: '/offer-ride', icon: PlusCircle },
    { name: 'My Trips', path: '/trips', icon: Map },
    { name: 'Vehicles', path: '/vehicles', icon: Car },
    { name: 'Wallet', path: '/wallet', icon: Wallet },
    { name: 'Messages', path: '/chat', icon: MessageSquare },
    { name: 'Admin Hub', path: '/admin', icon: Shield },
  ];

  return (
    <div className="erp-layout">
      {/* Sidebar */}
      <aside className="erp-sidebar">
        <div className="erp-sidebar-header">
          <Logo />
        </div>
        <nav className="erp-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link 
                key={item.name} 
                to={item.path} 
                className={`erp-nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="erp-user-profile">
          <div className="avatar">
            {user?.firstName?.[0] || 'E'}
          </div>
          <div className="user-info">
            <span className="user-name">{user?.firstName || 'Employee'} {user?.lastName}</span>
            <span className="user-role">Demo Account</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="erp-main">
        <header className="erp-header">
          <h1 className="erp-header-title">{title || 'Dashboard'}</h1>
          <div className="erp-header-actions">
            <button className="secondary-button" style={{ width: '40px', height: '40px', padding: 0, borderRadius: '50%' }}>
              <Bell size={18} />
            </button>
            <button className="secondary-button" style={{ width: '40px', height: '40px', padding: 0, borderRadius: '50%' }}>
              <Settings size={18} />
            </button>
            <button className="secondary-button" onClick={logout} title="Logout" style={{ width: '40px', height: '40px', padding: 0, borderRadius: '50%', color: 'var(--danger)' }}>
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <div className="erp-content">
          {children}
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;
