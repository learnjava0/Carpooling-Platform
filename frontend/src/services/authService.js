export const authService = {
  async login(credentials) {
    // Hardcoded dev bypass for the hackathon
    // Accept any credentials or a specific hardcoded check if preferred.
    // For now, let's just accept any and return a mock active user to avoid network errors.
    if (credentials.email && credentials.password) {
      return {
        accessToken: 'mock_access_token_123',
        refreshToken: 'mock_refresh_token_123',
        user: {
          id: 'user_1',
          firstName: 'Demo',
          lastName: 'User',
          email: credentials.email,
        }
      };
    }
    throw new Error("Invalid username or password");
  },

  async register() {
    return {
      message: 'Registration successful via mock.'
    };
  },

  async refreshToken() {
    return {
      accessToken: 'mock_access_token_123',
      refreshToken: 'mock_refresh_token_123',
    };
  },

  async getCurrentUser() {
    return {
      id: 'user_1',
      firstName: 'Demo',
      lastName: 'User',
      email: 'demo@example.com',
    };
  },
};
