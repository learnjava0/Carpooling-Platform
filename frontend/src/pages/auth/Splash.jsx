import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function Splash() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isBootstrapping } = useAuth();

  useEffect(() => {
    if (isBootstrapping) return undefined;

    // Immediately navigate to the next page or fallback
    if (location.state?.next) {
      navigate(location.state.next, { replace: true });
    } else {
      navigate(isAuthenticated ? '/dashboard' : '/login', { replace: true });
    }
  }, [isAuthenticated, isBootstrapping, navigate, location]);

  return null;
}

export default Splash;
