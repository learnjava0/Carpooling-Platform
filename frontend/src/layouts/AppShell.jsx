import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  CarFront, LayoutDashboard, Search, PlusCircle, Map,
  History, Car, Wallet, MessageSquare, Settings, Shield,
  Bell, LogOut, ChevronRight
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Find Ride', path: '/find-ride', icon: Search },
  { name: 'Offer Ride', path: '/offer-ride', icon: PlusCircle },
  { name: 'My Trips', path: '/trips', icon: Map },
  { name: 'Ride History', path: '/ride-history', icon: History },
  { name: 'My Vehicle', path: '/vehicles', icon: Car },
  { name: 'Wallet', path: '/wallet', icon: Wallet },
  { name: 'Messages', path: '/chat', icon: MessageSquare },
  { name: 'Admin Hub', path: '/admin', icon: Shield },
  { name: 'Settings', path: '/settings', icon: Settings },
];

function AppShell({ children, title, showBack = false, rightActions }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="brand-mark"><CarFront size={20} /></div>
          <div>
            <strong className="brand-name">Carpooling</strong>
            <small className="brand-sub">Enterprise Fleet</small>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Main navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path ||
              (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-user">
          <div className="user-avatar">{user?.firstName?.[0] || 'U'}</div>
          <div className="user-info">
            <span className="user-name">{user?.firstName || 'Demo'} {user?.lastName || ''}</span>
            <span className="user-role">Employee</span>
          </div>
          <button
            className="logout-btn"
            onClick={logout}
            aria-label="Logout"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="main-area">
        {/* Top header */}
        <header className="top-header">
          <div className="header-left">
            {showBack && (
              <button className="btn btn-ghost btn-icon" onClick={() => navigate(-1)} aria-label="Back">
                <ChevronRight size={18} style={{ transform: 'rotate(180deg)' }} />
              </button>
            )}
            <h1 className="page-title">{title || 'Dashboard'}</h1>
          </div>
          <div className="header-right">
            {rightActions}
            <button className="btn btn-ghost btn-icon" aria-label="Notifications">
              <Bell size={18} />
            </button>
            <div className="user-avatar" style={{ cursor: 'default' }}>
              {user?.firstName?.[0] || 'U'}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AppShell;
