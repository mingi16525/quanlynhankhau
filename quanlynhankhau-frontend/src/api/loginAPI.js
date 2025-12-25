import apiClient from './apiClient';

const loginApi = {
  // Đăng nhập
  login: (credentials) => apiClient.post('/auth/login', credentials)
};

export default loginApi;