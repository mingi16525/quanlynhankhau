package cnpm.qlnk.demo.controller;
import cnpm.qlnk.demo.entity.HoKhau;
import cnpm.qlnk.demo.service.HoKhauService;
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
}