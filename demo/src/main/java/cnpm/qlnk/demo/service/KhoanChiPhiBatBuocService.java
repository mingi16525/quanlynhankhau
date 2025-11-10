package cnpm.qlnk.demo.service;

import cnpm.qlnk.demo.entity.KhoanChiPhiBatBuoc;
import cnpm.qlnk.demo.repository.KhoanChiPhiBatBuocRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class KhoanChiPhiBatBuocService {

    @Autowired
    private KhoanChiPhiBatBuocRepository khoanPhiRepository;

    // ========== CRUD CƠ BẢN ==========
    
    public List<KhoanChiPhiBatBuoc> getAll() {
        return khoanPhiRepository.findAll();
    }

    public Optional<KhoanChiPhiBatBuoc> getById(Long id) {
        return khoanPhiRepository.findById(id);
    }

    public List<KhoanChiPhiBatBuoc> getActiveKhoanPhi() {
        return khoanPhiRepository.findActiveKhoanPhi();
    }

    public List<KhoanChiPhiBatBuoc> getByLoai(String loaiKhoanPhi) {
        return khoanPhiRepository.findByLoaiKhoanPhi(loaiKhoanPhi);
    }

    // ========== TẠO MỚI ==========
    
    @Transactional
    public KhoanChiPhiBatBuoc create(KhoanChiPhiBatBuoc khoanPhi) {
        validateKhoanPhi(khoanPhi);
        
        // Kiểm tra trùng tên
        if (khoanPhiRepository.existsByTenKhoanPhi(khoanPhi.getTenKhoanPhi())) {
            throw new IllegalArgumentException("Khoản phí '" + khoanPhi.getTenKhoanPhi() + "' đã tồn tại");
        }

        if (khoanPhi.getTrangThai() == null) {
            khoanPhi.setTrangThai("Đang áp dụng");
        }

        KhoanChiPhiBatBuoc saved = khoanPhiRepository.save(khoanPhi);
        System.out.println("✅ Created KhoanPhi ID: " + saved.getId());
        
        return saved;
    }

    // ========== CẬP NHẬT ==========
    
    @Transactional
    public KhoanChiPhiBatBuoc update(KhoanChiPhiBatBuoc khoanPhi) {
        validateKhoanPhi(khoanPhi);
        
        Optional<KhoanChiPhiBatBuoc> existingOpt = khoanPhiRepository.findById(khoanPhi.getId());
        if (!existingOpt.isPresent()) {
            throw new IllegalStateException("Khoản phí không tồn tại");
        }

        KhoanChiPhiBatBuoc updated = khoanPhiRepository.save(khoanPhi);
        System.out.println("✅ Updated KhoanPhi ID: " + updated.getId());
        
        return updated;
    }

    // ========== XÓA ==========
    
    @Transactional
    public boolean delete(Long id) {
        if (!khoanPhiRepository.existsById(id)) {
            return false;
        }
        
        khoanPhiRepository.deleteById(id);
        System.out.println("✅ Deleted KhoanPhi ID: " + id);
        
        return true;
    }

    // ========== TÌM KIẾM ==========
    
    public List<KhoanChiPhiBatBuoc> search(String keyword) {
        return khoanPhiRepository.searchByTenKhoanPhi(keyword);
    }

    // ========== VALIDATION ==========
    
    private void validateKhoanPhi(KhoanChiPhiBatBuoc khoanPhi) {
        if (khoanPhi.getTenKhoanPhi() == null || khoanPhi.getTenKhoanPhi().trim().isEmpty()) {
            throw new IllegalArgumentException("Vui lòng nhập tên khoản phí");
        }

        if (khoanPhi.getSoTienMoiHo() == null || khoanPhi.getSoTienMoiHo().doubleValue() <= 0) {
            throw new IllegalArgumentException("Số tiền mỗi hộ phải lớn hơn 0");
        }
        
        if (khoanPhi.getLoaiKhoanPhi() == null || khoanPhi.getLoaiKhoanPhi().trim().isEmpty()) {
            throw new IllegalArgumentException("Vui lòng chọn loại khoản phí");
        }
    }
}