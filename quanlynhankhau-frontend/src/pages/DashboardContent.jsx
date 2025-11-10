import React from 'react';
import { Card, Col, Row, Typography, Button } from 'antd';
import { 
    UserOutlined, 
    SettingOutlined, 
    HomeOutlined, 
    EnvironmentOutlined,
    CalendarOutlined,
    PlusCircleOutlined,
    WalletOutlined,
    FormOutlined,
    HeartOutlined,
    LineChartOutlined,
    TableOutlined
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const iconMap = {
    UserOutlined: <UserOutlined style={{ fontSize: 32, color: '#1890ff' }} />,
    SettingOutlined: <SettingOutlined style={{ fontSize: 32, color: '#1890ff' }} />,
    HomeOutlined: <HomeOutlined style={{ fontSize: 32, color: '#1890ff' }} />,
    EnvironmentOutlined: <EnvironmentOutlined style={{ fontSize: 32, color: '#1890ff' }} />,
    CalendarOutlined: <CalendarOutlined style={{ fontSize: 32, color: '#1890ff' }} />,
    PlusCircleOutlined: <PlusCircleOutlined style={{ fontSize: 32, color: '#1890ff' }} />,
    WalletOutlined: <WalletOutlined style={{ fontSize: 32, color: '#1890ff' }} />,
    FormOutlined: <FormOutlined style={{ fontSize: 32, color: '#1890ff' }} />,
    HeartOutlined: <HeartOutlined style={{ fontSize: 32, color: '#1890ff' }} />,
    LineChartOutlined: <LineChartOutlined style={{ fontSize: 32, color: '#1890ff' }} />,
    TableOutlined: <TableOutlined style={{ fontSize: 32, color: '#1890ff' }} />,
};

const getDashboardItems = (role) => {
    console.log('Getting dashboard items for role:', role);
    
    const baseItems = [];

    // Lưu ý: So sánh với tên vai trò từ database
    if (role === 'Admin' || role === 'ADMIN_HE_THONG') {
        return [
            { title: "Quản lý Tài khoản", icon: "UserOutlined", path: "/dashboard/admin/taikhoan" },
            ...baseItems
        ];
    } else if (role === 'CAN_BO_NHAN_KHAU') {
        return [
            { title: "Hồ sơ Nhân khẩu", icon: "UserOutlined", path: "/dashboard/nhankhau" },
            { title: "Quản lý Hộ khẩu", icon: "HomeOutlined", path: "/dashboard/hokhau" },
            { title: "Đăng ký Tam trú tạm vắng", icon: "EnvironmentOutlined", path: "/dashboard/tamtrutamvang" },
            { title: "Ghi nhận Sự kiện", icon: "CalendarOutlined", path: "/dashboard/sukien" }
        ];
    } else if (role === 'KE_TOAN_THU_CHI') {
    return [
        { title: "Khoản phí", icon: "WalletOutlined", path: "/dashboard/khoanphi" },
        { title: "Khoản Chi", icon: "WalletOutlined", path: "/dashboard/danhsachchi" },
        { title: "Thiện nguyện", icon: "HeartOutlined", path: "/dashboard/hoatdongthiennguyen" },
    ];
} else if (role === 'LANH_DAO_PHUONG') {
        return [
            { title: "Báo cáo Tổng hợp", icon: "LineChartOutlined", path: "/dashboard/baocao" },
            { title: "Danh sách Thu Chi", icon: "TableOutlined", path: "/dashboard/thuchi/danhsachchi" },
            { title: "Hồ sơ Nhân khẩu", icon: "UserOutlined", path: "/dashboard/nhankhau" },
        ];
    }
    
    return [];
};

const DashboardContent = () => {
    const { authState } = useAuth();
    const navigate = useNavigate();
    
    console.log('=== DASHBOARD DEBUG ===');
    console.log('Full authState:', authState);
    console.log('Role from authState:', authState?.role);
    console.log('Username:', authState?.user?.username);
    console.log('Status:', authState?.status);
    
    // Lấy thông tin từ authState (đã được cập nhật từ AuthContext)
    const role = authState?.role || 'Không xác định';
    const username = authState?.user?.username || 'Người dùng';
    const dashboardItems = getDashboardItems(role);
    
    console.log('Dashboard items:', dashboardItems);
    
    return (
        <div style={{ padding: '24px' }}>
            <Title level={3}>Xin chào, {username}!</Title>
            <Title level={4} type="secondary">Bạn đang giữ vai trò: {role}</Title>
            
            {dashboardItems.length === 0 && (
                <Card style={{ marginTop: 30, textAlign: 'center' }}>
                    <p>Không có chức năng nào khả dụng cho vai trò này.</p>
                </Card>
            )}
            
            <Row gutter={[16, 16]} style={{ marginTop: 30 }}>
                {dashboardItems.map((item, index) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={index}>
                        <Card 
                            hoverable 
                            onClick={() => navigate(item.path)}
                            style={{ textAlign: 'center', minHeight: 150 }}
                        >
                            {iconMap[item.icon]}
                            <p style={{ marginTop: 10, fontWeight: 'bold' }}>{item.title}</p>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default DashboardContent;