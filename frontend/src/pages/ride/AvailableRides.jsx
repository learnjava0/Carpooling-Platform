import { ArrowLeft, Clock, Users, IndianRupee, MapPin } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import PrimaryButton from '../../components/PrimaryButton';
import DashboardLayout from '../../layouts/DashboardLayout';

const mockRides = [
  {
    id: 1,
    driverName: 'Rahul Sharma',
    vehicle: 'Hyundai i20',
    rating: 4.8,
    departureTime: '09:00 AM',
    availableSeats: 3,
    fare: 80,
    route: 'HSR Layout → Manyata Tech Park',
  },
  {
    id: 2,
    driverName: 'Sneha Patel',
    vehicle: 'Kia Seltos',
    rating: 4.9,
    departureTime: '09:15 AM',
    availableSeats: 1,
    fare: 120,
    route: 'HSR Layout → Manyata Tech Park',
  },
  {
    id: 3,
    driverName: 'Vikram Singh',
    vehicle: 'Maruti Dzire',
    rating: 4.6,
    departureTime: '09:30 AM',
    availableSeats: 2,
    fare: 70,
    route: 'BTM Layout (via HSR) → Manyata Tech Park',
  }
];

function AvailableRides() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const rideDetails = location.state?.rideDetails;

  const handleBook = (rideId) => {
    alert(`Ride ${rideId} booked successfully!`);
    navigate('/trips');
  };

  return (
    <DashboardLayout title="Matching Rides">
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <button 
          type="button" 
          className="link-button" 
          style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--muted)' }}
          onClick={() => navigate('/route-confirmation', { state: { rideDetails } })}
        >
          <ArrowLeft size={16} /> Back to Route
        </button>

        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2rem', margin: '0 0 8px' }}>Available Rides</h1>
          <p style={{ color: 'var(--muted)', margin: 0 }}>Found {mockRides.length} rides along your route today.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {mockRides.map(ride => (
            <div key={ride.id} className="erp-card" style={{ margin: 0, padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--brand-dark)', fontSize: '1.2rem' }}>
                    {ride.driverName.charAt(0)}
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 4px', fontSize: '1.2rem', color: 'var(--text)' }}>{ride.driverName}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--muted)', fontSize: '0.9rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--brand)', fontWeight: 'bold' }}>★ {ride.rating}</span>
                      <span>•</span>
                      <span>{ride.vehicle}</span>
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <h3 style={{ margin: '0 0 4px', fontSize: '1.6rem', color: 'var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', fontWeight: 800 }}>
                    ₹{ride.fare}
                  </h3>
                  <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>per seat</span>
                </div>
              </div>

              <div style={{ height: '1px', background: 'var(--line)' }}></div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                 <div style={{ display: 'flex', gap: '24px', flex: 1, minWidth: '200px' }}>
                    <div>
                      <p style={{ margin: '0 0 6px', color: 'var(--muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}><MapPin size={14} /> Route</p>
                      <p style={{ margin: 0, fontWeight: 600 }}>{ride.route}</p>
                    </div>
                 </div>
                 
                 <div style={{ display: 'flex', gap: '32px' }}>
                   <div>
                      <p style={{ margin: '0 0 6px', color: 'var(--muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}><Clock size={14} /> Departure</p>
                      <p style={{ margin: 0, fontWeight: 600 }}>{ride.departureTime}</p>
                   </div>
                   <div>
                      <p style={{ margin: '0 0 6px', color: 'var(--muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}><Users size={14} /> Seats Left</p>
                      <p style={{ margin: 0, fontWeight: 600 }}>{ride.availableSeats}</p>
                   </div>
                 </div>
              </div>

              <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'flex-end' }}>
                 <PrimaryButton onClick={() => handleBook(ride.id)} style={{ width: 'auto', padding: '0 32px' }}>
                    Book Ride
                 </PrimaryButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AvailableRides;
