import apiClient from './apiClient';

const baoCaoApi = {
  // Báo cáo thu chi tổng hợp
  getThuChiTongHop: () => apiClient.get('/baocao/thuchitonghop'),

  // Báo cáo theo giới tính
  getGioiTinh: () => apiClient.get('/baocao/gioitinh')
};

export default baoCaoApi;