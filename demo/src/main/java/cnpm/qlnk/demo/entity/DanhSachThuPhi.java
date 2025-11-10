package cnpm.qlnk.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "danhsachthuphi")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DanhSachThuPhi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "IDHoKhau", nullable = false)
    @JsonIgnoreProperties({"nhanKhaus", "hibernateLazyInitializer", "handler"})
    private HoKhau hoKhau;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "IDKhoanPhi", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private KhoanChiPhiBatBuoc khoanPhi;

    @Column(name = "SoTien", nullable = false, precision = 15, scale = 2)
    private BigDecimal soTien;

    @Column(name = "TrangThaiThanhToan")
    private String trangThaiThanhToan; // "Chưa đóng", "Đã đóng"

    @Column(name = "NgayThanhToan")
    private LocalDateTime ngayThanhToan;

    @Column(name = "GhiChu", columnDefinition = "TEXT")
    private String ghiChu;

    @Column(name = "NgayTao")
    private LocalDateTime ngayTao;

    @Column(name = "NgayCapNhat")
    private LocalDateTime ngayCapNhat;

    @PrePersist
    protected void onCreate() {
        ngayTao = LocalDateTime.now();
        ngayCapNhat = LocalDateTime.now();
        if (trangThaiThanhToan == null) {
            trangThaiThanhToan = "Chưa đóng";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        ngayCapNhat = LocalDateTime.now();
    }
}