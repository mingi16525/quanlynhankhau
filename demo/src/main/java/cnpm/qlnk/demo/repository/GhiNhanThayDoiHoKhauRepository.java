package cnpm.qlnk.demo.repository;

import cnpm.qlnk.demo.entity.GhiNhanThayDoiHoKhau;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface GhiNhanThayDoiHoKhauRepository extends JpaRepository<GhiNhanThayDoiHoKhau, Long> {
    
    // Lấy lịch sử thay đổi của một hộ khẩu
    List<GhiNhanThayDoiHoKhau> findByHoKhauIdOrderByNgayGhiNhanDesc(Integer hoKhauId);
    
    // Lấy theo loại sự kiện
    List<GhiNhanThayDoiHoKhau> findByTenSuKienOrderByNgayGhiNhanDesc(String tenSuKien);
    
    // Lấy theo người thực hiện
    List<GhiNhanThayDoiHoKhau> findByNguoiThucHienOrderByNgayGhiNhanDesc(String nguoiThucHien);
    
    // Tìm kiếm theo khoảng thời gian
    @Query("SELECT g FROM GhiNhanThayDoiHoKhau g WHERE g.ngayGhiNhan BETWEEN :startDate AND :endDate ORDER BY g.ngayGhiNhan DESC")
    List<GhiNhanThayDoiHoKhau> findByNgayGhiNhanBetween(
        @Param("startDate") LocalDateTime startDate, 
        @Param("endDate") LocalDateTime endDate
    );
    
    // Tìm kiếm theo hộ khẩu và loại sự kiện
    @Query("SELECT g FROM GhiNhanThayDoiHoKhau g WHERE g.hoKhau.id = :hoKhauId AND g.tenSuKien = :tenSuKien ORDER BY g.ngayGhiNhan DESC")
    List<GhiNhanThayDoiHoKhau> findByHoKhauAndTenSuKien(
        @Param("hoKhauId") Integer hoKhauId, 
        @Param("tenSuKien") String tenSuKien
    );
    
    // Tìm kiếm trong mô tả
    @Query("SELECT g FROM GhiNhanThayDoiHoKhau g WHERE LOWER(g.moTa) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(g.tenSuKien) LIKE LOWER(CONCAT('%', :keyword, '%')) ORDER BY g.ngayGhiNhan DESC")
    List<GhiNhanThayDoiHoKhau> searchByKeyword(@Param("keyword") String keyword);
    
    // Xóa tất cả bản ghi ghi nhận thay đổi của một hộ khẩu
    void deleteByHoKhau_Id(Integer hoKhauId);
}
