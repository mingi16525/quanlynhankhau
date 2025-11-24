# ✅ TÍNH NĂNG TÁCH HỘ KHẨU

## 📋 Mô tả chức năng

Tách hộ khẩu là tính năng cho phép **tách một số thành viên từ hộ khẩu hiện tại** để tạo thành **hộ khẩu mới độc lập**.

### Kịch bản sử dụng:
- Con trai/gái lập gia đình riêng, tách khỏi hộ cha mẹ
- Anh chị em chia tách hộ khẩu
- Tạo hộ khẩu mới cho các thành viên chuyển đi nơi khác

---

## 🎯 FLOW NGHIỆP VỤ

```
Hộ khẩu cũ (HK001)
├── Nguyễn Văn A (Chủ hộ)
├── Trần Thị B (Vợ)
├── Nguyễn Văn C (Con)
└── Nguyễn Thị D (Con)

        ↓ TÁCH HỘ

Chọn tách: Nguyễn Văn C, Nguyễn Thị D
Chủ hộ mới: Nguyễn Văn C
Mã số hộ mới: HK002
Địa chỉ mới: Số 10 Lê Lợi, Q1

        ↓ KẾT QUẢ

Hộ khẩu cũ (HK001)              Hộ khẩu mới (HK002)
├── Nguyễn Văn A (Chủ hộ)       ├── Nguyễn Văn C (Chủ hộ)
└── Trần Thị B (Vợ)             └── Nguyễn Thị D (Em)
```

---

## 🔧 CẤU TRÚC API

### Endpoint
```
POST /api/hokhau/{id}/tach
```

### Request Body
```json
{
  "maSoHo": "HK002",
  "diaChi": "Số 10 Lê Lợi, Quận 1, TP.HCM",
  "ngayLap": "2025-11-24",
  "chuHoMoiId": 3,
  "thanhVienList": [
    {
      "nhanKhauId": 3,
      "quanHeVoiChuHo": "Chủ hộ",
      "ghiChu": ""
    },
    {
      "nhanKhauId": 4,
      "quanHeVoiChuHo": "Em",
      "ghiChu": ""
    }
  ]
}
```

### Response (201 Created)
```json
{
  "id": 2,
  "maSoHo": "HK002",
  "chuHo": {
    "id": 3,
    "hoTen": "Nguyễn Văn C",
    "soCCCD": "003456789012",
    ...
  },
  "diaChi": "Số 10 Lê Lợi, Quận 1, TP.HCM",
  "ngayLap": "2025-11-24"
}
```

### Error Responses

#### 400 BAD_REQUEST
```json
"Chủ hộ mới phải nằm trong danh sách thành viên tách!"
```

#### 409 CONFLICT
```json
"Không thể tách hết thành viên! Hộ khẩu cũ phải còn ít nhất 1 người."
```

---

## 📊 BACKEND LOGIC

### File: `HoKhauService.java`

#### Phương thức: `tachHoKhau(Integer hoKhauCuId, TachHoRequest request)`

**BƯỚC 1: Kiểm tra hộ khẩu cũ tồn tại**
```java
Optional<HoKhau> hoKhauCuOpt = hoKhauRepository.findById(hoKhauCuId);
if (hoKhauCuOpt.isEmpty()) {
    throw new IllegalArgumentException("Không tìm thấy hộ khẩu gốc");
}
```

**BƯỚC 2: Kiểm tra mã số hộ mới không trùng**
```java
Optional<HoKhau> existingHoKhau = hoKhauRepository.findByMaSoHo(request.getMaSoHo());
if (existingHoKhau.isPresent()) {
    throw new IllegalStateException("Mã số hộ đã tồn tại!");
}
```

**BƯỚC 3: Kiểm tra danh sách thành viên hợp lệ**
```java
if (request.getThanhVienList() == null || request.getThanhVienList().isEmpty()) {
    throw new IllegalArgumentException("Danh sách thành viên không được rỗng!");
}
```

**BƯỚC 4: Kiểm tra chủ hộ mới**
```java
// Chủ hộ mới phải nằm trong danh sách tách
boolean chuHoInList = request.getThanhVienList().stream()
    .anyMatch(tv -> tv.getNhanKhauId().equals(request.getChuHoMoiId()));

if (!chuHoInList) {
    throw new IllegalArgumentException("Chủ hộ mới phải nằm trong danh sách thành viên tách!");
}
```

