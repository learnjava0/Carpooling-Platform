import { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { MapPin, Calendar, Clock, Car, ChevronRight, CheckCircle2 } from 'lucide-react';

function OfferRide() {
  const [step, setStep] = useState(1);

  return (
    <DashboardLayout title="Offer a Ride">
      <div className="erp-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Stepper */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '20px', left: '0', right: '0', height: '2px', background: 'var(--line)', zIndex: 0 }}></div>
          
          {[1, 2, 3].map(item => (
            <div key={item} style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{ 
                width: '40px', height: '40px', borderRadius: '50%', 
                background: step >= item ? 'var(--brand)' : 'var(--panel-solid)',
                border: `2px solid ${step >= item ? 'var(--brand)' : 'var(--line-strong)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: step >= item ? 'var(--brand-dark)' : 'var(--muted)',
                fontWeight: 'bold', transition: 'all 0.3s'
              }}>
                {step > item ? <CheckCircle2 size={20} /> : item}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: step >= item ? 'var(--text)' : 'var(--muted)' }}>
                {item === 1 ? 'Route' : item === 2 ? 'Details' : 'Confirm'}
              </span>
            </div>
          ))}
        </div>

        {/* Step Content */}
        {step === 1 && (
          <div>
            <h2 style={{ marginBottom: '24px', fontSize: '1.25rem' }}>Where are you traveling to?</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>Pickup Location</label>
                <div className="input-shell">
                  <MapPin size={18} />
                  <input type="text" placeholder="e.g. Green Valley Apartments" />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>Destination</label>
                <div className="input-shell">
                  <MapPin size={18} />
                  <input type="text" placeholder="e.g. Office Block A" defaultValue="Office Block A" />
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '32px' }}>
              <button className="primary-button" onClick={() => setStep(2)} style={{ width: 'auto' }}>
                Continue <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={{ marginBottom: '24px', fontSize: '1.25rem' }}>Trip Details</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>Date</label>
                <div className="input-shell">
                  <Calendar size={18} />
                  <input type="date" />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>Time</label>
                <div className="input-shell">
                  <Clock size={18} />
                  <input type="time" />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>Vehicle</label>
                <div className="input-shell">
                  <Car size={18} />
                  <select style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', color: 'var(--text)' }}>
                    <option>Honda City (MH12 AB 1234)</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>Available Seats</label>
                <div className="input-shell">
                  <input type="number" min="1" max="4" defaultValue="3" />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>Price per seat</label>
                <div className="input-shell">
                  <span style={{ fontWeight: 600 }}>₹</span>
                  <input type="number" min="0" defaultValue="50" />
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
              <button className="secondary-button" onClick={() => setStep(1)}>Back</button>
              <button className="primary-button" onClick={() => setStep(3)} style={{ width: 'auto' }}>
                Review <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 style={{ marginBottom: '24px', fontSize: '1.25rem' }}>Review & Publish</h2>
            
            <div style={{ background: 'rgba(34, 160, 107, 0.05)', borderRadius: '16px', padding: '24px', marginBottom: '24px', border: '1px solid rgba(34, 160, 107, 0.2)' }}>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                <MapPin color="var(--accent)" />
                <div>
                  <p style={{ margin: '0 0 4px', fontSize: '0.85rem', color: 'var(--muted)' }}>Pickup</p>
                  <p style={{ margin: 0, fontWeight: 600 }}>Green Valley Apartments</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <MapPin color="var(--brand)" />
                <div>
                  <p style={{ margin: '0 0 4px', fontSize: '0.85rem', color: 'var(--muted)' }}>Drop-off</p>
                  <p style={{ margin: 0, fontWeight: 600 }}>Office Block A</p>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
              <div style={{ pading: '16px', background: 'var(--bg-soft)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                <p style={{ margin: '0 0 8px', color: 'var(--muted)', fontSize: '0.8rem' }}>Date</p>
                <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>Today</p>
              </div>
              <div style={{ pading: '16px', background: 'var(--bg-soft)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                <p style={{ margin: '0 0 8px', color: 'var(--muted)', fontSize: '0.8rem' }}>Time</p>
                <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>09:00 AM</p>
              </div>
              <div style={{ pading: '16px', background: 'var(--bg-soft)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                <p style={{ margin: '0 0 8px', color: 'var(--muted)', fontSize: '0.8rem' }}>Seats</p>
                <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>3</p>
              </div>
              <div style={{ pading: '16px', background: 'var(--bg-soft)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                <p style={{ margin: '0 0 8px', color: 'var(--muted)', fontSize: '0.8rem' }}>Price/Seat</p>
                <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem', color: 'var(--accent)' }}>₹50</p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button className="secondary-button" onClick={() => setStep(2)}>Back</button>
              <button className="primary-button" style={{ width: 'auto', background: 'var(--brand)', color: 'var(--brand-dark)' }}>
                Publish Ride
              </button>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

export default OfferRide;
