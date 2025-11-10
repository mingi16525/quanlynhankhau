package cnpm.qlnk.demo.service;

import cnpm.qlnk.demo.entity.PhanQuyen;
import cnpm.qlnk.demo.entity.TaiKhoan;
import cnpm.qlnk.demo.repository.PhanQuyenRepository;
import cnpm.qlnk.demo.repository.TaiKhoanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Import Transactional

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private TaiKhoanRepository taiKhoanRepository;

    @Autowired
    private PhanQuyenRepository phanQuyenRepository; // Inject repository for permissions

    @Override
    @Transactional(readOnly = true) // Use Transactional for database access
    public UserDetails loadUserByUsername(String tenDangNhap) throws UsernameNotFoundException {
        // 1. Tìm tài khoản theo Tên đăng nhập
        TaiKhoan taiKhoan = taiKhoanRepository.findByTenDangNhap(tenDangNhap)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy tài khoản: " + tenDangNhap));

        // 2. Kiểm tra trạng thái tài khoản (nếu cần)
        if ("Locked".equalsIgnoreCase(taiKhoan.getTrangThai())) {
            throw new UsernameNotFoundException("Tài khoản đã bị khóa: " + tenDangNhap);
        }

        // 3. Lấy danh sách quyền hạn chi tiết từ bảng PhanQuyen
        List<PhanQuyen> quyenChiTiet = phanQuyenRepository.findByVaiTro_Id(taiKhoan.getVaiTro().getId());

        // 4. Chuyển đổi thành GrantedAuthority (bao gồm cả quyền chi tiết và tên Vai trò)
        List<GrantedAuthority> authorities = new ArrayList<>();

        // Thêm quyền chi tiết (Resource:Action)
        authorities.addAll(quyenChiTiet.stream()
            .map(p -> new SimpleGrantedAuthority(p.getResource() + ":" + p.getAction()))
            .collect(Collectors.toList()));
            
        // Thêm cả tên Vai trò (dạng ROLE_...) để dùng với hasRole()
        authorities.add(new SimpleGrantedAuthority("ROLE_" + taiKhoan.getVaiTro().getTenVaiTro().toUpperCase().replace(" ", "_")));


        // 5. Trả về đối tượng UserDetails mà Spring Security sử dụng
        return new User(
            taiKhoan.getTenDangNhap(),
            taiKhoan.getMatKhau(), // Mật khẩu đã được hash
            authorities // Danh sách quyền hạn
        );
    }
}