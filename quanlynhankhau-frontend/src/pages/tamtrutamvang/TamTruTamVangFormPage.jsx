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
  Spin,
  Alert,
  Divider,
  Tag // ✅ THÊM TAG VÀO IMPORT
} from 'antd';
import { 
  SaveOutlined, 
  RollbackOutlined,
  UserOutlined 
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

const TamTruTamVangFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [allNhanKhau, setAllNhanKhau] = useState([]);
  const [filteredNhanKhau, setFilteredNhanKhau] = useState([]);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [selectedLoai, setSelectedLoai] = useState('Tạm trú'); // ✅ Set giá trị mặc định

  const isEditMode = !!id;

  const getTitle = () => {
    if (isEditMode) return 'Chỉnh sửa đăng ký Tạm trú/Tạm vắng';
    return 'Đăng ký Tạm trú/Tạm vắng mới';
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
      setFilteredNhanKhau(response.data);
    } catch (error) {
      console.error('❌ Error fetching nhân khẩu:', error);
      message.error('Không thể tải danh sách nhân khẩu');
    }
  };

  const handleSearch = (value) => {
    if (searchTimeout) clearTimeout(searchTimeout);
    
    if (!value || value.trim() === '') {
      setFilteredNhanKhau(allNhanKhau);
      return;
    }
    
    const timeout = setTimeout(() => {
      const searchValue = value.toLowerCase();
      const filtered = allNhanKhau.filter(nk => 
        nk.hoTen.toLowerCase().includes(searchValue) ||
        nk.soCCCD.includes(searchValue)
      );
      setFilteredNhanKhau(filtered);
    }, 300);
    
    setSearchTimeout(timeout);
  };

  const fetchRecord = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/tamtrutamvang/${id}`);
      console.log('📥 Loading record:', response.data);
      loadFormData(response.data);
    } catch (error) {
      console.error('❌ Error fetching record:', error);
      message.error('Không thể tải thông tin đăng ký');
      navigate('/dashboard/tamtrutamvang');
    } finally {
      setLoading(false);
    }
  };

  const loadFormData = (data) => {
    const formData = {
      loai: data.loai,
      nhanKhauId: data.nhanKhau?.id,
      tuNgay: data.tuNgay ? dayjs(data.tuNgay) : null,
      denNgay: data.denNgay ? dayjs(data.denNgay) : null,
      noiDen: data.noiDen,
      lyDo: data.lyDo
    };

    setSelectedLoai(data.loai);
    form.setFieldsValue(formData);
    console.log('✅ Form loaded');
  };

  // ========== SUBMIT ==========
  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      const payload = {
        loai: values.loai,
        nhanKhau: { id: values.nhanKhauId },
        tuNgay: values.tuNgay ? values.tuNgay.format('YYYY-MM-DD') : null,
        denNgay: values.denNgay ? values.denNgay.format('YYYY-MM-DD') : null,
        noiDen: values.noiDen || null,
        lyDo: values.lyDo || null
      };

      console.log('📤 Submitting:', payload);

      let response;
      if (isEditMode) {
        response = await apiClient.put(`/tamtrutamvang/${id}`, payload);
        message.success('✅ Cập nhật thành công');
      } else {
        response = await apiClient.post('/tamtrutamvang', payload);
        message.success('✅ Đăng ký thành công');
      }

      console.log('✅ Response:', response.data);
      navigate('/dashboard/tamtrutamvang');

    } catch (error) {
      console.error('❌ Error submitting:', error);
      message.error(error.response?.data?.message || 'Có lỗi xảy ra khi lưu');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/tamtrutamvang');
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
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <Card title={<h2 style={{ margin: 0, color: '#1890ff' }}>{getTitle()}</h2>}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark="optional"
          initialValues={{
            loai: 'Tạm trú'
          }}
        >
          {/* ========== LOẠI ĐĂNG KÝ ========== */}
          <Alert
            message="Hướng dẫn"
            description={
              <ul style={{ marginBottom: 0, paddingLeft: '20px' }}>
                <li><strong>Tạm trú:</strong> Người ngoài đến ở tạm tại địa chỉ trong khu vực quản lý</li>
                <li><strong>Tạm vắng:</strong> Thành viên hộ khẩu đi vắng khỏi nơi cư trú thường xuyên</li>
              </ul>
            }
            type="info"
            showIcon
            style={{ marginBottom: '24px' }}
          />

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="loai"
                label="Loại đăng ký"
                rules={[{ required: true, message: 'Vui lòng chọn loại!' }]}
              >
                <Select 
                  placeholder="Chọn loại"
                  size="large"
                  onChange={(value) => setSelectedLoai(value)}
                >
                  <Option value="Tạm trú">
                    <Space>
                      <Tag color="green">Tạm trú</Tag>
                      <span>Người ngoài đến ở tạm</span>
                    </Space>
                  </Option>
                  <Option value="Tạm vắng">
                    <Space>
                      <Tag color="orange">Tạm vắng</Tag>
                      <span>Thành viên hộ đi vắng</span>
                    </Space>
                  </Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
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
                      <UserOutlined /> {nk.hoTen} - CCCD: {nk.soCCCD}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Thời gian</Divider>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="tuNgay"
                label="Từ ngày"
                rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  size="large"
                  format="DD/MM/YYYY"
                  placeholder="Chọn ngày bắt đầu"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="denNgay"
                label="Đến ngày"
                extra="Để trống nếu không xác định thời hạn"
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || !getFieldValue('tuNgay')) {
                        return Promise.resolve();
                      }
                      if (value.isBefore(getFieldValue('tuNgay'))) {
                        return Promise.reject(new Error('Đến ngày phải sau Từ ngày'));
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  size="large"
                  format="DD/MM/YYYY"
                  placeholder="Chọn ngày kết thúc (không bắt buộc)"
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Thông tin chi tiết</Divider>

          <Form.Item
            name="noiDen"
            label={selectedLoai === 'Tạm trú' ? 'Địa chỉ tạm trú' : 'Nơi đến (địa chỉ tạm vắng)'}
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
          >
            <TextArea 
              rows={2}
              size="large"
              placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố" 
            />
          </Form.Item>

          <Form.Item
            name="lyDo"
            label="Lý do"
            extra="Ví dụ: Công tác, Du học, Chữa bệnh, Thăm thân..."
          >
            <TextArea 
              rows={2}
              size="large"
              placeholder="Nhập lý do tạm trú/tạm vắng" 
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
                {isEditMode ? 'Cập nhật' : 'Đăng ký'}
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

export default TamTruTamVangFormPage;