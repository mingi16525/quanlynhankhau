import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Alert,
  CircularProgress,
  Breadcrumbs,
  Link,
  Tooltip,
  Grid,
  LinearProgress
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  CheckCircle as PaidIcon,
  Cancel as UnpaidIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Payment as PaymentIcon,
  Check as CheckIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import thuPhiApi from '../../api/thuPhiApi';
import khoanPhiApi from '../../api/khoanPhiApi';

const DanhSachThuPhiListPage = () => {
  const navigate = useNavigate();
  const { khoanPhiId } = useParams(); // Lấy ID khoản phí từ URL
  
  // States
  const [thuPhiList, setThuPhiList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [khoanPhi, setKhoanPhi] = useState(null);
  const [thongKe, setThongKe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterTrangThai, setFilterTrangThai] = useState('all'); // 'all', 'chuadong', 'dadong'
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [editingId, setEditingId] = useState(null); // ID đang chỉnh sửa
  const [editingSoTien, setEditingSoTien] = useState(''); // Số tiền đang chỉnh sửa

  // Load data
  useEffect(() => {
    if (khoanPhiId) {
      fetchKhoanPhi();
      fetchThuPhiList();
      fetchThongKe();
    }
  }, [khoanPhiId]);

  // Filter data
  useEffect(() => {
    let filtered = [...thuPhiList];

    // Filter by search (tìm theo tên chủ hộ)
    if (searchKeyword) {
      filtered = filtered.filter(item =>
        item.hoKhau?.chuHo?.hoTen?.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    // Filter by trạng thái
    if (filterTrangThai === 'chuadong') {
      filtered = filtered.filter(item => item.trangThaiThanhToan === 'Chưa đóng');
    } else if (filterTrangThai === 'dadong') {
      filtered = filtered.filter(item => item.trangThaiThanhToan === 'Đã đóng');
    }

    setFilteredList(filtered);
  }, [thuPhiList, searchKeyword, filterTrangThai]);

  // Fetch khoản phí info
  const fetchKhoanPhi = async () => {
    try {
      const response = await khoanPhiApi.getById(khoanPhiId);
      setKhoanPhi(response.data);
    } catch (error) {
      console.error('Error fetching khoan phi:', error);
      showAlert('error', 'Lỗi khi tải thông tin khoản phí');
    }
  };

  // Fetch thu phí list
  const fetchThuPhiList = async () => {
    setLoading(true);
    try {
      const response = await thuPhiApi.getByKhoanPhi(khoanPhiId);
      setThuPhiList(response.data);
      showAlert('success', 'Tải danh sách thành công');
    } catch (error) {
      console.error('Error fetching data:', error);
      showAlert('error', 'Lỗi khi tải danh sách');
    } finally {
      setLoading(false);
    }
  };

  // Fetch thống kê
  const fetchThongKe = async () => {
    try {
      const response = await thuPhiApi.getThongKe(khoanPhiId);
      setThongKe(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  // Show alert
  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 3000);
  };

  // Handle payment status change
  const handlePaymentToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Chưa đóng' ? 'Đã đóng' : 'Chưa đóng';
    
    try {
      await thuPhiApi.updateTrangThai(id, newStatus);
      showAlert('success', `Đã cập nhật: ${newStatus}`);
      fetchThuPhiList();
      fetchThongKe();
    } catch (error) {
      console.error('Error updating status:', error);
      showAlert('error', 'Lỗi khi cập nhật trạng thái');
    }
  };
  
  // Bắt đầu chỉnh sửa số tiền
  const handleStartEditSoTien = (id, soTien) => {
    setEditingId(id);
    setEditingSoTien(soTien);
  };
  
  // Hủy chỉnh sửa
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingSoTien('');
  };
  
  // Lưu số tiền mới
  const handleSaveSoTien = async (id) => {
    if (!editingSoTien || parseFloat(editingSoTien) < 0) {
      showAlert('error', 'Số tiền không hợp lệ');
      return;
    }
    
    try {
      // Tìm record hiện tại
      const currentRecord = thuPhiList.find(item => item.id === id);
      
      // Update với số tiền mới
      await thuPhiApi.update(id, {
        ...currentRecord,
        soTien: parseFloat(editingSoTien)
      });
      
      showAlert('success', 'Đã cập nhật số tiền');
      setEditingId(null);
      setEditingSoTien('');
      fetchThuPhiList();
      fetchThongKe();
    } catch (error) {
      console.error('Error updating soTien:', error);
      showAlert('error', 'Lỗi khi cập nhật số tiền');
    }
  };

  // Get status chip
  const getStatusChip = (trangThai) => {
    if (trangThai === 'Đã đóng') {
      return (
        <Chip
          label="Đã đóng"
          color="success"
          icon={<PaidIcon />}
          size="small"
        />
      );
    }
    return (
      <Chip
        label="Chưa đóng"
        color="error"
        icon={<UnpaidIcon />}
        size="small"
      />
    );
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('vi-VN');
  };

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
        <Typography color="text.primary">Danh sách thu</Typography>
      </Breadcrumbs>

      {/* Alert */}
      {alert.show && (
        <Alert severity={alert.type} sx={{ mb: 2 }}>
          {alert.message}
        </Alert>
      )}

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            💰 Danh sách Thu Phí
          </Typography>
          {khoanPhi && (
            <Typography variant="subtitle1" color="text.secondary">
              Khoản phí: <strong>{khoanPhi.tenKhoanPhi}</strong>
            </Typography>
          )}
        </Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => {
              fetchThuPhiList();
              fetchThongKe();
            }}
            sx={{ mr: 1 }}
          >
            Làm mới
          </Button>
          <Button
            variant="outlined"
            startIcon={<BackIcon />}
            onClick={() => navigate('/dashboard/khoanphi')}
          >
            Quay lại
          </Button>
        </Box>
      </Box>

      {/* Thống kê */}
      {thongKe && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Tổng số hộ
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {thongKe.tongSoHo}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card sx={{ bgcolor: 'success.light' }}>
              <CardContent>
                <Typography variant="body2" color="white">
                  Đã đóng
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="white">
                  {thongKe.soHoDaDong}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card sx={{ bgcolor: 'error.light' }}>
              <CardContent>
                <Typography variant="body2" color="white">
                  Chưa đóng
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="white">
                  {thongKe.soHoChuaDong}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Tổng tiền đã thu
                </Typography>
                <Typography variant="h5" fontWeight="bold" color="success.main">
                  {formatCurrency(thongKe.tongTienDaThu)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Tiến độ thu</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {thongKe.tiLeDaDong.toFixed(1)}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={thongKe.tiLeDaDong} 
                  sx={{ height: 10, borderRadius: 5 }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {/* Search */}
            <TextField
              placeholder="Tìm kiếm theo tên chủ hộ..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              sx={{ minWidth: 300 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />

            {/* Filter buttons */}
            <Button
              variant={filterTrangThai === 'all' ? 'contained' : 'outlined'}
              onClick={() => setFilterTrangThai('all')}
            >
              Tất cả ({thuPhiList.length})
            </Button>
            <Button
              variant={filterTrangThai === 'chuadong' ? 'contained' : 'outlined'}
              color="error"
              onClick={() => setFilterTrangThai('chuadong')}
            >
              Chưa đóng ({thuPhiList.filter(i => i.trangThaiThanhToan === 'Chưa đóng').length})
            </Button>
            <Button
              variant={filterTrangThai === 'dadong' ? 'contained' : 'outlined'}
              color="success"
              onClick={() => setFilterTrangThai('dadong')}
            >
              Đã đóng ({thuPhiList.filter(i => i.trangThaiThanhToan === 'Đã đóng').length})
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: 'primary.main' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Chủ hộ</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Địa chỉ</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Số tiền</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Trạng thái</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Ngày thanh toán</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Ghi chú</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">
                Thao tác
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : filteredList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              filteredList.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>
                    <Typography fontWeight="bold">
                      {item.hoKhau?.chuHo?.hoTen || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {item.hoKhau?.diaChi || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {editingId === item.id ? (
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <TextField
                          size="small"
                          type="number"
                          value={editingSoTien}
                          onChange={(e) => setEditingSoTien(e.target.value)}
                          sx={{ width: 150 }}
                          inputProps={{ min: 0, step: 1000 }}
                        />
                        <IconButton 
                          color="success" 
                          size="small"
                          onClick={() => handleSaveSoTien(item.id)}
                        >
                          <CheckIcon />
                        </IconButton>
                        <IconButton 
                          color="error" 
                          size="small"
                          onClick={handleCancelEdit}
                        >
                          <CloseIcon />
                        </IconButton>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography color="primary" fontWeight="bold">
                          {formatCurrency(item.soTien)}
                        </Typography>
                        <Tooltip title="Chỉnh sửa số tiền">
                          <IconButton 
                            size="small" 
                            onClick={() => handleStartEditSoTien(item.id, item.soTien)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>
                    <Box 
                      sx={{ cursor: 'pointer' }} 
                      onClick={() => handlePaymentToggle(item.id, item.trangThaiThanhToan)}
                    >
                      {getStatusChip(item.trangThaiThanhToan)}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(item.ngayThanhToan)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {item.ghiChu || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Cập nhật thanh toán">
                      <IconButton
                        color={item.trangThaiThanhToan === 'Đã đóng' ? 'success' : 'error'}
                        onClick={() => handlePaymentToggle(item.id, item.trangThaiThanhToan)}
                      >
                        <PaymentIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DanhSachThuPhiListPage;