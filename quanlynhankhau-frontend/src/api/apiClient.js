import axios from 'axios';

const apiClient = axios.create({
    // Trong dev mode, dùng /api để đi qua Vite proxy
    // Trong production, dùng VITE_API_BASE_URL từ .env
    baseURL: import.meta.env.DEV ? '/api' : (import.meta.env.VITE_API_BASE_URL + '/api'),
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Biến để track số lần retry
let isRefreshing = false;

// Request Interceptor
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwtToken');
        console.log('=== REQUEST INTERCEPTOR ===');
        console.log('URL:', config.url);
        console.log('Method:', config.method);
        console.log('Token exists:', !!token);
        
        if (token && token !== 'null' && token !== 'undefined') {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('Authorization header added');
        } else {
            console.warn('No valid token found for request:', config.url);
        }
        
        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Response Interceptor
apiClient.interceptors.response.use(
    (response) => {
        console.log('=== RESPONSE SUCCESS ===');
        console.log('URL:', response.config.url);
        console.log('Status:', response.status);
        return response;
    },
    (error) => {
        console.error('=== RESPONSE ERROR ===');
        console.error('URL:', error.config?.url);
        console.error('Status:', error.response?.status);
        console.error('Message:', error.response?.data?.message);
        
        if (error.response?.status === 401) {
            const isLoginRequest = error.config?.url?.includes('/auth/login');
            
            console.log('401 Unauthorized');
            console.log('Is login request:', isLoginRequest);
            console.log('Current path:', window.location.pathname);
            
            // QUAN TRỌNG: Chỉ xóa token nếu:
            // 1. Không phải login request
            // 2. Đã ở trang dashboard (không phải đang load lần đầu)
            // 3. Token thực sự có vấn đề (không phải timing issue)
            if (!isLoginRequest && !isRefreshing) {
                isRefreshing = true;
                
                // Delay một chút để đảm bảo authState đã load
                setTimeout(() => {
                    const token = localStorage.getItem('jwtToken');
                    console.log('Delayed 401 check - Token exists:', !!token);
                    
                    // Nếu vẫn không có token sau delay → Thực sự bị lỗi
                    if (token) {
                        console.warn('Token exists but got 401 - Invalid token, clearing auth');
                        localStorage.removeItem('jwtToken');
                        localStorage.removeItem('authState');
                        
                        if (!window.location.pathname.includes('/login')) {
                            console.log('Redirecting to login...');
                            window.location.href = '/login';
                        }
                    } else {
                        console.log('No token found - User not logged in yet');
                    }
                    
                    isRefreshing = false;
                }, 5000); // Delay 500ms
            }
        }
        
        return Promise.reject(error);
    }
);

export default apiClient;