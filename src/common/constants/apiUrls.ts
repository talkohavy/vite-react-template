const API_PLACEHOLDER = '___API_PLACEHOLDER___';
export const API_GATEWAY_URL = API_PLACEHOLDER.includes('API_PLACEHOLDER') ? 'http://localhost:8000' : API_PLACEHOLDER;

export const API_URLS = {
  users: '/api/users',
  books: '/api/books',
  sse: '/api/sse',
  sseDemoTopics: '/api/sse-demo/topics',
  sseDemoJoinTopic: '/api/sse-demo/topics/join',
  sseDemoLeaveTopic: '/api/sse-demo/topics/leave',
  sseDemoSendToTopic: '/api/sse-demo/topics/send',
  sseDemoSendToUser: '/api/sse-demo/users/send',
  getProfile: '/api/users/get-profile',
  authLogin: '/api/auth/login',
  authLogout: '/api/auth/logout',
  authRefresh: '/api/auth/refresh',
};
