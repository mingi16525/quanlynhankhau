package cnpm.qlnk.demo.repository;

import org.springframework.stereotype.Repository;
import cnpm.qlnk.demo.entity.ThanhVienHo;

import java.util.Optional;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
public interface ThanhVienHoRepository extends JpaRepository<ThanhVienHo, Integer> {

    Optional<ThanhVienHo> findByNhanKhau_Id(Integer id);

    boolean existsByHoKhau_Id(Integer id);

    List<ThanhVienHo> findByHoKhau_Id(Integer hoKhauId);

}