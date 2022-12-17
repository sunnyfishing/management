import React from 'react';
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu } from 'antd';
import BreadcrumbAntd from './components/breadcrumbAntd/BreadcrumbAntd';
import './App.css'

const { Header, Content, Sider } = Layout;

const items2: MenuProps['items'] = [1].map(item =>{
  return {
    key: '0',
    icon: React.createElement(UserOutlined),
    label: '用户体系',
    children:[
      {
        key: '0-0',
        label: `用户管理`,
      },
      {
        key: '0-1',
        label: `角色管理`,
      },
      {
        key: '0-2',
        label: `菜单管理`,
      }
    ]
  }
})
export {items2}

const App: React.FC = () => (
  <Layout>
    <Header className="header">
      <img className="logo" />
      <div>123</div>
    </Header>
    <Layout>
      <Sider width={200} className="site-layout-background">
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          style={{ height: '100%', borderRight: 0 }}
          items={items2}
          theme="dark"
        />
      </Sider>
      <Layout style={{ padding: '0 24px 24px' }}>
        <BreadcrumbAntd/>
        <Content
          className="site-layout-background"
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
          }}
        >
          Content
        </Content>
      </Layout>
    </Layout>
  </Layout>
);

export default App;