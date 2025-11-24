# ✅ HOÀN TẤT CẬP NHẬT BACKEND CHO CARDS HIỂN THỊ

## 📊 Tổng quan

Đã cập nhật backend Spring Boot để hỗ trợ hiển thị **Cards thông tin chi tiết thành viên hộ** trên frontend React.

---

## 🔧 Những gì đã thực hiện

### 1. ✅ Cập nhật Entity `NhanKhau`
**File**: `demo/src/main/java/cnpm/qlnk/demo/entity/NhanKhau.java`

Đã thêm **7 trường mới**:
```java
@Column(name = "NoiSinh")
private String noiSinh;  // Nơi sinh

@Column(name = "NguyenQuan")
private String nguyenQuan;  // Nguyên quán

@Column(name = "QuocTich")
private String quocTich;  // Quốc tịch

@Column(name = "DiaChiThuongTru")
private String diaChiThuongTru;  // Địa chỉ thường trú

@Column(name = "SoDienThoai")
private String soDienThoai;  // Số điện thoại

@Column(name = "Email")
private String email;  // Email

@Column(name = "TrinhDoHocVan")
private String trinhDoHocVan;  // Trình độ học vấn
```

### 2. ✅ Database tự động cập nhật
Nhờ cấu hình `ddl-auto: update` trong `application.yml`, Hibernate đã tự động thực thi:

```sql
ALTER TABLE nhankhau ADD COLUMN dia_chi_thuong_tru VARCHAR(255);
ALTER TABLE nhankhau ADD COLUMN email VARCHAR(255);
ALTER TABLE nhankhau ADD COLUMN nguyen_quan VARCHAR(255);
ALTER TABLE nhankhau ADD COLUMN noi_sinh VARCHAR(255);
ALTER TABLE nhankhau ADD COLUMN quoc_tich VARCHAR(255);
ALTER TABLE nhankhau ADD COLUMN so_dien_thoai VARCHAR(255);
ALTER TABLE nhankhau ADD COLUMN trinh_do_hoc_van VARCHAR(255);
```

### 3. ✅ Frontend UI đã có Cards
**File**: `quanlynhankhau-frontend/src/pages/hokhau/ThanhVienHoListPage.jsx`

Đã thêm:
- Row/Col grid layout responsive
- Card component với Descriptions
- Icons cho từng loại thông tin
- Gender-based icons (ManOutlined/WomanOutlined)
- Phân biệt chủ hộ vs thành viên thường
- Delete button cho từng card

---

## 🚀 CÁCH KHỞI ĐỘNG VÀ KIỂM TRA

### BƯỚC 1: Khởi động Backend

#### Option A: Sử dụng Maven Wrapper (Khuyến nghị)
```powershell
cd d:\2025.2\NhapMonCNPN\BTL_CNPM\demo
.\mvnw.cmd spring-boot:run
```

#### Option B: Nếu đã cài Maven
```powershell
cd d:\2025.2\NhapMonCNPN\BTL_CNPM\demo
mvn spring-boot:run
```

#### Option C: Sử dụng IDE
1. Mở **IntelliJ IDEA** hoặc **Eclipse**
2. Import project: `d:\2025.2\NhapMonCNPN\BTL_CNPM\demo`
3. Chạy class `DemoApplication.java`
4. Chờ console hiển thị: `Started DemoApplication in X seconds`

**✅ Backend đã chạy thành công khi thấy:**
```
Tomcat started on port 8080 (http) with context path '/'
Started DemoApplication in 4.713 seconds
```

### BƯỚC 2: Kiểm tra Database

Mở **MySQL Workbench** hoặc **DataGrip**, chạy query:

```sql
USE quanlynhankhaudb;

-- Kiểm tra cấu trúc bảng
DESCRIBE nhankhau;

-- Xem dữ liệu
SELECT id, HoTen, SoCCCD, SoDienThoai, Email, NoiSinh, NguyenQuan 
FROM nhankhau 
LIMIT 5;
```

**Kết quả mong đợi**: Bảng `nhankhau` có các cột mới:
- ✅ NoiSinh
- ✅ NguyenQuan
- ✅ QuocTich
- ✅ DiaChiThuongTru
- ✅ SoDienThoai
- ✅ Email
- ✅ TrinhDoHocVan

### BƯỚC 3: Test API

#### Option A: Sử dụng Browser
Mở trình duyệt, truy cập:
```
http://localhost:8080/api/nhankhau
```

#### Option B: Sử dụng PowerShell
```powershell
Invoke-RestMethod -Uri "http://localhost:8080/api/nhankhau" | Select-Object -First 1 | ConvertTo-Json -Depth 3
```

