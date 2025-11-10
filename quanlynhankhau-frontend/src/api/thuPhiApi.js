import apiClient from './apiClient';

const thuPhiApi = {
  // Lấy tất cả
  getAll: () => apiClient.get('/thuphi'),

  // Lấy theo ID
  getById: (id) => apiClient.get(`/thuphi/${id}`),

  // Lấy theo hộ khẩu
  getByHoKhau: (hoKhauId) => apiClient.get(`/thuphi/hokhau/${hoKhauId}`),

  // Lấy theo khoản phí
  getByKhoanPhi: (khoanPhiId) => apiClient.get(`/thuphi/khoanphi/${khoanPhiId}`),

  // Lấy hộ chưa đóng
  getHoChuaDong: (khoanPhiId) => apiClient.get(`/thuphi/khoanphi/${khoanPhiId}/chuadong`),

  // Lấy hộ đã đóng
  getHoDaDong: (khoanPhiId) => apiClient.get(`/thuphi/khoanphi/${khoanPhiId}/dadong`),

  // Lấy thống kê khoản phí
  getThongKe: (khoanPhiId) => apiClient.get(`/thuphi/khoanphi/${khoanPhiId}/thongke`),

  // Tạo danh sách thu cho tất cả hộ
  createForAllHo: (khoanPhiId) => apiClient.post(`/thuphi/taomoi/khoanphi/${khoanPhiId}`),

  // Tạo mới
  create: (data) => apiClient.post('/thuphi', data),

  // Cập nhật
  update: (id, data) => apiClient.put(`/thuphi/${id}`, data),

  // Cập nhật trạng thái
  updateTrangThai: (id, trangThai) =>
    apiClient.put(`/thuphi/${id}/trangthai`, { trangThai }),

  // Xóa
  delete: (id) => apiClient.delete(`/thuphi/${id}`),

  // Tìm kiếm
  search: (keyword) => apiClient.get('/thuphi/search', { params: { keyword } })
};

export default thuPhiApi;