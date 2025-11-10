package cnpm.qlnk.demo.service;

import cnpm.qlnk.demo.entity.ThuThienNguyen;
import cnpm.qlnk.demo.repository.ThuThienNguyenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ThuThienNguyenService {

    @Autowired
    private ThuThienNguyenRepository thuRepository;

    // ========== CRUD CƠ BẢN ==========
    
    public List<ThuThienNguyen> getAll() {
        return thuRepository.findAll();
    }

    public Optional<ThuThienNguyen> getById(Integer id) {
        return thuRepository.findById(id);
    }

    public List<ThuThienNguyen> getByHoatDong(Integer hoatDongId) {
        return thuRepository.findByHoatDongId(hoatDongId);
    }

    // ========== TẠO MỚI ==========
    
    @Transactional
    public ThuThienNguyen create(ThuThienNguyen thu) {
        validateThu(thu);
        
        if (thu.getNgayThu() == null) {
            thu.setNgayThu(LocalDateTime.now());
        }

        ThuThienNguyen saved = thuRepository.save(thu);
        System.out.println("✅ Created Thu ID: " + saved.getId() + " - Số tiền: " + saved.getSoTien());
        
        return saved;
    }

    // ========== CẬP NHẬT ==========
    
    @Transactional
    public ThuThienNguyen update(ThuThienNguyen thu) {
        validateThu(thu);
        
        ThuThienNguyen updated = thuRepository.save(thu);
        System.out.println("✅ Updated Thu ID: " + updated.getId());
        
        return updated;
    }

    // ========== XÓA ==========
    
    @Transactional
    public boolean delete(Integer id) {
        if (!thuRepository.existsById(id)) {
            return false;
        }
        
        thuRepository.deleteById(id);
        System.out.println("✅ Deleted Thu ID: " + id);
        
        return true;
    }

    // ========== TÌM KIẾM ==========
    
    public List<ThuThienNguyen> search(String keyword) {
        return thuRepository.searchByNguoiDong(keyword);
    }

    public List<ThuThienNguyen> getByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return thuRepository.findByDateRange(startDate, endDate);
    }

    // ========== THỐNG KÊ ==========
    
    public BigDecimal calculateTotalByHoatDong(Integer hoatDongId) {
        return thuRepository.calculateTotalByHoatDong(hoatDongId);
    }

    public Long countByHoatDong(Integer hoatDongId) {
        return thuRepository.countByHoatDong(hoatDongId);
    }

    // ========== VALIDATION ==========
    
    private void validateThu(ThuThienNguyen thu) {
        if (thu.getHoatDong() == null || thu.getHoatDong().getId() == null) {
            throw new IllegalArgumentException("Vui lòng chọn hoạt động");
        }
        
        if (thu.getSoTien() == null || thu.getSoTien().doubleValue() <= 0) {
            throw new IllegalArgumentException("Số tiền phải lớn hơn 0");
        }
    }
}