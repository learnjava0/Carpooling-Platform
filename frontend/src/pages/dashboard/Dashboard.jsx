import { LogOut, Search, PlusCircle, Navigation, Clock, User, Settings as SettingsIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../../components/Logo';
import { useAuth } from '../../hooks/useAuth';

function Dashboard() {
  const { logout, user } = useAuth();

  return (
    <main className="dashboard-page">
      <nav className="dashboard-nav">
        <Logo />
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button className="secondary-button" type="button" onClick={logout}>
            <LogOut size={16} aria-hidden="true" />
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-grid">
        <section className="dashboard-card hero-section">
          <p className="eyebrow">Your Daily Commute</p>
          <h1>Welcome{user?.firstName ? `, ${user.firstName}` : ''}</h1>
          <p>
            Share rides with your colleagues, reduce carbon footprint, and save money.
            Choose an option below to get started.
          </p>
        </section>
      </div>

      <div className="action-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginTop: '32px' }}>
        <Link to="/find-ride" className="action-card dashboard-card" style={{ marginTop: '0', textDecoration: 'none', transition: 'transform 0.2s', cursor: 'pointer' }}>
          <div style={{ background: 'rgba(37, 99, 235, 0.1)', padding: '16px', borderRadius: '50%', width: 'fit-content', marginBottom: '20px' }}>
             <Search size={32} color="#2563eb" />
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Find a Ride</h2>
          <p style={{ margin: 0, color: '#64748b' }}>Search for available rides travelling along your route.</p>
        </Link>
        <Link to="/offer-ride" className="action-card dashboard-card" style={{ marginTop: '0', textDecoration: 'none', transition: 'transform 0.2s', cursor: 'pointer' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '16px', borderRadius: '50%', width: 'fit-content', marginBottom: '20px' }}>
             <PlusCircle size={32} color="#10b981" />
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Offer a Ride</h2>
          <p style={{ margin: 0, color: '#64748b' }}>Publish your travel route and share available seats.</p>
        </Link>
      </div>
    </main>
  );
}

export default Dashboard;
