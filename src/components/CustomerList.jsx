import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Card, Space, Input, Select, Tag, Typography, 
  Popconfirm, message, Row, Col, Avatar 
} from 'antd';
import { 
  UserOutlined, SearchOutlined, PlusOutlined, EditOutlined, 
  DeleteOutlined, PhoneOutlined, MailOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Customer } from '../entities/Customer';

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Customers - ProCRM';
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const response = await Customer.list();
      if (response.success) {
        setCustomers(response.data);
      }
    } catch (error) {
      message.error('Error loading customers');
      console.error('Error loading customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await Customer.delete(id);
      if (response.success) {
        message.success('Customer deleted successfully');
        loadCustomers();
      }
    } catch (error) {
      message.error('Error deleting customer');
      console.error('Error deleting customer:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Lead: 'orange',
      Prospect: 'blue',
      Active: 'green',
      Inactive: 'red'
    };
    return colors[status] || 'default';
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = !searchText || 
      `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(searchText.toLowerCase()) ||
      (customer.email && customer.email.toLowerCase().includes(searchText.toLowerCase())) ||
      (customer.company && customer.company.toLowerCase().includes(searchText.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      title: 'Name',
      key: 'name',
      render: (_, customer) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 500 }}>
              {customer.firstName} {customer.lastName}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {customer.jobTitle && customer.company ? 
                `${customer.jobTitle} at ${customer.company}` :
                customer.jobTitle || customer.company || 'No position'
              }
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Contact',
      key: 'contact',
      render: (_, customer) => (
        <div>
          <div style={{ marginBottom: '4px' }}>
            <MailOutlined style={{ marginRight: '8px', color: '#666' }} />
            {customer.email}
          </div>
          {customer.phone && (
            <div>
              <PhoneOutlined style={{ marginRight: '8px', color: '#666' }} />
              {customer.phone}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: 'Last Contact',
      dataIndex: 'lastContact',
      key: 'lastContact',
      render: (date) => date ? new Date(date).toLocaleDateString() : 'Never',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, customer) => (
        <Space>
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => navigate(`/customers/${customer._id}`)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete customer"
            description="Are you sure you want to delete this customer?"
            onConfirm={() => handleDelete(customer._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
        <Col>
          <Title level={2} style={{ margin: 0 }}>Customers</Title>
        </Col>
        <Col>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => navigate('/customers/add')}
          >
            Add Customer
          </Button>
        </Col>
      </Row>

      <Card>
        <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Search customers..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              style={{ width: '100%' }}
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="Filter by status"
            >
              <Option value="all">All Statuses</Option>
              <Option value="Lead">Lead</Option>
              <Option value="Prospect">Prospect</Option>
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
            </Select>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredCustomers}
          rowKey="_id"
          loading={loading}
          onRow={(record) => ({
            onClick: () => navigate(`/customers/${record._id}`),
            style: { cursor: 'pointer' }
          })}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} customers`,
          }}
          locale={{
            emptyText: (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <UserOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
                <p style={{ color: '#999' }}>No customers found</p>
                <Button type="primary" onClick={() => navigate('/customers/add')}>
                  Add Your First Customer
                </Button>
              </div>
            )
          }}
        />
      </Card>
    </div>
  );
};

export default CustomerList;