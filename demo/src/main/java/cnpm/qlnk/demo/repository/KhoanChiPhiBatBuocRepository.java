package cnpm.qlnk.demo.repository;

import cnpm.qlnk.demo.entity.KhoanChiPhiBatBuoc;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KhoanChiPhiBatBuocRepository extends JpaRepository<KhoanChiPhiBatBuoc, Long> {
    
    /**
     * Tìm khoản phí theo loại
     */
    List<KhoanChiPhiBatBuoc> findByLoaiKhoanPhi(String loaiKhoanPhi);
    
    /**
     * Tìm các khoản phí đang hoạt động
     */
    @Query("SELECT k FROM KhoanChiPhiBatBuoc k WHERE k.trangThai = 'Đang áp dụng'")
    List<KhoanChiPhiBatBuoc> findActiveKhoanPhi();
    
    /**
     * Tìm kiếm theo tên khoản phí
     */
    @Query("SELECT k FROM KhoanChiPhiBatBuoc k WHERE LOWER(k.tenKhoanPhi) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<KhoanChiPhiBatBuoc> searchByTenKhoanPhi(@Param("keyword") String keyword);
    
    /**
     * Kiểm tra khoản phí đã tồn tại chưa
     */
    boolean existsByTenKhoanPhi(String tenKhoanPhi);
}