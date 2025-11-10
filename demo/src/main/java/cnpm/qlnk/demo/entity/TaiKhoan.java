package cnpm.qlnk.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "taikhoan")
@Data
@NoArgsConstructor // Creates a no-argument constructor (required by JPA)
@AllArgsConstructor // Creates a constructor with all arguments (id, tenVaiTro)
public class TaiKhoan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "TenDangNhap", unique = true, nullable = false)
    private String tenDangNhap;

    @Column(name = "MatKhau", nullable = false)
    private String matKhau;

    @Column(name = "TrangThai")
    private String trangThai;

    @ManyToOne
    @JoinColumn(name = "IDVaiTro", referencedColumnName = "id", nullable = false)
    private VaiTro vaiTro;

    public String getPassword() {
        return matKhau;
    }

    public boolean isPresent() {
        return this.id != null;
    }

    
}