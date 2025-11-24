package cnpm.qlnk.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ThongKeNhanKhauResponse {
    
    // Thống kê theo giới tính
    private Long tongSo;
    private Long soNam;
    private Long soNu;
    
    // Thống kê theo độ tuổi
    private Long soMamNon; // 0-2 tuổi
    private Long soMauGiao; // 3-5 tuổi
    private Long soCap1; // 6-10 tuổi
    private Long soCap2; // 11-14 tuổi
    private Long soCap3; // 15-17 tuổi
    private Long soLaoDong; // 18-60 tuổi
    private Long soNghiHuu; // >60 tuổi
    
    // Thống kê theo tình trạng
    private Map<String, Long> theoTinhTrang;
    
    // Thống kê tạm trú/tạm vắng
    private Long soTamTru;
    private Long soTamVang;
}
