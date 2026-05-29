import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Attach token on every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('ll_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally — only sign out for real token errors, not business-logic 401s
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      const code = err.response?.data?.error?.code;
      // Only sign out if it's a token-level error, not e.g. a QR expired error
      const tokenErrors = ['UNAUTHORIZED', 'TOKEN_EXPIRED', 'INVALID_TOKEN'];
      if (!code || tokenErrors.includes(code)) {
        localStorage.removeItem('ll_token');
        localStorage.removeItem('ll_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;
