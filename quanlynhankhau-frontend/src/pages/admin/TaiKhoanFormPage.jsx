import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Select, message, Space, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import adminApi from '../../api/adminApi';

const { Option } = Select;

const TaiKhoanFormPage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { mode, id } = useParams(); // mode: 'edit', 'view' hoặc 'new'
    const [loading, setLoading] = useState(false);
    const [vaiTroList, setVaiTroList] = useState([]);
    const [initialData, setInitialData] = useState(null);

    const isEditMode = mode === 'edit';
    const isViewMode = mode === 'view';

    // Load danh sách vai trò
    const fetchVaiTro = async () => {
        try {
            const response = await adminApi.getVaiTro();
            console.log('Vai trò:', response.data);
            setVaiTroList(response.data);
        } catch (error) {
            console.error('Lỗi khi tải vai trò:', error);
            message.error('Không thể tải danh sách vai trò');
        }
    };

    // Load thông tin tài khoản (nếu sửa hoặc xem)
    const fetchTaiKhoan = async () => {
        if (!id) return;
        
        setLoading(true);
        try {
            const response = await apiClient.get(`/admin/taikhoan/${id}`);
            const data = response.data;
            console.log('Tài khoản:', data);
            
            setInitialData(data);
            form.setFieldsValue({
                tenDangNhap: data.tenDangNhap,
                vaiTroId: data.vaiTro?.id,
                trangThai: data.trangThai,
            });
        } catch (error) {
            console.error('Lỗi khi tải tài khoản:', error);
            message.error('Không thể tải thông tin tài khoản');
            navigate('/dashboard/admin/taikhoan');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVaiTro();
        if (isEditMode || isViewMode) {
            fetchTaiKhoan();
        }
    }, [id, isEditMode, isViewMode]);

    // Xử lý submit
    const onFinish = async (values) => {
        console.log('Form values:', values);
        setLoading(true);

        try {
            // Tìm tên vai trò từ ID
            const selectedVaiTro = vaiTroList.find(vt => vt.id === values.vaiTroId);
            const tenVaiTro = selectedVaiTro?.tenVaiTro;

            if (!tenVaiTro) {
                message.error('Vui lòng chọn vai trò');
                setLoading(false);
                return;
            }

            if (isEditMode) {
                // Cập nhật tài khoản
                const updateData = {
                    tenDangNhap: values.tenDangNhap,
                    trangThai: values.trangThai,
                };

                // Chỉ gửi mật khẩu nếu người dùng nhập mới
                if (values.matKhau && values.matKhau.trim() !== '') {
                    updateData.matKhau = values.matKhau;
                }

                await adminApi.updateTaiKhoanVaiTro(id, tenVaiTro, updateData);
                message.success('Cập nhật tài khoản thành công');
            } else {
                // Tạo tài khoản mới
                const newData = {
                    tenDangNhap: values.tenDangNhap,
                    matKhau: values.matKhau,
                    trangThai: values.trangThai || 'Active',
                };

                await adminApi.createTaiKhoan(tenVaiTro, newData);
                message.success('Tạo tài khoản thành công');
            }

            navigate('/dashboard/admin/taikhoan');
        } catch (error) {
            console.error('Lỗi khi lưu tài khoản:', error);
            const errorMsg = error.response?.data?.message || 'Có lỗi xảy ra';
            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    if ((isEditMode || isViewMode) && loading && !initialData) {
        return (
            <Card>
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <Spin size="large" />
                </div>
            </Card>
        );
    }

    return (
        <Card 
            title={
                isViewMode ? 'Xem chi tiết tài khoản' :
                isEditMode ? 'Sửa tài khoản' : 'Thêm tài khoản mới'
            }
            extra={
                <Button 
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/dashboard/admin/taikhoan')}
                >
                    Quay lại
                </Button>
            }
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    trangThai: 'Active'
                }}
                style={{ maxWidth: 600 }}
                disabled={isViewMode}
            >
                <Form.Item
                    label="Tên đăng nhập"
                    name="tenDangNhap"
                    rules={[
                        { required: true, message: 'Vui lòng nhập tên đăng nhập' },
                        { min: 3, message: 'Tên đăng nhập phải có ít nhất 3 ký tự' },
                        { 
                            pattern: /^[a-zA-Z0-9_]+$/, 
                            message: 'Tên đăng nhập chỉ chứa chữ cái, số và dấu gạch dưới' 
                        }
                    ]}
                >
                    <Input 
                        placeholder="Nhập tên đăng nhập"
                        disabled={isEditMode && initialData?.tenDangNhap === 'admin'}
                    />
                </Form.Item>

                {!isViewMode && (
                    <>
                        <Form.Item
                            label="Mật khẩu"
                            name="matKhau"
                            rules={[
                                { 
                                    required: !isEditMode, 
                                    message: 'Vui lòng nhập mật khẩu' 
                                },
                                { 
                                    min: 6, 
                                    message: 'Mật khẩu phải có ít nhất 6 ký tự' 
                                }
                            ]}
                            extra={isEditMode ? 'Để trống nếu không muốn đổi mật khẩu' : ''}
                        >
                            <Input.Password placeholder={isEditMode ? 'Nhập mật khẩu mới (nếu muốn đổi)' : 'Nhập mật khẩu'} />
                        </Form.Item>

                        <Form.Item
                            label="Xác nhận mật khẩu"
                            name="xacNhanMatKhau"
                            dependencies={['matKhau']}
                            rules={[
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        const matKhau = getFieldValue('matKhau');
                                        // Nếu không nhập mật khẩu (edit mode) thì không cần xác nhận
                                        if (!matKhau) {
                                            return Promise.resolve();
                                        }
                                        // Nếu có nhập mật khẩu thì phải xác nhận
                                        if (!value) {
                                            return Promise.reject(new Error('Vui lòng xác nhận mật khẩu'));
                                        }
                                        if (matKhau === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Mật khẩu xác nhận không khớp'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="Nhập lại mật khẩu" />
                        </Form.Item>
                    </>
                )}

                <Form.Item
                    label="Vai trò"
                    name="vaiTroId"
                    rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
                >
                    <Select 
                        placeholder="Chọn vai trò"
                        disabled={isEditMode && initialData?.tenDangNhap === 'admin'}
                    >
                        {vaiTroList.map(vt => (
                            <Option key={vt.id} value={vt.id}>
                                {vt.tenVaiTro}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Trạng thái"
                    name="trangThai"
                    rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
                >
                    <Select disabled={initialData?.tenDangNhap === 'admin'}>
                        <Option value="Active">Hoạt động</Option>
                        <Option value="Locked">Bị khóa</Option>
                    </Select>
                </Form.Item>

                {!isViewMode && (
                    <Form.Item>
                        <Space>
                            <Button 
                                type="primary" 
                                htmlType="submit"
                                icon={<SaveOutlined />}
                                loading={loading}
                            >
                                {isEditMode ? 'Cập nhật' : 'Tạo tài khoản'}
                            </Button>
                            <Button onClick={() => navigate('/dashboard/admin/taikhoan')}>
                                Hủy
                            </Button>
                        </Space>
                    </Form.Item>
                )}

                {isViewMode && (
                    <Form.Item>
                        <Space>
                            <Button 
                                type="primary"
                                onClick={() => navigate(`/dashboard/admin/taikhoan/form/edit/${id}`)}
                            >
                                Chỉnh sửa
                            </Button>
                            <Button onClick={() => navigate('/dashboard/admin/taikhoan')}>
                                Quay lại
                            </Button>
                        </Space>
                    </Form.Item>
                )}
            </Form>
        </Card>
    );
};

export default TaiKhoanFormPage;