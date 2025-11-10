package cnpm.qlnk.demo.controller;

import cnpm.qlnk.demo.entity.ThuThienNguyen;
import cnpm.qlnk.demo.service.ThuThienNguyenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/thuthiennguyen")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ThuThienNguyenController {

    @Autowired
    private ThuThienNguyenService thuService;

    /**
     * GET /api/thuthiennguyen
     */
    @GetMapping
    public ResponseEntity<List<ThuThienNguyen>> getAll() {
        System.out.println("=== GET ALL THU THIEN NGUYEN ===");
        List<ThuThienNguyen> list = thuService.getAll();
        System.out.println("Found " + list.size() + " records");
        return ResponseEntity.ok(list);
    }

    /**
     * GET /api/thuthiennguyen/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Integer id) {
        System.out.println("=== GET THU BY ID: " + id + " ===");
        
        return thuService.getById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Không tìm thấy khoản thu với ID: " + id)));
    }

    /**
     * GET /api/thuthiennguyen/hoatdong/{hoatDongId}
     */
    @GetMapping("/hoatdong/{hoatDongId}")
    public ResponseEntity<List<ThuThienNguyen>> getByHoatDong(@PathVariable Integer hoatDongId) {
        System.out.println("=== GET THU BY HOAT DONG: " + hoatDongId + " ===");
        List<ThuThienNguyen> list = thuService.getByHoatDong(hoatDongId);
        return ResponseEntity.ok(list);
    }

    /**
     * POST /api/thuthiennguyen
     */
    @PostMapping
    public ResponseEntity<?> create(@RequestBody ThuThienNguyen thu) {
        System.out.println("=== CREATE THU THIEN NGUYEN ===");
        System.out.println("Số tiền: " + thu.getSoTien());
        System.out.println("Người đóng: " + thu.getNguoiDong());
        
        try {
            ThuThienNguyen saved = thuService.create(thu);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
                    
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Lỗi khi tạo khoản thu: " + e.getMessage()));
        }
    }

    /**
     * PUT /api/thuthiennguyen/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Integer id, @RequestBody ThuThienNguyen thu) {
        System.out.println("=== UPDATE THU ID: " + id + " ===");
        
        if (!thuService.getById(id).isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Không tìm thấy khoản thu với ID: " + id));
        }
        
        try {
            thu.setId(id);
            ThuThienNguyen updated = thuService.update(thu);
            return ResponseEntity.ok(updated);
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
                    
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Lỗi khi cập nhật: " + e.getMessage()));
        }
    }

    /**
     * DELETE /api/thuthiennguyen/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        System.out.println("=== DELETE THU ID: " + id + " ===");
        
        try {
            boolean deleted = thuService.delete(id);
            
            if (deleted) {
                return ResponseEntity.ok(Map.of("message", "Xóa thành công", "id", id));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Không tìm thấy khoản thu với ID: " + id));
            }
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Lỗi khi xóa: " + e.getMessage()));
        }
    }

    /**
     * GET /api/thuthiennguyen/search?keyword={keyword}
     */
    @GetMapping("/search")
    public ResponseEntity<List<ThuThienNguyen>> search(@RequestParam String keyword) {
        System.out.println("=== SEARCH THU: " + keyword + " ===");
        List<ThuThienNguyen> results = thuService.search(keyword);
        return ResponseEntity.ok(results);
    }

    /**
     * GET /api/thuthiennguyen/daterange?start={start}&end={end}
     */
    @GetMapping("/daterange")
    public ResponseEntity<List<ThuThienNguyen>> getByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        
        System.out.println("=== GET BY DATE RANGE ===");
        List<ThuThienNguyen> results = thuService.getByDateRange(start, end);
        return ResponseEntity.ok(results);
    }
}