import DashboardLayout from '../../layouts/DashboardLayout';
import { MapPin, Navigation, Clock, Calendar, CheckCircle } from 'lucide-react';

function MyTrips() {
  const trips = [
    {
      id: 1,
      type: 'passenger',
      status: 'upcoming',
      date: 'Today, 05:30 PM',
      from: 'Office Block A',
      to: 'Green Valley Apartments',
      driver: 'Rahul Sharma',
      vehicle: 'Honda City (MH12AB1234)',
      price: '₹50'
    },
    {
      id: 2,
      type: 'driver',
      status: 'completed',
      date: 'Yesterday, 09:00 AM',
      from: 'Green Valley Apartments',
      to: 'Office Block A',
      passengers: 3,
      earnings: '₹150'
    }
  ];

  return (
    <DashboardLayout title="My Trips">
      <div className="erp-card">
        <div className="erp-card-header" style={{ marginBottom: '16px' }}>
          <h2 className="erp-card-title">Trip History & Upcoming</h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="secondary-button" style={{ fontSize: '0.85rem' }}>All</button>
            <button className="secondary-button" style={{ fontSize: '0.85rem', background: 'var(--brand)', color: 'var(--brand-dark)', borderColor: 'var(--brand)' }}>Upcoming</button>
            <button className="secondary-button" style={{ fontSize: '0.85rem' }}>Completed</button>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '20px' }}>
          {trips.map(trip => (
            <div key={trip.id} style={{ 
              border: '1px solid var(--line)', 
              borderRadius: '16px', 
              padding: '20px', 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              background: trip.status === 'upcoming' ? 'rgba(34, 160, 107, 0.03)' : 'transparent'
            }}>
              
              <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: trip.type === 'passenger' ? '#dbeafe' : '#fef08a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {trip.type === 'passenger' ? <Navigation size={24} color="#1e40af" /> : <MapPin size={24} color="#854d0e" />}
                  </div>
                  <span className={`badge ${trip.status === 'upcoming' ? 'badge-success' : 'badge-info'}`}>
                    {trip.status}
                  </span>
                </div>

                <div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{trip.from} <span style={{ color: 'var(--muted)', margin: '0 8px' }}>→</span> {trip.to}</h3>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', color: 'var(--muted)', fontSize: '0.9rem' }}>
                    <span style={{ display: 'flex', gap: '4px', alignItems: 'center' }}><Calendar size={14} /> {trip.date}</span>
                    {trip.type === 'passenger' && <span style={{ display: 'flex', gap: '4px', alignItems: 'center' }}><Navigation size={14} /> Driver: {trip.driver}</span>}
                    {trip.type === 'driver' && <span style={{ display: 'flex', gap: '4px', alignItems: 'center' }}><Navigation size={14} /> Passengers: {trip.passengers}</span>}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: '0 0 8px', fontSize: '1.25rem', fontWeight: 800 }}>
                  {trip.type === 'passenger' ? trip.price : trip.earnings}
                </p>
                {trip.status === 'upcoming' && (
                  <button className="primary-button" style={{ minHeight: '36px', padding: '0 16px', fontSize: '0.9rem', borderRadius: '8px' }}>
                    Track Ride
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default MyTrips;
