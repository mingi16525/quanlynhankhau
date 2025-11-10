package cnpm.qlnk.demo.controller;

import cnpm.qlnk.demo.config.JwtTokenProvider;
import cnpm.qlnk.demo.service.TaiKhoanService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.HashMap;
import java.util.Map;
import cnpm.qlnk.demo.dto.LoginRequest;
import cnpm.qlnk.demo.entity.TaiKhoan;
import cnpm.qlnk.demo.repository.TaiKhoanRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.GrantedAuthority;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private TaiKhoanRepository taiKhoanRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        System.out.println("=== LOGIN REQUEST ===");
        System.out.println("Username: " + request.getUsername());
        
        try {
            // Lấy thông tin tài khoản trước khi authenticate
            TaiKhoan taiKhoan = taiKhoanRepository.findByTenDangNhap(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản"));

            System.out.println("Found account: " + taiKhoan.getTenDangNhap());
            System.out.println("Role: " + taiKhoan.getVaiTro().getTenVaiTro());
            System.out.println("Status: " + taiKhoan.getTrangThai());

            // Authenticate
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            // Generate token
            String token = jwtTokenProvider.generateToken(authentication);
            
            System.out.println("=== TOKEN GENERATED ===");
            System.out.println("Token: " + token);

            // Lấy authorities
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            
            // Tạo response
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            
            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("username", taiKhoan.getTenDangNhap());
            userInfo.put("role", taiKhoan.getVaiTro().getTenVaiTro());
            userInfo.put("roleId", taiKhoan.getVaiTro().getId());
            userInfo.put("status", taiKhoan.getTrangThai());
            userInfo.put("authorities", userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList()));
            
            response.put("user", userInfo);

            System.out.println("=== RESPONSE ===");
            System.out.println("Response: " + response);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("=== LOGIN ERROR ===");
            e.printStackTrace();
            
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Tên đăng nhập hoặc mật khẩu không đúng");
            return ResponseEntity.status(401).body(errorResponse);
        }
    }

    @GetMapping("/status")
    public ResponseEntity<?> getAuthStatus(Principal principal) {
        if (principal != null) {
            Map<String, Object> response = new HashMap<>();
            response.put("authenticated", true);
            response.put("username", principal.getName());
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(401).body(Map.of("message", "Chưa xác thực."));
    }
}