package cnpm.qlnk.demo.controller;

import cnpm.qlnk.demo.entity.HoatDongThienNguyen;
import cnpm.qlnk.demo.service.HoatDongThienNguyenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/hoatdong")
public class HoatDongThienNguyenController {

    @Autowired
    private HoatDongThienNguyenService hoatDongService;

    /**
     * GET /api/hoatdong
     * Lấy TẤT CẢ hoạt động
     */
    @PreAuthorize("hasAuthority('HOAT_DONG_THIEN_NGUYEN:READ') or hasAuthority('*:*')")
    @GetMapping
    public ResponseEntity<List<HoatDongThienNguyen>> getAll() {
        System.out.println("=== GET ALL HOAT DONG ===");
        List<HoatDongThienNguyen> list = hoatDongService.getAll();
        System.out.println("Found " + list.size() + " records");
        return ResponseEntity.ok(list);
    }

    /**
     * GET /api/hoatdong/{id}
     */
    @PreAuthorize("hasAuthority('HOAT_DONG_THIEN_NGUYEN:READ') or hasAuthority('*:*')")
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Integer id) {
        System.out.println("=== GET HOAT DONG BY ID: " + id + " ===");
        
        return hoatDongService.getById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Không tìm thấy hoạt động với ID: " + id)));
    }

    /**
     * GET /api/hoatdong/active
     */
    @PreAuthorize("hasAuthority('HOAT_DONG_THIEN_NGUYEN:READ') or hasAuthority('*:*')")
    @GetMapping("/active")
    public ResponseEntity<List<HoatDongThienNguyen>> getActive() {
        System.out.println("=== GET ACTIVE HOAT DONG ===");
        List<HoatDongThienNguyen> list = hoatDongService.getActiveHoatDong();
        return ResponseEntity.ok(list);
    }

    /**
     * GET /api/hoatdong/trangthai/{trangThai}
     */
    @PreAuthorize("hasAuthority('HOAT_DONG_THIEN_NGUYEN:READ') or hasAuthority('*:*')")
    @GetMapping("/trangthai/{trangThai}")
    public ResponseEntity<List<HoatDongThienNguyen>> getByTrangThai(@PathVariable String trangThai) {
        System.out.println("=== GET BY TRANG THAI: " + trangThai + " ===");
        List<HoatDongThienNguyen> list = hoatDongService.getByTrangThai(trangThai);
        return ResponseEntity.ok(list);
    }

    /**
     * GET /api/hoatdong/{id}/thongke
     * Thống kê chi tiết của một hoạt động
     */
    @PreAuthorize("hasAuthority('HOAT_DONG_THIEN_NGUYEN:READ') or hasAuthority('*:*')")
    @GetMapping("/{id}/thongke")
    public ResponseEntity<Map<String, Object>> getThongKe(@PathVariable Integer id) {
        System.out.println("=== GET THONG KE - HOAT DONG: " + id + " ===");
        
        try {
            Map<String, Object> stats = hoatDongService.getThongKe(id);
            return ResponseEntity.ok(stats);
            
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * POST /api/hoatdong
     */
    @PreAuthorize("hasAuthority('HOAT_DONG_THIEN_NGUYEN:CREATE') or hasAuthority('*:*')")
    @PostMapping
    public ResponseEntity<?> create(@RequestBody HoatDongThienNguyen hoatDong) {
        System.out.println("=== CREATE HOAT DONG ===");
        System.out.println("Tên: " + hoatDong.getTenHoatDong());
        
        try {
            HoatDongThienNguyen saved = hoatDongService.create(hoatDong);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
                    
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Lỗi khi tạo hoạt động: " + e.getMessage()));
        }
    }

    /**
     * PUT /api/hoatdong/{id}
     */
    @PreAuthorize("hasAuthority('HOAT_DONG_THIEN_NGUYEN:UPDATE') or hasAuthority('*:*')")
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Integer id, @RequestBody HoatDongThienNguyen hoatDong) {
        System.out.println("=== UPDATE HOAT DONG ID: " + id + " ===");
        
        if (!hoatDongService.getById(id).isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Không tìm thấy hoạt động với ID: " + id));
        }
        
        try {
            hoatDong.setId(id);
            HoatDongThienNguyen updated = hoatDongService.update(hoatDong);
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
     * DELETE /api/hoatdong/{id}
     */
    @PreAuthorize("hasAuthority('HOAT_DONG_THIEN_NGUYEN:DELETE') or hasAuthority('*:*')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        System.out.println("=== DELETE HOAT DONG ID: " + id + " ===");
        
        try {
            boolean deleted = hoatDongService.delete(id);
            
            if (deleted) {
                return ResponseEntity.ok(Map.of("message", "Xóa thành công", "id", id));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Không tìm thấy hoạt động với ID: " + id));
            }
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Lỗi khi xóa: " + e.getMessage()));
        }
    }

    /**
     * GET /api/hoatdong/search?keyword={keyword}
     */
    @PreAuthorize("hasAuthority('HOAT_DONG_THIEN_NGUYEN:READ') or hasAuthority('*:*')")
    @GetMapping("/search")
    public ResponseEntity<List<HoatDongThienNguyen>> search(@RequestParam String keyword) {
        System.out.println("=== SEARCH HOAT DONG: " + keyword + " ===");
        List<HoatDongThienNguyen> results = hoatDongService.search(keyword);
        return ResponseEntity.ok(results);
    }

    /**
     * GET /api/hoatdong/daterange?start={start}&end={end}
     */
    @PreAuthorize("hasAuthority('HOAT_DONG_THIEN_NGUYEN:READ') or hasAuthority('*:*')")
    @GetMapping("/daterange")
    public ResponseEntity<List<HoatDongThienNguyen>> getByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        
        System.out.println("=== GET BY DATE RANGE ===");
        List<HoatDongThienNguyen> results = hoatDongService.getByDateRange(start, end);
        return ResponseEntity.ok(results);
    }
}