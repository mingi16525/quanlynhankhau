package cnpm.qlnk.demo.repository;

import cnpm.qlnk.demo.entity.HoatDongThienNguyen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface HoatDongThienNguyenRepository extends JpaRepository<HoatDongThienNguyen, Integer> {
    
    /**
     * Tìm theo trạng thái
     */
    List<HoatDongThienNguyen> findByTrangThai(String trangThai);
    
    /**
     * Tìm các hoạt động đang diễn ra
     */
    @Query("SELECT h FROM HoatDongThienNguyen h WHERE h.trangThai = 'Đang gây quỹ'")
    List<HoatDongThienNguyen> findActiveHoatDong();
    
    /**
     * Tìm kiếm theo tên hoạt động
     */
    @Query("SELECT h FROM HoatDongThienNguyen h WHERE LOWER(h.tenHoatDong) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<HoatDongThienNguyen> searchByTenHoatDong(@Param("keyword") String keyword);
    
    /**
     * Tìm các hoạt động trong khoảng thời gian
     */
    @Query("SELECT h FROM HoatDongThienNguyen h WHERE h.ngayBatDau >= :startDate AND h.ngayKetThuc <= :endDate")
    List<HoatDongThienNguyen> findByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    /**
     * Kiểm tra tên hoạt động đã tồn tại
     */
    boolean existsByTenHoatDong(String tenHoatDong);
}