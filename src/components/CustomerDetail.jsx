import React, { useState, useEffect } from 'react';
import { 
  Form, Input, Select, Button, Card, Typography, Row, Col, 
  message, DatePicker, Space, Avatar, Descriptions, Divider 
} from 'antd';
import { 
  ArrowLeftOutlined, SaveOutlined, UserOutlined, EditOutlined,
  PhoneOutlined, MailOutlined, TeamOutlined, IdcardOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { Customer } from '../entities/Customer';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const CustomerDetail = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loadingCustomer, setLoadingCustomer] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      loadCustomer();
    }
  }, [id]);

  useEffect(() => {
    if (customer) {
      document.title = `${customer.firstName} ${customer.lastName} - ProCRM`;
    }
  }, [customer]);

  const loadCustomer = async () => {
    setLoadingCustomer(true);
    try {
      const response = await Customer.get(id);
      if (response.success) {
        const customerData = response.data;
        setCustomer(customerData);
        
        form.setFieldsValue({
          ...customerData,
          lastContact: customerData.lastContact ? dayjs(customerData.lastContact) : null
        });
      } else {
        message.error('Customer not found');
        navigate('/customers');
      }
    } catch (error) {
      message.error('Error loading customer');
      navigate('/customers');
      console.error('Error loading customer:', error);
    } finally {
      setLoadingCustomer(false);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const customerData = {
        ...values,
        lastContact: values.lastContact ? values.lastContact.format('YYYY-MM-DD') : null
      };
      
      const response = await Customer.update(id, customerData);
      if (response.success) {
        message.success('Customer updated successfully!');
        setCustomer({ ...customer, ...customerData });
        setEditing(false);
      } else {
        message.error('Failed to update customer');
      }
    } catch (error) {
      message.error('Error updating customer');
      console.error('Error updating customer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/customers');
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancelEdit = () => {
    setEditing(false);
    form.setFieldsValue({
      ...customer,
      lastContact: customer.lastContact ? dayjs(customer.lastContact) : null
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      Lead: '#faad14',
      Prospect: '#1890ff',
      Active: '#52c41a',
      Inactive: '#f5222d'
    };
    return colors[status] || '#d9d9d9';
  };

  if (loadingCustomer) {
    return (
      <Card loading={true}>
        <div style={{ height: '400px' }} />
      </Card>
    );
  }

  if (!customer) {
    return null;
  }

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
        <Col>
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
              Back to Customers
            </Button>
            <Title level={2} style={{ margin: 0 }}>
              {customer.firstName} {customer.lastName}
            </Title>
          </Space>
        </Col>
        <Col>
          {!editing && (
            <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
              Edit Customer
            </Button>
          )}
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <Avatar size={80} icon={<UserOutlined />} style={{ marginBottom: '16px' }} />
              <Title level={3} style={{ margin: 0 }}>
                {customer.firstName} {customer.lastName}
              </Title>
              <div style={{ 
                color: getStatusColor(customer.status),
                fontWeight: 'bold',
                fontSize: '16px',
                marginTop: '8px'
              }}>
                {customer.status}
              </div>
            </div>
            
            <Divider />
            
            <Descriptions column={1} size="small">
              <Descriptions.Item label={<><MailOutlined /> Email</>}>
                {customer.email}
              </Descriptions.Item>
              {customer.phone && (
                <Descriptions.Item label={<><PhoneOutlined /> Phone</>}>
                  {customer.phone}
                </Descriptions.Item>
              )}
              {customer.company && (
                <Descriptions.Item label={<><TeamOutlined /> Company</>}>
                  {customer.company}
                </Descriptions.Item>
              )}
              {customer.jobTitle && (
                <Descriptions.Item label={<><IdcardOutlined /> Job Title</>}>
                  {customer.jobTitle}
                </Descriptions.Item>
              )}
              {customer.lastContact && (
                <Descriptions.Item label="Last Contact">
                  {new Date(customer.lastContact).toLocaleDateString()}
                </Descriptions.Item>
              )}
              {customer.createdAt && (
                <Descriptions.Item label="Customer Since">
                  {new Date(customer.createdAt).toLocaleDateString()}
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          <Card title={editing ? "Edit Customer" : "Customer Details"}>
            {editing ? (
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
              >
                <Row gutter={[16, 0]}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="First Name"
                      name="firstName"
                      rules={[
                        { required: true, message: 'Please input the first name!' },
                        { min: 2, message: 'First name must be at least 2 characters long!' }
                      ]}
                    >
                      <Input placeholder="Enter first name" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Last Name"
                      name="lastName"
                      rules={[
                        { required: true, message: 'Please input the last name!' },
                        { min: 2, message: 'Last name must be at least 2 characters long!' }
                      ]}
                    >
                      <Input placeholder="Enter last name" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={[16, 0]}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[
                        { required: true, message: 'Please input the email!' },
                        { type: 'email', message: 'Please enter a valid email!' }
                      ]}
                    >
                      <Input placeholder="Enter email address" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Phone"
                      name="phone"
                      rules={[
                        { pattern: /^[\+]?[1-9][\d]{0,15}$/, message: 'Please enter a valid phone number!' }
                      ]}
                    >
                      <Input placeholder="Enter phone number" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={[16, 0]}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Company"
                      name="company"
                    >
                      <Input placeholder="Enter company name" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Job Title"
                      name="jobTitle"
                    >
                      <Input placeholder="Enter job title" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={[16, 0]}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Status"
                      name="status"
                      rules={[{ required: true, message: 'Please select a status!' }]}
                    >
                      <Select placeholder="Select customer status">
                        <Option value="Lead">Lead</Option>
                        <Option value="Prospect">Prospect</Option>
                        <Option value="Active">Active</Option>
                        <Option value="Inactive">Inactive</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Last Contact"
                      name="lastContact"
                    >
                      <DatePicker 
                        style={{ width: '100%' }}
                        placeholder="Select last contact date"
                        disabledDate={(current) => current && current > dayjs().endOf('day')}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  label="Notes"
                  name="notes"
                >
                  <TextArea 
                    rows={4} 
                    placeholder="Enter any additional notes about this customer..."
                  />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0 }}>
                  <Space>
                    <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
                      Save Changes
                    </Button>
                    <Button onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            ) : (
              <div>
                {customer.notes && (
                  <div style={{ marginBottom: '16px' }}>
                    <Title level={4}>Notes</Title>
                    <div style={{ 
                      padding: '12px', 
                      backgroundColor: '#f5f5f5', 
                      borderRadius: '6px',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {customer.notes}
                    </div>
                  </div>
                )}
                
                <Title level={4}>Activity Timeline</Title>
                <div style={{ 
                  padding: '20px', 
                  backgroundColor: '#f9f9f9', 
                  borderRadius: '6px',
                  textAlign: 'center',
                  color: '#999'
                }}>
                  No activity recorded yet. Start adding interactions with this customer.
                </div>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CustomerDetail;