import { User, Bell, Shield, HelpCircle, LogOut, ChevronRight } from 'lucide-react';
import AppShell from '../../layouts/AppShell';
import { useAuth } from '../../hooks/useAuth';

const sections = [
  { title: 'Account', items: [
    { icon: User,      label: 'Edit Profile',      sub: 'Name, photo, contact details' },
    { icon: Bell,      label: 'Notifications',     sub: 'Ride and payment alerts' },
    { icon: Shield,    label: 'Privacy & Security', sub: 'Password, 2FA, data settings' },
  ]},
  { title: 'Support', items: [
    { icon: HelpCircle, label: 'Help Center', sub: 'FAQs and support articles' },
  ]},
];

export default function Settings() {
  const { user, isAdmin, logout } = useAuth();

  const roleBadge = isAdmin ? 'Company Admin' : 'Employee';
  const roleCls   = isAdmin ? 'badge-blue'   : 'badge-green';

  return (
    <AppShell title="Settings">
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24, alignItems: 'start' }}>
        {/* Profile */}
        <div>
          <div className="card" style={{ textAlign: 'center', marginBottom: 16 }}>
            <div className="user-avatar" style={{ width: 60, height: 60, fontSize: '1.4rem', margin: '0 auto 12px' }}>
              {user?.firstName?.[0] || 'U'}
            </div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>
              {user?.firstName || 'User'} {user?.lastName || ''}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-3)', margin: '3px 0 4px' }}>
              {user?.email || ''}
            </div>
            {user?.phoneNumber && (
              <div style={{ fontSize: '0.78rem', color: 'var(--text-3)', marginBottom: 10 }}>
                {user.phoneNumber}
              </div>
            )}
            <span className={`badge ${roleCls}`}>{roleBadge}</span>
            {user?.companyName && (
              <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: 8 }}>
                🏢 {user.companyName}
              </div>
            )}
          </div>

          <button className="btn btn-danger btn-full" onClick={logout}>
            <LogOut size={15} /> Sign Out
          </button>
        </div>

        {/* Settings sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {sections.map((s) => (
            <div key={s.title} className="card">
              <p className="section-label">{s.title}</p>
              {s.items.map((item, i) => (
                <div
                  key={item.label}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '12px 0',
                    borderBottom: i < s.items.length - 1 ? '1px solid var(--border)' : 'none',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <item.icon size={16} color="var(--text-2)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{item.label}</div>
                    <div style={{ fontSize: '0.73rem', color: 'var(--text-3)' }}>{item.sub}</div>
                  </div>
                  <ChevronRight size={15} color="var(--text-3)" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
