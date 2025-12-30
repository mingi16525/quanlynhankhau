package cnpm.qlnk.demo.controller;

import cnpm.qlnk.demo.dto.ThongKeNhanKhauResponse;
import cnpm.qlnk.demo.entity.NhanKhau;
import cnpm.qlnk.demo.service.ThongKeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/thongke")
public class ThongKeController {

    @Autowired
    private ThongKeService thongKeService;

    /**
     * GET /api/thongke/nhankhau
     * Thống kê tổng hợp nhân khẩu theo nhiều tiêu chí
     * 
     * @param tuNgay Ngày bắt đầu (optional)
     * @param denNgay Ngày kết thúc (optional)
     * @return ThongKeNhanKhauResponse
     */
    @PreAuthorize("hasAuthority('THONG_KE:READ') or hasAuthority('*:*')")
    @GetMapping("/nhankhau")
    public ResponseEntity<ThongKeNhanKhauResponse> thongKeNhanKhau(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate tuNgay,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate denNgay
    ) {
        System.out.println("=== THỐNG KÊ NHÂN KHẨU ===");
        System.out.println("Từ ngày: " + tuNgay);
        System.out.println("Đến ngày: " + denNgay);
        
        ThongKeNhanKhauResponse response = thongKeService.thongKeNhanKhau(tuNgay, denNgay);
        
        System.out.println("Tổng số: " + response.getTongSo());
        System.out.println("Nam: " + response.getSoNam() + ", Nữ: " + response.getSoNu());
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * GET /api/thongke/nhankhau/nhomtuoi/{nhomTuoi}
     * Lấy danh sách nhân khẩu theo nhóm tuổi
     * 
     * @param nhomTuoi MAM_NON, MAU_GIAO, CAP_1, CAP_2, CAP_3, LAO_DONG, NGHI_HUU
     * @return List<NhanKhau>
     */
    @PreAuthorize("hasAuthority('THONG_KE:READ') or hasAuthority('*:*')")
    @GetMapping("/nhankhau/nhomtuoi/{nhomTuoi}")
    public ResponseEntity<List<NhanKhau>> getNhanKhauTheoDoTuoi(@PathVariable String nhomTuoi) {
        System.out.println("=== LẤY NHÂN KHẨU THEO NHÓM TUỔI: " + nhomTuoi + " ===");
        
        List<NhanKhau> results = thongKeService.getNhanKhauTheoDoTuoi(nhomTuoi);
        
        System.out.println("Số lượng: " + results.size());
        
        return ResponseEntity.ok(results);
    }
}
