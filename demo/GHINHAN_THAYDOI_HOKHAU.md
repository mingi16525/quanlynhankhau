# Entity GhiNhanThayDoiHoKhau

## Mục đích
Theo dõi và ghi lại lịch sử tất cả các thay đổi được thực hiện trên Hộ khẩu, giúp kiểm tra và audit các hoạt động.

## Cấu trúc Entity

### Các trường dữ liệu

| Trường | Kiểu dữ liệu | Mô tả |
|--------|--------------|-------|
| `id` | Long | ID tự động tăng (Primary Key) |
| `hoKhau` | HoKhau | Hộ khẩu bị thay đổi (Foreign Key) |
| `tenSuKien` | String | Loại sự kiện thực hiện |
| `moTa` | String (TEXT) | Mô tả chi tiết thay đổi |
| `ngayGhiNhan` | LocalDateTime | Thời điểm ghi nhận (tự động) |
| `nguoiThucHien` | String | Username của người thực hiện |

### Các loại sự kiện (tenSuKien)

1. **Thay đổi thông tin** - Cập nhật thông tin cơ bản của hộ khẩu
2. **Thêm thành viên** - Thêm người mới vào hộ
3. **Xóa thành viên** - Xóa người khỏi hộ
4. **Đổi chủ hộ** - Thay đổi chủ hộ
5. **Tách hộ** - Tách thành hộ mới

## API Endpoints

### 1. Lấy tất cả lịch sử
```
GET /api/ghinhanthaydoi
```

### 2. Lấy theo ID
```
GET /api/ghinhanthaydoi/{id}
```

### 3. Lấy lịch sử của một hộ khẩu
```
GET /api/ghinhanthaydoi/hokhau/{hoKhauId}
```

### 4. Lấy theo loại sự kiện
```
GET /api/ghinhanthaydoi/sukien/{tenSuKien}
```
Ví dụ: `/api/ghinhanthaydoi/sukien/Đổi chủ hộ`

### 5. Lấy theo người thực hiện
```
GET /api/ghinhanthaydoi/nguoithuchien/{username}
```

### 6. Tìm kiếm
```
GET /api/ghinhanthaydoi/search?keyword={keyword}
```

### 7. Lấy theo khoảng thời gian
```
GET /api/ghinhanthaydoi/daterange?start={ISO_DATETIME}&end={ISO_DATETIME}
```

### 8. Xóa bản ghi
```
DELETE /api/ghinhanthaydoi/{id}
```

## Tích hợp tự động

Hệ thống **tự động ghi nhận** thay đổi khi:

### 1. Cập nhật hộ khẩu (HoKhauService.updateHoKhau)
- Nếu đổi chủ hộ → Ghi nhận "Đổi chủ hộ"
- Nếu chỉ cập nhật thông tin → Ghi nhận "Thay đổi thông tin"

**Ví dụ mô tả:**
```
Đổi chủ hộ của hộ khẩu HN001: từ 'Nguyễn Văn A' sang 'Nguyễn Thị B'
```

### 2. Tách hộ (HoKhauService.tachHoKhau)
- Ghi nhận sự kiện "Tách hộ"

**Ví dụ mô tả:**
```
Tách 3 thành viên từ hộ khẩu HN001 sang hộ khẩu mới HN002
```

### 3. Thêm thành viên (ThanhVienHoService.addThanhVien)
- Ghi nhận sự kiện "Thêm thành viên"

**Ví dụ mô tả:**
```
Thêm thành viên 'Nguyễn Văn C' vào hộ khẩu HN001
```

### 4. Xóa thành viên (ThanhVienHoService.removeThanhVien)
- Ghi nhận sự kiện "Xóa thành viên"

**Ví dụ mô tả:**
```
Xóa thành viên 'Nguyễn Văn D' khỏi hộ khẩu HN001
```

## Service Methods

### GhiNhanThayDoiHoKhauService

```java
// Ghi nhận chung
ghiNhanThayDoi(HoKhau hoKhau, String tenSuKien, String moTa)

// Ghi nhận cụ thể
ghiNhanThayDoiThongTin(HoKhau hoKhau, String chiTiet)
ghiNhanThemThanhVien(HoKhau hoKhau, String tenThanhVien)
ghiNhanXoaThanhVien(HoKhau hoKhau, String tenThanhVien)
ghiNhanDoiChuHo(HoKhau hoKhau, String tenChuHoCu, String tenChuHoMoi)
ghiNhanTachHo(HoKhau hoKhauCu, HoKhau hoKhauMoi, int soThanhVienTach)
```

## Ví dụ Response

```json
{
  "id": 1,
  "hoKhau": {
    "id": 123,
    "maSoHo": "HN001"
  },
  "tenSuKien": "Đổi chủ hộ",
  "moTa": "Đổi chủ hộ của hộ khẩu HN001: từ 'Nguyễn Văn A' sang 'Nguyễn Thị B'",
  "ngayGhiNhan": "2025-11-24T14:30:00",
  "nguoiThucHien": "canbonk"
}
```

## Lưu ý

1. **Tự động ghi nhận**: Không cần gọi API thủ công, hệ thống tự động ghi khi có thay đổi
2. **Không thể chỉnh sửa**: Chỉ có thể tạo mới hoặc xóa, không cho phép cập nhật
3. **Audit trail**: Dùng để theo dõi ai đã làm gì, khi nào
4. **Security**: Tự động lấy username từ SecurityContext

## Khởi chạy

Khi khởi động backend, Hibernate sẽ tự động tạo bảng `ghinhanthaydoihokhau` với cấu trúc:

```sql
CREATE TABLE ghinhanthaydoihokhau (
    ID BIGINT AUTO_INCREMENT PRIMARY KEY,
    IDHoKhau INT NOT NULL,
    TenSuKien VARCHAR(255) NOT NULL,
    MoTa TEXT,
    NgayGhiNhan DATETIME NOT NULL,
    NguoiThucHien VARCHAR(255),
    FOREIGN KEY (IDHoKhau) REFERENCES hokhau(ID)
);
```
