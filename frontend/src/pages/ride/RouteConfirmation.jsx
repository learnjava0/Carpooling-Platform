import { ArrowLeft, Map as MapIcon, Navigation } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import PrimaryButton from '../../components/PrimaryButton';
import DashboardLayout from '../../layouts/DashboardLayout';

function RouteConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const rideDetails = location.state?.rideDetails || {
    pickupLocation: 'Unknown',
    destination: 'Unknown'
  };

  const handleConfirm = () => {
    navigate('/available-rides', { state: { rideDetails } });
  };

  return (
    <DashboardLayout title="Find a Ride">
      <div className="erp-card" style={{ maxWidth: '800px', margin: '0 auto', background: 'var(--panel-solid)' }}>
        <button 
          type="button" 
          className="link-button" 
          style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--muted)' }}
          onClick={() => navigate('/find-ride')}
        >
          <ArrowLeft size={16} /> Back to Search
        </button>

        <p className="eyebrow" style={{ color: 'var(--accent)' }}>Review Travel Path</p>
        <h1 style={{ fontSize: '2rem', marginBottom: '32px' }}>Route Confirmation</h1>

        <div style={{ background: 'var(--bg-soft)', border: '1px solid var(--line)', borderRadius: '16px', overflow: 'hidden', marginBottom: '24px' }}>
          {/* Map Placeholder */}
          <div style={{ height: '320px', background: 'rgba(37, 99, 235, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: 'var(--muted)' }}>
              <MapIcon size={56} style={{ marginBottom: '16px', opacity: 0.8, color: '#2563eb' }} />
              <span style={{ fontWeight: 600 }}>Interactive Map Rendering Route</span>
              <small style={{ marginTop: '8px' }}>Google Maps Integration (Mocked)</small>
          </div>
          
          <div style={{ padding: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{ background: '#dbeafe', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                  <div style={{ width: '12px', height: '12px', background: '#2563eb', borderRadius: '50%' }} />
                </div>
                <div>
                  <h3 style={{ margin: '0 0 6px', fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pickup Location</h3>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: '1.1rem', color: 'var(--text)' }}>{rideDetails.pickupLocation}</p>
                </div>
              </div>

              <div style={{ marginLeft: '15px', borderLeft: '2px dashed var(--line-strong)', height: '24px', opacity: 0.5 }}></div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{ background: '#fce7f3', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                  <Navigation size={16} color="#db2777" />
                </div>
                <div>
                  <h3 style={{ margin: '0 0 6px', fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Destination</h3>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: '1.1rem', color: 'var(--text)' }}>{rideDetails.destination}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '32px' }}>
          <PrimaryButton onClick={handleConfirm} style={{ width: 'auto', padding: '0 32px' }}>
            Find Available Rides
          </PrimaryButton>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default RouteConfirmation;
