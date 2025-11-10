import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Space, Modal, message, Tag } from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  SearchOutlined,
  ReloadOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/apiClient';

const NhanKhauListPage = () => {
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
        item.hoTen?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.cccd?.includes(searchText) ||
        item.soDienThoai?.includes(searchText)
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [searchText, data]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/nhankhau');
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
      content: 'Bạn có chắc chắn muốn xóa nhân khẩu này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await apiClient.delete(`/nhankhau/${id}`);
          message.success('Xóa nhân khẩu thành công');
          fetchData();
        } catch (error) {
          console.error('Error deleting:', error);
          message.error(error.response?.data?.message || 'Không thể xóa nhân khẩu');
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
      title: 'Họ và tên',
      dataIndex: 'hoTen',
      key: 'hoTen',
      sorter: (a, b) => a.hoTen?.localeCompare(b.hoTen),
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: 'Giới tính',
      dataIndex: 'gioiTinh',
      key: 'gioiTinh',
      width: 100,
      align: 'center',
      filters: [
        { text: 'Nam', value: 'Nam' },
        { text: 'Nữ', value: 'Nữ' },
      ],
      onFilter: (value, record) => record.gioiTinh === value,
      render: (text) => (
        <Tag color={text === 'Nam' ? 'blue' : 'pink'}>
          {text}
        </Tag>
      ),
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'ngaySinh',
      key: 'ngaySinh',
      width: 120,
      sorter: (a, b) => new Date(a.ngaySinh) - new Date(b.ngaySinh),
      render: (date) => date ? new Date(date).toLocaleDateString('vi-VN') : '',
    },
    {
      title: 'CCCD',
      dataIndex: 'cccd',
      key: 'cccd',
      width: 140,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'soDienThoai',
      key: 'soDienThoai',
      width: 130,
    },
    {
      title: 'Địa chỉ thường trú',
      dataIndex: 'diaChiThuongTru',
      key: 'diaChiThuongTru',
      ellipsis: true,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 180,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            ghost
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/admin/nhankhau/form/view/${record.id}`)}
          >
            Xem
          </Button>
          <Button
            type="default"
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/nhankhau/form/edit/${record.id}`)}
          >
            Sửa
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
            Quản lý Nhân khẩu
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
              placeholder="Tìm kiếm theo tên, CCCD, SĐT..."
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
            onClick={() => navigate('/admin/nhankhau/form/new')}
            size="large"
          >
            Thêm nhân khẩu
          </Button>
        </div>

        {/* Statistics */}
        <div style={{ marginBottom: '16px' }}>
          <Tag color="blue">
            Tổng số: {filteredData.length} nhân khẩu
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
          scroll={{ x: 1200 }}
          bordered
        />
      </div>
    </div>
  );
};

export default NhanKhauListPage;