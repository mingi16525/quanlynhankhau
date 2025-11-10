# Hướng dẫn Deploy lên Render

Dự án này bao gồm:
- **Backend**: Spring Boot (Java 21) + MySQL
- **Frontend**: React + Vite
- **Database**: MySQL

## 📋 Chuẩn bị trước khi deploy

### 1. Push code lên GitHub
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### 2. Tạo tài khoản Render
- Truy cập [render.com](https://render.com)
- Đăng ký/Đăng nhập bằng GitHub

## 🚀 Deploy bằng Blueprint (Khuyến nghị)

### Cách 1: Sử dụng file render.yaml

1. **Đăng nhập Render** và chọn "New" → "Blueprint"
2. **Connect Repository**: Chọn repository GitHub của bạn
3. **Render sẽ tự động phát hiện file `render.yaml`** và tạo:
   - MySQL Database
   - Backend Web Service (Spring Boot)
   - Frontend Static Site (React)

4. **Cập nhật file `render.yaml`**:
   - Thay `YOUR_USERNAME/YOUR_REPO` bằng repo GitHub của bạn

5. Click "Apply" và đợi Render deploy

## 🔧 Deploy thủ công (Alternative)

### Bước 1: Tạo MySQL Database

1. Dashboard Render → "New" → "PostgreSQL" (hoặc MySQL nếu có)
2. Điền thông tin:
   - Name: `quanlynhankhau-db`
   - Database: `QuanLyNhanKhauDB`
   - User: `quanlynhankhau_user`
   - Region: Singapore (gần VN nhất)
3. Chọn Free plan
4. **Lưu lại thông tin kết nối**:
   - Internal Database URL
   - Username
   - Password

### Bước 2: Deploy Backend (Spring Boot)

1. Dashboard → "New" → "Web Service"
2. Connect repository GitHub
3. Cấu hình:
   - **Name**: `quanlynhankhau-backend`
   - **Root Directory**: `demo`
   - **Environment**: `Docker`
   - **Region**: Singapore
   - **Branch**: `main`
   - **Dockerfile Path**: `./Dockerfile`

4. **Environment Variables**:
   ```
   SPRING_PROFILES_ACTIVE=prod
   DATABASE_URL=<Internal Database URL từ bước 1>
   DB_USERNAME=<Username từ bước 1>
   DB_PASSWORD=<Password từ bước 1>
   JWT_SECRET=<Tự tạo chuỗi random dài 32+ ký tự>
   JWT_EXPIRATION=86400000
   PORT=8080
   ```

5. Click "Create Web Service"

### Bước 3: Deploy Frontend (React)

1. Dashboard → "New" → "Static Site"
2. Connect repository
3. Cấu hình:
   - **Name**: `quanlynhankhau-frontend`
   - **Root Directory**: `quanlynhankhau-frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Branch**: `main`

4. **Environment Variables**:
   ```
   VITE_API_URL=<URL của backend service (không có /api)>
   ```
   Ví dụ: `https://quanlynhankhau-backend.onrender.com`

5. Click "Create Static Site"

## 📝 Sau khi Deploy

### Kiểm tra Backend
1. Truy cập: `https://your-backend.onrender.com/actuator/health`
2. Nếu thấy `{"status":"UP"}` → Backend OK

### Kiểm tra Frontend
1. Truy cập URL frontend từ Render
2. Thử đăng nhập
3. Kiểm tra Console (F12) xem có lỗi CORS không

### Nếu gặp lỗi CORS
1. Vào backend service → Environment
2. Thêm biến: `ALLOWED_ORIGINS` = `https://your-frontend.onrender.com`
3. Redeploy backend

## 🔐 Bảo mật

### JWT Secret
Tạo JWT secret mạnh:
```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

### Database Password
- Render tự động tạo password mạnh
- KHÔNG commit password vào Git

## 📊 Giám sát

### Logs Backend
- Render Dashboard → Backend Service → Logs
- Xem real-time logs của Spring Boot

### Logs Frontend
- Browser Console (F12)
- Network tab để debug API calls

## 💰 Chi phí

### Free Tier bao gồm:
- ✅ 1 MySQL Database (1GB)
- ✅ 1 Web Service (750 giờ/tháng)
- ✅ Unlimited Static Sites
- ⚠️ Service sleep sau 15 phút không hoạt động
- ⚠️ Database bị xóa sau 90 ngày (free tier)

### Lưu ý Free Tier
- Backend sẽ sleep khi không dùng → request đầu tiên chậm (cold start ~30s)
- Database có giới hạn 1GB
- Không có custom domain (dùng *.onrender.com)

## 🐛 Troubleshooting

### Backend không khởi động
1. Kiểm tra logs: `Render Dashboard → Service → Logs`
2. Kiểm tra DATABASE_URL đúng format
3. Verify Java version = 21

### Frontend không kết nối được Backend
1. Kiểm tra `VITE_API_URL` có đúng không
2. Kiểm tra CORS trong SecurityConfig
3. Verify backend đang chạy (health check)

### Database connection failed
1. Kiểm tra DATABASE_URL format:
   ```
   jdbc:mysql://[host]:[port]/[database]?useSSL=true&serverTimezone=UTC
   ```
2. Verify username/password
3. Kiểm tra database đã tạo chưa

## 📞 Hỗ trợ

- [Render Docs](https://render.com/docs)
- [Spring Boot Docs](https://spring.io/projects/spring-boot)
- [Vite Docs](https://vitejs.dev)

## 🎯 Checklist Deploy

- [ ] Code đã push lên GitHub
- [ ] File `render.yaml` đã cập nhật repo URL
- [ ] Tạo MySQL Database trên Render
- [ ] Deploy Backend với đủ environment variables
- [ ] Deploy Frontend với VITE_API_URL
- [ ] Test health endpoint backend
- [ ] Test login frontend
- [ ] Kiểm tra CORS
- [ ] Tạo JWT_SECRET mạnh
- [ ] Backup database schema (nếu cần)
