package cnpm.qlnk.demo.controller;
import cnpm.qlnk.demo.entity.HoKhau;
import cnpm.qlnk.demo.service.HoKhauService;
import cnpm.qlnk.demo.dto.TachHoRequest;
import cnpm.qlnk.demo.dto.UpdateHoKhauRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hokhau")
public class HoKhauController {

    @Autowired
    private HoKhauService hoKhauService;

    // GET /api/hokhau
    @GetMapping
    public ResponseEntity<List<HoKhau>> getAll() {
        return ResponseEntity.ok(hoKhauService.getAllHoKhau());
    }
    
    // GET /api/hokhau/{id}/thanhvien
    @GetMapping("/{id}/thanhvien")
    public ResponseEntity<List<?>> getThanhVienByHoKhauId(@PathVariable Integer id) {
        return ResponseEntity.ok(hoKhauService.getThanhVienByHoKhauId(id));
    }
    
    // GET /api/hokhau/{id}
    @GetMapping("/{id}")
    public ResponseEntity<HoKhau> getById(@PathVariable Integer id) {
        return hoKhauService.getHoKhauById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /api/hokhau: Tạo mới HoKhau
    @PostMapping
    public ResponseEntity<HoKhau> create(@RequestBody HoKhau hoKhau) {
        try {
            HoKhau savedHoKhau = hoKhauService.saveHoKhau(hoKhau);
            return new ResponseEntity<>(savedHoKhau, HttpStatus.CREATED);
        } catch (IllegalStateException e) {
            // Lỗi trùng Mã số hộ
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        } catch (IllegalArgumentException e) {
            // Lỗi ID Chủ hộ không tồn tại
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    // PUT /api/hokhau/{id}: Cập nhật HoKhau (bao gồm thay đổi Chủ hộ)
    @PutMapping("/{id}")
    public ResponseEntity<HoKhau> update(@PathVariable Integer id, @RequestBody UpdateHoKhauRequest request) {
        try {
            HoKhau updatedHoKhau = hoKhauService.updateHoKhau(id, request);
            return ResponseEntity.ok(updatedHoKhau);
        } catch (IllegalArgumentException e) {
            // Lỗi: Hộ khẩu không tồn tại hoặc chủ hộ mới không phải thành viên
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (IllegalStateException e) {
            // Lỗi: Mã số hộ trùng lặp
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }
    }
    
    // DELETE /api/hokhau/{id}: Xóa HoKhau
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        try {
            if (hoKhauService.deleteHoKhau(id)) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            // Lỗi nếu còn thành viên
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null); 
        }
    }

    // POST /api/hokhau/{id}/tach: Tách hộ khẩu
    @PostMapping("/{id}/tach")
    public ResponseEntity<?> tachHo(@PathVariable Integer id, @RequestBody TachHoRequest request) {
        try {
            HoKhau hoKhauMoi = hoKhauService.tachHoKhau(id, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(hoKhauMoi);
        } catch (IllegalArgumentException e) {
            // Lỗi: Validation thất bại (chủ hộ không hợp lệ, thành viên không thuộc hộ cũ, v.v.)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (IllegalStateException e) {
            // Lỗi: Mã số hộ trùng, tách hết thành viên
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (Exception e) {
            // Lỗi không xác định
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi tách hộ: " + e.getMessage());
        }
    }
}