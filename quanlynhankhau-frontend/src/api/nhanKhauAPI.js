import apiClient from './apiClient';

const nhanKhauApi = {
  // Lấy tất cả nhân khẩu
  getAll: () => apiClient.get('/nhankhau'),

  // Lấy theo ID
  getById: (id) => apiClient.get(`/nhankhau/${id}`),

  // Tạo mới
  create: (data) => apiClient.post('/nhankhau', data),

  // Cập nhật
  update: (id, data) => apiClient.put(`/nhankhau/${id}`, data),

  // Xóa
  delete: (id) => apiClient.delete(`/nhankhau/${id}`),

  // Tìm kiếm
  search: (keyword) => apiClient.get('/nhankhau/search', { params: { keyword } }),

  // Lấy nhân khẩu chưa có hộ khẩu (available)
  getAvailable: () => apiClient.get('/nhankhau/available')
};

export default nhanKhauApi;
