import React from 'react';
import { Form, Input, Button, message, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import loginApi from '../api/loginAPI';
import { LockOutlined, UserOutlined } from '@ant-design/icons';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login, authState } = useAuth();

    // Redirect nếu đã đăng nhập
    React.useEffect(() => {
        console.log('LoginPage - authState:', authState);
        if (authState.isAuthenticated) {
            console.log('Already authenticated, redirecting to dashboard');
            navigate('/dashboard', { replace: true });
        }
    }, [authState.isAuthenticated, navigate]);

    const onFinish = async (values) => {
        console.log('=== LOGIN START ===');
        console.log('Login credentials:', values);
        
        try {
            const response = await loginApi.login(values);
            
            console.log('=== RESPONSE FROM BACKEND ===');
            console.log('Full response:', response);
            console.log('Response data:', response.data);
            console.log('Token from response:', response.data.token);
            console.log('User info from response:', response.data.user);

            // Kiểm tra token có tồn tại không
            if (!response.data.token) {
                console.error('ERROR: Token is missing from response!');
                message.error('Lỗi: Không nhận được token từ server');
                return;
            }

            // Lưu vào Context và LocalStorage
            console.log('Calling login function...');
            login(response.data);

            console.log('=== AFTER LOGIN ===');
            console.log('Token in localStorage:', localStorage.getItem('jwtToken'));
            console.log('AuthState in localStorage:', localStorage.getItem('authState'));
            
            message.success('Đăng nhập thành công!');
            
            // Delay nhỏ để đảm bảo state đã cập nhật
            setTimeout(() => {
                console.log('Navigating to dashboard...');
                navigate('/dashboard', { replace: true });
            }, 100);
        } catch (error) {
            console.error('=== LOGIN ERROR ===');
            console.error('Error object:', error);
            console.error('Error response:', error.response);
            console.error('Error data:', error.response?.data);
            
            message.error(
                error.response?.data?.message || 'Tên đăng nhập hoặc mật khẩu không đúng!'
            );
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: '#f0f2f5'
        }}>
            <Card
                title="Đăng nhập hệ thống"
                style={{ width: 400, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
                headStyle={{ textAlign: 'center', fontWeight: 'bold' }}
            >
                <Form
                    name="login"
                    onFinish={onFinish}
                    layout="vertical"
                    autoComplete="off"
                >
                    <Form.Item
                        name="username"
                        label="Tên đăng nhập"
                        rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Tên đăng nhập"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Mật khẩu"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Mật khẩu"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                        >
                            Đăng nhập
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default LoginPage;