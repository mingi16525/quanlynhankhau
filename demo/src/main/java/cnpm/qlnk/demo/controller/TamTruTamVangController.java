package cnpm.qlnk.demo.controller;

import cnpm.qlnk.demo.entity.TamTruTamVang;
import cnpm.qlnk.demo.service.TamTruTamVangService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tamtrutamvang")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class TamTruTamVangController {

    @Autowired
    private TamTruTamVangService tamTruTamVangService;

    /**
     * GET /api/tamtrutamvang
     * Lấy TẤT CẢ đăng ký
     */
    @PreAuthorize("hasAuthority('TAM_TRU_VANG:READ') or hasAuthority('*:*')")
    @GetMapping
    public ResponseEntity<List<TamTruTamVang>> getAll(Authentication authentication) {
        System.out.println("=== GET ALL TAM TRU TAM VANG ===");
        System.out.println("User: " + (authentication != null ? authentication.getName() : "null"));
        
        List<TamTruTamVang> list = tamTruTamVangService.getAll();
        System.out.println("Found " + list.size() + " records");
        
        return ResponseEntity.ok(list);
    }

    /**
     * GET /api/tamtrutamvang/{id}
     * Lấy chi tiết 1 đăng ký
     */
    @PreAuthorize("hasAuthority('TAM_TRU_VANG:READ') or hasAuthority('*:*')")
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        System.out.println("=== GET TAM TRU TAM VANG BY ID: " + id + " ===");
        
        return tamTruTamVangService.getById(id)
                .<ResponseEntity<?>>map(record -> {
                    System.out.println("Found: " + record.getLoai() + " - " + record.getNhanKhau().getHoTen());
                    return ResponseEntity.ok(record);
                })
                .orElseGet(() -> {
                    System.err.println("Not found: ID " + id);
                    return ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(Map.of("message", "Không tìm thấy đăng ký với ID: " + id));
                });
    }

    /**
     * GET /api/tamtrutamvang/loai/tamtru
     * Lấy danh sách TẠM TRÚ
     * 
     * @param tuNgay Ngày bắt đầu đăng ký (optional)
     * @param denNgay Ngày kết thúc đăng ký (optional)
     */
    @PreAuthorize("hasAuthority('TAM_TRU_VANG:READ') or hasAuthority('*:*')")
    @GetMapping("/loai/tamtru")
    public ResponseEntity<List<TamTruTamVang>> getTamTruList(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate tuNgay,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate denNgay
    ) {
        System.out.println("=== GET TAM TRU LIST ===");
        System.out.println("Từ ngày: " + tuNgay + ", Đến ngày: " + denNgay);
        
        List<TamTruTamVang> list = tamTruTamVangService.getByLoaiAndDateRange("Tạm trú", tuNgay, denNgay);
        System.out.println("Found " + list.size() + " Tạm trú records");
        
        return ResponseEntity.ok(list);
    }

    /**
     * GET /api/tamtrutamvang/loai/tamvang
     * Lấy danh sách TẠM VẮNG
     * 
     * @param tuNgay Ngày bắt đầu đăng ký (optional)
     * @param denNgay Ngày kết thúc đăng ký (optional)
     */
    @PreAuthorize("hasAuthority('TAM_TRU_VANG:READ') or hasAuthority('*:*')")
    @GetMapping("/loai/tamvang")
    public ResponseEntity<List<TamTruTamVang>> getTamVangList(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate tuNgay,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate denNgay
    ) {
        System.out.println("=== GET TAM VANG LIST ===");
        System.out.println("Từ ngày: " + tuNgay + ", Đến ngày: " + denNgay);
        
        List<TamTruTamVang> list = tamTruTamVangService.getByLoaiAndDateRange("Tạm vắng", tuNgay, denNgay);
        System.out.println("Found " + list.size() + " Tạm vắng records");
        
        return ResponseEntity.ok(list);
    }

    /**
     * GET /api/tamtrutamvang/nhankhau/{nhanKhauId}
     * Lấy lịch sử tạm trú/tạm vắng của 1 nhân khẩu
     */
    @PreAuthorize("hasAuthority('TAM_TRU_VANG:READ') or hasAuthority('*:*')")
    @GetMapping("/nhankhau/{nhanKhauId}")
    public ResponseEntity<List<TamTruTamVang>> getByNhanKhau(@PathVariable Integer nhanKhauId) {
        System.out.println("=== GET TAM TRU TAM VANG BY NHAN KHAU: " + nhanKhauId + " ===");
        
        List<TamTruTamVang> list = tamTruTamVangService.getByNhanKhauId(nhanKhauId);
        System.out.println("Found " + list.size() + " records for NhanKhau ID " + nhanKhauId);
        
        return ResponseEntity.ok(list);
    }

    /**
     * POST /api/tamtrutamvang
     * Đăng ký TẠM TRÚ hoặc TẠM VẮNG
     */
    @PreAuthorize("hasAuthority('TAM_TRU_VANG:CREATE') or hasAuthority('*:*')")
    @PostMapping
    public ResponseEntity<?> create(@RequestBody TamTruTamVang tamTruTamVang) {
        System.out.println("=== CREATE TAM TRU TAM VANG ===");
        System.out.println("Loại: " + tamTruTamVang.getLoai());
        System.out.println("Nhân khẩu ID: " + (tamTruTamVang.getNhanKhau() != null ? tamTruTamVang.getNhanKhau().getId() : "null"));
        
        try {
            TamTruTamVang saved = tamTruTamVangService.create(tamTruTamVang);
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
                    .body(Map.of("message", "Lỗi khi tạo đăng ký: " + e.getMessage()));
        }
    }

    /**
     * PUT /api/tamtrutamvang/{id}
     * Cập nhật thông tin đăng ký
     */
    @PreAuthorize("hasAuthority('TAM_TRU_VANG:UPDATE') or hasAuthority('*:*')")
    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @RequestBody TamTruTamVang tamTruTamVang) {
        
        System.out.println("=== UPDATE TAM TRU TAM VANG ID: " + id + " ===");
        
        if (!tamTruTamVangService.getById(id).isPresent()) {
            System.err.println("Not found: ID " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Không tìm thấy đăng ký với ID: " + id));
        }
        
        try {
            tamTruTamVang.setId(id);
            TamTruTamVang updated = tamTruTamVangService.update(tamTruTamVang);
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
                    .body(Map.of("message", "Lỗi khi cập nhật đăng ký: " + e.getMessage()));
        }
    }

    /**
     * DELETE /api/tamtrutamvang/{id}
     * Hủy đăng ký
     */
    @PreAuthorize("hasAuthority('TAM_TRU_VANG:DELETE') or hasAuthority('*:*')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        System.out.println("=== DELETE TAM TRU TAM VANG ID: " + id + " ===");
        
        try {
            boolean deleted = tamTruTamVangService.delete(id);
            
            if (deleted) {
                System.out.println("Deleted successfully");
                return ResponseEntity.ok(Map.of(
                    "message", "Hủy đăng ký thành công",
                    "id", id
                ));
            } else {
                System.err.println("Not found: ID " + id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Không tìm thấy đăng ký với ID: " + id));
            }
            
        } catch (Exception e) {
            System.err.println("Unexpected error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Lỗi khi hủy đăng ký: " + e.getMessage()));
        }
    }

    /**
     * GET /api/tamtrutamvang/search?keyword={keyword}
     * Tìm kiếm
     */
    @PreAuthorize("hasAuthority('TAM_TRU_VANG:READ') or hasAuthority('*:*')")
    @GetMapping("/search")
    public ResponseEntity<List<TamTruTamVang>> search(@RequestParam String keyword) {
        System.out.println("=== SEARCH TAM TRU TAM VANG: " + keyword + " ===");
        
        List<TamTruTamVang> results = tamTruTamVangService.search(keyword);
        System.out.println("Found " + results.size() + " results");
        
        return ResponseEntity.ok(results);
    }

    /**
     * GET /api/tamtrutamvang/hethan
     * Lấy danh sách sắp hết hạn (30 ngày)
     */
    @PreAuthorize("hasAuthority('TAM_TRU_VANG:READ') or hasAuthority('*:*')")
    @GetMapping("/hethan")
    public ResponseEntity<List<TamTruTamVang>> getSapHetHan() {
        System.out.println("=== GET SAP HET HAN ===");
        
        List<TamTruTamVang> list = tamTruTamVangService.getSapHetHan(30);
        System.out.println("Found " + list.size() + " records sắp hết hạn");
        
        return ResponseEntity.ok(list);
    }
    
    /**
     * GET /api/tamtrutamvang/active
     * Lấy danh sách còn hiệu lực
     */
    @PreAuthorize("hasAuthority('TAM_TRU_VANG:READ') or hasAuthority('*:*')")
    @GetMapping("/active")
    public ResponseEntity<List<TamTruTamVang>> getActive() {
        System.out.println("=== GET ACTIVE ===");
        
        List<TamTruTamVang> list = tamTruTamVangService.getActive();
        System.out.println("Found " + list.size() + " active records");
        
        return ResponseEntity.ok(list);
    }
}