import apiClient from './apiClient';

const hoKhauApi = {
  // Lấy tất cả hộ khẩu
  getAll: () => apiClient.get('/hokhau'),

  // Lấy theo ID
  getById: (id) => apiClient.get(`/hokhau/${id}`),

  // Lấy thành viên của hộ
  getThanhVien: (hoKhauId) => apiClient.get(`/hokhau/${hoKhauId}/thanhvien`),

  // Tạo mới
  create: (data) => apiClient.post('/hokhau', data),

  // Cập nhật
  update: (id, data) => apiClient.put(`/hokhau/${id}`, data),

  // Xóa (chỉ xóa khi không còn thành viên)
  delete: (id) => apiClient.delete(`/hokhau/${id}`),

  // Xóa hộ khẩu kèm tất cả thành viên (Force Delete)
  deleteWithMembers: (id) => apiClient.delete(`/hokhau/${id}/force`),

  // Tách hộ
  tachHo: (hoKhauId, data) => apiClient.post(`/hokhau/${hoKhauId}/tach`, data)
};

export default hoKhauApi;
