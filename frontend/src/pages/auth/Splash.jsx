import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';
import Logo from '../../components/Logo';
import { useAuth } from '../../hooks/useAuth';

function Splash() {
  const navigate = useNavigate();
  const { isAuthenticated, isBootstrapping } = useAuth();

  useEffect(() => {
    if (isBootstrapping) return undefined;

    const timer = window.setTimeout(() => {
      navigate(isAuthenticated ? '/dashboard' : '/login', { replace: true });
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [isAuthenticated, isBootstrapping, navigate]);

  return (
    <main className="splash-page">
      <section className="splash-card" aria-label="Carpooling splash screen">
        <Logo />
        <div className="road-scene" aria-hidden="true">
          <div className="cloud cloud-left" />
          <div className="cloud cloud-right" />
          <div className="car">
            <div className="car-top">
              <span />
              <span />
              <span />
            </div>
            <div className="car-body">
              <span />
              <span />
            </div>
            <div className="wheel wheel-left" />
            <div className="wheel wheel-right" />
          </div>
          <div className="road">
            <span />
            <span />
            <span />
          </div>
        </div>
        <h1>
          Ride Together
          <span>Save Together</span>
        </h1>
        <Loader label="Starting your journey" />
      </section>
    </main>
  );
}

export default Splash;
