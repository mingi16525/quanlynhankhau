import apiClient from './apiClient';

const tamTruTamVangApi = {
  // Lấy theo ID
  getById: (id) => apiClient.get(`/tamtrutamvang/${id}`),

  // Tạo mới
  create: (data) => apiClient.post('/tamtrutamvang', data),

  // Cập nhật
  update: (id, data) => apiClient.put(`/tamtrutamvang/${id}`, data),

  // Xóa
  delete: (id) => apiClient.delete(`/tamtrutamvang/${id}`),

  // Lấy Tạm trú theo khoảng thời gian
  getTamTru: (tuNgay = null, denNgay = null) => {
    let url = '/tamtrutamvang/loai/tamtru';
    const params = [];
    if (tuNgay) params.push(`tuNgay=${tuNgay}`);
    if (denNgay) params.push(`denNgay=${denNgay}`);
    if (params.length > 0) url += '?' + params.join('&');
    return apiClient.get(url);
  },

  // Lấy Tạm vắng theo khoảng thời gian
  getTamVang: (tuNgay = null, denNgay = null) => {
    let url = '/tamtrutamvang/loai/tamvang';
    const params = [];
    if (tuNgay) params.push(`tuNgay=${tuNgay}`);
    if (denNgay) params.push(`denNgay=${denNgay}`);
    if (params.length > 0) url += '?' + params.join('&');
    return apiClient.get(url);
  },

  // Tìm kiếm
  search: (keyword) => apiClient.get('/tamtrutamvang/search', { params: { keyword } })
};

export default tamTruTamVangApi;