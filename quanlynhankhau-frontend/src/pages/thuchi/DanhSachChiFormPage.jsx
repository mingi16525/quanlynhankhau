import React, { useState, useEffect } from 'react';
import { Card, Form, Input, InputNumber, Button, message, DatePicker, Select, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import chiApi from '../../api/chiApi';
import { PermissionCheck } from '../../components/PermissionCheck';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

const DanhSachChiFormPage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const isEdit = Boolean(id);

    // Danh sách loại chi
    const loaiChiOptions = [
        'Sửa chữa',
        'Điện nước',
        'Vệ sinh',
        'An ninh',
        'Sự kiện',
        'Khác'
    ];

    // Load dữ liệu khi edit
    useEffect(() => {
        if (isEdit) {
            fetchData();
        }
    }, [id]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await chiApi.getById(id);
            const data = response.data;
            
            form.setFieldsValue({
                ...data,
                ngayChi: data.ngayChi ? dayjs(data.ngayChi) : null,
            });
        } catch (error) {
            console.error('Error fetching data:', error);
            message.error('Không thể tải thông tin khoản chi!');
            navigate('/dashboard/danhsachchi');
        } finally {
            setLoading(false);
        }
    };

    // Xử lý submit
    const onFinish = async (values) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
                ngayChi: values.ngayChi ? values.ngayChi.format('YYYY-MM-DDTHH:mm:ss') : dayjs().format('YYYY-MM-DDTHH:mm:ss'),
            };

            if (isEdit) {
                await chiApi.update(id, payload);
                message.success('Cập nhật khoản chi thành công!');
            } else {
                await chiApi.create(payload);
                message.success('Thêm mới khoản chi thành công!');
            }

            navigate('/dashboard/danhsachchi');
        } catch (error) {
            console.error('Error saving:', error);
            const errorMessage = error.response?.data?.message || 'Thao tác thất bại.';
            message.error(`Lỗi: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <PermissionCheck permission={isEdit ? "DANH_SACH_CHI:UPDATE" : "DANH_SACH_CHI:CREATE"}>
            <Card
                title={isEdit ? 'Cập Nhật Khoản Chi' : 'Ghi Nhận Khoản Chi Mới'}
                style={{ maxWidth: 800, margin: 'auto' }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{
                        ngayChi: dayjs(),
                        loaiChi: 'Khác'
                    }}
                >
                    <Form.Item
                        name="noiDungChi"
                        label="Nội dung chi"
                        rules={[{ required: true, message: 'Vui lòng nhập nội dung chi!' }]}
                    >
                        <TextArea
                            rows={3}
                            placeholder="Ví dụ: Mua vật tư văn phòng, Thanh toán tiền điện..."
                        />
                    </Form.Item>

                    <Form.Item
                        name="soTien"
                        label="Số tiền (VND)"
                        rules={[
                            { required: true, message: 'Vui lòng nhập số tiền!' },
                            { type: 'number', min: 1, message: 'Số tiền phải lớn hơn 0!' }
                        ]}
                    >
                        <InputNumber
                            min={1}
                            style={{ width: '100%' }}
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            step={10000}
                            placeholder="Nhập số tiền"
                        />
                    </Form.Item>

                    <Form.Item
                        name="loaiChi"
                        label="Loại chi"
                        rules={[{ required: true, message: 'Vui lòng chọn loại chi!' }]}
                    >
                        <Select placeholder="Chọn loại chi">
                            {loaiChiOptions.map(loai => (
                                <Option key={loai} value={loai}>{loai}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="ngayChi"
                        label="Ngày chi"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày chi!' }]}
                    >
                        <DatePicker
                            showTime
                            format="DD/MM/YYYY HH:mm:ss"
                            style={{ width: '100%' }}
                            placeholder="Chọn ngày chi"
                        />
                    </Form.Item>

                    <Form.Item
                        name="nguoiThucHien"
                        label="Người thực hiện"
                    >
                        <Input placeholder="Tên người thực hiện chi tiền" />
                    </Form.Item>

                    <Form.Item
                        name="ghiChu"
                        label="Ghi chú"
                    >
                        <TextArea rows={3} placeholder="Ghi chú thêm về khoản chi..." />
                    </Form.Item>

                    <Form.Item style={{ marginTop: 24 }}>
                        <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
                            {isEdit ? 'Cập nhật' : 'Lưu khoản chi'}
                        </Button>
                        <Button onClick={() => navigate('/dashboard/danhsachchi')}>
                            Hủy
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </PermissionCheck>
    );
};

export default DanhSachChiFormPage;