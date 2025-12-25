import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Space, Modal, message, Tag } from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  SearchOutlined,
  ReloadOutlined,
  LockOutlined,
  UnlockOutlined,
  KeyOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
// apiClient không cần thiết nữa, đã chuyển sang dùng adminApi

const TaiKhoanListPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  // Fetch data khi component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Filter data khi search
  useEffect(() => {
    if (searchText) {
      const filtered = data.filter(item =>
        item.tenDangNhap?.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [searchText, data]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getTaiKhoan();
      console.log('Fetched data:', response.data);
      setData(response.data);
      setFilteredData(response.data);
      message.success('Tải dữ liệu thành công');
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Không thể tải dữ liệu: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa tài khoản này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await adminApi.deleteTaiKhoan(id);
          message.success('Xóa tài khoản thành công');
          fetchData();
        } catch (error) {
          console.error('Error deleting:', error);
          message.error(error.response?.data?.message || 'Không thể xóa tài khoản');
        }
      }
    });
  };

  const handleToggleLock = async (id, trangThai) => {
    try {
      await adminApi.lockTaiKhoan(id);
      message.success(trangThai === 'Locked' ? 'Đã mở khóa tài khoản' : 'Đã khóa tài khoản');
      fetchData();
    } catch (error) {
      console.error('Error toggling lock:', error);
      message.error(error.response?.data?.message || 'Không thể thay đổi trạng thái tài khoản');
    }
  };

  const handleResetPassword = (id, tenDangNhap) => {
    Modal.confirm({
      title: 'Reset mật khẩu',
      content: `Bạn có chắc chắn muốn reset mật khẩu cho tài khoản "${tenDangNhap}"?`,
      okText: 'Reset',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await adminApi.resetPassword(id);
          message.success('Đã reset mật khẩu thành "password123"');
        } catch (error) {
          console.error('Error resetting password:', error);
          message.error(error.response?.data?.message || 'Không thể reset mật khẩu');
        }
      }
    });
  };

  const columns = [
    {
      title: 'STT',
      key: 'stt',
      width: 60,
      align: 'center',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Tên đăng nhập',
      dataIndex: 'tenDangNhap',
      key: 'tenDangNhap',
      sorter: (a, b) => a.tenDangNhap?.localeCompare(b.tenDangNhap),
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: 'Vai trò',
      dataIndex: 'vaiTro',
      key: 'vaiTro',
      width: 200,
      render: (vaiTro) => {
        const colors = {
          'ADMIN_HE_THONG': 'red',
          'QUAN_LY_KHU': 'orange',
          'KE_TOAN': 'blue',
          'USER': 'green'
        };
        return (
          <Tag color={colors[vaiTro?.tenVaiTro] || 'default'}>
            {vaiTro?.tenVaiTro || 'N/A'}
          </Tag>
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 120,
      align: 'center',
      filters: [
        { text: 'Hoạt động', value: 'Active' },
        { text: 'Bị khóa', value: 'Locked' },
      ],
      onFilter: (value, record) => record.trangThai === value,
      render: (trangThai) => (
        <Tag color={trangThai === 'Locked' ? 'red' : 'green'}>
          {trangThai === 'Locked' ? 'Bị khóa' : 'Hoạt động'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 300,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            ghost
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/dashboard/admin/taikhoan/form/view/${record.id}`)}
          >
            Xem
          </Button>
          <Button
            type="default"
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`/dashboard/admin/taikhoan/form/edit/${record.id}`)}
          >
            Sửa
          </Button>
          <Button
            type={record.trangThai === 'Locked' ? 'primary' : 'default'}
            size="small"
            icon={record.trangThai === 'Locked' ? <UnlockOutlined /> : <LockOutlined />}
            onClick={() => handleToggleLock(record.id, record.trangThai)}
          >
            {record.trangThai === 'Locked' ? 'Mở' : 'Khóa'}
          </Button>
          <Button
            size="small"
            icon={<KeyOutlined />}
            onClick={() => handleResetPassword(record.id, record.tenDangNhap)}
          >
            Reset
          </Button>
          <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ 
        background: '#fff', 
        padding: '24px', 
        borderRadius: '8px',
        boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03), 0 1px 6px -1px rgba(0,0,0,0.02)'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: '600', 
            margin: 0,
            color: '#1890ff'
          }}>
            Quản lý Tài khoản
          </h2>
        </div>

        {/* Toolbar */}
        <div style={{ 
          marginBottom: '16px', 
          display: 'flex', 
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <Space>
            <Input
              placeholder="Tìm kiếm theo tên đăng nhập..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300 }}
              allowClear
            />
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchData}
              loading={loading}
            >
              Làm mới
            </Button>
          </Space>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/dashboard/admin/taikhoan/form/new')}
            size="large"
          >
            Thêm tài khoản
          </Button>
        </div>

        {/* Statistics */}
        <div style={{ marginBottom: '16px' }}>
          <Tag color="blue">
            Tổng số: {filteredData.length} tài khoản
          </Tag>
          {searchText && (
            <Tag color="green">
              Tìm thấy: {filteredData.length} kết quả
            </Tag>
          )}
        </div>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} bản ghi`,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          scroll={{ x: 1000 }}
          bordered
        />
      </div>
    </div>
  );
};

export default TaiKhoanListPage;