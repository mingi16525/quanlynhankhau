import React from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Component wrapper để kiểm tra quyền trước khi hiển thị
 * @param {string} permission - Quyền cần kiểm tra (VD: "NHAN_KHAU:READ", "HO_KHAU:CREATE")
 * @param {React.ReactNode} children - Component con sẽ hiển thị nếu có quyền
 * @param {React.ReactNode} fallback - Component hiển thị nếu không có quyền (optional)
 */
const PermissionWrapper = ({ permission, children, fallback = null }) => {
    const { hasPermission } = useAuth();

    if (!hasPermission(permission)) {
        return fallback;
    }

    return <>{children}</>;
};

export default PermissionWrapper;
