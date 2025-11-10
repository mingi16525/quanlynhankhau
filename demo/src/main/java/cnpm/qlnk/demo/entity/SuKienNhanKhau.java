package cnpm.qlnk.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.LocalDate;

@Entity
@Table(name = "sukiennhankhau")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SuKienNhanKhau {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @Column(name = "LoaiSuKien", nullable = false)
    private String loaiSuKien; // "Sinh" hoặc "Mất"

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "IDNhanKhau") // NULL nếu là sự kiện "Sinh"
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private NhanKhau nhanKhau;

    @Column(name = "NgayGhiNhan", nullable = false)
    private LocalDate ngayGhiNhan; // Ngày sinh hoặc ngày mất

    @Column(name = "GhiChu", columnDefinition = "TEXT")
    private String ghiChu;

    @Column(name = "NgayTao")
    private LocalDate ngayTao;

    @PrePersist
    protected void onCreate() {
        ngayTao = LocalDate.now();
    }
}