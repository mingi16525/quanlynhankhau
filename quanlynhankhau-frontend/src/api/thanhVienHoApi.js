import apiClient from './apiClient';

const thanhVienHoApi = {
  // Thêm thành viên vào hộ
  create: (data) => apiClient.post('/thanhvienho', data),

  // Xóa thành viên khỏi hộ
  delete: (id) => apiClient.delete(`/thanhvienho/${id}`),

  // Xóa TẤT CẢ thành viên của hộ (bao gồm cả chủ hộ)
  deleteAllByHoKhau: (hoKhauId) => apiClient.delete(`/thanhvienho/hokhau/${hoKhauId}`),

  // Lấy danh sách thành viên của hộ
  getByHoKhau: (hoKhauId) => apiClient.get(`/thanhvienho/hokhau/${hoKhauId}`)
};

export default thanhVienHoApi;