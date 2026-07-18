import { useState } from 'react';
import { MapPin, Calendar, Clock, Car, ChevronRight, CheckCircle2, ArrowLeftRight } from 'lucide-react';
import AppShell from '../../layouts/AppShell';
import RouteMap from '../../components/RouteMap';

export default function OfferRide() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ from: '', to: '', date: '', time: '', vehicle: 'Swift Dzire (GJ01AB1234)', seats: 3, price: 50 });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <AppShell title="Offer a Ride">
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        {/* Stepper */}
        <div className="stepper">
          {['Route', 'Details', 'Review & Publish'].map((label, i) => {
            const n = i + 1;
            const cls = step > n ? 'done' : step === n ? 'active' : '';
            return (
              <div key={label} className={`step-item ${cls}`}>
                <div className="step-circle">{step > n ? <CheckCircle2 size={15} /> : n}</div>
                <span className="step-label">{label}</span>
              </div>
            );
          })}
        </div>

        {/* ── Step 1: Route ── */}
        {step === 1 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div className="card">
              <p className="section-label">Where are you going?</p>
              <div className="stack">
                <div>
                  <div className="field-label" style={{ marginBottom: 6 }}>Start Location</div>
                  <div className="input-shell">
                    <MapPin size={16} />
                    <input value={form.from} onChange={e => set('from', e.target.value)} placeholder="e.g. Satellite, Ahmedabad" />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <button type="button" className="swap-btn" onClick={() => setForm(f => ({ ...f, from: f.to, to: f.from }))}>
                    <ArrowLeftRight size={14} />
                  </button>
                </div>
                <div>
                  <div className="field-label" style={{ marginBottom: 6 }}>Destination</div>
                  <div className="input-shell">
                    <MapPin size={16} />
                    <input value={form.to} onChange={e => set('to', e.target.value)} placeholder="e.g. Office Campus, SG Road" />
                  </div>
                </div>
              </div>
              <button className="btn btn-primary" style={{ width: '100%', marginTop: 24 }} onClick={() => setStep(2)}>
                Continue <ChevronRight size={16} />
              </button>
            </div>

            <div className="card">
              <p className="section-label">Route Preview</p>
              <RouteMap from={form.from} to={form.to} height="260px" />
            </div>
          </div>
        )}

        {/* ── Step 2: Details ── */}
        {step === 2 && (
          <div className="card" style={{ maxWidth: 600 }}>
            <p className="section-label">Trip Details</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
              <div>
                <div className="field-label" style={{ marginBottom: 6 }}>Date</div>
                <div className="input-shell"><Calendar size={16} /><input type="date" value={form.date} onChange={e => set('date', e.target.value)} /></div>
              </div>
              <div>
                <div className="field-label" style={{ marginBottom: 6 }}>Time</div>
                <div className="input-shell"><Clock size={16} /><input type="time" value={form.time} onChange={e => set('time', e.target.value)} /></div>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <div className="field-label" style={{ marginBottom: 6 }}>Vehicle</div>
                <div className="input-shell">
                  <Car size={16} />
                  <select value={form.vehicle} onChange={e => set('vehicle', e.target.value)}>
                    <option>Swift Dzire (GJ01AB1234)</option>
                    <option>Alto 800 (GJ01AB5678)</option>
                  </select>
                </div>
              </div>
              <div>
                <div className="field-label" style={{ marginBottom: 6 }}>Available Seats</div>
                <div className="input-shell"><input type="number" min="1" max="4" value={form.seats} onChange={e => set('seats', +e.target.value)} /></div>
              </div>
              <div>
                <div className="field-label" style={{ marginBottom: 6 }}>Price / Seat (₹)</div>
                <div className="input-shell">
                  <span style={{ fontWeight: 700, color: 'var(--brand)' }}>₹</span>
                  <input type="number" min="0" value={form.price} onChange={e => set('price', +e.target.value)} />
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-ghost" onClick={() => setStep(1)}>← Back</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setStep(3)}>Review <ChevronRight size={16} /></button>
            </div>
          </div>
        )}

        {/* ── Step 3: Review ── */}
        {step === 3 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {/* Map */}
            <div className="card">
              <p className="section-label">Your Route on Map</p>
              <RouteMap from={form.from} to={form.to} height="300px" />
            </div>

            {/* Summary + publish */}
            <div className="card">
              <p className="section-label">Summary</p>

              <div className="route-visual" style={{ marginBottom: 20 }}>
                <div className="route-dots">
                  <div className="dot-from" />
                  <div className="dot-line" style={{ minHeight: 36 }} />
                  <div className="dot-to" />
                </div>
                <div className="route-labels">
                  <div><div className="route-label-sub">From</div><div className="route-label-from">{form.from || '—'}</div></div>
                  <div><div className="route-label-sub">To</div><div className="route-label-to">{form.to || '—'}</div></div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
                {[{ k: 'Date', v: form.date || '—' }, { k: 'Time', v: form.time || '—' }, { k: 'Seats', v: form.seats }, { k: 'Price/Seat', v: `₹${form.price}` }].map(({ k, v }) => (
                  <div key={k} style={{ background: 'var(--bg-elevated)', borderRadius: 8, padding: '10px 12px' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>{k}</div>
                    <div style={{ fontWeight: 800, fontSize: '0.92rem' }}>{v}</div>
                  </div>
                ))}
              </div>

              <div style={{ padding: '12px 14px', background: 'var(--accent-dim)', borderRadius: 10, marginBottom: 18, fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 600 }}>
                ✓ ₹{form.price} / seat · {form.seats} seats available
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={() => alert('Ride published!')}>
                  Publish Ride
                </button>
                <button className="btn btn-ghost" style={{ width: '100%' }} onClick={() => setStep(2)}>← Edit Details</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
