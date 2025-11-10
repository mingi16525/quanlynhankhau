package cnpm.qlnk.demo.repository;
import org.springframework.stereotype.Repository;
import cnpm.qlnk.demo.entity.VaiTro;
import org.springframework.data.jpa.repository.JpaRepository;
public interface VaiTroRepository extends JpaRepository<VaiTro, Integer> {
    // Phương thức custom giúp lấy VaiTro theo tên
    VaiTro findByTenVaiTro(String tenVaiTro);
}