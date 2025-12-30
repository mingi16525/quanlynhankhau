package cnpm.qlnk.demo.controller;

import cnpm.qlnk.demo.entity.TaiKhoan;
import cnpm.qlnk.demo.service.TaiKhoanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/taikhoan")
public class TaiKhoanController {

    @Autowired
    private TaiKhoanService taiKhoanService;

    // GET /api/admin/taikhoan - Lấy tất cả tài khoản
    @PreAuthorize("hasAuthority('TAI_KHOAN:READ') or hasAuthority('*:*')")
    @GetMapping
    public ResponseEntity<List<TaiKhoan>> getAllTaiKhoan(Authentication authentication) {
        System.out.println("=== GET ALL TAIKHOAN ===");
        System.out.println("User: " + (authentication != null ? authentication.getName() : "null"));
        System.out.println("Authorities: " + (authentication != null ? authentication.getAuthorities() : "null"));
        
        List<TaiKhoan> list = taiKhoanService.getAllTaiKhoan();
        System.out.println("=== RETURNING " + list.size() + " ITEMS ===");
        
        return ResponseEntity.ok(list);
    }  

    // GET /api/admin/taikhoan/{id} - Lấy chi tiết tài khoản
    @PreAuthorize("hasAuthority('TAI_KHOAN:READ') or hasAuthority('*:*')")
    @GetMapping("/{id}")
    public ResponseEntity<?> getTaiKhoanById(@PathVariable Integer id) {
        try {
            TaiKhoan taiKhoan = taiKhoanService.getTaiKhoanById(id);
            return ResponseEntity.ok(taiKhoan);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", e.getMessage()));
        }
    }

    // POST /api/admin/taikhoan/{tenVaiTro} - Tạo tài khoản mới
    @PreAuthorize("hasAuthority('TAI_KHOAN:CREATE') or hasAuthority('*:*')")
    @PostMapping("/{tenVaiTro}")
    public ResponseEntity<?> createTaiKhoan(
            @RequestBody TaiKhoan taiKhoan, 
            @PathVariable String tenVaiTro) {
        try {
            TaiKhoan savedTk = taiKhoanService.createTaiKhoan(taiKhoan, tenVaiTro);
            return new ResponseEntity<>(savedTk, HttpStatus.CREATED);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("message", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", e.getMessage()));
        }
    }

    // PUT /api/admin/taikhoan/{id} - Cập nhật tài khoản
    @PreAuthorize("hasAuthority('TAI_KHOAN:UPDATE') or hasAuthority('*:*')")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTaiKhoan(
            @PathVariable Integer id,
            @RequestBody TaiKhoan taiKhoan,
            @RequestParam(required = false) String tenVaiTro) {
        try {
            TaiKhoan updated = taiKhoanService.updateTaiKhoan(id, taiKhoan, tenVaiTro);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("message", e.getMessage()));
        }
    }

    // PUT /api/admin/taikhoan/{id}/lock - Khóa/mở khóa tài khoản
    @PreAuthorize("hasAuthority('TAI_KHOAN:UPDATE') or hasAuthority('*:*')")
    @PutMapping("/{id}/lock")
    public ResponseEntity<?> toggleLock(@PathVariable Integer id) {
        try {
            taiKhoanService.lockTaiKhoan(id);
            return ResponseEntity.ok(Map.of("message", "Đã thay đổi trạng thái tài khoản"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", e.getMessage()));
        }
    }

    // PUT /api/admin/taikhoan/{id}/reset-password - Reset mật khẩu
    @PreAuthorize("hasAuthority('TAI_KHOAN:UPDATE') or hasAuthority('*:*')")
    @PutMapping("/{id}/reset-password")
    public ResponseEntity<?> resetPassword(
            @PathVariable Integer id,
            @RequestBody Map<String, String> request) {
        try {
            String newPassword = request.get("newPassword");
            if (newPassword == null || newPassword.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Mật khẩu mới không được để trống"));
            }
            taiKhoanService.resetPassword(id, newPassword);
            return ResponseEntity.ok(Map.of("message", "Đã reset mật khẩu thành công"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", e.getMessage()));
        }
    }

    // DELETE /api/admin/taikhoan/{id} - Xóa tài khoản
    @PreAuthorize("hasAuthority('TAI_KHOAN:DELETE') or hasAuthority('*:*')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTaiKhoan(@PathVariable Integer id) {
        try {
            taiKhoanService.deleteTaiKhoan(id);
            return ResponseEntity.ok(Map.of("message", "Đã xóa tài khoản thành công"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", e.getMessage()));
        }
    }
}