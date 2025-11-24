package cnpm.qlnk.demo.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.util.List;

/**
 * DTO cho request cập nhật hộ khẩu (bao gồm thay đổi chủ hộ và quan hệ)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateHoKhauRequest {
    
    // Thông tin hộ khẩu
    private String maSoHo;          // Mã số hộ
    private Integer chuHoId;        // ID nhân khẩu làm chủ hộ
    private String diaChi;          // Địa chỉ
    private LocalDate ngayLap;      // Ngày lập
    
    // Danh sách quan hệ của các thành viên với chủ hộ mới (chỉ khi thay đổi chủ hộ)
    private List<ThanhVienQuanHe> thanhVienQuanHeList;
    
    /**
     * Thông tin quan hệ của thành viên với chủ hộ
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ThanhVienQuanHe {
        private Integer nhanKhauId;           // ID nhân khẩu
        private String quanHeVoiChuHo;        // Quan hệ với chủ hộ mới
    }
}
