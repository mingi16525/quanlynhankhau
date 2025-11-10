package cnpm.qlnk.demo.service;

import cnpm.qlnk.demo.entity.DanhSachThuPhi;
import cnpm.qlnk.demo.entity.HoKhau;
import cnpm.qlnk.demo.entity.KhoanChiPhiBatBuoc;
import cnpm.qlnk.demo.repository.DanhSachThuPhiRepository;
import cnpm.qlnk.demo.repository.HoKhauRepository;
import cnpm.qlnk.demo.repository.KhoanChiPhiBatBuocRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class DanhSachThuPhiService {

    @Autowired
    private DanhSachThuPhiRepository thuPhiRepository;

    @Autowired
    private HoKhauRepository hoKhauRepository;

    @Autowired
    private KhoanChiPhiBatBuocRepository khoanPhiRepository;

    // ========== CRUD CƠ BẢN ==========
    
    public List<DanhSachThuPhi> getAll() {
        return thuPhiRepository.findAll();
    }

    public Optional<DanhSachThuPhi> getById(Long id) {
        return thuPhiRepository.findById(id);
    }

    public List<DanhSachThuPhi> getByHoKhau(Integer hoKhauId) {
        return thuPhiRepository.findByHoKhauId(hoKhauId);
    }

    public List<DanhSachThuPhi> getByKhoanPhi(Long khoanPhiId) {
        return thuPhiRepository.findByKhoanPhiId(khoanPhiId);
    }

    public List<DanhSachThuPhi> getByTrangThai(String trangThai) {
        return thuPhiRepository.findByTrangThaiThanhToan(trangThai);
    }

    // ========== PHƯƠNG THỨC LẤY HỘ CHƯA ĐÓNG ==========
    
    public List<DanhSachThuPhi> getHoChuaDong(Long khoanPhiId) {
        System.out.println("📋 Lấy danh sách hộ chưa đóng cho khoản phí ID: " + khoanPhiId);
        List<DanhSachThuPhi> list = thuPhiRepository.findChuaDongByKhoanPhiId(khoanPhiId);
        System.out.println("✅ Tìm thấy " + list.size() + " hộ chưa đóng");
        return list;
    }

    public List<DanhSachThuPhi> getHoDaDong(Long khoanPhiId) {
        System.out.println("📋 Lấy danh sách hộ đã đóng cho khoản phí ID: " + khoanPhiId);
        List<DanhSachThuPhi> list = thuPhiRepository.findDaDongByKhoanPhiId(khoanPhiId);
        System.out.println("✅ Tìm thấy " + list.size() + " hộ đã đóng");
        return list;
    }

    public Map<String, Object> getThongKeKhoanPhi(Long khoanPhiId) {
        System.out.println("📊 Lấy thống kê khoản phí ID: " + khoanPhiId);
        
        Map<String, Object> stats = new HashMap<>();
        
        Long soDaDong = thuPhiRepository.countDaDongByKhoanPhi(khoanPhiId);
        Long soChuaDong = thuPhiRepository.countChuaDongByKhoanPhi(khoanPhiId);
        BigDecimal tongDaThu = thuPhiRepository.calculateTotalCollectedByKhoanPhi(khoanPhiId);
        BigDecimal tongChuaThu = thuPhiRepository.calculateTotalPendingByKhoanPhi(khoanPhiId);
        
        stats.put("soHoDaDong", soDaDong);
        stats.put("soHoChuaDong", soChuaDong);
        stats.put("tongSoHo", soDaDong + soChuaDong);
        stats.put("tongTienDaThu", tongDaThu);
        stats.put("tongTienChuaThu", tongChuaThu);
        stats.put("tongTien", tongDaThu.add(tongChuaThu));
        stats.put("tiLeDaDong", (soDaDong + soChuaDong) > 0 
            ? (soDaDong * 100.0 / (soDaDong + soChuaDong)) : 0);
        
        System.out.println("✅ Thống kê: " + stats);
        
        return stats;
    }

    // ========== ✅ TẠO DANH SÁCH THU MỚI - TÍNH TIỀN THEO HỘ ==========
    
    /**
     * Tạo danh sách thu cho TẤT CẢ hộ khẩu dựa trên một khoản phí
     * ✅ LOGIC MỚI: Mỗi hộ đóng CÙNG 1 SỐ TIỀN (không phụ thuộc số người)
     */
    @Transactional
    public Map<String, Object> createThuPhiChoTatCaHo(Long khoanPhiId) {
        System.out.println("📝 Tạo danh sách thu cho tất cả hộ - Khoản phí ID: " + khoanPhiId);
        
        // Lấy khoản phí
        Optional<KhoanChiPhiBatBuoc> khoanPhiOpt = khoanPhiRepository.findById(khoanPhiId);
        if (!khoanPhiOpt.isPresent()) {
            throw new IllegalStateException("Khoản phí không tồn tại với ID: " + khoanPhiId);
        }
        
        KhoanChiPhiBatBuoc khoanPhi = khoanPhiOpt.get();
        
        // ✅ SỐ TIỀN CỐ ĐỊNH CHO MỖI HỘ
        BigDecimal soTienMoiHo = khoanPhi.getSoTienMoiHo();
        System.out.println("💰 Số tiền mỗi hộ: " + soTienMoiHo);
        
        // Lấy TẤT CẢ hộ khẩu
        List<HoKhau> allHoKhau = hoKhauRepository.findAll();
        System.out.println("📋 Tổng số hộ: " + allHoKhau.size());
        
        List<DanhSachThuPhi> created = new ArrayList<>();
        List<String> skipped = new ArrayList<>();
        
        for (HoKhau hoKhau : allHoKhau) {
            // Kiểm tra đã tạo chưa
            boolean exists = thuPhiRepository.existsByHoKhauAndKhoanPhi(hoKhau.getId(), khoanPhiId);
            
            if (exists) {
                skipped.add("Hộ " + hoKhau.getChuHo().getHoTen() + " đã có khoản phí này");
                continue;
            }
            
            // ✅ TÍNH TIỀN: MỖI HỘ ĐÓNG CÙNG 1 SỐ TIỀN
            // Không cần tính theo số nhân khẩu nữa
            
            // Tạo khoản thu mới
            DanhSachThuPhi thuPhi = new DanhSachThuPhi();
            thuPhi.setHoKhau(hoKhau);
            thuPhi.setKhoanPhi(khoanPhi);
            thuPhi.setSoTien(soTienMoiHo); // ✅ Số tiền cố định
            thuPhi.setTrangThaiThanhToan("Chưa đóng");
            
            DanhSachThuPhi saved = thuPhiRepository.save(thuPhi);
            created.add(saved);
            
            System.out.println("✅ Tạo khoản thu cho hộ: " + hoKhau.getChuHo().getHoTen() + 
                             " - Số tiền: " + soTienMoiHo);
        }
        
        System.out.println("✅ Đã tạo: " + created.size() + " khoản thu");
        System.out.println("⚠️ Đã bỏ qua: " + skipped.size() + " hộ");
        
        Map<String, Object> result = new HashMap<>();
        result.put("success", created.size());
        result.put("skipped", skipped.size());
        result.put("soTienMoiHo", soTienMoiHo);
        result.put("tongTienDuKien", soTienMoiHo.multiply(BigDecimal.valueOf(created.size())));
        result.put("details", skipped);
        
        return result;
    }

    // ========== TẠO KHOẢN THU CHO 1 HỘ ==========
    
    @Transactional
    public DanhSachThuPhi create(DanhSachThuPhi thuPhi) {
        validateThuPhi(thuPhi);
        
        // Kiểm tra đã tồn tại chưa
        boolean exists = thuPhiRepository.existsByHoKhauAndKhoanPhi(
            thuPhi.getHoKhau().getId(), 
            thuPhi.getKhoanPhi().getId()
        );
        
        if (exists) {
            throw new IllegalStateException("Hộ này đã có khoản phí này rồi");
        }
        
        // ✅ NẾU KHÔNG TRUYỀN SỐ TIỀN, TỰ ĐỘNG LẤY TỪ KHOẢN PHÍ
        if (thuPhi.getSoTien() == null) {
            Optional<KhoanChiPhiBatBuoc> khoanPhiOpt = khoanPhiRepository.findById(thuPhi.getKhoanPhi().getId());
            if (khoanPhiOpt.isPresent()) {
                thuPhi.setSoTien(khoanPhiOpt.get().getSoTienMoiHo());
                System.out.println("✅ Tự động set số tiền: " + thuPhi.getSoTien());
            }
        }
        
        if (thuPhi.getTrangThaiThanhToan() == null) {
            thuPhi.setTrangThaiThanhToan("Chưa đóng");
        }
        
        DanhSachThuPhi saved = thuPhiRepository.save(thuPhi);
        System.out.println("✅ Created ThuPhi ID: " + saved.getId() + " - Số tiền: " + saved.getSoTien());
        
        return saved;
    }

    // ========== CẬP NHẬT TRẠNG THÁI THANH TOÁN ==========
    
    @Transactional
    public DanhSachThuPhi updateTrangThai(Long id, String trangThai) {
        Optional<DanhSachThuPhi> thuPhiOpt = thuPhiRepository.findById(id);
        if (!thuPhiOpt.isPresent()) {
            throw new IllegalStateException("Khoản thu không tồn tại");
        }
        
        DanhSachThuPhi thuPhi = thuPhiOpt.get();
        thuPhi.setTrangThaiThanhToan(trangThai);
        
        if ("Đã đóng".equals(trangThai) && thuPhi.getNgayThanhToan() == null) {
            thuPhi.setNgayThanhToan(LocalDateTime.now());
        }
        
        DanhSachThuPhi updated = thuPhiRepository.save(thuPhi);
        System.out.println("✅ Updated ThuPhi ID: " + id + " → Trạng thái: " + trangThai);
        
        return updated;
    }

    // ========== CẬP NHẬT ==========
    
    @Transactional
    public DanhSachThuPhi update(DanhSachThuPhi thuPhi) {
        validateThuPhi(thuPhi);
        
        DanhSachThuPhi updated = thuPhiRepository.save(thuPhi);
        System.out.println("✅ Updated ThuPhi ID: " + updated.getId());
        
        return updated;
    }

    // ========== XÓA ==========
    
    @Transactional
    public boolean delete(Long id) {
        if (!thuPhiRepository.existsById(id)) {
            return false;
        }
        
        thuPhiRepository.deleteById(id);
        System.out.println("✅ Deleted ThuPhi ID: " + id);
        
        return true;
    }

    // ========== TÌM KIẾM ==========
    
    public List<DanhSachThuPhi> search(String keyword) {
        return thuPhiRepository.searchByKeyword(keyword);
    }

    public List<DanhSachThuPhi> getByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return thuPhiRepository.findByDateRange(startDate, endDate);
    }

    // ========== VALIDATION ==========
    
    private void validateThuPhi(DanhSachThuPhi thuPhi) {
        if (thuPhi.getHoKhau() == null || thuPhi.getHoKhau().getId() == null) {
            throw new IllegalArgumentException("Vui lòng chọn Hộ khẩu");
        }
        
        if (thuPhi.getKhoanPhi() == null || thuPhi.getKhoanPhi().getId() == null) {
            throw new IllegalArgumentException("Vui lòng chọn Khoản phí");
        }
        
        // ✅ CHỈ VALIDATE NẾU ĐÃ CÓ SỐ TIỀN
        if (thuPhi.getSoTien() != null && thuPhi.getSoTien().doubleValue() <= 0) {
            throw new IllegalArgumentException("Số tiền phải lớn hơn 0");
        }
    }
}