package cnpm.qlnk.demo.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.util.List;

/**
 * DTO cho request tách hộ khẩu
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TachHoRequest {
    
    // Thông tin hộ khẩu mới
    private String maSoHo;          // Mã số hộ mới
    private String diaChi;          // Địa chỉ mới
    private LocalDate ngayLap;      // Ngày lập hộ mới
    private Integer chuHoMoiId;     // ID nhân khẩu làm chủ hộ mới
    
    // Danh sách thành viên tách sang hộ mới
    private List<ThanhVienMoi> thanhVienList;
    
    /**
     * Thông tin thành viên trong hộ mới
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ThanhVienMoi {
        private Integer nhanKhauId;           // ID nhân khẩu
        private String quanHeVoiChuHo;        // Quan hệ với chủ hộ mới
        private String ghiChu;                // Ghi chú
    }
}
