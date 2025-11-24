# Hệ thống Quản lý Nhân khẩu Phường

Bài tập lớn Công nghệ Phần Mềm - Hệ thống quản lý nhân khẩu, hộ khẩu và thu chi cho cấp phường.

## 📋 Mô tả dự án

Hệ thống quản lý nhân khẩu phường là ứng dụng web full-stack giúp quản lý thông tin dân cư, hộ khẩu, thu chi phí và các hoạt động thiện nguyện tại cấp phường. Hệ thống hỗ trợ phân quyền theo vai trò và cung cấp các chức năng CRUD đầy đủ cho từng nghiệp vụ.

## 🏗️ Kiến trúc hệ thống

### Backend
- **Framework**: Spring Boot 3.5.7
- **Language**: Java 21
- **Database**: MySQL 8.0
- **Authentication**: Spring Security + JWT
- **ORM**: Spring Data JPA
- **API Documentation**: Swagger/OpenAPI
- **Build Tool**: Maven

### Frontend
- **Framework**: React 18.2.0
- **UI Library**: Ant Design 5.27.6
- **Routing**: React Router DOM 7.9.4
- **HTTP Client**: Axios 1.13.0
- **Build Tool**: Vite 7.1.12

## 👥 Phân quyền hệ thống

### 1. ADMIN_HE_THONG (Quản trị viên)
- **Quyền hạn**: Toàn quyền truy cập (`*`, `*`)
- **Chức năng**:
  - Quản lý tài khoản người dùng
  - Quản lý vai trò và phân quyền
  - Truy cập toàn bộ chức năng hệ thống

### 2. CAN_BO_NHAN_KHAU (Cán bộ Nhân khẩu)
- **Quyền hạn**: Full CRUD (16 quyền)
- **Chức năng**:
  - **Nhân khẩu**: READ, CREATE, UPDATE, DELETE
  - **Hộ khẩu**: READ, CREATE, UPDATE, DELETE
  - **Tam trú tạm vắng**: READ, CREATE, UPDATE, DELETE
  - **Sự kiện**: READ, CREATE, UPDATE, DELETE
- **Tài khoản mặc định**: `canbonk` / `password123`

### 3. KE_TOAN_THU_CHI (Kế toán Thu chi)
- **Quyền hạn**: Full CRUD (20 quyền)
- **Chức năng**:
  - **Khoản chi phí bắt buộc**: READ, CREATE, UPDATE, DELETE
  - **Danh sách thu**: READ, CREATE, UPDATE, DELETE
  - **Danh sách chi**: READ, CREATE, UPDATE, DELETE
  - **Hoạt động thiện nguyện**: READ, CREATE, UPDATE, DELETE
  - **Thu thiện nguyện**: READ, CREATE, UPDATE, DELETE
- **Tài khoản mặc định**: `ketoan` / `password123`

### 4. TO_TRUONG (Tổ trưởng)
- **Quyền hạn**: Full CRUD tất cả (36 quyền)
- **Chức năng**: Kết hợp đầy đủ quyền của Cán bộ Nhân khẩu + Kế toán Thu chi
- **Tài khoản mặc định**: `totruong` / `password123`

## 📦 Cơ sở dữ liệu

### Entities (14 bảng)

1. **NhanKhau**: Thông tin nhân khẩu (CCCD, họ tên, ngày sinh, nghề nghiệp, v.v.)
2. **HoKhau**: Thông tin hộ khẩu (số hộ khẩu, địa chỉ, chủ hộ)
3. **ThanhVienHo**: Quan hệ giữa nhân khẩu và hộ khẩu
4. **TamTruTamVang**: Quản lý tạm trú/tạm vắng
5. **SuKienNhanKhau**: Ghi nhận sự kiện (sinh, tử, kết hôn, ly hôn, v.v.)
6. **GhiNhanThayDoiHoKhau**: Lịch sử thay đổi hộ khẩu
7. **KhoanChiPhiBatBuoc**: Các khoản phí bắt buộc
8. **DanhSachThuPhi**: Quản lý thu phí
9. **DanhSachChi**: Quản lý chi tiêu
10. **HoatDongThienNguyen**: Các hoạt động từ thiện
11. **ThuThienNguyen**: Quản lý thu thiện nguyện
12. **TaiKhoan**: Tài khoản người dùng
13. **VaiTro**: Vai trò trong hệ thống
14. **PhanQuyen**: Phân quyền theo vai trò

## 🎯 Chức năng chính

### Quản lý Nhân khẩu
- Thêm/Sửa/Xóa/Xem thông tin nhân khẩu
- Tìm kiếm động theo họ tên/CCCD
- Quản lý thông tin chi tiết (CCCD, quê quán, dân tộc, tôn giáo, v.v.)

### Quản lý Hộ khẩu
- Tạo/Cập nhật/Xóa hộ khẩu
- Thêm/Xóa thành viên hộ khẩu
- Tách hộ khẩu
- Lịch sử thay đổi hộ khẩu
- Tìm kiếm động thành viên khi thêm vào hộ

### Quản lý Tam trú/Tạm vắng
- Đăng ký tạm trú/tạm vắng
- Quản lý thời hạn tạm trú/tạm vắng
- Tự động cập nhật trạng thái hết hạn

### Quản lý Sự kiện
- Ghi nhận sự kiện nhân khẩu (sinh, tử, kết hôn, ly hôn, chuyển đi, chuyển đến)
- Xem lịch sử sự kiện

### Quản lý Thu chi
- Tạo khoản phí bắt buộc
- Thu phí từ hộ khẩu
- Quản lý khoản chi
- Báo cáo thu phí theo tháng/năm

