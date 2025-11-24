# Script PowerShell để reset database
# Chạy file SQL reset_database.sql

$mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
$username = "root"
$password = "123456"
$sqlFile = "d:\2025.2\NhapMonCNPN\BTL_CNPM\reset_database.sql"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "RESET DATABASE - XÓA DỮ LIỆU VÀ RESET AUTO INCREMENT" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Kiểm tra file SQL tồn tại
if (-not (Test-Path $sqlFile)) {
    Write-Host "Loi: Khong tim thay file SQL: $sqlFile" -ForegroundColor Red
    exit 1
}

# Xác nhận trước khi thực thi
Write-Host "CANH BAO: Script nay se XOA TAT CA du lieu trong database!" -ForegroundColor Red
Write-Host "Ban co chac chan muon tiep tuc? (Y/N)" -ForegroundColor Yellow
$confirm = Read-Host

if ($confirm -ne "Y" -and $confirm -ne "y") {
    Write-Host "Huy thuc thi." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "Dang thuc thi script SQL..." -ForegroundColor Green

# Thực thi file SQL
Get-Content $sqlFile | & $mysqlPath -u $username -p$password

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "RESET DATABASE THANH CONG!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "- Tat ca du lieu da duoc xoa" -ForegroundColor Green
    Write-Host "- Auto increment da duoc reset ve 1" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "Loi khi thuc thi script!" -ForegroundColor Red
    exit 1
}
