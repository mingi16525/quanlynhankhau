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
import khoanPhiApi from '../../api/khoanPhiApi';

const KhoanChiPhiBatBuocFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  // States
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [formData, setFormData] = useState({
    tenKhoanPhi: '',
    loaiKhoanPhi: 'Theo hộ',
    soTienMoiHo: '',
    moTa: '',
    trangThai: 'Đang áp dụng'
  });
  const [errors, setErrors] = useState({});

  // Load data if edit mode
  useEffect(() => {
    if (isEditMode) {
      fetchKhoanPhi();
    }
  }, [id]);

  const fetchKhoanPhi = async () => {
    setLoading(true);
    try {
      const response = await khoanPhiApi.getById(id);
      setFormData(response.data);
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

    if (!formData.tenKhoanPhi.trim()) {
      newErrors.tenKhoanPhi = 'Vui lòng nhập tên khoản phí';
    }

    if (!formData.soTienMoiHo || formData.soTienMoiHo <= 0) {
      newErrors.soTienMoiHo = 'Số tiền phải lớn hơn 0';
    }

    if (!formData.loaiKhoanPhi) {
      newErrors.loaiKhoanPhi = 'Vui lòng chọn loại khoản phí';
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
      if (isEditMode) {
        await khoanPhiApi.update(id, formData);
        showAlert('success', 'Cập nhật thành công');
      } else {
        await khoanPhiApi.create(formData);
        showAlert('success', 'Thêm mới thành công');
      }
      
      setTimeout(() => {
        navigate('/dashboard/khoanphi');
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

  // Format currency input
  const handleCurrencyInput = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setFormData(prev => ({
      ...prev,
      soTienMoiHo: value
    }));
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
          onClick={() => navigate('/dashboard/khoanphi')}
          sx={{ cursor: 'pointer' }}
        >
          Khoản phí
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
          {isEditMode ? '✏️ Chỉnh sửa Khoản Phí' : '➕ Thêm Khoản Phí Mới'}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<BackIcon />}
          onClick={() => navigate('/dashboard/khoanphi')}
        >
          Quay lại
        </Button>
      </Box>

      {/* Form */}
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Tên khoản phí */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Tên khoản phí"
                  name="tenKhoanPhi"
                  value={formData.tenKhoanPhi}
                  onChange={handleChange}
                  error={Boolean(errors.tenKhoanPhi)}
                  helperText={errors.tenKhoanPhi}
                  placeholder="VD: Phí quản lý chung cư tháng 12"
                />
              </Grid>

              {/* Loại khoản phí */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  select
                  label="Loại khoản phí"
                  name="loaiKhoanPhi"
                  value={formData.loaiKhoanPhi}
                  onChange={handleChange}
                  error={Boolean(errors.loaiKhoanPhi)}
                  helperText={errors.loaiKhoanPhi || 'Chọn cách tính tiền'}
                >
                  <MenuItem value="Theo hộ">Theo hộ (Số tiền cố định mỗi hộ)</MenuItem>
                  <MenuItem value="Theo số thành viên hộ">Theo số thành viên hộ (Tính theo số người)</MenuItem>
                  <MenuItem value="Tự nguyện">Tự nguyện (Kế toán tự điền)</MenuItem>
                </TextField>
              </Grid>

              {/* Số tiền mỗi hộ */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label={
                    formData.loaiKhoanPhi === 'Theo hộ' 
                      ? 'Số tiền mỗi hộ (VNĐ)'
                      : formData.loaiKhoanPhi === 'Theo số thành viên hộ'
                      ? 'Số tiền mỗi người (VNĐ)'
                      : 'Số tiền tham khảo (VNĐ)'
                  }
                  name="soTienMoiHo"
                  type="number"
                  value={formData.soTienMoiHo}
                  onChange={handleChange}
                  error={Boolean(errors.soTienMoiHo)}
                  helperText={
                    errors.soTienMoiHo || 
                    (formData.loaiKhoanPhi === 'Theo hộ' 
                      ? 'Mỗi hộ đóng số tiền này'
                      : formData.loaiKhoanPhi === 'Theo số thành viên hộ'
                      ? 'Số tiền sẽ nhân với số thành viên trong hộ'
                      : 'Tự nguyện - Kế toán sẽ điền số tiền thực tế')
                  }
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
                  <MenuItem value="Đang áp dụng">Đang áp dụng</MenuItem>
                  <MenuItem value="Tạm dừng">Tạm dừng</MenuItem>
                  <MenuItem value="Đã kết thúc">Đã kết thúc</MenuItem>
                </TextField>
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
                  placeholder="Nhập mô tả chi tiết về khoản phí..."
                />
              </Grid>

              {/* Preview */}
              <Grid item xs={12}>
                <Card sx={{ bgcolor: 'primary.light', p: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    📊 Xem trước:
                  </Typography>
                  <Typography variant="body2">
                    <strong>Tên:</strong> {formData.tenKhoanPhi || '(Chưa nhập)'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Loại:</strong> {formData.loaiKhoanPhi}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Số tiền/hộ:</strong> {
                      formData.soTienMoiHo 
                        ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(formData.soTienMoiHo)
                        : '0 ₫'
                    }
                  </Typography>
                  <Typography variant="body2">
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
                    onClick={() => navigate('/dashboard/khoanphi')}
                    disabled={saving}
                  >
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
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

export default KhoanChiPhiBatBuocFormPage;