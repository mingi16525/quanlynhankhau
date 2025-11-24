package cnpm.qlnk.demo.repository;

import cnpm.qlnk.demo.entity.DanhSachThuPhi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface DanhSachThuPhiRepository extends JpaRepository<DanhSachThuPhi, Long> {
    
    /**
     * Tìm theo Hộ khẩu
     */
    List<DanhSachThuPhi> findByHoKhauId(Integer hoKhauId);
    
    /**
     * Tìm theo Khoản phí
     */
    List<DanhSachThuPhi> findByKhoanPhiId(Long khoanPhiId);
    
    /**
     * Tìm theo trạng thái thanh toán
     */
    List<DanhSachThuPhi> findByTrangThaiThanhToan(String trangThai);
    
    /**
     * ✅ PHƯƠNG THỨC MỚI: Lấy danh sách các hộ CHƯA ĐÓNG của một khoản phí
     */
    @Query("SELECT t FROM DanhSachThuPhi t WHERE t.khoanPhi.id = :khoanPhiId " +
           "AND t.trangThaiThanhToan = 'Chưa đóng'")
    List<DanhSachThuPhi> findChuaDongByKhoanPhiId(@Param("khoanPhiId") Long khoanPhiId);
    
    /**
     * ✅ Lấy danh sách các hộ ĐÃ ĐÓNG của một khoản phí
     */
    @Query("SELECT t FROM DanhSachThuPhi t WHERE t.khoanPhi.id = :khoanPhiId " +
           "AND t.trangThaiThanhToan = 'Đã đóng'")
    List<DanhSachThuPhi> findDaDongByKhoanPhiId(@Param("khoanPhiId") Long khoanPhiId);
    
    /**
     * Kiểm tra Hộ khẩu đã có khoản phí này chưa
     */
    @Query("SELECT CASE WHEN COUNT(t) > 0 THEN true ELSE false END FROM DanhSachThuPhi t " +
           "WHERE t.hoKhau.id = :hoKhauId AND t.khoanPhi.id = :khoanPhiId")
    boolean existsByHoKhauAndKhoanPhi(
        @Param("hoKhauId") Integer hoKhauId,
        @Param("khoanPhiId") Long khoanPhiId
    );
    
    /**
     * Tìm khoản thu của một hộ và khoản phí cụ thể
     */
    @Query("SELECT t FROM DanhSachThuPhi t WHERE t.hoKhau.id = :hoKhauId " +
           "AND t.khoanPhi.id = :khoanPhiId")
    Optional<DanhSachThuPhi> findByHoKhauAndKhoanPhi(
        @Param("hoKhauId") Integer hoKhauId,
        @Param("khoanPhiId") Long khoanPhiId
    );
    
    /**
     * Tìm các khoản thu trong khoảng thời gian
     */
    @Query("SELECT t FROM DanhSachThuPhi t WHERE t.ngayTao BETWEEN :startDate AND :endDate")
    List<DanhSachThuPhi> findByDateRange(
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
    
    /**
     * Tìm kiếm theo tên hộ khẩu hoặc chủ hộ
     */
    @Query("SELECT t FROM DanhSachThuPhi t WHERE " +
           "LOWER(t.hoKhau.chuHo.hoTen) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<DanhSachThuPhi> searchByKeyword(@Param("keyword") String keyword);
    
    /**
     * ✅ Tính tổng số tiền ĐÃ THU của một khoản phí
     */
    @Query("SELECT COALESCE(SUM(t.soTien), 0) FROM DanhSachThuPhi t " +
           "WHERE t.khoanPhi.id = :khoanPhiId AND t.trangThaiThanhToan = 'Đã đóng'")
    BigDecimal calculateTotalCollectedByKhoanPhi(@Param("khoanPhiId") Long khoanPhiId);
    
    /**
     * ✅ Tính tổng số tiền CHƯA THU của một khoản phí
     */
    @Query("SELECT COALESCE(SUM(t.soTien), 0) FROM DanhSachThuPhi t " +
           "WHERE t.khoanPhi.id = :khoanPhiId AND t.trangThaiThanhToan = 'Chưa đóng'")
    BigDecimal calculateTotalPendingByKhoanPhi(@Param("khoanPhiId") Long khoanPhiId);
    
    /**
     * ✅ Đếm số hộ đã đóng
     */
    @Query("SELECT COUNT(t) FROM DanhSachThuPhi t WHERE t.khoanPhi.id = :khoanPhiId " +
           "AND t.trangThaiThanhToan = 'Đã đóng'")
    Long countDaDongByKhoanPhi(@Param("khoanPhiId") Long khoanPhiId);
    
    /**
     * ✅ Đếm số hộ chưa đóng
     */
    @Query("SELECT COUNT(t) FROM DanhSachThuPhi t WHERE t.khoanPhi.id = :khoanPhiId " +
           "AND t.trangThaiThanhToan = 'Chưa đóng'")
    Long countChuaDongByKhoanPhi(@Param("khoanPhiId") Long khoanPhiId);
}