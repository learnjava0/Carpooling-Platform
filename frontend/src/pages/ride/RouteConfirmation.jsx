import { ArrowLeft, Map as MapIcon, Navigation } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import PrimaryButton from '../../components/PrimaryButton';
import Logo from '../../components/Logo';
import { useAuth } from '../../hooks/useAuth';
import { LogOut } from 'lucide-react';

function RouteConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  
  const rideDetails = location.state?.rideDetails || {
    pickupLocation: 'Unknown',
    destination: 'Unknown'
  };

  const handleConfirm = () => {
    navigate('/available-rides', { state: { rideDetails } });
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
        <section className="dashboard-card" style={{ maxWidth: '720px', margin: '0 auto', width: '100%' }}>
          <button 
            type="button" 
            className="link-button" 
            style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}
            onClick={() => navigate('/find-ride')}
          >
            <ArrowLeft size={16} /> Back to Search
          </button>

          <p className="eyebrow">Review Travel Path</p>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '32px' }}>Route Confirmation</h1>

          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', marginBottom: '24px' }}>
            {/* Map Placeholder */}
            <div style={{ height: '300px', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#64748b' }}>
                <MapIcon size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                <span>Interactive Map Rendering Route</span>
                <small style={{ marginTop: '8px' }}>Google Maps / OpenStreetMap Integration</small>
            </div>
            
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ background: '#dbeafe', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <div style={{ width: '12px', height: '12px', background: '#2563eb', borderRadius: '50%' }} />
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 4px', fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pickup Location</h3>
                    <p style={{ margin: 0, fontWeight: 500, color: '#0f172a' }}>{rideDetails.pickupLocation}</p>
                  </div>
                </div>

                <div style={{ marginLeft: '15px', borderLeft: '2px dashed #cbd5e1', height: '24px' }}></div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ background: '#fce7f3', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Navigation size={16} color="#db2777" />
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 4px', fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Destination</h3>
                    <p style={{ margin: 0, fontWeight: 500, color: '#0f172a' }}>{rideDetails.destination}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
            <PrimaryButton onClick={handleConfirm} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              Confirm & Search Rides
            </PrimaryButton>
          </div>
        </section>
      </div>
    </main>
  );
}

export default RouteConfirmation;