**BƯỚC 5: Kiểm tra tất cả thành viên thuộc hộ cũ**
```java
List<ThanhVienHo> thanhVienHoCu = thanhVienHoRepository.findByHoKhau_Id(hoKhauCuId);

for (TachHoRequest.ThanhVienMoi tvMoi : request.getThanhVienList()) {
    boolean exists = thanhVienHoCu.stream()
        .anyMatch(tv -> tv.getNhanKhau().getId().equals(tvMoi.getNhanKhauId()));
    
    if (!exists) {
        throw new IllegalArgumentException("Nhân khẩu không thuộc hộ khẩu cũ!");
    }
}
```

**BƯỚC 6: Kiểm tra hộ cũ còn ít nhất 1 người**
```java
int soThanhVienConLai = thanhVienHoCu.size() - request.getThanhVienList().size();
if (soThanhVienConLai < 1) {
    throw new IllegalStateException("Hộ khẩu cũ phải còn ít nhất 1 người!");
}
```

**BƯỚC 7: Tạo hộ khẩu mới**
```java
HoKhau hoKhauMoi = new HoKhau();
hoKhauMoi.setMaSoHo(request.getMaSoHo());
hoKhauMoi.setDiaChi(request.getDiaChi());
hoKhauMoi.setNgayLap(request.getNgayLap() != null ? request.getNgayLap() : LocalDate.now());
hoKhauMoi.setChuHo(chuHoMoiOpt.get());

HoKhau savedHoKhauMoi = hoKhauRepository.save(hoKhauMoi);
```

**BƯỚC 8: Chuyển thành viên sang hộ mới**
```java
for (TachHoRequest.ThanhVienMoi tvMoi : request.getThanhVienList()) {
    Optional<ThanhVienHo> tvCuOpt = thanhVienHoCu.stream()
        .filter(tv -> tv.getNhanKhau().getId().equals(tvMoi.getNhanKhauId()))
        .findFirst();
    
    if (tvCuOpt.isPresent()) {
        ThanhVienHo tvCu = tvCuOpt.get();
        
        // 1. Xóa khỏi hộ cũ
        thanhVienHoRepository.delete(tvCu);
        
        // 2. Tạo mới trong hộ mới
        ThanhVienHo tvMoiEntity = new ThanhVienHo();
        tvMoiEntity.setHoKhau(savedHoKhauMoi);
        tvMoiEntity.setNhanKhau(tvCu.getNhanKhau());
        tvMoiEntity.setQuanHeVoiChuHo(
            tvMoi.getNhanKhauId().equals(request.getChuHoMoiId()) 
                ? "Chủ hộ" 
                : tvMoi.getQuanHeVoiChuHo()
        );
        tvMoiEntity.setGhiChu(tvMoi.getGhiChu());
        
        thanhVienHoRepository.save(tvMoiEntity);
    }
}
```

**BƯỚC 9: Cập nhật chủ hộ cũ nếu bị tách**
```java
HoKhau hoKhauCu = hoKhauCuOpt.get();
Integer chuHoCuId = hoKhauCu.getChuHo() != null ? hoKhauCu.getChuHo().getId() : null;

if (chuHoCuId != null) {
    boolean chuHoCuBiTach = request.getThanhVienList().stream()
        .anyMatch(tv -> tv.getNhanKhauId().equals(chuHoCuId));
    
    if (chuHoCuBiTach) {
        // Chủ hộ cũ bị tách → Chọn người còn lại làm chủ hộ
        List<ThanhVienHo> thanhVienConLai = thanhVienHoRepository.findByHoKhau_Id(hoKhauCuId);
        
        if (!thanhVienConLai.isEmpty()) {
            ThanhVienHo chuHoMoiCuaHoCu = thanhVienConLai.get(0);
            hoKhauCu.setChuHo(chuHoMoiCuaHoCu.getNhanKhau());
            
            chuHoMoiCuaHoCu.setQuanHeVoiChuHo("Chủ hộ");
            thanhVienHoRepository.save(chuHoMoiCuaHoCu);
            
            hoKhauRepository.save(hoKhauCu);
        }
    }
}
```

---

## 🎨 FRONTEND UI

### File: `ThanhVienHoListPage.jsx`

#### Button "Tách hộ"
```jsx
<Button 
    type="default"
    icon={<SplitCellsOutlined />}
    onClick={() => {
        if (thanhVienList.length <= 1) {
            message.warning('Cần ít nhất 2 thành viên để có thể tách hộ!');
            return;
        }
        setIsTachHoModalVisible(true);
    }}
>
    Tách hộ
</Button>
```

#### Modal Tách Hộ (3 bước)

**BƯỚC 1: Chọn thành viên tách**
```jsx
<Checkbox.Group 
    value={selectedThanhVien}
    onChange={(values) => setSelectedThanhVien(values)}
>
    {thanhVienList.map(tv => (
        <Checkbox value={tv.nhanKhau?.id}>
            {tv.nhanKhau?.hoTen} - {tv.quanHeVoiChuHo}
        </Checkbox>
    ))}
</Checkbox.Group>
```

