package cnpm.qlnk.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "vaitro")
@Data
@NoArgsConstructor // Creates a no-argument constructor (required by JPA)
@AllArgsConstructor // Creates a constructor with all arguments (id, tenVaiTro)
public class VaiTro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "TenVaiTro", unique = true, nullable = false)
    private String tenVaiTro;
}