import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Spin, message, Divider, Typography } from 'antd';
// Import a charting library if you plan to use it (e.g., Ant Design Charts)
// import { Pie, Column } from '@ant-design/charts';
import baoCaoApi from '../../api/baoCaoApi'; // Ensure this path is correct

const { Title } = Typography;

const BaoCaoPage = () => {
    const [loading, setLoading] = useState(true);
    const [dataGioiTinh, setDataGioiTinh] = useState([]);
    const [dataThuChi, setDataThuChi] = useState({ tongThu: 0, tongChi: 0 });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch Income/Expense Summary
                const resThuChi = await baoCaoApi.getThuChiTongHop();
                setDataThuChi(resThuChi.data || { tongThu: 0, tongChi: 0 }); // Handle potential null response

                // Fetch Gender Statistics
                const resGioiTinh = await baoCaoApi.getGioiTinh();
                setDataGioiTinh(resGioiTinh.data || []); // Handle potential null response

            } catch (error) {
                console.error("Error fetching report data:", error);
                message.error('Không thể tải dữ liệu báo cáo. Vui lòng kiểm tra quyền hạn hoặc kết nối.');
                // Set default values on error to prevent crashes
                setDataThuChi({ tongThu: 0, tongChi: 0 });
                setDataGioiTinh([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []); // Run only once on component mount

    if (loading) {
        return <Spin tip="Đang tải dữ liệu báo cáo..." size="large" style={{ display: 'block', marginTop: '50px' }} />;
    }

    // Calculate balance
    const soDu = (dataThuChi.tongThu || 0) - (dataThuChi.tongChi || 0);

    // Format data for charts (example for Pie chart)
    const pieChartData = dataGioiTinh.map(item => ({
        type: item.label || 'Khác', // Use label field
        value: Number(item.value) || 0, // Use value field
    }));

    return (
        <div>
            <Title level={2}>Báo cáo Tổng hợp Hệ thống</Title>

            {/* Income/Expense Section */}
            <Divider orientation="left">📊 Tình hình Thu Chi</Divider>
            <Row gutter={16}>
                <Col xs={24} sm={12} md={8}>
                    <Card title="Tổng Thu Đã Đóng" bordered={false} style={{ background: '#e6fffb', textAlign: 'center' }}>
                        <Title level={3} style={{ color: '#13c2c2' }}>{dataThuChi.tongThu?.toLocaleString()} VND</Title>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Card title="Tổng Chi Đã Thực Hiện" bordered={false} style={{ background: '#fff1f0', textAlign: 'center' }}>
                        <Title level={3} style={{ color: '#f5222d' }}>{dataThuChi.tongChi?.toLocaleString()} VND</Title>
                    </Card>
                </Col>
                <Col xs={24} sm={24} md={8}>
                    <Card title="Số Dư Quỹ" bordered={false} style={{ background: soDu >= 0 ? '#f6ffed' : '#fff0f6', textAlign: 'center' }}>
                        <Title level={3} style={{ color: soDu >= 0 ? '#52c41a' : '#eb2f96' }}>{soDu?.toLocaleString()} VND</Title>
                    </Card>
                </Col>
            </Row>

            {/* Population Statistics Section */}
            <Divider orientation="left" style={{ marginTop: '40px' }}>📈 Thống kê Nhân khẩu</Divider>
            <Row gutter={16}>
                <Col xs={24} md={12}>
                    <Card title="Phân bố Giới tính">
                        {/* Placeholder/Actual Chart Component */}
                        {/* Example using Ant Design Charts */}
                        {/* {pieChartData.length > 0 ? (
                            <Pie
                                data={pieChartData}
                                angleField='value'
                                colorField='type'
                                radius={0.8}
                                label={{
                                    type: 'inner',
                                    offset: '-30%',
                                    content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
                                    style: { fontSize: 14, textAlign: 'center' },
                                }}
                                interactions={[{ type: 'element-active' }]}
                                height={300}
                            />
                        ) : (
                            <p>Không có dữ liệu giới tính.</p>
                        )} */}
                        <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
                             
                             <p>(Biểu đồ tròn Phân bố Giới tính)</p>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card title="Phân bố Độ tuổi">
                        {/* Placeholder/Actual Chart Component */}
                         <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
                            
                             <p>(Biểu đồ cột Phân bố Độ tuổi)</p>
                        </div>
                         {/* <Column data={ageData} xField='ageGroup' yField='count' height={300} /> */}
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default BaoCaoPage;