**BƯỚC 2: Thông tin hộ mới**
```jsx
<Form.Item name="maSoHo" label="Mã số hộ mới" rules={[{ required: true }]}>
    <Input placeholder="Ví dụ: HK002" />
</Form.Item>

<Form.Item name="diaChi" label="Địa chỉ hộ mới" rules={[{ required: true }]}>
    <Input placeholder="Số nhà, đường, phường..." />
</Form.Item>

<Form.Item name="chuHoMoiId" label="Chủ hộ mới" rules={[{ required: true }]}>
    <Select placeholder="Chọn từ danh sách đã chọn">
        {selectedThanhVien.map(nkId => (
            <Option value={nkId}>{/* Tên thành viên */}</Option>
        ))}
    </Select>
</Form.Item>
```

**BƯỚC 3: Quan hệ với chủ hộ mới**
```jsx
{selectedThanhVien.map(nkId => (
    <Row key={nkId}>
        <Col span={8}>{/* Tên thành viên */}</Col>
        <Col span={8}>
            <Form.Item name={`quanHe_${nkId}`}>
                <Select>
                    <Option value="Chủ hộ">Chủ hộ</Option>
                    <Option value="Vợ/Chồng">Vợ/Chồng</Option>
                    <Option value="Con">Con</Option>
                    ...
                </Select>
            </Form.Item>
        </Col>
        <Col span={8}>
            <Form.Item name={`ghiChu_${nkId}`}>
                <Input placeholder="Ghi chú" />
            </Form.Item>
        </Col>
    </Row>
))}
```

#### Handler Submit
```javascript
const handleTachHo = async (values) => {
    const payload = {
        maSoHo: values.maSoHo,
        diaChi: values.diaChi,
        ngayLap: values.ngayLap?.format('YYYY-MM-DD'),
        chuHoMoiId: values.chuHoMoiId,
        thanhVienList: selectedThanhVien.map(nhanKhauId => ({
            nhanKhauId: nhanKhauId,
            quanHeVoiChuHo: values[`quanHe_${nhanKhauId}`] || 'Thành viên',
            ghiChu: values[`ghiChu_${nhanKhauId}`] || ''
        }))
    };

    await apiClient.post(`/hokhau/${hoKhauId}/tach`, payload);
    message.success('Tách hộ thành công!');
    navigate('/dashboard/hokhau');
};
```

---

## ✅ VALIDATION RULES

### Backend
1. ✅ Hộ khẩu cũ phải tồn tại
2. ✅ Mã số hộ mới không được trùng
3. ✅ Danh sách thành viên không được rỗng
4. ✅ Chủ hộ mới phải nằm trong danh sách tách
5. ✅ Chủ hộ mới phải tồn tại trong database
6. ✅ Tất cả thành viên phải thuộc hộ cũ
7. ✅ Hộ cũ phải còn ít nhất 1 người

### Frontend
1. ✅ Cần ít nhất 2 thành viên trong hộ mới cho phép tách
2. ✅ Phải chọn ít nhất 1 thành viên để tách
3. ✅ Không cho phép tách hết thành viên
4. ✅ Chủ hộ mới chỉ chọn được từ danh sách đã chọn
5. ✅ Tất cả field bắt buộc phải điền

---

## 🧪 TEST CASES

### Test Case 1: Tách hộ thành công
**Input**:
- Hộ cũ: HK001 (4 thành viên)
- Tách: 2 thành viên (ID: 3, 4)
- Chủ hộ mới: ID 3
- Mã số hộ: HK002

**Expected**:
- ✅ API 201 Created
- ✅ Hộ mới HK002 được tạo với 2 thành viên
- ✅ Hộ cũ HK001 còn 2 thành viên
- ✅ Frontend chuyển về trang danh sách hộ khẩu

### Test Case 2: Tách hết thành viên (Lỗi)
**Input**:
- Hộ cũ: HK001 (2 thành viên)
- Tách: 2 thành viên

**Expected**:
- ❌ Frontend block: "Không thể tách hết thành viên!"
- ❌ Không gọi API

### Test Case 3: Mã số hộ trùng (Lỗi)
**Input**:
- Mã số hộ: HK001 (đã tồn tại)

**Expected**:
- ❌ API 409 Conflict
- ❌ Message: "Mã số hộ 'HK001' đã tồn tại!"

### Test Case 4: Chủ hộ không trong danh sách (Lỗi)
**Input**:
- Tách: ID 3, 4
- Chủ hộ mới: ID 5 (không có trong danh sách)

