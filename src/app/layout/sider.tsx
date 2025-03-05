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
  const [isMobile, setIsMobile] = useState(false); // Thêm state kiểm tra mobile

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const router = useRouter();
  const pathname = usePathname();

  // Kiểm tra kích thước màn hình để tự động thu nhỏ Sider khi ở chế độ mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Nếu nhỏ hơn 768px => Mobile
    };

    handleResize(); // Gọi lần đầu để kiểm tra trạng thái ban đầu
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) setCollapsed(true); // Nếu là mobile thì tự động thu sidebar
  }, [isMobile]);

  const menuItems = [
    { key: '/', icon: <HomeOutlined />, label: 'Home Page' },
    { key: '/users', icon: <UserSwitchOutlined />, label: 'Manage Users' },
    { key: '/task', icon: <CalendarOutlined />, label: 'Manage Task' }
  ];

  return (
    <Layout>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed} 
        collapsedWidth={isMobile ? 0 : 80} // Ẩn hoàn toàn khi là mobile
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]} 
          onClick={({ key }) => router.push(key)}
          items={menuItems.map(({ key, icon, label }) => ({
            key,
            icon,
            label,
          }))}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            aria-label="Toggle sidebar"
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: '10px',
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
