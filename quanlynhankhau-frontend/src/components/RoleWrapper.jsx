import React from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Component wrapper để kiểm tra vai trò trước khi hiển thị
 * @param {string|string[]} roles - Vai trò hoặc danh sách vai trò cho phép
 * @param {React.ReactNode} children - Component con sẽ hiển thị nếu đúng vai trò
 * @param {React.ReactNode} fallback - Component hiển thị nếu không đúng vai trò (optional)
 */
const RoleWrapper = ({ roles, children, fallback = null }) => {
    const { authState } = useAuth();
    
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    const hasRole = allowedRoles.includes(authState.role);

    if (!hasRole) {
        return fallback;
    }

    return <>{children}</>;
};

export default RoleWrapper;
