package cnpm.qlnk.demo.controller;

import cnpm.qlnk.demo.entity.KhoanChiPhiBatBuoc;
import cnpm.qlnk.demo.service.KhoanChiPhiBatBuocService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/khoanphi")
public class KhoanChiPhiBatBuocController {

    @Autowired
    private KhoanChiPhiBatBuocService khoanPhiService;

    /**
     * GET /api/khoanphi
     * Lấy TẤT CẢ khoản phí
     */
    @PreAuthorize("hasAuthority('KHOAN_CHI_BAT_BUOC:READ') or hasAuthority('*:*')")
    @GetMapping
    public ResponseEntity<List<KhoanChiPhiBatBuoc>> getAll() {
        System.out.println("=== GET ALL KHOAN PHI ===");
        List<KhoanChiPhiBatBuoc> list = khoanPhiService.getAll();
        System.out.println("Found " + list.size() + " records");
        return ResponseEntity.ok(list);
    }

    /**
     * GET /api/khoanphi/{id}
     * Lấy chi tiết 1 khoản phí
     */
    @PreAuthorize("hasAuthority('KHOAN_CHI_BAT_BUOC:READ') or hasAuthority('*:*')")
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        System.out.println("=== GET KHOAN PHI BY ID: " + id + " ===");
        
