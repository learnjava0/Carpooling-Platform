import { Clock, Users, MapPin, RefreshCw } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import AppShell from '../../layouts/AppShell';

const mockRides = [
  { id: 1, driver: 'Raj Patel', vehicle: 'Swift Dzire', plate: 'GJ01AB1234', rating: 4.8, time: '01:00 PM', seats: 4, fare: 120, from: 'ISKCON', to: 'Infinity' },
  { id: 2, driver: 'Krishna Singh', vehicle: 'Alto 800', plate: 'GJ01AB5678', rating: 4.6, time: '05:00 PM', seats: 2, fare: 120, from: 'ISKCON', to: 'Infinity' },
  { id: 3, driver: 'Sneha Mehta', vehicle: 'Kia Seltos', plate: 'GJ01CD9012', rating: 4.9, time: '09:15 AM', seats: 1, fare: 150, from: 'BTM Layout', to: 'Manyata Tech' },
];

export default function AvailableRides() {
  const navigate = useNavigate();
  const location = useLocation();
  const rideDetails = location.state?.rideDetails;

  return (
    <AppShell title="Available Rides" showBack
      rightActions={
        <button className="btn btn-ghost btn-sm"><RefreshCw size={14} /> Refresh</button>
      }
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
        {/* Ride list */}
        <div>
          <p style={{ color: 'var(--text-2)', fontSize: '0.85rem', marginBottom: 20 }}>
            Found <strong style={{ color: 'var(--text)' }}>{mockRides.length} rides</strong> along your route
          </p>

          {mockRides.map(ride => (
            <div key={ride.id} className="ride-card">
              <div className="ride-card-top">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className="user-avatar" style={{ width: 44, height: 44, fontSize: '1rem' }}>{ride.driver[0]}</div>
                  <div>
                    <div className="driver-info-name">{ride.driver}</div>
                    <div className="driver-info-sub">★ {ride.rating} · {ride.vehicle} · {ride.plate}</div>
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
                  <div className="ride-meta-item"><Users size={13} /> {ride.seats} seats left</div>
                </div>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => { alert(`Ride #${ride.id} booked!`); navigate('/trips'); }}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar summary */}
        <div>
          {rideDetails && (
            <div className="card" style={{ marginBottom: 16 }}>
              <p className="section-label">Your Search</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div className="dot-from" />
                  <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{rideDetails.pickupLocation || '—'}</span>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div className="dot-to" />
                  <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{rideDetails.destination || '—'}</span>
                </div>
                {rideDetails.travelDate && <span className="badge badge-muted">📅 {rideDetails.travelDate}</span>}
                {rideDetails.travelTime && <span className="badge badge-muted">🕐 {rideDetails.travelTime}</span>}
              </div>
              <button className="btn btn-ghost btn-full" style={{ marginTop: 14 }} onClick={() => navigate('/find-ride')}>
                Edit Search
              </button>
            </div>
          )}

          <div className="card" style={{ background: 'var(--brand-dim)', borderColor: 'rgba(244,176,0,0.2)' }}>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-2)', lineHeight: 1.65 }}>
              <strong style={{ color: 'var(--brand)' }}>Book quickly</strong> — seats fill up fast during peak hours. The fare is shared equally among all passengers.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
