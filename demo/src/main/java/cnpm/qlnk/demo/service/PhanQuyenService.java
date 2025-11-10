package cnpm.qlnk.demo.service;

import cnpm.qlnk.demo.entity.PhanQuyen;
import cnpm.qlnk.demo.entity.VaiTro;
import cnpm.qlnk.demo.repository.PhanQuyenRepository;
import cnpm.qlnk.demo.repository.VaiTroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PhanQuyenService {

    @Autowired
    private PhanQuyenRepository phanQuyenRepository;

    @Autowired
    private VaiTroRepository vaiTroRepository;

    // 1. Lấy tất cả phân quyền
    @PreAuthorize("hasAuthority('ADMIN:READ')")
    public List<PhanQuyen> getAllPhanQuyen() {
        return phanQuyenRepository.findAll();
    }

    // 2. Lấy phân quyền theo ID
    @PreAuthorize("hasAuthority('ADMIN:READ')")
    public PhanQuyen getPhanQuyenById(Integer id) {
        return phanQuyenRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phân quyền với ID: " + id));
    }

    // 3. Lấy phân quyền theo vai trò
    @PreAuthorize("hasAuthority('ADMIN:READ')")
    public List<PhanQuyen> getPhanQuyenByVaiTro(Integer vaiTroId) {
        VaiTro vaiTro = vaiTroRepository.findById(vaiTroId)
            .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy vai trò với ID: " + vaiTroId));
        
        return phanQuyenRepository.findByVaiTro(vaiTro);
    }

    // 4. Lấy phân quyền theo Resource và Action
    @PreAuthorize("hasAuthority('ADMIN:READ')")
    public List<PhanQuyen> getPhanQuyenByResourceAndAction(String resource, String action) {
        return phanQuyenRepository.findByResourceAndAction(resource, action);
    }

    // 5. Tạo phân quyền mới
    @Transactional
    @PreAuthorize("hasAuthority('ADMIN:CREATE')")
    public PhanQuyen createPhanQuyen(PhanQuyen phanQuyen) {
        // Validate
        if (phanQuyen.getVaiTro() == null || phanQuyen.getVaiTro().getId() == null) {
            throw new IllegalArgumentException("Vai trò không được để trống");
        }

        if (phanQuyen.getResource() == null || phanQuyen.getResource().trim().isEmpty()) {
            throw new IllegalArgumentException("Resource không được để trống");
        }

        if (phanQuyen.getAction() == null || phanQuyen.getAction().trim().isEmpty()) {
            throw new IllegalArgumentException("Action không được để trống");
        }

        // Kiểm tra vai trò tồn tại
        VaiTro vaiTro = vaiTroRepository.findById(phanQuyen.getVaiTro().getId())
            .orElseThrow(() -> new IllegalArgumentException("Vai trò không tồn tại"));

        phanQuyen.setVaiTro(vaiTro);

        // Kiểm tra trùng lặp
        List<PhanQuyen> existing = phanQuyenRepository.findByVaiTroAndResourceAndAction(
            vaiTro, 
            phanQuyen.getResource(), 
            phanQuyen.getAction()
        );

        if (!existing.isEmpty()) {
            throw new IllegalStateException(
                "Phân quyền " + phanQuyen.getResource() + ":" + phanQuyen.getAction() + 
                " đã tồn tại cho vai trò " + vaiTro.getTenVaiTro()
            );
        }

        return phanQuyenRepository.save(phanQuyen);
    }

    // 6. Cập nhật phân quyền
    @Transactional
    @PreAuthorize("hasAuthority('ADMIN:UPDATE')")
    public PhanQuyen updatePhanQuyen(Integer id, PhanQuyen phanQuyenUpdate) {
        PhanQuyen existingPQ = phanQuyenRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phân quyền với ID: " + id));

        // Không cho sửa phân quyền của Admin
        if ("Admin".equalsIgnoreCase(existingPQ.getVaiTro().getTenVaiTro())) {
            throw new IllegalStateException("Không thể sửa phân quyền của Admin hệ thống");
        }

        // Cập nhật resource
        if (phanQuyenUpdate.getResource() != null && !phanQuyenUpdate.getResource().trim().isEmpty()) {
            existingPQ.setResource(phanQuyenUpdate.getResource());
        }

        // Cập nhật action
        if (phanQuyenUpdate.getAction() != null && !phanQuyenUpdate.getAction().trim().isEmpty()) {
            existingPQ.setAction(phanQuyenUpdate.getAction());
        }

        // Cập nhật vai trò nếu có
        if (phanQuyenUpdate.getVaiTro() != null && phanQuyenUpdate.getVaiTro().getId() != null) {
            VaiTro vaiTro = vaiTroRepository.findById(phanQuyenUpdate.getVaiTro().getId())
                .orElseThrow(() -> new IllegalArgumentException("Vai trò không tồn tại"));
            existingPQ.setVaiTro(vaiTro);
        }

        return phanQuyenRepository.save(existingPQ);
    }

    // 7. Xóa phân quyền
    @Transactional
    @PreAuthorize("hasAuthority('ADMIN:DELETE')")
    public void deletePhanQuyen(Integer id) {
        PhanQuyen phanQuyen = phanQuyenRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phân quyền với ID: " + id));

        // Không cho xóa phân quyền của Admin
        if ("Admin".equalsIgnoreCase(phanQuyen.getVaiTro().getTenVaiTro())) {
            throw new IllegalStateException("Không thể xóa phân quyền của Admin hệ thống");
        }

        phanQuyenRepository.delete(phanQuyen);
    }

    // 8. Xóa tất cả phân quyền của một vai trò
    @Transactional
    @PreAuthorize("hasAuthority('ADMIN:DELETE')")
    public void deleteAllByVaiTro(Integer vaiTroId) {
        VaiTro vaiTro = vaiTroRepository.findById(vaiTroId)
            .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy vai trò với ID: " + vaiTroId));

        // Không cho xóa phân quyền của Admin
        if ("Admin".equalsIgnoreCase(vaiTro.getTenVaiTro())) {
            throw new IllegalStateException("Không thể xóa phân quyền của Admin hệ thống");
        }

        List<PhanQuyen> phanQuyenList = phanQuyenRepository.findByVaiTro(vaiTro);
        phanQuyenRepository.deleteAll(phanQuyenList);
    }

    // 9. Tạo nhiều phân quyền cùng lúc cho một vai trò
    @Transactional
    @PreAuthorize("hasAuthority('ADMIN:CREATE')")
    public List<PhanQuyen> createBulkPhanQuyen(Integer vaiTroId, List<PhanQuyen> phanQuyenList) {
        VaiTro vaiTro = vaiTroRepository.findById(vaiTroId)
            .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy vai trò với ID: " + vaiTroId));

        // Gán vai trò cho tất cả phân quyền
        for (PhanQuyen pq : phanQuyenList) {
            pq.setVaiTro(vaiTro);
            
            // Validate
            if (pq.getResource() == null || pq.getResource().trim().isEmpty()) {
                throw new IllegalArgumentException("Resource không được để trống");
            }
            if (pq.getAction() == null || pq.getAction().trim().isEmpty()) {
                throw new IllegalArgumentException("Action không được để trống");
            }
        }

        return phanQuyenRepository.saveAll(phanQuyenList);
    }

    // 10. Kiểm tra quyền tồn tại
    public boolean existsPhanQuyen(Integer vaiTroId, String resource, String action) {
        VaiTro vaiTro = vaiTroRepository.findById(vaiTroId).orElse(null);
        if (vaiTro == null) return false;

        List<PhanQuyen> existing = phanQuyenRepository.findByVaiTroAndResourceAndAction(
            vaiTro, resource, action
        );
        return !existing.isEmpty();
    }
}