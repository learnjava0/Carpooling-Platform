// AuthLayout is now handled inline in Login/Register pages.
// This stub exists to avoid breaking any lingering imports.
import { CarFront } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

function AuthLayout({ children, eyebrow, title }) {
  return (
    <main className="auth-page">
      <div className="auth-shell">
        <div className="auth-logo-row">
          <div className="brand-logo">
            <div className="brand-mark"><CarFront size={18} /></div>
            <div><strong>Carpooling</strong></div>
          </div>
          <ThemeToggle />
        </div>
        <div className="auth-card">
          {eyebrow && <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--brand)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{eyebrow}</p>}
          {title && <h1 className="auth-title">{title}</h1>}
          {children}
        </div>
      </div>
    </main>
  );
}

export default AuthLayout;
