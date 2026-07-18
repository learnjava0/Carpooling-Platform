import { Users, Car, Map, IndianRupee, Leaf, TrendingUp } from 'lucide-react';
import AppShell from '../../layouts/AppShell';

const stats = [
  { label: 'Total Employees', value: '1,248', icon: Users, color: 'var(--blue)', bg: 'var(--blue-dim)' },
  { label: 'Active Vehicles', value: '432', icon: Car, color: 'var(--brand)', bg: 'var(--brand-dim)' },
  { label: 'Trips This Month', value: '3,842', icon: Map, color: 'var(--purple)', bg: 'var(--purple-dim)' },
  { label: 'CO₂ Saved (kg)', value: '12,450', icon: Leaf, color: 'var(--accent)', bg: 'var(--accent-dim)' },
  { label: 'Total Revenue', value: '₹4.2L', icon: IndianRupee, color: 'var(--danger)', bg: 'var(--danger-dim)' },
  { label: 'Participation', value: '76%', icon: TrendingUp, color: 'var(--brand)', bg: 'var(--brand-dim)' },
];

const reports = [
  { emp: 'Sneha Patel', issue: 'Driver Did Not Show', date: 'Today, 10:20 AM', status: 'Pending' },
  { emp: 'Vikram Singh', issue: 'Payment Failed', date: 'Yesterday', status: 'Resolved' },
  { emp: 'Aayesha Patel', issue: 'Late Pickup', date: '16 Jul', status: 'Reviewing' },
];

const routes = [
  { name: 'ISKCON → Infinity', rides: 145, change: '+12%' },
  { name: 'Satellite → GIFT City', rides: 98, change: '+5%' },
  { name: 'Bopal → SG Highway', rides: 64, change: '-3%' },
];

export default function AdminDashboard() {
  return (
    <AppShell title="Admin Dashboard">
      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
        {stats.map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{ background: s.bg }}><s.icon size={20} color={s.color} /></div>
            <div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        {/* Reports table */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Employee Reports</span>
            <button className="btn btn-ghost btn-sm">View All</button>
          </div>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Issue</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {reports.map(r => (
                  <tr key={r.emp}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="user-avatar" style={{ width: 30, height: 30, fontSize: '0.75rem' }}>{r.emp[0]}</div>
                        <span style={{ fontWeight: 600 }}>{r.emp}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-2)' }}>{r.issue}</td>
                    <td style={{ color: 'var(--text-3)', fontSize: '0.8rem' }}>{r.date}</td>
                    <td>
                      <span className={`badge ${r.status === 'Resolved' ? 'badge-green' : r.status === 'Pending' ? 'badge-yellow' : 'badge-blue'}`}>
                        {r.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-ghost btn-sm">Review</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Popular routes */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Popular Routes</span>
          </div>
          {routes.map((r, i) => (
            <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < routes.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--brand-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <TrendingUp size={15} color="var(--brand)" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.87rem' }}>{r.name}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-3)', marginTop: 2 }}>{r.rides} rides this week</div>
              </div>
              <span className={`badge ${r.change.startsWith('+') ? 'badge-green' : 'badge-red'}`}>{r.change}</span>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
