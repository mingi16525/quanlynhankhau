package cnpm.qlnk.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "thuthiennguyen")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ThuThienNguyen {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Integer id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "IDHoatDong", referencedColumnName = "ID", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private HoatDongThienNguyen hoatDong;

    @Column(name = "SoTien", nullable = false, precision = 15, scale = 2)
    private BigDecimal soTien;

    @Column(name = "NgayThu", nullable = false)
    private LocalDateTime ngayThu;

    @Column(name = "NguoiDong")
    private String nguoiDong; // Tên người đóng góp (có thể null nếu ẩn danh)

    @Column(name = "MoTa", columnDefinition = "TEXT")
    private String moTa;

    @Column(name = "NgayTao")
    private LocalDateTime ngayTao;

    @PrePersist
    protected void onCreate() {
        ngayTao = LocalDateTime.now();
        if (ngayThu == null) {
            ngayThu = LocalDateTime.now();
        }
    }
}