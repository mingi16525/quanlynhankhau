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
  Spin
} from 'antd';
import { 
  ArrowLeftOutlined, 
  UserSwitchOutlined, 
  DeleteOutlined,
  UserAddOutlined 
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../api/apiClient';

const { Option } = Select;

const ThanhVienHoListPage = () => {
    const { hoKhauId } = useParams();
    const navigate = useNavigate();

    const [hoKhauInfo, setHoKhauInfo] = useState(null);
    const [thanhVienList, setThanhVienList] = useState([]);
    const [allNhanKhau, setAllNhanKhau] = useState([]); // Tất cả nhân khẩu (để chọn chủ hộ mới)
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isAddMemberModalVisible, setIsAddMemberModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [addMemberForm] = Form.useForm();

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
    const handleUpdateChuHo = async (values) => {
        const newChuHoId = values.newChuHoId;
        
        if (!hoKhauInfo || !hoKhauInfo.chuHo) {
            message.error('Không tìm thấy thông tin Chủ hộ hiện tại');
            return;
        }

        if (newChuHoId === hoKhauInfo.chuHo.id) {
            message.warning('Chủ hộ mới trùng với Chủ hộ hiện tại!');
            return;
        }

        setLoading(true);
        try {
            // Gọi API PUT /api/hokhau/{id} với payload cập nhật
            const payload = {
                ...hoKhauInfo,
                chuHo: { id: newChuHoId }
            };

            console.log('📤 Updating Chủ hộ:', payload);

            await apiClient.put(`/hokhau/${hoKhauId}`, payload);

            message.success('✅ Thay đổi Chủ hộ thành công!');
            setIsModalVisible(false);
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
                        Chi tiết Hộ khẩu: {hoKhauInfo?.soHoKhau || 'N/A'}
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
                title={<span><UserSwitchOutlined /> Thay đổi Chủ hộ</span>}
                open={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    form.resetFields();
                }}
                footer={null}
                width={600}
            >
                <Alert 
                    message="Lưu ý quan trọng" 
                    description="Thao tác này sẽ cập nhật Chủ hộ của toàn bộ hộ khẩu. Chủ hộ mới phải là thành viên hiện có trong hộ khẩu." 
                    type="warning" 
                    showIcon 
                    style={{ marginBottom: 20 }}
                />

                <Form 
                    form={form} 
                    onFinish={handleUpdateChuHo} 
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
                                loading={loading}
                            >
                                Xác nhận Thay đổi
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
                            {allNhanKhau
                                .filter(nk => !thanhVienList.some(tv => tv.nhanKhau?.id === nk.id)) // Loại trừ thành viên đã có
                                .map(nk => (
                                    <Option key={nk.id} value={nk.id}>
                                        {nk.hoTen} (ID: {nk.id}, CCCD: {nk.soCCCD})
                                    </Option>
                                ))
                            }
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
        </div>
    );
};

export default ThanhVienHoListPage;