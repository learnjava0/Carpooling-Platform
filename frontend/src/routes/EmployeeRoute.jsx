import { Navigate, useLocation } from 'react-router-dom';
import Loader from '../components/Loader';
import { useAuth } from '../hooks/useAuth';

/**
 * EmployeeRoute — grants access only to regular EMPLOYEE users.
 * If not authenticated, redirects to /login
 * If authenticated but user is admin, redirects to /admin
 */
function EmployeeRoute({ children }) {
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

  // If they are an admin trying to access an employee route, redirect them to the admin hub
  if (isAdmin) {
    return <Navigate replace to="/admin" />;
  }

  return children;
}

export default EmployeeRoute;
