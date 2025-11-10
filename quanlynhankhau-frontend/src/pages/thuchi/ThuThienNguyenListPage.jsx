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
  TextField,
  InputAdornment,
  Alert,
  CircularProgress,
  Breadcrumbs,
  Link,
  Tooltip,
  Grid,
  Chip
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import thuThienNguyenApi from '../../api/thuThienNguyenApi';
import hoatDongThienNguyenApi from '../../api/hoatDongThienNguyenApi';

const ThuThienNguyenListPage = () => {
  const navigate = useNavigate();
  const { hoatDongId } = useParams(); // Có thể null nếu xem tất cả
  
  // States
  const [thuList, setThuList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [hoatDong, setHoatDong] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });

  const isFilteredByHoatDong = Boolean(hoatDongId);

  // Load data
  useEffect(() => {
    if (isFilteredByHoatDong) {
      fetchHoatDong();
      fetchThuListByHoatDong();
    } else {
      fetchAllThuList();
    }
  }, [hoatDongId]);

  // Filter data
  useEffect(() => {
    let filtered = [...thuList];

    if (searchKeyword) {
      filtered = filtered.filter(item =>
        item.nguoiDong?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        item.hoatDong?.tenHoatDong?.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    setFilteredList(filtered);
  }, [thuList, searchKeyword]);

  // Fetch hoạt động info
  const fetchHoatDong = async () => {
    try {
      const response = await hoatDongThienNguyenApi.getById(hoatDongId);
      setHoatDong(response.data);
    } catch (error) {
      console.error('Error fetching hoat dong:', error);
    }
  };

  // Fetch thu list by hoạt động
  const fetchThuListByHoatDong = async () => {
    setLoading(true);
    try {
      const response = await thuThienNguyenApi.getByHoatDong(hoatDongId);
      setThuList(response.data);
      showAlert('success', 'Tải danh sách thành công');
    } catch (error) {
      console.error('Error fetching data:', error);
      showAlert('error', 'Lỗi khi tải danh sách');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all thu list
  const fetchAllThuList = async () => {
    setLoading(true);
    try {
      const response = await thuThienNguyenApi.getAll();
      setThuList(response.data);
      showAlert('success', 'Tải danh sách thành công');
    } catch (error) {
      console.error('Error fetching data:', error);
      showAlert('error', 'Lỗi khi tải danh sách');
    } finally {
      setLoading(false);
    }
  };

  // Show alert
  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 3000);
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await thuThienNguyenApi.delete(id);
      showAlert('success', 'Xóa thành công');
      
      if (isFilteredByHoatDong) {
        fetchThuListByHoatDong();
      } else {
        fetchAllThuList();
      }
    } catch (error) {
      console.error('Error deleting:', error);
      showAlert('error', 'Lỗi khi xóa');
    }
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

  // Calculate total
  const totalAmount = filteredList.reduce((sum, item) => sum + (item.soTien || 0), 0);

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
          Hoạt động
        </Link>
        <Typography color="text.primary">
          {isFilteredByHoatDong ? 'Danh sách đóng góp' : 'Tất cả đóng góp'}
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
        <Box>
          <Typography variant="h4" fontWeight="bold">
            💝 Danh sách Đóng góp
          </Typography>
          {hoatDong && (
            <Typography variant="subtitle1" color="text.secondary">
              Hoạt động: <strong>{hoatDong.tenHoatDong}</strong>
            </Typography>
          )}
        </Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => isFilteredByHoatDong ? fetchThuListByHoatDong() : fetchAllThuList()}
            sx={{ mr: 1 }}
          >
            Làm mới
          </Button>
          {isFilteredByHoatDong && (
            <Button
              variant="contained"
              color="success"
              startIcon={<AddIcon />}
              onClick={() => navigate(`/dashboard/thuthiennguyen/create?hoatdong=${hoatDongId}`)}
              sx={{ mr: 1 }}
            >
              Thêm đóng góp
            </Button>
          )}
          <Button
            variant="outlined"
            startIcon={<BackIcon />}
            onClick={() => navigate('/dashboard/hoatdongthiennguyen')}
          >
            Quay lại
          </Button>
        </Box>
      </Box>

      {/* Summary */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Tổng số lượt đóng góp
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {filteredList.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'success.light' }}>
            <CardContent>
              <Typography variant="body2" color="white">
                Tổng tiền đã thu
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="white">
                {formatCurrency(totalAmount)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {hoatDong?.mucTieu && (
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Mục tiêu
                </Typography>
                <Typography variant="h5" fontWeight="bold" color="primary">
                  {formatCurrency(hoatDong.mucTieu)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Đã đạt: {((totalAmount / hoatDong.mucTieu) * 100).toFixed(1)}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            placeholder="Tìm kiếm theo tên người đóng hoặc tên hoạt động..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />
        </CardContent>
      </Card>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: 'success.main' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
              {!isFilteredByHoatDong && (
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Hoạt động</TableCell>
              )}
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Người đóng</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Số tiền</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Ngày thu</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Mô tả</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">
                Thao tác
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={isFilteredByHoatDong ? 6 : 7} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : filteredList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isFilteredByHoatDong ? 6 : 7} align="center">
                  Chưa có đóng góp nào
                </TableCell>
              </TableRow>
            ) : (
              filteredList.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>{item.id}</TableCell>
                  {!isFilteredByHoatDong && (
                    <TableCell>
                      <Chip 
                        label={item.hoatDong?.tenHoatDong || 'N/A'} 
                        color="success" 
                        size="small" 
                        variant="outlined"
                      />
                    </TableCell>
                  )}
                  <TableCell>
                    <Typography fontWeight="bold">
                      {item.nguoiDong || 'Ẩn danh'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="success.main" fontWeight="bold">
                      {formatCurrency(item.soTien)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(item.ngayThu)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 200 }}>
                      {item.moTa || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Chỉnh sửa">
                      <IconButton
                        color="primary"
                        onClick={() => navigate(`/dashboard/thuthiennguyen/edit/${item.id}`)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(item.id)}
                      >
                        <DeleteIcon />
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

export default ThuThienNguyenListPage;