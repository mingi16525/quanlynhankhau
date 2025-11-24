import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  message, 
  Space, 
  Card, 
  Tag, 
  Popconfirm,
  Tabs,
  Modal,
  Descriptions,
  Input,
  Row,
  Col,
  DatePicker,
} from 'antd';
import { 
  PlusOutlined, 
  EyeOutlined, 
  EditOutlined, 
  DeleteOutlined,
  SearchOutlined,
  WarningOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import dayjs from 'dayjs';

const { TabPane } = Tabs;
const { Search } = Input;
const { RangePicker } = DatePicker;

const TamTruTamVangListPage = () => {
    const navigate = useNavigate();
    const [tamTruList, setTamTruList] = useState([]);
    const [tamVangList, setTamVangList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('tamtru');
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [dateRange, setDateRange] = useState(null);

    // ========== FETCH DATA ==========
    const fetchTamTru = async (tuNgay = null, denNgay = null) => {
        setLoading(true);
        try {
            let url = '/tamtrutamvang/loai/tamtru';
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
            
            const response = await apiClient.get(url);
            console.log('📥 Tạm trú data:', response.data);
            setTamTruList(response.data);
        } catch (error) {
            console.error('❌ Error fetching Tạm trú:', error);
            message.error('Không thể tải danh sách Tạm trú');
        } finally {
            setLoading(false);
        }
    };

    const fetchTamVang = async (tuNgay = null, denNgay = null) => {
        setLoading(true);
        try {
            let url = '/tamtrutamvang/loai/tamvang';
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
            
            const response = await apiClient.get(url);
            console.log('📥 Tạm vắng data:', response.data);
            setTamVangList(response.data);
        } catch (error) {
            console.error('❌ Error fetching Tạm vắng:', error);
            message.error('Không thể tải danh sách Tạm vắng');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [activeTab, dateRange]);
    
    // Hàm fetch data chung
    const fetchData = () => {
        let tuNgay = null;
        let denNgay = null;
        
        if (dateRange && dateRange.length === 2) {
            tuNgay = dateRange[0].format('YYYY-MM-DD');
            denNgay = dateRange[1].format('YYYY-MM-DD');
        }
        
        if (activeTab === 'tamtru') {
            fetchTamTru(tuNgay, denNgay);
        } else {
            fetchTamVang(tuNgay, denNgay);
        }
    };
    
    // Xử lý thay đổi khoảng thời gian
    const handleDateRangeChange = (dates) => {
        setDateRange(dates);
    };
    
    // Reset filter
    const handleResetFilter = () => {
        setDateRange(null);
        setSearchKeyword('');
    };

    // ========== TÌM KIẾM ==========
    const handleSearch = async (value) => {
        if (!value.trim()) {
            // Nếu không có keyword, load lại data gốc
            if (activeTab === 'tamtru') {
                fetchTamTru();
            } else {
                fetchTamVang();
            }
            return;
        }

        setLoading(true);
        try {
            const response = await apiClient.get(`/tamtrutamvang/search?keyword=${value}`);
            console.log('🔍 Search results:', response.data);
            
            // Filter theo loại hiện tại
            const filtered = response.data.filter(item => 
                activeTab === 'tamtru' 
                    ? item.loai === 'Tạm trú' 
                    : item.loai === 'Tạm vắng'
            );

            if (activeTab === 'tamtru') {
                setTamTruList(filtered);
            } else {
                setTamVangList(filtered);
            }

            message.success(`Tìm thấy ${filtered.length} kết quả`);
        } catch (error) {
            console.error('❌ Error searching:', error);
            message.error('Lỗi khi tìm kiếm');
        } finally {
            setLoading(false);
        }
    };

    // ========== XÓA ĐĂNG KÝ ==========
    const handleDelete = async (id) => {
        try {
            await apiClient.delete(`/tamtrutamvang/${id}`);
            message.success('✅ Hủy đăng ký thành công');
            
            // Reload data
            if (activeTab === 'tamtru') {
                fetchTamTru();
            } else {
                fetchTamVang();
            }
        } catch (error) {
            console.error('❌ Error deleting:', error);
            message.error(error.response?.data?.message || 'Lỗi khi hủy đăng ký');
        }
    };

    // ========== XEM CHI TIẾT ==========
    const handleView = (record) => {
        setSelectedRecord(record);
        setViewModalVisible(true);
    };

    // ========== TÍNH TRẠNG THÁI ==========
    const getStatus = (record) => {
        if (!record.denNgay) {
            return { text: 'Đang hiệu lực', color: 'blue' };
        }
        const denNgay = dayjs(record.denNgay);
        const now = dayjs();
        
        if (denNgay.isBefore(now)) {
            return { text: 'Đã hết hạn', color: 'red' };
        } else if (denNgay.diff(now, 'day') <= 30) {
            return { text: 'Sắp hết hạn', color: 'orange' };
        } else {
            return { text: 'Còn hiệu lực', color: 'green' };
        }
    };

    // ========== CỘT BẢNG ==========
    const columns = [
        { 
            title: 'ID', 
            dataIndex: 'id', 
            key: 'id',
            width: 70,
            sorter: (a, b) => a.id - b.id
        },
        { 
            title: 'Họ tên', 
            dataIndex: ['nhanKhau', 'hoTen'], 
            key: 'hoTen',
            render: (text, record) => (
                <Space direction="vertical" size={0}>
                    <span style={{ fontWeight: 500 }}>{text}</span>
                    <span style={{ fontSize: '12px', color: '#888' }}>
                        CCCD: {record.nhanKhau?.soCCCD}
                    </span>
                </Space>
            ),
            sorter: (a, b) => (a.nhanKhau?.hoTen || '').localeCompare(b.nhanKhau?.hoTen || '')
        },
        { 
            title: 'Từ ngày', 
            dataIndex: 'tuNgay', 
            key: 'tuNgay',
            width: 120,
            render: (date) => dayjs(date).format('DD/MM/YYYY'),
            sorter: (a, b) => dayjs(a.tuNgay).unix() - dayjs(b.tuNgay).unix()
        },
        { 
            title: 'Đến ngày', 
            dataIndex: 'denNgay', 
            key: 'denNgay',
            width: 120,
            render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : <Tag>Không xác định</Tag>,
            sorter: (a, b) => {
                if (!a.denNgay) return 1;
                if (!b.denNgay) return -1;
                return dayjs(a.denNgay).unix() - dayjs(b.denNgay).unix();
            }
        },
        { 
            title: 'Địa chỉ / Nơi đến', 
            dataIndex: 'noiDen', 
            key: 'noiDen',
            ellipsis: true,
            render: (text) => (
                <span style={{ fontSize: '13px' }}>
                    {text || 'Chưa cập nhật'}
                </span>
            )
        },
        { 
            title: 'Trạng thái', 
            key: 'status',
            width: 130,
            render: (_, record) => {
                const status = getStatus(record);
                return <Tag color={status.color}>{status.text}</Tag>;
            },
            filters: [
                { text: 'Đang hiệu lực', value: 'active' },
                { text: 'Sắp hết hạn', value: 'warning' },
                { text: 'Đã hết hạn', value: 'expired' }
            ],
            onFilter: (value, record) => {
                const status = getStatus(record);
                if (value === 'active') return status.color === 'blue' || status.color === 'green';
                if (value === 'warning') return status.color === 'orange';
                if (value === 'expired') return status.color === 'red';
                return false;
            }
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 220,
            align: 'center',
            render: (_, record) => (
                <Space size="small">
                    <Button 
                        type="default"
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => handleView(record)}
                    >
                        Xem
                    </Button>
                    <Button 
                        type="primary"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/dashboard/tamtrutamvang/edit/${record.id}`)}
                    >
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Hủy đăng ký?"
                        description="Bạn có chắc chắn muốn hủy đăng ký này?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                    >
                        <Button 
                            danger
                            size="small"
                            icon={<DeleteOutlined />}
                        >
                            Hủy
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <Card>
                {/* Bộ lọc */}
                <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
                    <Col xs={24} md={10}>
                        <Search
                            placeholder="Tìm theo tên, CCCD..."
                            allowClear
                            enterButton={<SearchOutlined />}
                            size="large"
                            onSearch={handleSearch}
                            onChange={(e) => {
                                setSearchKeyword(e.target.value);
                                if (!e.target.value) {
                                    handleSearch('');
                                }
                            }}
                            value={searchKeyword}
                        />
                    </Col>
                    <Col xs={24} md={10}>
                        <RangePicker
                            style={{ width: '100%' }}
                            size="large"
                            placeholder={['Từ ngày đăng ký', 'Đến ngày đăng ký']}
                            format="DD/MM/YYYY"
                            value={dateRange}
                            onChange={handleDateRangeChange}
                        />
                    </Col>
                    <Col xs={24} md={4}>
                        <Space>
                            <Button 
                                type="primary" 
                                icon={<PlusOutlined />}
                                size="large"
                                onClick={() => navigate('/dashboard/tamtrutamvang/new')}
                            >
                                Thêm mới
                            </Button>
                            <Button
                                icon={<ReloadOutlined />}
                                size="large"
                                onClick={handleResetFilter}
                                title="Làm mới bộ lọc"
                            />
                        </Space>
                    </Col>
                </Row>

                <Tabs 
                    activeKey={activeTab} 
                    onChange={(key) => {
                        setActiveTab(key);
                        setSearchKeyword('');
                    }}
                >
                    <TabPane 
                        tab={
                            <span>
                                <Tag color="green">Tạm trú</Tag>
                                ({tamTruList.length})
                            </span>
                        } 
                        key="tamtru"
                    >
                        <Table 
                            columns={columns} 
                            dataSource={tamTruList} 
                            rowKey="id" 
                            loading={loading}
                            pagination={{ 
                                pageSize: 10,
                                showSizeChanger: true,
                                showTotal: (total) => `Tổng ${total} đăng ký`
                            }}
                            bordered
                            scroll={{ x: 1200 }}
                        />
                    </TabPane>

                    <TabPane 
                        tab={
                            <span>
                                <Tag color="orange">Tạm vắng</Tag>
                                ({tamVangList.length})
                            </span>
                        } 
                        key="tamvang"
                    >
                        <Table 
                            columns={columns} 
                            dataSource={tamVangList} 
                            rowKey="id" 
                            loading={loading}
                            pagination={{ 
                                pageSize: 10,
                                showSizeChanger: true,
                                showTotal: (total) => `Tổng ${total} đăng ký`
                            }}
                            bordered
                            scroll={{ x: 1200 }}
                        />
                    </TabPane>
                </Tabs>
            </Card>

            {/* ========== MODAL XEM CHI TIẾT ========== */}
            <Modal
                title={
                    <span>
                        <EyeOutlined /> Chi tiết đăng ký {selectedRecord?.loai}
                    </span>
                }
                open={viewModalVisible}
                onCancel={() => setViewModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setViewModalVisible(false)}>
                        Đóng
                    </Button>,
                    <Button 
                        key="edit" 
                        type="primary"
                        onClick={() => {
                            setViewModalVisible(false);
                            navigate(`/dashboard/tamtrutamvang/edit/${selectedRecord.id}`);
                        }}
                    >
                        Chỉnh sửa
                    </Button>
                ]}
                width={700}
            >
                {selectedRecord && (
                    <Descriptions bordered column={2}>
                        <Descriptions.Item label="ID" span={2}>
                            {selectedRecord.id}
                        </Descriptions.Item>
                        <Descriptions.Item label="Loại" span={2}>
                            <Tag color={selectedRecord.loai === 'Tạm trú' ? 'green' : 'orange'}>
                                {selectedRecord.loai}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Họ tên" span={2}>
                            <strong>{selectedRecord.nhanKhau?.hoTen}</strong>
                        </Descriptions.Item>
                        <Descriptions.Item label="CCCD">
                            {selectedRecord.nhanKhau?.soCCCD}
                        </Descriptions.Item>
                        <Descriptions.Item label="Giới tính">
                            {selectedRecord.nhanKhau?.gioiTinh}
                        </Descriptions.Item>
                        <Descriptions.Item label="Từ ngày">
                            {dayjs(selectedRecord.tuNgay).format('DD/MM/YYYY')}
                        </Descriptions.Item>
                        <Descriptions.Item label="Đến ngày">
                            {selectedRecord.denNgay 
                                ? dayjs(selectedRecord.denNgay).format('DD/MM/YYYY') 
                                : <Tag>Không xác định</Tag>}
                        </Descriptions.Item>
                        <Descriptions.Item label="Nơi đến" span={2}>
                            {selectedRecord.noiDen || 'Chưa cập nhật'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Lý do" span={2}>
                            {selectedRecord.lyDo || 'Không có'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Trạng thái" span={2}>
                            <Tag color={getStatus(selectedRecord).color}>
                                {getStatus(selectedRecord).text}
                            </Tag>
                        </Descriptions.Item>
                    </Descriptions>
                )}
            </Modal>
        </div>
    );
};

export default TamTruTamVangListPage;