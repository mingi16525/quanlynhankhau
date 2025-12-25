import apiClient from './apiClient';

const suKienApi = {
  // Lấy theo ID
  getById: (id) => apiClient.get(`/sukien/${id}`),

  // Tạo mới
  create: (data) => apiClient.post('/sukien', data),

  // Cập nhật
  update: (id, data) => apiClient.put(`/sukien/${id}`, data),

  // Xóa
  delete: (id) => apiClient.delete(`/sukien/${id}`),

  // Lấy sự kiện Sinh
  getSinh: () => apiClient.get('/sukien/loai/sinh'),

  // Lấy sự kiện Mất
  getMat: () => apiClient.get('/sukien/loai/mat'),

  // Lấy thống kê
  getStats: () => apiClient.get('/sukien/stats'),

  // Tìm kiếm
  search: (keyword) => apiClient.get('/sukien/search', { params: { keyword } }),

  // Tìm theo khoảng thời gian
  getByDateRange: (startDate, endDate) =>
    apiClient.get('/sukien/daterange', { 
      params: { 
        start: startDate, 
        end: endDate 
      } 
    })
};

export default suKienApi;