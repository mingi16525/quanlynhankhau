package cnpm.qlnk.demo.service;

// ... imports
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import cnpm.qlnk.demo.entity.HoKhau;
import cnpm.qlnk.demo.entity.NhanKhau;
import cnpm.qlnk.demo.entity.ThanhVienHo;
import cnpm.qlnk.demo.repository.HoKhauRepository;
import cnpm.qlnk.demo.repository.NhanKhauRepository;
import cnpm.qlnk.demo.repository.ThanhVienHoRepository;
import cnpm.qlnk.demo.dto.TachHoRequest;
import cnpm.qlnk.demo.dto.UpdateHoKhauRequest;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.ArrayList;

@Service
public class HoKhauService {

    
    @Autowired 
    private HoKhauRepository hoKhauRepository;
    @Autowired
    private ThanhVienHoRepository thanhVienHoRepository;
    @Autowired
    private NhanKhauRepository nhanKhauRepository;
    @Autowired
    private GhiNhanThayDoiHoKhauService ghiNhanThayDoiService;
    
    @PersistenceContext
    private EntityManager entityManager;
    
    // 1. Lấy tất cả hộ khẩu
    //@PreAuthorize("hasAuthority('HO_KHAU:READ')")
    public List<HoKhau> getAllHoKhau() {
        return hoKhauRepository.findAll();
    }

    // 2. Lấy hộ khẩu theo ID
    //@PreAuthorize("hasAuthority('HO_KHAU:READ')")
    public Optional<HoKhau> getHoKhauById(Integer id) {
        return hoKhauRepository.findById(id);
    }

    // 3. Tạo mới hoặc Cập nhật hộ khẩu
    @Transactional
    //@PreAuthorize("hasAuthority('HO_KHAU:CREATE') or hasAuthority('HO_KHAU:UPDATE')")
    public HoKhau saveHoKhau(HoKhau hoKhau) {
        // --- LOGIC NGHIỆP VỤ: KIỂM TRA MÃ SỐ HỘ DUY NHẤT ---
        if (hoKhau.getMaSoHo() != null && !hoKhau.getMaSoHo().isEmpty()) {
            Optional<HoKhau> existingHoKhau = hoKhauRepository.findByMaSoHo(hoKhau.getMaSoHo());

            // Nếu tìm thấy mã số hộ trùng lặp VÀ không phải là bản ghi đang được cập nhật
            if (existingHoKhau.isPresent() && 
                (hoKhau.getId() == null || !hoKhau.getId().equals(existingHoKhau.get().getId()))) {
                
                throw new IllegalStateException("Mã số hộ '" + hoKhau.getMaSoHo() + "' đã tồn tại.");
            }
        }
        
        // [LOGIC NGHIỆP VỤ]: Kiểm tra Chủ hộ tồn tại
        NhanKhau chuHoInput = hoKhau.getChuHo();
        if (chuHoInput == null || chuHoInput.getId() == null) {
            throw new IllegalArgumentException("Hộ khẩu phải có Chủ hộ!");
        }
        
        // Fetch đầy đủ thông tin Chủ hộ từ database
        NhanKhau chuHo = nhanKhauRepository.findById(chuHoInput.getId())
            .orElseThrow(() -> new IllegalArgumentException("Chủ hộ với ID " + chuHoInput.getId() + " không tồn tại!"));
        
        // Lưu hộ khẩu
        HoKhau savedHoKhau = hoKhauRepository.save(hoKhau);
        
        // --- LOGIC TẠO MỚI: TỰ ĐỘNG THÊM CHỦ HỘ VÀO DANH SÁCH THÀNH VIÊN ---
        if (hoKhau.getId() == null) { // Chỉ thực hiện khi TẠO MỚI hộ khẩu
            // Kiểm tra Chủ hộ đã là thành viên của hộ khẩu khác chưa
            Optional<ThanhVienHo> existingMembership = thanhVienHoRepository.findByNhanKhau_Id(chuHo.getId());
            if (existingMembership.isPresent()) {
                // Rollback bằng cách ném exception (do @Transactional)
                throw new IllegalStateException("Chủ hộ \"" + chuHo.getHoTen() + 
                    "\" đã là thành viên của hộ khẩu khác (Mã số: " + existingMembership.get().getHoKhau().getMaSoHo() + ").");
            }
            
            // Tạo bản ghi ThanhVienHo cho Chủ hộ
            ThanhVienHo thanhVienChuHo = new ThanhVienHo();
            thanhVienChuHo.setHoKhau(savedHoKhau);
            thanhVienChuHo.setNhanKhau(chuHo);
            thanhVienChuHo.setQuanHeVoiChuHo("Chủ hộ");
            thanhVienChuHo.setGhiChu("Tự động thêm khi tạo hộ khẩu");
            
            thanhVienHoRepository.save(thanhVienChuHo);
            
            // Cập nhật trạng thái nhân khẩu (sử dụng object đã fetch đầy đủ)
            chuHo.setTinhTrang("Thường trú");
            nhanKhauRepository.save(chuHo);
            
            // Ghi nhận thay đổi
            ghiNhanThayDoiService.ghiNhanThemThanhVien(savedHoKhau, chuHo.getHoTen());
        }

        return savedHoKhau;
    }

