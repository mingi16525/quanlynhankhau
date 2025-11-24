# ✅ LOGIC THAY ĐỔI CHỦ HỘ - ĐÃ KIỂM TRA VÀ SỬA

## 🔍 Vấn đề đã phát hiện

### ❌ Trước khi sửa:
- **Backend thiếu endpoint PUT**: `HoKhauController` không có `@PutMapping("/{id}")`
- **Không có logic kiểm tra**: Chủ hộ mới có phải thành viên của hộ khẩu không?
- **Không cập nhật quan hệ**: Bảng `ThanhVienHo` không được cập nhật khi đổi chủ hộ

### ✅ Sau khi sửa:
- Thêm endpoint `PUT /api/hokhau/{id}` để cập nhật hộ khẩu
- Thêm phương thức `updateHoKhau()` với đầy đủ logic kiểm tra
- Tự động cập nhật quan hệ trong bảng `ThanhVienHo`

---

## 📋 CHI TIẾT LOGIC ĐÃ THỰC HIỆN

### Backend - HoKhauController.java

#### Endpoint mới:
```java
@PutMapping("/{id}")
public ResponseEntity<HoKhau> update(@PathVariable Integer id, @RequestBody HoKhau hoKhau)
```

**Xử lý**:
- Nhận ID từ URL path
- Nhận thông tin hộ khẩu mới từ request body
- Gọi service `updateHoKhau()`
- Trả về 200 OK nếu thành công
- Trả về 400 BAD_REQUEST nếu chủ hộ không hợp lệ
- Trả về 409 CONFLICT nếu mã số hộ trùng

---

### Backend - HoKhauService.java

#### Phương thức mới: `updateHoKhau(Integer hoKhauId, HoKhau hoKhau)`

**BƯỚC 1: Kiểm tra hộ khẩu tồn tại**
```java
Optional<HoKhau> existingHoKhauOpt = hoKhauRepository.findById(hoKhauId);
if (existingHoKhauOpt.isEmpty()) {
    throw new IllegalArgumentException("Không tìm thấy hộ khẩu với ID: " + hoKhauId);
}
```

**BƯỚC 2: Lấy thông tin chủ hộ cũ và mới**
```java
Integer oldChuHoId = existingHoKhau.getChuHo() != null 
    ? existingHoKhau.getChuHo().getId() 
    : null;
Integer newChuHoId = hoKhau.getChuHo() != null 
    ? hoKhau.getChuHo().getId() 
    : null;
```

**BƯỚC 3: Kiểm tra chủ hộ mới phải là thành viên**
```java
if (newChuHoId != null) {
    Optional<ThanhVienHo> thanhVienOpt = thanhVienHoRepository
        .findByHoKhau_Id(hoKhauId)
        .stream()
        .filter(tv -> tv.getNhanKhau() != null 
            && tv.getNhanKhau().getId().equals(newChuHoId))
        .findFirst();
    
    if (thanhVienOpt.isEmpty()) {
        throw new IllegalArgumentException(
            "Chủ hộ mới phải là thành viên hiện tại của hộ khẩu này!"
        );
    }
}
```

**BƯỚC 4: Kiểm tra mã số hộ trùng lặp**
```java
if (hoKhau.getMaSoHo() != null && !hoKhau.getMaSoHo().isEmpty()) {
    Optional<HoKhau> duplicateHoKhau = hoKhauRepository.findByMaSoHo(hoKhau.getMaSoHo());
    if (duplicateHoKhau.isPresent() && !duplicateHoKhau.get().getId().equals(hoKhauId)) {
        throw new IllegalStateException("Mã số hộ '" + hoKhau.getMaSoHo() + "' đã tồn tại.");
    }
}
```

**BƯỚC 5: Cập nhật thông tin hộ khẩu**
```java
existingHoKhau.setMaSoHo(hoKhau.getMaSoHo());
existingHoKhau.setChuHo(hoKhau.getChuHo());
existingHoKhau.setDiaChi(hoKhau.getDiaChi());
existingHoKhau.setNgayLap(hoKhau.getNgayLap());
```

