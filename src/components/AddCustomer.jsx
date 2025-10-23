import React, { useState, useEffect } from 'react';
import { 
  Form, Input, Select, Button, Card, Typography, Row, Col, 
  message, DatePicker, Space 
} from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Customer } from '../entities/Customer';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const AddCustomer = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Add Customer - ProCRM';
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const customerData = {
        ...values,
        lastContact: values.lastContact ? values.lastContact.format('YYYY-MM-DD') : null
      };
      
      const response = await Customer.create(customerData);
      if (response.success) {
        message.success('Customer added successfully!');
        navigate('/customers');
      } else {
        message.error('Failed to add customer');
      }
    } catch (error) {
      message.error('Error adding customer');
      console.error('Error adding customer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/customers');
  };

  return (
    <div>
      <Space style={{ marginBottom: '24px' }}>
        <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
          Back to Customers
        </Button>
        <Title level={2} style={{ margin: 0 }}>Add New Customer</Title>
      </Space>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            status: 'Lead'
          }}
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
                Save Customer
              </Button>
              <Button onClick={handleBack}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddCustomer;