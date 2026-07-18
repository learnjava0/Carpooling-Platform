import DashboardLayout from '../../layouts/DashboardLayout';
import { Users, Car, Map, IndianRupee, Leaf, MapPin, TrendingUp, AlertTriangle } from 'lucide-react';

function AdminDashboard() {
  const stats = [
    { title: 'Total Employees', value: '1,248', icon: Users, color: '#3b82f6', bg: '#dbeafe' },
    { title: 'Active Vehicles', value: '432', icon: Car, color: '#f59e0b', bg: '#fef3c7' },
    { title: 'Total Trips Month', value: '3,842', icon: Map, color: '#8b5cf6', bg: '#ede9fe' },
    { title: 'CO₂ Saved (kg)', value: '12,450', icon: Leaf, color: '#10b981', bg: '#d1fae5' },
    { title: 'Total Revenue', value: '₹4.2L', icon: IndianRupee, color: '#ef4444', bg: '#fee2e2' },
  ];

  return (
    <DashboardLayout title="Company Admin Dashboard">
      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {stats.map(s => (
          <div key={s.title} className="erp-card" style={{ marginBottom: 0, display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <s.icon size={24} color={s.color} />
            </div>
            <div>
              <p style={{ margin: '0 0 4px', fontSize: '0.85rem', color: 'var(--muted)', fontWeight: 600 }}>{s.title}</p>
              <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>{s.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* Recent Reports / Issues */}
        <div className="erp-card">
          <div className="erp-card-header">
            <h3 className="erp-card-title">Recent Employee Reports</h3>
            <button className="secondary-button" style={{ padding: '6px 16px', minHeight: 'auto', fontSize: '0.85rem' }}>View All</button>
          </div>
          
          <div className="table-responsive">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Issue Type</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem' }}>S</div>
                      <span style={{ fontWeight: 600 }}>Sneha Patel</span>
                    </div>
                  </td>
                  <td>Driver Did Not Show</td>
                  <td>Today, 10:20 AM</td>
                  <td><span className="badge badge-warning">Pending</span></td>
                </tr>
                <tr>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem', color: '#64748b' }}>V</div>
                      <span style={{ fontWeight: 600 }}>Vikram Singh</span>
                    </div>
                  </td>
                  <td>Payment Failed</td>
                  <td>Yesterday</td>
                  <td><span className="badge badge-success">Resolved</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Routes */}
        <div className="erp-card">
          <div className="erp-card-header">
            <h3 className="erp-card-title">Popular Routes</h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px', background: 'var(--bg-soft)', borderRadius: '12px' }}>
              <TrendingUp size={24} color="var(--accent)" />
              <div style={{ flex: 1 }}>
                <p style={{ margin: '0 0 4px', fontWeight: 600, fontSize: '0.9rem' }}>HSR Layout → Office</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--muted)' }}>145 rides this week</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px', background: 'var(--bg-soft)', borderRadius: '12px' }}>
              <TrendingUp size={24} color="#3b82f6" />
              <div style={{ flex: 1 }}>
                <p style={{ margin: '0 0 4px', fontWeight: 600, fontSize: '0.9rem' }}>Whitefield → Office</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--muted)' }}>98 rides this week</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px', background: 'var(--bg-soft)', borderRadius: '12px' }}>
              <TrendingUp size={24} color="#8b5cf6" />
              <div style={{ flex: 1 }}>
                <p style={{ margin: '0 0 4px', fontWeight: 600, fontSize: '0.9rem' }}>Indiranagar → Office</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--muted)' }}>64 rides this week</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

export default AdminDashboard;
