-- ============================================
-- Script cập nhật bảng NHANKHAU
-- Thêm các trường còn thiếu cho hiển thị Card
-- ============================================

USE quanlynhankhaudb;

-- Kiểm tra và thêm cột NoiSinh
ALTER TABLE nhankhau 
ADD COLUMN NoiSinh VARCHAR(255) AFTER GioiTinh;

-- Kiểm tra và thêm cột NguyenQuan
ALTER TABLE nhankhau 
ADD COLUMN NguyenQuan VARCHAR(255) AFTER NoiSinh;

-- Kiểm tra và thêm cột QuocTich
ALTER TABLE nhankhau 
ADD COLUMN QuocTich VARCHAR(100) DEFAULT 'Việt Nam' AFTER TonGiao;

-- Kiểm tra và thêm cột DiaChiThuongTru
ALTER TABLE nhankhau 
ADD COLUMN DiaChiThuongTru VARCHAR(500) AFTER QuocTich;

-- Kiểm tra và thêm cột SoDienThoai
ALTER TABLE nhankhau 
ADD COLUMN SoDienThoai VARCHAR(20) AFTER DiaChiThuongTru;

-- Kiểm tra và thêm cột Email
ALTER TABLE nhankhau 
ADD COLUMN Email VARCHAR(255) AFTER SoDienThoai;

-- Kiểm tra và thêm cột TrinhDoHocVan
ALTER TABLE nhankhau 
ADD COLUMN TrinhDoHocVan VARCHAR(100) AFTER NoiLamViec;

-- Hiển thị cấu trúc mới của bảng
DESCRIBE nhankhau;

-- Cập nhật dữ liệu mẫu cho các bản ghi hiện có (tùy chọn)
UPDATE nhankhau 
SET QuocTich = 'Việt Nam' 
WHERE QuocTich IS NULL;

SELECT 'Database schema updated successfully!' AS Status;
