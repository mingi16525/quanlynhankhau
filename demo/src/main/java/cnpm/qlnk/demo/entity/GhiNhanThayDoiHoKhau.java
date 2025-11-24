package cnpm.qlnk.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.LocalDateTime;

@Entity
@Table(name = "ghinhanthaydoihokhau")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GhiNhanThayDoiHoKhau {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "IDHoKhau", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private HoKhau hoKhau;

    @Column(name = "TenSuKien", nullable = false)
    private String tenSuKien; // "Thay đổi thông tin", "Thêm thành viên", "Xóa thành viên", "Đổi chủ hộ", "Tách hộ"

    @Column(name = "MoTa", columnDefinition = "TEXT")
    private String moTa; // Ví dụ: "Xóa Thành viên Nguyễn Văn A khỏi hộ khẩu HN001"

    @Column(name = "NgayGhiNhan", nullable = false)
    private LocalDateTime ngayGhiNhan;

    @Column(name = "NguoiThucHien")
    private String nguoiThucHien; // Username của người thực hiện thay đổi

    @PrePersist
    protected void onCreate() {
        if (ngayGhiNhan == null) {
            ngayGhiNhan = LocalDateTime.now();
        }
    }
}