    // 3.1. Cập nhật hộ khẩu (đặc biệt xử lý thay đổi Chủ hộ)
    @Transactional
    //@PreAuthorize("hasAuthority('HO_KHAU:UPDATE')")
    public HoKhau updateHoKhau(Integer hoKhauId, UpdateHoKhauRequest request) {
        // Kiểm tra hộ khẩu có tồn tại không
        Optional<HoKhau> existingHoKhauOpt = hoKhauRepository.findById(hoKhauId);
        if (existingHoKhauOpt.isEmpty()) {
            throw new IllegalArgumentException("Không tìm thấy hộ khẩu với ID: " + hoKhauId);
        }

        HoKhau existingHoKhau = existingHoKhauOpt.get();
        Integer oldChuHoId = existingHoKhau.getChuHo() != null ? existingHoKhau.getChuHo().getId() : null;
        Integer newChuHoId = request.getChuHoId();

        // Kiểm tra Chủ hộ mới có phải là thành viên của hộ khẩu này không
        NhanKhau chuHoMoi = null;
        if (newChuHoId != null) {
            Optional<ThanhVienHo> thanhVienOpt = thanhVienHoRepository
                .findByHoKhau_Id(hoKhauId)
                .stream()
                .filter(tv -> tv.getNhanKhau() != null && tv.getNhanKhau().getId().equals(newChuHoId))
                .findFirst();
            
            if (thanhVienOpt.isEmpty()) {
                throw new IllegalArgumentException("Chủ hộ mới phải là thành viên hiện tại của hộ khẩu này!");
            }
            
            chuHoMoi = nhanKhauRepository.findById(newChuHoId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy nhân khẩu với ID: " + newChuHoId));
        }

        // Kiểm tra mã số hộ trùng lặp
        if (request.getMaSoHo() != null && !request.getMaSoHo().isEmpty()) {
            Optional<HoKhau> duplicateHoKhau = hoKhauRepository.findByMaSoHo(request.getMaSoHo());
            if (duplicateHoKhau.isPresent() && !duplicateHoKhau.get().getId().equals(hoKhauId)) {
                throw new IllegalStateException("Mã số hộ '" + request.getMaSoHo() + "' đã tồn tại.");
            }
        }

        // Cập nhật các thông tin của hộ khẩu
        existingHoKhau.setMaSoHo(request.getMaSoHo());
        existingHoKhau.setChuHo(chuHoMoi);
        existingHoKhau.setDiaChi(request.getDiaChi());
        existingHoKhau.setNgayLap(request.getNgayLap());

        // Nếu Chủ hộ thay đổi, cập nhật quan hệ trong bảng ThanhVienHo
        if (oldChuHoId != null && newChuHoId != null && !oldChuHoId.equals(newChuHoId)) {
            // Cập nhật quan hệ của tất cả thành viên dựa trên danh sách từ request
            if (request.getThanhVienQuanHeList() != null && !request.getThanhVienQuanHeList().isEmpty()) {
                for (UpdateHoKhauRequest.ThanhVienQuanHe tvQuanHe : request.getThanhVienQuanHeList()) {
                    thanhVienHoRepository.findByHoKhau_Id(hoKhauId)
                        .stream()
                        .filter(tv -> tv.getNhanKhau() != null && tv.getNhanKhau().getId().equals(tvQuanHe.getNhanKhauId()))
                        .findFirst()
                        .ifPresent(tv -> {
                            tv.setQuanHeVoiChuHo(tvQuanHe.getQuanHeVoiChuHo());
                            thanhVienHoRepository.save(tv);
                        });
                }
            } else {
                // Nếu không có danh sách quan hệ, chỉ cập nhật chủ hộ cũ và mới
                // Cập nhật quan hệ của Chủ hộ cũ
                thanhVienHoRepository.findByHoKhau_Id(hoKhauId)
                    .stream()
                    .filter(tv -> tv.getNhanKhau() != null && tv.getNhanKhau().getId().equals(oldChuHoId))
                    .findFirst()
                    .ifPresent(tv -> {
                        tv.setQuanHeVoiChuHo("Thành viên");
                        thanhVienHoRepository.save(tv);
                    });

                // Cập nhật quan hệ của Chủ hộ mới
                thanhVienHoRepository.findByHoKhau_Id(hoKhauId)
                    .stream()
                    .filter(tv -> tv.getNhanKhau() != null && tv.getNhanKhau().getId().equals(newChuHoId))
                    .findFirst()
                    .ifPresent(tv -> {
                        tv.setQuanHeVoiChuHo("Chủ hộ");
                        thanhVienHoRepository.save(tv);
                    });
            }
        }

        HoKhau updated = hoKhauRepository.save(existingHoKhau);
        
        // Ghi nhận thay đổi
        if (oldChuHoId != null && newChuHoId != null && !oldChuHoId.equals(newChuHoId)) {
            NhanKhau chuHoCu = nhanKhauRepository.findById(oldChuHoId).orElse(null);
            String tenChuHoCu = chuHoCu != null ? chuHoCu.getHoTen() : "N/A";
            String tenChuHoMoi = chuHoMoi != null ? chuHoMoi.getHoTen() : "N/A";
            ghiNhanThayDoiService.ghiNhanDoiChuHo(updated, tenChuHoCu, tenChuHoMoi);
        } else {
            ghiNhanThayDoiService.ghiNhanThayDoiThongTin(updated, "Cập nhật thông tin hộ khẩu");
        }
        
        return updated;
    }

    // 4. Xóa hộ khẩu (Chỉ xóa khi không còn thành viên nào)
    @Transactional
    //@PreAuthorize("hasAuthority('HO_KHAU:DELETE')")
    public boolean deleteHoKhau(Integer id) {
        if (!hoKhauRepository.existsById(id)) {
            return false;
        }

        // --- LOGIC NGHIỆP VỤ: KIỂM TRA CÒN THÀNH VIÊN KHÔNG ---
        // Yêu cầu ThanhVienHoRepository có phương thức existsByHoKhau_Id(Integer id)
        if (thanhVienHoRepository.existsByHoKhau_Id(id)) {
            throw new IllegalStateException("Không thể xóa hộ khẩu. Hộ khẩu này vẫn còn thành viên.");
        }

        // 2. Tiến hành xóa
        hoKhauRepository.deleteById(id);
        return true;
    }

    // Lấy danh sách thành viên theo hộ khẩu ID
    public List<?> getThanhVienByHoKhauId(Integer hoKhauId) {
        return thanhVienHoRepository.findByHoKhau_Id(hoKhauId);
    }

    /**
     * 5. TÁCH HỘ KHẨU
     * Tạo hộ khẩu mới với các thành viên đã chọn từ hộ khẩu cũ
     * 
     * @param hoKhauCuId ID hộ khẩu cũ (hộ gốc)
     * @param request Thông tin hộ mới và danh sách thành viên
     * @return Hộ khẩu mới đã tạo
     */
    @Transactional
    //@PreAuthorize("hasAuthority('HO_KHAU:CREATE')")
    public HoKhau tachHoKhau(Integer hoKhauCuId, TachHoRequest request) {
        
        // === BƯỚC 1: KIỂM TRA HỘ KHẨU CŨ TỒN TẠI ===
        Optional<HoKhau> hoKhauCuOpt = hoKhauRepository.findById(hoKhauCuId);
        if (hoKhauCuOpt.isEmpty()) {
            throw new IllegalArgumentException("Không tìm thấy hộ khẩu gốc với ID: " + hoKhauCuId);
        }
        
        // === BƯỚC 2: KIỂM TRA MÃ SỐ HỘ MỚI KHÔNG TRÙNG ===
        if (request.getMaSoHo() == null || request.getMaSoHo().isEmpty()) {
            throw new IllegalArgumentException("Mã số hộ mới không được để trống!");
        }
        
        Optional<HoKhau> existingHoKhau = hoKhauRepository.findByMaSoHo(request.getMaSoHo());
        if (existingHoKhau.isPresent()) {
            throw new IllegalStateException("Mã số hộ '" + request.getMaSoHo() + "' đã tồn tại!");
        }
        
        // === BƯỚC 3: KIỂM TRA DANH SÁCH THÀNH VIÊN ===
        if (request.getThanhVienList() == null || request.getThanhVienList().isEmpty()) {
            throw new IllegalArgumentException("Danh sách thành viên tách hộ không được rỗng!");
        }
        
        // === BƯỚC 4: KIỂM TRA CHỦ HỘ MỚI ===
        if (request.getChuHoMoiId() == null) {
            throw new IllegalArgumentException("Phải chỉ định chủ hộ mới!");
        }
        
        // Kiểm tra chủ hộ mới phải nằm trong danh sách thành viên tách
        boolean chuHoInList = request.getThanhVienList().stream()
            .anyMatch(tv -> tv.getNhanKhauId().equals(request.getChuHoMoiId()));
        
        if (!chuHoInList) {
            throw new IllegalArgumentException("Chủ hộ mới phải nằm trong danh sách thành viên tách!");
        }
        
        // Kiểm tra nhân khẩu làm chủ hộ mới tồn tại
        Optional<NhanKhau> chuHoMoiOpt = nhanKhauRepository.findById(request.getChuHoMoiId());
        if (chuHoMoiOpt.isEmpty()) {
            throw new IllegalArgumentException("Không tìm thấy nhân khẩu với ID: " + request.getChuHoMoiId());
        }
        
        // === BƯỚC 5: KIỂM TRA TẤT CẢ THÀNH VIÊN LÀ THÀNH VIÊN CỦA HỘ CŨ ===
        List<ThanhVienHo> thanhVienHoCu = thanhVienHoRepository.findByHoKhau_Id(hoKhauCuId);
        
        for (TachHoRequest.ThanhVienMoi tvMoi : request.getThanhVienList()) {
            boolean exists = thanhVienHoCu.stream()
                .anyMatch(tv -> tv.getNhanKhau() != null 
                    && tv.getNhanKhau().getId().equals(tvMoi.getNhanKhauId()));
            
            if (!exists) {
                throw new IllegalArgumentException(
                    "Nhân khẩu ID " + tvMoi.getNhanKhauId() + " không phải thành viên của hộ khẩu cũ!"
                );
            }
        }
        
        // === BƯỚC 6: KIỂM TRA KHÔNG TÁCH HẾT THÀNH VIÊN (Hộ cũ phải còn ít nhất 1 người) ===
        int soThanhVienConLai = thanhVienHoCu.size() - request.getThanhVienList().size();
        if (soThanhVienConLai < 1) {
            throw new IllegalStateException(
                "Không thể tách hết thành viên! Hộ khẩu cũ phải còn ít nhất 1 người."
            );
        }
        
        // === BƯỚC 7: TẠO HỘ KHẨU MỚI ===
        HoKhau hoKhauMoi = new HoKhau();
        hoKhauMoi.setMaSoHo(request.getMaSoHo());
        hoKhauMoi.setDiaChi(request.getDiaChi());
        hoKhauMoi.setNgayLap(request.getNgayLap() != null ? request.getNgayLap() : LocalDate.now());
        hoKhauMoi.setChuHo(chuHoMoiOpt.get());
        
        HoKhau savedHoKhauMoi = hoKhauRepository.save(hoKhauMoi);
        
        // === BƯỚC 8: CHUYỂN CÁC THÀNH VIÊN SANG HỘ MỚI ===
        // QUAN TRỌNG: Xóa TẤT CẢ trước, sau đó flush, rồi mới INSERT
        // Vì IDNhanKhau có constraint UNIQUE, phải đảm bảo DELETE thực thi trước INSERT
        
        List<ThanhVienHo> thanhVienMoiList = new ArrayList<>();
        
        // BƯỚC 8.1: Xóa tất cả thành viên khỏi hộ cũ
        for (TachHoRequest.ThanhVienMoi tvMoi : request.getThanhVienList()) {
            Optional<ThanhVienHo> tvCuOpt = thanhVienHoCu.stream()
                .filter(tv -> tv.getNhanKhau() != null 
                    && tv.getNhanKhau().getId().equals(tvMoi.getNhanKhauId()))
                .findFirst();
            
            if (tvCuOpt.isPresent()) {
                ThanhVienHo tvCu = tvCuOpt.get();
                
                // Xóa khỏi hộ cũ
                thanhVienHoRepository.delete(tvCu);
                
                // Chuẩn bị entity mới (chưa save)
                ThanhVienHo tvMoiEntity = new ThanhVienHo();
                tvMoiEntity.setHoKhau(savedHoKhauMoi);
                tvMoiEntity.setNhanKhau(tvCu.getNhanKhau());
                
                // Nếu là chủ hộ mới thì set quan hệ là "Chủ hộ"
                if (tvMoi.getNhanKhauId().equals(request.getChuHoMoiId())) {
                    tvMoiEntity.setQuanHeVoiChuHo("Chủ hộ");
                } else {
                    tvMoiEntity.setQuanHeVoiChuHo(tvMoi.getQuanHeVoiChuHo());
                }
                
                tvMoiEntity.setGhiChu(tvMoi.getGhiChu());
                
                // Thêm vào list tạm
                thanhVienMoiList.add(tvMoiEntity);
            }
        }
        
        // BƯỚC 8.2: Flush để đảm bảo DELETE được thực thi
        entityManager.flush();
        
        // BƯỚC 8.3: Bây giờ mới INSERT vào hộ mới
        for (ThanhVienHo tvMoiEntity : thanhVienMoiList) {
            thanhVienHoRepository.save(tvMoiEntity);
        }
        
        // === BƯỚC 9: KIỂM TRA VÀ CẬP NHẬT CHỦ HỘ CŨ NẾU BỊ TÁCH ===
        HoKhau hoKhauCu = hoKhauCuOpt.get();
        Integer chuHoCuId = hoKhauCu.getChuHo() != null ? hoKhauCu.getChuHo().getId() : null;
        
        if (chuHoCuId != null) {
            // Kiểm tra chủ hộ cũ có trong danh sách tách không
            boolean chuHoCuBiTach = request.getThanhVienList().stream()
                .anyMatch(tv -> tv.getNhanKhauId().equals(chuHoCuId));
            
            if (chuHoCuBiTach) {
                // Chủ hộ cũ bị tách → Phải chọn chủ hộ mới cho hộ cũ
                // Lấy thành viên còn lại đầu tiên làm chủ hộ tạm
                List<ThanhVienHo> thanhVienConLai = thanhVienHoRepository.findByHoKhau_Id(hoKhauCuId);
                
                if (!thanhVienConLai.isEmpty()) {
                    ThanhVienHo chuHoMoiCuaHoCu = thanhVienConLai.get(0);
                    hoKhauCu.setChuHo(chuHoMoiCuaHoCu.getNhanKhau());
                    
                    // Cập nhật quan hệ
                    chuHoMoiCuaHoCu.setQuanHeVoiChuHo("Chủ hộ");
                    thanhVienHoRepository.save(chuHoMoiCuaHoCu);
                    
                    hoKhauRepository.save(hoKhauCu);
                }
            }
        }
        
        // Ghi nhận thay đổi
        ghiNhanThayDoiService.ghiNhanTachHo(hoKhauCu, savedHoKhauMoi, request.getThanhVienList().size());
        
        return savedHoKhauMoi;
    }
    
}