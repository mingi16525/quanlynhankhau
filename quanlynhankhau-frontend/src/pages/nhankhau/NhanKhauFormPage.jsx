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
  Alert
} from 'antd';
import { 
  SaveOutlined, 
  RollbackOutlined, 
  EditOutlined,
  CopyOutlined
} from '@ant-design/icons';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import nhanKhauApi from '../../api/nhanKhauAPI';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

const NhanKhauFormPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Lấy returnTo từ location.state (nếu có)
  const returnTo = location.state?.returnTo || '/dashboard/nhankhau';

  // Xác định chế độ
  const isViewMode = mode === 'view';
  const isEditMode = mode === 'edit';
  const isCloneMode = mode === 'clone';
  const isNewMode = !mode || mode === 'new';

  const getTitle = () => {
    if (isViewMode) return 'Chi tiết Nhân khẩu';
    if (isEditMode) return 'Chỉnh sửa Nhân khẩu';
    if (isCloneMode) return 'Sao chép Nhân khẩu';
    return 'Thêm Nhân khẩu mới';
  };

  // Fetch data khi có ID (view, edit, clone)
  useEffect(() => {
    if (id && (isViewMode || isEditMode || isCloneMode)) {
      fetchNhanKhau();
    } else if (isNewMode && location.state?.ngaySinh) {
      // Pre-fill ngày sinh nếu đến từ sự kiện sinh
      // location.state.ngaySinh là string YYYY-MM-DD, cần convert sang dayjs
      const ngaySinhValue = dayjs(location.state.ngaySinh);
      
      form.setFieldsValue({
        ngaySinh: ngaySinhValue
      });
      console.log('✅ Pre-filled ngày sinh from event:', ngaySinhValue.format('DD/MM/YYYY'));
    }
  }, [id, mode]);

  const fetchNhanKhau = async () => {
    setLoading(true);
    try {
      const response = await nhanKhauApi.getById(id);
      const data = response.data;
      
      console.log('📥 Received data from API:', data);

      // Convert LocalDate string → dayjs object
      if (data.ngaySinh) {
        data.ngaySinh = dayjs(data.ngaySinh);
      }

      // Xử lý chế độ CLONE
      if (isCloneMode) {
        delete data.id;
        data.soCCCD = ''; // CCCD phải unique
        data.hoTen = `[Bản sao] ${data.hoTen}`;
        message.info('⚠️ Đây là bản sao. Vui lòng nhập CCCD mới!');
      }
      
      form.setFieldsValue(data);
      console.log('✅ Form loaded with data:', form.getFieldsValue());
      
    } catch (error) {
      console.error('❌ Error fetching data:', error);
      message.error('Không thể tải thông tin nhân khẩu');
      navigate('/dashboard/nhankhau');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      // Convert dayjs → ISO string (LocalDate format: YYYY-MM-DD)
      const payload = {
        ...values,
        ngaySinh: values.ngaySinh ? values.ngaySinh.format('YYYY-MM-DD') : null,
      };

      console.log('📤 Submitting payload:', payload);

      if (isEditMode && id) {
        await nhanKhauApi.update(id, payload);
        message.success('✅ Cập nhật nhân khẩu thành công');
      } else {
        await nhanKhauApi.create(payload);
        message.success(isCloneMode ? '✅ Sao chép thành công' : '✅ Thêm mới thành công');
      }

      // Quay về trang trước đó (hoặc trang danh sách mặc định)
      navigate(returnTo);
    } catch (error) {
      console.error('❌ Error submitting:', error);
      message.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Quay về trang trước đó (hoặc trang danh sách mặc định)
    navigate(returnTo);
  };

  const handleEdit = () => {
    navigate(`/dashboard/nhankhau/form/edit/${id}`);
  };

  const handleClone = () => {
    navigate(`/dashboard/nhankhau/form/clone/${id}`);
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
    <div style={{ padding: '24px' }}>
      <Card
        title={<h2 style={{ margin: 0, color: '#1890ff' }}>{getTitle()}</h2>}
        extra={
          isViewMode && (
            <Space>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={handleEdit}
              >
                Chỉnh sửa
              </Button>
              <Button
                icon={<CopyOutlined />}
                onClick={handleClone}
              >
                Sao chép
              </Button>
            </Space>
          )
        }
      >
        {isCloneMode && (
          <Alert
            message="Chế độ sao chép"
            description="Bạn đang tạo bản sao từ hồ sơ hiện tại. Vui lòng nhập CCCD mới vì CCCD phải là duy nhất."
            type="info"
            showIcon
            style={{ marginBottom: '24px' }}
            closable
          />
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          disabled={isViewMode}
          requiredMark={!isViewMode}
        >
          {/* ========== THÔNG TIN CƠ BẢN ========== */}
          <h3 style={{ marginTop: 0, marginBottom: '16px', color: '#1890ff' }}>
            Thông tin cơ bản
          </h3>
          
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="hoTen"
                label="Họ và tên"
                rules={[
                  { required: true, message: 'Vui lòng nhập họ tên!' },
                  { min: 2, message: 'Họ tên phải có ít nhất 2 ký tự!' }
                ]}
              >
                <Input placeholder="Nguyễn Văn A" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="gioiTinh"
                label="Giới tính"
                rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
              >
                <Select placeholder="Chọn giới tính">
                  <Option value="Nam">Nam</Option>
                  <Option value="Nữ">Nữ</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="ngaySinh"
                label="Ngày sinh"
                rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  format="DD/MM/YYYY"
                  placeholder="Chọn ngày sinh"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="soCCCD"
                label="Số CCCD"
                rules={[
                  { required: true, message: 'Vui lòng nhập số CCCD!' },
                  { pattern: /^\d{12}$/, message: 'CCCD phải có 12 chữ số!' }
                ]}
                extra={isCloneMode && <span style={{ color: '#ff4d4f' }}>⚠️ Vui lòng nhập CCCD mới</span>}
              >
                <Input 
                  placeholder="001234567890" 
                  maxLength={12}
                  status={isCloneMode && !form.getFieldValue('soCCCD') ? 'error' : ''}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* ========== QUỐC TỊCH & DÂN TỘC ========== */}
          <h3 style={{ marginTop: '24px', marginBottom: '16px', color: '#1890ff' }}>
            Quốc tịch & Dân tộc
          </h3>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                name="danToc"
                label="Dân tộc"
                initialValue="Kinh"
              >
                <Input placeholder="Kinh" />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="tonGiao"
                label="Tôn giáo"
              >
                <Input placeholder="Không" />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="quocTich"
                label="Quốc tịch"
                initialValue="Việt Nam"
              >
                <Input placeholder="Việt Nam" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                name="queQuan"
                label="Quê quán"
              >
                <Input placeholder="Hà Nội" />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="noiSinh"
                label="Nơi sinh"
              >
                <Input placeholder="Bệnh viện ABC, Hà Nội" />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="nguyenQuan"
                label="Nguyên quán"
              >
                <Input placeholder="Xã ABC, Huyện XYZ, Tỉnh DEF" />
              </Form.Item>
            </Col>
          </Row>

          {/* ========== NGHỀ NGHIỆP ========== */}
          <h3 style={{ marginTop: '24px', marginBottom: '16px', color: '#1890ff' }}>
            Nghề nghiệp & Học vấn
          </h3>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                name="ngheNghiep"
                label="Nghề nghiệp"
              >
                <Input placeholder="Kỹ sư, Giáo viên, Học sinh..." />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="noiLamViec"
                label="Nơi làm việc/Học tập"
              >
                <Input placeholder="Công ty ABC, Trường ĐH XYZ..." />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="trinhDoHocVan"
                label="Trình độ học vấn"
              >
                <Select placeholder="Chọn trình độ">
                  <Option value="Tiểu học">Tiểu học</Option>
                  <Option value="THCS">THCS</Option>
                  <Option value="THPT">THPT</Option>
                  <Option value="Trung cấp">Trung cấp</Option>
                  <Option value="Cao đẳng">Cao đẳng</Option>
                  <Option value="Đại học">Đại học</Option>
                  <Option value="Thạc sĩ">Thạc sĩ</Option>
                  <Option value="Tiến sĩ">Tiến sĩ</Option>
                  <Option value="Khác">Khác</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* ========== LIÊN HỆ ========== */}
          <h3 style={{ marginTop: '24px', marginBottom: '16px', color: '#1890ff' }}>
            Thông tin liên hệ
          </h3>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                name="soDienThoai"
                label="Số điện thoại"
                rules={[
                  { pattern: /^(0|\+84)[0-9]{9,10}$/, message: 'Số điện thoại không hợp lệ!' }
                ]}
              >
                <Input placeholder="0901234567" />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { type: 'email', message: 'Email không hợp lệ!' }
                ]}
              >
                <Input placeholder="example@gmail.com" />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="diaChiThuongTru"
                label="Địa chỉ thường trú"
              >
                <Input placeholder="Số nhà, đường, phường, quận..." />
              </Form.Item>
            </Col>
          </Row>

          {/* ========== TÌNH TRẠNG ========== */}
          <h3 style={{ marginTop: '24px', marginBottom: '16px', color: '#1890ff' }}>
            Tình trạng cư trú
          </h3>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="tinhTrang"
                label="Tình trạng"
                rules={[{ required: true, message: 'Vui lòng chọn tình trạng!' }]}
              >
                <Select placeholder="Chọn tình trạng">
                  <Option value="Thường trú">Thường trú</Option>
                  <Option value="Tạm trú">Tạm trú</Option>
                  <Option value="Đã mất">Đã mất</Option>
                  <Option value="Tạm vắng">Tạm vắng</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="ghiChu"
                label="Ghi chú"
              >
                <TextArea rows={3} placeholder="Thông tin bổ sung..." />
              </Form.Item>
            </Col>
          </Row>

          {/* ========== ACTION BUTTONS ========== */}
          <Form.Item style={{ marginTop: '32px', marginBottom: 0 }}>
            <Space>
              {!isViewMode && (
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={submitting}
                  size="large"
                >
                  {isEditMode ? 'Cập nhật' : isCloneMode ? 'Lưu bản sao' : 'Lưu'}
                </Button>
              )}
              <Button
                icon={<RollbackOutlined />}
                onClick={handleCancel}
                size="large"
              >
                {isViewMode ? 'Quay lại' : 'Hủy'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default NhanKhauFormPage;