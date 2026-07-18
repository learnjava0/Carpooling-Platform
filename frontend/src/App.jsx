import { Navigate, Route, Routes } from 'react-router-dom';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Splash from './pages/auth/Splash';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';
import AdminRoute from './routes/AdminRoute';
import EmployeeRoute from './routes/EmployeeRoute';
import Dashboard from './pages/dashboard/Dashboard';
import FindRide from './pages/ride/FindRide';
import RouteConfirmation from './pages/ride/RouteConfirmation';
import AvailableRides from './pages/ride/AvailableRides';
import OfferRide from './pages/ride/OfferRide';
import MyTrips from './pages/trips/MyTrips';
import RideHistory from './pages/trips/RideHistory';
import Wallet from './pages/wallet/Wallet';
import MyVehicles from './pages/vehicles/MyVehicles';
import Chat from './pages/chat/Chat';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import Settings from './pages/settings/Settings';
import LiveTracking from './pages/tracking/LiveTracking';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate replace to="/login" />} />
      <Route path="/splash" element={<Splash />} />

      {/* Public (unauthenticated) routes */}
      <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      {/* Employee protected routes - ONLY for employees */}
      <Route path="/dashboard"          element={<EmployeeRoute><Dashboard /></EmployeeRoute>} />
      <Route path="/find-ride"          element={<EmployeeRoute><FindRide /></EmployeeRoute>} />
      <Route path="/route-confirmation" element={<EmployeeRoute><RouteConfirmation /></EmployeeRoute>} />
      <Route path="/available-rides"    element={<EmployeeRoute><AvailableRides /></EmployeeRoute>} />
      <Route path="/offer-ride"         element={<EmployeeRoute><OfferRide /></EmployeeRoute>} />
      <Route path="/trips"              element={<EmployeeRoute><MyTrips /></EmployeeRoute>} />
      <Route path="/ride-history"       element={<EmployeeRoute><RideHistory /></EmployeeRoute>} />
      <Route path="/wallet"             element={<EmployeeRoute><Wallet /></EmployeeRoute>} />
      <Route path="/vehicles"           element={<EmployeeRoute><MyVehicles /></EmployeeRoute>} />
      <Route path="/chat"               element={<EmployeeRoute><Chat /></EmployeeRoute>} />
      <Route path="/tracking"           element={<EmployeeRoute><LiveTracking /></EmployeeRoute>} />
      
      {/* Settings is available to both, so we use ProtectedRoute */}
      <Route path="/settings"           element={<ProtectedRoute><Settings /></ProtectedRoute>} />

      {/* Admin-only route — RBAC enforced by AdminRoute */}
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

      <Route path="*" element={<Navigate replace to="/login" />} />
    </Routes>
  );
}

export default App;
