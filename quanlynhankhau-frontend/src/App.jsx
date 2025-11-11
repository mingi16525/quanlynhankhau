import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';

import LoginPage from './pages/LoginPage';
import MainLayout from './components/MainLayout.jsx';
import DashboardContent from './pages/DashboardContent.jsx';
import BaoCaoPage from './pages/baocao/BaoCaoPage.jsx';

// Import các trang
import NhanKhauListPage from './pages/nhankhau/NhanKhauListPage';
import NhanKhauFormPage from './pages/nhankhau/NhanKhauFormPage';
import HoKhauListPage from './pages/hokhau/HoKhauListPage';
import HoKhauFormPage from './pages/hokhau/HoKhauFormPage';
import ThanhVienHoListPage from './pages/hokhau/ThanhVienHoListPage';
import TamTruTamVangListPage from './pages/tamtrutamvang/TamTruTamVangListPage.jsx';
import TamTruTamVangFormPage from './pages/tamtrutamvang/TamTruTamVangFormPage.jsx';
import SuKienNhanKhauFormPage from './pages/sukien/SuKienNhanKhauFormPage';
import SuKienNhanKhauListPage from './pages/sukien/SuKienNhanKhauListPage.jsx';

// Thu chi imports
import KhoanChiPhiBatBuocListPage from './pages/thuchi/KhoanChiPhiBatBuocListPage';
import KhoanChiPhiBatBuocFormPage from './pages/thuchi/KhoanChiPhiBatBuocFormPage';
import DanhSachThuPhiListPage from './pages/thuchi/DanhSachThuPhiListPage';
import HoatDongThienNguyenListPage from './pages/thuchi/HoatDongThienNguyenListPage.jsx';
import HoatDongThienNguyenFormPage from './pages/thuchi/HoatDongThienNguyenFormPage';
import ThuThienNguyenListPage from './pages/thuchi/ThuThienNguyenListPage';
import ThuThienNguyenFormPage from './pages/thuchi/ThuThienNguyenFormPage';

// ✅ Import Danh sách chi components
import DanhSachChiListPage from './pages/thuchi/DanhSachChiListPage';
import DanhSachChiFormPage from './pages/thuchi/DanhSachChiFormPage';

// Admin
import TaiKhoanListPage from './pages/admin/TaiKhoanListPage';
import TaiKhoanFormPage from './pages/admin/TaiKhoanFormPage';

// Route Guard
const ProtectedRoute = ({ element }) => {
  const { authState } = useAuth();
  
  console.log('=== PROTECTED ROUTE CHECK ===');
  console.log('isAuthenticated:', authState.isAuthenticated);
  console.log('Full authState:', authState);
  
  if (!authState.isAuthenticated) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  console.log('Authenticated, rendering element');
  return element;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Login Page */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* Redirect root to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Protected Routes with Layout */}
      <Route path="/dashboard" element={<ProtectedRoute element={<MainLayout />} />}>
        <Route index element={<DashboardContent />} />
        
        {/* Nhân khẩu */}
        <Route path="nhankhau" element={<NhanKhauListPage />} />
        <Route path="nhankhau/form/new" element={<NhanKhauFormPage />} />
        <Route path="nhankhau/form/:mode/:id" element={<NhanKhauFormPage />} />
        
        {/* Hộ khẩu */}
        <Route path="hokhau" element={<HoKhauListPage />} />
        <Route path="hokhau/form/:mode/:id" element={<HoKhauFormPage />} />
        <Route path="hokhau/form/new" element={<HoKhauFormPage />} />
        <Route path="hokhau/details/:hoKhauId" element={<ThanhVienHoListPage />} />

        {/* Tạm trú tạm vắng */}
        <Route path="tamtrutamvang" element={<TamTruTamVangListPage />} />
        <Route path="tamtrutamvang/new" element={<TamTruTamVangFormPage />} />
        <Route path="tamtrutamvang/edit/:id" element={<TamTruTamVangFormPage />} />

        {/* Sự kiện Sinh/Mất */}
        <Route path="sukien" element={<SuKienNhanKhauListPage />} />
        <Route path="sukien/new" element={<SuKienNhanKhauFormPage />} />
        <Route path="sukien/edit/:id" element={<SuKienNhanKhauFormPage />} />

        {/* Khoản phí bắt buộc */}
        <Route path="khoanphi" element={<KhoanChiPhiBatBuocListPage />} />
        <Route path="khoanphi/create" element={<KhoanChiPhiBatBuocFormPage />} />
        <Route path="khoanphi/edit/:id" element={<KhoanChiPhiBatBuocFormPage />} />
        
        {/* Thu phí */}
        <Route path="thuphi/khoanphi/:khoanPhiId" element={<DanhSachThuPhiListPage />} />
        
        {/* Hoạt động thiện nguyện */}
        <Route path="hoatdongthiennguyen" element={<HoatDongThienNguyenListPage />} />
        <Route path="hoatdongthiennguyen/create" element={<HoatDongThienNguyenFormPage />} />
        <Route path="hoatdongthiennguyen/edit/:id" element={<HoatDongThienNguyenFormPage />} />
        
        {/* Thu thiện nguyện */}
        <Route path="thuthiennguyen/hoatdong/:hoatDongId" element={<ThuThienNguyenListPage />} />
        <Route path="thuthiennguyen/create" element={<ThuThienNguyenFormPage />} />
        <Route path="thuthiennguyen/edit/:id" element={<ThuThienNguyenFormPage />} />
        
        {/* ✅ Danh sách chi - Routes mới */}
        <Route path="danhsachchi" element={<DanhSachChiListPage />} />
        <Route path="danhsachchi/create" element={<DanhSachChiFormPage />} />
        <Route path="danhsachchi/edit/:id" element={<DanhSachChiFormPage />} />

        {/* Admin */}
        <Route path="admin/taikhoan" element={<TaiKhoanListPage />} />
        <Route path="admin/taikhoan/form/new" element={<TaiKhoanFormPage />} />
        <Route path="admin/taikhoan/form/:mode/:id" element={<TaiKhoanFormPage />} />
        {/* Báo cáo */}
        <Route path="baocao" element={<BaoCaoPage />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<h1>404 - Không tìm thấy trang</h1>} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;