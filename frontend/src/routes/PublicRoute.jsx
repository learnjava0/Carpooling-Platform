import { Navigate } from 'react-router-dom';
import Loader from '../components/Loader';
import { useAuth } from '../hooks/useAuth';

function PublicRoute({ children }) {
  const { isAuthenticated, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <Loader label="Loading..." />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate replace to="/dashboard" />;
  }

  return children;
}

export default PublicRoute;
