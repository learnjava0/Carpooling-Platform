import { useState } from 'react';
import { Calendar, MessageSquare, Phone, MapPin } from 'lucide-react';
import AppShell from '../../layouts/AppShell';
import { useNavigate } from 'react-router-dom';

const trips = [
  { id: 1, type: 'passenger', status: 'upcoming', date: '19 Jul 2026, 09:00 PM', from: 'Jalaram to Infinity', to: 'Infinity', driver: 'Raj Patel', vehicle: 'Swift Dzire · GJ01AB1234', fare: 120, seat: 1 },
  { id: 2, type: 'driver', status: 'completed', date: '18 Jul 2026, 04:00 AM', from: 'ISKCON', to: 'Abbey', passengers: 2, fare: 120 },
  { id: 3, type: 'passenger', status: 'completed', date: '16 Jul 2026, 09:00 AM', from: 'Satellite', to: 'GIFT City', driver: 'Sneha Mehta', vehicle: 'Kia Seltos · GJ01CD9012', fare: 80, seat: 1 },
];

const filters = ['All', 'Upcoming', 'Completed'];

export default function MyTrips() {
  const [active, setActive] = useState('All');
  const navigate = useNavigate();
  const filtered = trips.filter(t => active === 'All' ? true : t.status.toLowerCase() === active.toLowerCase());

  return (
    <AppShell title="My Trips">
      <div className="filter-tabs">
        {filters.map(f => (
          <button key={f} className={`filter-tab ${active === f ? 'active' : ''}`} onClick={() => setActive(f)}>{f}</button>
        ))}
      </div>

      {filtered.map(trip => (
        <div key={trip.id} className="trip-card">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <span className={`badge ${trip.status === 'upcoming' ? 'badge-green' : 'badge-muted'}`}>{trip.status}</span>
              <span className={`badge ${trip.type === 'passenger' ? 'badge-blue' : 'badge-yellow'}`}>{trip.type}</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 5 }}>
              <Calendar size={12} /> {trip.date}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'start' }}>
            <div className="route-visual">
              <div className="route-dots">
                <div className="dot-from" />
                <div className="dot-line" style={{ minHeight: 28 }} />
                <div className="dot-to" />
              </div>
              <div className="route-labels">
                <div><div className="route-label-sub">From</div><div className="route-label-from">{trip.from}</div></div>
                <div><div className="route-label-sub">To</div><div className="route-label-to">{trip.to}</div></div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div className="trip-price">₹{trip.fare}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-3)', marginTop: 2 }}>
                {trip.type === 'passenger' ? '1 seat' : `${trip.passengers} passengers`}
              </div>
            </div>
          </div>

          {trip.type === 'passenger' && trip.driver && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14, padding: '10px 14px', background: 'var(--bg-elevated)', borderRadius: 10 }}>
              <div className="user-avatar" style={{ width: 32, height: 32, fontSize: '0.78rem' }}>{trip.driver[0]}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{trip.driver}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-3)' }}>{trip.vehicle}</div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn btn-ghost btn-icon" style={{ width: 32, height: 32 }} onClick={() => navigate('/chat')}><MessageSquare size={14} /></button>
                <button className="btn btn-ghost btn-icon" style={{ width: 32, height: 32 }}><Phone size={14} /></button>
              </div>
            </div>
          )}

          {trip.status === 'upcoming' && (
            <button className="btn btn-primary btn-sm" style={{ marginTop: 14 }}>Track Ride</button>
          )}
        </div>
      ))}

      {filtered.length === 0 && (
        <div className="empty-state"><p>No {active.toLowerCase()} trips found.</p></div>
      )}
    </AppShell>
  );
}
