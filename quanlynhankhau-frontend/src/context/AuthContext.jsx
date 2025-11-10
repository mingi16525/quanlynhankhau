import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        user: null, 
        isAuthenticated: false,
        authorities: [], 
        role: null,
        roleId: null,
        status: null,
        isReady: false,
    });

    // Theo dõi localStorage changes
    useEffect(() => {
        const handleStorageChange = (e) => {
            console.log('=== LOCALSTORAGE CHANGED ===');
            console.log('Key:', e.key);
            console.log('Old value:', e.oldValue);
            console.log('New value:', e.newValue);
            
            if (e.key === 'jwtToken') {
                console.log('JWT Token was changed!');
                if (e.newValue === null) {
                    console.error('WARNING: JWT Token was REMOVED!');
                    console.trace('Stack trace:');
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    // Duy trì trạng thái đăng nhập
    useEffect(() => {
        console.log('=== LOADING AUTH STATE FROM LOCALSTORAGE ===');
        
        // Log TRƯỚC khi lấy
        console.log('localStorage keys:', Object.keys(localStorage));
        console.log('All localStorage items:', {
            jwtToken: localStorage.getItem('jwtToken'),
            authState: localStorage.getItem('authState')
        });
        
        const token = localStorage.getItem('jwtToken');
        const persistedAuth = localStorage.getItem('authState');

        console.log('Token:', token);
        console.log('Token length:', token?.length);
        console.log('Persisted Auth:', persistedAuth);

        // Kiểm tra persistedAuth trước
        if (persistedAuth) {
            try {
                const data = JSON.parse(persistedAuth);
                console.log('Parsed data:', data);
                
                // Kiểm tra token
                if (!token || token === 'null' || token === 'undefined') {
                    console.error('ERROR: authState exists but token is missing or invalid!');
                    console.log('Clearing authState...');
                    localStorage.removeItem('authState');
                    setAuthState(prev => ({ ...prev, isReady: true }));
                    return;
                }
                
                console.log('Restoring auth state...');
                setAuthState({
                    user: data.user,
                    isAuthenticated: true,
                    authorities: data.authorities || [],
                    role: data.role,
                    roleId: data.roleId,
                    status: data.status,
                    isReady: true,
                });
                console.log('Auth state restored successfully');
            } catch (e) {
                console.error('Lỗi khi parse authState:', e);
                localStorage.clear();
                setAuthState(prev => ({ ...prev, isReady: true }));
            }
        } else {
            console.log('No persisted auth found');
            setAuthState(prev => ({ ...prev, isReady: true }));
        }
    }, []);

    // Đăng nhập
    const login = (userData) => {
        console.log('=== LOGIN FUNCTION CALLED ===');
        console.log('userData:', userData);
        console.log('Token received:', userData.token);
        console.log('Token type:', typeof userData.token);
        console.log('Token length:', userData.token?.length);

        if (!userData.token) {
            console.error('ERROR: No token in userData!');
            return;
        }

        const newState = {
            user: {
                username: userData.user.username
            },
            isAuthenticated: true,
            authorities: userData.user.authorities.map(auth => auth.authority || auth),
            role: userData.user.role,
            roleId: userData.user.roleId,
            status: userData.user.status,
            isReady: true,
        };

        console.log('New auth state:', newState);

        // Lưu token TRƯỚC
        console.log('Saving token to localStorage...');
        localStorage.setItem('jwtToken', userData.token);
        
        // Verify ngay
        const savedToken = localStorage.getItem('jwtToken');
        console.log('Verification - Token saved:', savedToken);
        console.log('Verification - Tokens match:', savedToken === userData.token);
        
        // Sau đó lưu authState
        console.log('Saving authState to localStorage...');
        localStorage.setItem('authState', JSON.stringify(newState));
        
        // Verify
        const savedAuthState = localStorage.getItem('authState');
        console.log('Verification - AuthState saved:', savedAuthState);
        
        console.log('Setting state...');
        setAuthState(newState);
        
        console.log('=== LOGIN COMPLETED ===');
    };

    // Đăng xuất
    const logout = () => {
        console.log('=== LOGOUT ===');
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('authState');
        setAuthState({
            user: null,
            isAuthenticated: false,
            authorities: [],
            role: null,
            roleId: null,
            status: null,
            isReady: true,
        });
    };

    // Kiểm tra quyền
    const hasPermission = (permission) => {
        const isAdmin = authState.authorities.includes('*:*');
        return isAdmin || authState.authorities.includes(permission);
    };

    // Kiểm tra vai trò
    const hasRole = (roleName) => {
        return authState.role === roleName;
    };

    if (!authState.isReady) {
        return <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh' 
        }}>
            Đang tải ứng dụng...
        </div>; 
    }

    console.log('=== CURRENT AUTH STATE ===', authState);

    return (
        <AuthContext.Provider value={{ 
            authState, 
            login, 
            logout,
            hasPermission,
            hasRole
        }}>
            {children}
        </AuthContext.Provider>
    );
};