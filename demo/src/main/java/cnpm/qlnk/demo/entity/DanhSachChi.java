package cnpm.qlnk.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "danhsachchi")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DanhSachChi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @Column(name = "NoiDungChi", nullable = false, columnDefinition = "TEXT")
    private String noiDungChi;

    @Column(name = "SoTien", nullable = false, precision = 15, scale = 2)
    private BigDecimal soTien;

    @Column(name = "LoaiChi", nullable = false)
    private String loaiChi; // "Sửa chữa", "Điện nước", "Vệ sinh", "An ninh", "Sự kiện", "Khác"

    @Column(name = "NgayChi")
    private LocalDateTime ngayChi;

    @Column(name = "NguoiThucHien")
    private String nguoiThucHien; // Người phụ trách chi tiền

    @Column(name = "GhiChu", columnDefinition = "TEXT")
    private String ghiChu;

    @Column(name = "FileDinhKem")
    private String fileDinhKem; // Đường dẫn file hóa đơn, chứng từ

    @Column(name = "NgayTao")
    private LocalDateTime ngayTao;

    @Column(name = "NgayCapNhat")
    private LocalDateTime ngayCapNhat;

    @PrePersist
    protected void onCreate() {
        ngayTao = LocalDateTime.now();
        ngayCapNhat = LocalDateTime.now();
        if (ngayChi == null) {
            ngayChi = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        ngayCapNhat = LocalDateTime.now();
    }
}