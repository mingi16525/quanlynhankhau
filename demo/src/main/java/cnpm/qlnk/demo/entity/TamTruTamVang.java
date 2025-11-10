package cnpm.qlnk.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "tamtrutamvang")
@Data
@NoArgsConstructor // Creates a no-argument constructor (required by JPA)
@AllArgsConstructor // Creates a constructor with all arguments (id, tenVaiTro)
public class TamTruTamVang {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID", nullable = false)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "IDNhanKhau", referencedColumnName = "id")
    private NhanKhau nhanKhau;

    @Column(name = "Loai", nullable = false)
    private String loai; // "Tạm trú" hoặc "Tạm vắng"

    @Column(name = "TuNgay", nullable = false)
    private LocalDate tuNgay;

    @Column(name = "DenNgay")
    private LocalDate denNgay;

    @Column(name = "LyDo", columnDefinition = "TEXT")
    private String lyDo;

    @Column(name = "NoiDen")
    private String noiDen;
}