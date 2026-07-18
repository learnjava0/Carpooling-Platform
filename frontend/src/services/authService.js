<<<<<<< HEAD
import axios from 'axios';

const BASE = 'http://localhost:8080/api';

/**
 * Normalise the backend AuthResponse shape { token, user }
 * into the shape the AuthContext expects: { accessToken, user }
 */
function normalise(data) {
  return {
    accessToken: data.token,
    refreshToken: null,        // Backend issues single long-lived JWT — no refresh endpoint
    user: data.user,           // { id, firstName, lastName, email, phoneNumber, role, companyName }
  };
}

export const authService = {
  async login(credentials) {
    const { data } = await axios.post(`${BASE}/auth/login`, {
      email: credentials.email,
      password: credentials.password,
    });
    return normalise(data);
  },

  async register(payload) {
    const { data } = await axios.post(`${BASE}/auth/register`, {
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      password: payload.password,
      phoneNumber: payload.phone,       // register form uses "phone", backend uses "phoneNumber"
    });
    // On success backend returns AuthResponse — user is auto-logged-in
    return normalise(data);
  },

  /**
   * Backend issues a single 24h JWT so there is no refresh endpoint.
   * If the token has expired the user must log in again.
   */
  async refreshToken() {
    throw new Error('No refresh endpoint — user must re-login.');
  },

  /**
   * Decode the stored user from localStorage (set during login/register).
   * The backend has no /me endpoint so we rebuild from what we saved.
   */
  async getCurrentUser() {
    const raw = localStorage.getItem('user');
    if (!raw) throw new Error('No stored user');
    return JSON.parse(raw);
  },
=======
import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  registerEmployee: async (employeeData) => {
    const response = await api.post('/auth/register', employeeData);
    return response.data;
  },

  resetPassword: async (email, oldPassword, newPassword) => {
    const response = await api.put('/users/reset-password', {
      email,
      oldPassword,
      newPassword
    });
    return response.data;
  }
>>>>>>> origin/backend_carpooling
};
