import { useCallback, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/authService';
import {
  clearStorage,
  getAccessToken,
  getRefreshToken,
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
    saveTokens(session);
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

  const register = useCallback(async (payload) => authService.register(payload), []);

  const refreshToken = useCallback(async () => {
    const storedRefreshToken = getRefreshToken();

    if (!storedRefreshToken) return null;

    const session = await authService.refreshToken(storedRefreshToken);
    saveTokens(session);

    if (session.user) {
      saveUser(session.user);
      setUser(session.user);
    }

    return session;
  }, []);

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
        await getCurrentUser();
      } catch {
        try {
          await refreshToken();
          await getCurrentUser();
        } catch {
          logout();
        }
      } finally {
        setIsBootstrapping(false);
      }
    };

    bootstrap();

    window.addEventListener('auth:logout', logout);
    return () => window.removeEventListener('auth:logout', logout);
  }, [getCurrentUser, logout, refreshToken]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user && getAccessToken()),
      isBootstrapping,
      login,
      logout,
      register,
      refreshToken,
      getCurrentUser,
    }),
    [getCurrentUser, isBootstrapping, login, logout, refreshToken, register, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