**BƯỚC 6: Cập nhật quan hệ trong bảng ThanhVienHo**
```java
if (oldChuHoId != null && newChuHoId != null && !oldChuHoId.equals(newChuHoId)) {
    // Cập nhật chủ hộ cũ thành "Thành viên"
    thanhVienHoRepository.findByHoKhau_Id(hoKhauId)
        .stream()
        .filter(tv -> tv.getNhanKhau() != null 
            && tv.getNhanKhau().getId().equals(oldChuHoId))
        .findFirst()
        .ifPresent(tv -> {
            tv.setQuanHeVoiChuHo("Thành viên");
            thanhVienHoRepository.save(tv);
        });

    // Cập nhật chủ hộ mới thành "Chủ hộ"
    thanhVienHoRepository.findByHoKhau_Id(hoKhauId)
        .stream()
        .filter(tv -> tv.getNhanKhau() != null 
            && tv.getNhanKhau().getId().equals(newChuHoId))
        .findFirst()
        .ifPresent(tv -> {
            tv.setQuanHeVoiChuHo("Chủ hộ");
            thanhVienHoRepository.save(tv);
        });
}
```

**BƯỚC 7: Lưu và trả về**
```java
return hoKhauRepository.save(existingHoKhau);
```

---

### Frontend - ThanhVienHoListPage.jsx

#### Hàm: `handleUpdateChuHo(values)`

**BƯỚC 1: Lấy ID chủ hộ mới**
```javascript
const newChuHoId = values.newChuHoId;
```

**BƯỚC 2: Kiểm tra dữ liệu hợp lệ**
```javascript
if (!hoKhauInfo || !hoKhauInfo.chuHo) {
    message.error('Không tìm thấy thông tin Chủ hộ hiện tại');
    return;
}

if (newChuHoId === hoKhauInfo.chuHo.id) {
    message.warning('Chủ hộ mới trùng với Chủ hộ hiện tại!');
    return;
}
```

**BƯỚC 3: Tạo payload**
```javascript
const payload = {
    ...hoKhauInfo,
    chuHo: { id: newChuHoId }
};
```

**BƯỚC 4: Gọi API PUT**
```javascript
await apiClient.put(`/hokhau/${hoKhauId}`, payload);
```

**BƯỚC 5: Xử lý kết quả**
```javascript
message.success('✅ Thay đổi Chủ hộ thành công!');
setIsModalVisible(false);
form.resetFields();
fetchData(); // Reload toàn bộ data
```

#### Modal chọn chủ hộ mới:
```javascript
<Select>
    {thanhVienList
        .filter(tv => tv.nhanKhau?.id !== hoKhauInfo?.chuHo?.id) // Loại chủ hộ hiện tại
        .map(tv => (
            <Option key={tv.nhanKhau.id} value={tv.nhanKhau.id}>
                {tv.nhanKhau.hoTen} (ID: {tv.nhanKhau.id}, CCCD: {tv.nhanKhau.soCCCD})
            </Option>
        ))
    }
</Select>
```

---

## 🎯 FLOW THAY ĐỔI CHỦ HỘ

### Kịch bản: Thay đổi chủ hộ từ Nguyễn Văn A → Trần Thị B

