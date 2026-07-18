import { Calendar } from 'lucide-react';
import AppShell from '../../layouts/AppShell';

const history = [
  { id: 1, from: 'ISKCON', to: 'Infinity', date: '18 Jul 2026, 01:00 PM', fare: 120, driver: 'Raj Patel', status: 'completed' },
  { id: 2, from: 'ISKCON', to: 'Abbey', date: '17 Jul 2026, 04:00 AM', fare: 120, driver: 'Krishna Singh', status: 'completed' },
  { id: 3, from: 'Satellite', to: 'GIFT City', date: '15 Jul 2026, 09:00 AM', fare: 80, driver: 'Sneha Mehta', status: 'completed' },
];

export default function RideHistory() {
  return (
    <AppShell title="Ride History">
      <div className="card">
        <div className="card-header">
          <span className="card-title">All Rides</span>
          <span className="badge badge-muted">{history.length} trips</span>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Route</th>
              <th>Driver</th>
              <th>Date</th>
              <th>Fare</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map(r => (
              <tr key={r.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div className="dot-from" style={{ flexShrink: 0 }} />
                    <span style={{ fontWeight: 600 }}>{r.from}</span>
                    <span style={{ color: 'var(--text-3)' }}>→</span>
                    <span style={{ fontWeight: 600 }}>{r.to}</span>
                  </div>
                </td>
                <td style={{ color: 'var(--text-2)' }}>{r.driver}</td>
                <td style={{ color: 'var(--text-3)', fontSize: '0.8rem' }}>{r.date}</td>
                <td style={{ fontWeight: 800, color: 'var(--brand)' }}>₹{r.fare}</td>
                <td><span className="badge badge-muted">{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