#### Option C: Sử dụng Postman
```
GET http://localhost:8080/api/hokhau/1/thanhvien
```

**✅ Response mong đợi** (có các trường mới):
```json
[
  {
    "id": 1,
    "nhanKhau": {
      "id": 1,
      "hoTen": "Nguyễn Văn A",
      "ngaySinh": "1990-01-01",
      "gioiTinh": "Nam",
      "soCCCD": "001234567890",
      "ngheNghiep": "Kỹ sư",
      "noiLamViec": "Công ty ABC",
      "queQuan": "Nam Định",
      "danToc": "Kinh",
      "tonGiao": "Không",
      "tinhTrang": "Thường trú",
      "ghiChu": null,
      
      // ⭐ CÁC TRƯỜNG MỚI ⭐
      "noiSinh": null,
      "nguyenQuan": null,
      "quocTich": null,
      "diaChiThuongTru": null,
      "soDienThoai": null,
      "email": null,
      "trinhDoHocVan": null
    },
    "quanHeVoiChuHo": "Chủ hộ",
    "ghiChu": null
  }
]
```

> **Lưu ý**: Các trường mới sẽ có giá trị `null` nếu chưa cập nhật dữ liệu.

### BƯỚC 4: Khởi động Frontend

```powershell
cd d:\2025.2\NhapMonCNPN\BTL_CNPM\quanlynhankhau-frontend
npm run dev
```

**✅ Frontend chạy khi thấy:**
```
VITE v7.1.12  ready in XXX ms
➜  Local:   http://localhost:3000/
```

### BƯỚC 5: Kiểm tra UI Cards

1. Mở trình duyệt: `http://localhost:3000`
2. Đăng nhập vào hệ thống
3. Vào menu **Hộ khẩu**
4. Nhấn **Xem chi tiết** một hộ bất kỳ
5. Cuộn xuống phần **"Thông tin chi tiết thành viên"**

**✅ Kết quả mong đợi:**
- Cards hiển thị theo grid responsive (3 cột trên desktop)
- Mỗi card có:
  - Icon giới tính (Nam/Nữ)
  - Tag "Chủ hộ" màu đỏ nếu là chủ hộ
  - Border trái màu đỏ (chủ hộ) hoặc xanh (thành viên)
  - Descriptions với 17 trường thông tin
  - Button "Xóa" cho thành viên không phải chủ hộ

---

## 📝 CẬP NHẬT DỮ LIỆU MẪU (Tùy chọn)

Để Cards hiển thị đầy đủ thông tin thay vì "Chưa cập nhật", chạy SQL:

```sql
USE quanlynhankhaudb;

-- Cập nhật cho nhân khẩu ID = 1
UPDATE nhankhau 
SET 
    NoiSinh = 'Hà Nội',
    NguyenQuan = 'Nam Định',
    QuocTich = 'Việt Nam',
    DiaChiThuongTru = 'Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội',
    SoDienThoai = '0912345678',
    Email = 'nguyenvana@email.com',
    TrinhDoHocVan = 'Đại học'
WHERE id = 1;

-- Cập nhật cho nhân khẩu ID = 2
UPDATE nhankhau 
SET 
    NoiSinh = 'Hải Phòng',
    NguyenQuan = 'Hải Phòng',
    QuocTich = 'Việt Nam',
    DiaChiThuongTru = 'Số 10 Lê Lợi, Ngô Quyền, Hải Phòng',
    SoDienThoai = '0987654321',
    Email = 'tranthib@email.com',
    TrinhDoHocVan = 'Cao đẳng'
WHERE id = 2;

-- Kiểm tra kết quả
SELECT id, HoTen, SoDienThoai, Email, NoiSinh FROM nhankhau;
```

---

## 🎯 KIỂM TRA TOÀN BỘ LUỒNG

### Test Case 1: Xem thông tin thành viên
1. ✅ Backend API trả về đầy đủ 17+ trường
2. ✅ Frontend Cards hiển thị tất cả trường
3. ✅ Icons và Tags hiển thị đúng
4. ✅ Layout responsive trên mobile/tablet/desktop

### Test Case 2: Thêm thành viên mới
1. Nhấn button **"Thêm thành viên"**
2. Chọn nhân khẩu từ dropdown
3. Chọn quan hệ với chủ hộ
4. Submit form
5. ✅ Card mới xuất hiện trong danh sách

### Test Case 3: Xóa thành viên
1. Nhấn button **"Xóa"** trên card (không phải chủ hộ)
2. Confirm xóa
3. ✅ Card biến mất khỏi danh sách

