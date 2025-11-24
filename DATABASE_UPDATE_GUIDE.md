# Hướng dẫn Cập nhật Database

## Vấn đề
Frontend hiển thị Cards với đầy đủ thông tin nhân khẩu, nhưng database hiện tại **thiếu các trường**:
- `NoiSinh` (Nơi sinh)
- `NguyenQuan` (Nguyên quán)
- `QuocTich` (Quốc tịch)
- `DiaChiThuongTru` (Địa chỉ thường trú)
- `SoDienThoai` (Số điện thoại)
- `Email`
- `TrinhDoHocVan` (Trình độ học vấn)

## Cách thực hiện

### Option 1: MySQL Workbench
1. Mở **MySQL Workbench**
2. Kết nối đến database `quanlynhankhaudb`
3. Mở file: `database_updates/add_nhankhau_fields.sql`
4. Nhấn **Execute** (⚡ icon) để chạy script
5. Kiểm tra kết quả với: `DESCRIBE nhankhau;`

### Option 2: DataGrip / DBeaver
1. Mở **DataGrip** hoặc **DBeaver**
2. Kết nối đến database `quanlynhankhaudb`
3. Mở file SQL: `database_updates/add_nhankhau_fields.sql`
4. Run script (Ctrl+Enter)
5. Refresh schema để xem các cột mới

### Option 3: Command Line (nếu MySQL trong PATH)
```bash
mysql -u root -p quanlynhankhaudb < database_updates/add_nhankhau_fields.sql
```

### Option 4: Spring Boot tự động tạo (Hibernate DDL)
Nếu bạn đã set `spring.jpa.hibernate.ddl-auto=update` trong `application.properties`, 
Spring Boot sẽ tự động thêm các cột khi khởi động lại ứng dụng.

**⚠️ LƯU Ý**: Cách này chỉ an toàn trong môi trường development!

## Kiểm tra sau khi update

Chạy query sau để xem cấu trúc bảng:

```sql
USE quanlynhankhaudb;
DESCRIBE nhankhau;
```

Hoặc kiểm tra dữ liệu:

```sql
SELECT id, HoTen, SoCCCD, SoDienThoai, Email, NoiSinh, NguyenQuan 
FROM nhankhau 
LIMIT 5;
```

## Sau khi update database

1. **Khởi động lại Spring Boot backend**:
   ```bash
   cd demo
   mvn spring-boot:run
   ```

2. **Kiểm tra API response**:
   - Truy cập: `http://localhost:8080/api/hokhau/{id}/thanhvien`
   - Kiểm tra JSON có chứa các trường mới không

3. **Test trên Frontend**:
   - Vào trang **Thành viên hộ**
   - Kiểm tra Cards hiển thị đầy đủ thông tin

## Cập nhật dữ liệu mẫu (tùy chọn)

Sau khi thêm cột, bạn có thể cập nhật dữ liệu mẫu:

```sql
UPDATE nhankhau 
SET 
    NoiSinh = 'Hà Nội',
    NguyenQuan = 'Hà Nội',
    QuocTich = 'Việt Nam',
    DiaChiThuongTru = 'Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội',
    SoDienThoai = '0912345678',
    Email = 'example@email.com',
    TrinhDoHocVan = 'Đại học'
WHERE id = 1; -- Cập nhật cho nhân khẩu có ID = 1
```

## Troubleshooting

### Lỗi: "Duplicate column name"
➡️ Cột đã tồn tại, bỏ qua hoặc xóa câu lệnh ALTER TABLE cho cột đó

### Backend không nhận ra cột mới
➡️ Restart Spring Boot application

### Frontend vẫn hiển thị "Chưa cập nhật"
➡️ Kiểm tra:
1. Database đã có cột chưa?
2. Backend đã restart chưa?
3. API response có trả về data không? (check DevTools Network tab)
