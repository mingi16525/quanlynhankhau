package cnpm.qlnk.demo.service;

import cnpm.qlnk.demo.entity.HoatDongThienNguyen;
import cnpm.qlnk.demo.repository.HoatDongThienNguyenRepository;
import cnpm.qlnk.demo.repository.ThuThienNguyenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class HoatDongThienNguyenService {

    @Autowired
    private HoatDongThienNguyenRepository hoatDongRepository;

    @Autowired
    private ThuThienNguyenRepository thuRepository;

    // ========== CRUD CƠ BẢN ==========
    
    public List<HoatDongThienNguyen> getAll() {
        return hoatDongRepository.findAll();
    }

    public Optional<HoatDongThienNguyen> getById(Integer id) {
        return hoatDongRepository.findById(id);
    }

    public List<HoatDongThienNguyen> getActiveHoatDong() {
        return hoatDongRepository.findActiveHoatDong();
    }

    public List<HoatDongThienNguyen> getByTrangThai(String trangThai) {
        return hoatDongRepository.findByTrangThai(trangThai);
    }

    // ========== TẠO MỚI ==========
    
    @Transactional
    public HoatDongThienNguyen create(HoatDongThienNguyen hoatDong) {
        validateHoatDong(hoatDong);
        
        // Kiểm tra trùng tên
        if (hoatDongRepository.existsByTenHoatDong(hoatDong.getTenHoatDong())) {
            throw new IllegalArgumentException("Hoạt động '" + hoatDong.getTenHoatDong() + "' đã tồn tại");
        }

        if (hoatDong.getTrangThai() == null) {
            hoatDong.setTrangThai("Đang gây quỹ");
        }

        HoatDongThienNguyen saved = hoatDongRepository.save(hoatDong);
        System.out.println("✅ Created HoatDong ID: " + saved.getId());
        
        return saved;
    }

    // ========== CẬP NHẬT ==========
    
    @Transactional
    public HoatDongThienNguyen update(HoatDongThienNguyen hoatDong) {
        validateHoatDong(hoatDong);
        
        Optional<HoatDongThienNguyen> existingOpt = hoatDongRepository.findById(hoatDong.getId());
        if (!existingOpt.isPresent()) {
            throw new IllegalStateException("Hoạt động không tồn tại");
        }

        HoatDongThienNguyen updated = hoatDongRepository.save(hoatDong);
        System.out.println("✅ Updated HoatDong ID: " + updated.getId());
        
        return updated;
    }

    // ========== XÓA ==========
    
    @Transactional
    public boolean delete(Integer id) {
        if (!hoatDongRepository.existsById(id)) {
            return false;
        }
        
        hoatDongRepository.deleteById(id);
        System.out.println("✅ Deleted HoatDong ID: " + id);
        
        return true;
    }

    // ========== TÌM KIẾM ==========
    
    public List<HoatDongThienNguyen> search(String keyword) {
        return hoatDongRepository.searchByTenHoatDong(keyword);
    }

    public List<HoatDongThienNguyen> getByDateRange(LocalDate startDate, LocalDate endDate) {
        return hoatDongRepository.findByDateRange(startDate, endDate);
    }

    // ========== THỐNG KÊ ==========
    
    public Map<String, Object> getThongKe(Integer hoatDongId) {
        System.out.println("📊 Lấy thống kê hoạt động ID: " + hoatDongId);
        
        Optional<HoatDongThienNguyen> hoatDongOpt = hoatDongRepository.findById(hoatDongId);
        if (!hoatDongOpt.isPresent()) {
            throw new IllegalStateException("Hoạt động không tồn tại");
        }
        
        HoatDongThienNguyen hoatDong = hoatDongOpt.get();
        
        BigDecimal tongThuDuoc = thuRepository.calculateTotalByHoatDong(hoatDongId);
        Long soLuotDong = thuRepository.countByHoatDong(hoatDongId);
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("tenHoatDong", hoatDong.getTenHoatDong());
        stats.put("mucTieu", hoatDong.getMucTieu());
        stats.put("tongThuDuoc", tongThuDuoc);
        stats.put("soLuotDong", soLuotDong);
        stats.put("conThieu", hoatDong.getMucTieu() != null 
            ? hoatDong.getMucTieu().subtract(tongThuDuoc) : BigDecimal.ZERO);
        stats.put("tiLeHoanThanh", hoatDong.getMucTieu() != null && hoatDong.getMucTieu().doubleValue() > 0
            ? (tongThuDuoc.doubleValue() / hoatDong.getMucTieu().doubleValue() * 100) : 0);
        stats.put("trangThai", hoatDong.getTrangThai());
        
        System.out.println("✅ Thống kê: " + stats);
        
        return stats;
    }

    // ========== VALIDATION ==========
    
    private void validateHoatDong(HoatDongThienNguyen hoatDong) {
        if (hoatDong.getTenHoatDong() == null || hoatDong.getTenHoatDong().trim().isEmpty()) {
            throw new IllegalArgumentException("Vui lòng nhập tên hoạt động");
        }
        
        if (hoatDong.getNgayBatDau() != null && hoatDong.getNgayKetThuc() != null) {
            if (hoatDong.getNgayKetThuc().isBefore(hoatDong.getNgayBatDau())) {
                throw new IllegalArgumentException("Ngày kết thúc phải sau ngày bắt đầu");
            }
        }
    }
}