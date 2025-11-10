import apiClient from './apiClient';
const khoanPhiApi = {
  // Lấy tất cả khoản phí
  getAll: () => apiClient.get('/khoanphi'),

  // Lấy theo ID
  getById: (id) => apiClient.get(`/khoanphi/${id}`),

  // Lấy khoản phí đang hoạt động
  getActive: () => apiClient.get('/khoanphi/active'),

  // Lấy theo loại
  getByLoai: (loai) => apiClient.get(`/khoanphi/loai/${loai}`),

  // Tạo mới
  create: (data) => apiClient.post('/khoanphi', data),

  // Cập nhật
  update: (id, data) => apiClient.put(`/khoanphi/${id}`, data),

  // Xóa
  delete: (id) => apiClient.delete(`/khoanphi/${id}`),

  // Tìm kiếm
  search: (keyword) => apiClient.get('/khoanphi/search', { params: { keyword } }),

  // Cập nhật trạng thái
  updateTrangThai: (id, trangThai) =>
    apiClient.put(`/khoanphi/${id}/trangthai`, { trangThai })
};

export default khoanPhiApi;