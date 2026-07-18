import { useEffect, useState } from 'react';
import { Calendar, AlertCircle, RefreshCw } from 'lucide-react';
import AppShell from '../../layouts/AppShell';
import { getMyTrips } from '../../services/api';
import Loader from '../../components/Loader';

function formatDate(isoString) {
  if (!isoString) return '—';
  try {
    return new Date(isoString).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true,
    });
  } catch { return isoString; }
}

export default function RideHistory() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getMyTrips();
      // Show all trips in history, most recent first
      setTrips([...data].reverse());
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load ride history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadHistory(); }, []);

  return (
    <AppShell
      title="Ride History"
      rightActions={
        <button className="btn btn-ghost btn-sm" onClick={loadHistory} disabled={loading}>
          <RefreshCw size={13} /> Refresh
        </button>
      }
    >
      <div className="card">
        <div className="card-header">
          <span className="card-title">All Rides</span>
          {!loading && (
            <span className="badge badge-muted">{trips.length} trip{trips.length !== 1 ? 's' : ''}</span>
          )}
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
            <Loader label="Loading history..." />
          </div>
        ) : error ? (
          <div className="alert alert-error" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <AlertCircle size={16} /> {error}
          </div>
        ) : trips.length === 0 ? (
          <div className="empty-state" style={{ padding: '40px 0' }}>
            <Calendar size={36} style={{ opacity: 0.25, marginBottom: 12 }} />
            <p>No ride history yet. Book your first ride!</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Route</th>
                <th>Driver</th>
                <th>Date & Time</th>
                <th>Fare</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {trips.map((trip) => {
                const ride   = trip.ride;
                const driver = ride?.driver;
                return (
                  <tr key={trip.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="dot-from" style={{ flexShrink: 0 }} />
                        <span style={{ fontWeight: 600 }}>{ride?.pickupLocation || '—'}</span>
                        <span style={{ color: 'var(--text-3)' }}>→</span>
                        <span style={{ fontWeight: 600 }}>{ride?.destination || '—'}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-2)' }}>
                      {driver ? `${driver.firstName} ${driver.lastName}` : '—'}
                    </td>
                    <td style={{ color: 'var(--text-3)', fontSize: '0.8rem' }}>
                      {formatDate(ride?.departureTime)}
                    </td>
                    <td style={{ fontWeight: 800, color: 'var(--brand)' }}>₹{trip.totalFare}</td>
                    <td>
                      <span className={`badge ${
                        trip.status === 'COMPLETED'       ? 'badge-muted'  :
                        trip.status === 'BOOKED'          ? 'badge-green'  :
                        trip.status === 'PAYMENT_PENDING' ? 'badge-yellow' :
                        trip.status === 'PAYMENT_COMPLETED' ? 'badge-blue' :
                        'badge-red'
                      }`}>
                        {trip.status?.charAt(0) + (trip.status?.slice(1)?.toLowerCase().replace('_', ' ') || '')}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </AppShell>
  );
}
