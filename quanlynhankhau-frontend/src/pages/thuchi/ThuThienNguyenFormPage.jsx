import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  Grid,
  Alert,
  CircularProgress,
  Breadcrumbs,
  Link,
  MenuItem
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  ArrowBack as BackIcon
} from '@mui/icons-material';
import thuThienNguyenApi from '../../api/thuThienNguyenApi.js';
import hoatDongThienNguyenApi from '../../api/hoatDongThienNguyenApi';

const ThuThienNguyenFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const preselectedHoatDongId = searchParams.get('hoatdong');
  const isEditMode = Boolean(id);

  // States
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [hoatDongList, setHoatDongList] = useState([]);
  const [formData, setFormData] = useState({
    hoatDong: preselectedHoatDongId ? { id: parseInt(preselectedHoatDongId) } : null,
    soTien: '',
    nguoiDong: '',
    moTa: ''
  });
  const [errors, setErrors] = useState({});

  // Load data
  useEffect(() => {
    fetchHoatDongList();
    if (isEditMode) {
      fetchThu();
    }
  }, [id]);

  const fetchHoatDongList = async () => {
    try {
      const response = await hoatDongThienNguyenApi.getActive();
      setHoatDongList(response.data);
    } catch (error) {
      console.error('Error fetching hoat dong list:', error);
    }
  };

  const fetchThu = async () => {
    setLoading(true);
    try {
      const response = await thuThienNguyenApi.getById(id);
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
    
    if (name === 'hoatDong') {
      setFormData(prev => ({
        ...prev,
        hoatDong: { id: parseInt(value) }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error
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

    if (!formData.hoatDong || !formData.hoatDong.id) {
      newErrors.hoatDong = 'Vui lòng chọn hoạt động';
    }

    if (!formData.soTien || formData.soTien <= 0) {
      newErrors.soTien = 'Số tiền phải lớn hơn 0';
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
        soTien: parseFloat(formData.soTien)
      };

      if (isEditMode) {
        await thuThienNguyenApi.update(id, submitData);
        showAlert('success', 'Cập nhật thành công');
      } else {
        await thuThienNguyenApi.create(submitData);
        showAlert('success', 'Thêm mới thành công');
      }
      
      setTimeout(() => {
        if (formData.hoatDong?.id) {
          navigate(`/dashboard/thuthiennguyen/hoatdong/${formData.hoatDong.id}`);
        } else {
          navigate('/dashboard/hoatdong');
        }
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
          onClick={() => navigate('/dashboard/hoatdong')}
          sx={{ cursor: 'pointer' }}
        >
          Hoạt động
        </Link>
        <Typography color="text.primary">
          {isEditMode ? 'Chỉnh sửa đóng góp' : 'Thêm đóng góp'}
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
          {isEditMode ? '✏️ Chỉnh sửa Đóng góp' : '➕ Thêm Đóng góp'}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<BackIcon />}
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
      </Box>

      {/* Form */}
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Hoạt động */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  select
                  label="Hoạt động thiện nguyện"
                  name="hoatDong"
                  value={formData.hoatDong?.id || ''}
                  onChange={handleChange}
                  error={Boolean(errors.hoatDong)}
                  helperText={errors.hoatDong}
                  disabled={Boolean(preselectedHoatDongId)}
                >
                  {hoatDongList.map((hd) => (
                    <MenuItem key={hd.id} value={hd.id}>
                      {hd.tenHoatDong}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Số tiền */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Số tiền (VNĐ)"
                  name="soTien"
                  type="number"
                  value={formData.soTien}
                  onChange={handleChange}
                  error={Boolean(errors.soTien)}
                  helperText={errors.soTien}
                  inputProps={{ min: 0, step: 1000 }}
                />
              </Grid>

              {/* Người đóng */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Tên người đóng"
                  name="nguoiDong"
                  value={formData.nguoiDong}
                  onChange={handleChange}
                  helperText="Để trống nếu muốn ẩn danh"
                  placeholder="Nguyễn Văn A"
                />
              </Grid>

              {/* Mô tả */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Ghi chú"
                  name="moTa"
                  value={formData.moTa}
                  onChange={handleChange}
                  placeholder="Nhập ghi chú về khoản đóng góp..."
                />
              </Grid>

              {/* Preview */}
              <Grid item xs={12}>
                <Card sx={{ bgcolor: 'success.light', p: 2 }}>
                  <Typography variant="subtitle2" gutterBottom color="white">
                    📊 Xem trước:
                  </Typography>
                  <Typography variant="body2" color="white">
                    <strong>Hoạt động:</strong> {
                      hoatDongList.find(h => h.id === formData.hoatDong?.id)?.tenHoatDong || '(Chưa chọn)'
                    }
                  </Typography>
                  <Typography variant="body2" color="white">
                    <strong>Người đóng:</strong> {formData.nguoiDong || 'Ẩn danh'}
                  </Typography>
                  <Typography variant="body2" color="white">
                    <strong>Số tiền:</strong> {formatCurrency(formData.soTien)}
                  </Typography>
                </Card>
              </Grid>

              {/* Buttons */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={() => navigate(-1)}
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

export default ThuThienNguyenFormPage;