package cnpm.qlnk.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "phanquyen")
@Data
@NoArgsConstructor // Creates a no-argument constructor (required by JPA)
@AllArgsConstructor // Creates a constructor with all arguments (id, tenVaiTro)
public class PhanQuyen {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "IDVaiTro", referencedColumnName = "id")
    private VaiTro vaiTro;

    @Column(name = "Resource", nullable = false)
    private String resource; // Ví dụ: NHAN_KHAU, GIAO_DICH

    @Column(name = "Action", nullable = false)
    private String action; // Ví dụ: READ, CREATE
}