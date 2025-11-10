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
        
        NhanKhau nhanKhau = tvh.getNhanKhau();
        
        // --- LOGIC NGHIỆP VỤ: KIỂM TRA CHƯA LÀ THÀNH VIÊN ---
        // Một người không thể là thành viên chính thức của nhiều hộ khẩu cùng lúc.
        if (thanhVienHoRepository.findByNhanKhau_Id(nhanKhau.getId()).isPresent()) {
            throw new IllegalStateException("Nhân khẩu ID: " + nhanKhau.getId() + " đã là thành viên của hộ khẩu khác.");
        }
        
        // 1. Lưu thông tin thành viên hộ khẩu mới
        ThanhVienHo savedTvh = thanhVienHoRepository.save(tvh);
        
        // 2. Cập nhật trạng thái của Nhân khẩu thành 'Thường trú'
        nhanKhau.setTinhTrang("Thường trú");
        nhanKhauRepository.save(nhanKhau);

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
        NhanKhau nhanKhau = tvh.getNhanKhau();

        // 1. Xóa bản ghi thành viên khỏi bảng liên kết
        thanhVienHoRepository.delete(tvh);

        // 2. Cập nhật trạng thái của Nhân khẩu
        // [LOGIC]: Trạng thái sẽ được chuyển thành 'Không xác định' hoặc 'Đã chuyển đi'
        if (nhanKhau != null) {
            nhanKhau.setTinhTrang("Đã chuyển đi"); // Hoặc một trạng thái khác phù hợp
            nhanKhauRepository.save(nhanKhau);
        }
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