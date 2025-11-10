package cnpm.qlnk.demo.repository;
import org.springframework.stereotype.Repository;
import cnpm.qlnk.demo.entity.PhanQuyen;
import cnpm.qlnk.demo.entity.VaiTro;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface PhanQuyenRepository extends JpaRepository<PhanQuyen, Integer> {
    // Phương thức custom giúp lấy tất cả quyền của một vai trò
    // Tìm phân quyền theo vai trò
    List<PhanQuyen> findByVaiTro(VaiTro vaiTro);
    
    // Tìm phân quyền theo resource và action
    List<PhanQuyen> findByResourceAndAction(String resource, String action);
    
    // Tìm phân quyền theo vai trò, resource và action
    List<PhanQuyen> findByVaiTroAndResourceAndAction(VaiTro vaiTro, String resource, String action);
    
    // Xóa tất cả phân quyền của một vai trò
    void deleteByVaiTro(VaiTro vaiTro);

    
    List<PhanQuyen> findByVaiTro_Id(Integer idVaiTro);
}

