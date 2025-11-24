package cnpm.qlnk.demo.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import cnpm.qlnk.demo.dto.ThongKeNhanKhauResponse;
import cnpm.qlnk.demo.entity.NhanKhau;
import cnpm.qlnk.demo.entity.TamTruTamVang;
import cnpm.qlnk.demo.repository.NhanKhauRepository;
import cnpm.qlnk.demo.repository.TamTruTamVangRepository;

import java.time.LocalDate;
import java.time.Period;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ThongKeService {

    @Autowired
    private NhanKhauRepository nhanKhauRepository;
    
    @Autowired
    private TamTruTamVangRepository tamTruTamVangRepository;

    /**
     * Thống kê nhân khẩu theo nhiều tiêu chí
     * @param tuNgay Ngày bắt đầu (có thể null)
     * @param denNgay Ngày kết thúc (có thể null)
     * @return ThongKeNhanKhauResponse
     */
    public ThongKeNhanKhauResponse thongKeNhanKhau(LocalDate tuNgay, LocalDate denNgay) {
        ThongKeNhanKhauResponse response = new ThongKeNhanKhauResponse();
        
        // Lấy tất cả nhân khẩu (hoặc filter theo khoảng thời gian nếu cần)
        List<NhanKhau> danhSachNhanKhau = nhanKhauRepository.findAll();
        
        // Khởi tạo bộ đếm
        long tongSo = 0;
        long soNam = 0;
        long soNu = 0;
        long soMamNon = 0;
        long soMauGiao = 0;
        long soCap1 = 0;
        long soCap2 = 0;
        long soCap3 = 0;
        long soLaoDong = 0;
        long soNghiHuu = 0;
        
        Map<String, Long> theoTinhTrang = new HashMap<>();
        
        LocalDate now = LocalDate.now();
        
        for (NhanKhau nk : danhSachNhanKhau) {
            tongSo++;
            
            // Thống kê theo giới tính
            if ("Nam".equalsIgnoreCase(nk.getGioiTinh())) {
                soNam++;
            } else if ("Nữ".equalsIgnoreCase(nk.getGioiTinh())) {
                soNu++;
            }
            
            // Thống kê theo độ tuổi
            if (nk.getNgaySinh() != null) {
                int tuoi = Period.between(nk.getNgaySinh(), now).getYears();
                
                if (tuoi <= 2) {
                    soMamNon++;
                } else if (tuoi <= 5) {
                    soMauGiao++;
                } else if (tuoi <= 10) {
                    soCap1++;
                } else if (tuoi <= 14) {
                    soCap2++;
                } else if (tuoi <= 17) {
                    soCap3++;
                } else if (tuoi <= 60) {
                    soLaoDong++;
                } else {
                    soNghiHuu++;
                }
            }
            
            // Thống kê theo tình trạng
            String tinhTrang = nk.getTinhTrang() != null ? nk.getTinhTrang() : "Không xác định";
            theoTinhTrang.put(tinhTrang, theoTinhTrang.getOrDefault(tinhTrang, 0L) + 1);
        }
        
        // Thống kê tạm trú/tạm vắng
        List<TamTruTamVang> danhSachTamTruVang = tamTruTamVangRepository.findAll();
        long soTamTru = 0;
        long soTamVang = 0;
        
        for (TamTruTamVang ttv : danhSachTamTruVang) {
            // Filter theo khoảng thời gian nếu có
            if (tuNgay != null && ttv.getTuNgay() != null && ttv.getTuNgay().isBefore(tuNgay)) {
                continue;
            }
            if (denNgay != null && ttv.getDenNgay() != null && ttv.getDenNgay().isAfter(denNgay)) {
                continue;
            }
            
            if ("Tạm trú".equalsIgnoreCase(ttv.getLoai())) {
                soTamTru++;
            } else if ("Tạm vắng".equalsIgnoreCase(ttv.getLoai())) {
                soTamVang++;
            }
        }
        
        // Gán kết quả
        response.setTongSo(tongSo);
        response.setSoNam(soNam);
        response.setSoNu(soNu);
        response.setSoMamNon(soMamNon);
        response.setSoMauGiao(soMauGiao);
        response.setSoCap1(soCap1);
        response.setSoCap2(soCap2);
        response.setSoCap3(soCap3);
        response.setSoLaoDong(soLaoDong);
        response.setSoNghiHuu(soNghiHuu);
        response.setTheoTinhTrang(theoTinhTrang);
        response.setSoTamTru(soTamTru);
        response.setSoTamVang(soTamVang);
        
        return response;
    }
    
    /**
     * Lấy danh sách nhân khẩu theo độ tuổi
     */
    public List<NhanKhau> getNhanKhauTheoDoTuoi(String nhomTuoi) {
        List<NhanKhau> tatCa = nhanKhauRepository.findAll();
        LocalDate now = LocalDate.now();
        
        return tatCa.stream().filter(nk -> {
            if (nk.getNgaySinh() == null) return false;
            
            int tuoi = Period.between(nk.getNgaySinh(), now).getYears();
            
            switch (nhomTuoi) {
                case "MAM_NON": return tuoi <= 2;
                case "MAU_GIAO": return tuoi >= 3 && tuoi <= 5;
                case "CAP_1": return tuoi >= 6 && tuoi <= 10;
                case "CAP_2": return tuoi >= 11 && tuoi <= 14;
                case "CAP_3": return tuoi >= 15 && tuoi <= 17;
                case "LAO_DONG": return tuoi >= 18 && tuoi <= 60;
                case "NGHI_HUU": return tuoi > 60;
                default: return false;
            }
        }).toList();
    }
}
