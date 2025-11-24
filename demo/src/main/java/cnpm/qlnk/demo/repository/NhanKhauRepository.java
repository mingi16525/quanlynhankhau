package cnpm.qlnk.demo.repository;

import org.springframework.stereotype.Repository;
import cnpm.qlnk.demo.entity.NhanKhau;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Repository
public interface NhanKhauRepository extends JpaRepository<NhanKhau, Integer> {
    // Spring Data JPA sẽ tự động cung cấp các hàm như save(), findById(), findAll(), delete()
    NhanKhau findBySoCCCD(String soCCCD);
    
    List<NhanKhau> findByHoTenContainingOrSoCCCDContaining(String hoTen, String soCCCD);
    
    
    @Query("SELECT n FROM NhanKhau n WHERE " +
           "LOWER(n.hoTen) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(n.soCCCD) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<NhanKhau> searchByKeyword(@Param("keyword") String keyword);

    @Query("SELECT CASE WHEN COUNT(h) > 0 THEN true ELSE false END " +
           "FROM HoKhau h WHERE h.chuHo.id = :nhanKhauId")
    boolean isChuHo(@Param("nhanKhauId") Integer nhanKhauId);
    
    // Lấy danh sách nhân khẩu CHƯA thuộc hộ khẩu nào (không có trong bảng ThanhVienHo)
    @Query("SELECT n FROM NhanKhau n WHERE n.id NOT IN (SELECT tv.nhanKhau.id FROM ThanhVienHo tv)")
    List<NhanKhau> findNhanKhauNotInAnyHoKhau();
}
