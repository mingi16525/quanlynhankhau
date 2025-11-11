# Hướng dẫn Deploy với VS Code Port Forwarding

## 🚀 Cách sử dụng VS Code Port Forward để chia sẻ ứng dụng

### Bước 1: Khởi động Backend

```powershell
# Trong terminal, di chuyển vào thư mục demo
cd demo

# Chạy Spring Boot
./mvnw spring-boot:run
# Hoặc
mvn spring-boot:run
```

Backend sẽ chạy trên `http://localhost:8080`

### Bước 2: Forward Port Backend (8080)

1. Mở **PORTS** panel trong VS Code:
   - `View` → `Terminal` → Chọn tab **PORTS**
   - Hoặc `Ctrl+Shift+P` → gõ "View: Focus on Ports View"

2. Click nút **"Forward a Port"** (hoặc icon +)

3. Nhập port: `8080` và Enter

4. **Đổi sang Public**:
   - Right-click vào port `8080` 
   - Chọn **"Port Visibility"** → **"Public"**

5. **Sao chép URL**:
   - Click vào icon **Globe** hoặc right-click → "Copy Local Address"
   - URL sẽ có dạng: `https://xxx-8080.devtunnels.ms`

### Bước 3: Cập nhật Frontend .env.local

Mở file `quanlynhankhau-frontend/.env.local` và cập nhật:

```bash
VITE_API_BASE_URL=https://[YOUR-BACKEND-URL]/api
```

Ví dụ:
```bash
VITE_API_BASE_URL=https://rhrn9k8k-8080.asse.devtunnels.ms/api
```

### Bước 4: Khởi động Frontend

```powershell
# Trong terminal mới, di chuyển vào thư mục frontend
cd quanlynhankhau-frontend

# Install dependencies (nếu chưa)
npm install

# Chạy dev server
npm run dev
```

Frontend sẽ chạy trên `http://localhost:5173`

### Bước 5: Forward Port Frontend (5173)

1. Trong **PORTS** panel, click **"Forward a Port"**

2. Nhập port: `5173` và Enter

3. **Đổi sang Public**:
   - Right-click vào port `5173`
   - Chọn **"Port Visibility"** → **"Public"**

4. **Sao chép URL**:
   - Click vào icon **Globe**
   - URL sẽ có dạng: `https://xxx-5173.devtunnels.ms`

5. **Chia sẻ URL này** cho người khác để truy cập ứng dụng!

## 🔒 Bảo mật

### Port Visibility Options:

- **Private**: Chỉ bạn truy cập được (yêu cầu đăng nhập GitHub)
- **Public**: Ai có link đều truy cập được (không cần đăng nhập)

### Khuyến nghị:
- Dùng **Public** khi demo cho khách hàng
- Dùng **Private** khi test với team

## 🛠️ Troubleshooting

### Lỗi CORS
Nếu gặp lỗi CORS, kiểm tra:
1. Backend đã chạy chưa?
2. `.env.local` có đúng URL backend không?
3. SecurityConfig đã có `*.devtunnels.ms` trong allowedOriginPatterns

### Frontend không kết nối Backend
1. Kiểm tra URL trong `.env.local`
2. Restart frontend sau khi đổi .env: `npm run dev`
3. Kiểm tra Console (F12) xem lỗi gì

### Port Forward bị disconnect
- VS Code cần mở và backend/frontend phải đang chạy
- Nếu đóng VS Code, port forward sẽ mất

## 📝 Lưu ý

### Ưu điểm:
✅ Miễn phí, không cần server
✅ Dễ setup, chỉ cần VS Code
✅ SSL/HTTPS tự động
✅ Tốt cho demo, testing

### Nhược điểm:
❌ Phải giữ VS Code mở
❌ Phải giữ máy chạy
❌ Không stable cho production
❌ URL thay đổi mỗi lần restart

### Khi nào dùng:
- ✅ Demo cho khách hàng
- ✅ Test với team remote
- ✅ Development/Testing
- ❌ KHÔNG dùng cho production (dùng Render thay thế)

## 🌐 Alternative: Sử dụng ngrok

Nếu không dùng VS Code Port Forward, bạn có thể dùng [ngrok](https://ngrok.com):

```bash
# Install ngrok
# Download từ https://ngrok.com/download

# Forward backend port
ngrok http 8080

# Forward frontend port (terminal khác)
ngrok http 5173
```

## 📚 Tài liệu tham khảo

- [VS Code Port Forwarding](https://code.visualstudio.com/docs/remote/ssh#_forwarding-a-port-creating-ssh-tunnel)
- [Dev Tunnels Documentation](https://learn.microsoft.com/en-us/azure/developer/dev-tunnels/)
