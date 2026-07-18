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
            <span>Welcome</span>
            <ThemeToggle />
            <Sparkles size={16} aria-hidden="true" />
          </div>
        </header>

        <div className={`auth-frame ${isRegister ? 'auth-frame-register' : ''}`}>
          <aside className="auth-art" aria-label="Carpooling onboarding illustration">
            <Link className="back-home" to="/">
              <ArrowLeft size={16} />
              Back to home
            </Link>
            <div>
              <p className="eyebrow">Fast shared rides</p>
              <h2>
                {isRegister
                  ? 'Start commuting with verified coworkers.'
                  : 'Your office ride is a few taps away.'}
              </h2>
              <p>
                Match with trusted riders nearby, split travel costs, and keep your
                everyday route predictable.
              </p>
            </div>
            <div className="mini-map-card">
              <Route size={20} />
              <div>
                <strong>Live route matching</strong>
                <span>Pickup, seats, timing and driver details in one clean flow.</span>
              </div>
            </div>
          </aside>
          <section className="auth-content">
            <div className="auth-heading">
              <p>{eyebrow}</p>
              <CircleUserRound size={28} aria-hidden="true" />
            </div>
            <h1 id="auth-title">{title}</h1>
            {children}
          </section>
        </div>
      </section>
    </main>
  );
}

export default AuthLayout;
