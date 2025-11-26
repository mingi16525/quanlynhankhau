import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, message, DatePicker, Select, Modal, Table } from 'antd';
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
    const [filteredNhanKhau, setFilteredNhanKhau] = useState([]); // Danh sách đã lọc
    const [searchTimeout, setSearchTimeout] = useState(null);
    const [oldChuHoId, setOldChuHoId] = useState(null); // Lưu ID chủ hộ cũ
    const [thanhVienList, setThanhVienList] = useState([]); // Danh sách thành viên của hộ
    const [showQuanHeModal, setShowQuanHeModal] = useState(false); // Hiển thị modal chọn quan hệ
    const [tempFormValues, setTempFormValues] = useState(null); // Lưu tạm giá trị form
    const [quanHeData, setQuanHeData] = useState([]); // Dữ liệu quan hệ của các thành viên
    
    // Xác định chế độ
    const isEditMode = id && mode === 'edit';
    const title = isEditMode ? "Sửa đổi Sổ Hộ khẩu" : "Thêm mới Sổ Hộ khẩu";

    // 1. Fetch dữ liệu nhân khẩu để chọn Chủ hộ (CHỈ LẤY NGƯỜI CHƯA CÓ HỘ KHẨU)
    useEffect(() => {
        const fetchNhanKhaus = async () => {
            try {
                // Lấy danh sách nhân khẩu chưa có hộ khẩu (available)
                const res = await apiClient.get('/nhankhau/available'); 
                setNhanKhauList(res.data);
                setFilteredNhanKhau(res.data); // Hiển thị tất cả ban đầu
            } catch (err) {
                message.error('Không thể tải danh sách Nhân khẩu để chọn Chủ hộ.');
            }
        };
        
        // Chỉ fetch khi ở chế độ tạo mới
        if (!isEditMode) {
            fetchNhanKhaus();
        } else {
            // Ở chế độ edit, lấy tất cả nhân khẩu
            apiClient.get('/nhankhau')
                .then(res => {
                    setNhanKhauList(res.data);
                    setFilteredNhanKhau(res.data);
                })
                .catch(err => {
                    message.error('Không thể tải danh sách Nhân khẩu.');
                });
        }
    }, [isEditMode]);

    const handleSearch = (value) => {
        if (searchTimeout) clearTimeout(searchTimeout);
        
        if (!value || value.trim() === '') {
            setFilteredNhanKhau(nhanKhauList);
            return;
        }
        
        const timeout = setTimeout(() => {
            const searchValue = value.toLowerCase();
            const filtered = nhanKhauList.filter(nk => 
                nk.hoTen.toLowerCase().includes(searchValue) ||
                nk.soCCCD.includes(searchValue)
            );
            setFilteredNhanKhau(filtered);
        }, 300);
        
        setSearchTimeout(timeout);
    };

    // 2. Logic Lấy dữ liệu và Đổ vào Form (Chế độ Sửa)
    useEffect(() => {
        if (isEditMode) {
            // Lấy thông tin hộ khẩu
            apiClient.get(`/hokhau/${id}`)
                .then(res => {
                    let data = res.data;
                    
                    // Chuyển đổi ngày lập cho DatePicker
                    if (data.ngayLap) {
                         data.ngayLap = dayjs(data.ngayLap);
                    }
                    
                    // Lấy ID Chủ hộ từ đối tượng NhanKhau
                    const chuHoId = data.chuHo ? data.chuHo.id : null;
                    data.idChuHo = chuHoId;
                    setOldChuHoId(chuHoId); // Lưu ID chủ hộ cũ

                    form.setFieldsValue(data);
                })
                .catch(err => message.error('Không tìm thấy hồ sơ Hộ khẩu.'));
            
            // Lấy danh sách thành viên của hộ
            apiClient.get(`/thanhvienho/hokhau/${id}`)
                .then(res => {
                    setThanhVienList(res.data);
                })
                .catch(err => console.error('Không thể tải danh sách thành viên'));
        }
    }, [id, isEditMode, form]);

    // 3. Logic Xử lý Submit (POST hoặc PUT)
    const onFinish = async (values) => {
        // Kiểm tra nếu đang ở chế độ Edit và Chủ hộ thay đổi
        if (isEditMode && oldChuHoId && values.idChuHo !== oldChuHoId) {
            // Hiển thị modal để chọn quan hệ của các thành viên
            setTempFormValues(values);
            
            // Khởi tạo dữ liệu quan hệ với giá trị mặc định
            const initialQuanHeData = thanhVienList.map(tv => ({
                id: tv.id,
                nhanKhauId: tv.nhanKhau?.id,
                hoTen: tv.nhanKhau?.hoTen || 'N/A',
                quanHeVoiChuHo: tv.nhanKhau?.id === values.idChuHo 
                    ? 'Chủ hộ' 
                    : (tv.quanHeVoiChuHo || 'Thành viên')
            }));
            setQuanHeData(initialQuanHeData);
            setShowQuanHeModal(true);
            return;
        }
        
        // Nếu không thay đổi chủ hộ hoặc đang ở chế độ tạo mới, submit bình thường
        await submitForm(values);
    };
    
    // Hàm submit form thực tế
    const submitForm = async (values, thanhVienQuanHeList = null) => {
        setLoading(true);
        try {
            // Chuyển đổi ngày tháng về format chuẩn ISO
            if (values.ngayLap) {
                values.ngayLap = values.ngayLap.format('YYYY-MM-DD');
            }
            
            if (isEditMode) {
                // UPDATE: Gửi yêu cầu PUT /api/hokhau/{id} với UpdateHoKhauRequest
                const payload = {
                    maSoHo: values.maSoHo,
                    chuHoId: values.idChuHo,
                    diaChi: values.diaChi,
                    ngayLap: values.ngayLap,
                    thanhVienQuanHeList: thanhVienQuanHeList // Có thể null nếu không đổi chủ hộ
                };
                
                await apiClient.put(`/hokhau/${id}`, payload);
                message.success('Cập nhật Hộ khẩu thành công!');
            } else {
                // CREATE: Gửi yêu cầu POST /api/hokhau
                const payload = {
                    ...values,
                    chuHo: { id: values.idChuHo }
                };
                
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
    
    // Xử lý khi xác nhận modal quan hệ
    const handleQuanHeOk = () => {
        // Tạo danh sách thanhVienQuanHeList
        const thanhVienQuanHeList = quanHeData.map(tv => ({
            nhanKhauId: tv.nhanKhauId,
            quanHeVoiChuHo: tv.quanHeVoiChuHo
        }));
        
        setShowQuanHeModal(false);
        submitForm(tempFormValues, thanhVienQuanHeList);
    };
    
    // Cột cho bảng chọn quan hệ
    const quanHeColumns = [
        {
            title: 'Họ tên',
            dataIndex: 'hoTen',
            key: 'hoTen'
        },
        {
            title: 'Quan hệ với Chủ hộ mới',
            key: 'quanHeVoiChuHo',
            render: (_, record) => (
                <Select
                    value={record.quanHeVoiChuHo}
                    disabled={record.nhanKhauId === tempFormValues?.idChuHo} // Chủ hộ mới luôn là "Chủ hộ"
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
    ];

    return (
        <>
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
                            filterOption={false}
                            onSearch={handleSearch}
                            notFoundContent={filteredNhanKhau.length === 0 ? 'Không tìm thấy kết quả' : null}
                        >
                            {filteredNhanKhau.map(nk => (
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
            
            {/* Modal chọn quan hệ khi thay đổi chủ hộ */}
            <Modal
                title="Chọn quan hệ của các thành viên với Chủ hộ mới"
                open={showQuanHeModal}
                onOk={handleQuanHeOk}
                onCancel={() => setShowQuanHeModal(false)}
                width={700}
                okText="Xác nhận"
                cancelText="Hủy"
            >
                <p style={{ marginBottom: 16 }}>
                    Bạn đang thay đổi Chủ hộ. Vui lòng chọn quan hệ của các thành viên với Chủ hộ mới:
                </p>
                <Table
                    columns={quanHeColumns}
                    dataSource={quanHeData}
                    rowKey="nhanKhauId"
                    pagination={false}
                    size="small"
                />
            </Modal>
        </>
    );
};
export default HoKhauFormPage;