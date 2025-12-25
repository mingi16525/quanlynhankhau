import React, { useState, useEffect } from 'react';
import { Table, Button, message, Space, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import hoKhauApi from '../../api/hoKhauApi';
import { PermissionCheck } from '../../components/PermissionCheck'; // Component kiểm tra quyền

const HoKhauListPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 1. Logic Lấy dữ liệu từ API
  const fetchData = async () => {
    setLoading(true);
    try {
      // Gọi API GET /api/hokhau
      const response = await hoKhauApi.getAll();
      setData(response.data);
    } catch (error) {
      // Lỗi 403 (Forbidden) hoặc lỗi khác
      message.error('Không thể tải dữ liệu Hộ khẩu. Kiểm tra quyền hạn.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 2. Logic Xử lý Xóa Hộ khẩu
  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Xác nhận xóa Hộ khẩu',
      content: 'CẢNH BÁO: Chỉ xóa khi Hộ khẩu không còn bất kỳ thành viên nào. Bạn có muốn tiếp tục?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          // Gọi API DELETE /api/hokhau/{id}
          await hoKhauApi.delete(id);
          message.success('Xóa Sổ Hộ khẩu thành công.');
          fetchData(); // Tải lại dữ liệu
        } catch (error) {
          // Xử lý lỗi nếu Hộ khẩu còn thành viên (HTTP 409 Conflict)
          message.error('Lỗi: Không thể xóa Hộ khẩu (Vẫn còn thành viên).');
        }
      },
    });
  };

  // 3. Định nghĩa Cột và Hành động (Áp dụng RBAC)
  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Mã Sổ Hộ', dataIndex: 'maSoHo', key: 'maSoHo' },
    { 
      title: 'Chủ Hộ', 
      key: 'chuHo', 
      render: (_, record) => record.chuHo ? record.chuHo.hoTen : 'N/A' 
    },
    { title: 'Địa chỉ', dataIndex: 'diaChi', key: 'diaChi' },
    { title: 'Ngày Lập', dataIndex: 'ngayLap', key: 'ngayLap' },
    {
      title: 'Hành động',
      key: 'action',
      width: 250,
      render: (_, record) => (
        <Space size="small">
          {/* Xem chi tiết và Quản lý thành viên (luôn hiển thị) */}
          <Button onClick={() => navigate(`/dashboard/hokhau/details/${record.id}`)} type="default">
            Thành viên
          </Button>

          {/* Nút SỬA - Cần quyền HO_KHAU:UPDATE */}
          <PermissionCheck permission="HO_KHAU:UPDATE">
            <Button 
              type="primary" 
              onClick={() => navigate(`/dashboard/hokhau/form/edit/${record.id}`)}
            >
              Sửa
            </Button>
          </PermissionCheck>
          
          {/* Nút XÓA - Cần quyền HO_KHAU:DELETE */}
          <PermissionCheck permission="HO_KHAU:DELETE">
            <Button 
              danger 
              onClick={() => handleDelete(record.id)}
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
      <h1>Quản lý Sổ Hộ khẩu</h1>
      
      {/* Nút THÊM MỚI - Cần quyền HO_KHAU:CREATE */}
      <PermissionCheck permission="HO_KHAU:CREATE">
        <Button 
          type="primary" 
          style={{ marginBottom: 16 }} 
          onClick={() => navigate('/dashboard/hokhau/form/new')}
        >
          Thêm mới Hộ khẩu
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

export default HoKhauListPage;