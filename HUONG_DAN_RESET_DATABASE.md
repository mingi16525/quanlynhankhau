# HƯỚNG DẪN RESET DATABASE

## File đã tạo:
- `reset_database.sql` - Script SQL để xóa dữ liệu và reset auto increment

## Cách 1: Sử dụng MySQL Workbench (KHUYẾN NGHỊ)

1. Mở MySQL Workbench
2. Kết nối đến database `quanlynhankhaudb`
3. Mở file `reset_database.sql` (File -> Open SQL Script)
4. Click Execute (icon sét hoặc Ctrl+Shift+Enter)
5. Xem kết quả trong Output panel

## Cách 2: Sử dụng Command Line

### Nếu dùng MySQL Server:
```powershell
cd "C:\Program Files\MySQL\MySQL Server 8.0\bin"
.\mysql.exe -u root -p < "d:\2025.2\NhapMonCNPN\BTL_CNPM\reset_database.sql"
```

### Nếu dùng XAMPP:
```powershell
cd C:\xampp\mysql\bin
.\mysql.exe -u root -p < "d:\2025.2\NhapMonCNPN\BTL_CNPM\reset_database.sql"
```

### Hoặc chạy trực tiếp:
```powershell
# Đăng nhập MySQL
mysql -u root -p

# Sau khi đăng nhập, chạy:
source d:/2025.2/NhapMonCNPN/BTL_CNPM/reset_database.sql
```

## Cách 3: Copy-Paste vào MySQL Console

1. Mở file `reset_database.sql`
2. Copy toàn bộ nội dung
3. Mở MySQL Command Line hoặc Workbench
4. Paste và Execute

## Kết quả mong đợi:

Sau khi chạy script thành công:
- ✅ Tất cả dữ liệu trong các bảng đã bị xóa
- ✅ Auto increment của tất cả bảng đã được reset về 1
- ✅ Database sạch sẽ, sẵn sàng nhập dữ liệu mới

## Lưu ý:

⚠️ **CẢNH BÁO**: Script này sẽ XÓA TOÀN BỘ dữ liệu trong database!
- Backup dữ liệu nếu cần trước khi chạy
- Không thể hoàn tác sau khi chạy

## Các bảng được reset:

1. danhsachchi
2. danhsachthuphi  
3. hoatdongthiennguyen
4. hokhau
5. khoanchiphibatbuoc
6. nhankhau
7. phanquyen
8. sukiennhankhau
9. taikhoan
10. tamtrutamvang
11. thanhvienho
12. thuthiennguyen
13. vaitro
