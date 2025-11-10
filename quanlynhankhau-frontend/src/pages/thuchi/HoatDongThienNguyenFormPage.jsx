import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  Grid,
  MenuItem,
  Alert,
  CircularProgress,
  Breadcrumbs,
  Link
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  ArrowBack as BackIcon
} from '@mui/icons-material';
import hoatDongThienNguyenApi from '../../api/hoatDongThienNguyenApi';

const HoatDongThienNguyenFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  // States
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [formData, setFormData] = useState({
    tenHoatDong: '',
    mucTieu: '',
    ngayBatDau: '',
    ngayKetThuc: '',
    moTa: '',
    trangThai: 'Đang gây quỹ'
  });
  const [errors, setErrors] = useState({});

  // Load data if edit mode
  useEffect(() => {
    if (isEditMode) {
      fetchHoatDong();
    }
  }, [id]);

  const fetchHoatDong = async () => {
    setLoading(true);
    try {
      const response = await hoatDongThienNguyenApi.getById(id);
      const data = response.data;
      
      // Format dates for input
      setFormData({
        ...data,
        ngayBatDau: data.ngayBatDau ? data.ngayBatDau : '',
        ngayKetThuc: data.ngayKetThuc ? data.ngayKetThuc : ''
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      showAlert('error', 'Lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.tenHoatDong.trim()) {
      newErrors.tenHoatDong = 'Vui lòng nhập tên hoạt động';
    }

    if (formData.ngayBatDau && formData.ngayKetThuc) {
      if (new Date(formData.ngayKetThuc) < new Date(formData.ngayBatDau)) {
        newErrors.ngayKetThuc = 'Ngày kết thúc phải sau ngày bắt đầu';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showAlert('error', 'Vui lòng kiểm tra lại thông tin');
      return;
    }

    setSaving(true);
    try {
      const submitData = {
        ...formData,
        mucTieu: formData.mucTieu ? parseFloat(formData.mucTieu) : null
      };

      if (isEditMode) {
        await hoatDongThienNguyenApi.update(id, submitData);
        showAlert('success', 'Cập nhật thành công');
      } else {
        await hoatDongThienNguyenApi.create(submitData);
        showAlert('success', 'Thêm mới thành công');
      }
      
      setTimeout(() => {
        navigate('/dashboard/hoatdongthiennguyen');
      }, 1500);
    } catch (error) {
      console.error('Error saving:', error);
      const errorMessage = error.response?.data?.message || 'Lỗi khi lưu dữ liệu';
      showAlert('error', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // Show alert
  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 3000);
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link
          underline="hover"
          color="inherit"
          onClick={() => navigate('/dashboard/hoatdongthiennguyen')}
          sx={{ cursor: 'pointer' }}
        >
          Hoạt động thiện nguyện
        </Link>
        <Typography color="text.primary">
          {isEditMode ? 'Chỉnh sửa' : 'Thêm mới'}
        </Typography>
      </Breadcrumbs>

      {/* Alert */}
      {alert.show && (
        <Alert severity={alert.type} sx={{ mb: 2 }}>
          {alert.message}
        </Alert>
      )}

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          {isEditMode ? '✏️ Chỉnh sửa Hoạt động' : '➕ Thêm Hoạt động Mới'}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<BackIcon />}
          onClick={() => navigate('/dashboard/hoatdongthiennguyen')}
        >
          Quay lại
        </Button>
      </Box>

      {/* Form */}
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Tên hoạt động */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Tên hoạt động"
                  name="tenHoatDong"
                  value={formData.tenHoatDong}
                  onChange={handleChange}
                  error={Boolean(errors.tenHoatDong)}
                  helperText={errors.tenHoatDong}
                  placeholder="VD: Quyên góp ủng hộ miền Trung"
                />
              </Grid>

              {/* Mục tiêu */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Mục tiêu (VNĐ)"
                  name="mucTieu"
                  type="number"
                  value={formData.mucTieu}
                  onChange={handleChange}
                  helperText="Để trống nếu không giới hạn"
                  inputProps={{ min: 0, step: 1000 }}
                />
              </Grid>

              {/* Trạng thái */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Trạng thái"
                  name="trangThai"
                  value={formData.trangThai}
                  onChange={handleChange}
                >
                  <MenuItem value="Đang gây quỹ">Đang gây quỹ</MenuItem>
                  <MenuItem value="Tạm dừng">Tạm dừng</MenuItem>
                  <MenuItem value="Đã kết thúc">Đã kết thúc</MenuItem>
                </TextField>
              </Grid>

              {/* Ngày bắt đầu */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Ngày bắt đầu"
                  name="ngayBatDau"
                  type="date"
                  value={formData.ngayBatDau}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Ngày kết thúc */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Ngày kết thúc"
                  name="ngayKetThuc"
                  type="date"
                  value={formData.ngayKetThuc}
                  onChange={handleChange}
                  error={Boolean(errors.ngayKetThuc)}
                  helperText={errors.ngayKetThuc}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Mô tả */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Mô tả"
                  name="moTa"
                  value={formData.moTa}
                  onChange={handleChange}
                  placeholder="Nhập mô tả chi tiết về hoạt động..."
                />
              </Grid>

              {/* Preview */}
              <Grid item xs={12}>
                <Card sx={{ bgcolor: 'success.light', p: 2 }}>
                  <Typography variant="subtitle2" gutterBottom color="white">
                    📊 Xem trước:
                  </Typography>
                  <Typography variant="body2" color="white">
                    <strong>Tên:</strong> {formData.tenHoatDong || '(Chưa nhập)'}
                  </Typography>
                  <Typography variant="body2" color="white">
                    <strong>Mục tiêu:</strong> {formData.mucTieu ? formatCurrency(formData.mucTieu) : 'Không giới hạn'}
                  </Typography>
                  <Typography variant="body2" color="white">
                    <strong>Thời gian:</strong> {formData.ngayBatDau || '...'} đến {formData.ngayKetThuc || '...'}
                  </Typography>
                  <Typography variant="body2" color="white">
                    <strong>Trạng thái:</strong> {formData.trangThai}
                  </Typography>
                </Card>
              </Grid>

              {/* Buttons */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={() => navigate('/dashboard/hoatdongthiennguyen')}
                    disabled={saving}
                  >
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                    disabled={saving}
                  >
                    {saving ? 'Đang lưu...' : (isEditMode ? 'Cập nhật' : 'Thêm mới')}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default HoatDongThienNguyenFormPage;