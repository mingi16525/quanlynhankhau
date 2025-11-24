import React, { useState, useEffect } from 'react';
import {
  Box,
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
  TextField,
  InputAdornment,
  Chip,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Autocomplete
} from '@mui/material';
import {
  Search as SearchIcon,
  CheckCircle as PaidIcon,
  Cancel as UnpaidIcon,
  Home as HomeIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import thuPhiApi from '../../api/thuPhiApi';
import hoKhauApi from '../../api/hoKhauApi';

const BaoCaoThuPhiPage = () => {
  // States
  const [allThuPhi, setAllThuPhi] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [hoKhauList, setHoKhauList] = useState([]);
  const [selectedHoKhau, setSelectedHoKhau] = useState(null);
  const [filterTrangThai, setFilterTrangThai] = useState('all'); // 'all', 'dadong', 'chuadong'
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [thongKe, setThongKe] = useState({
    tongSo: 0,
    daDong: 0,
    chuaDong: 0,
    tongTienDaThu: 0,
    tongTienChuaThu: 0
  });

  // Load data
  useEffect(() => {
    fetchAllThuPhi();
    fetchHoKhauList();
  }, []);

  // Filter data
  useEffect(() => {
    applyFilters();
  }, [allThuPhi, selectedHoKhau, filterTrangThai]);

  const fetchAllThuPhi = async () => {
    setLoading(true);
    try {
      const response = await thuPhiApi.getAll();
      setAllThuPhi(response.data);
      calculateThongKe(response.data);
    } catch (error) {
      console.error('Error fetching thu phi:', error);
      showAlert('error', 'Lỗi khi tải danh sách thu phí');
    } finally {
      setLoading(false);
    }
  };

  const fetchHoKhauList = async () => {
    try {
      const response = await hoKhauApi.getAll();
      setHoKhauList(response.data);
    } catch (error) {
      console.error('Error fetching ho khau:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...allThuPhi];

    // Filter by hộ khẩu
    if (selectedHoKhau) {
      filtered = filtered.filter(item => item.hoKhau?.id === selectedHoKhau.id);
    }

    // Filter by trạng thái
    if (filterTrangThai === 'dadong') {
      filtered = filtered.filter(item => item.trangThaiThanhToan === 'Đã đóng');
    } else if (filterTrangThai === 'chuadong') {
      filtered = filtered.filter(item => item.trangThaiThanhToan === 'Chưa đóng');
    }

    setFilteredList(filtered);
    calculateThongKe(filtered);
  };

  const calculateThongKe = (data) => {
    const tongSo = data.length;
    const daDong = data.filter(item => item.trangThaiThanhToan === 'Đã đóng').length;
    const chuaDong = tongSo - daDong;
    const tongTienDaThu = data
      .filter(item => item.trangThaiThanhToan === 'Đã đóng')
      .reduce((sum, item) => sum + parseFloat(item.soTien || 0), 0);
    const tongTienChuaThu = data
      .filter(item => item.trangThaiThanhToan === 'Chưa đóng')
      .reduce((sum, item) => sum + parseFloat(item.soTien || 0), 0);

    setThongKe({
      tongSo,
      daDong,
      chuaDong,
      tongTienDaThu,
      tongTienChuaThu
    });
  };

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 3000);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('vi-VN');
  };

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

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          📊 Báo cáo Thu phí
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Xem tổng hợp danh sách thu phí và tìm kiếm theo hộ khẩu
        </Typography>
      </Box>

      {/* Alert */}
      {alert.show && (
        <Alert severity={alert.type} sx={{ mb: 2 }}>
          {alert.message}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Tổng số khoản
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="primary">
                {thongKe.tongSo}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={2.4}>
          <Card sx={{ bgcolor: 'success.light' }}>
            <CardContent>
              <Typography variant="body2" color="white">
                Đã đóng
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="white">
                {thongKe.daDong}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={2.4}>
          <Card sx={{ bgcolor: 'error.light' }}>
            <CardContent>
              <Typography variant="body2" color="white">
                Chưa đóng
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="white">
                {thongKe.chuaDong}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Đã thu
              </Typography>
              <Typography variant="h6" fontWeight="bold" color="success.main">
                {formatCurrency(thongKe.tongTienDaThu)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Chưa thu
              </Typography>
              <Typography variant="h6" fontWeight="bold" color="error.main">
                {formatCurrency(thongKe.tongTienChuaThu)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            {/* Tìm kiếm hộ khẩu */}
            <Grid item xs={12} md={6}>
              <Autocomplete
                options={hoKhauList}
                getOptionLabel={(option) => 
                  `${option.chuHo?.hoTen || 'N/A'} - ${option.diaChi || 'N/A'}`
                }
                value={selectedHoKhau}
                onChange={(event, newValue) => setSelectedHoKhau(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="🔍 Tìm kiếm hộ khẩu"
                    placeholder="Nhập tên chủ hộ hoặc địa chỉ..."
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <InputAdornment position="start">
                            <HomeIcon />
                          </InputAdornment>
                          {params.InputProps.startAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Box>
                      <Typography variant="body1" fontWeight="bold">
                        {option.chuHo?.hoTen || 'N/A'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {option.diaChi || 'N/A'}
                      </Typography>
                    </Box>
                  </li>
                )}
              />
            </Grid>

            {/* Filter trạng thái */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Trạng thái thanh toán</InputLabel>
                <Select
                  value={filterTrangThai}
                  onChange={(e) => setFilterTrangThai(e.target.value)}
                  label="Trạng thái thanh toán"
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="dadong">Đã đóng</MenuItem>
                  <MenuItem value="chuadong">Chưa đóng</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {selectedHoKhau && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Đang xem các khoản phí của hộ: <strong>{selectedHoKhau.chuHo?.hoTen}</strong> - {selectedHoKhau.diaChi}
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: 'primary.main' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Khoản phí</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Loại</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Chủ hộ</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Địa chỉ</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Số tiền</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Trạng thái</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Ngày thanh toán</TableCell>
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
                  <Typography variant="body1" color="text.secondary">
                    {selectedHoKhau 
                      ? 'Hộ này chưa có khoản phí nào' 
                      : 'Không có dữ liệu'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredList.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>
                    <Typography fontWeight="bold">
                      {item.khoanPhi?.tenKhoanPhi || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={item.khoanPhi?.loaiKhoanPhi || 'N/A'} 
                      size="small" 
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography>
                      {item.hoKhau?.chuHo?.hoTen || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {item.hoKhau?.diaChi || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="primary" fontWeight="bold">
                      {formatCurrency(item.soTien)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {getStatusChip(item.trangThaiThanhToan)}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(item.ngayThanhToan)}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Summary */}
      {filteredList.length > 0 && (
        <Card sx={{ mt: 2, bgcolor: 'grey.50' }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Tổng số khoản hiển thị
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {filteredList.length} khoản
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Tổng tiền đã thu (hiển thị)
                </Typography>
                <Typography variant="h6" fontWeight="bold" color="success.main">
                  {formatCurrency(thongKe.tongTienDaThu)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Tổng tiền chưa thu (hiển thị)
                </Typography>
                <Typography variant="h6" fontWeight="bold" color="error.main">
                  {formatCurrency(thongKe.tongTienChuaThu)}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default BaoCaoThuPhiPage;
