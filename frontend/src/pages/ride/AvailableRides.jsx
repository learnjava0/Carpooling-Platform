import { useState, useEffect } from 'react';
import { Clock, Users, RefreshCw, AlertCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import RouteMap from '../../components/RouteMap';
import AppShell from '../../layouts/AppShell';
import { searchRides, bookTrip } from '../../services/api';
import Loader from '../../components/Loader';

export default function AvailableRides() {
  const navigate = useNavigate();
  const location = useLocation();
  const rd = location.state?.rideDetails;

  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookingId, setBookingId] = useState(null);

  const fetchRides = async () => {
    if (!rd) return;
    setLoading(true);
    setError('');

    try {
      // Combine travelDate + travelTime into ISO-8601 datetime
      const departureTime = rd.travelDate && rd.travelTime
        ? `${rd.travelDate}T${rd.travelTime}:00`
        : new Date().toISOString().slice(0, 19);

      const results = await searchRides({
        pickupLocation: rd.pickupLocation,
        destination: rd.destination,
        departureTime,
        seats: rd.numberOfSeats || 1,
      });
      setRides(results);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Could not fetch rides. Make sure the backend is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRides(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleBook = async (ride) => {
    setBookingId(ride.id);
    try {
      await bookTrip({ rideId: ride.id, bookedSeats: rd?.numberOfSeats || 1 });
      navigate('/trips');
    } catch (err) {
      alert(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setBookingId(null);
    }
  };

  const formatTime = (isoString) => {
    if (!isoString) return '—';
    try {
      return new Date(isoString).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch { return isoString; }
  };

  return (
    <AppShell
      title="Available Rides"
      showBack
      rightActions={
        <button className="btn btn-ghost btn-sm" onClick={fetchRides} disabled={loading}>
          <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh
        </button>
      }
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>

        {/* Ride list */}
        <div>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
              <Loader label="Searching rides..." />
            </div>
          ) : error ? (
            <div className="alert alert-error" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <AlertCircle size={16} /> {error}
            </div>
          ) : (
            <>
              <p style={{ color: 'var(--text-2)', fontSize: '0.85rem', marginBottom: 20 }}>
                Found <strong style={{ color: 'var(--text)' }}>{rides.length} rides</strong> along your route
              </p>

              {rides.length === 0 && (
                <div className="empty-state">
                  <p>No rides found for this route. Try a different date or location.</p>
                  <button className="btn btn-ghost" style={{ marginTop: 12 }} onClick={() => navigate('/find-ride')}>
                    Modify Search
                  </button>
                </div>
              )}

              {rides.map((ride) => (
                <div key={ride.id} className="ride-card">
                  <div className="ride-card-top">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div className="user-avatar" style={{ width: 44, height: 44, fontSize: '1rem' }}>
                        {ride.driver?.firstName?.[0] || 'D'}
                      </div>
                      <div>
                        <div className="driver-info-name">
                          {ride.driver?.firstName} {ride.driver?.lastName}
                        </div>
                        <div className="driver-info-sub">
                          {ride.vehicle?.model} · {ride.vehicle?.registrationNumber}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="fare-big">₹{ride.farePerSeat}</div>
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
                      <div><div className="route-label-sub">From</div><div className="route-label-from">{ride.pickupLocation}</div></div>
                      <div><div className="route-label-sub">To</div><div className="route-label-to">{ride.destination}</div></div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div className="ride-meta">
                      <div className="ride-meta-item"><Clock size={13} /> {formatTime(ride.departureTime)}</div>
                      <div className="ride-meta-item"><Users size={13} /> {ride.availableSeats} seats left</div>
                    </div>
                    <button
                      className="btn btn-primary btn-sm"
                      disabled={bookingId === ride.id}
                      onClick={() => handleBook(ride)}
                    >
                      {bookingId === ride.id ? 'Booking...' : 'Book Now'}
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Sidebar: map + search summary */}
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <p className="section-label">Route Map</p>
            <RouteMap
              from={rd?.pickupLocation || ''}
              to={rd?.destination || ''}
              height="220px"
            />
          </div>

          {rd && (
            <div className="card" style={{ marginBottom: 16 }}>
              <p className="section-label">Your Search</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div className="dot-from" />
                  <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{rd.pickupLocation}</span>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div className="dot-to" />
                  <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{rd.destination}</span>
                </div>
                {rd.travelDate && <span className="badge badge-muted">📅 {rd.travelDate}</span>}
                {rd.travelTime && <span className="badge badge-muted">🕐 {rd.travelTime}</span>}
                {rd.numberOfSeats && <span className="badge badge-muted">👤 {rd.numberOfSeats} seat(s)</span>}
              </div>
              <button className="btn btn-ghost" style={{ width: '100%', marginTop: 12 }} onClick={() => navigate('/find-ride')}>
                Edit Search
              </button>
            </div>
          )}

          <div className="card" style={{ background: 'var(--brand-dim)', borderColor: 'rgba(244,176,0,0.2)' }}>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-2)', lineHeight: 1.65 }}>
              <strong style={{ color: 'var(--brand)' }}>Book quickly</strong> — seats fill up fast during peak hours.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
