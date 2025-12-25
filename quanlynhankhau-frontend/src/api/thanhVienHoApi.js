import apiClient from './apiClient';

const thanhVienHoApi = {
  // Thêm thành viên vào hộ
  create: (data) => apiClient.post('/thanhvienho', data),

  // Xóa thành viên khỏi hộ
  delete: (id) => apiClient.delete(`/thanhvienho/${id}`),

  // Lấy danh sách thành viên của hộ
  getByHoKhau: (hoKhauId) => apiClient.get(`/thanhvienho/hokhau/${hoKhauId}`)
};

export default thanhVienHoApi;