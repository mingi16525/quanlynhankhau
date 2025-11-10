package cnpm.qlnk.demo.service;

import cnpm.qlnk.demo.entity.VaiTro;
import cnpm.qlnk.demo.repository.VaiTroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class VaiTroService {

    @Autowired
    private VaiTroRepository vaiTroRepository;

    // 1. Lấy tất cả vai trò
    @PreAuthorize("hasAuthority('ADMIN:READ')")
    public List<VaiTro> getAllVaiTro() {
        return vaiTroRepository.findAll();
    }

    // 2. Lấy vai trò theo ID
    @PreAuthorize("hasAuthority('ADMIN:READ')")
    public VaiTro getVaiTroById(Integer id) {
        return vaiTroRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy vai trò với ID: " + id));
    }

    // 3. Lấy vai trò theo tên
    @PreAuthorize("hasAuthority('ADMIN:READ')")
    public VaiTro getVaiTroByTen(String tenVaiTro) {
        VaiTro vaiTro = vaiTroRepository.findByTenVaiTro(tenVaiTro);
        if (vaiTro == null) {
            throw new IllegalArgumentException("Không tìm thấy vai trò: " + tenVaiTro);
        }
        return vaiTro;
    }

    // 4. Tạo vai trò mới
    @Transactional
    @PreAuthorize("hasAuthority('ADMIN:CREATE')")
    public VaiTro createVaiTro(VaiTro vaiTro) {
        // Kiểm tra trùng tên vai trò
        if (vaiTroRepository.findByTenVaiTro(vaiTro.getTenVaiTro()) != null) {
            throw new IllegalStateException("Vai trò '" + vaiTro.getTenVaiTro() + "' đã tồn tại");
        }

        // Validate tên vai trò
        if (vaiTro.getTenVaiTro() == null || vaiTro.getTenVaiTro().trim().isEmpty()) {
            throw new IllegalArgumentException("Tên vai trò không được để trống");
        }

        return vaiTroRepository.save(vaiTro);
    }

    // 5. Cập nhật vai trò
    @Transactional
    @PreAuthorize("hasAuthority('ADMIN:UPDATE')")
    public VaiTro updateVaiTro(Integer id, VaiTro vaiTroUpdate) {
        VaiTro existingVaiTro = vaiTroRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy vai trò với ID: " + id));

        // Không cho sửa vai trò hệ thống
        if ("Admin".equalsIgnoreCase(existingVaiTro.getTenVaiTro())) {
            throw new IllegalStateException("Không thể sửa vai trò Admin hệ thống");
        }

        // Kiểm tra trùng tên nếu đổi tên
        if (!existingVaiTro.getTenVaiTro().equals(vaiTroUpdate.getTenVaiTro())) {
            if (vaiTroRepository.findByTenVaiTro(vaiTroUpdate.getTenVaiTro()) != null) {
                throw new IllegalStateException("Vai trò '" + vaiTroUpdate.getTenVaiTro() + "' đã tồn tại");
            }
            existingVaiTro.setTenVaiTro(vaiTroUpdate.getTenVaiTro());
        }

        return vaiTroRepository.save(existingVaiTro);
    }

    // 6. Xóa vai trò
    @Transactional
    @PreAuthorize("hasAuthority('ADMIN:DELETE')")
    public void deleteVaiTro(Integer id) {
        VaiTro vaiTro = vaiTroRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy vai trò với ID: " + id));

        // Không cho xóa vai trò Admin
        if ("Admin".equalsIgnoreCase(vaiTro.getTenVaiTro())) {
            throw new IllegalStateException("Không thể xóa vai trò Admin hệ thống");
        }

        // Kiểm tra xem có tài khoản nào đang sử dụng vai trò này không
        // (Cần thêm method trong TaiKhoanRepository)
        // if (taiKhoanRepository.existsByVaiTroId(id)) {
        //     throw new IllegalStateException("Không thể xóa vai trò đang được sử dụng");
        // }

        vaiTroRepository.delete(vaiTro);
    }

    // 7. Kiểm tra vai trò tồn tại
    public boolean existsByTenVaiTro(String tenVaiTro) {
        return vaiTroRepository.findByTenVaiTro(tenVaiTro) != null;
    }
}