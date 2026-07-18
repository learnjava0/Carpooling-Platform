import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { Mail, Lock, Car, ArrowRight, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect based on role
  if (user) {
    if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
    if (user.role === 'DRIVER') return <Navigate to="/driver" replace />;
    return <Navigate to="/employee" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Backend returns { token, user: { email, role, firstName, ... } }
      const response = await authService.login(email, password);
      login(response.user, response.token);
      
      // The ProtectedRoute in App.jsx or the condition above will handle redirecting now that user is set
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary-500/20 rounded-full blur-[120px] pointer-events-none"></div>
      
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-16 relative z-10 border-r border-slate-200 dark:border-slate-800 bg-white/30 dark:bg-slate-900/30 backdrop-blur-3xl">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-[#171a20] dark:bg-white rounded-xl flex items-center justify-center">
            <Car className="text-white dark:text-[#171a20] w-7 h-7" />
          </div>
          <span className="text-2xl font-bold text-[#171a20] dark:text-white">
            RideConnect
          </span>
        </div>
        
        <div className="space-y-6">
          <h1 className="text-5xl font-bold leading-tight text-slate-900 dark:text-white">
            Your Premium<br/>
            <span className="text-primary-600 dark:text-primary-400">Carpooling</span> Experience.
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md">
            Connect with colleagues, share rides, save costs, and reduce your carbon footprint all in one place.
          </p>
        </div>
        
        <div className="text-sm font-medium text-slate-500">
          &copy; 2026 Odoo Hackathon
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md glass-panel p-8 sm:p-12 rounded-3xl">
          <div className="mb-10 text-center lg:text-left">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-[#171a20] dark:bg-white rounded-xl flex items-center justify-center">
                <Car className="text-white dark:text-[#171a20] w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-[#171a20] dark:text-white">RideConnect</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome Back</h2>
            <p className="text-slate-500 dark:text-slate-400">Enter your credentials to access your account.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-400 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-11"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-11"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3.5 flex items-center justify-center space-x-2 mt-4"
            >
              <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
              {!isLoading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500">
            First time logging in? <a href="/reset-password" className="font-semibold text-primary-600 dark:text-primary-400 hover:underline">Set your password</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
