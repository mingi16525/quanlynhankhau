import apiClient from './apiClient';

const hoatDongThienNguyenApi = {
  // Lấy tất cả
  getAll: () => apiClient.get('/hoatdong'),

  // Lấy theo ID
  getById: (id) => apiClient.get(`/hoatdong/${id}`),

  // Lấy hoạt động đang diễn ra
  getActive: () => apiClient.get('/hoatdong/active'),

  // Lấy theo trạng thái
  getByTrangThai: (trangThai) => apiClient.get(`/hoatdong/trangthai/${trangThai}`),

  // Lấy thống kê
  getThongKe: (id) => apiClient.get(`/hoatdong/${id}/thongke`),

  // Tạo mới
  create: (data) => apiClient.post('/hoatdong', data),

  // Cập nhật
  update: (id, data) => apiClient.put(`/hoatdong/${id}`, data),

  // Xóa
  delete: (id) => apiClient.delete(`/hoatdong/${id}`),

  // Tìm kiếm
  search: (keyword) => apiClient.get('/hoatdong/search', { params: { keyword } }),

  // Tìm theo khoảng thời gian
  getByDateRange: (startDate, endDate) =>
    apiClient.get('/hoatdong/daterange', { params: { start: startDate, end: endDate } })
};

export default hoatDongThienNguyenApi;