package cnpm.qlnk.demo.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor; // Add this
import lombok.AllArgsConstructor; // Add this
import java.time.LocalDate;

@Entity
@Table(name = "nhankhau")
@Data
@NoArgsConstructor // Creates a no-argument constructor (required by JPA)
@AllArgsConstructor // Creates a constructor with all arguments
public class NhanKhau {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "HoTen", nullable = false)
    private String hoTen;

    @Column(name = "NgaySinh")
    private LocalDate ngaySinh;

    @Column(name = "GioiTinh")
    private String gioiTinh;

    @Column(name = "SoCCCD", unique = true)
    private String soCCCD;

    @Column(name = "NgheNghiep")
    private String ngheNghiep;

    @Column(name = "NoiLamViec")
    private String noiLamViec;

    @Column(name = "QueQuan")
    private String queQuan;

    @Column(name = "DanToc")
    private String danToc;
    
    @Column(name = "TonGiao")
    private String tonGiao;

    @Column(name = "TinhTrang")
    private String tinhTrang; // Ví dụ: Thường trú, Tạm trú, Đã mất

    @Column(name = "GhiChu")
    private String ghiChu;
}