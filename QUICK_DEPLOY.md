# Quick Start - Deploy to Render

## 🚀 Cách nhanh nhất (Recommended)

### 1. Chuẩn bị GitHub
```bash
# Tại thư mục gốc dự án
git add .
git commit -m "Add Render deployment configs"
git push origin main
```

### 2. Deploy trên Render

#### Option A: Dùng Blueprint (Tự động - KHUYẾN NGHỊ)
1. Login [Render.com](https://render.com)
2. Click **"New"** → **"Blueprint"**
3. Connect GitHub repo của bạn
4. **Sửa file `render.yaml` trước**:
   - Line 7: Thay `https://github.com/YOUR_USERNAME/YOUR_REPO` bằng repo thực của bạn
5. Render sẽ tự động tạo:
   - ✅ MySQL Database
   - ✅ Backend API
   - ✅ Frontend

#### Option B: Deploy thủ công
Xem file `DEPLOY_GUIDE.md` để biết chi tiết

### 3. Cấu hình sau khi deploy

#### Backend Environment Variables (Render tự set phần lớn)
Bạn chỉ cần thêm:
```
JWT_SECRET=<tạo chuỗi random 32+ ký tự>
```

Tạo JWT Secret:
```powershell
# Windows PowerShell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

#### Frontend Environment Variables
Render tự động set `VITE_API_URL` từ backend service URL

### 4. Kiểm tra
- Backend health: `https://your-backend.onrender.com/actuator/health`
- Frontend: `https://your-frontend.onrender.com`

## 📝 Files đã tạo cho Deploy

```
BTL_CNPM/
├── render.yaml                          # Blueprint config
├── DEPLOY_GUIDE.md                      # Hướng dẫn chi tiết
├── demo/
│   ├── Dockerfile                       # Backend container
│   ├── render-build.sh                  # Build script
│   └── src/main/resources/
│       └── application-prod.yml         # Production config
└── quanlynhankhau-frontend/
    ├── .env.development                 # Dev env vars
    └── .env.production                  # Prod env vars
```

## ⚡ First-time Setup Checklist

- [ ] 1. Sửa `render.yaml` line 7 (GitHub repo URL)
- [ ] 2. Push code to GitHub
- [ ] 3. Create Blueprint on Render
- [ ] 4. Tạo JWT_SECRET và add vào backend env vars
- [ ] 5. Wait for deployment (~5-10 phút)
- [ ] 6. Test backend health endpoint
- [ ] 7. Test frontend login

## 🐛 Common Issues

**Backend không start?**
- Kiểm tra logs trong Render Dashboard
- Verify DATABASE_URL đã được set

**Frontend không connect backend?**
- Kiểm tra CORS settings trong `SecurityConfig.java`
- Verify `VITE_API_URL` trong frontend env vars

**Database lỗi?**
- MySQL free tier: 1GB limit
- Connection string format: `jdbc:mysql://host:port/db`

## 💡 Tips

- Free tier: Backend sleep sau 15 phút không dùng
- First request sau sleep: ~30s (cold start)
- Database free tier: Xóa sau 90 ngày không dùng
- Nên backup database schema định kỳ

---
📖 Xem `DEPLOY_GUIDE.md` để biết hướng dẫn chi tiết và troubleshooting
