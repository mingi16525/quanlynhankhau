package cnpm.qlnk.demo.controller;

import cnpm.qlnk.demo.entity.GhiNhanThayDoiHoKhau;
import cnpm.qlnk.demo.service.GhiNhanThayDoiHoKhauService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ghinhanthaydoi")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class GhiNhanThayDoiHoKhauController {

    @Autowired
    private GhiNhanThayDoiHoKhauService ghiNhanService;

    /**
     * GET /api/ghinhanthaydoi
     * Lấy TẤT CẢ lịch sử thay đổi
     */
    @PreAuthorize("hasAuthority('GHI_NHAN:READ') or hasAuthority('*:*')")
    @GetMapping
    public ResponseEntity<List<GhiNhanThayDoiHoKhau>> getAll(Authentication authentication) {
        System.out.println("=== GET ALL GHI NHAN THAY DOI HO KHAU ===");
        System.out.println("User: " + (authentication != null ? authentication.getName() : "null"));
        
        List<GhiNhanThayDoiHoKhau> list = ghiNhanService.getAll();
        System.out.println("Found " + list.size() + " records");
        
        return ResponseEntity.ok(list);
    }

    /**
     * GET /api/ghinhanthaydoi/{id}
     * Lấy chi tiết 1 bản ghi
     */
    @PreAuthorize("hasAuthority('GHI_NHAN:READ') or hasAuthority('*:*')")
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        System.out.println("=== GET GHI NHAN BY ID: " + id + " ===");
        
        return ghiNhanService.getById(id)
                .<ResponseEntity<?>>map(record -> {
                    System.out.println("Found: " + record.getTenSuKien());
                    return ResponseEntity.ok(record);
                })
                .orElseGet(() -> {
                    System.err.println("Not found: ID " + id);
                    return ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(Map.of("message", "Không tìm thấy bản ghi với ID: " + id));
                });
    }

    /**
     * GET /api/ghinhanthaydoi/hokhau/{hoKhauId}
     * Lấy lịch sử thay đổi của một hộ khẩu
     */
    @PreAuthorize("hasAuthority('GHI_NHAN:READ') or hasAuthority('*:*')")
    @GetMapping("/hokhau/{hoKhauId}")
    public ResponseEntity<List<GhiNhanThayDoiHoKhau>> getByHoKhau(@PathVariable Integer hoKhauId) {
        System.out.println("=== GET GHI NHAN BY HO KHAU: " + hoKhauId + " ===");
        
        List<GhiNhanThayDoiHoKhau> list = ghiNhanService.getByHoKhau(hoKhauId);
        System.out.println("Found " + list.size() + " records for HoKhau ID " + hoKhauId);
        
        return ResponseEntity.ok(list);
    }

    /**
     * GET /api/ghinhanthaydoi/sukien/{tenSuKien}
     * Lấy theo loại sự kiện
     */
    @PreAuthorize("hasAuthority('GHI_NHAN:READ') or hasAuthority('*:*')")
    @GetMapping("/sukien/{tenSuKien}")
    public ResponseEntity<List<GhiNhanThayDoiHoKhau>> getByTenSuKien(@PathVariable String tenSuKien) {
        System.out.println("=== GET GHI NHAN BY TEN SU KIEN: " + tenSuKien + " ===");
        
        List<GhiNhanThayDoiHoKhau> list = ghiNhanService.getByTenSuKien(tenSuKien);
        System.out.println("Found " + list.size() + " records");
        
        return ResponseEntity.ok(list);
    }

    /**
     * GET /api/ghinhanthaydoi/nguoithuchien/{username}
     * Lấy theo người thực hiện
     */
    @PreAuthorize("hasAuthority('GHI_NHAN:READ') or hasAuthority('*:*')")
    @GetMapping("/nguoithuchien/{username}")
    public ResponseEntity<List<GhiNhanThayDoiHoKhau>> getByNguoiThucHien(@PathVariable String username) {
        System.out.println("=== GET GHI NHAN BY NGUOI THUC HIEN: " + username + " ===");
        
        List<GhiNhanThayDoiHoKhau> list = ghiNhanService.getByNguoiThucHien(username);
        System.out.println("Found " + list.size() + " records");
        
        return ResponseEntity.ok(list);
    }

    /**
     * GET /api/ghinhanthaydoi/search?keyword={keyword}
     * Tìm kiếm trong mô tả và tên sự kiện
     */
    @PreAuthorize("hasAuthority('GHI_NHAN:READ') or hasAuthority('*:*')")
    @GetMapping("/search")
    public ResponseEntity<List<GhiNhanThayDoiHoKhau>> search(@RequestParam String keyword) {
        System.out.println("=== SEARCH GHI NHAN: " + keyword + " ===");
        
        List<GhiNhanThayDoiHoKhau> results = ghiNhanService.search(keyword);
        System.out.println("Found " + results.size() + " results");
        
        return ResponseEntity.ok(results);
    }

    /**
     * GET /api/ghinhanthaydoi/daterange?start={start}&end={end}
     * Lấy theo khoảng thời gian
     */
    @PreAuthorize("hasAuthority('GHI_NHAN:READ') or hasAuthority('*:*')")
    @GetMapping("/daterange")
    public ResponseEntity<List<GhiNhanThayDoiHoKhau>> getByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        
        System.out.println("=== GET BY DATE RANGE: " + start + " to " + end + " ===");
        
        List<GhiNhanThayDoiHoKhau> results = ghiNhanService.getByDateRange(start, end);
        System.out.println("Found " + results.size() + " records");
        
        return ResponseEntity.ok(results);
    }

    /**
     * DELETE /api/ghinhanthaydoi/{id}
     * Xóa bản ghi
     */
    @PreAuthorize("hasAuthority('GHI_NHAN:READ') or hasAuthority('*:*')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        System.out.println("=== DELETE GHI NHAN ID: " + id + " ===");
        
        try {
            boolean deleted = ghiNhanService.delete(id);
            
            if (deleted) {
                System.out.println("Deleted successfully");
                return ResponseEntity.ok(Map.of(
                    "message", "Xóa bản ghi thành công",
                    "id", id
                ));
            } else {
                System.err.println("Not found: ID " + id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Không tìm thấy bản ghi với ID: " + id));
            }
            
        } catch (Exception e) {
            System.err.println("Unexpected error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Lỗi khi xóa bản ghi: " + e.getMessage()));
        }
    }
}
