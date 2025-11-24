package cnpm.qlnk.demo.service;

import cnpm.qlnk.demo.entity.TamTruTamVang;
import cnpm.qlnk.demo.entity.NhanKhau;
import cnpm.qlnk.demo.repository.TamTruTamVangRepository;
import cnpm.qlnk.demo.repository.NhanKhauRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class TamTruTamVangService {

    @Autowired
    private TamTruTamVangRepository tamTruTamVangRepository;

    @Autowired
    private NhanKhauRepository nhanKhauRepository;

    // ========== CRUD CƠ BẢN ==========
    
    public List<TamTruTamVang> getAll() {
        return tamTruTamVangRepository.findAll();
    }

    public Optional<TamTruTamVang> getById(Long id) {
        return tamTruTamVangRepository.findById(id);
    }

    public List<TamTruTamVang> getByLoai(String loai) {
        return tamTruTamVangRepository.findByLoai(loai);
    }

    public List<TamTruTamVang> getByNhanKhauId(Integer nhanKhauId) {
        return tamTruTamVangRepository.findByNhanKhauId(nhanKhauId);
    }

    // ========== TẠO MỚI + CẬP NHẬT TRẠNG THÁI NHÂN KHẨU ==========
    
    @Transactional
    public TamTruTamVang create(TamTruTamVang tamTruTamVang) {
        // Validation
        validateTamTruTamVang(tamTruTamVang);

        // Kiểm tra Nhân khẩu tồn tại
        if (tamTruTamVang.getNhanKhau() == null || tamTruTamVang.getNhanKhau().getId() == null) {
            throw new IllegalArgumentException("Vui lòng chọn Nhân khẩu");
        }

        Optional<NhanKhau> nhanKhauOpt = nhanKhauRepository.findById(tamTruTamVang.getNhanKhau().getId());
        if (!nhanKhauOpt.isPresent()) {
            throw new IllegalStateException("Nhân khẩu không tồn tại với ID: " + tamTruTamVang.getNhanKhau().getId());
        }

        NhanKhau nhanKhau = nhanKhauOpt.get();

        // ========== LƯU ĐĂNG KÝ TẠM TRÚ/TẠM VẮNG ==========
        TamTruTamVang saved = tamTruTamVangRepository.save(tamTruTamVang);

        // ========== TỰ ĐỘNG CẬP NHẬT TRẠNG THÁI NHÂN KHẨU ==========
        updateNhanKhauTinhTrang(nhanKhau, saved);

        System.out.println("✅ Created TamTruTamVang ID: " + saved.getId());
        System.out.println("✅ Updated NhanKhau tinhTrang: " + nhanKhau.getTinhTrang());

        return saved;
    }

    // ========== CẬP NHẬT + CẬP NHẬT TRẠNG THÁI NHÂN KHẨU ==========
    
    @Transactional
    public TamTruTamVang update(TamTruTamVang tamTruTamVang) {
        validateTamTruTamVang(tamTruTamVang);

        // Lấy Nhân khẩu
        Optional<NhanKhau> nhanKhauOpt = nhanKhauRepository.findById(tamTruTamVang.getNhanKhau().getId());
        if (!nhanKhauOpt.isPresent()) {
            throw new IllegalStateException("Nhân khẩu không tồn tại");
        }

        NhanKhau nhanKhau = nhanKhauOpt.get();

        // Lưu đăng ký
        TamTruTamVang updated = tamTruTamVangRepository.save(tamTruTamVang);

        // Cập nhật trạng thái Nhân khẩu
        updateNhanKhauTinhTrang(nhanKhau, updated);

        System.out.println("✅ Updated TamTruTamVang ID: " + updated.getId());
        System.out.println("✅ Updated NhanKhau tinhTrang: " + nhanKhau.getTinhTrang());

        return updated;
    }

    // ========== XÓA + KHÔI PHỤC TRẠNG THÁI NHÂN KHẨU ==========
    
    @Transactional
    public boolean delete(Long id) {
        Optional<TamTruTamVang> recordOpt = tamTruTamVangRepository.findById(id);
        if (!recordOpt.isPresent()) {
            return false;
        }

        TamTruTamVang record = recordOpt.get();
        NhanKhau nhanKhau = record.getNhanKhau();

        // Xóa đăng ký
        tamTruTamVangRepository.deleteById(id);

        // ========== KHÔI PHỤC TRẠNG THÁI VỀ "Thường trú" ==========
        if (nhanKhau != null) {
            // Kiểm tra xem còn đăng ký nào khác không
            List<TamTruTamVang> otherRecords = tamTruTamVangRepository.findByNhanKhauId(nhanKhau.getId());
            
            if (otherRecords.isEmpty()) {
                // Không còn đăng ký nào -> Trở về "Thường trú"
                nhanKhau.setTinhTrang("Thường trú");
                nhanKhauRepository.save(nhanKhau);
                System.out.println("✅ Restored NhanKhau tinhTrang to: Thường trú");
            } else {
                // Còn đăng ký khác -> Cập nhật theo đăng ký mới nhất
                TamTruTamVang latest = otherRecords.get(otherRecords.size() - 1);
                updateNhanKhauTinhTrang(nhanKhau, latest);
            }
        }

        return true;
    }

    // ========== HELPER: CẬP NHẬT TRẠNG THÁI NHÂN KHẨU ==========
    
    private void updateNhanKhauTinhTrang(NhanKhau nhanKhau, TamTruTamVang record) {
        String newTinhTrang;

        // Kiểm tra đăng ký đã hết hạn chưa
        boolean isActive = record.getDenNgay() == null || 
                          !record.getDenNgay().isBefore(LocalDate.now());

        if (!isActive) {
            // Đã hết hạn -> Trở về "Thường trú"
            newTinhTrang = "Thường trú";
        } else {
            // Còn hiệu lực -> Set theo loại
            if ("Tạm trú".equals(record.getLoai())) {
                newTinhTrang = "Tạm trú";
            } else if ("Tạm vắng".equals(record.getLoai())) {
                newTinhTrang = "Tạm vắng";
            } else {
                newTinhTrang = "Thường trú";
            }
        }

        // Chỉ update nếu khác trạng thái hiện tại
        if (!newTinhTrang.equals(nhanKhau.getTinhTrang())) {
            nhanKhau.setTinhTrang(newTinhTrang);
            nhanKhauRepository.save(nhanKhau);
            System.out.println("🔄 NhanKhau ID " + nhanKhau.getId() + 
                             " tinhTrang changed: " + newTinhTrang);
        }
    }

    // ========== TÌM KIẾM ==========
    
    public List<TamTruTamVang> search(String keyword) {
        return tamTruTamVangRepository.searchByKeyword(keyword);
    }

    public List<TamTruTamVang> getSapHetHan(int soNgay) {
        LocalDate ngayHienTai = LocalDate.now();
        LocalDate ngayKiemTra = ngayHienTai.plusDays(soNgay);
        return tamTruTamVangRepository.findByDenNgayBetween(ngayHienTai, ngayKiemTra);
    }

    public List<TamTruTamVang> getActive() {
        return tamTruTamVangRepository.findActive(LocalDate.now());
    }
    
    /**
     * Lọc theo loại và khoảng thời gian đăng ký
     */
    public List<TamTruTamVang> getByLoaiAndDateRange(String loai, LocalDate startDate, LocalDate endDate) {
        if (startDate != null && endDate != null) {
            return tamTruTamVangRepository.findByLoaiAndTuNgayBetween(loai, startDate, endDate);
        } else {
            return tamTruTamVangRepository.findByLoai(loai);
        }
    }

    // ========== VALIDATION ==========
    
    private void validateTamTruTamVang(TamTruTamVang tamTruTamVang) {
        if (tamTruTamVang.getLoai() == null || 
            (!tamTruTamVang.getLoai().equals("Tạm trú") && 
             !tamTruTamVang.getLoai().equals("Tạm vắng"))) {
            throw new IllegalArgumentException("Loại phải là 'Tạm trú' hoặc 'Tạm vắng'");
        }

        if (tamTruTamVang.getTuNgay() == null) {
            throw new IllegalArgumentException("Vui lòng nhập 'Từ ngày'");
        }

        if (tamTruTamVang.getDenNgay() != null && 
            tamTruTamVang.getDenNgay().isBefore(tamTruTamVang.getTuNgay())) {
            throw new IllegalArgumentException("'Đến ngày' phải sau 'Từ ngày'");
        }
    }

    // ========== TỰ ĐỘNG CẬP NHẬT TRẠNG THÁI HẾT HẠN (SCHEDULED) ==========
    
    /**
     * Chạy hàng ngày để tự động chuyển trạng thái "Tạm trú/Tạm vắng" 
     * về "Thường trú" khi hết hạn
     */
    @Transactional
    public void autoUpdateExpiredRecords() {
        LocalDate today = LocalDate.now();
        List<TamTruTamVang> expiredRecords = tamTruTamVangRepository
            .findByDenNgayBetween(today.minusDays(1), today);

        for (TamTruTamVang record : expiredRecords) {
            NhanKhau nhanKhau = record.getNhanKhau();
            if (nhanKhau != null && 
                ("Tạm trú".equals(nhanKhau.getTinhTrang()) || 
                 "Tạm vắng".equals(nhanKhau.getTinhTrang()))) {
                
                nhanKhau.setTinhTrang("Thường trú");
                nhanKhauRepository.save(nhanKhau);
                System.out.println("⏰ Auto-updated expired NhanKhau ID: " + nhanKhau.getId());
            }
        }

        System.out.println("✅ Auto-update completed: " + expiredRecords.size() + " records");
    }
}