import React, { useState, useEffect } from 'react';
import {
  MenuFoldOutlined, MenuUnfoldOutlined, DesktopOutlined, MoonOutlined, SunOutlined,
  SettingOutlined, DashboardOutlined, ContactsOutlined, UserAddOutlined, LogoutOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme, ConfigProvider, Dropdown, Avatar } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../utils/auth';
import { useTheme } from '../contexts/ThemeContext';

const { Sider, Content } = Layout;

const AppLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(window.innerWidth < 768);
  const { themeMode, setTheme, isDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  const isMobile = window.innerWidth < 768;
  
  useEffect(() => {
    const handleResize = () => setCollapsed(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const themeColors = {
    navBg: isDarkMode ? '#1a1f2e' : '#ffffff',
    contentBg: isDarkMode ? '#0f1419' : '#fafafa',
    cardBg: isDarkMode ? '#1a1f2e' : '#ffffff',
    textPrimary: isDarkMode ? '#ffffff' : '#000000',
    textSecondary: isDarkMode ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.45)',
    border: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)',
  };

  const menuItems = [
    { 
      key: '/', 
      icon: <DashboardOutlined />, 
      label: 'Dashboard',
      onClick: () => navigate('/')
    },
    { 
      key: '/customers', 
      icon: <ContactsOutlined />, 
      label: 'Customers',
      onClick: () => navigate('/customers')
    },
    { 
      key: '/customers/add', 
      icon: <UserAddOutlined />, 
      label: 'Add Customer',
      onClick: () => navigate('/customers/add')
    },
  ];

  const dropdownItems = [
    {
      key: 'theme', label: 'Theme', type: 'group',
      children: [
        { key: 'system', icon: <DesktopOutlined />, label: 'System', onClick: () => setTheme('system') },
        { key: 'light', icon: <SunOutlined />, label: 'Light', onClick: () => setTheme('light') },
        { key: 'dark', icon: <MoonOutlined />, label: 'Dark', onClick: () => setTheme('dark') },
      ]
    },
    { type: 'divider' },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Logout', onClick: logout }
  ];

  const getSelectedKey = () => {
    const path = location.pathname;
    if (path === '/') return '/';
    if (path.startsWith('/customers/add')) return '/customers/add';
    if (path.startsWith('/customers')) return '/customers';
    return path;
  };
  
  return (
    <>
      <style>{`
        .ant-menu-item { border-radius: 6px; font-size: 15px !important; font-weight: 500 !important; }
        .ant-menu-dark .ant-menu-item-selected { background-color: rgba(255, 255, 255, 0.1) !important; color: #ffffff !important; }
        .ant-menu-light .ant-menu-item-selected { background-color: #e6f4ff !important; color: #1677ff !important; }
      `}</style>
      
      <ConfigProvider theme={{ 
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        components: { Menu: { itemMarginInline: 8, itemMarginBlock: 4 } }
      }}>
        <Layout style={{ minHeight: '100vh' }}>
          {!collapsed && isMobile && (
            <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1000 }}
                 onClick={() => setCollapsed(true)} />
          )}
          
          <Sider
            trigger={null} collapsible collapsed={collapsed}
            theme={isDarkMode ? 'dark' : 'light'} width={280}
            collapsedWidth={isMobile ? 0 : 80}
            style={{
              position: isMobile ? 'fixed' : 'relative', height: '100vh', zIndex: 1001,
              background: themeColors.navBg,
              boxShadow: isDarkMode ? '2px 0 8px rgba(0, 0, 0, 0.3)' : '2px 0 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div style={{ 
              padding: collapsed ? '16px 8px' : '16px 8px 16px 24px', 
              display: 'flex', alignItems: 'center', 
              justifyContent: collapsed ? 'center' : 'space-between', gap: '8px' 
            }}>
              {!collapsed && (
                <div style={{ fontSize: '18px', fontWeight: 600, color: themeColors.textPrimary, flex: 1 }}>
                  ProCRM
                </div>
              )}
              <Button type="text" size="small"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{ color: themeColors.textSecondary }} />
            </div>
            
            <Menu theme={isDarkMode ? 'dark' : 'light'} mode="inline" 
                  selectedKeys={[getSelectedKey()]}
                  style={{ background: 'transparent', borderRight: 0 }} 
                  items={menuItems} />
            
            {!(isMobile && collapsed) && (
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                borderTop: `1px solid ${themeColors.border}`,
                padding: collapsed ? '12px 8px' : '12px 16px',
                display: 'flex', alignItems: 'center', 
                justifyContent: collapsed ? 'center' : 'space-between', gap: '12px'
              }}>
                {!collapsed && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                    <Avatar size={32} style={{ backgroundColor: '#1677ff' }}>U</Avatar>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <div style={{ fontSize: '14px', fontWeight: 500, color: themeColors.textPrimary }}>User</div>
                      <div style={{ fontSize: '12px', color: themeColors.textSecondary }}>user@example.com</div>
                    </div>
                  </div>
                )}
                <Dropdown menu={{ items: dropdownItems, selectedKeys: [themeMode] }}
                          placement="topRight" trigger={['click']} arrow>
                  <Button type="text" icon={<SettingOutlined />} style={{ color: themeColors.textSecondary }} />
                </Dropdown>
              </div>
            )}
          </Sider>
          
          <Layout>
            {isMobile && (
              <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, height: '56px', zIndex: 999,
                background: themeColors.contentBg, borderBottom: `1px solid ${themeColors.border}`,
                display: 'flex', alignItems: 'center', padding: '0 16px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              }}>
                <Button type="text" icon={<MenuUnfoldOutlined />} onClick={() => setCollapsed(!collapsed)}
                        style={{ color: themeColors.textPrimary, fontSize: '18px' }} />
                <div style={{ fontSize: '18px', fontWeight: 600, color: themeColors.textPrimary, marginLeft: '12px' }}>
                  ProCRM
                </div>
              </div>
            )}
            
            <Content style={{ padding: isMobile ? '72px 24px 24px' : '24px', background: themeColors.contentBg }}>
              {children}
            </Content>
          </Layout>
        </Layout>
      </ConfigProvider>
    </>
  );
};

export default AppLayout;