package cnpm.qlnk.demo.service;

import cnpm.qlnk.demo.entity.DanhSachChi;
import cnpm.qlnk.demo.repository.DanhSachChiRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class DanhSachChiService {

    @Autowired
    private DanhSachChiRepository chiRepository;

    // ========== CRUD CƠ BẢN ==========
    
    public List<DanhSachChi> getAll() {
        return chiRepository.findAll();
    }

    public Optional<DanhSachChi> getById(Long id) {
        return chiRepository.findById(id);
    }

    public List<DanhSachChi> getByLoai(String loaiChi) {
        return chiRepository.findByLoaiChi(loaiChi);
    }

    // ========== TẠO MỚI ==========
    
    @Transactional
    public DanhSachChi create(DanhSachChi chi) {
        validateChi(chi);
        
        if (chi.getNgayChi() == null) {
            chi.setNgayChi(LocalDateTime.now());
        }
        
        DanhSachChi saved = chiRepository.save(chi);
        System.out.println("✅ Created Chi ID: " + saved.getId());
        
        return saved;
    }

    // ========== CẬP NHẬT ==========
    
    @Transactional
    public DanhSachChi update(DanhSachChi chi) {
        validateChi(chi);
        
        DanhSachChi updated = chiRepository.save(chi);
        System.out.println("✅ Updated Chi ID: " + updated.getId());
        
        return updated;
    }

    // ========== XÓA ==========
    
    @Transactional
    public boolean delete(Long id) {
        if (!chiRepository.existsById(id)) {
            return false;
        }
        
        chiRepository.deleteById(id);
        System.out.println("✅ Deleted Chi ID: " + id);
        
        return true;
    }

    // ========== TÌM KIẾM ==========
    
    public List<DanhSachChi> search(String keyword) {
        return chiRepository.searchByKeyword(keyword);
    }

    public List<DanhSachChi> getByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return chiRepository.findByDateRange(startDate, endDate);
    }

    // ========== THỐNG KÊ ==========
    
    public BigDecimal calculateTotalByLoai(String loaiChi) {
        return chiRepository.calculateTotalByLoai(loaiChi);
    }

    public BigDecimal calculateTotalByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return chiRepository.calculateTotalByDateRange(startDate, endDate);
    }

    // ========== VALIDATION ==========
    
    private void validateChi(DanhSachChi chi) {
        if (chi.getNoiDungChi() == null || chi.getNoiDungChi().trim().isEmpty()) {
            throw new IllegalArgumentException("Vui lòng nhập nội dung chi");
        }
        
        if (chi.getSoTien() == null || chi.getSoTien().doubleValue() <= 0) {
            throw new IllegalArgumentException("Số tiền phải lớn hơn 0");
        }
        
        if (chi.getLoaiChi() == null || chi.getLoaiChi().trim().isEmpty()) {
            throw new IllegalArgumentException("Vui lòng chọn loại chi");
        }
    }
}