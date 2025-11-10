package cnpm.qlnk.demo.controller;

import cnpm.qlnk.demo.entity.DanhSachChi;
import cnpm.qlnk.demo.service.DanhSachChiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chi")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class DanhSachChiController {

    @Autowired
    private DanhSachChiService chiService;

    /**
     * GET /api/chi
     * Lấy TẤT CẢ danh sách chi
     */
    @GetMapping
    public ResponseEntity<List<DanhSachChi>> getAll() {
        System.out.println("=== GET ALL DANH SACH CHI ===");
        List<DanhSachChi> list = chiService.getAll();
        System.out.println("Found " + list.size() + " records");
        return ResponseEntity.ok(list);
    }

    /**
     * GET /api/chi/{id}
     * Lấy chi tiết 1 khoản chi
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        System.out.println("=== GET CHI BY ID: " + id + " ===");
        
        return chiService.getById(id)
                .<ResponseEntity<?>>map(record -> {
                    System.out.println("Found: " + record.getNoiDungChi());
                    return ResponseEntity.ok(record);
                })
                .orElseGet(() -> {
                    System.err.println("Not found: ID " + id);
                    return ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(Map.of("message", "Không tìm thấy khoản chi với ID: " + id));
                });
    }

    /**
     * GET /api/chi/loai/{loaiChi}
     * Lấy danh sách chi theo loại
     */
    @GetMapping("/loai/{loaiChi}")
    public ResponseEntity<List<DanhSachChi>> getByLoai(@PathVariable String loaiChi) {
        System.out.println("=== GET CHI BY LOAI: " + loaiChi + " ===");
        List<DanhSachChi> list = chiService.getByLoai(loaiChi);
        System.out.println("Found " + list.size() + " records");
        return ResponseEntity.ok(list);
    }

    /**
     * POST /api/chi
     * Tạo khoản chi mới
     */
    @PostMapping
    public ResponseEntity<?> create(@RequestBody DanhSachChi chi) {
        System.out.println("=== CREATE DANH SACH CHI ===");
        System.out.println("Nội dung: " + chi.getNoiDungChi());
        System.out.println("Loại: " + chi.getLoaiChi());
        System.out.println("Số tiền: " + chi.getSoTien());
        
        try {
            DanhSachChi saved = chiService.create(chi);
            System.out.println("Created successfully with ID: " + saved.getId());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
            
        } catch (IllegalArgumentException e) {
            System.err.println("Validation error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
                    
        } catch (Exception e) {
            System.err.println("Unexpected error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Lỗi khi tạo khoản chi: " + e.getMessage()));
        }
    }

    /**
     * PUT /api/chi/{id}
     * Cập nhật khoản chi
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @RequestBody DanhSachChi chi) {
        
        System.out.println("=== UPDATE CHI ID: " + id + " ===");
        
        if (!chiService.getById(id).isPresent()) {
            System.err.println("Not found: ID " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Không tìm thấy khoản chi với ID: " + id));
        }
        
        try {
            chi.setId(id);
            DanhSachChi updated = chiService.update(chi);
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
                    .body(Map.of("message", "Lỗi khi cập nhật khoản chi: " + e.getMessage()));
        }
    }

    /**
     * DELETE /api/chi/{id}
     * Xóa khoản chi
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        System.out.println("=== DELETE CHI ID: " + id + " ===");
        
        try {
            boolean deleted = chiService.delete(id);
            
            if (deleted) {
                System.out.println("Deleted successfully");
                return ResponseEntity.ok(Map.of(
                    "message", "Xóa khoản chi thành công",
                    "id", id
                ));
            } else {
                System.err.println("Not found: ID " + id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Không tìm thấy khoản chi với ID: " + id));
            }
            
        } catch (Exception e) {
            System.err.println("Unexpected error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Lỗi khi xóa khoản chi: " + e.getMessage()));
        }
    }

    /**
     * GET /api/chi/search?keyword={keyword}
     * Tìm kiếm khoản chi theo nội dung
     */
    @GetMapping("/search")
    public ResponseEntity<List<DanhSachChi>> search(@RequestParam String keyword) {
        System.out.println("=== SEARCH CHI: " + keyword + " ===");
        
        List<DanhSachChi> results = chiService.search(keyword);
        System.out.println("Found " + results.size() + " results");
        
        return ResponseEntity.ok(results);
    }

    /**
     * GET /api/chi/daterange?start={start}&end={end}
     * Lấy danh sách chi trong khoảng thời gian
     */
    @GetMapping("/daterange")
    public ResponseEntity<List<DanhSachChi>> getByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        
        System.out.println("=== GET CHI BY DATE RANGE: " + start + " to " + end + " ===");
        List<DanhSachChi> results = chiService.getByDateRange(start, end);
        System.out.println("Found " + results.size() + " records");
        
        return ResponseEntity.ok(results);
    }

    /**
     * GET /api/chi/thongke
     * Thống kê tổng chi
     */
    @GetMapping("/thongke")
    public ResponseEntity<Map<String, Object>> getThongKe() {
        System.out.println("=== GET THONG KE CHI ===");
        
        Map<String, Object> stats = new HashMap<>();
        
        List<DanhSachChi> allChi = chiService.getAll();
        BigDecimal tongChi = allChi.stream()
                .map(DanhSachChi::getSoTien)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        stats.put("tongSoKhoanChi", allChi.size());
        stats.put("tongTienChi", tongChi);
        
        // Thống kê theo loại
        Map<String, BigDecimal> chiTheoLoai = new HashMap<>();
        for (DanhSachChi chi : allChi) {
            String loai = chi.getLoaiChi();
            chiTheoLoai.put(loai, 
                chiTheoLoai.getOrDefault(loai, BigDecimal.ZERO).add(chi.getSoTien())
            );
        }
        stats.put("chiTheoLoai", chiTheoLoai);
        
        System.out.println("Stats: " + stats);
        
        return ResponseEntity.ok(stats);
    }

    /**
     * GET /api/chi/thongke/loai/{loaiChi}
     * Tính tổng chi theo loại
     */
    @GetMapping("/thongke/loai/{loaiChi}")
    public ResponseEntity<Map<String, Object>> getTotalByLoai(@PathVariable String loaiChi) {
        System.out.println("=== GET TOTAL CHI BY LOAI: " + loaiChi + " ===");
        
        BigDecimal total = chiService.calculateTotalByLoai(loaiChi);
        
        Map<String, Object> result = Map.of(
            "loaiChi", loaiChi,
            "tongTien", total
        );
        
        System.out.println("Total: " + total);
        
        return ResponseEntity.ok(result);
    }

    /**
     * GET /api/chi/thongke/daterange?start={start}&end={end}
     * Tính tổng chi trong khoảng thời gian
     */
    @GetMapping("/thongke/daterange")
    public ResponseEntity<Map<String, Object>> getTotalByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        
        System.out.println("=== GET TOTAL CHI BY DATE RANGE ===");
        
        BigDecimal total = chiService.calculateTotalByDateRange(start, end);
        
        Map<String, Object> result = Map.of(
            "startDate", start,
            "endDate", end,
            "tongTien", total
        );
        
        System.out.println("Total: " + total);
        
        return ResponseEntity.ok(result);
    }
}