### Quản lý Thiện nguyện
- Tạo hoạt động thiện nguyện
- Thu tiền thiện nguyện
- Theo dõi danh sách đóng góp

### Thống kê & Báo cáo
- Thống kê nhân khẩu theo độ tuổi, giới tính
- Báo cáo thu chi
- Thống kê tạm trú/tạm vắng
- Thống kê thiện nguyện

## 🚀 Cài đặt và Chạy dự án

### Yêu cầu hệ thống
- Java 21+
- Node.js 18+
- MySQL 8.0+
- Maven 3.8+

### Backend Setup

```bash
# Di chuyển vào thư mục backend
cd demo

# Cấu hình database trong src/main/resources/application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/quanlynhankhaudb
spring.datasource.username=root
spring.datasource.password=your_password

# Uncomment seed data trong DemoApplication.java (dòng 20-254)

# Build và chạy
./mvnw clean install
./mvnw spring-boot:run
```

Backend sẽ chạy tại: `http://localhost:8080`  
Swagger UI: `http://localhost:8080/swagger-ui.html`

### Frontend Setup

```bash
# Di chuyển vào thư mục frontend
cd quanlynhankhau-frontend

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:3000`

### Database Setup

```sql
-- Tạo database
CREATE DATABASE quanlynhankhaudb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Spring Boot sẽ tự động tạo bảng khi khởi động (ddl-auto=update)
-- Uncomment seed data trong DemoApplication.java để tạo dữ liệu mẫu
```

## 📱 Giao diện người dùng

### Dashboard
- Hiển thị các chức năng nhanh theo vai trò
- Thống kê tổng quan

### Menu điều hướng
- Phân quyền động theo vai trò
- Sidebar navigation với icons

### Trang quản lý
- Bảng dữ liệu với phân trang
- Tìm kiếm và lọc
- Modal thêm/sửa
- Xác nhận xóa

## 🔐 Bảo mật

- **Authentication**: JWT-based authentication
- **Password Hashing**: BCrypt
- **Authorization**: Role-based access control (RBAC)
- **CORS**: Configured for frontend domain
- **Input Validation**: Bean Validation (JSR-303)

## 🛠️ Công nghệ sử dụng

### Backend Dependencies
- Spring Boot Starter Web
- Spring Boot Starter Data JPA
- Spring Boot Starter Security
- Spring Boot Starter Validation
- MySQL Connector
- Lombok
- JWT (jjwt 0.11.5)
- SpringDoc OpenAPI 2.6.0

### Frontend Dependencies
- React 18.2.0
- Ant Design 5.27.6
- React Router DOM 7.9.4
- Axios 1.13.0
- Material UI (Icons)
- Vite 7.1.12

## 📁 Cấu trúc thư mục

```
BTL_CNPM/
├── demo/                          # Backend Spring Boot
│   ├── src/main/java/cnpm/qlnk/demo/
│   │   ├── controller/           # REST Controllers
│   │   ├── service/              # Business Logic
│   │   ├── repository/           # Data Access Layer
│   │   ├── entity/               # JPA Entities
│   │   ├── dto/                  # Data Transfer Objects
│   │   ├── config/               # Configuration
│   │   └── DemoApplication.java  # Main + Seed Data
│   └── src/main/resources/
│       └── application.properties
├── quanlynhankhau-frontend/      # Frontend React
│   ├── src/
│   │   ├── components/           # Reusable Components
│   │   ├── pages/                # Page Components
│   │   ├── context/              # React Context (Auth)
│   │   ├── api/                  # API Services
│   │   └── App.jsx
│   └── package.json
├── Data/                          # MySQL Data Directory
└── README.md
```

## 🔄 Workflow

1. **Login**: Người dùng đăng nhập bằng username/password
2. **JWT Token**: Server trả về JWT token
3. **Authorization**: Frontend gửi token trong header cho mọi request
4. **Role Check**: Backend kiểm tra quyền trước khi xử lý request
5. **Response**: Trả về dữ liệu hoặc error message

## 📊 API Endpoints (Ví dụ)

```
POST   /api/auth/login                    # Đăng nhập
GET    /api/nhankhau                      # Lấy danh sách nhân khẩu
POST   /api/nhankhau                      # Thêm nhân khẩu
PUT    /api/nhankhau/{id}                 # Cập nhật nhân khẩu
DELETE /api/nhankhau/{id}                 # Xóa nhân khẩu
GET    /api/nhankhau/search?keyword=...   # Tìm kiếm nhân khẩu
GET    /api/hokhau                        # Lấy danh sách hộ khẩu
POST   /api/hokhau                        # Thêm hộ khẩu
PUT    /api/hokhau/{id}                   # Cập nhật hộ khẩu
POST   /api/hokhau/tach                   # Tách hộ khẩu
GET    /api/thanhvienho/hokhau/{id}       # Lấy thành viên hộ khẩu
POST   /api/thanhvienho                   # Thêm thành viên
DELETE /api/thanhvienho/{id}              # Xóa thành viên
GET    /api/thongke/nhankhau              # Thống kê nhân khẩu
GET    /api/danhsachthuphi                # Danh sách thu phí
POST   /api/danhsachthuphi                # Tạo phiếu thu
```

## 👨‍💻 Tác giả

Sinh viên - Bài tập lớn Công nghệ Phần Mềm

## 📝 License

Dự án học tập - Đại học

## 🔗 Repository

GitHub: [mingi16525/quanlynhankhau](https://github.com/mingi16525/quanlynhankhau)
