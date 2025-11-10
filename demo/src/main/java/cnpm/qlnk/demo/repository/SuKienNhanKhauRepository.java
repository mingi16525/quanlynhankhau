package cnpm.qlnk.demo.repository;

import cnpm.qlnk.demo.entity.SuKienNhanKhau;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface SuKienNhanKhauRepository extends JpaRepository<SuKienNhanKhau, Long> {
    
    /**
     * Tìm theo loại sự kiện
     */
    List<SuKienNhanKhau> findByLoaiSuKien(String loaiSuKien);
    
    /**
     * Tìm theo Nhân khẩu
     */
    List<SuKienNhanKhau> findByNhanKhauId(Integer nhanKhauId);
    
    /**
     * Tìm sự kiện trong khoảng thời gian
     */
    List<SuKienNhanKhau> findByNgayGhiNhanBetween(LocalDate startDate, LocalDate endDate);
    
    /**
     * Tìm sự kiện theo loại và thời gian
     */
    @Query("SELECT s FROM SuKienNhanKhau s WHERE s.loaiSuKien = :loaiSuKien " +
           "AND s.ngayGhiNhan BETWEEN :startDate AND :endDate")
    List<SuKienNhanKhau> findByLoaiAndDateRange(
        @Param("loaiSuKien") String loaiSuKien,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
    
    /**
     * Đếm số sự kiện theo loại
     */
    Long countByLoaiSuKien(String loaiSuKien);
    
    /**
     * Tìm kiếm theo tên nhân khẩu
     */
    @Query("SELECT s FROM SuKienNhanKhau s WHERE " +
           "LOWER(s.nhanKhau.hoTen) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(s.nhanKhau.soCCCD) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<SuKienNhanKhau> searchByKeyword(@Param("keyword") String keyword);
}