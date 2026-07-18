import { Plus, ShieldCheck, Settings, FileText, Car } from 'lucide-react';
import AppShell from '../../layouts/AppShell';

const vehicles = [
  { id: 1, name: 'Swift Dzire', registration: 'GJ01AB1234', type: 'Sedan', seats: 4, fuel: 'Petrol', status: 'Verified', image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=600' },
  { id: 2, name: 'Alto 800', registration: 'GJ01AB5678', type: 'Hatchback', seats: 4, fuel: 'Petrol', status: 'Driver', image: null },
];

export default function MyVehicles() {
  return (
    <AppShell title="My Vehicles"
      rightActions={
        <button className="btn btn-primary btn-sm"><Plus size={14} /> Add Vehicle</button>
      }
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
        {vehicles.map(v => (
          <div key={v.id} className="vehicle-card">
            {v.image
              ? <img src={v.image} alt={v.name} className="vehicle-img" />
              : <div className="vehicle-img-placeholder"><Car size={44} style={{ opacity: 0.25 }} /></div>
            }
            <div className="vehicle-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div className="vehicle-name">{v.name}</div>
                <span className="badge badge-green"><ShieldCheck size={11} /> {v.status}</span>
              </div>
              <div className="vehicle-reg">{v.registration}</div>
              <div className="vehicle-specs">
                <div className="spec-item"><div className="spec-value">{v.type}</div><div className="spec-key">Type</div></div>
                <div className="spec-item"><div className="spec-value">{v.seats}</div><div className="spec-key">Seats</div></div>
                <div className="spec-item"><div className="spec-value">{v.fuel}</div><div className="spec-key">Fuel</div></div>
              </div>
              <div className="vehicle-actions">
                <button className="secondary-button btn-sm"><FileText size={13} /> View Docs</button>
                <button className="secondary-button btn-sm"><Settings size={13} /> Manage</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
