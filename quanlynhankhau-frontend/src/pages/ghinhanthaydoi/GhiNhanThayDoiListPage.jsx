import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Input, 
  Space, 
  Tag, 
  Card, 
  Row, 
  Col, 
  Statistic,
  DatePicker,
  Select,
  message,
  Popconfirm,
  Tooltip
} from 'antd';
import { 
  SearchOutlined, 
  ReloadOutlined,
  DeleteOutlined,
  EyeOutlined,
  FilterOutlined,
  HistoryOutlined,
  UserOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

const GhiNhanThayDoiListPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filterSuKien, setFilterSuKien] = useState(null);
  const [stats, setStats] = useState({
    thayDoiThongTin: 0,
    themThanhVien: 0,
    xoaThanhVien: 0,
    doiChuHo: 0,
    tachHo: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/ghinhanthaydoi');
      console.log('📥 Lịch sử thay đổi:', response.data);
      setData(response.data);
      setFilteredData(response.data);
      calculateStats(response.data);
    } catch (error) {
      console.error('❌ Error fetching data:', error);
      message.error('Không thể tải danh sách lịch sử');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (records) => {
    const stats = {
      thayDoiThongTin: records.filter(r => r.tenSuKien === 'Thay đổi thông tin').length,
      themThanhVien: records.filter(r => r.tenSuKien === 'Thêm thành viên').length,
      xoaThanhVien: records.filter(r => r.tenSuKien === 'Xóa thành viên').length,
      doiChuHo: records.filter(r => r.tenSuKien === 'Đổi chủ hộ').length,
      tachHo: records.filter(r => r.tenSuKien === 'Tách hộ').length
    };
    setStats(stats);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    applyFilters(value, filterSuKien);
  };

  const handleFilterSuKien = (value) => {
    setFilterSuKien(value);
    applyFilters(searchText, value);
  };

  const applyFilters = (search, suKien) => {
    let filtered = [...data];

    // Filter by search text
    if (search) {
      filtered = filtered.filter(item =>
        item.moTa?.toLowerCase().includes(search.toLowerCase()) ||
        item.hoKhau?.maSoHo?.toLowerCase().includes(search.toLowerCase()) ||
        item.nguoiThucHien?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by sự kiện
    if (suKien) {
      filtered = filtered.filter(item => item.tenSuKien === suKien);
    }

    setFilteredData(filtered);
  };

  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`/ghinhanthaydoi/${id}`);
      message.success('✅ Xóa bản ghi thành công');
      fetchData();
    } catch (error) {
      console.error('❌ Error deleting:', error);
      message.error('Không thể xóa bản ghi');
    }
  };

  const handleViewHoKhau = (hoKhauId) => {
    navigate(`/dashboard/hokhau/view/${hoKhauId}`);
  };

  const getSuKienColor = (tenSuKien) => {
    const colors = {
      'Thay đổi thông tin': 'blue',
      'Thêm thành viên': 'green',
      'Xóa thành viên': 'red',
      'Đổi chủ hộ': 'orange',
      'Tách hộ': 'purple'
    };
    return colors[tenSuKien] || 'default';
  };

  const getSuKienIcon = (tenSuKien) => {
    const icons = {
      'Thay đổi thông tin': '📝',
      'Thêm thành viên': '➕',
      'Xóa thành viên': '➖',
      'Đổi chủ hộ': '🔄',
      'Tách hộ': '🏠'
    };
    return icons[tenSuKien] || '📋';
  };

  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      align: 'center',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Thời gian',
      dataIndex: 'ngayGhiNhan',
      key: 'ngayGhiNhan',
      width: 160,
      sorter: (a, b) => new Date(a.ngayGhiNhan) - new Date(b.ngayGhiNhan),
      render: (date) => (
        <Space direction="vertical" size={0}>
          <span style={{ fontWeight: 500 }}>
            {dayjs(date).format('DD/MM/YYYY')}
          </span>
          <span style={{ fontSize: '12px', color: '#888' }}>
            {dayjs(date).format('HH:mm:ss')}
          </span>
        </Space>
      ),
    },
    {
      title: 'Hộ khẩu',
      dataIndex: ['hoKhau', 'maSoHo'],
      key: 'hoKhau',
      width: 120,
      render: (maSoHo, record) => (
        <Button
          type="link"
          icon={<HomeOutlined />}
          onClick={() => handleViewHoKhau(record.hoKhau?.id)}
        >
          {maSoHo}
        </Button>
      ),
    },
    {
      title: 'Sự kiện',
      dataIndex: 'tenSuKien',
      key: 'tenSuKien',
      width: 180,
      filters: [
        { text: 'Thay đổi thông tin', value: 'Thay đổi thông tin' },
        { text: 'Thêm thành viên', value: 'Thêm thành viên' },
        { text: 'Xóa thành viên', value: 'Xóa thành viên' },
        { text: 'Đổi chủ hộ', value: 'Đổi chủ hộ' },
        { text: 'Tách hộ', value: 'Tách hộ' },
      ],
      onFilter: (value, record) => record.tenSuKien === value,
      render: (tenSuKien) => (
        <Tag color={getSuKienColor(tenSuKien)} icon={<span>{getSuKienIcon(tenSuKien)}</span>}>
          {tenSuKien}
        </Tag>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'moTa',
      key: 'moTa',
      ellipsis: {
        showTitle: false,
      },
      render: (moTa) => (
        <Tooltip placement="topLeft" title={moTa}>
          {moTa}
        </Tooltip>
      ),
    },
    {
      title: 'Người thực hiện',
      dataIndex: 'nguoiThucHien',
      key: 'nguoiThucHien',
      width: 150,
      render: (nguoiThucHien) => (
        <Space>
          <UserOutlined />
          <span>{nguoiThucHien}</span>
        </Space>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="Xóa bản ghi này?"
            description="Bạn có chắc chắn muốn xóa bản ghi lịch sử này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />}
              size="small"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card>
            <Statistic
              title="Tổng số"
              value={data.length}
              prefix={<HistoryOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card>
            <Statistic
              title="Thay đổi TT"
              value={stats.thayDoiThongTin}
              prefix="📝"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card>
            <Statistic
              title="Thêm TV"
              value={stats.themThanhVien}
              prefix="➕"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card>
            <Statistic
              title="Xóa TV"
              value={stats.xoaThanhVien}
              prefix="➖"
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card>
            <Statistic
              title="Đổi chủ hộ"
              value={stats.doiChuHo}
              prefix="🔄"
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card>
            <Statistic
              title="Tách hộ"
              value={stats.tachHo}
              prefix="🏠"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Table Card */}
      <Card
        title={
          <Space>
            <HistoryOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
            <span style={{ fontSize: '18px', fontWeight: 600 }}>
              Lịch sử thay đổi Hộ khẩu
            </span>
          </Space>
        }
        extra={
          <Space>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={fetchData}
              loading={loading}
            >
              Làm mới
            </Button>
          </Space>
        }
      >
        {/* Filters */}
        <Space style={{ marginBottom: 16, width: '100%' }} direction="vertical">
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Input
                placeholder="Tìm kiếm theo mô tả, mã hộ, người thực hiện..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => handleSearch(e.target.value)}
                allowClear
                size="large"
              />
            </Col>
            <Col xs={24} md={12}>
              <Select
                placeholder="Lọc theo loại sự kiện"
                style={{ width: '100%' }}
                allowClear
                size="large"
                value={filterSuKien}
                onChange={handleFilterSuKien}
              >
                <Option value="Thay đổi thông tin">📝 Thay đổi thông tin</Option>
                <Option value="Thêm thành viên">➕ Thêm thành viên</Option>
                <Option value="Xóa thành viên">➖ Xóa thành viên</Option>
                <Option value="Đổi chủ hộ">🔄 Đổi chủ hộ</Option>
                <Option value="Tách hộ">🏠 Tách hộ</Option>
              </Select>
            </Col>
          </Row>
        </Space>

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
      </Card>
    </div>
  );
};

export default GhiNhanThayDoiListPage;
