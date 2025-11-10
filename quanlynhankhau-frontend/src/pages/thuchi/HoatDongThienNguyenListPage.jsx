import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Tooltip,
  Grid,
  LinearProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  BarChart as StatsIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon
} from '@mui/icons-material';
import hoatDongThienNguyenApi from '../../api/hoatDongThienNguyenApi';

const HoatDongThienNguyenListPage = () => {
  const navigate = useNavigate();
  
  // States
  const [hoatDongList, setHoatDongList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterTrangThai, setFilterTrangThai] = useState('all');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, name: '' });
  const [statsDialog, setStatsDialog] = useState({ open: false, data: null });
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  // Load data
  useEffect(() => {
    fetchHoatDongList();
  }, []);

  // Filter data
  useEffect(() => {
    let filtered = [...hoatDongList];

    // Filter by search
    if (searchKeyword) {
      filtered = filtered.filter(item =>
        item.tenHoatDong.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    // Filter by trạng thái
    if (filterTrangThai !== 'all') {
      filtered = filtered.filter(item => item.trangThai === filterTrangThai);
    }

    setFilteredList(filtered);
  }, [hoatDongList, searchKeyword, filterTrangThai]);

  // Fetch data from API
  const fetchHoatDongList = async () => {
    setLoading(true);
    try {
      const response = await hoatDongThienNguyenApi.getAll();
      setHoatDongList(response.data);
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
  const handleDeleteClick = (id, name) => {
    setDeleteDialog({ open: true, id, name });
  };

  const handleDeleteConfirm = async () => {
    try {
      await hoatDongThienNguyenApi.delete(deleteDialog.id);
      showAlert('success', 'Xóa thành công');
      fetchHoatDongList();
    } catch (error) {
      console.error('Error deleting:', error);
      showAlert('error', 'Lỗi khi xóa hoạt động');
    } finally {
      setDeleteDialog({ open: false, id: null, name: '' });
    }
  };

  // Handle view stats
  const handleViewStats = async (id) => {
    try {
      const response = await hoatDongThienNguyenApi.getThongKe(id);
      setStatsDialog({ open: true, data: response.data });
    } catch (error) {
      console.error('Error fetching stats:', error);
      showAlert('error', 'Lỗi khi tải thống kê');
    }
  };

  // Handle view donations
  const handleViewDonations = (hoatDongId) => {
    navigate(`/dashboard/thuthiennguyen/hoatdong/${hoatDongId}`);
  };

  // Get status chip
  const getStatusChip = (trangThai) => {
    const statusConfig = {
      'Đang gây quỹ': { color: 'success', icon: <ActiveIcon /> },
      'Đã kết thúc': { color: 'default', icon: <InactiveIcon /> },
      'Tạm dừng': { color: 'warning', icon: <InactiveIcon /> }
    };

    const config = statusConfig[trangThai] || statusConfig['Đã kết thúc'];

    return (
      <Chip
        label={trangThai}
        color={config.color}
        icon={config.icon}
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
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Alert */}
      {alert.show && (
        <Alert severity={alert.type} sx={{ mb: 2 }}>
          {alert.message}
        </Alert>
      )}

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          💚 Quản lý Hoạt động Thiện Nguyện
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchHoatDongList}
            sx={{ mr: 1 }}
          >
            Làm mới
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/dashboard/hoatdongthiennguyen/create')}
          >
            Thêm hoạt động
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {/* Search */}
            <TextField
              placeholder="Tìm kiếm theo tên hoạt động..."
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

            {/* Filter by Trạng thái */}
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={filterTrangThai}
                onChange={(e) => setFilterTrangThai(e.target.value)}
                label="Trạng thái"
              >
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="Đang gây quỹ">Đang gây quỹ</MenuItem>
                <MenuItem value="Tạm dừng">Tạm dừng</MenuItem>
                <MenuItem value="Đã kết thúc">Đã kết thúc</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: 'success.main' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tên hoạt động</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Mục tiêu</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Thời gian</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Trạng thái</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Mô tả</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">
                Thao tác
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : filteredList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              filteredList.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>
                    <Typography fontWeight="bold">{item.tenHoatDong}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="success.main" fontWeight="bold">
                      {item.mucTieu ? formatCurrency(item.mucTieu) : 'Không giới hạn'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(item.ngayBatDau)} - {formatDate(item.ngayKetThuc)}
                    </Typography>
                  </TableCell>
                  <TableCell>{getStatusChip(item.trangThai)}</TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 200 }}>
                      {item.moTa || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    {/* Xem thống kê */}
                    <Tooltip title="Xem thống kê">
                      <IconButton
                        color="info"
                        onClick={() => handleViewStats(item.id)}
                      >
                        <StatsIcon />
                      </IconButton>
                    </Tooltip>

                    {/* Xem danh sách đóng góp */}
                    <Tooltip title="Xem danh sách đóng góp">
                      <IconButton
                        color="success"
                        onClick={() => handleViewDonations(item.id)}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>

                    {/* Chỉnh sửa */}
                    <Tooltip title="Chỉnh sửa">
                      <IconButton
                        color="primary"
                        onClick={() => navigate(`/dashboard/hoatdongthiennguyen/edit/${item.id}`)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>

                    {/* Xóa */}
                    <Tooltip title="Xóa">
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(item.id, item.tenHoatDong)}
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

      {/* Summary */}
      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Tổng số hoạt động
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              {filteredList.length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, bgcolor: 'success.light' }}>
          <CardContent>
            <Typography variant="body2" color="white">
              Đang gây quỹ
            </Typography>
            <Typography variant="h5" fontWeight="bold" color="white">
              {filteredList.filter(item => item.trangThai === 'Đang gây quỹ').length}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, id: null, name: '' })}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa hoạt động <strong>{deleteDialog.name}</strong>?
          </Typography>
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            ⚠️ Thao tác này sẽ xóa tất cả dữ liệu đóng góp liên quan!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, id: null, name: '' })}>
            Hủy
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Stats Dialog */}
      <Dialog 
        open={statsDialog.open} 
        onClose={() => setStatsDialog({ open: false, data: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>📊 Thống kê hoạt động</DialogTitle>
        <DialogContent>
          {statsDialog.data && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  {statsDialog.data.tenHoatDong}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Card>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      Mục tiêu
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {formatCurrency(statsDialog.data.mucTieu || 0)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={6}>
                <Card>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      Đã thu được
                    </Typography>
                    <Typography variant="h6" color="success.main">
                      {formatCurrency(statsDialog.data.tongThuDuoc)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={6}>
                <Card>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      Còn thiếu
                    </Typography>
                    <Typography variant="h6" color="error.main">
                      {formatCurrency(statsDialog.data.conThieu)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={6}>
                <Card>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      Số lượt đóng
                    </Typography>
                    <Typography variant="h6">
                      {statsDialog.data.soLuotDong}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Tiến độ</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {statsDialog.data.tiLeHoanThanh.toFixed(1)}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min(statsDialog.data.tiLeHoanThanh, 100)} 
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Chip 
                  label={statsDialog.data.trangThai} 
                  color={statsDialog.data.trangThai === 'Đang gây quỹ' ? 'success' : 'default'}
                  sx={{ mt: 1 }}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatsDialog({ open: false, data: null })}>
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HoatDongThienNguyenListPage;