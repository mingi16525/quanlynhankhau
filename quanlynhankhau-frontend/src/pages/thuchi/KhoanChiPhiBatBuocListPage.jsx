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
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Receipt as ReceiptIcon,
  PlaylistAdd as GenerateIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import khoanPhiApi from '../../api/khoanPhiApi';
import thuPhiApi from '../../api/thuPhiApi';

const KhoanChiPhiBatBuocListPage = () => {
  const navigate = useNavigate();
  
  // States
  const [khoanPhiList, setKhoanPhiList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterLoai, setFilterLoai] = useState('all');
  const [filterTrangThai, setFilterTrangThai] = useState('all');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, name: '' });
  const [generateDialog, setGenerateDialog] = useState({ open: false, id: null, name: '' });
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [generating, setGenerating] = useState(false);

  // Load data
  useEffect(() => {
    fetchKhoanPhiList();
  }, []);

  // Filter data
  useEffect(() => {
    let filtered = [...khoanPhiList];

    // Filter by search
    if (searchKeyword) {
      filtered = filtered.filter(item =>
        item.tenKhoanPhi.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    // Filter by loại
    if (filterLoai !== 'all') {
      filtered = filtered.filter(item => item.loaiKhoanPhi === filterLoai);
    }

    // Filter by trạng thái
    if (filterTrangThai !== 'all') {
      filtered = filtered.filter(item => item.trangThai === filterTrangThai);
    }

    setFilteredList(filtered);
  }, [khoanPhiList, searchKeyword, filterLoai, filterTrangThai]);

  // Fetch data from API
  const fetchKhoanPhiList = async () => {
    setLoading(true);
    try {
      const response = await khoanPhiApi.getAll();
      setKhoanPhiList(response.data);
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
      await khoanPhiApi.delete(deleteDialog.id);
      showAlert('success', 'Xóa thành công');
      fetchKhoanPhiList();
    } catch (error) {
      console.error('Error deleting:', error);
      showAlert('error', 'Lỗi khi xóa khoản phí');
    } finally {
      setDeleteDialog({ open: false, id: null, name: '' });
    }
  };

  // ========== ✅ XỬ LÝ GENERATE DANH SÁCH THU PHÍ ==========
  
  const handleGenerateClick = (id, name) => {
    setGenerateDialog({ open: true, id, name });
  };

  const handleGenerateConfirm = async () => {
    setGenerating(true);
    try {
      const response = await thuPhiApi.createForAllHo(generateDialog.id);
      
      showAlert('success', 
        `✅ Đã tạo ${response.data.success} khoản thu, bỏ qua ${response.data.skipped} hộ`
      );
      
      // Hiển thị chi tiết nếu có hộ bị bỏ qua
      if (response.data.details && response.data.details.length > 0) {
        console.log('Chi tiết hộ bị bỏ qua:', response.data.details);
      }
      
    } catch (error) {
      console.error('Error generating:', error);
      const errorMsg = error.response?.data?.message || 'Lỗi khi tạo danh sách thu';
      showAlert('error', errorMsg);
    } finally {
      setGenerating(false);
      setGenerateDialog({ open: false, id: null, name: '' });
    }
  };

  // Handle status change
  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Đang áp dụng' ? 'Tạm dừng' : 'Đang áp dụng';
    
    try {
      await khoanPhiApi.updateTrangThai(id, newStatus);
      showAlert('success', `Đã chuyển sang ${newStatus}`);
      fetchKhoanPhiList();
    } catch (error) {
      console.error('Error updating status:', error);
      showAlert('error', 'Lỗi khi cập nhật trạng thái');
    }
  };

  // ========== ✅ XEM DANH SÁCH THU PHÍ ==========
  
  const handleViewThuPhi = (khoanPhiId) => {
    navigate(`/dashboard/thuphi/khoanphi/${khoanPhiId}`);
  };

  // Get status chip
  const getStatusChip = (trangThai) => {
    const statusConfig = {
      'Đang áp dụng': { color: 'success', icon: <ActiveIcon /> },
      'Tạm dừng': { color: 'warning', icon: <InactiveIcon /> },
      'Đã kết thúc': { color: 'default', icon: <InactiveIcon /> }
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

  // Get loai chip
  const getLoaiChip = (loai) => {
    const loaiConfig = {
      'Bắt buộc': 'error',
      'Tự nguyện': 'primary',
      'Khác': 'default'
    };

    return (
      <Chip
        label={loai}
        color={loaiConfig[loai] || 'default'}
        size="small"
        variant="outlined"
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
          📋 Quản lý Khoản Chi Phí Bắt Buộc
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchKhoanPhiList}
            sx={{ mr: 1 }}
          >
            Làm mới
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/dashboard/khoanphi/create')}
          >
            Thêm khoản phí
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {/* Search */}
            <TextField
              placeholder="Tìm kiếm theo tên khoản phí..."
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

            {/* Filter by Loại */}
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Loại khoản phí</InputLabel>
              <Select
                value={filterLoai}
                onChange={(e) => setFilterLoai(e.target.value)}
                label="Loại khoản phí"
              >
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="Bắt buộc">Bắt buộc</MenuItem>
                <MenuItem value="Tự nguyện">Tự nguyện</MenuItem>
                <MenuItem value="Khác">Khác</MenuItem>
              </Select>
            </FormControl>

            {/* Filter by Trạng thái */}
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={filterTrangThai}
                onChange={(e) => setFilterTrangThai(e.target.value)}
                label="Trạng thái"
              >
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="Đang áp dụng">Đang áp dụng</MenuItem>
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
          <TableHead sx={{ bgcolor: 'primary.main' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tên khoản phí</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Loại</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Số tiền/hộ</TableCell>
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
                    <Typography fontWeight="bold">{item.tenKhoanPhi}</Typography>
                  </TableCell>
                  <TableCell>{getLoaiChip(item.loaiKhoanPhi)}</TableCell>
                  <TableCell>
                    <Typography color="primary" fontWeight="bold">
                      {formatCurrency(item.soTienMoiHo)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ cursor: 'pointer' }} onClick={() => handleStatusChange(item.id, item.trangThai)}>
                      {getStatusChip(item.trangThai)}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {item.moTa || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    {/* ✅ Nút tạo danh sách thu */}
                    <Tooltip title="Tạo danh sách thu cho tất cả hộ">
                      <IconButton
                        color="success"
                        onClick={() => handleGenerateClick(item.id, item.tenKhoanPhi)}
                      >
                        <GenerateIcon />
                      </IconButton>
                    </Tooltip>
                    
                    {/* ✅ Nút xem danh sách thu */}
                    <Tooltip title="Xem danh sách thu">
                      <IconButton
                        color="info"
                        onClick={() => handleViewThuPhi(item.id)}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Chỉnh sửa">
                      <IconButton
                        color="primary"
                        onClick={() => navigate(`/dashboard/khoanphi/edit/${item.id}`)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Xóa">
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(item.id, item.tenKhoanPhi)}
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
              Tổng số khoản phí
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              {filteredList.length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Đang áp dụng
            </Typography>
            <Typography variant="h5" fontWeight="bold" color="success.main">
              {filteredList.filter(item => item.trangThai === 'Đang áp dụng').length}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* ========== ✅ DIALOG TẠO DANH SÁCH THU ========== */}
      <Dialog 
        open={generateDialog.open} 
        onClose={() => !generating && setGenerateDialog({ open: false, id: null, name: '' })}
      >
        <DialogTitle>🎯 Tạo danh sách thu phí</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn muốn tạo danh sách thu cho khoản phí:
          </Typography>
          <Typography fontWeight="bold" color="primary" sx={{ mt: 1 }}>
            {generateDialog.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            ℹ️ Hệ thống sẽ tự động tạo khoản thu cho TẤT CẢ hộ khẩu.
          </Typography>
          <Typography variant="body2" color="warning.main" sx={{ mt: 1 }}>
            ⚠️ Các hộ đã có khoản thu này sẽ bị bỏ qua.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setGenerateDialog({ open: false, id: null, name: '' })}
            disabled={generating}
          >
            Hủy
          </Button>
          <Button 
            onClick={handleGenerateConfirm} 
            color="success" 
            variant="contained"
            disabled={generating}
            startIcon={generating ? <CircularProgress size={20} /> : <GenerateIcon />}
          >
            {generating ? 'Đang tạo...' : 'Tạo danh sách'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, id: null, name: '' })}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa khoản phí <strong>{deleteDialog.name}</strong>?
          </Typography>
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            ⚠️ Thao tác này không thể hoàn tác!
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
    </Box>
  );
};

export default KhoanChiPhiBatBuocListPage;