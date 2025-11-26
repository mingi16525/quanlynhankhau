package cnpm.qlnk.demo.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;

import cnpm.qlnk.demo.entity.HoKhau;
import cnpm.qlnk.demo.entity.NhanKhau;
import cnpm.qlnk.demo.repository.HoKhauRepository;
import cnpm.qlnk.demo.repository.NhanKhauRepository;

import java.util.List;
import java.util.Optional;

@Service
public class NhanKhauService {
    
    @Autowired
    private NhanKhauRepository nhanKhauRepository;

    @Autowired
    private HoKhauRepository hoKhauRepository; // Dùng để kiểm tra logic nghiệp vụ

    // 1. Lấy tất cả hồ sơ nhân khẩu
    public List<NhanKhau> getAllNhanKhau() {
        return nhanKhauRepository.findAll();
    }

    // 2. Lấy hồ sơ theo ID
    public Optional<NhanKhau> getNhanKhauById(Integer id) {
        return nhanKhauRepository.findById(id);
    }
    // 3. Tạo mới/Cập nhật hồ sơ
    @Transactional
    public NhanKhau saveNhanKhau(NhanKhau nhanKhau) {
        // --- LOGIC NGHIỆP VỤ: KIỂM TRA TRÙNG LẶP CCCD ---
        if (nhanKhau.getSoCCCD() != null && !nhanKhau.getSoCCCD().isEmpty()) {
            NhanKhau existingNhanKhau = nhanKhauRepository.findBySoCCCD(nhanKhau.getSoCCCD());

            // Kiểm tra: Nếu tìm thấy người có cùng CCCD, và ID của người đó KHÔNG phải là ID đang được cập nhật
            // (Tức là đang cố tạo mới hoặc cập nhật ID khác)
            if (existingNhanKhau != null && 
                (nhanKhau.getId() == null || !nhanKhau.getId().equals(existingNhanKhau.getId()))) {
                
                throw new IllegalStateException("Số CCCD đã tồn tại trong hệ thống. Vui lòng kiểm tra lại.");
            }
        }

        // Nếu hợp lệ, tiến hành lưu/cập nhật
        return nhanKhauRepository.save(nhanKhau);
    }
    
    // 4. Xóa hồ sơ
    @Transactional
    public boolean deleteNhanKhau(Integer id) {
        System.out.println("Service: Attempting to delete ID " + id);
        
        // 1. Kiểm tra tồn tại
        Optional<NhanKhau> nhanKhauOpt = nhanKhauRepository.findById(id);
        
        if (!nhanKhauOpt.isPresent()) {
            System.err.println("Service: Not found ID " + id);
            return false;
        }
        
        // 2. Kiểm tra có phải là Chủ hộ không
        try {
            boolean isChuHo = nhanKhauRepository.isChuHo(id);
            if (isChuHo) {
                System.err.println("Service: Cannot delete - ID " + id + " is Chủ hộ");
                throw new IllegalStateException(
                    "Không thể xóa nhân khẩu này vì đang là Chủ hộ. " +
                    "Vui lòng chuyển quyền Chủ hộ hoặc xóa hộ khẩu trước!"
                );
            }
        } catch (Exception e) {
            if (e instanceof IllegalStateException) {
                throw e; // Ném lại lỗi Chủ hộ
            }
            // Nếu query lỗi (ví dụ: chưa có quan hệ với HoKhau), bỏ qua
            System.out.println("Service: Skip isChuHo check (table might not exist yet)");
        }
        
        // 3. Thực hiện xóa
        try {
            nhanKhauRepository.deleteById(id);
            nhanKhauRepository.flush(); // Đảm bảo thực thi ngay
            
            System.out.println("Service: Deleted successfully ID " + id);
            return true;
            
        } catch (DataIntegrityViolationException e) {
            System.err.println("Service: Foreign key constraint violation");
            throw new IllegalStateException(
                "Không thể xóa nhân khẩu vì đang được sử dụng ở bảng khác. " +
                "Chi tiết: " + e.getMostSpecificCause().getMessage()
            );
        } catch (Exception e) {
            System.err.println("Service: Unexpected error - " + e.getMessage());
            e.printStackTrace();
            throw new IllegalStateException("Lỗi khi xóa nhân khẩu: " + e.getMessage());
        }
    }

    NhanKhau findBySoCCCD(String soCCCD)
    {
        return nhanKhauRepository.findBySoCCCD(soCCCD);
    }

    Optional<NhanKhau> findByChuHo_Id(Integer idChuHo)
    {
        return hoKhauRepository.findByChuHo_Id(idChuHo);
    }
    // Thêm method search vào NhanKhauService.java
    public List<NhanKhau> searchNhanKhau(String keyword) {
        return nhanKhauRepository.findByHoTenContainingOrSoCCCDContaining(keyword, keyword);
    }
    
    // Lấy danh sách nhân khẩu chưa thuộc hộ khẩu nào
    public List<NhanKhau> getNhanKhauNotInAnyHoKhau() {
        return nhanKhauRepository.findNhanKhauNotInAnyHoKhau();
    }
}
