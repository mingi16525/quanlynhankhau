package cnpm.qlnk.demo.service;

// ... imports
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import cnpm.qlnk.demo.entity.HoKhau;
import cnpm.qlnk.demo.repository.HoKhauRepository;
import cnpm.qlnk.demo.repository.ThanhVienHoRepository;

import java.util.List;
import java.util.Optional;

@Service
public class HoKhauService {

    
    @Autowired 
    private HoKhauRepository hoKhauRepository;
    @Autowired
    private ThanhVienHoRepository thanhVienHoRepository;
    
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
        
        // [LOGIC NGHIỆP VỤ KHÁC]: Cần đảm bảo IDChuHo là hợp lệ và tồn tại.

        return hoKhauRepository.save(hoKhau);
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
    
}