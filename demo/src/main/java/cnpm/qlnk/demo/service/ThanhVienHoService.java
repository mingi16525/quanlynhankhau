package cnpm.qlnk.demo.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import cnpm.qlnk.demo.entity.NhanKhau;
import cnpm.qlnk.demo.entity.ThanhVienHo;
import cnpm.qlnk.demo.repository.NhanKhauRepository;
import cnpm.qlnk.demo.repository.ThanhVienHoRepository;
import java.util.Optional;

@Service
public class ThanhVienHoService {

    @Autowired
    private ThanhVienHoRepository thanhVienHoRepository;

    @Autowired
    private NhanKhauRepository nhanKhauRepository;

    @Autowired
    private GhiNhanThayDoiHoKhauService ghiNhanThayDoiService;

    // Lấy thông tin thành viên (có thể cần cho logic khác)
    public Optional<ThanhVienHo> getThanhVienHoById(Integer id) {
        return thanhVienHoRepository.findById(id);
    }

    /**
     * Thêm một nhân khẩu vào hộ khẩu.
     */
    @Transactional
    //@PreAuthorize("hasAuthority('HO_KHAU:UPDATE')")
    public ThanhVienHo addThanhVien(ThanhVienHo tvh) {
        
        Integer hoKhauId = tvh.getHoKhau().getId();
        Integer nhanKhauId = tvh.getNhanKhau().getId();
        
        // --- LOGIC NGHIỆP VỤ 1: KIỂM TRA TRÙNG LẶP TRONG CÙNG HỘ KHẨU ---
        if (thanhVienHoRepository.existsByHoKhau_IdAndNhanKhau_Id(hoKhauId, nhanKhauId)) {
            throw new IllegalStateException("Nhân khẩu này đã là thành viên của hộ khẩu này rồi!");
        }
        
        // --- LOGIC NGHIỆP VỤ 2: KIỂM TRA ĐÃ LÀ THÀNH VIÊN CỦA HỘ KHÁC ---
        // Một người không thể là thành viên chính thức của nhiều hộ khẩu cùng lúc.
        Optional<ThanhVienHo> existingMembership = thanhVienHoRepository.findByNhanKhau_Id(nhanKhauId);
        if (existingMembership.isPresent()) {
            ThanhVienHo existing = existingMembership.get();
            throw new IllegalStateException("Nhân khẩu này đã là thành viên của hộ khẩu khác (Mã số: " + 
                existing.getHoKhau().getMaSoHo() + ").");
        }
        
        // Fetch đầy đủ thông tin nhân khẩu từ database
        NhanKhau nhanKhau = nhanKhauRepository.findById(nhanKhauId)
            .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy nhân khẩu với ID: " + nhanKhauId));
        
        // 1. Lưu thông tin thành viên hộ khẩu mới
        ThanhVienHo savedTvh = thanhVienHoRepository.save(tvh);
        
        // 2. Cập nhật trạng thái của Nhân khẩu thành 'Thường trú'
        nhanKhau.setTinhTrang("Thường trú");
        nhanKhauRepository.save(nhanKhau);
        
        // 3. Ghi nhận thay đổi
        ghiNhanThayDoiService.ghiNhanThemThanhVien(tvh.getHoKhau(), nhanKhau.getHoTen());

        return savedTvh;
    }

    /**
     * Xóa thành viên khỏi hộ khẩu.
     */
    @Transactional
    //@PreAuthorize("hasAuthority('HO_KHAU:UPDATE')")
    public void removeThanhVien(Integer tvhId) {
        
        Optional<ThanhVienHo> optionalTvh = thanhVienHoRepository.findById(tvhId);
        
        if (optionalTvh.isEmpty()) {
            throw new IllegalArgumentException("Không tìm thấy thông tin thành viên hộ khẩu để xóa.");
        }

        ThanhVienHo tvh = optionalTvh.get();
        Integer nhanKhauId = tvh.getNhanKhau().getId();
        Integer chuHoId = tvh.getHoKhau().getChuHo().getId();
        
        // Kiểm tra không được xóa Chủ hộ
        if (nhanKhauId.equals(chuHoId)) {
            throw new IllegalStateException("Không thể xóa Chủ hộ! Vui lòng chuyển quyền Chủ hộ trước.");
        }
        
        // Fetch đầy đủ thông tin nhân khẩu từ database
        NhanKhau nhanKhau = nhanKhauRepository.findById(nhanKhauId)
            .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy nhân khẩu với ID: " + nhanKhauId));

        // Lưu tên để ghi log (trước khi xóa)
        String tenNhanKhau = nhanKhau.getHoTen();
        
        // 1. Xóa bản ghi thành viên khỏi bảng liên kết
        thanhVienHoRepository.delete(tvh);

        // 2. Cập nhật trạng thái của Nhân khẩu
        nhanKhau.setTinhTrang("Đã chuyển đi");
        nhanKhauRepository.save(nhanKhau);
        
        // 3. Ghi nhận thay đổi
        ghiNhanThayDoiService.ghiNhanXoaThanhVien(tvh.getHoKhau(), tenNhanKhau);
    }

    /**
     * Cập nhật thông tin thành viên hộ khẩu.
     */
    @Transactional
    //@PreAuthorize("hasAuthority('HO_KHAU:UPDATE')")
    public ThanhVienHo updateThanhVien(Integer tvhId, ThanhVienHo tvh)
    {
        Optional<ThanhVienHo> optionalTvh = thanhVienHoRepository.findById(tvhId);
        
        if (optionalTvh.isEmpty()) {
            throw new IllegalArgumentException("Không tìm thấy thông tin thành viên hộ khẩu để cập nhật.");
        }

        ThanhVienHo existingTvh = optionalTvh.get();

        // Cập nhật các trường cần thiết
        existingTvh.setQuanHeVoiChuHo(tvh.getQuanHeVoiChuHo());
        existingTvh.setGhiChu(tvh.getGhiChu());
        // Cập nhật các trường khác nếu cần

        return thanhVienHoRepository.save(existingTvh);
    }
}