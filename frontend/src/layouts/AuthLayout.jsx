import { ArrowLeft, CircleUserRound, Route, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import ThemeToggle from '../components/ThemeToggle';

function AuthLayout({ children, eyebrow, title }) {
  const isRegister = title.toLowerCase().includes('sign');

  return (
    <main className="auth-page">
      <section className="auth-shell" aria-labelledby="auth-title">
        <header className="auth-topbar">
          <Logo compact />
          <div className="topbar-actions">
            <ThemeToggle />
          </div>
        </header>

        <div className={`auth-frame ${isRegister ? 'auth-frame-register' : ''}`}>
          <section className="auth-content" style={{ padding: '64px 48px' }}>
            <h1 id="auth-title" style={{ fontSize: '2.5rem', marginBottom: '8px', letterSpacing: '-1px' }}>{title}</h1>
            {children}
          </section>
          
          {/* Abstract Art Side */}
          <aside className="auth-art" aria-label="Carpooling onboarding illustration">
            <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
              <div style={{ 
                width: '100px', height: '100px', 
                background: 'var(--panel-solid)', 
                borderRadius: '50%', 
                margin: '0 auto 24px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: 'var(--shadow)'
              }}>
                <Route size={40} color="var(--brand)" />
              </div>
              <h2 style={{ fontSize: '1.8rem', color: 'var(--text)' }}>
                {isRegister
                  ? 'Start commuting smarter.'
                  : 'Welcome to the future of commute.'}
              </h2>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default AuthLayout;
