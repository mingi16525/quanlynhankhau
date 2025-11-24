-- ====================================
-- SCRIPT XÓA DỮ LIỆU VÀ RESET AUTO INCREMENT
-- Database: quanlynhankhaudb
-- Ngày: 2025-11-24
-- ====================================

USE quanlynhankhaudb;

-- Tắt foreign key checks để có thể xóa dữ liệu
SET FOREIGN_KEY_CHECKS = 0;

-- ====================================
-- XÓA DỮ LIỆU CÁC BẢNG (Thứ tự quan trọng)
-- ====================================

-- 1. Xóa các bảng phụ thuộc trước
TRUNCATE TABLE danhsachchi;
TRUNCATE TABLE danhsachthuphi;
TRUNCATE TABLE hoatdongthiennguyen;
TRUNCATE TABLE khoanchiphibatbuoc;
TRUNCATE TABLE sukiennhankhau;
TRUNCATE TABLE tamtrutamvang;
TRUNCATE TABLE thanhvienho;
TRUNCATE TABLE thuthiennguyen;

-- 2. Xóa bảng hộ khẩu
TRUNCATE TABLE hokhau;

-- 3. Xóa bảng nhân khẩu
TRUNCATE TABLE nhankhau;

-- 4. Xóa bảng tài khoản và phân quyền
TRUNCATE TABLE taikhoan;
TRUNCATE TABLE phanquyen;
TRUNCATE TABLE vaitro;

-- ====================================
-- RESET AUTO INCREMENT VỀ 1
-- ====================================

ALTER TABLE danhsachchi AUTO_INCREMENT = 1;
ALTER TABLE danhsachthuphi AUTO_INCREMENT = 1;
ALTER TABLE hoatdongthiennguyen AUTO_INCREMENT = 1;
ALTER TABLE hokhau AUTO_INCREMENT = 1;
ALTER TABLE khoanchiphibatbuoc AUTO_INCREMENT = 1;
ALTER TABLE nhankhau AUTO_INCREMENT = 1;
ALTER TABLE phanquyen AUTO_INCREMENT = 1;
ALTER TABLE sukiennhankhau AUTO_INCREMENT = 1;
ALTER TABLE taikhoan AUTO_INCREMENT = 1;
ALTER TABLE tamtrutamvang AUTO_INCREMENT = 1;
ALTER TABLE thanhvienho AUTO_INCREMENT = 1;
ALTER TABLE thuthiennguyen AUTO_INCREMENT = 1;
ALTER TABLE vaitro AUTO_INCREMENT = 1;

-- Bật lại foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- ====================================
-- THÔNG BÁO
-- ====================================
SELECT 'Database đã được reset thành công!' AS Status;
SELECT 'Tất cả dữ liệu đã bị xóa và ID auto increment đã được reset về 1' AS Note;
