package cnpm.qlnk.demo.repository;

import cnpm.qlnk.demo.entity.TamTruTamVang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TamTruTamVangRepository extends JpaRepository<TamTruTamVang, Long> {
    
    /**
     * Tìm theo loại (Tạm trú / Tạm vắng)
     */
    List<TamTruTamVang> findByLoai(String loai);
    
    /**
     * Tìm theo Nhân khẩu
     */
    List<TamTruTamVang> findByNhanKhauId(Integer nhanKhauId);
    
    /**
     * Tìm kiếm theo từ khóa (tên nhân khẩu, CCCD)
     */
    @Query("SELECT t FROM TamTruTamVang t WHERE " +
           "LOWER(t.nhanKhau.hoTen) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(t.nhanKhau.soCCCD) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<TamTruTamVang> searchByKeyword(@Param("keyword") String keyword);
    
    /**
     * Tìm đăng ký sắp hết hạn
     */
    List<TamTruTamVang> findByDenNgayBetween(LocalDate startDate, LocalDate endDate);
    
    /**
     * Tìm đăng ký còn hiệu lực (denNgay NULL hoặc > hôm nay)
     */
    @Query("SELECT t FROM TamTruTamVang t WHERE " +
           "t.denNgay IS NULL OR t.denNgay >= :ngayHienTai")
    List<TamTruTamVang> findActive(@Param("ngayHienTai") LocalDate ngayHienTai);
    
    /**
     * Tìm theo loại VÀ khoảng thời gian đăng ký (tuNgay)
     */
    @Query("SELECT t FROM TamTruTamVang t WHERE " +
           "t.loai = :loai AND " +
           "t.tuNgay >= :startDate AND t.tuNgay <= :endDate")
    List<TamTruTamVang> findByLoaiAndTuNgayBetween(
        @Param("loai") String loai,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
    
    /**
     * Tìm tất cả trong khoảng thời gian đăng ký
     */
    @Query("SELECT t FROM TamTruTamVang t WHERE " +
           "t.tuNgay >= :startDate AND t.tuNgay <= :endDate")
    List<TamTruTamVang> findByTuNgayBetween(
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
}