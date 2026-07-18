import { useCallback, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/authService';
import {
  clearStorage,
  getAccessToken,
  getUser,
  saveTokens,
  saveUser,
} from '../utils/storage';
import { AuthContext } from './AuthContextValue';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getUser());
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const logout = useCallback(() => {
    clearStorage();
    setUser(null);
  }, []);

  const persistSession = useCallback((session) => {
    saveTokens(session);          // accepts { accessToken } or { token }
    saveUser(session.user);
    setUser(session.user);
  }, []);

  const login = useCallback(
    async (credentials) => {
      const session = await authService.login(credentials);
      persistSession(session);
      return session;
    },
    [persistSession],
  );

  /**
   * Register auto-logs user in (backend returns token on register).
   * We persist the session so they don't need to log in again.
   */
  const register = useCallback(
    async (payload) => {
      const session = await authService.register(payload);
      persistSession(session);
      return session;
    },
    [persistSession],
  );

  const getCurrentUser = useCallback(async () => {
    const currentUser = await authService.getCurrentUser();
    saveUser(currentUser);
    setUser(currentUser);
    return currentUser;
  }, []);

  useEffect(() => {
    const bootstrap = async () => {
      const token = getAccessToken();

      if (!token) {
        setIsBootstrapping(false);
        return;
      }

      try {
        // Try to restore user from localStorage (no /me endpoint in this backend)
        await getCurrentUser();
      } catch {
        // Token may be stale — clear and go to login
        logout();
      } finally {
        setIsBootstrapping(false);
      }
    };

    bootstrap();

    window.addEventListener('auth:logout', logout);
    return () => window.removeEventListener('auth:logout', logout);
  }, [getCurrentUser, logout]);

  const value = useMemo(
    () => ({
      user,
      role: user?.role || null,           // 'EMPLOYEE' | 'COMPANY_ADMIN' | null
      isAuthenticated: Boolean(user && getAccessToken()),
      isAdmin: user?.role === 'COMPANY_ADMIN',
      isBootstrapping,
      login,
      logout,
      register,
      getCurrentUser,
    }),
    [getCurrentUser, isBootstrapping, login, logout, register, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
