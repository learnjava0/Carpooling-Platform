import { useEffect, useState } from 'react';
import { Users, Car, Map, IndianRupee, Leaf, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';
import AppShell from '../../layouts/AppShell';
import { getAnalyticsDashboard } from '../../services/api';
import Loader from '../../components/Loader';

const mockReports = [
  { emp: 'Sneha Patel',  issue: 'Driver Did Not Show', date: 'Today, 10:20 AM', status: 'Pending' },
  { emp: 'Vikram Singh', issue: 'Payment Failed',      date: 'Yesterday',        status: 'Resolved' },
  { emp: 'Aayesha Patel',issue: 'Late Pickup',         date: '16 Jul',           status: 'Reviewing' },
];

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAnalytics = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAnalyticsDashboard();
      setAnalytics(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAnalytics(); }, []);

  const stats = analytics
    ? [
        {
          label: 'Total Trips',
          value: analytics.totalTrips?.toString() ?? '0',
          icon: Map,
          color: 'var(--purple)',
          bg: 'var(--purple-dim)',
        },
        {
          label: 'Distance Covered',
          value: `${(analytics.totalDistanceTravelledKm ?? 0).toFixed(0)} km`,
          icon: TrendingUp,
          color: 'var(--brand)',
          bg: 'var(--brand-dim)',
        },
        {
          label: 'Fuel Saved (L)',
          value: `${(analytics.estimatedFuelConsumptionLiters ?? 0).toFixed(1)} L`,
          icon: Leaf,
          color: 'var(--accent)',
          bg: 'var(--accent-dim)',
        },
        {
          label: 'Total Cost Saved',
          value: `₹${analytics.totalCostSaved ?? 0}`,
          icon: IndianRupee,
          color: 'var(--danger)',
          bg: 'var(--danger-dim)',
        },
        {
          label: 'Cost / km',
          value: `₹${analytics.costPerKilometer ?? 0}`,
          icon: Car,
          color: 'var(--blue)',
          bg: 'var(--blue-dim)',
        },
        {
          label: 'CO₂ Reduced (kg)',
          value: `${((analytics.estimatedFuelConsumptionLiters ?? 0) * 2.31).toFixed(1)}`,
          icon: Leaf,
          color: 'var(--accent)',
          bg: 'var(--accent-dim)',
        },
      ]
    : [];

  return (
    <AppShell title="Admin Dashboard"
      rightActions={
        <button className="btn btn-ghost btn-sm" onClick={loadAnalytics} disabled={loading}>
          <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh
        </button>
      }
    >
      {/* Analytics header banner */}
      <div style={{ padding: '16px 20px', background: 'var(--brand-dim)', borderRadius: 14, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
        <TrendingUp size={20} color="var(--brand)" />
        <div>
          <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--brand)' }}>Live Analytics Dashboard</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-2)' }}>Real-time data from your company's carpooling activity</div>
        </div>
      </div>

      {/* Stats grid */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
          <Loader label="Loading analytics..." />
        </div>
      ) : error ? (
        <div className="alert alert-error" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <AlertCircle size={16} /> {error}
          <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }} onClick={loadAnalytics}>Retry</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
          {stats.map((s) => (
            <div key={s.label} className="stat-card">
              <div className="stat-icon" style={{ background: s.bg }}>
                <s.icon size={20} color={s.color} />
              </div>
              <div>
                <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

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
                {mockReports.map((r) => (
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

        {/* Summary card */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Quick Summary</span>
          </div>
          {analytics && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Total Carpool Trips',  value: analytics.totalTrips },
                { label: 'Km Covered',           value: `${analytics.totalDistanceTravelledKm?.toFixed(0)} km` },
                { label: 'Fuel Used (est.)',      value: `${analytics.estimatedFuelConsumptionLiters?.toFixed(1)} L` },
                { label: 'Money Saved',           value: `₹${analytics.totalCostSaved}` },
                { label: 'Avg Cost / km',         value: `₹${analytics.costPerKilometer}` },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '0.84rem', color: 'var(--text-2)' }}>{label}</span>
                  <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{value}</span>
                </div>
              ))}
            </div>
          )}
          {!analytics && !loading && (
            <div className="empty-state" style={{ padding: 24 }}>
              <p>No analytics data available yet.</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
