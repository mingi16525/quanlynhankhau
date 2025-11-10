package cnpm.qlnk.demo.repository;

import cnpm.qlnk.demo.entity.DanhSachChi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DanhSachChiRepository extends JpaRepository<DanhSachChi, Long> {
    
    /**
     * Tìm theo loại chi
     */
    List<DanhSachChi> findByLoaiChi(String loaiChi);
    
    /**
     * Tìm các khoản chi trong khoảng thời gian
     */
    @Query("SELECT c FROM DanhSachChi c WHERE c.ngayChi BETWEEN :startDate AND :endDate")
    List<DanhSachChi> findByDateRange(
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
    
    /**
     * Tìm kiếm theo nội dung chi
     */
    @Query("SELECT c FROM DanhSachChi c WHERE LOWER(c.noiDungChi) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<DanhSachChi> searchByKeyword(@Param("keyword") String keyword);
    
    /**
     * Tính tổng chi theo loại
     */
    @Query("SELECT COALESCE(SUM(c.soTien), 0) FROM DanhSachChi c WHERE c.loaiChi = :loaiChi")
    BigDecimal calculateTotalByLoai(@Param("loaiChi") String loaiChi);
    
    /**
     * Tính tổng chi trong khoảng thời gian
     */
    @Query("SELECT COALESCE(SUM(c.soTien), 0) FROM DanhSachChi c " +
           "WHERE c.ngayChi BETWEEN :startDate AND :endDate")
    BigDecimal calculateTotalByDateRange(
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
}