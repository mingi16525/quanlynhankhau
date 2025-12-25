import apiClient from './apiClient';

const thongKeApi = {
  // Thống kê nhân khẩu theo khoảng thời gian
  getNhanKhau: (tuNgay, denNgay) => {
    // Xây dựng URL với parameters chỉ khi có giá trị
    let url = '/thongke/nhankhau';
    const params = [];
    
    if (tuNgay) {
      params.push(`tuNgay=${tuNgay}`);
    }
    if (denNgay) {
      params.push(`denNgay=${denNgay}`);
    }
    
    if (params.length > 0) {
      url += '?' + params.join('&');
    }
    
    return apiClient.get(url);
  },

  // Thống kê nhân khẩu theo nhóm tuổi
  getNhanKhauByNhomTuoi: (nhomTuoi) => 
    apiClient.get(`/thongke/nhankhau/nhomtuoi/${nhomTuoi}`)
};

export default thongKeApi;