```
[FRONTEND]
1. User nhấn button "Thay đổi Chủ hộ"
2. Modal hiển thị danh sách thành viên (trừ chủ hộ hiện tại)
3. User chọn "Trần Thị B" (ID: 2)
4. User nhấn "Xác nhận Thay đổi"

↓ API Call: PUT /api/hokhau/1

[BACKEND]
5. Controller nhận request với payload:
   {
     "id": 1,
     "maSoHo": "HK001",
     "chuHo": { "id": 2 },
     "diaChi": "Số 1 Đại Cồ Việt",
     "ngayLap": "2024-01-01"
   }

6. Service kiểm tra:
   ✅ Hộ khẩu ID=1 tồn tại?
   ✅ Nhân khẩu ID=2 là thành viên của hộ khẩu ID=1?
   ✅ Mã số hộ "HK001" không trùng với hộ khẩu khác?

7. Cập nhật database:
   Table: hokhau
   UPDATE hokhau SET IDChuHo = 2 WHERE id = 1;

   Table: thanhvienho
   UPDATE thanhvienho 
   SET QuanHeVoiChuHo = 'Thành viên' 
   WHERE IDHoKhau = 1 AND IDNhanKhau = 1;  -- Chủ hộ cũ

   UPDATE thanhvienho 
   SET QuanHeVoiChuHo = 'Chủ hộ' 
   WHERE IDHoKhau = 1 AND IDNhanKhau = 2;  -- Chủ hộ mới

8. Trả về response 200 OK với dữ liệu đã cập nhật

[FRONTEND]
9. Nhận response thành công
10. Hiển thị message success
11. Đóng modal
12. Reload dữ liệu (fetchData())
13. UI cập nhật:
    - Card của Trần Thị B có tag "Chủ hộ" màu đỏ
    - Card của Nguyễn Văn A không còn tag "Chủ hộ"
    - Quan hệ trong bảng tóm tắt cập nhật
```

---

## ✅ KIỂM TRA NGHIỆP VỤ

### Test Case 1: Thay đổi chủ hộ hợp lệ
**Input**:
- Hộ khẩu ID: 1
- Chủ hộ hiện tại: Nguyễn Văn A (ID: 1)
- Chủ hộ mới: Trần Thị B (ID: 2) - là thành viên của hộ

**Expected**:
- ✅ API trả về 200 OK
- ✅ Chủ hộ trong bảng `hokhau` = 2
- ✅ Quan hệ trong bảng `thanhvienho` cập nhật đúng
- ✅ Frontend hiển thị thông báo thành công
- ✅ UI cập nhật tag "Chủ hộ" cho đúng người

### Test Case 2: Chọn người không phải thành viên
**Input**:
- Hộ khẩu ID: 1
- Chủ hộ mới: Lê Văn C (ID: 10) - KHÔNG là thành viên của hộ

**Expected**:
- ❌ API trả về 400 BAD_REQUEST
- ❌ Message: "Chủ hộ mới phải là thành viên hiện tại của hộ khẩu này!"
- ❌ Frontend hiển thị error message
- ❌ Database không thay đổi

**Thực tế**: ✅ KHÔNG THỂ XẢY RA vì frontend chỉ cho chọn từ danh sách thành viên hiện có

### Test Case 3: Chọn chủ hộ hiện tại
**Input**:
- Chủ hộ hiện tại: Nguyễn Văn A (ID: 1)
- Chủ hộ mới: Nguyễn Văn A (ID: 1)

**Expected**:
- ⚠️ Frontend block ngay: "Chủ hộ mới trùng với Chủ hộ hiện tại!"
- ❌ Không gọi API
- ❌ Database không thay đổi

**Thực tế**: ✅ Frontend đã xử lý trong `handleUpdateChuHo()`

### Test Case 4: Hộ khẩu không tồn tại
**Input**:
- Hộ khẩu ID: 999 (không tồn tại)

**Expected**:
- ❌ API trả về 400 BAD_REQUEST
- ❌ Message: "Không tìm thấy hộ khẩu với ID: 999"

---

## 🔧 FILES ĐÃ SỬA ĐỔI

### Backend
1. **HoKhauController.java**
   - ➕ Thêm `@PutMapping("/{id}")`
   - ➕ Thêm method `update()`

2. **HoKhauService.java**
   - ➕ Import `ThanhVienHo`
   - ➕ Thêm method `updateHoKhau()`
   - Logic: Kiểm tra + Cập nhật quan hệ

### Frontend
- **ThanhVienHoListPage.jsx**
  - ✅ Logic đã đúng (không cần sửa)
  - Đã có đầy đủ:
    - Modal chọn chủ hộ mới
    - Validation frontend
    - API call PUT
    - Error handling
    - UI update

---

## 🧪 CÁCH KIỂM TRA

### 1. Khởi động Backend
```bash
cd demo
mvnw spring-boot:run
```

### 2. Khởi động Frontend
```bash
cd quanlynhankhau-frontend
npm run dev
```

