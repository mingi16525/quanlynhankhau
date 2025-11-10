import apiClient from './apiClient';

const chiApi = {
    // Lấy tất cả danh sách chi
    getAll: () => {
        return apiClient.get('/chi');
    },

    // Lấy chi tiết một khoản chi
    getById: (id) => {
        return apiClient.get(`/chi/${id}`);
    },

    // Lấy danh sách chi theo loại
    getByLoai: (loaiChi) => {
        return apiClient.get(`/chi/loai/${loaiChi}`);
    },

    // Tạo khoản chi mới
    create: (data) => {
        return apiClient.post('/chi', data);
    },

    // Cập nhật khoản chi
    update: (id, data) => {
        return apiClient.put(`/chi/${id}`, data);
    },

    // Xóa khoản chi
    delete: (id) => {
        return apiClient.delete(`/chi/${id}`);
    },

    // Tìm kiếm khoản chi
    search: (keyword) => {
        return apiClient.get('/chi/search', {
            params: { keyword }
        });
    },

    // Lấy danh sách chi theo khoảng thời gian
    getByDateRange: (startDate, endDate) => {
        return apiClient.get('/chi/daterange', {
            params: {
                start: startDate,
                end: endDate
            }
        });
    },

    // Lấy thống kê tổng hợp
    getThongKe: () => {
        return apiClient.get('/chi/thongke');
    },

    // Tính tổng chi theo loại
    getTotalByLoai: (loaiChi) => {
        return apiClient.get(`/chi/thongke/loai/${loaiChi}`);
    },

    // Tính tổng chi theo khoảng thời gian
    getTotalByDateRange: (startDate, endDate) => {
        return apiClient.get('/chi/thongke/daterange', {
            params: {
                start: startDate,
                end: endDate
            }
        });
    }
};

export default chiApi;