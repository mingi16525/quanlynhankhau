package cnpm.qlnk.demo.repository;
import org.springframework.stereotype.Repository;
import cnpm.qlnk.demo.entity.TaiKhoan;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface TaiKhoanRepository extends JpaRepository<TaiKhoan, Integer> {
    // Sử dụng cho logic đăng nhập
    Optional<TaiKhoan> findByTenDangNhap(String tenDangNhap);
}