        return khoanPhiService.getById(id)
                .<ResponseEntity<?>>map(record -> {
                    System.out.println("Found: " + record.getTenKhoanPhi());
                    return ResponseEntity.ok(record);
                })
                .orElseGet(() -> {
                    System.err.println("Not found: ID " + id);
                    return ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(Map.of("message", "Không tìm thấy khoản phí với ID: " + id));
                });
    }

    /**
     * GET /api/khoanphi/active
     * Lấy các khoản phí đang hoạt động
     */
    @PreAuthorize("hasAuthority('KHOAN_CHI_BAT_BUOC:READ') or hasAuthority('*:*')")
    @GetMapping("/active")
    public ResponseEntity<List<KhoanChiPhiBatBuoc>> getActive() {
        System.out.println("=== GET ACTIVE KHOAN PHI ===");
        List<KhoanChiPhiBatBuoc> list = khoanPhiService.getActiveKhoanPhi();
        System.out.println("Found " + list.size() + " active records");
        return ResponseEntity.ok(list);
    }

    /**
     * GET /api/khoanphi/loai/{loaiKhoanPhi}
     * Lấy khoản phí theo loại: "Bắt buộc", "Tự nguyện", "Khác"
     */
    @PreAuthorize("hasAuthority('KHOAN_CHI_BAT_BUOC:READ') or hasAuthority('*:*')")
    @GetMapping("/loai/{loaiKhoanPhi}")
    public ResponseEntity<List<KhoanChiPhiBatBuoc>> getByLoai(@PathVariable String loaiKhoanPhi) {
        System.out.println("=== GET KHOAN PHI BY LOAI: " + loaiKhoanPhi + " ===");
        List<KhoanChiPhiBatBuoc> list = khoanPhiService.getByLoai(loaiKhoanPhi);
        System.out.println("Found " + list.size() + " records");
        return ResponseEntity.ok(list);
    }

    /**
     * POST /api/khoanphi
     * Tạo khoản phí bắt buộc mới
     */
    @PreAuthorize("hasAuthority('KHOAN_CHI_BAT_BUOC:CREATE') or hasAuthority('*:*')")
    @PostMapping
    public ResponseEntity<?> create(@RequestBody KhoanChiPhiBatBuoc khoanPhi) {
        System.out.println("=== CREATE KHOAN PHI ===");
        System.out.println("Tên: " + khoanPhi.getTenKhoanPhi());
        System.out.println("Loại: " + khoanPhi.getLoaiKhoanPhi());
        System.out.println("Số tiền: " + khoanPhi.getSoTienMoiHo());
        
        try {
            KhoanChiPhiBatBuoc saved = khoanPhiService.create(khoanPhi);
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
                    .body(Map.of("message", "Lỗi khi tạo khoản phí: " + e.getMessage()));
        }
    }

    /**
     * PUT /api/khoanphi/{id}
     * Cập nhật thông tin khoản phí
     */
    @PreAuthorize("hasAuthority('KHOAN_CHI_BAT_BUOC:UPDATE') or hasAuthority('*:*')")
    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @RequestBody KhoanChiPhiBatBuoc khoanPhi) {
        
        System.out.println("=== UPDATE KHOAN PHI ID: " + id + " ===");
        
        if (!khoanPhiService.getById(id).isPresent()) {
            System.err.println("Not found: ID " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Không tìm thấy khoản phí với ID: " + id));
        }
        
        try {
            khoanPhi.setId(id);
            KhoanChiPhiBatBuoc updated = khoanPhiService.update(khoanPhi);
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
                    .body(Map.of("message", "Lỗi khi cập nhật khoản phí: " + e.getMessage()));
        }
    }

    /**
     * DELETE /api/khoanphi/{id}
     * Xóa khoản phí
     */
    @PreAuthorize("hasAuthority('KHOAN_CHI_BAT_BUOC:DELETE') or hasAuthority('*:*')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        System.out.println("=== DELETE KHOAN PHI ID: " + id + " ===");
        
        try {
            boolean deleted = khoanPhiService.delete(id);
            
            if (deleted) {
                System.out.println("Deleted successfully");
                return ResponseEntity.ok(Map.of(
                    "message", "Xóa khoản phí thành công",
                    "id", id
                ));
            } else {
                System.err.println("Not found: ID " + id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Không tìm thấy khoản phí với ID: " + id));
            }
            
        } catch (Exception e) {
            System.err.println("Unexpected error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Lỗi khi xóa khoản phí: " + e.getMessage()));
        }
    }

    /**
     * GET /api/khoanphi/search?keyword={keyword}
     * Tìm kiếm khoản phí theo tên
     */
    @PreAuthorize("hasAuthority('KHOAN_CHI_BAT_BUOC:READ') or hasAuthority('*:*')")
    @GetMapping("/search")
    public ResponseEntity<List<KhoanChiPhiBatBuoc>> search(@RequestParam String keyword) {
        System.out.println("=== SEARCH KHOAN PHI: " + keyword + " ===");
        
        List<KhoanChiPhiBatBuoc> results = khoanPhiService.search(keyword);
        System.out.println("Found " + results.size() + " results");
        
        return ResponseEntity.ok(results);
    }

    /**
     * PUT /api/khoanphi/{id}/trangthai
     * Cập nhật trạng thái khoản phí
     */
    @PreAuthorize("hasAuthority('KHOAN_CHI_BAT_BUOC:UPDATE') or hasAuthority('*:*')")
    @PutMapping("/{id}/trangthai")
    public ResponseEntity<?> updateTrangThai(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        
        System.out.println("=== UPDATE TRANG THAI - KHOAN PHI ID: " + id + " ===");
        
        String trangThai = request.get("trangThai");
        if (trangThai == null || trangThai.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Vui lòng cung cấp trạng thái"));
        }
        
        try {
            var khoanPhiOpt = khoanPhiService.getById(id);
            if (!khoanPhiOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Không tìm thấy khoản phí với ID: " + id));
            }
            
            KhoanChiPhiBatBuoc khoanPhi = khoanPhiOpt.get();
            khoanPhi.setTrangThai(trangThai);
            KhoanChiPhiBatBuoc updated = khoanPhiService.update(khoanPhi);
            
            System.out.println("Updated trangThai to: " + trangThai);
            return ResponseEntity.ok(updated);
            
        } catch (Exception e) {
            System.err.println("Unexpected error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Lỗi khi cập nhật trạng thái: " + e.getMessage()));
        }
    }
}