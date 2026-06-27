const API_PLACEHOLDER = '___API_PLACEHOLDER___';
export const API_GATEWAY_URL = API_PLACEHOLDER.includes('API_PLACEHOLDER') ? 'http://localhost:8000' : API_PLACEHOLDER;

export const API_URLS = {
  users: '/api/users',
  books: '/api/books',
  sse: '/api/sse',
  authLogin: '/api/auth/login',
  authLogout: '/api/auth/logout',
};
