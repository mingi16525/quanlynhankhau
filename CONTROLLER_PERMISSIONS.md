# Controller Permissions Mapping

## Mapping quyền cho từng Controller

### 1. NhanKhauController - `/api/nhankhau`
| Method | Endpoint | Permission |
|--------|----------|------------|
| GET | `/api/nhankhau` | `NHAN_KHAU:READ` hoặc `*:*` |
| GET | `/api/nhankhau/{id}` | `NHAN_KHAU:READ` hoặc `*:*` |
| GET | `/api/nhankhau/search` | `NHAN_KHAU:READ` hoặc `*:*` |
| GET | `/api/nhankhau/available` | `NHAN_KHAU:READ` hoặc `*:*` |
| POST | `/api/nhankhau` | `NHAN_KHAU:CREATE` hoặc `*:*` |
| PUT | `/api/nhankhau/{id}` | `NHAN_KHAU:UPDATE` hoặc `*:*` |
| DELETE | `/api/nhankhau/{id}` | `NHAN_KHAU:DELETE` hoặc `*:*` |

### 2. HoKhauController - `/api/hokhau`
| Method | Endpoint | Permission |
|--------|----------|------------|
| GET | `/api/hokhau` | `HO_KHAU:READ` hoặc `*:*` |
| GET | `/api/hokhau/{id}` | `HO_KHAU:READ` hoặc `*:*` |
| GET | `/api/hokhau/{id}/thanhvien` | `HO_KHAU:READ` hoặc `*:*` |
| POST | `/api/hokhau` | `HO_KHAU:CREATE` hoặc `*:*` |
| PUT | `/api/hokhau/{id}` | `HO_KHAU:UPDATE` hoặc `*:*` |
| DELETE | `/api/hokhau/{id}` | `HO_KHAU:DELETE` hoặc `*:*` |
| POST | `/api/hokhau/{id}/tach` | `HO_KHAU:CREATE` hoặc `*:*` |

### 3. TamTruTamVangController - `/api/tamtrutamvang`
| Method | Endpoint | Permission |
|--------|----------|------------|
| GET | All GET endpoints | `TAM_TRU_VANG:READ` hoặc `*:*` |
| POST | `/api/tamtrutamvang` | `TAM_TRU_VANG:CREATE` hoặc `*:*` |
| PUT | `/api/tamtrutamvang/{id}` | `TAM_TRU_VANG:UPDATE` hoặc `*:*` |
| DELETE | `/api/tamtrutamvang/{id}` | `TAM_TRU_VANG:DELETE` hoặc `*:*` |

### 4. SuKienNhanKhauController - `/api/sukien`
| Method | Endpoint | Permission |
|--------|----------|------------|
| GET | All GET endpoints | `SU_KIEN:READ` hoặc `*:*` |
| POST | `/api/sukien` | `SU_KIEN:CREATE` hoặc `*:*` |
| PUT | `/api/sukien/{id}` | `SU_KIEN:UPDATE` hoặc `*:*` |
| DELETE | `/api/sukien/{id}` | `SU_KIEN:DELETE` hoặc `*:*` |

### 5. KhoanChiPhiBatBuocController - `/api/khoanphi`
| Method | Endpoint | Permission |
|--------|----------|------------|
| GET | All GET endpoints | `KHOAN_CHI_BAT_BUOC:READ` hoặc `*:*` |
| POST | `/api/khoanphi` | `KHOAN_CHI_BAT_BUOC:CREATE` hoặc `*:*` |
| PUT | `/api/khoanphi/{id}` | `KHOAN_CHI_BAT_BUOC:UPDATE` hoặc `*:*` |
| PUT | `/api/khoanphi/{id}/trangthai` | `KHOAN_CHI_BAT_BUOC:UPDATE` hoặc `*:*` |
| DELETE | `/api/khoanphi/{id}` | `KHOAN_CHI_BAT_BUOC:DELETE` hoặc `*:*` |

### 6. DanhSachThuPhiController - `/api/thuphi`
| Method | Endpoint | Permission |
|--------|----------|------------|
| GET | All GET endpoints | `DANH_SACH_THU:READ` hoặc `*:*` |
| POST | `/api/thuphi` | `DANH_SACH_THU:CREATE` hoặc `*:*` |
| POST | `/api/thuphi/taomoi/khoanphi/{id}` | `DANH_SACH_THU:CREATE` hoặc `*:*` |
| PUT | `/api/thuphi/{id}` | `DANH_SACH_THU:UPDATE` hoặc `*:*` |
| PUT | `/api/thuphi/{id}/trangthai` | `DANH_SACH_THU:UPDATE` hoặc `*:*` |
| DELETE | `/api/thuphi/{id}` | `DANH_SACH_THU:DELETE` hoặc `*:*` |

