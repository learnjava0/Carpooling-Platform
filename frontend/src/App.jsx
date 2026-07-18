<<<<<<< HEAD
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
=======
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import AdminLayout from './pages/admin/AdminLayout';
import DashboardOverview from './pages/admin/DashboardOverview';
import OnboardDriver from './pages/admin/OnboardDriver';
import EmployeeLayout from './pages/employee/EmployeeLayout';
import DiscoverRides from './pages/employee/DiscoverRides';
import MyTrips from './pages/employee/MyTrips';
import ActiveRides from './pages/employee/ActiveRides';
import PublishRide from './pages/employee/PublishRide';
import MyVehicles from './pages/employee/MyVehicles';
import Profile from './pages/employee/Profile';
import LiveTracking from './pages/employee/LiveTracking';
// Placeholders for remaining features
const ManageUsers = () => <div className="p-8"><h1>Manage Users (Coming Soon)</h1></div>;

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  
  return children;
};

const RoleBasedRedirect = () => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  
  switch (user.role) {
    case 'ADMIN':
      return <Navigate to="/admin" replace />;
    case 'EMPLOYEE':
      return <Navigate to="/employee" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RoleBasedRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<DashboardOverview />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="onboard" element={<OnboardDriver />} />
          </Route>
          
          <Route path="/employee" element={
            <ProtectedRoute allowedRoles={['EMPLOYEE']}>
              <EmployeeLayout />
            </ProtectedRoute>
          }>
            <Route index element={<DiscoverRides />} />
            <Route path="trips" element={<MyTrips />} />
            <Route path="active-rides" element={<ActiveRides />} />
            <Route path="publish" element={<PublishRide />} />
            <Route path="vehicles" element={<MyVehicles />} />
            <Route path="profile" element={<Profile />} />
            <Route path="track" element={<LiveTracking />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
>>>>>>> origin/backend_carpooling
  );
}

export default App;
