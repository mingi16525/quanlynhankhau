package cnpm.qlnk.demo.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * Xử lý lỗi 401 (Unauthorized) → trả JSON thay vì redirect về /login
 */
@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void commence(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException authException) throws IOException {

        // Thiết lập response
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");

        // Tạo JSON lỗi
        Map<String, Object> error = new HashMap<>();
        error.put("error", "Unauthorized");
        error.put("message", "Yêu cầu xác thực. Vui lòng đăng nhập.");
        error.put("path", request.getRequestURI());
        error.put("timestamp", System.currentTimeMillis());

        // Ghi JSON vào response
        objectMapper.writeValue(response.getWriter(), error);
    }
}