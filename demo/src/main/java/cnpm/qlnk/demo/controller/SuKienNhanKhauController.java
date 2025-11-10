package cnpm.qlnk.demo.controller;

import cnpm.qlnk.demo.entity.SuKienNhanKhau;
import cnpm.qlnk.demo.service.SuKienNhanKhauService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sukien")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class SuKienNhanKhauController {

    @Autowired
    private SuKienNhanKhauService suKienNhanKhauService;

    /**
     * GET /api/sukien
     * Lấy TẤT CẢ sự kiện
     */
    @GetMapping
    public ResponseEntity<List<SuKienNhanKhau>> getAll(Authentication authentication) {
        System.out.println("=== GET ALL SU KIEN NHAN KHAU ===");
        System.out.println("User: " + (authentication != null ? authentication.getName() : "null"));
        
        List<SuKienNhanKhau> list = suKienNhanKhauService.getAll();
        System.out.println("Found " + list.size() + " records");
        
        return ResponseEntity.ok(list);
    }

    /**
     * GET /api/sukien/{id}
     * Lấy chi tiết 1 sự kiện
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        System.out.println("=== GET SU KIEN BY ID: " + id + " ===");
        
        return suKienNhanKhauService.getById(id)
                .<ResponseEntity<?>>map(record -> {
                    System.out.println("Found: " + record.getLoaiSuKien());
                    return ResponseEntity.ok(record);
                })
                .orElseGet(() -> {
                    System.err.println("Not found: ID " + id);
                    return ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(Map.of("message", "Không tìm thấy sự kiện với ID: " + id));
                });
    }

    /**
     * GET /api/sukien/loai/sinh
     * Lấy danh sách sự kiện SINH
     */
    @GetMapping("/loai/sinh")
    public ResponseEntity<List<SuKienNhanKhau>> getSinhList() {
        System.out.println("=== GET SINH LIST ===");
        
        List<SuKienNhanKhau> list = suKienNhanKhauService.getByLoai("Sinh");
        System.out.println("Found " + list.size() + " Sinh records");
        
        return ResponseEntity.ok(list);
    }

    /**
     * GET /api/sukien/loai/mat
     * Lấy danh sách sự kiện MẤT
     */
    @GetMapping("/loai/mat")
    public ResponseEntity<List<SuKienNhanKhau>> getMatList() {
        System.out.println("=== GET MAT LIST ===");
        
        List<SuKienNhanKhau> list = suKienNhanKhauService.getByLoai("Mất");
        System.out.println("Found " + list.size() + " Mất records");
        
        return ResponseEntity.ok(list);
    }

    /**
     * GET /api/sukien/nhankhau/{nhanKhauId}
     * Lấy lịch sử sự kiện của 1 nhân khẩu
     */
    @GetMapping("/nhankhau/{nhanKhauId}")
    public ResponseEntity<List<SuKienNhanKhau>> getByNhanKhau(@PathVariable Integer nhanKhauId) {
        System.out.println("=== GET SU KIEN BY NHAN KHAU: " + nhanKhauId + " ===");
        
        List<SuKienNhanKhau> list = suKienNhanKhauService.getByNhanKhauId(nhanKhauId);
        System.out.println("Found " + list.size() + " records for NhanKhau ID " + nhanKhauId);
        
        return ResponseEntity.ok(list);
    }

    /**
     * POST /api/sukien
     * Ghi nhận sự kiện mới (SINH hoặc MẤT)
     */
    @PostMapping
    public ResponseEntity<?> create(@RequestBody SuKienNhanKhau suKien) {
        System.out.println("=== CREATE SU KIEN NHAN KHAU ===");
        System.out.println("Loại: " + suKien.getLoaiSuKien());
        System.out.println("Ngày: " + suKien.getNgayGhiNhan());
        
        try {
            SuKienNhanKhau saved = suKienNhanKhauService.create(suKien);
            System.out.println("Created successfully with ID: " + saved.getId());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
            
        } catch (IllegalArgumentException e) {
            System.err.println("Validation error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
                    
        } catch (IllegalStateException e) {
            System.err.println("Business logic error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", e.getMessage()));
                    
        } catch (Exception e) {
            System.err.println("Unexpected error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Lỗi khi ghi nhận sự kiện: " + e.getMessage()));
        }
    }

    /**
     * PUT /api/sukien/{id}
     * Cập nhật thông tin sự kiện
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @RequestBody SuKienNhanKhau suKien) {
        
        System.out.println("=== UPDATE SU KIEN ID: " + id + " ===");
        
        if (!suKienNhanKhauService.getById(id).isPresent()) {
            System.err.println("Not found: ID " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Không tìm thấy sự kiện với ID: " + id));
        }
        
        try {
            suKien.setId(id);
            SuKienNhanKhau updated = suKienNhanKhauService.update(suKien);
            System.out.println("Updated successfully");
            
            return ResponseEntity.ok(updated);
            
        } catch (IllegalArgumentException e) {
            System.err.println("Validation error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
                    
        } catch (Exception e) {
            System.err.println("Unexpected error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Lỗi khi cập nhật sự kiện: " + e.getMessage()));
        }
    }

    /**
     * DELETE /api/sukien/{id}
     * Xóa sự kiện
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        System.out.println("=== DELETE SU KIEN ID: " + id + " ===");
        
        try {
            boolean deleted = suKienNhanKhauService.delete(id);
            
            if (deleted) {
                System.out.println("Deleted successfully");
                return ResponseEntity.ok(Map.of(
                    "message", "Xóa sự kiện thành công",
                    "id", id
                ));
            } else {
                System.err.println("Not found: ID " + id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Không tìm thấy sự kiện với ID: " + id));
            }
            
        } catch (Exception e) {
            System.err.println("Unexpected error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Lỗi khi xóa sự kiện: " + e.getMessage()));
        }
    }

    /**
     * GET /api/sukien/search?keyword={keyword}
     * Tìm kiếm sự kiện
     */
    @GetMapping("/search")
    public ResponseEntity<List<SuKienNhanKhau>> search(@RequestParam String keyword) {
        System.out.println("=== SEARCH SU KIEN: " + keyword + " ===");
        
        List<SuKienNhanKhau> results = suKienNhanKhauService.search(keyword);
        System.out.println("Found " + results.size() + " results");
        
        return ResponseEntity.ok(results);
    }

    /**
     * GET /api/sukien/daterange?start={start}&end={end}
     * Lấy sự kiện trong khoảng thời gian
     */
    @GetMapping("/daterange")
    public ResponseEntity<List<SuKienNhanKhau>> getByDateRange(
            @RequestParam String start,
            @RequestParam String end) {
        
        System.out.println("=== GET BY DATE RANGE: " + start + " to " + end + " ===");
        
        LocalDate startDate = LocalDate.parse(start);
        LocalDate endDate = LocalDate.parse(end);
        
        List<SuKienNhanKhau> results = suKienNhanKhauService.getByDateRange(startDate, endDate);
        System.out.println("Found " + results.size() + " records");
        
        return ResponseEntity.ok(results);
    }

    /**
     * GET /api/sukien/stats
     * Thống kê số lượng sự kiện Sinh/Mất
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        System.out.println("=== GET STATS ===");
        
        Long countSinh = suKienNhanKhauService.countSinh();
        Long countMat = suKienNhanKhauService.countMat();
        
        Map<String, Long> stats = Map.of(
            "sinh", countSinh,
            "mat", countMat,
            "total", countSinh + countMat
        );
        
        System.out.println("Stats: " + stats);
        
        return ResponseEntity.ok(stats);
    }
}