### 3. Test thủ công trên UI
1. Đăng nhập vào hệ thống
2. Vào menu **Hộ khẩu**
3. Nhấn **Xem chi tiết** một hộ bất kỳ
4. Nhấn button **"Thay đổi Chủ hộ"** (màu xanh, ở góc trên phải)
5. Chọn thành viên mới từ dropdown
6. Nhấn **"Xác nhận Thay đổi"**
7. **Kiểm tra kết quả**:
   - ✅ Thông báo success
   - ✅ Modal đóng
   - ✅ Card hiển thị tag "Chủ hộ" cho đúng người
   - ✅ Bảng tóm tắt cập nhật quan hệ

### 4. Test bằng API (Postman/cURL)

#### Request:
```http
PUT http://localhost:8080/api/hokhau/1
Content-Type: application/json

{
  "id": 1,
  "maSoHo": "HK001",
  "chuHo": {
    "id": 2
  },
  "diaChi": "Số 1 Đại Cồ Việt",
  "ngayLap": "2024-01-01"
}
```

#### Response mong đợi (200 OK):
```json
{
  "id": 1,
  "maSoHo": "HK001",
  "chuHo": {
    "id": 2,
    "hoTen": "Trần Thị B",
    "soCCCD": "002345678901",
    ...
  },
  "diaChi": "Số 1 Đại Cồ Việt",
  "ngayLap": "2024-01-01"
}
```

### 5. Kiểm tra Database

```sql
-- Kiểm tra bảng hokhau
SELECT id, MaSoHo, IDChuHo, DiaChi 
FROM hokhau 
WHERE id = 1;

-- Kiểm tra bảng thanhvienho
SELECT tv.ID, nk.HoTen, tv.QuanHeVoiChuHo
FROM thanhvienho tv
JOIN nhankhau nk ON tv.IDNhanKhau = nk.id
WHERE tv.IDHoKhau = 1;
```

**Kết quả mong đợi**:
```
hokhau:
id | MaSoHo | IDChuHo | DiaChi
1  | HK001  | 2       | Số 1 Đại Cồ Việt

thanhvienho:
ID | HoTen      | QuanHeVoiChuHo
1  | Nguyễn Văn A | Thành viên       ← Chủ hộ cũ
2  | Trần Thị B   | Chủ hộ           ← Chủ hộ mới
3  | Nguyễn Văn C | Con
```

---

## 🎯 TÓM TẮT

### ✅ Đã hoàn thành:
1. ✅ Thêm endpoint PUT /api/hokhau/{id}
2. ✅ Thêm logic kiểm tra chủ hộ mới phải là thành viên
3. ✅ Tự động cập nhật quan hệ trong bảng ThanhVienHo
4. ✅ Frontend đã có đầy đủ UI và validation
5. ✅ Error handling đầy đủ

### 🔒 Bảo đảm nghiệp vụ:
- ✅ Chỉ thành viên hiện tại mới được làm chủ hộ
- ✅ Không cho chọn chủ hộ hiện tại (trùng lặp)
- ✅ Quan hệ trong bảng ThanhVienHo luôn đồng bộ
- ✅ Mã số hộ không bị trùng lặp
- ✅ Hộ khẩu phải tồn tại

### 📊 Database transaction:
- ✅ Sử dụng `@Transactional` đảm bảo atomic
- ✅ Nếu lỗi ở bất kỳ bước nào → Rollback toàn bộ
- ✅ Không để database bị lệch dữ liệu

---

## 💡 LƯU Ý

1. **Chủ hộ cũ không bị xóa**: Vẫn là thành viên, chỉ thay đổi quan hệ thành "Thành viên"
2. **Không cho xóa chủ hộ**: Logic này đã có trong `handleDeleteThanhVien()` ở frontend
3. **Chủ hộ mới phải có trong hộ**: Backend đã validate, frontend cũng chỉ cho chọn từ danh sách hiện có
4. **Transaction safety**: Sử dụng `@Transactional` để đảm bảo tính toàn vẹn dữ liệu

---

**Kết luận**: Logic thay đổi chủ hộ đã **HOÀN CHỈNH** và **AN TOÀN**! 🎉
