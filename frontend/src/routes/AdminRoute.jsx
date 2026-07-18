import { Navigate, useLocation } from 'react-router-dom';
import Loader from '../components/Loader';
import { useAuth } from '../hooks/useAuth';

/**
 * AdminRoute — grants access only to COMPANY_ADMIN users.
 * If not authenticated → /login
 * If authenticated but not admin → /dashboard (forbidden)
 */
function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, isBootstrapping } = useAuth();
  const location = useLocation();

  if (isBootstrapping) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <Loader label="Checking permissions..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  if (!isAdmin) {
    return <Navigate replace to="/dashboard" />;
  }

  return children;
}

export default AdminRoute;
