package cnpm.qlnk.demo.controller;

import cnpm.qlnk.demo.entity.DanhSachThuPhi;
import cnpm.qlnk.demo.service.DanhSachThuPhiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/thuphi")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class DanhSachThuPhiController {

    @Autowired
    private DanhSachThuPhiService thuPhiService;

    /**
     * GET /api/thuphi
     * Lấy TẤT CẢ danh sách thu
     */
    @PreAuthorize("hasAuthority('DANH_SACH_THU:READ') or hasAuthority('*:*')")
    @GetMapping
    public ResponseEntity<List<DanhSachThuPhi>> getAll() {
        System.out.println("=== GET ALL THU PHI ===");
        List<DanhSachThuPhi> list = thuPhiService.getAll();
        System.out.println("Found " + list.size() + " records");
        return ResponseEntity.ok(list);
    }

    /**
     * GET /api/thuphi/{id}
     */
    @PreAuthorize("hasAuthority('DANH_SACH_THU:READ') or hasAuthority('*:*')")
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        System.out.println("=== GET THU PHI ID: " + id + " ===");
        return thuPhiService.getById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Không tìm thấy khoản thu với ID: " + id)));
    }

    /**
     * GET /api/thuphi/hokhau/{hoKhauId}
     * Lấy danh sách thu của một hộ
     */
    @PreAuthorize("hasAuthority('DANH_SACH_THU:READ') or hasAuthority('*:*')")
    @GetMapping("/hokhau/{hoKhauId}")
    public ResponseEntity<List<DanhSachThuPhi>> getByHoKhau(@PathVariable Integer hoKhauId) {
        System.out.println("=== GET THU PHI BY HO KHAU: " + hoKhauId + " ===");
        List<DanhSachThuPhi> list = thuPhiService.getByHoKhau(hoKhauId);
        return ResponseEntity.ok(list);
    }

    /**
     * GET /api/thuphi/khoanphi/{khoanPhiId}
     * Lấy danh sách thu theo khoản phí
     */
    @PreAuthorize("hasAuthority('DANH_SACH_THU:READ') or hasAuthority('*:*')")
    @GetMapping("/khoanphi/{khoanPhiId}")
    public ResponseEntity<List<DanhSachThuPhi>> getByKhoanPhi(@PathVariable Long khoanPhiId) {
        System.out.println("=== GET THU PHI BY KHOAN PHI: " + khoanPhiId + " ===");
        List<DanhSachThuPhi> list = thuPhiService.getByKhoanPhi(khoanPhiId);
        return ResponseEntity.ok(list);
    }

    /**
     * ✅ GET /api/thuphi/khoanphi/{khoanPhiId}/chuadong
     * Lấy danh sách các hộ CHƯA ĐÓNG của một khoản phí
     */
    @PreAuthorize("hasAuthority('DANH_SACH_THU:READ') or hasAuthority('*:*')")
    @GetMapping("/khoanphi/{khoanPhiId}/chuadong")
    public ResponseEntity<List<DanhSachThuPhi>> getHoChuaDong(@PathVariable Long khoanPhiId) {
        System.out.println("=== GET HO CHUA DONG - KHOAN PHI: " + khoanPhiId + " ===");
        List<DanhSachThuPhi> list = thuPhiService.getHoChuaDong(khoanPhiId);
        System.out.println("✅ Found " + list.size() + " hộ chưa đóng");
        return ResponseEntity.ok(list);
    }

    /**
     * ✅ GET /api/thuphi/khoanphi/{khoanPhiId}/dadong
     * Lấy danh sách các hộ ĐÃ ĐÓNG của một khoản phí
     */
    @PreAuthorize("hasAuthority('DANH_SACH_THU:READ') or hasAuthority('*:*')")
    @GetMapping("/khoanphi/{khoanPhiId}/dadong")
    public ResponseEntity<List<DanhSachThuPhi>> getHoDaDong(@PathVariable Long khoanPhiId) {
        System.out.println("=== GET HO DA DONG - KHOAN PHI: " + khoanPhiId + " ===");
        List<DanhSachThuPhi> list = thuPhiService.getHoDaDong(khoanPhiId);
        System.out.println("✅ Found " + list.size() + " hộ đã đóng");
        return ResponseEntity.ok(list);
    }

    /**
     * ✅ GET /api/thuphi/khoanphi/{khoanPhiId}/thongke
     * Lấy thống kê chi tiết của một khoản phí
     */
    @PreAuthorize("hasAuthority('DANH_SACH_THU:READ') or hasAuthority('*:*')")
    @GetMapping("/khoanphi/{khoanPhiId}/thongke")
    public ResponseEntity<Map<String, Object>> getThongKe(@PathVariable Long khoanPhiId) {
        System.out.println("=== GET THONG KE - KHOAN PHI: " + khoanPhiId + " ===");
        Map<String, Object> stats = thuPhiService.getThongKeKhoanPhi(khoanPhiId);
        return ResponseEntity.ok(stats);
    }

    /**
     * GET /api/thuphi/trangthai/{trangThai}
     * Lọc theo trạng thái: "Chưa đóng" hoặc "Đã đóng"
     */
    @PreAuthorize("hasAuthority('DANH_SACH_THU:READ') or hasAuthority('*:*')")
    @GetMapping("/trangthai/{trangThai}")
    public ResponseEntity<List<DanhSachThuPhi>> getByTrangThai(@PathVariable String trangThai) {
        System.out.println("=== GET BY TRANG THAI: " + trangThai + " ===");
        List<DanhSachThuPhi> list = thuPhiService.getByTrangThai(trangThai);
        return ResponseEntity.ok(list);
    }

    /**
     * ✅ POST /api/thuphi/taomoi/khoanphi/{khoanPhiId}
     * Tạo danh sách thu cho TẤT CẢ hộ khẩu
     */
    @PreAuthorize("hasAuthority('DANH_SACH_THU:CREATE') or hasAuthority('*:*')")
    @PostMapping("/taomoi/khoanphi/{khoanPhiId}")
    public ResponseEntity<?> createThuPhiChoTatCaHo(@PathVariable Long khoanPhiId) {
        System.out.println("=== CREATE THU PHI CHO TAT CA HO - KHOAN PHI: " + khoanPhiId + " ===");
        
        try {
            Map<String, Object> result = thuPhiService.createThuPhiChoTatCaHo(khoanPhiId);
            System.out.println("✅ Result: " + result);
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
            
        } catch (IllegalStateException e) {
            System.err.println("❌ Business error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
                    
        } catch (Exception e) {
            System.err.println("❌ Unexpected error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Lỗi khi tạo danh sách thu: " + e.getMessage()));
        }
    }

    /**
     * POST /api/thuphi
     * Tạo khoản thu cho 1 hộ
     */
    @PreAuthorize("hasAuthority('DANH_SACH_THU:CREATE') or hasAuthority('*:*')")
    @PostMapping
    public ResponseEntity<?> create(@RequestBody DanhSachThuPhi thuPhi) {
        System.out.println("=== CREATE THU PHI ===");
        
        try {
            DanhSachThuPhi saved = thuPhiService.create(thuPhi);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
            
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
                    
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Lỗi khi tạo khoản thu: " + e.getMessage()));
        }
    }

    /**
     * PUT /api/thuphi/{id}
     */
    @PreAuthorize("hasAuthority('DANH_SACH_THU:UPDATE') or hasAuthority('*:*')")
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody DanhSachThuPhi thuPhi) {
        System.out.println("=== UPDATE THU PHI ID: " + id + " ===");
        
        if (!thuPhiService.getById(id).isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Không tìm thấy khoản thu với ID: " + id));
        }
        
        try {
            thuPhi.setId(id);
            DanhSachThuPhi updated = thuPhiService.update(thuPhi);
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
     * ✅ PUT /api/thuphi/{id}/trangthai
     * Cập nhật trạng thái thanh toán
     */
    @PreAuthorize("hasAuthority('DANH_SACH_THU:UPDATE') or hasAuthority('*:*')")
    @PutMapping("/{id}/trangthai")
    public ResponseEntity<?> updateTrangThai(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        
        System.out.println("=== UPDATE TRANG THAI - ID: " + id + " ===");
        
        String trangThai = request.get("trangThai");
        if (trangThai == null || trangThai.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Vui lòng cung cấp trạng thái"));
        }
        
        try {
            DanhSachThuPhi updated = thuPhiService.updateTrangThai(id, trangThai);
            return ResponseEntity.ok(updated);
            
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
                    
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Lỗi khi cập nhật: " + e.getMessage()));
        }
    }

    /**
     * DELETE /api/thuphi/{id}
     */
    @PreAuthorize("hasAuthority('DANH_SACH_THU:DELETE') or hasAuthority('*:*')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        System.out.println("=== DELETE THU PHI ID: " + id + " ===");
        
        try {
            boolean deleted = thuPhiService.delete(id);
            
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
     * GET /api/thuphi/search?keyword={keyword}
     */
    @PreAuthorize("hasAuthority('DANH_SACH_THU:READ') or hasAuthority('*:*')")
    @GetMapping("/search")
    public ResponseEntity<List<DanhSachThuPhi>> search(@RequestParam String keyword) {
        System.out.println("=== SEARCH THU PHI: " + keyword + " ===");
        List<DanhSachThuPhi> results = thuPhiService.search(keyword);
        return ResponseEntity.ok(results);
    }

    /**
     * GET /api/thuphi/daterange?start={start}&end={end}
     */
    @PreAuthorize("hasAuthority('DANH_SACH_THU:READ') or hasAuthority('*:*')")
    @GetMapping("/daterange")
    public ResponseEntity<List<DanhSachThuPhi>> getByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        
        System.out.println("=== GET BY DATE RANGE: " + start + " to " + end + " ===");
        List<DanhSachThuPhi> results = thuPhiService.getByDateRange(start, end);
        return ResponseEntity.ok(results);
    }
}