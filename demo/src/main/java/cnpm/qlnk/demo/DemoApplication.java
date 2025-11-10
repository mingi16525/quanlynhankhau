package cnpm.qlnk.demo;
import cnpm.qlnk.demo.entity.*;
import cnpm.qlnk.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.context.annotation.Import;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@EnableScheduling
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

    // // --- DEMO DATA INITIALIZATION ---
    // @Bean
    // CommandLineRunner initDatabase(
    //         // Inject all necessary repositories and the password encoder
    //         VaiTroRepository vaiTroRepository,
    //         TaiKhoanRepository taiKhoanRepository,
    //         PhanQuyenRepository phanQuyenRepository,
    //         NhanKhauRepository nhanKhauRepository,
    //         HoKhauRepository hoKhauRepository,
    //         ThanhVienHoRepository thanhVienHoRepository,
    //         KhoanChiPhiBatBuocRepository khoanChiPhiBatBuocRepository,
    //         DanhSachThuPhiRepository danhSachThuPhiRepository,
    //         DanhSachChiRepository danhSachChiRepository,
    //         HoatDongThienNguyenRepository hoatDongThienNguyenRepository,
    //         ThuThienNguyenRepository thuThienNguyenRepository,
    //         PasswordEncoder passwordEncoder // Inject PasswordEncoder
    // ) {
    //     return args -> {
    //         System.out.println(">>> Initializing Demo Data...");

    //         // --- 1. Roles & Permissions ---
    //         if (vaiTroRepository.count() == 0) {
    //             System.out.println(">>> Creating Roles...");
    //             VaiTro adminRole = vaiTroRepository.save(new VaiTro(null, "ADMIN_HE_THONG"));
    //             VaiTro canBoNKRole = vaiTroRepository.save(new VaiTro(null, "CAN_BO_NHAN_KHAU"));
    //             VaiTro keToanRole = vaiTroRepository.save(new VaiTro(null, "KE_TOAN_THU_CHI"));
    //             VaiTro lanhDaoRole = vaiTroRepository.save(new VaiTro(null, "LANH_DAO_PHUONG"));

    //             System.out.println(">>> Creating Permissions...");
    //             // Admin Permissions
    //             phanQuyenRepository.save(new PhanQuyen(null, adminRole, "*", "*"));
    //             // CanBoNK Permissions
    //             phanQuyenRepository.saveAll(List.of(
    //                     new PhanQuyen(null, canBoNKRole, "NHAN_KHAU", "READ"),
    //                     new PhanQuyen(null, canBoNKRole, "NHAN_KHAU", "CREATE"),
    //                     new PhanQuyen(null, canBoNKRole, "NHAN_KHAU", "UPDATE"),
    //                     new PhanQuyen(null, canBoNKRole, "HO_KHAU", "READ"),
    //                     new PhanQuyen(null, canBoNKRole, "HO_KHAU", "CREATE"),
    //                     new PhanQuyen(null, canBoNKRole, "HO_KHAU", "UPDATE"),
    //                     new PhanQuyen(null, canBoNKRole, "HO_KHAU", "DELETE"),
    //                     new PhanQuyen(null, canBoNKRole, "TAM_TRU_VANG", "READ"),
    //                     new PhanQuyen(null, canBoNKRole, "TAM_TRU_VANG", "CREATE"),
    //                     new PhanQuyen(null, canBoNKRole, "SU_KIEN", "CREATE")
    //             ));
    //              // KeToan Permissions
    //             phanQuyenRepository.saveAll(List.of(
    //                     new PhanQuyen(null, keToanRole, "KHOAN_CHI_BAT_BUOC", "READ"),
    //                     new PhanQuyen(null, keToanRole, "KHOAN_CHI_BAT_BUOC", "CREATE"),
    //                     new PhanQuyen(null, keToanRole, "DANH_SACH_THU", "READ"),
    //                     new PhanQuyen(null, keToanRole, "DANH_SACH_THU", "CREATE"),
    //                     new PhanQuyen(null, keToanRole, "DANH_SACH_THU", "UPDATE"),
    //                     new PhanQuyen(null, keToanRole, "DANH_SACH_CHI", "READ"),
    //                     new PhanQuyen(null, keToanRole, "DANH_SACH_CHI", "CREATE"),
    //                     new PhanQuyen(null, keToanRole, "HOAT_DONG_THIEN_NGUYEN", "READ"),
    //                      new PhanQuyen(null, keToanRole, "HOAT_DONG_THIEN_NGUYEN", "CREATE"),
    //                     new PhanQuyen(null, keToanRole, "THU_THIEN_NGUYEN", "READ"),
    //                      new PhanQuyen(null, keToanRole, "THU_THIEN_NGUYEN", "CREATE")
    //             ));
    //             // LanhDao Permissions
    //              phanQuyenRepository.saveAll(List.of(
    //                     new PhanQuyen(null, lanhDaoRole, "NHAN_KHAU", "READ"),
    //                     new PhanQuyen(null, lanhDaoRole, "HO_KHAU", "READ"),
    //                     new PhanQuyen(null, lanhDaoRole, "DANH_SACH_THU", "READ"),
    //                     new PhanQuyen(null, lanhDaoRole, "DANH_SACH_CHI", "READ"),
    //                     new PhanQuyen(null, lanhDaoRole, "THU_THIEN_NGUYEN", "READ")
    //             ));
    //         } else {
    //              System.out.println(">>> Roles & Permissions already exist.");
    //         }

    //         // --- 2. Accounts ---
    //         if (taiKhoanRepository.count() == 0) {
    //              System.out.println(">>> Creating Accounts...");
    //              String encodedPassword = passwordEncoder.encode("password123");
    //              VaiTro adminRole = vaiTroRepository.findByTenVaiTro("ADMIN_HE_THONG");
    //              VaiTro canBoNKRole = vaiTroRepository.findByTenVaiTro("CAN_BO_NHAN_KHAU");
    //              VaiTro keToanRole = vaiTroRepository.findByTenVaiTro("KE_TOAN_THU_CHI");
    //              VaiTro lanhDaoRole = vaiTroRepository.findByTenVaiTro("LANH_DAO_PHUONG");

    //              taiKhoanRepository.save(new TaiKhoan(null, "admin", encodedPassword, "Active", adminRole));
    //              taiKhoanRepository.save(new TaiKhoan(null, "canbonk", encodedPassword, "Active", canBoNKRole));
    //              taiKhoanRepository.save(new TaiKhoan(null, "ketoan", encodedPassword, "Active", keToanRole));
    //              taiKhoanRepository.save(new TaiKhoan(null, "lanhdao", encodedPassword, "Active", lanhDaoRole));
    //         } else {
    //              System.out.println(">>> Accounts already exist.");
    //         }

    //         // --- 3. Nhân khẩu & Hộ khẩu ---
    //         if (nhanKhauRepository.count() == 0) {
    //              System.out.println(">>> Creating NhanKhau & HoKhau...");
    //              // Hộ 1
    //              NhanKhau nkA1 = nhanKhauRepository.save(new NhanKhau(null, "Nguyễn A1", LocalDate.of(1975, 1, 1), "Nam", "001750000010", null, null, null, null, null, "Thường trú", "Ghi chú A1"));
    //              NhanKhau nkA2 = nhanKhauRepository.save(new NhanKhau(null, "Nguyễn A2", LocalDate.of(1978, 5, 15), "Nữ", "001780000020", null, null, null, null, null, "Thường trú", "Ghi chú A2"));
    //              NhanKhau nkA3 = nhanKhauRepository.save(new NhanKhau(null, "Nguyễn A3", LocalDate.of(2005, 10, 20), "Nữ", "001050000030", null, null, null, null, null, "Thường trú", "Ghi chú A3"));
    //              HoKhau hk1 = hoKhauRepository.save(new HoKhau(null, "HK00001", nkA1, "Số 123, Đường Thống Nhất, Phường 1", LocalDate.now())); // Bỏ list thành viên
    //              thanhVienHoRepository.saveAll(List.of(
    //                      new ThanhVienHo(null, nkA1, hk1, "Chủ hộ", null),
    //                      new ThanhVienHo(null, nkA2, hk1, "Vợ", null),
    //                      new ThanhVienHo(null, nkA3, hk1, "Con", null)
    //              ));

    //              // Hộ 2
    //              NhanKhau nkB1 = nhanKhauRepository.save(new NhanKhau(null, "Dương B1", LocalDate.of(1980, 2, 2), "Nữ", "002800000010", null, null, null, null, null, "Thường trú", "Ghi chú B1"));
    //              NhanKhau nkB2 = nhanKhauRepository.save(new NhanKhau(null, "Dương B2", LocalDate.of(2008, 7, 25), "Nam", "002080000020", null, null, null, null, null, "Thường trú", "Ghi chú B2"));
    //              NhanKhau nkB3 = nhanKhauRepository.save(new NhanKhau(null, "Dương B3", LocalDate.of(2012, 11, 10), "Nữ", "002120000030", null, null, null, null, null, "Thường trú", "Ghi chú B3"));
    //              NhanKhau nkB4 = nhanKhauRepository.save(new NhanKhau(null, "Dương B4", LocalDate.of(2018, 3, 5), "Nam", "002180000040", null, null, null, null, null, "Thường trú", "Ghi chú B4"));
    //              HoKhau hk2 = hoKhauRepository.save(new HoKhau(null, "HK00002", nkB1, "Số 45, Đường Hòa Bình, Phường 2", LocalDate.now()));
    //              thanhVienHoRepository.saveAll(List.of(
    //                      new ThanhVienHo(null, nkB1, hk2, "Chủ hộ", null),
    //                      new ThanhVienHo(null, nkB2, hk2, "Con", null),
    //                      new ThanhVienHo(null, nkB3, hk2, "Con", null),
    //                      new ThanhVienHo(null, nkB4, hk2, "Con", null)
    //              ));
                 
    //              // (Thêm Hộ 3 và Hộ 4 tương tự...)

    //         } else {
    //              System.out.println(">>> NhanKhau & HoKhau already exist.");
    //         }

    //         // --- 4. Thu Chi & Thiện Nguyện ---
    //         if (khoanChiPhiBatBuocRepository.count() == 0) {
    //              System.out.println(">>> Creating KhoanChiPhi & ThuChi data...");
    //              khoanChiPhiBatBuocRepository.saveAll(List.of(
    //                      new KhoanChiPhiBatBuoc(null, "Phí An ninh", "Chi phí bảo vệ", new BigDecimal("50000.00"), null),
    //                      new KhoanChiPhiBatBuoc(null, "Phí Vệ sinh", "Thu gom rác", new BigDecimal("30000.00"), null)
    //              ));

    //              // Lấy ID Tài khoản Kế toán
    //              TaiKhoan keToanAcc = taiKhoanRepository.findByTenDangNhap("ketoan").orElse(null);
    //              HoKhau hk1 = hoKhauRepository.findByMaSoHo("HK00001").orElse(null);
    //              HoKhau hk2 = hoKhauRepository.findByMaSoHo("HK00002").orElse(null);
    //              // (Thêm HK3, HK4)

    //              if (keToanAcc != null && hk1 != null && hk2 != null) {
    //                   // Tạo Danh sách Thu Phí An ninh
    //                  danhSachThuPhiRepository.saveAll(List.of(
    //                          new DanhSachThuPhi(null, "Phí An ninh 10/2025", new BigDecimal("50000.00"), LocalDateTime.now(), hk1, "Đã đóng", keToanAcc, LocalDateTime.now()),
    //                          new DanhSachThuPhi(null, "Phí An ninh 10/2025", new BigDecimal("50000.00"), LocalDateTime.now(), hk2, "Chưa đóng", null, null)
    //                          // (Thêm HK3, HK4)
    //                  ));

    //                  // Tạo Danh sách Chi
    //                  danhSachChiRepository.saveAll(List.of(
    //                         new DanhSachChi(null, "Mua vật tư vệ sinh", new BigDecimal("850000.00"), LocalDateTime.now(), keToanAcc, null),
    //                         new DanhSachChi(null, "Thanh toán Điện nước", new BigDecimal("2500000.00"), LocalDateTime.now(), keToanAcc, null)
    //                  ));
    //              }
                 
    //              // Tạo hoạt động Thiện Nguyện
    //              HoatDongThienNguyen hdtn = hoatDongThienNguyenRepository.save(
    //                  new HoatDongThienNguyen(null, "Ủng hộ lũ lụt miền Trung", new BigDecimal("10000000.00"), LocalDate.of(2025, 9, 1), LocalDate.of(2025, 10, 30))
    //              );
    //              // Tạo Thu Thiện Nguyện
    //              thuThienNguyenRepository.saveAll(List.of(
    //                  new ThuThienNguyen(null, new BigDecimal("200000.00"), LocalDateTime.now(), "Ẩn danh", hdtn),
    //                  new ThuThienNguyen(null, new BigDecimal("500000.00"), LocalDateTime.now(), "Hộ HK00001", hdtn)
    //              ));
    //         } else {
    //              System.out.println(">>> ThuChi & ThienNguyen data already exist.");
    //         }

    //         System.out.println(">>> Demo Data Initialization Complete.");
    //     };
    // }
}
