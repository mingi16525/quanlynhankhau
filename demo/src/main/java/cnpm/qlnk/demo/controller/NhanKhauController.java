package cnpm.qlnk.demo.controller;

import cnpm.qlnk.demo.entity.NhanKhau;
import cnpm.qlnk.demo.service.NhanKhauService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/nhankhau")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class NhanKhauController {

    @Autowired
    private NhanKhauService nhanKhauService;

    // GET /api/nhankhau - Lấy tất cả hồ sơ nhân khẩu
    @PreAuthorize("hasAuthority('NHAN_KHAU:READ') or hasAuthority('*:*')")
    @GetMapping
    public ResponseEntity<List<NhanKhau>> getAllNhanKhau(Authentication authentication) {
        System.out.println("=== GET ALL NHAN KHAU ===");
        System.out.println("User: " + (authentication != null ? authentication.getName() : "null"));
        
        List<NhanKhau> list = nhanKhauService.getAllNhanKhau();
        System.out.println("Found " + list.size() + " records");
        
        return ResponseEntity.ok(list);
    }

    // GET /api/nhankhau/{id} - Lấy hồ sơ chi tiết theo ID
    @PreAuthorize("hasAuthority('NHAN_KHAU:READ') or hasAuthority('*:*')")
    @GetMapping("/{id}")
    public ResponseEntity<?> getNhanKhauById(@PathVariable Integer id) {
        System.out.println("=== GET NHAN KHAU BY ID: " + id + " ===");
        
        return nhanKhauService.getNhanKhauById(id)
                .<ResponseEntity<?>>map(nhanKhau -> {
                    System.out.println("Found: " + nhanKhau.getHoTen());
                    return ResponseEntity.ok(nhanKhau);
                })
                .orElseGet(() -> {
                    System.err.println("Not found: ID " + id);
                    return ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(Map.of("message", "Không tìm thấy nhân khẩu với ID: " + id));
                });
    }
    //Với route như sau:
    /*<Route path="nhankhau" element={<NhanKhauListPage />} />
        <Route path="nhankhau/form/new" element={<NhanKhauFormPage />} />
        <Route path="nhankhau/form/:mode/:id" element={<NhanKhauFormPage />} /> */
    //Tạo mới hồ sơ nhân khẩu POST /api/nhankhau 
    @PreAuthorize("hasAuthority('NHAN_KHAU:CREATE') or hasAuthority('*:*')")
    @PostMapping
    public ResponseEntity<?> createNhanKhau(@RequestBody NhanKhau nhanKhau) {
        System.out.println("=== CREATE NHAN KHAU ===");
        System.out.println("Họ tên: " + nhanKhau.getHoTen());
        System.out.println("CCCD: " + nhanKhau.getSoCCCD());
        
        try {
            NhanKhau savedNhanKhau = nhanKhauService.saveNhanKhau(nhanKhau);
            System.out.println("Created successfully with ID: " + savedNhanKhau.getId());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(savedNhanKhau);
            
        } catch (IllegalStateException e) {
            System.err.println("Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            System.err.println("Unexpected error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Lỗi khi tạo nhân khẩu: " + e.getMessage()));
        }
    }

    // PUT /api/nhankhau/{id} - Cập nhật hồ sơ nhân khẩu
    @PreAuthorize("hasAuthority('NHAN_KHAU:UPDATE') or hasAuthority('*:*')")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateNhanKhau(
            @PathVariable Integer id, 
            @RequestBody NhanKhau nhanKhau) {
        
        System.out.println("=== UPDATE NHAN KHAU ID: " + id + " ===");
        System.out.println("New data - Họ tên: " + nhanKhau.getHoTen());
        
        // Kiểm tra tồn tại
        if (!nhanKhauService.getNhanKhauById(id).isPresent()) {
            System.err.println("Not found: ID " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Không tìm thấy nhân khẩu với ID: " + id));
        }
        
        try {
            nhanKhau.setId(id); // Đảm bảo ID không thay đổi
            NhanKhau updatedNhanKhau = nhanKhauService.saveNhanKhau(nhanKhau);
            System.out.println("Updated successfully");
            
            return ResponseEntity.ok(updatedNhanKhau);
            
        } catch (IllegalStateException e) {
            System.err.println("Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            System.err.println("Unexpected error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Lỗi khi cập nhật nhân khẩu: " + e.getMessage()));
        }
    }

    // DELETE /api/nhankhau/{id} - Xóa hồ sơ nhân khẩu
    @PreAuthorize("hasAuthority('NHAN_KHAU:DELETE') or hasAuthority('*:*')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNhanKhau(@PathVariable Integer id) {
        System.out.println("=== DELETE NHAN KHAU ID: " + id + " ===");
        System.out.println("Controller: Received DELETE request for ID " + id);
        
        try {
            boolean deleted = nhanKhauService.deleteNhanKhau(id);
            
            if (deleted) {
                System.out.println("Controller: Deleted successfully ID " + id);
                return ResponseEntity.ok(Map.of(
                    "message", "Đã xóa nhân khẩu thành công",
                    "id", id
                ));
            } else {
                System.err.println("Controller: Not found ID " + id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Không tìm thấy nhân khẩu với ID: " + id));
            }
            
        } catch (IllegalStateException e) {
            System.err.println("Controller: Cannot delete - " + e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            System.err.println("Controller: Unexpected error - " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Lỗi hệ thống khi xóa nhân khẩu: " + e.getMessage()));
        }
    }

    // GET /api/nhankhau/search?keyword={keyword} - Tìm kiếm nhân khẩu
    @PreAuthorize("hasAuthority('NHAN_KHAU:READ') or hasAuthority('*:*')")
    @GetMapping("/search")
    public ResponseEntity<List<NhanKhau>> searchNhanKhau(@RequestParam String keyword) {
        System.out.println("=== SEARCH NHAN KHAU: " + keyword + " ===");
        
        List<NhanKhau> results = nhanKhauService.searchNhanKhau(keyword);
        System.out.println("Found " + results.size() + " results");
        
        return ResponseEntity.ok(results);
    }
    
    // GET /api/nhankhau/available - Lấy nhân khẩu chưa thuộc hộ khẩu nào
    @PreAuthorize("hasAuthority('NHAN_KHAU:READ') or hasAuthority('*:*')")
    @GetMapping("/available")
    public ResponseEntity<List<NhanKhau>> getAvailableNhanKhau() {
        System.out.println("=== GET AVAILABLE NHAN KHAU (Not in any HoKhau) ===");
        
        List<NhanKhau> results = nhanKhauService.getNhanKhauNotInAnyHoKhau();
        System.out.println("Found " + results.size() + " available records");
        
        return ResponseEntity.ok(results);
    }
}