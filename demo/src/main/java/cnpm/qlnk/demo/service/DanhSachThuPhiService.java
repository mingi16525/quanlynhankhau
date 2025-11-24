package cnpm.qlnk.demo.service;

import cnpm.qlnk.demo.entity.DanhSachThuPhi;
import cnpm.qlnk.demo.entity.HoKhau;
import cnpm.qlnk.demo.entity.KhoanChiPhiBatBuoc;
import cnpm.qlnk.demo.repository.DanhSachThuPhiRepository;
import cnpm.qlnk.demo.repository.HoKhauRepository;
import cnpm.qlnk.demo.repository.KhoanChiPhiBatBuocRepository;
import cnpm.qlnk.demo.repository.ThanhVienHoRepository;
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
    
    @Autowired
    private ThanhVienHoRepository thanhVienHoRepository;

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

    // ========== ✅ TẠO DANH SÁCH THU MỚI - LOGIC MỚI ==========
    
    /**
     * Tạo danh sách thu cho TẤT CẢ hộ khẩu dựa trên một khoản phí
     * LOGIC TÍNH TIỀN:
     * - "Theo hộ": Mỗi hộ đóng SỐ TIỀN CỐ ĐỊNH (soTienMoiHo)
     * - "Theo số thành viên hộ": Số tiền = soTienMoiHo × số thành viên
     * - "Tự nguyện": Mặc định = 0, kế toán tự điền sau
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
        String loaiKhoanPhi = khoanPhi.getLoaiKhoanPhi();
        BigDecimal donGia = khoanPhi.getSoTienMoiHo();
        
        System.out.println("💰 Loại khoản phí: " + loaiKhoanPhi + " - Đơn giá: " + donGia);
        
        // Lấy TẤT CẢ hộ khẩu
        List<HoKhau> allHoKhau = hoKhauRepository.findAll();
        System.out.println("📋 Tổng số hộ: " + allHoKhau.size());
        
        List<DanhSachThuPhi> created = new ArrayList<>();
        List<String> skipped = new ArrayList<>();
        BigDecimal tongTien = BigDecimal.ZERO;
        
        for (HoKhau hoKhau : allHoKhau) {
            // Kiểm tra đã tạo chưa
            boolean exists = thuPhiRepository.existsByHoKhauAndKhoanPhi(hoKhau.getId(), khoanPhiId);
            
            if (exists) {
                skipped.add("Hộ " + hoKhau.getChuHo().getHoTen() + " đã có khoản phí này");
                continue;
            }
            
            // ✅ TÍNH TIỀN THEO LOẠI KHOẢN PHÍ
            BigDecimal soTien;
            
            switch (loaiKhoanPhi) {
                case "Theo hộ":
                    // Số tiền cố định cho mỗi hộ
                    soTien = donGia;
                    System.out.println("  → Theo hộ: " + soTien);
                    break;
                    
                case "Theo số thành viên hộ":
                    // Số tiền = đơn giá × số thành viên
                    int soThanhVien = thanhVienHoRepository.findByHoKhau_Id(hoKhau.getId()).size();
                    soTien = donGia.multiply(BigDecimal.valueOf(soThanhVien));
                    System.out.println("  → Theo SV - Hộ ID: " + hoKhau.getId() + 
                                     ", Số thành viên: " + soThanhVien + 
                                     ", Đơn giá: " + donGia + 
                                     ", Tổng: " + soTien);
                    break;
                    
                case "Tự nguyện":
                    // Mặc định = 0, kế toán sẽ điền sau
                    soTien = BigDecimal.ZERO;
                    System.out.println("  → Tự nguyện: Mặc định 0");
                    break;
                    
                default:
                    // Fallback: dùng đơn giá
                    soTien = donGia;
                    System.out.println("  → Mặc định: " + soTien);
            }
            
            // Tạo khoản thu mới
            DanhSachThuPhi thuPhi = new DanhSachThuPhi();
            thuPhi.setHoKhau(hoKhau);
            thuPhi.setKhoanPhi(khoanPhi);
            thuPhi.setSoTien(soTien);
            thuPhi.setTrangThaiThanhToan("Chưa đóng");
            
            DanhSachThuPhi saved = thuPhiRepository.save(thuPhi);
            created.add(saved);
            tongTien = tongTien.add(soTien);
            
            System.out.println("✅ Tạo khoản thu cho hộ: " + hoKhau.getChuHo().getHoTen() + 
                             " - Số tiền: " + soTien);
        }
        
        System.out.println("✅ Đã tạo: " + created.size() + " khoản thu");
        System.out.println("⚠️ Đã bỏ qua: " + skipped.size() + " hộ");
        System.out.println("💰 Tổng tiền dự kiến: " + tongTien);
        
        Map<String, Object> result = new HashMap<>();
        result.put("success", created.size());
        result.put("skipped", skipped.size());
        result.put("loaiKhoanPhi", loaiKhoanPhi);
        result.put("donGia", donGia);
        result.put("tongTienDuKien", tongTien);
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
        
        // ✅ NẾU KHÔNG TRUYỀN SỐ TIỀN, TỰ ĐỘNG TÍNH THEO LOẠI KHOẢN PHÍ
        if (thuPhi.getSoTien() == null) {
            Optional<KhoanChiPhiBatBuoc> khoanPhiOpt = khoanPhiRepository.findById(thuPhi.getKhoanPhi().getId());
            if (khoanPhiOpt.isPresent()) {
                KhoanChiPhiBatBuoc khoanPhi = khoanPhiOpt.get();
                BigDecimal soTien = calculateSoTien(khoanPhi, thuPhi.getHoKhau());
                thuPhi.setSoTien(soTien);
                System.out.println("✅ Tự động tính số tiền: " + soTien);
            }
        }
        
        if (thuPhi.getTrangThaiThanhToan() == null) {
            thuPhi.setTrangThaiThanhToan("Chưa đóng");
        }
        
        DanhSachThuPhi saved = thuPhiRepository.save(thuPhi);
        System.out.println("✅ Created ThuPhi ID: " + saved.getId() + " - Số tiền: " + saved.getSoTien());
        
        return saved;
    }
    
    // ========== HELPER: TÍNH SỐ TIỀN THEO LOẠI KHOẢN PHÍ ==========
    
    private BigDecimal calculateSoTien(KhoanChiPhiBatBuoc khoanPhi, HoKhau hoKhau) {
        String loaiKhoanPhi = khoanPhi.getLoaiKhoanPhi();
        BigDecimal donGia = khoanPhi.getSoTienMoiHo();
        
        switch (loaiKhoanPhi) {
            case "Theo hộ":
                return donGia;
                
            case "Theo số thành viên hộ":
                int soThanhVien = thanhVienHoRepository.findByHoKhau_Id(hoKhau.getId()).size();
                return donGia.multiply(BigDecimal.valueOf(soThanhVien));
                
            case "Tự nguyện":
                return BigDecimal.ZERO;
                
            default:
                return donGia;
        }
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
        
        // ✅ CHỈ VALIDATE NẾU ĐÃ CÓ SỐ TIỀN VÀ KHÔNG PHẢI TỰ NGUYỆN
        // Với Tự nguyện, cho phép số tiền = 0
        if (thuPhi.getSoTien() != null && thuPhi.getSoTien().doubleValue() < 0) {
            throw new IllegalArgumentException("Số tiền không được âm");
        }
    }
}