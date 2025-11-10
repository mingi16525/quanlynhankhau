package cnpm.qlnk.demo.controller;

import cnpm.qlnk.demo.entity.ThanhVienHo;
import cnpm.qlnk.demo.service.ThanhVienHoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/thanhvienho")
public class ThanhVienHoController {

    @Autowired
    private ThanhVienHoService thanhVienHoService;

    // POST /api/thanhvienho: Thêm nhân khẩu vào hộ khẩu
    @PostMapping
    public ResponseEntity<ThanhVienHo> addThanhVien(@RequestBody ThanhVienHo tvh) {
        try {
            ThanhVienHo savedTvh = thanhVienHoService.addThanhVien(tvh);
            return new ResponseEntity<>(savedTvh, HttpStatus.CREATED);
        } catch (IllegalStateException e) {
            // Lỗi nhân khẩu đã thuộc hộ khẩu khác
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null); 
        } catch (IllegalArgumentException e) {
            // Lỗi Hộ khẩu/Nhân khẩu không tồn tại
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    // DELETE /api/thanhvienho/{id}: Xóa thành viên khỏi hộ khẩu (ID của bảng ThanhVienHo)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeThanhVien(@PathVariable Integer id) {
        try {
            thanhVienHoService.removeThanhVien(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // PUT /api/thanhvienho/{id}: Cập nhật thông tin thành viên hộ khẩu
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