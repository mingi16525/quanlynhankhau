import React, { useState, useEffect } from 'react';
import { Table, Button, message, Space, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import { PermissionCheck } from '../../components/PermissionCheck'; // Component kiểm tra quyền

const NhanKhauListPage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // 1. Logic Lấy dữ liệu từ API
    const fetchData = async () => {
        setLoading(true);
        try {
            // Gọi API GET /api/nhankhau
            const response = await apiClient.get('/nhankhau');
            setData(response.data);
        } catch (error) {
            message.error('Không thể tải dữ liệu nhân khẩu. Kiểm tra kết nối hoặc quyền hạn.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // 2. Logic Xử lý Xóa hồ sơ
    const handleDelete = async (id) => {
        if (window.confirm(`Cảnh báo: Chỉ xóa khi hồ sơ ${id} không phải là Chủ hộ. Bạn có chắc chắn muốn xóa?`)) {
            try {
                // Gọi API DELETE /api/nhankhau/{id}
                await apiClient.delete(`/nhankhau/${id}`);
                message.success('Xóa hồ sơ thành công.');
                fetchData(); // Tải lại dữ liệu
            } catch (error) {
                // Xử lý lỗi nếu hồ sơ là Chủ hộ (HTTP 409 Conflict)
                 console.error('❌ Delete error:', error);
                console.error('Response data:', error.response?.data);
                
                const errorMessage = error.response?.data?.message || 
                                   'Lỗi: Không thể xóa hồ sơ';
                message.error(errorMessage);
                message.error('Lỗi: Không thể xóa hồ sơ (Có thể người này là Chủ hộ).');
            }
        }
    };

    // 3. Định nghĩa Cột và Hành động (Áp dụng RBAC)
    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Họ Tên', dataIndex: 'hoTen', key: 'hoTen' },
        { title: 'CCCD', dataIndex: 'soCCCD', key: 'soCCCD' },
        { title: 'Giới tính', dataIndex: 'gioiTinh', key: 'gioiTinh' },
        { 
            title: 'Tình trạng', 
            dataIndex: 'tinhTrang', 
            key: 'tinhTrang',
            render: (text) => <Tag color={text === 'Thường trú' ? 'green' : 'blue'}>{text}</Tag>
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 150,
            render: (_, record) => (
                <Space size="small">
                    {/* Nút SỬA - Cần quyền NHAN_KHAU:UPDATE */}
                    <PermissionCheck permission="NHAN_KHAU:UPDATE">
                        <Button 
                            type="link" 
                            onClick={() => navigate(`/dashboard/nhankhau/form/edit/${record.id}`)}
                            title="Chỉnh sửa thông tin hồ sơ"
                        >
                            Sửa
                        </Button>
                    </PermissionCheck>
                    {/* Nút XÓA - Cần quyền NHAN_KHAU:DELETE */}
                    <PermissionCheck permission="NHAN_KHAU:DELETE">
                        <Button 
                            type="link" 
                            danger 
                            onClick={() => handleDelete(record.id)}
                            title="Xóa vĩnh viễn hồ sơ"
                        >
                            Xóa
                        </Button>
                    </PermissionCheck>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <h1>Quản lý Hồ sơ Nhân khẩu</h1>
            
            {/* Nút THÊM MỚI - Cần quyền NHAN_KHAU:CREATE */}
            <PermissionCheck permission="NHAN_KHAU:CREATE">
                <Button 
                    type="primary" 
                    style={{ marginBottom: 16 }} 
                    onClick={() => navigate('/dashboard/nhankhau/form/new')}
                >
                    Thêm mới Nhân khẩu
                </Button>
            </PermissionCheck>

            <Table 
                columns={columns} 
                dataSource={data} 
                rowKey="id" 
                loading={loading} 
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
};

export default NhanKhauListPage;