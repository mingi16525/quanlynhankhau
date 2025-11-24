# Script tự động thêm @PreAuthorize cho tất cả Controllers

## Các controller đã hoàn thành:
✅ **NhanKhauController** - Đã thêm đầy đủ @PreAuthorize

## Các controller cần cập nhật:

### 1. HoKhauController
```java
// Thêm import
import org.springframework.security.access.prepost.PreAuthorize;

// Thêm annotation cho từng method:
@PreAuthorize("hasAuthority('HO_KHAU:READ') or hasAuthority('*:*')")
@GetMapping

@PreAuthorize("hasAuthority('HO_KHAU:READ') or hasAuthority('*:*')")
@GetMapping("/{id}")

@PreAuthorize("hasAuthority('HO_KHAU:READ') or hasAuthority('*:*')")
@GetMapping("/{id}/thanhvien")

@PreAuthorize("hasAuthority('HO_KHAU:CREATE') or hasAuthority('*:*')")
@PostMapping

@PreAuthorize("hasAuthority('HO_KHAU:UPDATE') or hasAuthority('*:*')")
@PutMapping("/{id}")

@PreAuthorize("hasAuthority('HO_KHAU:DELETE') or hasAuthority('*:*')")
@DeleteMapping("/{id}")

@PreAuthorize("hasAuthority('HO_KHAU:CREATE') or hasAuthority('*:*')")
@PostMapping("/{id}/tach")
```

### 2. TamTruTamVangController
```java
// READ cho tất cả GET
@PreAuthorize("hasAuthority('TAM_TRU_VANG:READ') or hasAuthority('*:*')")

// CREATE
@PreAuthorize("hasAuthority('TAM_TRU_VANG:CREATE') or hasAuthority('*:*')")
@PostMapping

// UPDATE
@PreAuthorize("hasAuthority('TAM_TRU_VANG:UPDATE') or hasAuthority('*:*')")
@PutMapping("/{id}")

// DELETE
@PreAuthorize("hasAuthority('TAM_TRU_VANG:DELETE') or hasAuthority('*:*')")
@DeleteMapping("/{id}")
```

### 3. SuKienNhanKhauController
```java
// READ cho tất cả GET
@PreAuthorize("hasAuthority('SU_KIEN:READ') or hasAuthority('*:*')")

// CREATE
@PreAuthorize("hasAuthority('SU_KIEN:CREATE') or hasAuthority('*:*')")
@PostMapping

// UPDATE
@PreAuthorize("hasAuthority('SU_KIEN:UPDATE') or hasAuthority('*:*')")
@PutMapping("/{id}")

// DELETE
@PreAuthorize("hasAuthority('SU_KIEN:DELETE') or hasAuthority('*:*')")
@DeleteMapping("/{id}")
```

### 4. KhoanChiPhiBatBuocController
```java
// READ
@PreAuthorize("hasAuthority('KHOAN_CHI_BAT_BUOC:READ') or hasAuthority('*:*')")

// CREATE
@PreAuthorize("hasAuthority('KHOAN_CHI_BAT_BUOC:CREATE') or hasAuthority('*:*')")
@PostMapping

// UPDATE
@PreAuthorize("hasAuthority('KHOAN_CHI_BAT_BUOC:UPDATE') or hasAuthority('*:*')")
@PutMapping("/{id}")
@PutMapping("/{id}/trangthai")

// DELETE
@PreAuthorize("hasAuthority('KHOAN_CHI_BAT_BUOC:DELETE') or hasAuthority('*:*')")
@DeleteMapping("/{id}")
```

### 5. DanhSachThuPhiController
```java
// READ
@PreAuthorize("hasAuthority('DANH_SACH_THU:READ') or hasAuthority('*:*')")

// CREATE
@PreAuthorize("hasAuthority('DANH_SACH_THU:CREATE') or hasAuthority('*:*')")
@PostMapping
@PostMapping("/taomoi/khoanphi/{khoanPhiId}")

// UPDATE
@PreAuthorize("hasAuthority('DANH_SACH_THU:UPDATE') or hasAuthority('*:*')")
@PutMapping("/{id}")
@PutMapping("/{id}/trangthai")

// DELETE  
@PreAuthorize("hasAuthority('DANH_SACH_THU:DELETE') or hasAuthority('*:*')")
@DeleteMapping("/{id}")
```

