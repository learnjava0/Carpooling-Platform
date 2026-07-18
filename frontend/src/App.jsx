import { Navigate, Route, Routes } from 'react-router-dom';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Splash from './pages/auth/Splash';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';
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

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate replace to="/dashboard" />} />
      <Route path="/splash" element={<Splash />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      {/* Protected */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/find-ride" element={<ProtectedRoute><FindRide /></ProtectedRoute>} />
      <Route path="/route-confirmation" element={<ProtectedRoute><RouteConfirmation /></ProtectedRoute>} />
      <Route path="/available-rides" element={<ProtectedRoute><AvailableRides /></ProtectedRoute>} />
      <Route path="/offer-ride" element={<ProtectedRoute><OfferRide /></ProtectedRoute>} />
      <Route path="/trips" element={<ProtectedRoute><MyTrips /></ProtectedRoute>} />
      <Route path="/ride-history" element={<ProtectedRoute><RideHistory /></ProtectedRoute>} />
      <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
      <Route path="/vehicles" element={<ProtectedRoute><MyVehicles /></ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

      <Route path="*" element={<Navigate replace to="/dashboard" />} />
    </Routes>
  );
}

export default App;
