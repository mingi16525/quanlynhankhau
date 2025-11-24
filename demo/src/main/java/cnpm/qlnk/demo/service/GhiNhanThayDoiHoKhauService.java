package cnpm.qlnk.demo.service;

import cnpm.qlnk.demo.entity.GhiNhanThayDoiHoKhau;
import cnpm.qlnk.demo.entity.HoKhau;
import cnpm.qlnk.demo.repository.GhiNhanThayDoiHoKhauRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class GhiNhanThayDoiHoKhauService {

    @Autowired
    private GhiNhanThayDoiHoKhauRepository ghiNhanRepository;

    // ========== CRUD CƠ BẢN ==========
    
    public List<GhiNhanThayDoiHoKhau> getAll() {
        return ghiNhanRepository.findAll();
    }

    public Optional<GhiNhanThayDoiHoKhau> getById(Long id) {
        return ghiNhanRepository.findById(id);
    }

    public List<GhiNhanThayDoiHoKhau> getByHoKhau(Integer hoKhauId) {
        return ghiNhanRepository.findByHoKhauIdOrderByNgayGhiNhanDesc(hoKhauId);
    }

    public List<GhiNhanThayDoiHoKhau> getByTenSuKien(String tenSuKien) {
        return ghiNhanRepository.findByTenSuKienOrderByNgayGhiNhanDesc(tenSuKien);
    }

    public List<GhiNhanThayDoiHoKhau> getByNguoiThucHien(String nguoiThucHien) {
        return ghiNhanRepository.findByNguoiThucHienOrderByNgayGhiNhanDesc(nguoiThucHien);
    }

    public List<GhiNhanThayDoiHoKhau> search(String keyword) {
        return ghiNhanRepository.searchByKeyword(keyword);
    }

    // ========== GHI NHẬN THAY ĐỔI ==========
    
    /**
     * Ghi nhận thay đổi hộ khẩu
     * @param hoKhau Hộ khẩu bị thay đổi
     * @param tenSuKien Tên sự kiện: "Thay đổi thông tin", "Thêm thành viên", "Xóa thành viên", "Đổi chủ hộ", "Tách hộ"
     * @param moTa Mô tả chi tiết thay đổi
     */
    @Transactional
    public GhiNhanThayDoiHoKhau ghiNhanThayDoi(HoKhau hoKhau, String tenSuKien, String moTa) {
        // Lấy username của người đang đăng nhập
        String nguoiThucHien = getCurrentUsername();
        
        GhiNhanThayDoiHoKhau ghiNhan = new GhiNhanThayDoiHoKhau();
        ghiNhan.setHoKhau(hoKhau);
        ghiNhan.setTenSuKien(tenSuKien);
        ghiNhan.setMoTa(moTa);
        ghiNhan.setNguoiThucHien(nguoiThucHien);
        ghiNhan.setNgayGhiNhan(LocalDateTime.now());
        
        GhiNhanThayDoiHoKhau saved = ghiNhanRepository.save(ghiNhan);
        System.out.println("✅ Ghi nhận thay đổi: [" + tenSuKien + "] - " + moTa);
        
        return saved;
    }

    /**
     * Ghi nhận thay đổi thông tin hộ khẩu
     */
    public GhiNhanThayDoiHoKhau ghiNhanThayDoiThongTin(HoKhau hoKhau, String chiTiet) {
        String moTa = String.format("Thay đổi thông tin hộ khẩu %s: %s", 
            hoKhau.getMaSoHo(), chiTiet);
        return ghiNhanThayDoi(hoKhau, "Thay đổi thông tin", moTa);
    }

    /**
     * Ghi nhận thêm thành viên
     */
    public GhiNhanThayDoiHoKhau ghiNhanThemThanhVien(HoKhau hoKhau, String tenThanhVien) {
        String moTa = String.format("Thêm thành viên '%s' vào hộ khẩu %s", 
            tenThanhVien, hoKhau.getMaSoHo());
        return ghiNhanThayDoi(hoKhau, "Thêm thành viên", moTa);
    }

    /**
     * Ghi nhận xóa thành viên
     */
    public GhiNhanThayDoiHoKhau ghiNhanXoaThanhVien(HoKhau hoKhau, String tenThanhVien) {
        String moTa = String.format("Xóa thành viên '%s' khỏi hộ khẩu %s", 
            tenThanhVien, hoKhau.getMaSoHo());
        return ghiNhanThayDoi(hoKhau, "Xóa thành viên", moTa);
    }

    /**
     * Ghi nhận đổi chủ hộ
     */
    public GhiNhanThayDoiHoKhau ghiNhanDoiChuHo(HoKhau hoKhau, String tenChuHoCu, String tenChuHoMoi) {
        String moTa = String.format("Đổi chủ hộ của hộ khẩu %s: từ '%s' sang '%s'", 
            hoKhau.getMaSoHo(), tenChuHoCu, tenChuHoMoi);
        return ghiNhanThayDoi(hoKhau, "Đổi chủ hộ", moTa);
    }

    /**
     * Ghi nhận tách hộ
     */
    public GhiNhanThayDoiHoKhau ghiNhanTachHo(HoKhau hoKhauCu, HoKhau hoKhauMoi, int soThanhVienTach) {
        String moTa = String.format("Tách %d thành viên từ hộ khẩu %s sang hộ khẩu mới %s", 
            soThanhVienTach, hoKhauCu.getMaSoHo(), hoKhauMoi.getMaSoHo());
        return ghiNhanThayDoi(hoKhauCu, "Tách hộ", moTa);
    }

    // ========== XÓA ==========
    
    @Transactional
    public boolean delete(Long id) {
        if (!ghiNhanRepository.existsById(id)) {
            return false;
        }
        ghiNhanRepository.deleteById(id);
        System.out.println("✅ Deleted GhiNhanThayDoiHoKhau ID: " + id);
        return true;
    }

    // ========== TÌM KIẾM THEO THỜI GIAN ==========
    
    public List<GhiNhanThayDoiHoKhau> getByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return ghiNhanRepository.findByNgayGhiNhanBetween(startDate, endDate);
    }

    // ========== HELPER ==========
    
    private String getCurrentUsername() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated()) {
                return authentication.getName();
            }
        } catch (Exception e) {
            System.err.println("⚠️ Không thể lấy username: " + e.getMessage());
        }
        return "system";
    }
}
