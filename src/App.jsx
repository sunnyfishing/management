import React from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import BreadcrumbAntd from './components/BreadcrumbAntd';
import { useNavigate } from "react-router-dom";
import AppRouter from './routers/router'
import './App.css'

const { Header, Content, Sider } = Layout;

const items2 = [1].map(item => {
  return {
    key: '0',
    icon: React.createElement(UserOutlined),
    label: '用户体系',
    children: [
      {
        key: 'aaa',
        label: `用户管理`,
      },
      {
        key: 'login',
        label: `角色管理`,
      },
      {
        key: '0-2',
        label: `菜单管理`,
      }
    ]
  }
})
export { items2 }

const App = () => {
  const navigate = useNavigate();
  const onMenuClick = ({ item, key, keyPath, domEvent }) => {
    console.log('item, key, keyPath, domEvent', item, key, keyPath, domEvent)
    navigate(key);
  }
  return (
    
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
              onClick={(itemObj) => { onMenuClick(itemObj) }}
            />
          </Sider>
          <Layout style={{ padding: '0 24px 24px' }}>
            <BreadcrumbAntd/>
            <AppRouter />
          </Layout>
        </Layout>
      </Layout>
  )
};
export default App