import apiClient from './apiClient';

const adminApi = {
  // Lấy danh sách vai trò
  getVaiTro: () => apiClient.get('/admin/vaitro'),

  // Lấy danh sách tài khoản
  getTaiKhoan: () => apiClient.get('/admin/taikhoan'),

  // Tạo tài khoản mới
  createTaiKhoan: (tenVaiTro, data) => 
    apiClient.post(`/admin/taikhoan/${encodeURIComponent(tenVaiTro)}`, data),

  // Cập nhật vai trò của tài khoản
  updateTaiKhoanVaiTro: (id, tenVaiTro, data) => 
    apiClient.put(`/admin/taikhoan/${id}?tenVaiTro=${encodeURIComponent(tenVaiTro)}`, data),

  // Xóa tài khoản
  deleteTaiKhoan: (id) => apiClient.delete(`/admin/taikhoan/${id}`),

  // Khóa/mở khóa tài khoản
  lockTaiKhoan: (id) => apiClient.put(`/admin/taikhoan/${id}/lock`),

  // Reset mật khẩu
  resetPassword: (id) => apiClient.put(`/admin/taikhoan/${id}/reset-password`)
};

export default adminApi;