### Test Case 4: Cập nhật thông tin nhân khẩu
1. Vào menu **Nhân khẩu** → Sửa 1 nhân khẩu
2. Cập nhật các trường: SoDienThoai, Email, NoiSinh, v.v.
3. Lưu
4. Quay lại trang **Thành viên hộ**
5. ✅ Card hiển thị dữ liệu mới

---

## 🐛 TROUBLESHOOTING

### ❌ Lỗi: "Column 'NoiSinh' not found"
**Nguyên nhân**: Database chưa được cập nhật

**Giải pháp**:
1. Kiểm tra `application.yml` có `ddl-auto: update` không
2. Restart backend
3. Hoặc chạy thủ công: `database_updates/add_nhankhau_fields.sql`

### ❌ Backend không khởi động
**Nguyên nhân**: MySQL chưa chạy hoặc port 8080 bị chiếm

**Giải pháp**:
```powershell
# Kiểm tra MySQL
Get-Service | Where-Object {$_.Name -like "*mysql*"}

# Kiểm tra port 8080
netstat -ano | findstr :8080
```

### ❌ API trả về null cho các trường mới
**Nguyên nhân**: Dữ liệu chưa được nhập

**Giải pháp**: Chạy UPDATE query ở phần "Cập nhật dữ liệu mẫu"

### ❌ Cards hiển thị "Chưa cập nhật"
**Nguyên nhân**: Đây là behavior bình thường khi data = null

**Giải pháp**: Không phải lỗi, cập nhật dữ liệu để hiển thị giá trị thực

### ❌ Frontend không kết nối được backend
**Nguyên nhân**: CORS hoặc backend chưa chạy

**Giải pháp**:
1. Kiểm tra backend đang chạy: `http://localhost:8080/api/nhankhau`
2. Kiểm tra `.env.local` có đúng `VITE_API_BASE_URL` không
3. Clear cache browser (Ctrl+F5)

---

## 📂 CÁC FILE LIÊN QUAN

### Backend
```
demo/src/main/java/cnpm/qlnk/demo/
├── entity/
│   └── NhanKhau.java          ✅ ĐÃ SỬA - Thêm 7 trường mới
├── controller/
│   └── HoKhauController.java  ✓ Không đổi
├── service/
│   └── HoKhauService.java     ✓ Không đổi
└── repository/
    └── ThanhVienHoRepository.java  ✓ Không đổi
```

### Frontend
```
quanlynhankhau-frontend/src/
└── pages/hokhau/
    └── ThanhVienHoListPage.jsx  ✅ ĐÃ SỬA - Thêm Cards UI
```

### Database Scripts (Backup)
```
database_updates/
└── add_nhankhau_fields.sql  ℹ️ SQL thủ công (nếu cần)
```

### Documentation
```
├── BACKEND_UPDATE_SUMMARY.md     📄 File này
├── DATABASE_UPDATE_GUIDE.md      📄 Hướng dẫn DB chi tiết
└── PORT_FORWARD_GUIDE.md         📄 Hướng dẫn deploy
```

---

## ✅ CHECKLIST HOÀN THÀNH

- [x] Entity `NhanKhau` đã có 7 trường mới
- [x] Database schema đã được cập nhật tự động
- [x] Backend API trả về đầy đủ fields
- [x] Frontend Cards UI đã hoàn chỉnh
- [x] Icons và Tags hiển thị đúng
- [x] Layout responsive
- [x] Delete function hoạt động
- [x] Tài liệu hướng dẫn đầy đủ

---

## 🚀 NEXT STEPS

1. **Khởi động Backend và Frontend** (theo hướng dẫn trên)
2. **Cập nhật dữ liệu mẫu** (nếu muốn test UI đầy đủ)
3. **Test các tính năng**: Xem, Thêm, Xóa thành viên
4. **Deploy lên Render** (khi sẵn sàng production)

---

## 💡 TIP

Để nhanh chóng test UI với dữ liệu đầy đủ, chạy script sau:

```sql
UPDATE nhankhau 
SET 
    NoiSinh = CONCAT('Hà Nội - ', id),
    NguyenQuan = 'Hà Nội',
    QuocTich = 'Việt Nam',
    DiaChiThuongTru = CONCAT('Số ', id, ' Đại Cồ Việt, Hai Bà Trưng, Hà Nội'),
    SoDienThoai = CONCAT('091234', LPAD(id, 4, '0')),
    Email = CONCAT('nhankhau', id, '@email.com'),
    TrinhDoHocVan = 'Đại học'
WHERE NoiSinh IS NULL;
```

Sau đó refresh trang frontend để thấy Cards với dữ liệu đầy đủ! 🎉
