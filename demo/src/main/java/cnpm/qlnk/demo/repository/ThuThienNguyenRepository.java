package cnpm.qlnk.demo.repository;

import cnpm.qlnk.demo.entity.ThuThienNguyen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ThuThienNguyenRepository extends JpaRepository<ThuThienNguyen, Integer> {
    
    /**
     * Tìm theo hoạt động
     */
    List<ThuThienNguyen> findByHoatDongId(Integer hoatDongId);
    
    /**
     * Tìm theo người đóng
     */
    @Query("SELECT t FROM ThuThienNguyen t WHERE LOWER(t.nguoiDong) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<ThuThienNguyen> searchByNguoiDong(@Param("keyword") String keyword);
    
    /**
     * Tìm trong khoảng thời gian
     */
    @Query("SELECT t FROM ThuThienNguyen t WHERE t.ngayThu BETWEEN :startDate AND :endDate")
    List<ThuThienNguyen> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    /**
     * Tính tổng tiền thu được của một hoạt động
     */
    @Query("SELECT COALESCE(SUM(t.soTien), 0) FROM ThuThienNguyen t WHERE t.hoatDong.id = :hoatDongId")
    BigDecimal calculateTotalByHoatDong(@Param("hoatDongId") Integer hoatDongId);
    
    /**
     * Đếm số lượt đóng góp của một hoạt động
     */
    @Query("SELECT COUNT(t) FROM ThuThienNguyen t WHERE t.hoatDong.id = :hoatDongId")
    Long countByHoatDong(@Param("hoatDongId") Integer hoatDongId);
}