### 6. DanhSachChiController
```java
// READ
@PreAuthorize("hasAuthority('DANH_SACH_CHI:READ') or hasAuthority('*:*')")

// CREATE
@PreAuthorize("hasAuthority('DANH_SACH_CHI:CREATE') or hasAuthority('*:*')")
@PostMapping

// UPDATE
@PreAuthorize("hasAuthority('DANH_SACH_CHI:UPDATE') or hasAuthority('*:*')")
@PutMapping("/{id}")

// DELETE
@PreAuthorize("hasAuthority('DANH_SACH_CHI:DELETE') or hasAuthority('*:*')")
@DeleteMapping("/{id}")
```

### 7. HoatDongThienNguyenController
```java
// READ
@PreAuthorize("hasAuthority('HOAT_DONG_THIEN_NGUYEN:READ') or hasAuthority('*:*')")

// CREATE
@PreAuthorize("hasAuthority('HOAT_DONG_THIEN_NGUYEN:CREATE') or hasAuthority('*:*')")
@PostMapping

// UPDATE
@PreAuthorize("hasAuthority('HOAT_DONG_THIEN_NGUYEN:UPDATE') or hasAuthority('*:*')")
@PutMapping("/{id}")

// DELETE
@PreAuthorize("hasAuthority('HOAT_DONG_THIEN_NGUYEN:DELETE') or hasAuthority('*:*')")
@DeleteMapping("/{id}")
```

### 8. ThuThienNguyenController
```java
// READ
@PreAuthorize("hasAuthority('THU_THIEN_NGUYEN:READ') or hasAuthority('*:*')")

// CREATE
@PreAuthorize("hasAuthority('THU_THIEN_NGUYEN:CREATE') or hasAuthority('*:*')")
@PostMapping

// UPDATE
@PreAuthorize("hasAuthority('THU_THIEN_NGUYEN:UPDATE') or hasAuthority('*:*')")
@PutMapping("/{id}")

// DELETE
@PreAuthorize("hasAuthority('THU_THIEN_NGUYEN:DELETE') or hasAuthority('*:*')")
@DeleteMapping("/{id}")
```

### 9. TaiKhoanController (ADMIN ONLY)
```java
// Uncomment và enable tất cả
@PreAuthorize("hasAuthority('*:*')")
// Tất cả methods
```

### 10. VaiTroController (ADMIN ONLY)
```java
@PreAuthorize("hasAuthority('*:*')")
// Tất cả methods
```

### 11. PhanQuyenController (ADMIN ONLY)
```java
@PreAuthorize("hasAuthority('*:*')")
// Tất cả methods
```

### 12. ThanhVienHoController
```java
// READ
@PreAuthorize("hasAuthority('HO_KHAU:READ') or hasAuthority('*:*')")
@GetMapping

// CREATE/DELETE (dùng HO_KHAU:UPDATE vì quản lý thành viên là cập nhật hộ khẩu)
@PreAuthorize("hasAuthority('HO_KHAU:UPDATE') or hasAuthority('*:*')")
@PostMapping
@DeleteMapping("/{id}")
```

### 13. GhiNhanThayDoiHoKhauController
```java
// READ only (lịch sử không được sửa/xóa)
@PreAuthorize("hasAuthority('HO_KHAU:READ') or hasAuthority('*:*')")
// Tất cả methods
```

### 14. ThongKeController
```java
// Authenticated users only (không cần permission cụ thể)
// Không cần @PreAuthorize (đã protected bởi .authenticated() ở SecurityConfig)
```

## Cách thực hiện:

1. Mở từng Controller file
2. Thêm import nếu chưa có:
   ```java
   import org.springframework.security.access.prepost.PreAuthorize;
   ```
3. Thêm `@PreAuthorize` annotation TRƯỚC mỗi `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping`
4. Sử dụng template tương ứng với CRUD operation
5. Test bằng cách login với các role khác nhau

## Kiểm tra sau khi hoàn thành:

```bash
# Test với CAN_BO_NHAN_KHAU
curl -H "Authorization: Bearer <token>" http://localhost:8080/api/nhankhau
# Phải thành công

curl -H "Authorization: Bearer <token>" http://localhost:8080/api/khoanphi
# Phải FAIL với 403 Forbidden

# Test với KE_TOAN_THU_CHI
curl -H "Authorization: Bearer <token>" http://localhost:8080/api/khoanphi
# Phải thành công

curl -H "Authorization: Bearer <token>" http://localhost:8080/api/nhankhau
# Phải FAIL với 403 Forbidden

# Test với ADMIN
curl -H "Authorization: Bearer <token>" http://localhost:8080/api/nhankhau
curl -H "Authorization: Bearer <token>" http://localhost:8080/api/khoanphi
# Cả hai đều phải thành công
```
