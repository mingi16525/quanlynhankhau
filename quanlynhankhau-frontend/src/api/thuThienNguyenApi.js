
import apiClient from './apiClient';

const thuThienNguyenApi = {
  // Lấy tất cả
  getAll: () => apiClient.get('/thuthiennguyen'),

  // Lấy theo ID
  getById: (id) => apiClient.get(`/thuthiennguyen/${id}`),

  // Lấy theo hoạt động
  getByHoatDong: (hoatDongId) => apiClient.get(`/thuthiennguyen/hoatdong/${hoatDongId}`),

  // Tạo mới
  create: (data) => apiClient.post('/thuthiennguyen', data),

  // Cập nhật
  update: (id, data) => apiClient.put(`/thuthiennguyen/${id}`, data),

  // Xóa
  delete: (id) => apiClient.delete(`/thuthiennguyen/${id}`),

  // Tìm kiếm
  search: (keyword) => apiClient.get('/thuthiennguyen/search', { params: { keyword } }),

  // Tìm theo khoảng thời gian
  getByDateRange: (startDate, endDate) =>
    apiClient.get('/thuthiennguyen/daterange', { params: { start: startDate, end: endDate } })
};

export default thuThienNguyenApi;