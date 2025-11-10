package cnpm.qlnk.demo.service;

import cnpm.qlnk.demo.entity.SuKienNhanKhau;
import cnpm.qlnk.demo.entity.NhanKhau;
import cnpm.qlnk.demo.repository.SuKienNhanKhauRepository;
import cnpm.qlnk.demo.repository.NhanKhauRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class SuKienNhanKhauService {

    @Autowired
    private SuKienNhanKhauRepository suKienNhanKhauRepository;

    @Autowired
    private NhanKhauRepository nhanKhauRepository;

    // ========== CRUD CƠ BẢN ==========
    
    public List<SuKienNhanKhau> getAll() {
        return suKienNhanKhauRepository.findAll();
    }

    public Optional<SuKienNhanKhau> getById(Long id) {
        return suKienNhanKhauRepository.findById(id);
    }

    public List<SuKienNhanKhau> getByLoai(String loaiSuKien) {
        return suKienNhanKhauRepository.findByLoaiSuKien(loaiSuKien);
    }

    public List<SuKienNhanKhau> getByNhanKhauId(Integer nhanKhauId) {
        return suKienNhanKhauRepository.findByNhanKhauId(nhanKhauId);
    }

    // ========== GHI NHẬN SỰ KIỆN ==========
    
    @Transactional
    public SuKienNhanKhau create(SuKienNhanKhau suKien) {
        // Validation
        validateSuKien(suKien);

        // Nếu là sự kiện "Mất", cập nhật trạng thái Nhân khẩu
        if ("Mất".equals(suKien.getLoaiSuKien())) {
            if (suKien.getNhanKhau() == null || suKien.getNhanKhau().getId() == null) {
                throw new IllegalArgumentException("Vui lòng chọn Nhân khẩu");
            }

            Optional<NhanKhau> nhanKhauOpt = nhanKhauRepository.findById(suKien.getNhanKhau().getId());
            if (!nhanKhauOpt.isPresent()) {
                throw new IllegalStateException("Nhân khẩu không tồn tại với ID: " + suKien.getNhanKhau().getId());
            }

            NhanKhau nhanKhau = nhanKhauOpt.get();

            // Kiểm tra đã mất chưa
            if ("Đã mất".equals(nhanKhau.getTinhTrang())) {
                throw new IllegalStateException("Nhân khẩu này đã được ghi nhận là đã mất");
            }

            // ========== CẬP NHẬT TRẠNG THÁI NHÂN KHẨU ==========
            nhanKhau.setTinhTrang("Đã mất");
            nhanKhauRepository.save(nhanKhau);
            System.out.println("✅ Updated NhanKhau ID " + nhanKhau.getId() + " → Tình trạng: Đã mất");
        }

        // Lưu sự kiện
        SuKienNhanKhau saved = suKienNhanKhauRepository.save(suKien);
        System.out.println("✅ Created SuKienNhanKhau ID: " + saved.getId() + " - Loại: " + saved.getLoaiSuKien());

        return saved;
    }

    // ========== CẬP NHẬT ==========
    
    @Transactional
    public SuKienNhanKhau update(SuKienNhanKhau suKien) {
        validateSuKien(suKien);

        // Không cho phép thay đổi loại sự kiện
        Optional<SuKienNhanKhau> existingOpt = suKienNhanKhauRepository.findById(suKien.getId());
        if (existingOpt.isPresent()) {
            SuKienNhanKhau existing = existingOpt.get();
            if (!existing.getLoaiSuKien().equals(suKien.getLoaiSuKien())) {
                throw new IllegalArgumentException("Không thể thay đổi loại sự kiện");
            }
        }

        return suKienNhanKhauRepository.save(suKien);
    }

    // ========== XÓA ==========
    
    @Transactional
    public boolean delete(Long id) {
        Optional<SuKienNhanKhau> suKienOpt = suKienNhanKhauRepository.findById(id);
        if (!suKienOpt.isPresent()) {
            return false;
        }

        SuKienNhanKhau suKien = suKienOpt.get();

        // Nếu là sự kiện "Mất", khôi phục trạng thái Nhân khẩu
        if ("Mất".equals(suKien.getLoaiSuKien()) && suKien.getNhanKhau() != null) {
            NhanKhau nhanKhau = suKien.getNhanKhau();
            nhanKhau.setTinhTrang("Thường trú");
            nhanKhauRepository.save(nhanKhau);
            System.out.println("✅ Restored NhanKhau ID " + nhanKhau.getId() + " → Tình trạng: Thường trú");
        }

        suKienNhanKhauRepository.deleteById(id);
        System.out.println("✅ Deleted SuKienNhanKhau ID: " + id);

        return true;
    }

    // ========== TÌM KIẾM ==========
    
    public List<SuKienNhanKhau> search(String keyword) {
        return suKienNhanKhauRepository.searchByKeyword(keyword);
    }

    public List<SuKienNhanKhau> getByDateRange(LocalDate startDate, LocalDate endDate) {
        return suKienNhanKhauRepository.findByNgayGhiNhanBetween(startDate, endDate);
    }

    public List<SuKienNhanKhau> getByLoaiAndDateRange(String loaiSuKien, LocalDate startDate, LocalDate endDate) {
        return suKienNhanKhauRepository.findByLoaiAndDateRange(loaiSuKien, startDate, endDate);
    }

    // ========== THỐNG KÊ ==========
    
    public Long countByLoai(String loaiSuKien) {
        return suKienNhanKhauRepository.countByLoaiSuKien(loaiSuKien);
    }

    public Long countSinh() {
        return countByLoai("Sinh");
    }

    public Long countMat() {
        return countByLoai("Mất");
    }

    // ========== VALIDATION ==========
    
    private void validateSuKien(SuKienNhanKhau suKien) {
        // Kiểm tra loại sự kiện
        if (suKien.getLoaiSuKien() == null || 
            (!suKien.getLoaiSuKien().equals("Sinh") && !suKien.getLoaiSuKien().equals("Mất"))) {
            throw new IllegalArgumentException("Loại sự kiện phải là 'Sinh' hoặc 'Mất'");
        }

        // Kiểm tra ngày ghi nhận
        if (suKien.getNgayGhiNhan() == null) {
            throw new IllegalArgumentException("Vui lòng nhập ngày ghi nhận");
        }

        // Không cho phép ngày trong tương lai
        if (suKien.getNgayGhiNhan().isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("Ngày ghi nhận không được là ngày trong tương lai");
        }

        // Nếu là sự kiện "Mất", phải có Nhân khẩu
        if ("Mất".equals(suKien.getLoaiSuKien())) {
            if (suKien.getNhanKhau() == null || suKien.getNhanKhau().getId() == null) {
                throw new IllegalArgumentException("Vui lòng chọn Nhân khẩu cho sự kiện Mất");
            }
        }
    }
}