### 7. DanhSachChiController - `/api/chi`
| Method | Endpoint | Permission |
|--------|----------|------------|
| GET | All GET endpoints | `DANH_SACH_CHI:READ` hoặc `*:*` |
| POST | `/api/chi` | `DANH_SACH_CHI:CREATE` hoặc `*:*` |
| PUT | `/api/chi/{id}` | `DANH_SACH_CHI:UPDATE` hoặc `*:*` |
| DELETE | `/api/chi/{id}` | `DANH_SACH_CHI:DELETE` hoặc `*:*` |

### 8. HoatDongThienNguyenController - `/api/hoatdong`
| Method | Endpoint | Permission |
|--------|----------|------------|
| GET | All GET endpoints | `HOAT_DONG_THIEN_NGUYEN:READ` hoặc `*:*` |
| POST | `/api/hoatdong` | `HOAT_DONG_THIEN_NGUYEN:CREATE` hoặc `*:*` |
| PUT | `/api/hoatdong/{id}` | `HOAT_DONG_THIEN_NGUYEN:UPDATE` hoặc `*:*` |
| DELETE | `/api/hoatdong/{id}` | `HOAT_DONG_THIEN_NGUYEN:DELETE` hoặc `*:*` |

### 9. ThuThienNguyenController - `/api/thuthiennguyen`
| Method | Endpoint | Permission |
|--------|----------|------------|
| GET | All GET endpoints | `THU_THIEN_NGUYEN:READ` hoặc `*:*` |
| POST | `/api/thuthiennguyen` | `THU_THIEN_NGUYEN:CREATE` hoặc `*:*` |
| PUT | `/api/thuthiennguyen/{id}` | `THU_THIEN_NGUYEN:UPDATE` hoặc `*:*` |
| DELETE | `/api/thuthiennguyen/{id}` | `THU_THIEN_NGUYEN:DELETE` hoặc `*:*` |

### 10. TaiKhoanController - `/api/taikhoan`
| Method | Endpoint | Permission |
|--------|----------|------------|
| All | All endpoints | Chỉ ADMIN (`*:*`) |

### 11. VaiTroController - `/api/vaitro`
| Method | Endpoint | Permission |
|--------|----------|------------|
| All | All endpoints | Chỉ ADMIN (`*:*`) |

### 12. PhanQuyenController - `/api/phanquyen`
| Method | Endpoint | Permission |
|--------|----------|------------|
| All | All endpoints | Chỉ ADMIN (`*:*`) |

### 13. ThongKeController - `/api/thongke`
| Method | Endpoint | Permission |
|--------|----------|------------|
| All | All endpoints | Authenticated (mọi user đã đăng nhập) |

### 14. GhiNhanThayDoiHoKhauController - `/api/ghinhanthaydoi`
| Method | Endpoint | Permission |
|--------|----------|------------|
| All | All endpoints | `HO_KHAU:READ` hoặc `*:*` |

### 15. ThanhVienHoController - `/api/thanhvienho`
| Method | Endpoint | Permission |
|--------|----------|----------||
| GET | All GET endpoints | `HO_KHAU:READ` hoặc `*:*` |
| POST | `/api/thanhvienho` | `HO_KHAU:UPDATE` hoặc `*:*` |
| DELETE | `/api/thanhvienho/{id}` | `HO_KHAU:UPDATE` hoặc `*:*` |

## Template @PreAuthorize

```java
// READ
@PreAuthorize("hasAuthority('RESOURCE:READ') or hasAuthority('*:*')")

// CREATE
@PreAuthorize("hasAuthority('RESOURCE:CREATE') or hasAuthority('*:*')")

// UPDATE
@PreAuthorize("hasAuthority('RESOURCE:UPDATE') or hasAuthority('*:*')")

// DELETE
@PreAuthorize("hasAuthority('RESOURCE:DELETE') or hasAuthority('*:*')")

// ADMIN ONLY
@PreAuthorize("hasAuthority('*:*')")
```
