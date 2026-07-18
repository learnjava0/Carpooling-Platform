import { LogOut } from 'lucide-react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Logo from './components/Logo';
import { useAuth } from './hooks/useAuth';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Splash from './pages/auth/Splash';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPlaceholder />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
}

function DashboardPlaceholder() {
  const { logout, user } = useAuth();

  return (
    <main className="dashboard-page">
      <nav className="dashboard-nav">
        <Logo />
        <button className="secondary-button" type="button" onClick={logout}>
          <LogOut size={16} aria-hidden="true" />
          Logout
        </button>
      </nav>
      <section className="dashboard-card">
        <p className="eyebrow">Authentication Complete</p>
        <h1>Welcome{user?.firstName ? `, ${user.firstName}` : ''}</h1>
        <p>
          You are signed in. The protected dashboard route is ready for the next
          frontend module.
        </p>
      </section>
    </main>
  );
}

export default App;
