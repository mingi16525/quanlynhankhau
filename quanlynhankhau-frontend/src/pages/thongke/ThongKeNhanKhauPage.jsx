import React, { useState, useEffect } from 'react';
import { 
    Card, Row, Col, Statistic, DatePicker, Space, Button, Divider, 
    Table, Tag, Spin, Select, message 
} from 'antd';
import { 
    UserOutlined, ManOutlined, WomanOutlined, TeamOutlined,
    ReloadOutlined, BarChartOutlined, PieChartOutlined,
    HomeOutlined, LogoutOutlined
} from '@ant-design/icons';
import apiClient from '../../api/apiClient';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

const ThongKeNhanKhauPage = () => {
    const [loading, setLoading] = useState(false);
    const [thongKeData, setThongKeData] = useState(null);
    const [dateRange, setDateRange] = useState(null);
    const [selectedNhomTuoi, setSelectedNhomTuoi] = useState(null);
    const [danhSachTheoNhom, setDanhSachTheoNhom] = useState([]);

    // Fetch thống kê
    const fetchThongKe = async (tuNgay = null, denNgay = null) => {
        setLoading(true);
        try {
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
            
            const response = await apiClient.get(url);
            console.log('📊 Thống kê:', response.data);
            setThongKeData(response.data);
        } catch (error) {
            console.error('❌ Error fetching thống kê:', error);
            message.error('Lỗi khi tải dữ liệu thống kê');
        } finally {
            setLoading(false);
        }
    };

    // Fetch danh sách theo nhóm tuổi
    const fetchDanhSachTheoNhom = async (nhomTuoi) => {
        setLoading(true);
        try {
            const response = await apiClient.get(`/thongke/nhankhau/nhomtuoi/${nhomTuoi}`);
            console.log(`📋 Danh sách ${nhomTuoi}:`, response.data);
            setDanhSachTheoNhom(response.data);
        } catch (error) {
            console.error('❌ Error fetching danh sách:', error);
            message.error('Lỗi khi tải danh sách');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchThongKe();
    }, []);

    const handleDateRangeChange = (dates) => {
        setDateRange(dates);
        if (dates && dates.length === 2) {
            const tuNgay = dates[0].format('YYYY-MM-DD');
            const denNgay = dates[1].format('YYYY-MM-DD');
            fetchThongKe(tuNgay, denNgay);
        } else {
            fetchThongKe();
        }
    };

    const handleNhomTuoiChange = (value) => {
        setSelectedNhomTuoi(value);
        if (value) {
            fetchDanhSachTheoNhom(value);
        } else {
            setDanhSachTheoNhom([]);
        }
    };

    // Columns cho bảng danh sách
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 60,
        },
        {
            title: 'Họ tên',
            dataIndex: 'hoTen',
            key: 'hoTen',
            width: 180,
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'ngaySinh',
            key: 'ngaySinh',
            width: 120,
            render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : 'N/A',
        },
        {
            title: 'Tuổi',
            key: 'tuoi',
            width: 60,
            render: (_, record) => {
                if (!record.ngaySinh) return 'N/A';
                const tuoi = dayjs().diff(dayjs(record.ngaySinh), 'year');
                return tuoi;
            },
        },
        {
            title: 'Giới tính',
            dataIndex: 'gioiTinh',
            key: 'gioiTinh',
            width: 80,
            render: (gioiTinh) => (
                <Tag color={gioiTinh === 'Nam' ? 'blue' : 'pink'}>
                    {gioiTinh === 'Nam' ? <ManOutlined /> : <WomanOutlined />} {gioiTinh}
                </Tag>
            ),
        },
        {
            title: 'CCCD',
            dataIndex: 'soCCCD',
            key: 'soCCCD',
            width: 130,
        },
        {
            title: 'Tình trạng',
            dataIndex: 'tinhTrang',
            key: 'tinhTrang',
            width: 120,
            render: (tinhTrang) => {
                const colors = {
                    'Thường trú': 'green',
                    'Tạm trú': 'blue',
                    'Tạm vắng': 'orange',
                    'Đã chuyển đi': 'red',
                };
                return <Tag color={colors[tinhTrang] || 'default'}>{tinhTrang || 'N/A'}</Tag>;
            },
        },
    ];

    if (loading && !thongKeData) {
        return (
            <div style={{ textAlign: 'center', padding: '100px' }}>
                <Spin size="large" tip="Đang tải dữ liệu..." />
            </div>
        );
    }

    return (
        <div style={{ padding: '24px' }}>
            <h2>
                <BarChartOutlined /> Báo cáo thống kê Nhân khẩu
            </h2>

            {/* Bộ lọc */}
            <Card style={{ marginBottom: '24px' }}>
                <Space size="large" wrap>
                    <div>
                        <label style={{ marginRight: '8px' }}>Khoảng thời gian:</label>
                        <RangePicker
                            value={dateRange}
                            onChange={handleDateRangeChange}
                            format="DD/MM/YYYY"
                            placeholder={['Từ ngày', 'Đến ngày']}
                        />
                    </div>
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={() => {
                            setDateRange(null);
                            fetchThongKe();
                        }}
                    >
                        Làm mới
                    </Button>
                </Space>
            </Card>

            {thongKeData && (
                <>
                    {/* Thống kê tổng quan */}
                    <Divider orientation="left">
                        <PieChartOutlined /> Tổng quan
                    </Divider>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <Card>
                                <Statistic
                                    title="Tổng số nhân khẩu"
                                    value={thongKeData.tongSo}
                                    prefix={<UserOutlined />}
                                    valueStyle={{ color: '#1890ff' }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <Card>
                                <Statistic
                                    title="Nam"
                                    value={thongKeData.soNam}
                                    prefix={<ManOutlined />}
                                    valueStyle={{ color: '#52c41a' }}
                                    suffix={`/ ${thongKeData.tongSo > 0 ? ((thongKeData.soNam / thongKeData.tongSo) * 100).toFixed(1) : 0}%`}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <Card>
                                <Statistic
                                    title="Nữ"
                                    value={thongKeData.soNu}
                                    prefix={<WomanOutlined />}
                                    valueStyle={{ color: '#eb2f96' }}
                                    suffix={`/ ${thongKeData.tongSo > 0 ? ((thongKeData.soNu / thongKeData.tongSo) * 100).toFixed(1) : 0}%`}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <Card>
                                <Statistic
                                    title="Độ tuổi lao động (18-60)"
                                    value={thongKeData.soLaoDong}
                                    prefix={<TeamOutlined />}
                                    valueStyle={{ color: '#faad14' }}
                                />
                            </Card>
                        </Col>
                    </Row>

                    {/* Thống kê theo độ tuổi */}
                    <Divider orientation="left" style={{ marginTop: '32px' }}>
                        📚 Thống kê theo nhóm tuổi
                    </Divider>
                    <Row gutter={[16, 16]}>
                        <Col xs={12} sm={8} md={6} lg={4}>
                            <Card hoverable onClick={() => handleNhomTuoiChange('MAM_NON')}>
                                <Statistic
                                    title="Mầm non (0-2)"
                                    value={thongKeData.soMamNon}
                                    valueStyle={{ color: '#722ed1', fontSize: '20px' }}
                                />
                            </Card>
                        </Col>
                        <Col xs={12} sm={8} md={6} lg={4}>
                            <Card hoverable onClick={() => handleNhomTuoiChange('MAU_GIAO')}>
                                <Statistic
                                    title="Mẫu giáo (3-5)"
                                    value={thongKeData.soMauGiao}
                                    valueStyle={{ color: '#eb2f96', fontSize: '20px' }}
                                />
                            </Card>
                        </Col>
                        <Col xs={12} sm={8} md={6} lg={4}>
                            <Card hoverable onClick={() => handleNhomTuoiChange('CAP_1')}>
                                <Statistic
                                    title="Cấp 1 (6-10)"
                                    value={thongKeData.soCap1}
                                    valueStyle={{ color: '#1890ff', fontSize: '20px' }}
                                />
                            </Card>
                        </Col>
                        <Col xs={12} sm={8} md={6} lg={4}>
                            <Card hoverable onClick={() => handleNhomTuoiChange('CAP_2')}>
                                <Statistic
                                    title="Cấp 2 (11-14)"
                                    value={thongKeData.soCap2}
                                    valueStyle={{ color: '#13c2c2', fontSize: '20px' }}
                                />
                            </Card>
                        </Col>
                        <Col xs={12} sm={8} md={6} lg={4}>
                            <Card hoverable onClick={() => handleNhomTuoiChange('CAP_3')}>
                                <Statistic
                                    title="Cấp 3 (15-17)"
                                    value={thongKeData.soCap3}
                                    valueStyle={{ color: '#52c41a', fontSize: '20px' }}
                                />
                            </Card>
                        </Col>
                        <Col xs={12} sm={8} md={6} lg={4}>
                            <Card hoverable onClick={() => handleNhomTuoiChange('NGHI_HUU')}>
                                <Statistic
                                    title="Nghỉ hưu (>60)"
                                    value={thongKeData.soNghiHuu}
                                    valueStyle={{ color: '#fa8c16', fontSize: '20px' }}
                                />
                            </Card>
                        </Col>
                    </Row>

                    {/* Thống kê tạm trú/tạm vắng */}
                    <Divider orientation="left" style={{ marginTop: '32px' }}>
                        <HomeOutlined /> Tạm trú / Tạm vắng
                    </Divider>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} md={8}>
                            <Card>
                                <Statistic
                                    title="Tạm trú"
                                    value={thongKeData.soTamTru}
                                    prefix={<HomeOutlined />}
                                    valueStyle={{ color: '#1890ff' }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Card>
                                <Statistic
                                    title="Tạm vắng"
                                    value={thongKeData.soTamVang}
                                    prefix={<LogoutOutlined />}
                                    valueStyle={{ color: '#faad14' }}
                                />
                            </Card>
                        </Col>
                    </Row>

                    {/* Danh sách theo nhóm tuổi được chọn */}
                    {selectedNhomTuoi && danhSachTheoNhom.length > 0 && (
                        <>
                            <Divider orientation="left" style={{ marginTop: '32px' }}>
                                📋 Danh sách nhân khẩu - {
                                    {
                                        'MAM_NON': 'Mầm non (0-2 tuổi)',
                                        'MAU_GIAO': 'Mẫu giáo (3-5 tuổi)',
                                        'CAP_1': 'Cấp 1 (6-10 tuổi)',
                                        'CAP_2': 'Cấp 2 (11-14 tuổi)',
                                        'CAP_3': 'Cấp 3 (15-17 tuổi)',
                                        'LAO_DONG': 'Lao động (18-60 tuổi)',
                                        'NGHI_HUU': 'Nghỉ hưu (>60 tuổi)',
                                    }[selectedNhomTuoi]
                                }
                            </Divider>
                            <Card>
                                <Space style={{ marginBottom: '16px' }}>
                                    <Select
                                        style={{ width: 200 }}
                                        placeholder="Chọn nhóm tuổi"
                                        value={selectedNhomTuoi}
                                        onChange={handleNhomTuoiChange}
                                        allowClear
                                    >
                                        <Option value="MAM_NON">Mầm non (0-2)</Option>
                                        <Option value="MAU_GIAO">Mẫu giáo (3-5)</Option>
                                        <Option value="CAP_1">Cấp 1 (6-10)</Option>
                                        <Option value="CAP_2">Cấp 2 (11-14)</Option>
                                        <Option value="CAP_3">Cấp 3 (15-17)</Option>
                                        <Option value="LAO_DONG">Lao động (18-60)</Option>
                                        <Option value="NGHI_HUU">Nghỉ hưu (&gt;60)</Option>
                                    </Select>
                                </Space>
                                <Table
                                    dataSource={danhSachTheoNhom}
                                    columns={columns}
                                    rowKey="id"
                                    pagination={{ pageSize: 10 }}
                                    loading={loading}
                                    scroll={{ x: 1000 }}
                                />
                            </Card>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default ThongKeNhanKhauPage;
