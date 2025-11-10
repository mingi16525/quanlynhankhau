package cnpm.qlnk.demo.controller;

import cnpm.qlnk.demo.entity.PhanQuyen;
import cnpm.qlnk.demo.service.PhanQuyenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/phanquyen")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class PhanQuyenController {

    @Autowired
    private PhanQuyenService phanQuyenService;

    // Lấy tất cả phân quyền
    @GetMapping
    public ResponseEntity<List<PhanQuyen>> getAllPhanQuyen() {
        return ResponseEntity.ok(phanQuyenService.getAllPhanQuyen());
    }

    // Lấy phân quyền theo ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getPhanQuyenById(@PathVariable Integer id) {
        try {
            PhanQuyen phanQuyen = phanQuyenService.getPhanQuyenById(id);
            return ResponseEntity.ok(phanQuyen);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", e.getMessage()));
        }
    }

    // Lấy phân quyền theo vai trò
    @GetMapping("/vaitro/{vaiTroId}")
    public ResponseEntity<?> getPhanQuyenByVaiTro(@PathVariable Integer vaiTroId) {
        try {
            List<PhanQuyen> phanQuyenList = phanQuyenService.getPhanQuyenByVaiTro(vaiTroId);
            return ResponseEntity.ok(phanQuyenList);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", e.getMessage()));
        }
    }

    // Thêm phân quyền mới
    @PostMapping
    public ResponseEntity<?> createPhanQuyen(@RequestBody PhanQuyen phanQuyen) {
        try {
            PhanQuyen saved = phanQuyenService.createPhanQuyen(phanQuyen);
            return new ResponseEntity<>(saved, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("message", e.getMessage()));
        }
    }

    // Thêm nhiều phân quyền cùng lúc
    @PostMapping("/bulk/{vaiTroId}")
    public ResponseEntity<?> createBulkPhanQuyen(
            @PathVariable Integer vaiTroId,
            @RequestBody List<PhanQuyen> phanQuyenList) {
        try {
            List<PhanQuyen> saved = phanQuyenService.createBulkPhanQuyen(vaiTroId, phanQuyenList);
            return new ResponseEntity<>(saved, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", e.getMessage()));
        }
    }

    // Cập nhật phân quyền
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePhanQuyen(@PathVariable Integer id, @RequestBody PhanQuyen phanQuyen) {
        try {
            PhanQuyen updated = phanQuyenService.updatePhanQuyen(id, phanQuyen);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", e.getMessage()));
        }
    }

    // Xóa phân quyền
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePhanQuyen(@PathVariable Integer id) {
        try {
            phanQuyenService.deletePhanQuyen(id);
            return ResponseEntity.ok(Map.of("message", "Đã xóa phân quyền"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", e.getMessage()));
        }
    }

    // Xóa tất cả phân quyền của một vai trò
    @DeleteMapping("/vaitro/{vaiTroId}")
    public ResponseEntity<?> deleteAllByVaiTro(@PathVariable Integer vaiTroId) {
        try {
            phanQuyenService.deleteAllByVaiTro(vaiTroId);
            return ResponseEntity.ok(Map.of("message", "Đã xóa tất cả phân quyền của vai trò"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", e.getMessage()));
        }
    }
}