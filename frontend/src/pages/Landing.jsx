import {
  ArrowRight,
  CalendarClock,
  CarTaxiFront,
  MapPin,
  ShieldCheck,
  UsersRound,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import ThemeToggle from '../components/ThemeToggle';

const benefits = [
  {
    icon: <ShieldCheck size={22} />,
    title: 'Verified riders',
    text: 'Company-only access keeps every shared ride trusted and accountable.',
  },
  {
    icon: <CalendarClock size={22} />,
    title: 'Daily commute ready',
    text: 'Find recurring office trips without rebuilding the same route every morning.',
  },
  {
    icon: <UsersRound size={22} />,
    title: 'Split smarter',
    text: 'Share empty seats, reduce fuel costs, and make the commute less lonely.',
  },
];

function Landing() {
  return (
    <main className="landing-page">
      <nav className="landing-nav">
        <Logo />
        <div className="landing-nav-actions">
          <ThemeToggle />
          <Link className="nav-link" to="/login">
            Login
          </Link>
          <Link className="nav-cta" to="/register">
            Sign up
          </Link>
        </div>
      </nav>

      <section className="landing-hero">
        <div className="hero-copy">
          <p className="eyebrow">Corporate carpooling, made simple</p>
          <h1>Ride together. Reach work lighter.</h1>
          <p className="hero-text">
            Book trusted shared rides with coworkers, match by route and timing, and
            keep every commute transparent from pickup to drop.
          </p>

          <div className="hero-actions">
            <Link className="primary-button hero-button" to="/register">
              Create account <ArrowRight size={18} />
            </Link>
            <Link className="secondary-button hero-secondary" to="/login">
              I already have an account
            </Link>
          </div>

          <div className="trust-row" aria-label="Platform highlights">
            <span>4.8 rider rating</span>
            <span>Office route matching</span>
            <span>Secure employee login</span>
          </div>
        </div>

        <div className="hero-visual" aria-label="Car service route preview">
          <div className="route-card">
            <div className="route-card-header">
              <span>Today, 8:45 AM</span>
              <strong>₹86 saved</strong>
            </div>
            <div className="route-line">
              <span className="route-dot route-dot-start" />
              <span className="route-track" />
              <span className="route-dot route-dot-end" />
            </div>
            <div className="route-stops">
              <div>
                <small>Pickup</small>
                <strong>Indiranagar Metro Gate 2</strong>
              </div>
              <div>
                <small>Drop</small>
                <strong>Manyata Tech Park</strong>
              </div>
            </div>
            <div className="driver-pill">
              <CarTaxiFront size={18} />
              <span>2 seats available nearby</span>
            </div>
          </div>

          <div className="car-illustration">
            <div className="car-window" />
            <div className="car-light car-light-left" />
            <div className="car-light car-light-right" />
            <div className="car-wheel car-wheel-left" />
            <div className="car-wheel car-wheel-right" />
          </div>

          <div className="zip-card">
            <MapPin size={18} />
            <span>Enter pickup area</span>
            <button type="button" aria-label="Search pickup area">
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      <section className="benefit-grid" aria-label="Why choose Carpooling">
        {benefits.map(({ icon, title, text }) => (
          <article className="benefit-card" key={title}>
            {icon}
            <h2>{title}</h2>
            <p>{text}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

export default Landing;
