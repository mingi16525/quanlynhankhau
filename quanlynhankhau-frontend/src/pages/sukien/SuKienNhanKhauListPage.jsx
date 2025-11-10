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
  Statistic
} from 'antd';
import { 
  PlusOutlined, 
  EyeOutlined, 
  EditOutlined, 
  DeleteOutlined,
  SearchOutlined,
  HeartOutlined,
  CloseCircleOutlined,
  CalendarOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import dayjs from 'dayjs';

const { TabPane } = Tabs;
const { Search } = Input;
const { RangePicker } = DatePicker;

const SuKienNhanKhauListPage = () => {
    const navigate = useNavigate();
    const [sinhList, setSinhList] = useState([]);
    const [matList, setMatList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('sinh');
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [stats, setStats] = useState({ sinh: 0, mat: 0, total: 0 });

    // ========== FETCH DATA ==========
    const fetchSinh = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/sukien/loai/sinh');
            console.log('📥 Sự kiện Sinh:', response.data);
            setSinhList(response.data);
        } catch (error) {
            console.error('❌ Error fetching Sinh:', error);
            message.error('Không thể tải danh sách sự kiện Sinh');
        } finally {
            setLoading(false);
        }
    };

    const fetchMat = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/sukien/loai/mat');
            console.log('📥 Sự kiện Mất:', response.data);
            setMatList(response.data);
        } catch (error) {
            console.error('❌ Error fetching Mất:', error);
            message.error('Không thể tải danh sách sự kiện Mất');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await apiClient.get('/sukien/stats');
            console.log('📊 Stats:', response.data);
            setStats(response.data);
        } catch (error) {
            console.error('❌ Error fetching stats:', error);
        }
    };

    useEffect(() => {
        fetchStats();
        if (activeTab === 'sinh') {
            fetchSinh();
        } else if (activeTab === 'mat') {
            fetchMat();
        } else {
            // Tab "Tất cả"
            fetchSinh();
            fetchMat();
        }
    }, [activeTab]);

    // ========== TÌM KIẾM ==========
    const handleSearch = async (value) => {
        if (!value.trim()) {
            if (activeTab === 'sinh') {
                fetchSinh();
            } else if (activeTab === 'mat') {
                fetchMat();
            }
            return;
        }

        setLoading(true);
        try {
            const response = await apiClient.get(`/sukien/search?keyword=${value}`);
            console.log('🔍 Search results:', response.data);
            
            const filtered = response.data.filter(item => 
                activeTab === 'all' ? true :
                activeTab === 'sinh' ? item.loaiSuKien === 'Sinh' : item.loaiSuKien === 'Mất'
            );

            if (activeTab === 'sinh') {
                setSinhList(filtered);
            } else if (activeTab === 'mat') {
                setMatList(filtered);
            } else {
                const sinhFiltered = filtered.filter(item => item.loaiSuKien === 'Sinh');
                const matFiltered = filtered.filter(item => item.loaiSuKien === 'Mất');
                setSinhList(sinhFiltered);
                setMatList(matFiltered);
            }

            message.success(`Tìm thấy ${filtered.length} kết quả`);
        } catch (error) {
            console.error('❌ Error searching:', error);
            message.error('Lỗi khi tìm kiếm');
        } finally {
            setLoading(false);
        }
    };

    // ========== LỌC THEO NGÀY ==========
    const handleDateRangeFilter = async (dates) => {
        if (!dates || dates.length !== 2) {
            // Reset về dữ liệu gốc
            if (activeTab === 'sinh') {
                fetchSinh();
            } else if (activeTab === 'mat') {
                fetchMat();
            }
            return;
        }

        const [start, end] = dates;
        setLoading(true);

        try {
            const response = await apiClient.get(
                `/sukien/daterange?start=${start.format('YYYY-MM-DD')}&end=${end.format('YYYY-MM-DD')}`
            );
            
            console.log('📅 Date range results:', response.data);
            
            const filtered = response.data.filter(item => 
                activeTab === 'all' ? true :
                activeTab === 'sinh' ? item.loaiSuKien === 'Sinh' : item.loaiSuKien === 'Mất'
            );

            if (activeTab === 'sinh') {
                setSinhList(filtered);
            } else if (activeTab === 'mat') {
                setMatList(filtered);
            } else {
                const sinhFiltered = filtered.filter(item => item.loaiSuKien === 'Sinh');
                const matFiltered = filtered.filter(item => item.loaiSuKien === 'Mất');
                setSinhList(sinhFiltered);
                setMatList(matFiltered);
            }

            message.success(`Tìm thấy ${filtered.length} sự kiện`);
        } catch (error) {
            console.error('❌ Error filtering:', error);
            message.error('Lỗi khi lọc theo ngày');
        } finally {
            setLoading(false);
        }
    };

    // ========== XÓA SỰ KIỆN ==========
    const handleDelete = async (id) => {
        try {
            await apiClient.delete(`/sukien/${id}`);
            message.success('✅ Xóa sự kiện thành công');
            
            // Reload data
            fetchStats();
            if (activeTab === 'sinh') {
                fetchSinh();
            } else if (activeTab === 'mat') {
                fetchMat();
            }
        } catch (error) {
            console.error('❌ Error deleting:', error);
            message.error(error.response?.data?.message || 'Lỗi khi xóa sự kiện');
        }
    };

    // ========== XEM CHI TIẾT ==========
    const handleView = (record) => {
        setSelectedRecord(record);
        setViewModalVisible(true);
    };

    // ========== CỘT BẢNG CHUNG ==========
    const getColumns = (showNhanKhau = false) => [
        { 
            title: 'ID', 
            dataIndex: 'id', 
            key: 'id',
            width: 70,
            sorter: (a, b) => a.id - b.id
        },
        { 
            title: 'Loại', 
            dataIndex: 'loaiSuKien', 
            key: 'loaiSuKien',
            width: 100,
            render: (text) => (
                <Tag color={text === 'Sinh' ? 'green' : 'red'} icon={text === 'Sinh' ? <HeartOutlined /> : <CloseCircleOutlined />}>
                    {text}
                </Tag>
            ),
            filters: [
                { text: 'Sinh', value: 'Sinh' },
                { text: 'Mất', value: 'Mất' }
            ],
            onFilter: (value, record) => record.loaiSuKien === value
        },
        ...(showNhanKhau ? [{ 
            title: 'Nhân khẩu', 
            key: 'nhanKhau',
            render: (_, record) => (
                record.nhanKhau ? (
                    <Space direction="vertical" size={0}>
                        <span style={{ fontWeight: 500 }}>{record.nhanKhau.hoTen}</span>
                        <span style={{ fontSize: '12px', color: '#888' }}>
                            CCCD: {record.nhanKhau.soCCCD}
                        </span>
                    </Space>
                ) : <Tag>Chưa cập nhật</Tag>
            ),
            sorter: (a, b) => (a.nhanKhau?.hoTen || '').localeCompare(b.nhanKhau?.hoTen || '')
        }] : []),
        { 
            title: 'Ngày ghi nhận', 
            dataIndex: 'ngayGhiNhan', 
            key: 'ngayGhiNhan',
            width: 140,
            render: (date) => (
                <Space>
                    <CalendarOutlined />
                    {dayjs(date).format('DD/MM/YYYY')}
                </Space>
            ),
            sorter: (a, b) => dayjs(a.ngayGhiNhan).unix() - dayjs(b.ngayGhiNhan).unix()
        },
        { 
            title: 'Ghi chú', 
            dataIndex: 'ghiChu', 
            key: 'ghiChu',
            ellipsis: true,
            render: (text) => (
                <span style={{ fontSize: '13px' }}>
                    {text || <Tag color="default">Không có</Tag>}
                </span>
            )
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 200,
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
                        onClick={() => navigate(`/dashboard/sukien/edit/${record.id}`)}
                    >
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Xóa sự kiện?"
                        description="Bạn có chắc chắn muốn xóa sự kiện này?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                    >
                        <Button 
                            danger
                            size="small"
                            icon={<DeleteOutlined />}
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            {/* ========== THỐNG KÊ ========== */}
            <Row gutter={16} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={8}>
                    <Card>
                        <Statistic
                            title="Sự kiện Sinh"
                            value={stats.sinh}
                            prefix={<HeartOutlined style={{ color: '#52c41a' }} />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card>
                        <Statistic
                            title="Sự kiện Mất"
                            value={stats.mat}
                            prefix={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
                            valueStyle={{ color: '#ff4d4f' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card>
                        <Statistic
                            title="Tổng số sự kiện"
                            value={stats.total}
                            prefix={<BarChartOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Card>
                <Row gutter={16} style={{ marginBottom: '16px' }}>
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
                    <Col xs={24} md={8}>
                        <RangePicker
                            style={{ width: '100%' }}
                            size="large"
                            format="DD/MM/YYYY"
                            placeholder={['Từ ngày', 'Đến ngày']}
                            onChange={handleDateRangeFilter}
                        />
                    </Col>
                    <Col xs={24} md={6} style={{ textAlign: 'right' }}>
                        <Button 
                            type="primary" 
                            size="large"
                            icon={<PlusOutlined />}
                            onClick={() => navigate('/dashboard/sukien/new')}
                            block
                        >
                            Ghi nhận sự kiện
                        </Button>
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
                                <HeartOutlined style={{ color: '#52c41a' }} />
                                <span style={{ marginLeft: '8px' }}>Sinh ({sinhList.length})</span>
                            </span>
                        } 
                        key="sinh"
                    >
                        <Table 
                            columns={getColumns(false)} 
                            dataSource={sinhList} 
                            rowKey="id" 
                            loading={loading}
                            pagination={{ 
                                pageSize: 10,
                                showSizeChanger: true,
                                showTotal: (total) => `Tổng ${total} sự kiện`
                            }}
                            bordered
                            scroll={{ x: 1000 }}
                        />
                    </TabPane>

                    <TabPane 
                        tab={
                            <span>
                                <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
                                <span style={{ marginLeft: '8px' }}>Mất ({matList.length})</span>
                            </span>
                        } 
                        key="mat"
                    >
                        <Table 
                            columns={getColumns(true)} // Hiện cột Nhân khẩu
                            dataSource={matList} 
                            rowKey="id" 
                            loading={loading}
                            pagination={{ 
                                pageSize: 10,
                                showSizeChanger: true,
                                showTotal: (total) => `Tổng ${total} sự kiện`
                            }}
                            bordered
                            scroll={{ x: 1200 }}
                        />
                    </TabPane>

                    <TabPane 
                        tab={
                            <span>
                                <BarChartOutlined />
                                <span style={{ marginLeft: '8px' }}>Tất cả ({sinhList.length + matList.length})</span>
                            </span>
                        } 
                        key="all"
                    >
                        <Table 
                            columns={getColumns(true)} 
                            dataSource={[...sinhList, ...matList]} 
                            rowKey="id" 
                            loading={loading}
                            pagination={{ 
                                pageSize: 10,
                                showSizeChanger: true,
                                showTotal: (total) => `Tổng ${total} sự kiện`
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
                        <EyeOutlined /> Chi tiết sự kiện {selectedRecord?.loaiSuKien}
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
                            navigate(`/dashboard/sukien/edit/${selectedRecord.id}`);
                        }}
                    >
                        Chỉnh sửa
                    </Button>
                ]}
                width={600}
            >
                {selectedRecord && (
                    <Descriptions bordered column={1}>
                        <Descriptions.Item label="ID">
                            {selectedRecord.id}
                        </Descriptions.Item>
                        <Descriptions.Item label="Loại sự kiện">
                            <Tag color={selectedRecord.loaiSuKien === 'Sinh' ? 'green' : 'red'}>
                                {selectedRecord.loaiSuKien}
                            </Tag>
                        </Descriptions.Item>
                        {selectedRecord.nhanKhau && (
                            <>
                                <Descriptions.Item label="Nhân khẩu">
                                    <strong>{selectedRecord.nhanKhau.hoTen}</strong>
                                </Descriptions.Item>
                                <Descriptions.Item label="CCCD">
                                    {selectedRecord.nhanKhau.soCCCD}
                                </Descriptions.Item>
                            </>
                        )}
                        <Descriptions.Item label="Ngày ghi nhận">
                            {dayjs(selectedRecord.ngayGhiNhan).format('DD/MM/YYYY')}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ghi chú">
                            {selectedRecord.ghiChu || <Tag>Không có</Tag>}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày tạo">
                            {selectedRecord.ngayTao ? dayjs(selectedRecord.ngayTao).format('DD/MM/YYYY') : 'N/A'}
                        </Descriptions.Item>
                    </Descriptions>
                )}
            </Modal>
        </div>
    );
};

export default SuKienNhanKhauListPage;