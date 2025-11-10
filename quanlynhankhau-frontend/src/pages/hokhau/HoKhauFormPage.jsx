import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, message, DatePicker, Select } from 'antd';
import apiClient from '../../api/apiClient';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const { Option } = Select;

const HoKhauFormPage = () => {
    const { id, mode } = useParams();
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [nhanKhauList, setNhanKhauList] = useState([]); // Dùng cho Select Chủ hộ
    
    // Xác định chế độ
    const isEditMode = id && mode === 'edit';
    const title = isEditMode ? "Sửa đổi Sổ Hộ khẩu" : "Thêm mới Sổ Hộ khẩu";

    // 1. Fetch dữ liệu nhân khẩu để chọn Chủ hộ
    useEffect(() => {
        const fetchNhanKhaus = async () => {
            try {
                // Giả định API này trả về danh sách NhanKhau (ID, HoTen)
                const res = await apiClient.get('/nhankhau'); 
                setNhanKhauList(res.data);
            } catch (err) {
                message.error('Không thể tải danh sách Nhân khẩu để chọn Chủ hộ.');
            }
        };
        fetchNhanKhaus();
    }, []);

    // 2. Logic Lấy dữ liệu và Đổ vào Form (Chế độ Sửa)
    useEffect(() => {
        if (isEditMode) {
            apiClient.get(`/hokhau/${id}`)
                .then(res => {
                    let data = res.data;
                    
                    // Chuyển đổi ngày lập cho DatePicker
                    if (data.ngayLap) {
                         data.ngayLap = dayjs(data.ngayLap);
                    }
                    
                    // Lấy ID Chủ hộ từ đối tượng NhanKhau
                    data.idChuHo = data.chuHo ? data.chuHo.id : null; 

                    form.setFieldsValue(data);
                })
                .catch(err => message.error('Không tìm thấy hồ sơ Hộ khẩu.'));
        }
    }, [id, isEditMode, form]);

    // 3. Logic Xử lý Submit (POST hoặc PUT)
    const onFinish = async (values) => {
        setLoading(true);
        try {
            // Chuyển đổi ngày tháng về format chuẩn ISO
            if (values.ngayLap) {
                values.ngayLap = values.ngayLap.format('YYYY-MM-DD');
            }
            
            // Xây dựng lại đối tượng JSON gửi lên Back-end: Thay ID Chủ hộ bằng đối tượng NhanKhau
            const payload = {
                ...values,
                chuHo: { id: values.idChuHo } // Chỉ cần gửi ID của Nhân khẩu được chọn làm Chủ hộ
            };
            
            if (isEditMode) {
                // UPDATE: Gửi yêu cầu PUT /api/hokhau/{id}
                await apiClient.put(`/hokhau/${id}`, payload);
                message.success('Cập nhật Hộ khẩu thành công!');
            } else {
                // CREATE: Gửi yêu cầu POST /api/hokhau
                await apiClient.post('/hokhau', payload);
                message.success('Thêm mới Hộ khẩu thành công!');
            }
            navigate('/dashboard/hokhau'); 
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Lỗi server (Trùng Mã số Hộ?).';
            message.error(`Thao tác thất bại: ${errorMessage}`);
        } finally {
             setLoading(false);
        }
    };

    return (
        <Card title={title}>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item name="maSoHo" label="Mã Số Hộ" rules={[{ required: true }]}>
                    <Input disabled={isEditMode} /> 
                </Form.Item>
                
                <Form.Item 
                    name="idChuHo" 
                    label="Chủ Hộ" 
                    rules={[{ required: true, message: 'Vui lòng chọn Chủ hộ!' }]}
                    tooltip="Chủ hộ phải là một người đã có hồ sơ Nhân khẩu."
                >
                    <Select
                        showSearch
                        placeholder="Tìm kiếm và chọn Chủ hộ"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {nhanKhauList.map(nk => (
                            <Option key={nk.id} value={nk.id}>
                                {nk.hoTen} ({nk.soCCCD})
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                
                <Form.Item name="diaChi" label="Địa chỉ Thường trú" rules={[{ required: true }]}>
                    <Input.TextArea rows={2} />
                </Form.Item>
                
                <Form.Item name="ngayLap" label="Ngày Lập Sổ" rules={[{ required: true }]}>
                    <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item style={{ marginTop: 20 }}>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        {isEditMode ? 'Cập nhật' : 'Lưu Hộ khẩu'}
                    </Button>
                    <Button style={{ marginLeft: 8 }} onClick={() => navigate('/dashboard/hokhau')}>
                        Hủy
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};
export default HoKhauFormPage;