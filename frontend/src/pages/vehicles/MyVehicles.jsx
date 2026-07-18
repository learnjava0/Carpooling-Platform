import DashboardLayout from '../../layouts/DashboardLayout';
import { Car, Plus, ShieldCheck, CreditCard, Settings } from 'lucide-react';

function MyVehicles() {
  const vehicles = [
    {
      id: 1,
      name: 'Honda City',
      registration: 'MH12 AB 1234',
      type: 'Sedan',
      seats: 4,
      fuel: 'Petrol',
      status: 'Verified',
      image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=400'
    }
  ];

  return (
    <DashboardLayout title="My Vehicles">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
        <button className="primary-button" style={{ width: 'auto', minHeight: '40px', padding: '0 20px', borderRadius: '8px' }}>
          <Plus size={18} /> Add New Vehicle
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
        {vehicles.map(v => (
          <div key={v.id} className="erp-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ height: '180px', background: `url(${v.image}) center/cover` }}></div>
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px', fontSize: '1.25rem' }}>{v.name}</h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--muted)', fontWeight: 600, letterSpacing: '0.05em' }}>{v.registration}</span>
                </div>
                <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={14} /> {v.status}
                </span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <p style={{ margin: '0 0 4px', color: 'var(--muted)', fontSize: '0.8rem' }}>Type</p>
                  <p style={{ margin: 0, fontWeight: 600 }}>{v.type}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px', color: 'var(--muted)', fontSize: '0.8rem' }}>Seats</p>
                  <p style={{ margin: 0, fontWeight: 600 }}>{v.seats} Available</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px', color: 'var(--muted)', fontSize: '0.8rem' }}>Fuel</p>
                  <p style={{ margin: 0, fontWeight: 600 }}>{v.fuel}</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="secondary-button" style={{ flex: 1, padding: '8px 0', minHeight: '36px', fontSize: '0.9rem' }}>
                  <CreditCard size={16} /> View Docs
                </button>
                <button className="secondary-button" style={{ flex: 1, padding: '8px 0', minHeight: '36px', fontSize: '0.9rem' }}>
                  <Settings size={16} /> Manage
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

export default MyVehicles;
