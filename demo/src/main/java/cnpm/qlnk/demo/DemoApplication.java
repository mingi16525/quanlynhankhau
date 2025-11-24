package cnpm.qlnk.demo;
import cnpm.qlnk.demo.entity.*;
import cnpm.qlnk.demo.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.time.LocalDate;
import java.util.List;

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
                 
    //              // === HỘ 1: Gia đình Nguyễn Văn An ===
    //              NhanKhau nkA1 = new NhanKhau();
    //              nkA1.setHoTen("Nguyễn Văn An");
    //              nkA1.setNgaySinh(LocalDate.of(1975, 3, 15));
    //              nkA1.setGioiTinh("Nam");
    //              nkA1.setSoCCCD("001075012345");
    //              nkA1.setNgheNghiep("Kỹ sư xây dựng");
    //              nkA1.setNoiLamViec("Công ty TNHH Xây dựng Hoàng Long");
    //              nkA1.setQueQuan("Hà Nội");
    //              nkA1.setNoiSinh("Bệnh viện Bạch Mai, Hà Nội");
    //              nkA1.setNguyenQuan("Xã Đông Anh, Huyện Đông Anh, Hà Nội");
    //              nkA1.setDanToc("Kinh");
    //              nkA1.setTonGiao("Không");
    //              nkA1.setQuocTich("Việt Nam");
    //              nkA1.setDiaChiThuongTru("Số 123, Đường Thống Nhất, Phường 1, Quận 10, TP.HCM");
    //              nkA1.setSoDienThoai("0901234567");
    //              nkA1.setEmail("nva@gmail.com");
    //              nkA1.setTrinhDoHocVan("Đại học");
    //              nkA1.setTinhTrang("Thường trú");
    //              nkA1.setGhiChu("Chủ hộ, có hộ khẩu thường trú");
    //              nkA1 = nhanKhauRepository.save(nkA1);

    //              NhanKhau nkA2 = new NhanKhau();
    //              nkA2.setHoTen("Trần Thị Bình");
    //              nkA2.setNgaySinh(LocalDate.of(1978, 7, 20));
    //              nkA2.setGioiTinh("Nữ");
    //              nkA2.setSoCCCD("001078023456");
    //              nkA2.setNgheNghiep("Giáo viên");
    //              nkA2.setNoiLamViec("Trường THPT Lê Quý Đôn");
    //              nkA2.setQueQuan("Hải Phòng");
    //              nkA2.setNoiSinh("Bệnh viện Phụ sản, Hải Phòng");
    //              nkA2.setNguyenQuan("Xã An Dương, Huyện An Dương, Hải Phòng");
    //              nkA2.setDanToc("Kinh");
    //              nkA2.setTonGiao("Phật giáo");
    //              nkA2.setQuocTich("Việt Nam");
    //              nkA2.setDiaChiThuongTru("Số 123, Đường Thống Nhất, Phường 1, Quận 10, TP.HCM");
    //              nkA2.setSoDienThoai("0901234568");
    //              nkA2.setEmail("ttb@gmail.com");
    //              nkA2.setTrinhDoHocVan("Đại học");
    //              nkA2.setTinhTrang("Thường trú");
    //              nkA2.setGhiChu("Vợ chủ hộ");
    //              nkA2 = nhanKhauRepository.save(nkA2);

    //              NhanKhau nkA3 = new NhanKhau();
    //              nkA3.setHoTen("Nguyễn Minh Châu");
    //              nkA3.setNgaySinh(LocalDate.of(2005, 10, 8));
    //              nkA3.setGioiTinh("Nữ");
    //              nkA3.setSoCCCD("001005034567");
    //              nkA3.setNgheNghiep("Sinh viên");
    //              nkA3.setNoiLamViec("Đại học Bách Khoa TP.HCM");
    //              nkA3.setQueQuan("TP.HCM");
    //              nkA3.setNoiSinh("Bệnh viện Từ Dũ, TP.HCM");
    //              nkA3.setNguyenQuan("Phường 1, Quận 10, TP.HCM");
    //              nkA3.setDanToc("Kinh");
    //              nkA3.setTonGiao("Không");
    //              nkA3.setQuocTich("Việt Nam");
    //              nkA3.setDiaChiThuongTru("Số 123, Đường Thống Nhất, Phường 1, Quận 10, TP.HCM");
    //              nkA3.setSoDienThoai("0901234569");
    //              nkA3.setEmail("nmc@gmail.com");
    //              nkA3.setTrinhDoHocVan("Đang học Đại học");
    //              nkA3.setTinhTrang("Thường trú");
    //              nkA3.setGhiChu("Con gái");
    //              nkA3 = nhanKhauRepository.save(nkA3);

    //              HoKhau hk1 = hoKhauRepository.save(new HoKhau(null, "HK00001", nkA1, "Số 123, Đường Thống Nhất, Phường 1, Quận 10, TP.HCM", LocalDate.of(2020, 1, 15)));
    //              thanhVienHoRepository.saveAll(List.of(
    //                      new ThanhVienHo(null, nkA1, hk1, "Chủ hộ", ""),
    //                      new ThanhVienHo(null, nkA2, hk1, "Vợ", ""),
    //                      new ThanhVienHo(null, nkA3, hk1, "Con", "")
    //              ));

    //              // === HỘ 2: Gia đình Dương Thị Hoa ===
    //              NhanKhau nkB1 = new NhanKhau();
    //              nkB1.setHoTen("Dương Thị Hoa");
    //              nkB1.setNgaySinh(LocalDate.of(1982, 5, 12));
    //              nkB1.setGioiTinh("Nữ");
    //              nkB1.setSoCCCD("001082045678");
    //              nkB1.setNgheNghiep("Bác sĩ");
    //              nkB1.setNoiLamViec("Bệnh viện Chợ Rẫy");
    //              nkB1.setQueQuan("Đà Nẵng");
    //              nkB1.setNoiSinh("Bệnh viện Đà Nẵng");
    //              nkB1.setNguyenQuan("Phường Hòa Minh, Quận Liên Chiểu, Đà Nẵng");
    //              nkB1.setDanToc("Kinh");
    //              nkB1.setTonGiao("Công giáo");
    //              nkB1.setQuocTich("Việt Nam");
    //              nkB1.setDiaChiThuongTru("Số 45, Đường Hòa Bình, Phường 2, Quận 5, TP.HCM");
    //              nkB1.setSoDienThoai("0902345678");
    //              nkB1.setEmail("dth@gmail.com");
    //              nkB1.setTrinhDoHocVan("Thạc sĩ");
    //              nkB1.setTinhTrang("Thường trú");
    //              nkB1.setGhiChu("Chủ hộ, mẹ đơn thân");
    //              nkB1 = nhanKhauRepository.save(nkB1);

    //              NhanKhau nkB2 = new NhanKhau();
    //              nkB2.setHoTen("Dương Minh Khôi");
    //              nkB2.setNgaySinh(LocalDate.of(2008, 3, 25));
    //              nkB2.setGioiTinh("Nam");
    //              nkB2.setSoCCCD("001008056789");
    //              nkB2.setNgheNghiep("Học sinh");
    //              nkB2.setNoiLamViec("Trường THPT Gia Định");
    //              nkB2.setQueQuan("TP.HCM");
    //              nkB2.setNoiSinh("Bệnh viện Chợ Rẫy, TP.HCM");
    //              nkB2.setNguyenQuan("Phường 2, Quận 5, TP.HCM");
    //              nkB2.setDanToc("Kinh");
    //              nkB2.setTonGiao("Công giáo");
    //              nkB2.setQuocTich("Việt Nam");
    //              nkB2.setDiaChiThuongTru("Số 45, Đường Hòa Bình, Phường 2, Quận 5, TP.HCM");
    //              nkB2.setSoDienThoai("0902345679");
    //              nkB2.setEmail("dmk@gmail.com");
    //              nkB2.setTrinhDoHocVan("THPT");
    //              nkB2.setTinhTrang("Thường trú");
    //              nkB2.setGhiChu("Con trai");
    //              nkB2 = nhanKhauRepository.save(nkB2);

    //              NhanKhau nkB3 = new NhanKhau();
    //              nkB3.setHoTen("Dương Minh Châu");
    //              nkB3.setNgaySinh(LocalDate.of(2012, 11, 5));
    //              nkB3.setGioiTinh("Nữ");
    //              nkB3.setSoCCCD("001012067890");
    //              nkB3.setNgheNghiep("Học sinh");
    //              nkB3.setNoiLamViec("Trường THCS Nguyễn Du");
    //              nkB3.setQueQuan("TP.HCM");
    //              nkB3.setNoiSinh("Bệnh viện Chợ Rẫy, TP.HCM");
    //              nkB3.setNguyenQuan("Phường 2, Quận 5, TP.HCM");
    //              nkB3.setDanToc("Kinh");
    //              nkB3.setTonGiao("Công giáo");
    //              nkB3.setQuocTich("Việt Nam");
    //              nkB3.setDiaChiThuongTru("Số 45, Đường Hòa Bình, Phường 2, Quận 5, TP.HCM");
    //              nkB3.setSoDienThoai("0902345680");
    //              nkB3.setEmail("dmc@gmail.com");
    //              nkB3.setTrinhDoHocVan("THCS");
    //              nkB3.setTinhTrang("Thường trú");
    //              nkB3.setGhiChu("Con gái");
    //              nkB3 = nhanKhauRepository.save(nkB3);

    //              HoKhau hk2 = hoKhauRepository.save(new HoKhau(null, "HK00002", nkB1, "Số 45, Đường Hòa Bình, Phường 2, Quận 5, TP.HCM", LocalDate.of(2019, 6, 20)));
    //              thanhVienHoRepository.saveAll(List.of(
    //                      new ThanhVienHo(null, nkB1, hk2, "Chủ hộ", ""),
    //                      new ThanhVienHo(null, nkB2, hk2, "Con", ""),
    //                      new ThanhVienHo(null, nkB3, hk2, "Con", "")
    //              ));

    //         } else {
    //              System.out.println(">>> NhanKhau & HoKhau already exist.");
    //         }
    //         System.out.println(">>> Demo Data Initialization Complete.");
    //     };
    // }
}
