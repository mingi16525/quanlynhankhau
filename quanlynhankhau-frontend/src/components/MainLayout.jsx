import React from 'react';
import { Layout, Menu, Button, Typography, Avatar, Dropdown } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    HomeOutlined,
    UserOutlined,
    TeamOutlined,
    WalletOutlined,
    BarChartOutlined,
    SettingOutlined,
    LogoutOutlined,
    DownOutlined
} from '@ant-design/icons';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

const MainLayout = () => {
    const { authState, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Menu items dựa theo role
    const getMenuItems = (role) => {
        const commonItems = [
            { key: '/dashboard', icon: <HomeOutlined />, label: 'Trang chủ' }
        ];

        if (role === 'Admin' || role === 'ADMIN_HE_THONG') {
            return [
                ...commonItems,
                { key: '/dashboard/admin/taikhoan', icon: <UserOutlined />, label: 'Quản lý Tài khoản' },
            ];
        } else if (role === 'CAN_BO_NHAN_KHAU') {
            return [
                ...commonItems,
                { key: '/dashboard/nhankhau', icon: <UserOutlined />, label: 'Nhân khẩu' },
                { key: '/dashboard/hokhau', icon: <TeamOutlined />, label: 'Hộ khẩu' },
                { key: '/dashboard/tamtrutamvang', icon: <HomeOutlined />, label: 'Tam trú tạm vắng' },
                { key: '/dashboard/sukien', icon: <BarChartOutlined />, label: 'Sự kiện' },
            ];
        } else if (role === 'KE_TOAN_THU_CHI') {
            return [
                ...commonItems,
                { key: '/dashboard/khoanphi', icon: <WalletOutlined />, label: 'Khoản phí' },
                { key: '/dashboard/danhsachchi', icon: <WalletOutlined />, label: 'Khoản Chi' },
                { key: '/dashboard/hoatdongthiennguyen', icon: <WalletOutlined />, label: 'Thiện nguyện' },
            ];
        } else if (role === 'LANH_DAO_PHUONG') {
            return [
                ...commonItems,
                { key: '/dashboard/baocao', icon: <BarChartOutlined />, label: 'Báo cáo' },
                { key: '/dashboard/thuchi/danhsachchi', icon: <WalletOutlined />, label: 'Thu Chi' },
                { key: '/dashboard/nhankhau', icon: <UserOutlined />, label: 'Nhân khẩu (Xem)' },
            ];
        }

        return commonItems;
    };

    const menuItems = getMenuItems(authState?.role);

    const userMenu = (
        <Menu>
            <Menu.Item key="profile" icon={<UserOutlined />}>
                Thông tin cá nhân
            </Menu.Item>
            <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
                Đăng xuất
            </Menu.Item>
        </Menu>
    );

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                background: '#001529',
                padding: '0 24px'
            }}>
                <Title level={4} style={{ color: 'white', margin: 0 }}>
                    Hệ thống Quản lý Phường
                </Title>
                <Dropdown overlay={userMenu} trigger={['click']}>
                    <div style={{ cursor: 'pointer', color: 'white' }}>
                        <Avatar icon={<UserOutlined />} />
                        <Text style={{ color: 'white', marginLeft: 8 }}>
                            {authState?.user?.username} ({authState?.role})
                        </Text>
                        <DownOutlined style={{ marginLeft: 8 }} />
                    </div>
                </Dropdown>
            </Header>
            <Layout>
                <Sider width={250} style={{ background: '#fff' }}>
                    <Menu
                        mode="inline"
                        selectedKeys={[location.pathname]}
                        items={menuItems}
                        onClick={({ key }) => navigate(key)}
                        style={{ height: '100%', borderRight: 0 }}
                    />
                </Sider>
                <Layout style={{ padding: '24px' }}>
                    <Content
                        style={{
                            padding: 24,
                            margin: 0,
                            minHeight: 280,
                            background: '#fff',
                            borderRadius: 8
                        }}
                    >
                        <Outlet />
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default MainLayout;