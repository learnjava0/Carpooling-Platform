import { CircleUserRound, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

function AuthLayout({ children, eyebrow, title }) {
  return (
    <main className="auth-page">
      <section className="browser-card" aria-labelledby="auth-title">
        <header className="browser-header">
          <Logo compact />
          <div className="header-right">
            <span>Welcome</span>
            <Sparkles size={16} aria-hidden="true" />
          </div>
        </header>

        <div className="auth-frame">
          <aside className="auth-rail">
            <Link to="/login">{title}</Link>
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
