package cnpm.qlnk.demo.controller;

import cnpm.qlnk.demo.entity.VaiTro;
import cnpm.qlnk.demo.service.VaiTroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/vaitro")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class VaiTroController {

    @Autowired
    private VaiTroService vaiTroService;

    // Lấy tất cả vai trò
    @PreAuthorize("hasAuthority('VAI_TRO:READ') or hasAuthority('*:*')")
    @GetMapping
    public ResponseEntity<List<VaiTro>> getAllVaiTro() {
        return ResponseEntity.ok(vaiTroService.getAllVaiTro());
    }

    // Lấy vai trò theo ID
    @PreAuthorize("hasAuthority('VAI_TRO:READ') or hasAuthority('*:*')")
    @GetMapping("/{id}")
    public ResponseEntity<?> getVaiTroById(@PathVariable Integer id) {
        try {
            VaiTro vaiTro = vaiTroService.getVaiTroById(id);
            return ResponseEntity.ok(vaiTro);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", e.getMessage()));
        }
    }

    // Tạo vai trò mới
    @PreAuthorize("hasAuthority('VAI_TRO:CREATE') or hasAuthority('*:*')")
    @PostMapping
    public ResponseEntity<?> createVaiTro(@RequestBody VaiTro vaiTro) {
        try {
            VaiTro saved = vaiTroService.createVaiTro(vaiTro);
            return new ResponseEntity<>(saved, HttpStatus.CREATED);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("message", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", e.getMessage()));
        }
    }

    // Cập nhật vai trò
    @PreAuthorize("hasAuthority('VAI_TRO:UPDATE') or hasAuthority('*:*')")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateVaiTro(@PathVariable Integer id, @RequestBody VaiTro vaiTro) {
        try {
            VaiTro updated = vaiTroService.updateVaiTro(id, vaiTro);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("message", e.getMessage()));
        }
    }

    // Xóa vai trò
    @PreAuthorize("hasAuthority('VAI_TRO:DELETE') or hasAuthority('*:*')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVaiTro(@PathVariable Integer id) {
        try {
            vaiTroService.deleteVaiTro(id);
            return ResponseEntity.ok(Map.of("message", "Đã xóa vai trò thành công"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", e.getMessage()));
        }
    }
}