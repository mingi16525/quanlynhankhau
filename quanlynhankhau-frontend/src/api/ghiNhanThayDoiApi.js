import apiClient from './apiClient';

const ghiNhanThayDoiApi = {
  // Lấy tất cả lịch sử thay đổi
  getAll: () => apiClient.get('/ghinhanthaydoi'),

  // Xóa một bản ghi
  delete: (id) => apiClient.delete(`/ghinhanthaydoi/${id}`)
};

export default ghiNhanThayDoiApi;
