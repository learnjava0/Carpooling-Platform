import { Link } from 'react-router-dom';
import { Search, PlusCircle, Clock, MapPin, Users, Leaf, IndianRupee, TrendingUp } from 'lucide-react';
import AppShell from '../../layouts/AppShell';
import { useAuth } from '../../hooks/useAuth';

const recentRides = [
  { id: 1, driver: 'Raj Patel', vehicle: 'Swift Dzire', rating: 4.8, from: 'ISKCON', to: 'Infinity', time: '01:00 PM', fare: 120, seats: 2, status: 'completed' },
  { id: 2, driver: 'Krishna Singh', vehicle: 'Alto 800', rating: 4.6, from: 'ISKCON', to: 'Abbey', time: '04:00 AM', fare: 120, seats: 2, status: 'completed' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const name = user?.firstName || 'there';

  return (
    <AppShell title="Overview">
      {/* Welcome banner */}
      <div className="welcome-banner">
        <div className="welcome-text">
          <h2>Welcome back, {name} 👋</h2>
          <p>Share rides with your colleagues, reduce your carbon footprint, and save money on every commute.</p>
        </div>
        <div className="welcome-actions">
          <Link to="/find-ride" className="btn btn-primary btn-lg">
            <Search size={17} /> Find a Ride
          </Link>
          <Link to="/offer-ride" className="btn btn-ghost btn-lg">
            <PlusCircle size={17} /> Offer a Ride
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid-4" style={{ marginBottom: 28 }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--blue-dim)' }}><TrendingUp size={20} color="var(--blue)" /></div>
          <div><div className="stat-value">12</div><div className="stat-label">Total Trips</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--accent-dim)' }}><Leaf size={20} color="var(--accent)" /></div>
          <div><div className="stat-value" style={{ color: 'var(--accent)' }}>45 kg</div><div className="stat-label">CO₂ Saved</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--brand-dim)' }}><IndianRupee size={20} color="var(--brand)" /></div>
          <div><div className="stat-value" style={{ color: 'var(--brand)' }}>₹850</div><div className="stat-label">Wallet Balance</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--purple-dim)' }}><Users size={20} color="var(--purple)" /></div>
          <div><div className="stat-value">8</div><div className="stat-label">Rides Shared</div></div>
        </div>
      </div>

      {/* Action cards + Recent activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 28 }}>
        <Link to="/find-ride" className="action-card">
          <div className="action-card-icon" style={{ background: 'var(--blue-dim)' }}><Search size={20} color="var(--blue)" /></div>
          <div className="action-card-title">Find a Ride</div>
          <div className="action-card-sub">Search available rides along your route today.</div>
        </Link>
        <Link to="/offer-ride" className="action-card">
          <div className="action-card-icon" style={{ background: 'var(--accent-dim)' }}><PlusCircle size={20} color="var(--accent)" /></div>
          <div className="action-card-title">Offer a Ride</div>
          <div className="action-card-sub">Publish your route and share seats with colleagues.</div>
        </Link>
      </div>

      {/* Recent rides */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Recent Activity</span>
          <Link to="/trips" className="link-btn">View all trips →</Link>
        </div>

        {recentRides.map(ride => (
          <div key={ride.id} className="ride-card" style={{ marginBottom: 12 }}>
            <div className="ride-card-top">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="user-avatar">{ride.driver[0]}</div>
                <div>
                  <div className="driver-info-name">{ride.driver}</div>
                  <div className="driver-info-sub">★ {ride.rating} · {ride.vehicle}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="fare-big">₹{ride.fare}</div>
                <div className="fare-sub">per seat</div>
              </div>
            </div>

            <div className="route-visual">
              <div className="route-dots">
                <div className="dot-from" />
                <div className="dot-line" />
                <div className="dot-to" />
              </div>
              <div className="route-labels">
                <div><div className="route-label-sub">From</div><div className="route-label-from">{ride.from}</div></div>
                <div><div className="route-label-sub">To</div><div className="route-label-to">{ride.to}</div></div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div className="ride-meta">
                <div className="ride-meta-item"><Clock size={13} /> {ride.time}</div>
                <div className="ride-meta-item"><MapPin size={13} /> {ride.seats} seats</div>
              </div>
              <span className="badge badge-muted">{ride.status}</span>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
