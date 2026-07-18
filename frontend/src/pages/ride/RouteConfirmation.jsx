import { MapPin, Navigation, Clock, Users } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import PrimaryButton from '../../components/PrimaryButton';
import AppShell from '../../layouts/AppShell';

export default function RouteConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const rd = location.state?.rideDetails || { pickupLocation: 'Unknown', destination: 'Unknown' };

  return (
    <AppShell title="Route Confirmation" showBack>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Map */}
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <p className="section-label">Map Preview</p>
            <div className="map-placeholder" style={{ height: 320 }}>
              <div className="map-route-line" />
              <MapPin size={36} color="var(--brand)" style={{ opacity: 0.6 }} />
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-2)' }}>Route visualization</span>
              <small style={{ color: 'var(--text-3)' }}>Maps integration placeholder</small>
            </div>
          </div>
        </div>

        {/* Route details + confirm */}
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <p className="section-label">Your Route</p>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 20 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 4 }}>
                <div className="dot-from" />
                <div className="dot-line" style={{ minHeight: 40 }} />
                <div className="dot-to" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24, flex: 1 }}>
                <div>
                  <div className="route-label-sub">Pickup</div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)', marginTop: 3 }}>{rd.pickupLocation}</div>
                </div>
                <div>
                  <div className="route-label-sub">Drop-off</div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)', marginTop: 3 }}>{rd.destination}</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {rd.travelDate && <span className="badge badge-muted">📅 {rd.travelDate}</span>}
              {rd.travelTime && <span className="badge badge-muted">🕐 {rd.travelTime}</span>}
              {rd.numberOfSeats && <span className="badge badge-muted">💺 {rd.numberOfSeats} seat{rd.numberOfSeats > 1 ? 's' : ''}</span>}
            </div>
          </div>

          <div className="card" style={{ marginBottom: 16, background: 'var(--accent-dim)', borderColor: 'rgba(74,222,128,0.2)' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 600 }}>
              ✓ Route calculated. Ready to find matching rides.
            </p>
          </div>

          <PrimaryButton
            onClick={() => navigate('/available-rides', { state: { rideDetails: rd } })}
            style={{ width: '100%', minHeight: 46 }}
          >
            Find Available Rides →
          </PrimaryButton>

          <button
            className="btn btn-ghost btn-full"
            style={{ marginTop: 10, width: '100%' }}
            onClick={() => navigate('/find-ride')}
          >
            ← Edit Route
          </button>
        </div>
      </div>
    </AppShell>
  );
}
