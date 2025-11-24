import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  message, 
  Space, 
  Card, 
  Modal, 
  Select, 
  Form, 
  Popconfirm,
  Tag,
  Alert,
  Spin,
  Row,
  Col,
  Descriptions,
  Divider,
  Input,
  DatePicker,
  Checkbox
} from 'antd';
import { 
  ArrowLeftOutlined, 
  UserSwitchOutlined, 
  DeleteOutlined,
  UserAddOutlined,
  UserOutlined,
  IdcardOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  CalendarOutlined,
  ManOutlined,
  WomanOutlined,
  SplitCellsOutlined,
  EditOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

const ThanhVienHoListPage = () => {
    const { hoKhauId } = useParams();
    const navigate = useNavigate();

    const [hoKhauInfo, setHoKhauInfo] = useState(null);
    const [thanhVienList, setThanhVienList] = useState([]);
    const [allNhanKhau, setAllNhanKhau] = useState([]); // Tất cả nhân khẩu (để chọn chủ hộ mới)
    const [availableNhanKhau, setAvailableNhanKhau] = useState([]); // Nhân khẩu chưa thuộc hộ nào (để thêm thành viên)
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isAddMemberModalVisible, setIsAddMemberModalVisible] = useState(false);
    const [isTachHoModalVisible, setIsTachHoModalVisible] = useState(false);
    const [selectedThanhVien, setSelectedThanhVien] = useState([]);
    const [changeChuHoStep, setChangeChuHoStep] = useState(1); // Bước trong modal thay đổi chủ hộ
    const [newChuHoId, setNewChuHoId] = useState(null); // ID chủ hộ mới được chọn
    const [quanHeData, setQuanHeData] = useState([]); // Dữ liệu quan hệ của các thành viên
    const [form] = Form.useForm();
    const [addMemberForm] = Form.useForm();
    const [tachHoForm] = Form.useForm();

    // ========== FETCH DATA ==========
    const fetchData = async () => {
        setLoading(true);
        try {
            // 1. Lấy thông tin Hộ khẩu
            const hoKhauRes = await apiClient.get(`/hokhau/${hoKhauId}`);
            console.log('📥 Hộ khẩu info:', hoKhauRes.data);
            setHoKhauInfo(hoKhauRes.data);

            // 2. Lấy danh sách thành viên (từ API riêng)
            const thanhVienRes = await apiClient.get(`/hokhau/${hoKhauId}/thanhvien`);
            console.log('📥 Thành viên list:', thanhVienRes.data);
            setThanhVienList(thanhVienRes.data);

            // 3. Lấy TẤT CẢ nhân khẩu (để chọn chủ hộ mới)
            const allNkRes = await apiClient.get('/nhankhau');
            setAllNhanKhau(allNkRes.data);
            
            // 4. Lấy nhân khẩu CHƯA thuộc hộ nào (để thêm thành viên)
            const availableNkRes = await apiClient.get('/nhankhau/available');
            console.log('📥 Available nhân khẩu:', availableNkRes.data);
            setAvailableNhanKhau(availableNkRes.data);

        } catch (error) {
            console.error('❌ Error fetching data:', error);
            message.error('Lỗi tải dữ liệu Hộ khẩu');
            navigate('/dashboard/hokhau');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (hoKhauId) {
            fetchData();
        }
    }, [hoKhauId]);

    // ========== THAY ĐỔI CHỦ HỘ ==========
    const handleSelectNewChuHo = (values) => {
        const selectedChuHoId = values.newChuHoId;
        
        if (!hoKhauInfo || !hoKhauInfo.chuHo) {
            message.error('Không tìm thấy thông tin Chủ hộ hiện tại');
            return;
        }

        if (selectedChuHoId === hoKhauInfo.chuHo.id) {
            message.warning('Chủ hộ mới trùng với Chủ hộ hiện tại!');
            return;
        }

        // Lưu ID chủ hộ mới và chuyển sang bước 2
        setNewChuHoId(selectedChuHoId);
        
        // Khởi tạo dữ liệu quan hệ với giá trị mặc định
        const initialQuanHeData = thanhVienList.map(tv => ({
            nhanKhauId: tv.nhanKhau?.id,
            hoTen: tv.nhanKhau?.hoTen || 'N/A',
            quanHeVoiChuHo: tv.nhanKhau?.id === selectedChuHoId 
                ? 'Chủ hộ' 
                : (tv.quanHeVoiChuHo || 'Thành viên')
        }));
        setQuanHeData(initialQuanHeData);
        setChangeChuHoStep(2);
    };
    
    const handleUpdateChuHo = async () => {
        if (!newChuHoId || !hoKhauInfo) {
            message.error('Thiếu thông tin để cập nhật');
            return;
        }

        setLoading(true);
        try {
            // Tạo danh sách thanhVienQuanHeList
            const thanhVienQuanHeList = quanHeData.map(tv => ({
                nhanKhauId: tv.nhanKhauId,
                quanHeVoiChuHo: tv.quanHeVoiChuHo
            }));
            
            // Gọi API PUT /api/hokhau/{id} với UpdateHoKhauRequest
            const payload = {
                maSoHo: hoKhauInfo.maSoHo,
                chuHoId: newChuHoId,
                diaChi: hoKhauInfo.diaChi,
                ngayLap: hoKhauInfo.ngayLap,
                thanhVienQuanHeList: thanhVienQuanHeList
            };

            console.log('📤 Updating Chủ hộ with payload:', payload);

            await apiClient.put(`/hokhau/${hoKhauId}`, payload);

            message.success('✅ Thay đổi Chủ hộ thành công!');
            setIsModalVisible(false);
            setChangeChuHoStep(1);
            setNewChuHoId(null);
            setQuanHeData([]);
            form.resetFields();
            fetchData(); // Reload data

        } catch (error) {
            console.error('❌ Error updating Chủ hộ:', error);
            message.error(error.response?.data?.message || 'Lỗi khi thay đổi Chủ hộ');
        } finally {
            setLoading(false);
        }
    };

    // ========== THÊM THÀNH VIÊN ==========
    const handleAddMember = async (values) => {
        const { nhanKhauId, quanHe } = values;

        // Kiểm tra nhân khẩu đã có trong hộ khẩu chưa
        const isDuplicate = thanhVienList.some(tv => tv.nhanKhau?.id === nhanKhauId);
        if (isDuplicate) {
            message.warning('Nhân khẩu này đã có trong hộ khẩu!');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                hoKhau: { id: parseInt(hoKhauId) },
                nhanKhau: { id: nhanKhauId },
                quanHeVoiChuHo: quanHe
            };

            console.log('📤 Adding member:', payload);

            await apiClient.post('/thanhvienho', payload);

            message.success('✅ Thêm thành viên thành công!');
            setIsAddMemberModalVisible(false);
            addMemberForm.resetFields();
            fetchData();

        } catch (error) {
            console.error('❌ Error adding member:', error);
            message.error(error.response?.data?.message || 'Lỗi khi thêm thành viên');
        } finally {
            setLoading(false);
        }
    };

    // ========== TÁCH HỘ KHẨU ==========
    const handleTachHo = async (values) => {
        if (selectedThanhVien.length === 0) {
            message.warning('Vui lòng chọn ít nhất 1 thành viên để tách!');
            return;
        }

        if (selectedThanhVien.length >= thanhVienList.length) {
            message.error('Không thể tách hết thành viên! Hộ khẩu cũ phải còn ít nhất 1 người.');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                maSoHo: values.maSoHo,
                diaChi: values.diaChi,
                ngayLap: values.ngayLap ? values.ngayLap.format('YYYY-MM-DD') : null,
                chuHoMoiId: values.chuHoMoiId,
                thanhVienList: selectedThanhVien.map(nhanKhauId => {
                    const quanHe = values[`quanHe_${nhanKhauId}`] || 'Thành viên';
                    const ghiChu = values[`ghiChu_${nhanKhauId}`] || '';
                    return {
                        nhanKhauId: nhanKhauId,
                        quanHeVoiChuHo: quanHe,
                        ghiChu: ghiChu
                    };
                })
            };

            console.log('📤 Tách hộ payload:', payload);

            await apiClient.post(`/hokhau/${hoKhauId}/tach`, payload);

            message.success('✅ Tách hộ khẩu thành công!');
            setIsTachHoModalVisible(false);
            setSelectedThanhVien([]);
            tachHoForm.resetFields();
            
            // Quay về trang danh sách hộ khẩu
            navigate('/dashboard/hokhau');

        } catch (error) {
            console.error('❌ Error tách hộ:', error);
            const errorMsg = error.response?.data || error.response?.data?.message || 'Lỗi khi tách hộ khẩu';
            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    // ========== XÓA THÀNH VIÊN ==========
    const handleDeleteThanhVien = async (record) => {
        if (!record.id) {
            message.error('Không tìm thấy ID bản ghi thành viên');
            return;
        }

        // Không cho xóa Chủ hộ
        if (record.nhanKhau?.id === hoKhauInfo?.chuHo?.id) {
            message.error('Không thể xóa Chủ hộ! Vui lòng chuyển quyền Chủ hộ trước.');
            return;
        }

        setLoading(true);
        try {
            await apiClient.delete(`/thanhvienho/${record.id}`);
            message.success('✅ Xóa thành viên khỏi hộ khẩu thành công');
            fetchData();
        } catch (error) {
            console.error('❌ Error deleting member:', error);
            message.error(error.response?.data?.message || 'Lỗi khi xóa thành viên');
        } finally {
            setLoading(false);
        }
    };

    // ========== CỘT BẢNG ==========
    const columns = [
        { 
            title: 'ID', 
            dataIndex: ['nhanKhau', 'id'], 
            key: 'nhanKhauId',
            width: 80
        },
        { 
            title: 'Họ Tên', 
            dataIndex: ['nhanKhau', 'hoTen'], 
            key: 'hoTen',
            render: (text, record) => (
                <Space>
                    <span>{text}</span>
                    {record.nhanKhau?.id === hoKhauInfo?.chuHo?.id && (
                        <Tag color="red">Chủ hộ</Tag>
                    )}
                </Space>
            )
        },
        { 
            title: 'CCCD', 
            dataIndex: ['nhanKhau', 'soCCCD'], 
            key: 'soCCCD',
            width: 150
        },
        { 
            title: 'Quan hệ với Chủ hộ', 
            dataIndex: 'quanHeVoiChuHo', 
            key: 'quanHeVoiChuHo',
            width: 150,
            render: (text) => (
                <Tag color={text === 'Chủ hộ' ? 'red' : 'blue'}>{text}</Tag>
            )
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 150,
            align: 'center',
            render: (_, record) => {
                const isChuHo = record.nhanKhau?.id === hoKhauInfo?.chuHo?.id;
                
                return (
                    <Space size="small">
                        {isChuHo ? (
                            <Tag color="volcano">Không thể xóa</Tag>
                        ) : (
                            <Popconfirm
                                title="Xóa thành viên khỏi hộ khẩu?"
                                description="Nhân khẩu sẽ trở về trạng thái chưa có hộ khẩu."
                                onConfirm={() => handleDeleteThanhVien(record)}
                                okText="Xóa"
                                cancelText="Hủy"
                                okButtonProps={{ danger: true }}
                            >
                                <Button 
                                    danger 
                                    size="small"
                                    icon={<DeleteOutlined />}
                                >
                                    Xóa
                                </Button>
                            </Popconfirm>
                        )}
                    </Space>
                );
            },
        },
    ];

    if (loading && !hoKhauInfo) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '400px' 
            }}>
                <Spin size="large" tip="Đang tải dữ liệu..." />
            </div>
        );
    }

    return (
        <div style={{ padding: '24px' }}>
            <Card 
                title={
                    <h2 style={{ margin: 0, color: '#1890ff' }}>
                        Chi tiết Hộ khẩu: {hoKhauInfo?.maSoHo || 'N/A'}
                    </h2>
                }
                extra={
                    <Space>
                        <Button 
                            icon={<ArrowLeftOutlined />}
                            onClick={() => navigate('/dashboard/hokhau')}
                        >
                            Quay lại
                        </Button>
                        <Button 
                            type="default"
                            icon={<UserAddOutlined />}
                            onClick={() => setIsAddMemberModalVisible(true)}
                        >
                            Thêm thành viên
                        </Button>
                        <Button 
                            type="default"
                            icon={<SplitCellsOutlined />}
                            onClick={() => {
                                if (thanhVienList.length <= 1) {
                                    message.warning('Cần ít nhất 2 thành viên để có thể tách hộ!');
                                    return;
                                }
                                setIsTachHoModalVisible(true);
                            }}
                        >
                            Tách hộ
                        </Button>
                        <Button 
                            type="primary"
                            icon={<UserSwitchOutlined />}
                            onClick={() => setIsModalVisible(true)}
                        >
                            Thay đổi Chủ hộ
                        </Button>
                    </Space>
                }
            >
                {hoKhauInfo && (
                    <Alert
                        message={
                            <Space direction="vertical" size="small">
                                <span>
                                    <strong>Chủ hộ hiện tại:</strong> {hoKhauInfo.chuHo?.hoTen} 
                                    (ID: {hoKhauInfo.chuHo?.id}, CCCD: {hoKhauInfo.chuHo?.soCCCD})
                                </span>
                                <span>
                                    <strong>Địa chỉ:</strong> {hoKhauInfo.diaChi || 'Chưa cập nhật'}
                                </span>
                            </Space>
                        }
                        type="info"
                        showIcon
                        style={{ marginBottom: '16px' }}
                    />
                )}

                {/* ========== CARDS HIỂN THỊ THÔNG TIN CHI TIẾT ========== */}
                <Divider orientation="left">
                    <Space>
                        <UserOutlined />
                        Thông tin chi tiết thành viên
                    </Space>
                </Divider>

                <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                    {thanhVienList.map((thanhVien) => {
                        const nk = thanhVien.nhanKhau;
                        const isChuHo = nk?.id === hoKhauInfo?.chuHo?.id;
                        
                        return (
                            <Col xs={24} sm={24} md={12} lg={8} xl={8} key={thanhVien.id}>
                                <Card
                                    title={
                                        <Space>
                                            {nk?.gioiTinh === 'Nam' ? 
                                                <ManOutlined style={{ color: '#1890ff' }} /> : 
                                                <WomanOutlined style={{ color: '#ff4d4f' }} />
                                            }
                                            <strong>{nk?.hoTen || 'N/A'}</strong>
                                            {isChuHo && <Tag color="red">Chủ hộ</Tag>}
                                        </Space>
                                    }
                                    extra={
                                        <Space size="small">
                                            <Button 
                                                type="primary"
                                                size="small" 
                                                icon={<EditOutlined />}
                                                onClick={() => navigate(`/dashboard/nhankhau/form/edit/${nk?.id}`, {
                                                    state: { returnTo: `/dashboard/hokhau/details/${hoKhauId}` }
                                                })}
                                            >
                                                Sửa
                                            </Button>
                                            {!isChuHo && (
                                                <Popconfirm
                                                    title="Xóa thành viên?"
                                                    description="Thành viên sẽ rời khỏi hộ khẩu này"
                                                    onConfirm={() => handleDeleteThanhVien(thanhVien)}
                                                    okText="Xóa"
                                                    cancelText="Hủy"
                                                    okButtonProps={{ danger: true }}
                                                >
                                                    <Button 
                                                        danger 
                                                        size="small" 
                                                        icon={<DeleteOutlined />}
                                                    >
                                                        Xóa
                                                    </Button>
                                                </Popconfirm>
                                            )}
                                        </Space>
                                    }
                                    bordered
                                    hoverable
                                    style={{
                                        borderLeft: isChuHo ? '4px solid #ff4d4f' : '4px solid #1890ff',
                                        height: '100%'
                                    }}
                                >
                                    <Descriptions column={1} size="small" bordered>
                                        <Descriptions.Item 
                                            label={<Space><IdcardOutlined /> ID</Space>}
                                        >
                                            {nk?.id || 'N/A'}
                                        </Descriptions.Item>

                                        <Descriptions.Item 
                                            label={<Space><IdcardOutlined /> CCCD/CMND</Space>}
                                        >
                                            <Tag color="blue">{nk?.soCCCD || 'Chưa cập nhật'}</Tag>
                                        </Descriptions.Item>

                                        <Descriptions.Item 
                                            label={<Space><CalendarOutlined /> Ngày sinh</Space>}
                                        >
                                            {nk?.ngaySinh ? new Date(nk.ngaySinh).toLocaleDateString('vi-VN') : 'N/A'}
                                        </Descriptions.Item>

                                        <Descriptions.Item label="Giới tính">
                                            <Tag color={nk?.gioiTinh === 'Nam' ? 'blue' : 'pink'}>
                                                {nk?.gioiTinh || 'N/A'}
                                            </Tag>
                                        </Descriptions.Item>

                                        <Descriptions.Item label="Nơi sinh">
                                            {nk?.noiSinh || 'Chưa cập nhật'}
                                        </Descriptions.Item>

                                        <Descriptions.Item label="Nguyên quán">
                                            {nk?.nguyenQuan || 'Chưa cập nhật'}
                                        </Descriptions.Item>

                                        <Descriptions.Item label="Dân tộc">
                                            {nk?.danToc || 'Chưa cập nhật'}
                                        </Descriptions.Item>

                                        <Descriptions.Item label="Tôn giáo">
                                            {nk?.tonGiao || 'Chưa cập nhật'}
                                        </Descriptions.Item>

                                        <Descriptions.Item label="Quốc tịch">
                                            {nk?.quocTich || 'Việt Nam'}
                                        </Descriptions.Item>

                                        <Descriptions.Item 
                                            label={<Space><HomeOutlined /> Địa chỉ thường trú</Space>}
                                        >
                                            {nk?.diaChiThuongTru || 'Chưa cập nhật'}
                                        </Descriptions.Item>

                                        <Descriptions.Item 
                                            label={<Space><PhoneOutlined /> Số điện thoại</Space>}
                                        >
                                            <Tag color="green">{nk?.soDienThoai || 'Chưa cập nhật'}</Tag>
                                        </Descriptions.Item>

                                        <Descriptions.Item 
                                            label={<Space><MailOutlined /> Email</Space>}
                                        >
                                            {nk?.email || 'Chưa cập nhật'}
                                        </Descriptions.Item>

                                        <Descriptions.Item label="Nghề nghiệp">
                                            {nk?.ngheNghiep || 'Chưa cập nhật'}
                                        </Descriptions.Item>

                                        <Descriptions.Item label="Nơi làm việc">
                                            {nk?.noiLamViec || 'Chưa cập nhật'}
                                        </Descriptions.Item>

                                        <Descriptions.Item label="Trình độ học vấn">
                                            {nk?.trinhDoHocVan || 'Chưa cập nhật'}
                                        </Descriptions.Item>

                                        <Descriptions.Item 
                                            label={<strong>Quan hệ với Chủ hộ</strong>}
                                        >
                                            <Tag color={isChuHo ? 'red' : 'blue'}>
                                                {thanhVien.quanHeVoiChuHo || 'N/A'}
                                            </Tag>
                                        </Descriptions.Item>

                                        <Descriptions.Item label="Ghi chú">
                                            {nk?.ghiChu || 'Không có'}
                                        </Descriptions.Item>
                                    </Descriptions>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>

                {/* ========== BẢNG DANH SÁCH (Giữ lại để dễ quản lý) ========== */}
                <Divider orientation="left">
                    <Space>
                        Danh sách tóm tắt
                    </Space>
                </Divider>

                <Table 
                    columns={columns} 
                    dataSource={thanhVienList} 
                    rowKey="id" 
                    loading={loading}
                    pagination={{ 
                        pageSize: 10,
                        showTotal: (total) => `Tổng ${total} thành viên`
                    }}
                    bordered
                />
            </Card>

            {/* ========== MODAL THAY ĐỔI CHỦ HỘ ========== */}
            <Modal
                title={
                    <span>
                        <UserSwitchOutlined /> Thay đổi Chủ hộ 
                        {changeChuHoStep === 2 && ' - Bước 2: Chọn quan hệ'}
                    </span>
                }
                open={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    setChangeChuHoStep(1);
                    setNewChuHoId(null);
                    setQuanHeData([]);
                    form.resetFields();
                }}
                footer={null}
                width={changeChuHoStep === 2 ? 800 : 600}
            >
                {changeChuHoStep === 1 ? (
                    // BƯỚC 1: CHỌN CHỦ HỘ MỚI
                    <>
                        <Alert 
                            message="Lưu ý quan trọng" 
                            description="Thao tác này sẽ cập nhật Chủ hộ của toàn bộ hộ khẩu. Chủ hộ mới phải là thành viên hiện có trong hộ khẩu." 
                            type="warning" 
                            showIcon 
                            style={{ marginBottom: 20 }}
                        />

                        <Form 
                            form={form} 
                            onFinish={handleSelectNewChuHo} 
                            layout="vertical"
                        >
                            <Form.Item
                                name="newChuHoId"
                                label="Chọn Chủ hộ mới"
                                rules={[{ required: true, message: 'Vui lòng chọn Chủ hộ mới!' }]}
                            >
                                <Select 
                                    showSearch 
                                    placeholder="Tìm kiếm thành viên trong hộ khẩu"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {thanhVienList
                                        .filter(tv => tv.nhanKhau?.id !== hoKhauInfo?.chuHo?.id) // Loại trừ chủ hộ hiện tại
                                        .map(tv => (
                                            <Option key={tv.nhanKhau.id} value={tv.nhanKhau.id}>
                                                {tv.nhanKhau.hoTen} (ID: {tv.nhanKhau.id}, CCCD: {tv.nhanKhau.soCCCD})
                                            </Option>
                                        ))
                                    }
                                </Select>
                            </Form.Item>

                            <Form.Item style={{ marginBottom: 0 }}>
                                <Space>
                                    <Button 
                                        type="primary" 
                                        htmlType="submit"
                                    >
                                        Tiếp theo
                                    </Button>
                                    <Button onClick={() => {
                                        setIsModalVisible(false);
                                        form.resetFields();
                                    }}>
                                        Hủy
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    </>
                ) : (
                    // BƯỚC 2: CHỌN QUAN HỆ CỦA CÁC THÀNH VIÊN
                    <>
                        <Alert 
                            message="Chọn quan hệ của các thành viên với Chủ hộ mới" 
                            description="Chủ hộ mới sẽ tự động được set là 'Chủ hộ'. Vui lòng cập nhật quan hệ cho các thành viên khác."
                            type="info" 
                            showIcon 
                            style={{ marginBottom: 20 }}
                        />

                        <Table
                            dataSource={quanHeData}
                            rowKey="nhanKhauId"
                            pagination={false}
                            size="small"
                            columns={[
                                {
                                    title: 'Họ tên',
                                    dataIndex: 'hoTen',
                                    key: 'hoTen',
                                    render: (text, record) => (
                                        <Space>
                                            <span>{text}</span>
                                            {record.nhanKhauId === newChuHoId && (
                                                <Tag color="red">Chủ hộ mới</Tag>
                                            )}
                                        </Space>
                                    )
                                },
                                {
                                    title: 'Quan hệ với Chủ hộ mới',
                                    key: 'quanHeVoiChuHo',
                                    render: (_, record) => (
                                        <Select
                                            value={record.quanHeVoiChuHo}
                                            disabled={record.nhanKhauId === newChuHoId} // Chủ hộ mới luôn là "Chủ hộ"
                                            style={{ width: '100%' }}
                                            onChange={(value) => {
                                                const newData = quanHeData.map(item => 
                                                    item.nhanKhauId === record.nhanKhauId 
                                                        ? { ...item, quanHeVoiChuHo: value }
                                                        : item
                                                );
                                                setQuanHeData(newData);
                                            }}
                                        >
                                            <Option value="Chủ hộ">Chủ hộ</Option>
                                            <Option value="Vợ">Vợ</Option>
                                            <Option value="Chồng">Chồng</Option>
                                            <Option value="Con">Con</Option>
                                            <Option value="Cha">Cha</Option>
                                            <Option value="Mẹ">Mẹ</Option>
                                            <Option value="Anh">Anh</Option>
                                            <Option value="Chị">Chị</Option>
                                            <Option value="Em">Em</Option>
                                            <Option value="Ông">Ông</Option>
                                            <Option value="Bà">Bà</Option>
                                            <Option value="Cháu">Cháu</Option>
                                            <Option value="Thành viên">Thành viên</Option>
                                        </Select>
                                    )
                                }
                            ]}
                        />

                        <div style={{ marginTop: 20 }}>
                            <Space>
                                <Button 
                                    type="primary" 
                                    onClick={handleUpdateChuHo}
                                    loading={loading}
                                >
                                    Xác nhận Thay đổi
                                </Button>
                                <Button onClick={() => {
                                    setChangeChuHoStep(1);
                                    setNewChuHoId(null);
                                    setQuanHeData([]);
                                }}>
                                    Quay lại
                                </Button>
                                <Button onClick={() => {
                                    setIsModalVisible(false);
                                    setChangeChuHoStep(1);
                                    setNewChuHoId(null);
                                    setQuanHeData([]);
                                    form.resetFields();
                                }}>
                                    Hủy
                                </Button>
                            </Space>
                        </div>
                    </>
                )}
            </Modal>

            {/* ========== MODAL THÊM THÀNH VIÊN ========== */}
            <Modal
                title={<span><UserAddOutlined /> Thêm thành viên vào Hộ khẩu</span>}
                open={isAddMemberModalVisible}
                onCancel={() => {
                    setIsAddMemberModalVisible(false);
                    addMemberForm.resetFields();
                }}
                footer={null}
                width={600}
            >
                <Alert 
                    message="Chọn nhân khẩu và quan hệ với Chủ hộ" 
                    type="info" 
                    showIcon 
                    style={{ marginBottom: 20 }}
                />

                <Form 
                    form={addMemberForm} 
                    onFinish={handleAddMember} 
                    layout="vertical"
                >
                    <Form.Item
                        name="nhanKhauId"
                        label="Chọn Nhân khẩu"
                        rules={[{ required: true, message: 'Vui lòng chọn Nhân khẩu!' }]}
                    >
                        <Select 
                            showSearch 
                            placeholder="Tìm kiếm nhân khẩu (Họ tên, CCCD)"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {availableNhanKhau.map(nk => (
                                <Option key={nk.id} value={nk.id}>
                                    {nk.hoTen} (ID: {nk.id}, CCCD: {nk.soCCCD})
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="quanHe"
                        label="Quan hệ với Chủ hộ"
                        rules={[{ required: true, message: 'Vui lòng chọn quan hệ!' }]}
                    >
                        <Select placeholder="Chọn quan hệ">
                            <Option value="Vợ/Chồng">Vợ/Chồng</Option>
                            <Option value="Con">Con</Option>
                            <Option value="Bố/Mẹ">Bố/Mẹ</Option>
                            <Option value="Anh/Chị/Em">Anh/Chị/Em</Option>
                            <Option value="Ông/Bà">Ông/Bà</Option>
                            <Option value="Cháu">Cháu</Option>
                            <Option value="Khác">Khác</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0 }}>
                        <Space>
                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                loading={loading}
                            >
                                Thêm thành viên
                            </Button>
                            <Button onClick={() => {
                                setIsAddMemberModalVisible(false);
                                addMemberForm.resetFields();
                            }}>
                                Hủy
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* ========== MODAL TÁCH HỘ KHẨU ========== */}
            <Modal
                title={<span><SplitCellsOutlined /> Tách hộ khẩu</span>}
                open={isTachHoModalVisible}
                onCancel={() => {
                    setIsTachHoModalVisible(false);
                    setSelectedThanhVien([]);
                    tachHoForm.resetFields();
                }}
                footer={null}
                width={800}
            >
                <Alert 
                    message="Chú ý quan trọng" 
                    description={
                        <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
                            <li>Chọn thành viên muốn tách sang hộ mới</li>
                            <li>Hộ khẩu cũ phải còn ít nhất 1 người</li>
                            <li>Phải chọn chủ hộ cho hộ mới từ danh sách thành viên đã chọn</li>
                            <li>Chủ hộ cũ (nếu bị tách) sẽ tự động được thay thế</li>
                        </ul>
                    }
                    type="warning" 
                    showIcon 
                    style={{ marginBottom: 20 }}
                />

                <Form 
                    form={tachHoForm} 
                    onFinish={handleTachHo} 
                    layout="vertical"
                >
                    {/* BƯỚC 1: CHỌN THÀNH VIÊN */}
                    <Divider orientation="left">Bước 1: Chọn thành viên tách</Divider>
                    
                    <Form.Item label="Danh sách thành viên">
                        <Checkbox.Group 
                            value={selectedThanhVien}
                            onChange={(values) => {
                                setSelectedThanhVien(values);
                                // Reset chủ hộ nếu không còn trong danh sách
                                const currentChuHo = tachHoForm.getFieldValue('chuHoMoiId');
                                if (currentChuHo && !values.includes(currentChuHo)) {
                                    tachHoForm.setFieldValue('chuHoMoiId', null);
                                }
                            }}
                            style={{ width: '100%' }}
                        >
                            <Row gutter={[16, 16]}>
                                {thanhVienList.map(tv => (
                                    <Col span={24} key={tv.nhanKhau?.id}>
                                        <Checkbox value={tv.nhanKhau?.id}>
                                            <Space>
                                                {tv.nhanKhau?.gioiTinh === 'Nam' ? 
                                                    <ManOutlined style={{ color: '#1890ff' }} /> : 
                                                    <WomanOutlined style={{ color: '#ff4d4f' }} />
                                                }
                                                <strong>{tv.nhanKhau?.hoTen}</strong>
                                                <Tag color="blue">{tv.nhanKhau?.soCCCD}</Tag>
                                                <Tag>{tv.quanHeVoiChuHo}</Tag>
                                                {tv.nhanKhau?.id === hoKhauInfo?.chuHo?.id && (
                                                    <Tag color="red">Chủ hộ hiện tại</Tag>
                                                )}
                                            </Space>
                                        </Checkbox>
                                    </Col>
                                ))}
                            </Row>
                        </Checkbox.Group>
                        {selectedThanhVien.length > 0 && (
                            <Alert 
                                message={`Đã chọn ${selectedThanhVien.length} thành viên. Hộ cũ sẽ còn ${thanhVienList.length - selectedThanhVien.length} người.`}
                                type="info"
                                style={{ marginTop: 16 }}
                            />
                        )}
                    </Form.Item>

                    {/* BƯỚC 2: THÔNG TIN HỘ MỚI */}
                    <Divider orientation="left">Bước 2: Thông tin hộ khẩu mới</Divider>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="maSoHo"
                                label="Mã số hộ mới"
                                rules={[{ required: true, message: 'Vui lòng nhập mã số hộ!' }]}
                            >
                                <Input placeholder="Ví dụ: HK002" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="ngayLap"
                                label="Ngày lập hộ"
                                rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
                            >
                                <DatePicker 
                                    style={{ width: '100%' }} 
                                    format="DD/MM/YYYY"
                                    placeholder="Chọn ngày lập"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="diaChi"
                        label="Địa chỉ hộ mới"
                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                    >
                        <Input placeholder="Số nhà, đường, phường, quận..." />
                    </Form.Item>

                    <Form.Item
                        name="chuHoMoiId"
                        label="Chủ hộ mới"
                        rules={[{ required: true, message: 'Vui lòng chọn chủ hộ!' }]}
                    >
                        <Select 
                            placeholder="Chọn chủ hộ từ danh sách đã chọn"
                            disabled={selectedThanhVien.length === 0}
                        >
                            {selectedThanhVien.map(nkId => {
                                const tv = thanhVienList.find(t => t.nhanKhau?.id === nkId);
                                return (
                                    <Option key={nkId} value={nkId}>
                                        {tv?.nhanKhau?.hoTen} (CCCD: {tv?.nhanKhau?.soCCCD})
                                    </Option>
                                );
                            })}
                        </Select>
                    </Form.Item>

                    {/* BƯỚC 3: QUAN HỆ VỚI CHỦ HỘ MỚI */}
                    <Divider orientation="left">Bước 3: Quan hệ với chủ hộ mới</Divider>

                    {selectedThanhVien.map(nkId => {
                        const tv = thanhVienList.find(t => t.nhanKhau?.id === nkId);
                        const isChuHoMoi = tachHoForm.getFieldValue('chuHoMoiId') === nkId;
                        
                        return (
                            <Row gutter={16} key={nkId} style={{ marginBottom: 16 }}>
                                <Col span={8}>
                                    <strong>{tv?.nhanKhau?.hoTen}</strong>
                                    {isChuHoMoi && <Tag color="red" style={{ marginLeft: 8 }}>Chủ hộ</Tag>}
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        name={`quanHe_${nkId}`}
                                        label="Quan hệ"
                                        initialValue={isChuHoMoi ? 'Chủ hộ' : 'Thành viên'}
                                        style={{ marginBottom: 0 }}
                                    >
                                        <Select 
                                            placeholder="Chọn quan hệ"
                                            disabled={isChuHoMoi}
                                        >
                                            <Option value="Chủ hộ">Chủ hộ</Option>
                                            <Option value="Vợ/Chồng">Vợ/Chồng</Option>
                                            <Option value="Con">Con</Option>
                                            <Option value="Bố/Mẹ">Bố/Mẹ</Option>
                                            <Option value="Anh/Chị/Em">Anh/Chị/Em</Option>
                                            <Option value="Ông/Bà">Ông/Bà</Option>
                                            <Option value="Cháu">Cháu</Option>
                                            <Option value="Thành viên">Thành viên</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        name={`ghiChu_${nkId}`}
                                        label="Ghi chú"
                                        style={{ marginBottom: 0 }}
                                    >
                                        <Input placeholder="Ghi chú (tùy chọn)" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        );
                    })}

                    <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
                        <Space>
                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                loading={loading}
                                disabled={selectedThanhVien.length === 0}
                            >
                                Xác nhận Tách hộ
                            </Button>
                            <Button onClick={() => {
                                setIsTachHoModalVisible(false);
                                setSelectedThanhVien([]);
                                tachHoForm.resetFields();
                            }}>
                                Hủy
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ThanhVienHoListPage;