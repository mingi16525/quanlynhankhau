import React, { useState, useEffect } from 'react';
import { 
  Form, 
  Input, 
  DatePicker, 
  Select, 
  Button, 
  Card, 
  message, 
  Space,
  Row,
  Col,
  Alert,
  Divider,
  Radio,
  Spin
} from 'antd';
import { 
  SaveOutlined, 
  RollbackOutlined,
  UserOutlined,
  HeartOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

const SuKienNhanKhauFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [allNhanKhau, setAllNhanKhau] = useState([]);
  const [filteredNhanKhau, setFilteredNhanKhau] = useState([]);
  const [loaiSuKien, setLoaiSuKien] = useState('Sinh');
  const [searchTimeout, setSearchTimeout] = useState(null);

  const isEditMode = !!id;

  const getTitle = () => {
    if (isEditMode) return 'Chỉnh sửa Sự kiện Nhân khẩu';
    return 'Ghi nhận Sự kiện Nhân khẩu';
  };

  // ========== FETCH DATA ==========
  useEffect(() => {
    fetchAllNhanKhau();
    if (isEditMode) {
      fetchRecord();
    }
  }, [id]);

  const fetchAllNhanKhau = async () => {
    try {
      const response = await apiClient.get('/nhankhau');
      setAllNhanKhau(response.data);
      setFilteredNhanKhau(response.data.filter(nk => nk.tinhTrang !== 'Đã mất'));
    } catch (error) {
      console.error('❌ Error fetching nhân khẩu:', error);
      message.error('Không thể tải danh sách nhân khẩu');
    }
  };

  const handleSearch = (value) => {
    // Clear timeout cũ
    if (searchTimeout) clearTimeout(searchTimeout);
    
    // Nếu input rỗng, hiển thị tất cả
    if (!value || value.trim() === '') {
      setFilteredNhanKhau(allNhanKhau.filter(nk => nk.tinhTrang !== 'Đã mất'));
      return;
    }
    
    // Set timeout mới - chỉ search sau 300ms người dùng dừng gõ
    const timeout = setTimeout(() => {
      const searchValue = value.toLowerCase();
      const filtered = allNhanKhau.filter(nk => {
        if (nk.tinhTrang === 'Đã mất') return false;
        return nk.hoTen.toLowerCase().includes(searchValue) ||
               nk.soCCCD.includes(searchValue);
      });
      setFilteredNhanKhau(filtered);
    }, 300);
    
    setSearchTimeout(timeout);
  };

  const fetchRecord = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/sukien/${id}`);
      console.log('📥 Loading record:', response.data);
      loadFormData(response.data);
    } catch (error) {
      console.error('❌ Error fetching record:', error);
      message.error('Không thể tải thông tin sự kiện');
      navigate('/dashboard/sukien');
    } finally {
      setLoading(false);
    }
  };

  const loadFormData = (data) => {
    const formData = {
      loaiSuKien: data.loaiSuKien,
      nhanKhauId: data.nhanKhau?.id,
      ngayGhiNhan: data.ngayGhiNhan ? dayjs(data.ngayGhiNhan) : null,
      ghiChu: data.ghiChu
    };

    setLoaiSuKien(data.loaiSuKien);
    form.setFieldsValue(formData);
    console.log('✅ Form loaded');
  };

  // ========== SUBMIT ==========
  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      const payload = {
        loaiSuKien: values.loaiSuKien,
        ngayGhiNhan: values.ngayGhiNhan ? values.ngayGhiNhan.format('YYYY-MM-DD') : null,
        ghiChu: values.ghiChu || null
      };

      if (values.loaiSuKien === 'Mất') {
        payload.nhanKhau = { id: values.nhanKhauId };
      }

      console.log('📤 Submitting sự kiện:', payload);

      let response;
      if (isEditMode) {
        response = await apiClient.put(`/sukien/${id}`, payload);
        message.success('✅ Cập nhật thành công');
        navigate('/dashboard/sukien');
      } else {
        response = await apiClient.post('/sukien', payload);
        message.success('✅ Ghi nhận sự kiện thành công');
        
        // Nếu là sự kiện SINH, chuyển đến trang thêm nhân khẩu mới
        if (values.loaiSuKien === 'Sinh') {
          console.log('🔄 Redirecting to add NhanKhau form...');
          navigate('/dashboard/nhankhau/form/new', {
            state: { 
              ngaySinh: values.ngayGhiNhan.format('YYYY-MM-DD'), // Truyền string thay vì dayjs object
              returnTo: '/dashboard/sukien'
            }
          });
        } else {
          navigate('/dashboard/sukien');
        }
      }

      console.log('✅ Response:', response.data);

    } catch (error) {
      console.error('❌ Error submitting:', error);
      
      if (error.response?.status === 400) {
        message.error('❌ Dữ liệu không hợp lệ');
      } else if (error.response?.status === 409) {
        message.error('❌ Nhân khẩu này đã được ghi nhận là đã mất');
      } else {
        message.error(error.response?.data?.message || 'Có lỗi xảy ra khi ghi nhận sự kiện');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/sukien');
  };

  if (loading) {
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
    <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
      <Card 
        title={
          <h2 style={{ margin: 0, color: '#1890ff' }}>
            {getTitle()}
          </h2>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark="optional"
          initialValues={{
            loaiSuKien: 'Sinh',
            ngayGhiNhan: dayjs()
          }}
        >
          {/* ========== LOẠI SỰ KIỆN ========== */}
          <Alert
            message="Chọn loại sự kiện"
            description={
              <ul style={{ marginBottom: 0, paddingLeft: '20px' }}>
                <li><strong>Sinh:</strong> Ghi nhận một nhân khẩu mới sinh ra</li>
                <li><strong>Mất:</strong> Ghi nhận nhân khẩu đã từ trần</li>
              </ul>
            }
            type="info"
            showIcon
            style={{ marginBottom: '24px' }}
          />

          <Form.Item
            name="loaiSuKien"
            label="Loại sự kiện"
            rules={[{ required: true, message: 'Vui lòng chọn loại sự kiện!' }]}
          >
            <Radio.Group 
              size="large"
              onChange={(e) => {
                setLoaiSuKien(e.target.value);
                form.setFieldsValue({ nhanKhauId: undefined });
              }}
              disabled={isEditMode} // Không cho đổi loại khi edit
            >
              <Radio.Button value="Sinh" style={{ minWidth: '150px', textAlign: 'center' }}>
                <Space>
                  <HeartOutlined style={{ color: '#52c41a' }} />
                  <span>Sinh</span>
                </Space>
              </Radio.Button>
              <Radio.Button value="Mất" style={{ minWidth: '150px', textAlign: 'center' }}>
                <Space>
                  <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
                  <span>Mất</span>
                </Space>
              </Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Divider />

          {/* ========== CHỌN NHÂN KHẨU ========== */}
          {loaiSuKien === 'Mất' && (
            <Alert
              message="⚠️ Lưu ý"
              description="Khi ghi nhận sự kiện MẤT, trạng thái của nhân khẩu sẽ tự động chuyển thành 'Đã mất'"
              type="warning"
              showIcon
              style={{ marginBottom: '16px' }}
            />
          )}

          {loaiSuKien === 'Mất' && (
            <Form.Item
              name="nhanKhauId"
              label="Chọn nhân khẩu"
              rules={[{ required: true, message: 'Vui lòng chọn nhân khẩu!' }]}
            >
              <Select 
                showSearch
                placeholder="Tìm kiếm theo tên hoặc CCCD"
                size="large"
                filterOption={false}
                onSearch={handleSearch}
                notFoundContent={filteredNhanKhau.length === 0 ? 'Không tìm thấy kết quả' : null}
              >
                {filteredNhanKhau.map(nk => (
                    <Option key={nk.id} value={nk.id}>
                      <Space>
                        <UserOutlined />
                        <span>{nk.hoTen}</span>
                        <span style={{ color: '#888' }}>- CCCD: {nk.soCCCD}</span>
                      </Space>
                    </Option>
                  ))
                }
              </Select>
            </Form.Item>
          )}

          {loaiSuKien === 'Sinh' && (
            <Alert
              message="ℹ️ Thông tin"
              description="Sau khi ghi nhận sự kiện SINH, vui lòng tạo hồ sơ Nhân khẩu mới trong phần quản lý Nhân khẩu"
              type="info"
              showIcon
              style={{ marginBottom: '16px' }}
            />
          )}

          {/* ========== NGÀY GHI NHẬN ========== */}
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="ngayGhiNhan"
                label={loaiSuKien === 'Sinh' ? 'Ngày sinh' : 'Ngày mất'}
                rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  size="large"
                  format="DD/MM/YYYY"
                  placeholder={loaiSuKien === 'Sinh' ? 'Chọn ngày sinh' : 'Chọn ngày mất'}
                  disabledDate={(current) => {
                    return current && current > dayjs().endOf('day');
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* ========== GHI CHÚ ========== */}
          <Form.Item
            name="ghiChu"
            label="Ghi chú"
          >
            <TextArea 
              rows={3}
              size="large"
              placeholder={
                loaiSuKien === 'Sinh' 
                  ? 'Ví dụ: Bệnh viện ABC, Bác sĩ XYZ...' 
                  : 'Ví dụ: Nguyên nhân, địa điểm...'
              }
            />
          </Form.Item>

          {/* ========== ACTION BUTTONS ========== */}
          <Form.Item style={{ marginTop: '32px', marginBottom: 0 }}>
            <Space size="large">
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={submitting}
                size="large"
                style={{ minWidth: '150px' }}
              >
                {isEditMode ? 'Cập nhật' : 'Ghi nhận'}
              </Button>
              <Button
                icon={<RollbackOutlined />}
                onClick={handleCancel}
                size="large"
                style={{ minWidth: '150px' }}
              >
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default SuKienNhanKhauFormPage;