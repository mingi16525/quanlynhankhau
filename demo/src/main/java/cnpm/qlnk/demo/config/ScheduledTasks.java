package cnpm.qlnk.demo.config;

import cnpm.qlnk.demo.service.TamTruTamVangService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class ScheduledTasks {

    @Autowired
    private TamTruTamVangService tamTruTamVangService;

    /**
     * Chạy mỗi ngày lúc 00:00 để tự động cập nhật trạng thái hết hạn
     * Cron: giây phút giờ ngày tháng thứ
     */
    @Scheduled(cron = "0 0 0 * * ?")
    public void updateExpiredTamTruTamVang() {
        System.out.println("⏰ Running scheduled task: Update expired TamTruTamVang");
        tamTruTamVangService.autoUpdateExpiredRecords();
    }

    /**
     * Hoặc chạy mỗi 24 giờ
     */
    // @Scheduled(fixedRate = 86400000) // 24 hours = 86400000 ms
    // public void updateExpiredTamTruTamVang() {
    //     tamTruTamVangService.autoUpdateExpiredRecords();
    // }
}