import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Input, Select, DatePicker, message, Popconfirm, Tag, Statistic, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, DollarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import chiApi from '../../api/chiApi';
import { PermissionCheck } from '../../components/PermissionCheck';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

const DanhSachChiListPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [selectedLoai, setSelectedLoai] = useState('');
    const [dateRange, setDateRange] = useState([null, null]);
    const [thongKe, setThongKe] = useState({
        tongSoKhoanChi: 0,
        tongTienChi: 0,
        chiTheoLoai: {}
    });

    // Danh sách loại chi
    const loaiChiOptions = [
        'Sửa chữa',
        'Điện nước',
        'Vệ sinh',
        'An ninh',
        'Sự kiện',
        'Khác'
    ];

    // Load dữ liệu
    useEffect(() => {
        fetchData();
        fetchThongKe();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await chiApi.getAll();
            const data = response.data || [];
            setDataSource(data);
            setFilteredData(data);
        } catch (error) {
            console.error('Error fetching data:', error);
            message.error('Không thể tải danh sách chi!');
        } finally {
            setLoading(false);
        }
    };

    const fetchThongKe = async () => {
        try {
            const response = await chiApi.getThongKe();
            setThongKe(response.data || {});
        } catch (error) {
            console.error('Error fetching statistics:', error);
        }
    };

    // Lọc dữ liệu
    useEffect(() => {
        let filtered = [...dataSource];

        // Lọc theo từ khóa
        if (searchKeyword) {
            filtered = filtered.filter(item =>
                item.noiDungChi?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                item.nguoiThucHien?.toLowerCase().includes(searchKeyword.toLowerCase())
            );
        }

        // Lọc theo loại
        if (selectedLoai) {
            filtered = filtered.filter(item => item.loaiChi === selectedLoai);
        }

        // Lọc theo khoảng thời gian
        if (dateRange[0] && dateRange[1]) {
            filtered = filtered.filter(item => {
                const ngayChi = dayjs(item.ngayChi);
                return ngayChi.isAfter(dateRange[0]) && ngayChi.isBefore(dateRange[1]);
            });
        }

        setFilteredData(filtered);
    }, [searchKeyword, selectedLoai, dateRange, dataSource]);

    // Xóa khoản chi
    const handleDelete = async (id) => {
        try {
            await chiApi.delete(id);
            message.success('Xóa khoản chi thành công!');
            fetchData();
            fetchThongKe();
        } catch (error) {
            console.error('Error deleting:', error);
            message.error('Xóa khoản chi thất bại!');
        }
    };

    // Reset bộ lọc
    const handleReset = () => {
        setSearchKeyword('');
        setSelectedLoai('');
        setDateRange([null, null]);
        setFilteredData(dataSource);
    };

    // Định nghĩa cột
    const columns = [
        {
            title: 'STT',
            key: 'stt',
            width: 60,
            render: (_, __, index) => index + 1,
        },
        {
            title: 'Nội dung chi',
            dataIndex: 'noiDungChi',
            key: 'noiDungChi',
            ellipsis: true,
        },
        {
            title: 'Số tiền',
            dataIndex: 'soTien',
            key: 'soTien',
            width: 150,
            render: (soTien) => (
                <span style={{ fontWeight: 'bold', color: '#cf1322' }}>
                    {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                    }).format(soTien)}
                </span>
            ),
        },
        {
            title: 'Loại chi',
            dataIndex: 'loaiChi',
            key: 'loaiChi',
            width: 120,
            render: (loai) => {
                const colorMap = {
                    'Sửa chữa': 'orange',
                    'Điện nước': 'blue',
                    'Vệ sinh': 'green',
                    'An ninh': 'red',
                    'Sự kiện': 'purple',
                    'Khác': 'default'
                };
                return <Tag color={colorMap[loai] || 'default'}>{loai}</Tag>;
            },
        },
        {
            title: 'Ngày chi',
            dataIndex: 'ngayChi',
            key: 'ngayChi',
            width: 150,
            render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm'),
        },
        {
            title: 'Người thực hiện',
            dataIndex: 'nguoiThucHien',
            key: 'nguoiThucHien',
            width: 150,
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 120,
            fixed: 'right',
            render: (_, record) => (
                <Space size="small">
                    <PermissionCheck permission="DANH_SACH_CHI:UPDATE">
                        <Button
                            type="link"
                            icon={<EditOutlined />}
                            onClick={() => navigate(`/dashboard/danhsachchi/edit/${record.id}`)}
                        >
                            Sửa
                        </Button>
                    </PermissionCheck>
                    <PermissionCheck permission="DANH_SACH_CHI:DELETE">
                        <Popconfirm
                            title="Xác nhận xóa?"
                            description="Bạn có chắc muốn xóa khoản chi này?"
                            onConfirm={() => handleDelete(record.id)}
                            okText="Xóa"
                            cancelText="Hủy"
                            okButtonProps={{ danger: true }}
                        >
                            <Button type="link" danger icon={<DeleteOutlined />}>
                                Xóa
                            </Button>
                        </Popconfirm>
                    </PermissionCheck>
                </Space>
            ),
        },
    ];

    return (
        <div>
            {/* Thống kê */}
            <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Tổng số khoản chi"
                            value={thongKe.tongSoKhoanChi}
                            prefix={<DollarOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Tổng tiền chi"
                            value={thongKe.tongTienChi}
                            precision={0}
                            valueStyle={{ color: '#cf1322' }}
                            prefix={<DollarOutlined />}
                            suffix="VND"
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Số loại chi"
                            value={Object.keys(thongKe.chiTheoLoai || {}).length}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Bảng danh sách */}
            <Card
                title="Danh Sách Chi Tiêu"
                extra={
                    <PermissionCheck permission="DANH_SACH_CHI:CREATE">
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => navigate('/dashboard/danhsachchi/create')}
                        >
                            Thêm khoản chi
                        </Button>
                    </PermissionCheck>
                }
            >
                {/* Bộ lọc */}
                <Space style={{ marginBottom: 16 }} wrap>
                    <Input
                        placeholder="Tìm kiếm nội dung, người thực hiện..."
                        prefix={<SearchOutlined />}
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        style={{ width: 300 }}
                        allowClear
                    />
                    <Select
                        placeholder="Chọn loại chi"
                        value={selectedLoai || undefined}
                        onChange={setSelectedLoai}
                        style={{ width: 150 }}
                        allowClear
                    >
                        {loaiChiOptions.map(loai => (
                            <Option key={loai} value={loai}>{loai}</Option>
                        ))}
                    </Select>
                    <RangePicker
                        value={dateRange}
                        onChange={setDateRange}
                        format="DD/MM/YYYY"
                        placeholder={['Từ ngày', 'Đến ngày']}
                    />
                    <Button onClick={handleReset}>Đặt lại</Button>
                </Space>

                {/* Bảng dữ liệu */}
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Tổng ${total} bản ghi`,
                    }}
                    scroll={{ x: 1200 }}
                />
            </Card>
        </div>
    );
};

export default DanhSachChiListPage;