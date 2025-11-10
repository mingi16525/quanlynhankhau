package cnpm.qlnk.demo.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        System.out.println("=== JWT FILTER ===");
        System.out.println("Request URI: " + request.getRequestURI());
        System.out.println("Method: " + request.getMethod());
        
        try {
            String jwt = getJwtFromRequest(request);
            System.out.println("JWT from request: " + (jwt != null ? jwt.substring(0, Math.min(20, jwt.length())) + "..." : "null"));

            if (jwt != null && jwtTokenProvider.validateToken(jwt)) {
                System.out.println("Token is valid");
                
                String username = jwtTokenProvider.getUsernameFromToken(jwt);
                System.out.println("Username from token: " + username);

                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                System.out.println("User loaded: " + userDetails.getUsername());
                System.out.println("Authorities: " + userDetails.getAuthorities());

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
                System.out.println("Authentication set in SecurityContext");
                System.out.println("SecurityContext authentication: " + SecurityContextHolder.getContext().getAuthentication());
            } else {
                if (jwt != null) {
                    System.err.println("Token validation failed!");
                } else {
                    System.out.println("No token in request");
                }
            }
            
            System.out.println("=== CALLING NEXT FILTER ===");
            filterChain.doFilter(request, response);
            System.out.println("=== AFTER FILTER CHAIN ===");
            
        } catch (Exception ex) {
            System.err.println("=== JWT FILTER ERROR ===");
            System.err.println("Error: " + ex.getMessage());
            ex.printStackTrace();
            
            // QUAN TRỌNG: Vẫn phải gọi filterChain ngay cả khi có lỗi
            filterChain.doFilter(request, response);
        }
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        System.out.println("Authorization header: " + bearerToken);
        
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            String token = bearerToken.substring(7);
            System.out.println("Extracted token length: " + token.length());
            return token;
        }
        
        return null;
    }
}