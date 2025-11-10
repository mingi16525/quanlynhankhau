import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Button, Tooltip } from 'antd';

// Component bao bọc kiểm tra quyền hạn
export const PermissionCheck = ({ permission, children }) => {
    const { hasPermission } = useAuth();

    if (hasPermission(permission)) {
        return <>{children}</>;
    }
    return null; // Không hiển thị nếu không có quyền
};

// Hàm kiểm tra quyền dùng trong Component
export const checkPermission = (permission) => {
    const { hasPermission } = useAuth();
    return hasPermission(permission);
};  