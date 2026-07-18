/**
 * Storage utility
 * Backend returns a single `token` (JWT). We store it as `accessToken`
 * for compatibility with the axios interceptor. No separate refreshToken
 * is issued by this backend — the JWT itself is long-lived (24h).
 */
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

/**
 * Accept either { token } (backend shape) or { accessToken, refreshToken } (legacy shape).
 */
export const saveTokens = ({ token, accessToken, refreshToken }) => {
  const jwt = token || accessToken;
  if (jwt) localStorage.setItem(ACCESS_TOKEN_KEY, jwt);
  if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

export const saveUser = (user) => {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = () => {
  const storedUser = localStorage.getItem(USER_KEY);
  if (!storedUser) return null;
  try {
    return JSON.parse(storedUser);
  } catch {
    clearStorage();
    return null;
  }
};

export const clearStorage = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};
