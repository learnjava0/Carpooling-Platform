import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import AdminLayout from './pages/admin/AdminLayout';
import DashboardOverview from './pages/admin/DashboardOverview';
import ManageEmployees from './pages/admin/ManageEmployees';
import ManageVehicles from './pages/admin/ManageVehicles';
import PlatformSettings from './pages/admin/PlatformSettings';
import EmployeeLayout from './pages/employee/EmployeeLayout';
import DiscoverRides from './pages/employee/DiscoverRides';
import MyTrips from './pages/employee/MyTrips';
import ActiveRides from './pages/employee/ActiveRides';
import PublishRide from './pages/employee/PublishRide';
import MyVehicles from './pages/employee/MyVehicles';
import Profile from './pages/employee/Profile';
import Settings from './pages/employee/Settings';
import Wallet from './pages/employee/Wallet';
import SavedPlaces from './pages/employee/SavedPlaces';
import Chat from './pages/employee/Chat';
import AdminDashboard from './pages/employee/AdminDashboard';
import LiveTracking from './pages/employee/LiveTracking';
import Analytics from './pages/employee/Analytics';
import SplashScreen from './pages/SplashScreen';
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
          <Route path="/" element={<SplashScreen />} />
          <Route path="/redirect" element={<RoleBasedRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<DashboardOverview />} />
            <Route path="employees" element={<ManageEmployees />} />
            <Route path="vehicles" element={<ManageVehicles />} />
            <Route path="settings" element={<PlatformSettings />} />
          </Route>
          
          <Route path="/employee" element={
            <ProtectedRoute allowedRoles={['EMPLOYEE']}>
              <EmployeeLayout />
            </ProtectedRoute>
          }>
            <Route index element={<DiscoverRides />} />
            <Route path="trips" element={<MyTrips />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="saved-places" element={<SavedPlaces />} />
            <Route path="chat" element={<Chat />} />
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="active-rides" element={<ActiveRides />} />
            <Route path="publish" element={<PublishRide />} />
            <Route path="vehicles" element={<MyVehicles />} />
            <Route path="profile" element={<Profile />} />
            <Route path="track" element={<LiveTracking />} />
            <Route path="settings" element={<Settings />} />
            <Route path="wallet" element={<Wallet />} />
            <Route path="saved-places" element={<SavedPlaces />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
