"use client"
import React, { useState, useEffect } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CalendarOutlined,
  HomeOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import { useRouter, usePathname } from 'next/navigation'; 
const { Header, Sider, Content } = Layout;

const SiderAdmin = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeKey, setActiveKey] = useState('1');
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const router = useRouter(); // Khởi tạo router
  const pathname = usePathname(); // Thêm hook này
  const handleNavigate = (path: string, key: string) => {
    setActiveKey(key);
    router.push(path); // Chuyển đến đường dẫn được chỉ định
};

  useEffect(() => {
    if (pathname === '/') {
      setActiveKey('1');
    } else if (pathname === '/users') {
      setActiveKey('2');
    } else if (pathname === '/task') {
      setActiveKey('3');
    } else if (pathname === '/taskDaily') {
      setActiveKey('4');
    }
  }, [pathname]); // Sử dụng pathname thay vì router.pathname

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[activeKey]}
          items={[
            {
              key: '1',
              icon: <HomeOutlined />,
              label: <div onClick={() => handleNavigate('/', '1')}>Home Page</div>,
            },
            {
              key: '2',
              icon: <UserSwitchOutlined />,
              label:<div onClick={() => handleNavigate('/users', '2')}> Manage Users</div>,
            },
            {
              key: '3',
              icon: <CalendarOutlined />,
              label: <div onClick={() => handleNavigate('/task', '3')}> Manage Task</div>,
            },
            {
              key: '4',
              icon: <CalendarOutlined />,
              label: <div onClick={() => handleNavigate('/taskDaily', '4')}> Manage Task Daily</div>,
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: '10px 10px',
            padding: 10,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default SiderAdmin;