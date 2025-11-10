package cnpm.qlnk.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "khoanchiphibatbuoc")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class KhoanChiPhiBatBuoc {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @Column(name = "TenKhoanPhi", nullable = false, unique = true)
    private String tenKhoanPhi;

    @Column(name = "LoaiKhoanPhi", nullable = false)
    private String loaiKhoanPhi; // "Bắt buộc", "Tự nguyện", "Khác"

    // ✅ ĐỔI TÊN: SoTienMoiNguoi → SoTienMoiHo
    @Column(name = "SoTienMoiHo", nullable = false, precision = 15, scale = 2)
    private BigDecimal soTienMoiHo;

    @Column(name = "MoTa", columnDefinition = "TEXT")
    private String moTa;

    @Column(name = "TrangThai")
    private String trangThai; // "Đang áp dụng", "Tạm dừng", "Đã kết thúc"

    @Column(name = "NgayTao")
    private LocalDateTime ngayTao;

    @Column(name = "NgayCapNhat")
    private LocalDateTime ngayCapNhat;

    @PrePersist
    protected void onCreate() {
        ngayTao = LocalDateTime.now();
        ngayCapNhat = LocalDateTime.now();
        if (trangThai == null) {
            trangThai = "Đang áp dụng";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        ngayCapNhat = LocalDateTime.now();
    }
}