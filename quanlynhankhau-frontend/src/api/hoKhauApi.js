import apiClient from './apiClient';

const hoKhauApi = {
  // Lấy tất cả hộ khẩu
  getAll: () => apiClient.get('/hokhau'),

  // Lấy theo ID
  getById: (id) => apiClient.get(`/hokhau/${id}`),

  // Tạo mới
  create: (data) => apiClient.post('/hokhau', data),

  // Cập nhật
  update: (id, data) => apiClient.put(`/hokhau/${id}`, data),

  // Xóa
  delete: (id) => apiClient.delete(`/hokhau/${id}`),

  // Tìm kiếm
  search: (keyword) => apiClient.get('/hokhau/search', { params: { keyword } })
};

export default hoKhauApi;
