import { Navigate, Route, Routes } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Splash from './pages/auth/Splash';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';
import Dashboard from './pages/dashboard/Dashboard';
import FindRide from './pages/ride/FindRide';
import RouteConfirmation from './pages/ride/RouteConfirmation';
import AvailableRides from './pages/ride/AvailableRides';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/splash" element={<Splash />} />
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
      
      {/* Protected Phase 1 & 2 Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/find-ride"
        element={
          <ProtectedRoute>
            <FindRide />
          </ProtectedRoute>
        }
      />
      <Route
        path="/route-confirmation"
        element={
          <ProtectedRoute>
            <RouteConfirmation />
          </ProtectedRoute>
        }
      />
      <Route
        path="/available-rides"
        element={
          <ProtectedRoute>
            <AvailableRides />
          </ProtectedRoute>
        }
      />

      {/* Placeholder for Offer Ride (Phase 3) */}
      <Route
        path="/offer-ride"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
}

export default App;
