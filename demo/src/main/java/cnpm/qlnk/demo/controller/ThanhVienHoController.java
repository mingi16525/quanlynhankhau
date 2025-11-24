package cnpm.qlnk.demo.controller;

import cnpm.qlnk.demo.entity.ThanhVienHo;
import cnpm.qlnk.demo.service.ThanhVienHoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/thanhvienho")
public class ThanhVienHoController {

    @Autowired
    private ThanhVienHoService thanhVienHoService;

    // POST /api/thanhvienho: Thêm nhân khẩu vào hộ khẩu
    @PreAuthorize("hasAuthority('THANH_VIEN_HO:CREATE') or hasAuthority('*:*')")
    @PostMapping
    public ResponseEntity<?> addThanhVien(@RequestBody ThanhVienHo tvh) {
        try {
            ThanhVienHo savedTvh = thanhVienHoService.addThanhVien(tvh);
            return new ResponseEntity<>(savedTvh, HttpStatus.CREATED);
        } catch (IllegalStateException e) {
            // Lỗi nhân khẩu đã thuộc hộ khẩu (trùng hoặc conflict)
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ErrorResponse(e.getMessage())); 
        } catch (IllegalArgumentException e) {
            // Lỗi Hộ khẩu/Nhân khẩu không tồn tại
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            // Lỗi không xác định
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Lỗi hệ thống: " + e.getMessage()));
        }
    }
    
    // Inner class để trả về lỗi dạng JSON
    private static class ErrorResponse {
        public String message;
        
        public ErrorResponse(String message) {
            this.message = message;
        }
    }

    // DELETE /api/thanhvienho/{id}: Xóa thành viên khỏi hộ khẩu (ID của bảng ThanhVienHo)
    @PreAuthorize("hasAuthority('THANH_VIEN_HO:DELETE') or hasAuthority('*:*')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> removeThanhVien(@PathVariable Integer id) {
        try {
            thanhVienHoService.removeThanhVien(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalStateException e) {
            // Lỗi nghiệp vụ: không được xóa chủ hộ
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ErrorResponse(e.getMessage()));
        } catch (IllegalArgumentException e) {
            // Không tìm thấy
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            // Lỗi khác
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Lỗi hệ thống: " + e.getMessage()));
        }
    }

    // PUT /api/thanhvienho/{id}: Cập nhật thông tin thành viên hộ khẩu
    @PreAuthorize("hasAuthority('THANH_VIEN_HO:UPDATE') or hasAuthority('*:*')")
    @PutMapping("/{id}")
    public ResponseEntity<ThanhVienHo> updateThanhVien(@PathVariable Integer id, @RequestBody ThanhVienHo tvh) {
        try {
            ThanhVienHo updatedTvh = thanhVienHoService.updateThanhVien(id, tvh);
            return ResponseEntity.ok(updatedTvh);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}