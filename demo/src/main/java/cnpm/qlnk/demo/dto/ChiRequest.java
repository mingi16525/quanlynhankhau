package cnpm.qlnk.demo.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ChiRequest {
    private String tenKhoanChi;
    private BigDecimal soTien;
    private LocalDateTime ngayChi;
    private Integer idTaiKhoanThucHien; // ID of the account executing the expense
    private String moTaChiTiet;
}