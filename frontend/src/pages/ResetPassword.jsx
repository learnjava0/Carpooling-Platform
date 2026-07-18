import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { Lock, Mail, ArrowRight, CheckCircle2, AlertCircle, Key } from 'lucide-react';

const ResetPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleRequestToken = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await authService.forgotPassword(email);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request reset token.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await authService.resetPassword(token, newPassword);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Invalid or expired token.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4 relative overflow-hidden">
      <div className="absolute top-[10%] right-[10%] w-[30%] h-[30%] bg-primary-500/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] left-[10%] w-[30%] h-[30%] bg-secondary-500/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md glass-panel p-8 sm:p-10 rounded-3xl relative z-10">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-xl mb-4">
            {step === 1 ? <Mail className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {step === 1 ? 'Forgot Password' : 'Reset Password'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {step === 1 ? 'Enter your email to receive a password reset token.' : 'Enter your reset token and your new password.'}
          </p>
        </div>

        {success ? (
          <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-xl text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto" />
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">Password Updated!</h3>
            <p className="text-sm text-green-600 dark:text-green-400">Redirecting you to login...</p>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                <p className="text-sm text-red-700 dark:text-red-400 font-medium">{error}</p>
              </div>
            )}

            {step === 1 ? (
              <form onSubmit={handleRequestToken} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field pl-10 text-sm py-2.5"
                      placeholder="name@company.com"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full py-3 flex items-center justify-center space-x-2 mt-4"
                >
                  <span>{isLoading ? 'Sending...' : 'Request Token'}</span>
                  {!isLoading && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Reset Token</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Key className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      className="input-field pl-10 text-sm py-2.5"
                      placeholder="Enter token from console/email"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="input-field pl-10 text-sm py-2.5"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full py-3 flex items-center justify-center space-x-2 mt-4"
                >
                  <span>{isLoading ? 'Updating...' : 'Update Password'}</span>
                  {!isLoading && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
            )}
          </>
        )}
        
        <div className="mt-8 text-center text-sm text-slate-500">
          <a href="/login" className="font-medium text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors">
            &larr; Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
