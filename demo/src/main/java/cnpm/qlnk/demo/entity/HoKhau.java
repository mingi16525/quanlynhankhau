package cnpm.qlnk.demo.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "hokhau")
@Data
@NoArgsConstructor // Creates a no-argument constructor (required by JPA)
@AllArgsConstructor // Creates a constructor with all arguments (id, tenVaiTro)
public class HoKhau {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "MaSoHo", unique = true, nullable = false)
    private String maSoHo;

    @OneToOne // Quan hệ 1-1: Mỗi hộ có 1 chủ hộ (người này phải tồn tại trong NhanKhau)
    @JoinColumn(name = "IDChuHo", referencedColumnName = "id")
    private NhanKhau chuHo;

    @Column(name = "DiaChi")
    private String diaChi;

    @Column(name = "NgayLap")
    private LocalDate ngayLap;
}