**Expected**:
- ❌ Frontend block (Select chỉ cho chọn từ danh sách đã chọn)
- ❌ Không thể submit

### Test Case 5: Tách chủ hộ cũ
**Input**:
- Hộ cũ: HK001, Chủ hộ: ID 1
- Tách: ID 1 (chủ hộ cũ)

**Expected**:
- ✅ Tách thành công
- ✅ Hộ cũ tự động chọn người còn lại làm chủ hộ mới
- ✅ Quan hệ trong bảng ThanhVienHo cập nhật đúng

---

## 📋 DATABASE CHANGES

### Table: `hokhau`
```sql
-- Hộ mới được INSERT
INSERT INTO hokhau (MaSoHo, IDChuHo, DiaChi, NgayLap)
VALUES ('HK002', 3, 'Số 10 Lê Lợi', '2025-11-24');

-- Nếu chủ hộ cũ bị tách → UPDATE
UPDATE hokhau SET IDChuHo = 2 WHERE id = 1;
```

### Table: `thanhvienho`
```sql
-- Xóa thành viên khỏi hộ cũ
DELETE FROM thanhvienho WHERE id IN (3, 4);

-- Thêm vào hộ mới
INSERT INTO thanhvienho (IDHoKhau, IDNhanKhau, QuanHeVoiChuHo)
VALUES 
    (2, 3, 'Chủ hộ'),
    (2, 4, 'Em');

-- Nếu chủ hộ cũ thay đổi → UPDATE
UPDATE thanhvienho 
SET QuanHeVoiChuHo = 'Chủ hộ' 
WHERE IDHoKhau = 1 AND IDNhanKhau = 2;
```

---

## 🚀 HƯỚNG DẪN SỬ DỤNG

### 1. Vào trang Thành viên hộ
```
Menu Hộ khẩu → Chọn hộ → Xem chi tiết
```

### 2. Nhấn button "Tách hộ"
- Button màu xám với icon SplitCellsOutlined
- Nằm giữa button "Thêm thành viên" và "Thay đổi Chủ hộ"

### 3. Chọn thành viên tách (Bước 1)
- Tick vào checkbox các thành viên muốn tách
- Hệ thống hiển thị số lượng đã chọn và còn lại

### 4. Điền thông tin hộ mới (Bước 2)
- Mã số hộ: Nhập mã duy nhất (ví dụ: HK002)
- Ngày lập: Chọn ngày lập hộ
- Địa chỉ: Nhập địa chỉ hộ mới

### 5. Chọn chủ hộ mới
- Dropdown chỉ hiển thị thành viên đã chọn ở Bước 1
- Chọn 1 người làm chủ hộ

### 6. Điền quan hệ với chủ hộ mới (Bước 3)
- Mỗi thành viên: Chọn quan hệ + Ghi chú (tùy chọn)
- Chủ hộ tự động có quan hệ "Chủ hộ" (disabled)

### 7. Xác nhận
- Nhấn "Xác nhận Tách hộ"
- Chờ xử lý → Thành công → Chuyển về trang danh sách hộ khẩu
- Kiểm tra: Hộ mới xuất hiện trong danh sách

---

## 💡 LƯU Ý

1. **Không thể hoàn tác**: Sau khi tách, muốn gộp lại phải thêm thủ công từng thành viên
2. **Chủ hộ cũ bị tách**: Hệ thống tự động chọn người còn lại đầu tiên làm chủ hộ
3. **Quan hệ mới**: Quan hệ trong hộ mới được thiết lập lại, không giữ quan hệ cũ
4. **Transaction safety**: Sử dụng `@Transactional` đảm bảo toàn vẹn dữ liệu
5. **Mã số hộ**: Phải unique, không được trùng với hộ khẩu đã có

---

## 📊 FILES LIÊN QUAN

### Backend
```
demo/src/main/java/cnpm/qlnk/demo/
├── dto/
│   └── TachHoRequest.java                 ✅ MỚI - DTO request
├── service/
│   └── HoKhauService.java                 ✅ SỬA - Thêm method tachHoKhau()
└── controller/
    └── HoKhauController.java              ✅ SỬA - Thêm endpoint POST /tach
```

### Frontend
```
quanlynhankhau-frontend/src/
└── pages/hokhau/
    └── ThanhVienHoListPage.jsx            ✅ SỬA - Thêm Modal và logic tách hộ
```

---

**Kết luận**: Tính năng Tách hộ khẩu đã **HOÀN CHỈNH** với đầy đủ validation, error handling, và UI/UX thân thiện! 🎉
