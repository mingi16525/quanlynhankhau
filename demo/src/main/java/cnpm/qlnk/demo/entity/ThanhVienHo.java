package cnpm.qlnk.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "thanhvienho")
@Data
@NoArgsConstructor // Creates a no-argument constructor (required by JPA)
@AllArgsConstructor // Creates a constructor with all arguments (id, tenVaiTro)
public class ThanhVienHo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne // Quan hệ 1-1: Mỗi nhân khẩu chỉ là thành viên chính thức của 1 hộ khẩu tại 1 thời điểm
    //Một nhân khẩu có thể không thuộc về hộ khẩu nào nên không để nullable = false
    @JoinColumn(name = "IDNhanKhau", referencedColumnName = "id", unique = true, nullable = true)
    private NhanKhau nhanKhau;

    @ManyToOne // Quan hệ N-1: Nhiều thành viên thuộc 1 hộ khẩu
    @JoinColumn(name = "IDHoKhau", referencedColumnName = "id")
    private HoKhau hoKhau;

    @Column(name = "QuanHeVoiChuHo")
    private String quanHeVoiChuHo;

    @Column(name = "GhiChu", columnDefinition = "TEXT")
    private String ghiChu;
}