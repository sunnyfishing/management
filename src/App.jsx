import React, { useEffect, useState } from 'react';
import { Layout, Menu } from 'antd';
import BreadcrumbAntd from './components/BreadcrumbAntd';
import { useNavigate } from "react-router-dom";
import { AppRouter, LoginRouter } from './routers/router'
import { menus } from './utils/menu'
import './App.css'

const { Header, Content, Sider } = Layout;

const App = () => {
  let a = location.hash?.split('#')[1]
  let openKeys = [a.split('/')[1]]
  let selectedKeys = [a.split('/')[2]]

  const [keyPath, setKeyPath] = useState(a.split('/').slice(1))
  const [isLogin, setIsLogin] = useState(true)

  const navigate = useNavigate();
  const onMenuClick = ({  keyPath }) => {
    setKeyPath(keyPath)
    navigate(`/${keyPath.reverse().join('/')}`);
  }

  return (
    <div>
      {
        isLogin ? <Layout>
          <Header className="header">
            <img className="logo" />
            <div>123</div>
          </Header>
          <Layout>
            <Sider width={200} className="site-layout-background">
              <Menu
                mode="inline"
                defaultOpenKeys={openKeys}
                defaultSelectedKeys={selectedKeys}
                style={{ height: '100%', borderRight: 0 }}
                items={menus}
                theme="dark"
                onClick={(itemObj) => { onMenuClick(itemObj) }}
              />
            </Sider>
            <Layout>
              <BreadcrumbAntd keyPath={keyPath} />
              <AppRouter />
            </Layout>
          </Layout>
        </Layout>
        : <LoginRouter />
      }
    </div>

  )
};
export default App