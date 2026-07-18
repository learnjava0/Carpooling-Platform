import { Search, PlusCircle, Clock, MapPin, Users, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuth } from '../../hooks/useAuth';

function Dashboard() {
  const { user } = useAuth();
  const userName = user?.firstName ? user.firstName : 'there';

  return (
    <DashboardLayout title="Overview Overview">
      <div className="erp-card hero-section" style={{ background: 'linear-gradient(135deg, var(--brand), #ffd86f)', color: 'var(--brand-dark)' }}>
        <p style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px', opacity: 0.8 }}>Your Daily Commute</p>
        <h1 style={{ margin: '0 0 12px', fontSize: '2rem' }}>Welcome back, {userName}! 👋</h1>
        <p style={{ margin: 0, maxWidth: '600px', opacity: 0.9 }}>
          Share rides with your colleagues, reduce carbon footprint, and save money. Choose an option below to get started.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div className="erp-card" style={{ marginBottom: 0, background: 'rgba(37, 99, 235, 0.05)', borderColor: 'rgba(37, 99, 235, 0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div style={{ background: 'rgba(37, 99, 235, 0.15)', padding: '16px', borderRadius: '50%' }}>
              <Search size={28} color="#2563eb" />
            </div>
          </div>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Find a Ride</h2>
          <p style={{ color: 'var(--muted)', marginBottom: '24px', fontSize: '0.9rem' }}>Search for available rides travelling along your route today.</p>
          <Link to="/find-ride" className="primary-button" style={{ textDecoration: 'none', background: '#2563eb', color: '#fff', boxShadow: '0 8px 24px rgba(37, 99, 235, 0.25)' }}>
            Search Rides
          </Link>
        </div>

        <div className="erp-card" style={{ marginBottom: 0, background: 'rgba(16, 185, 129, 0.05)', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '16px', borderRadius: '50%' }}>
              <PlusCircle size={28} color="#10b981" />
            </div>
          </div>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Offer a Ride</h2>
          <p style={{ color: 'var(--muted)', marginBottom: '24px', fontSize: '0.9rem' }}>Publish your travel route and share available seats with others.</p>
          <Link to="/offer-ride" className="primary-button" style={{ textDecoration: 'none', background: '#10b981', color: '#fff', boxShadow: '0 8px 24px rgba(16, 185, 129, 0.25)' }}>
            Offer a Ride
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '24px' }}>
        <div className="erp-card">
          <div className="erp-card-header">
            <h3 className="erp-card-title">Recent Activity</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '12px', background: 'rgba(45, 38, 24, 0.03)', borderRadius: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MapPin size={20} color="#166534" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: '0 0 4px', fontWeight: 600 }}>Completed trip to Office</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--muted)' }}>Yesterday, 09:30 AM</p>
              </div>
              <span className="badge badge-success">Completed</span>
            </div>
            
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '12px', background: 'rgba(45, 38, 24, 0.03)', borderRadius: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={20} color="#1e40af" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: '0 0 4px', fontWeight: 600 }}>Accepted ride request</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--muted)' }}>2 days ago</p>
              </div>
              <span className="badge badge-info">System</span>
            </div>
          </div>
        </div>

        <div className="erp-card">
          <div className="erp-card-header">
            <h3 className="erp-card-title">Stats</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <p style={{ color: 'var(--muted)', margin: '0 0 4px', fontSize: '0.85rem' }}>CO₂ Saved</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>45.2 kg</p>
            </div>
            <div>
              <p style={{ color: 'var(--muted)', margin: '0 0 4px', fontSize: '0.85rem' }}>Trips Shared</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>12</p>
            </div>
            <div>
              <p style={{ color: 'var(--muted)', margin: '0 0 4px', fontSize: '0.85rem' }}>Wallet Balance</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: 'var(--accent)' }}>₹850.00</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
