import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, List, Avatar, Button, Typography } from 'antd';
import { UserOutlined, TeamOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Customer } from '../entities/Customer';

const { Title } = Typography;

const Dashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    leads: 0,
    prospects: 0,
    active: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Dashboard - ProCRM';
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const response = await Customer.list();
      if (response.success) {
        const customerData = response.data;
        setCustomers(customerData.slice(0, 5));
        
        const statusCounts = customerData.reduce((acc, customer) => {
          const status = customer.status || 'Lead';
          acc[status.toLowerCase()] = (acc[status.toLowerCase()] || 0) + 1;
          return acc;
        }, {});
        
        setStats({
          total: customerData.length,
          leads: statusCounts.lead || 0,
          prospects: statusCounts.prospect || 0,
          active: statusCounts.active || 0
        });
      }
    } catch (error) {
      console.error('Error loading customers:', error);
    }
  };

  return (
    <div>
      <Title level={2} style={{ marginBottom: '24px' }}>Dashboard</Title>
      
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Total Customers"
              value={stats.total}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Leads"
              value={stats.leads}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Prospects"
              value={stats.prospects}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Active"
              value={stats.active}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card 
            title="Recent Customers" 
            extra={<Button type="link" onClick={() => navigate('/customers')}>View All</Button>}
          >
            {customers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <UserOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
                <p style={{ color: '#999' }}>No customers yet</p>
                <Button type="primary" onClick={() => navigate('/customers/add')}>
                  Add Your First Customer
                </Button>
              </div>
            ) : (
              <List
                itemLayout="horizontal"
                dataSource={customers}
                renderItem={(customer) => (
                  <List.Item
                    actions={[
                      <Button type="link" onClick={() => navigate(`/customers/${customer._id}`)}>
                        View
                      </Button>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar icon={<UserOutlined />} />}
                      title={`${customer.firstName} ${customer.lastName}`}
                      description={
                        <div>
                          <div>{customer.company || 'No company'}</div>
                          <div style={{ fontSize: '12px', color: '#999' }}>
                            Status: {customer.status}
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card title="Quick Actions">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Button 
                  type="primary" 
                  block 
                  size="large"
                  icon={<UserOutlined />}
                  onClick={() => navigate('/customers/add')}
                >
                  Add Customer
                </Button>
              </Col>
              <Col span={12}>
                <Button 
                  block 
                  size="large"
                  icon={<TeamOutlined />}
                  onClick={() => navigate('/customers')}
                >
                  View All
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;