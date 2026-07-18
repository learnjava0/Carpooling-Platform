import { ArrowLeft, Clock, Users, IndianRupee, MapPin } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo';
import { useAuth } from '../../hooks/useAuth';
import { LogOut } from 'lucide-react';
import PrimaryButton from '../../components/PrimaryButton';

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
  const { logout } = useAuth();
  
  const rideDetails = location.state?.rideDetails;

  const handleBook = (rideId) => {
    alert(`Ride ${rideId} booked successfully!`);
    navigate('/dashboard');
  };

  return (
    <main className="dashboard-page">
      <nav className="dashboard-nav">
        <Logo />
        <button className="secondary-button" type="button" onClick={logout}>
          <LogOut size={16} aria-hidden="true" />
          Logout
        </button>
      </nav>
      
      <div className="dashboard-grid">
         <section className="dashboard-card" style={{ maxWidth: '800px', margin: '0 auto', width: '100%', background: 'transparent', boxShadow: 'none', border: 'none', padding: '0 0 40px 0' }}>
            <button 
              type="button" 
              className="link-button" 
              style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}
              onClick={() => navigate('/route-confirmation', { state: { rideDetails } })}
            >
              <ArrowLeft size={16} /> Back to Route
            </button>

            <p className="eyebrow">Matching Results</p>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '12px' }}>Available Rides</h1>
            <p style={{ color: '#64748b', marginBottom: '32px' }}>Found {mockRides.length} rides along your route.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {mockRides.map(ride => (
                <div key={ride.id} className="dashboard-card" style={{ margin: 0, padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#64748b', fontSize: '1.2rem' }}>
                        {ride.driverName.charAt(0)}
                      </div>
                      <div>
                        <h3 style={{ margin: '0 0 4px', fontSize: '1.1rem', color: '#0f172a' }}>{ride.driverName}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.9rem' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>★ {ride.rating}</span>
                          <span>•</span>
                          <span>{ride.vehicle}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <h3 style={{ margin: '0 0 4px', fontSize: '1.5rem', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <IndianRupee size={20} />{ride.fare}
                      </h3>
                      <span style={{ color: '#64748b', fontSize: '0.9rem' }}>per seat</span>
                    </div>
                  </div>

                  <div style={{ height: '1px', background: '#e2e8f0' }}></div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                     <div style={{ display: 'flex', gap: '24px', flex: 1, minWidth: '200px' }}>
                        <div>
                          <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} /> Route</p>
                          <p style={{ margin: 0, fontWeight: 500 }}>{ride.route}</p>
                        </div>
                     </div>
                     
                     <div style={{ display: 'flex', gap: '24px' }}>
                       <div>
                          <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} /> Departure</p>
                          <p style={{ margin: 0, fontWeight: 500 }}>{ride.departureTime}</p>
                       </div>
                       <div>
                          <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}><Users size={14} /> Seats Left</p>
                          <p style={{ margin: 0, fontWeight: 500 }}>{ride.availableSeats}</p>
                       </div>
                     </div>
                  </div>

                  <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'flex-end' }}>
                     <PrimaryButton onClick={() => handleBook(ride.id)} style={{ padding: '12px 32px' }}>
                        Book Ride
                     </PrimaryButton>
                  </div>
                </div>
              ))}
            </div>

         </section>
      </div>
    </main>
  );
}

export default AvailableRides;
