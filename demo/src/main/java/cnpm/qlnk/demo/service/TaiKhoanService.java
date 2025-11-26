package cnpm.qlnk.demo.service;

import cnpm.qlnk.demo.entity.TaiKhoan;
import cnpm.qlnk.demo.entity.VaiTro;
import cnpm.qlnk.demo.repository.TaiKhoanRepository;
import cnpm.qlnk.demo.repository.VaiTroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class TaiKhoanService {

    @Autowired private TaiKhoanRepository taiKhoanRepository;
    @Autowired private VaiTroRepository vaiTroRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    // 1. Xem tất cả tài khoản
    @PreAuthorize("hasAuthority('TAI_KHOAN:READ')")
    public List<TaiKhoan> getAllTaiKhoan() {
        return taiKhoanRepository.findAll();
    }

    // 2. Lấy tài khoản theo ID
    @PreAuthorize("hasAuthority('TAI_KHOAN:READ')")
    public TaiKhoan getTaiKhoanById(Integer id) {
        return taiKhoanRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tài khoản với ID: " + id));
    }

    // 3. Tạo tài khoản mới
    @Transactional
    @PreAuthorize("hasAuthority('TAI_KHOAN:CREATE')")
    public TaiKhoan createTaiKhoan(TaiKhoan taiKhoan, String tenVaiTro) {
        // Kiểm tra vai trò
        VaiTro vaiTro = vaiTroRepository.findByTenVaiTro(tenVaiTro);
        if (vaiTro == null) {
            throw new IllegalArgumentException("Vai trò '" + tenVaiTro + "' không tồn tại.");
        }
        
        // Kiểm tra trùng tên đăng nhập
        if (taiKhoanRepository.findByTenDangNhap(taiKhoan.getTenDangNhap()).isPresent()) {
            throw new IllegalStateException("Tên đăng nhập '" + taiKhoan.getTenDangNhap() + "' đã tồn tại.");
        }

        // Mã hóa mật khẩu
        taiKhoan.setMatKhau(passwordEncoder.encode(taiKhoan.getMatKhau()));
        taiKhoan.setVaiTro(vaiTro);
        
        // Set trạng thái mặc định nếu chưa có
        if (taiKhoan.getTrangThai() == null || taiKhoan.getTrangThai().trim().isEmpty()) {
            taiKhoan.setTrangThai("Active");
        }

        return taiKhoanRepository.save(taiKhoan);
    }

    // 4. Cập nhật tài khoản
    @Transactional
    @PreAuthorize("hasAuthority('TAI_KHOAN:UPDATE')")
    public TaiKhoan updateTaiKhoan(Integer id, TaiKhoan taiKhoanUpdate, String tenVaiTro) {
        TaiKhoan existingTk = taiKhoanRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tài khoản với ID: " + id));

        // Cập nhật vai trò nếu có
        if (tenVaiTro != null && !tenVaiTro.trim().isEmpty()) {
            VaiTro vaiTro = vaiTroRepository.findByTenVaiTro(tenVaiTro);
            if (vaiTro == null) {
                throw new IllegalArgumentException("Vai trò '" + tenVaiTro + "' không tồn tại.");
            }
            existingTk.setVaiTro(vaiTro);
        }

        // Kiểm tra trùng tên đăng nhập (nếu đổi tên)
        if (!existingTk.getTenDangNhap().equals(taiKhoanUpdate.getTenDangNhap())) {
            if (taiKhoanRepository.findByTenDangNhap(taiKhoanUpdate.getTenDangNhap()).isPresent()) {
                throw new IllegalStateException("Tên đăng nhập '" + taiKhoanUpdate.getTenDangNhap() + "' đã tồn tại.");
            }
            existingTk.setTenDangNhap(taiKhoanUpdate.getTenDangNhap());
        }

        // Cập nhật mật khẩu nếu có (và khác rỗng)
        if (taiKhoanUpdate.getMatKhau() != null && !taiKhoanUpdate.getMatKhau().trim().isEmpty()) {
            existingTk.setMatKhau(passwordEncoder.encode(taiKhoanUpdate.getMatKhau()));
        }

        // Cập nhật trạng thái
        if (taiKhoanUpdate.getTrangThai() != null) {
            existingTk.setTrangThai(taiKhoanUpdate.getTrangThai());
        }

        return taiKhoanRepository.save(existingTk);
    }

    // 5. Khóa/Mở khóa tài khoản
    @Transactional
    @PreAuthorize("hasAuthority('TAI_KHOAN:UPDATE')")
    public boolean lockTaiKhoan(Integer id) {
        TaiKhoan tk = taiKhoanRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Tài khoản không tồn tại với ID: " + id));
        
        // Toggle trạng thái
        String newStatus = "Locked".equalsIgnoreCase(tk.getTrangThai()) ? "Active" : "Locked";
        tk.setTrangThai(newStatus);
        
        taiKhoanRepository.save(tk);
        return true;
    }

    // 6. Reset mật khẩu
    @Transactional
    @PreAuthorize("hasAuthority('TAI_KHOAN:UPDATE')")
    public void resetPassword(Integer id, String newPassword) {
        TaiKhoan tk = taiKhoanRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Tài khoản không tồn tại với ID: " + id));
        
        tk.setMatKhau(passwordEncoder.encode(newPassword));
        taiKhoanRepository.save(tk);
    }

    // 7. Xóa tài khoản
    @Transactional
    @PreAuthorize("hasAuthority('TAI_KHOAN:DELETE')")
    public void deleteTaiKhoan(Integer id) {
        TaiKhoan tk = taiKhoanRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Tài khoản không tồn tại với ID: " + id));
        
        // Không cho xóa tài khoản admin chính (tùy logic nghiệp vụ)
        if ("admin".equalsIgnoreCase(tk.getTenDangNhap())) {
            throw new IllegalStateException("Không thể xóa tài khoản admin hệ thống.");
        }
        
        taiKhoanRepository.delete(tk);
    }
}