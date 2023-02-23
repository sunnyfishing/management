import React, { useEffect, useState } from 'react';
import { Layout, Menu,Popover } from 'antd';
import BreadcrumbAntd from './components/breadcrumbAntd/BreadcrumbAntd';
import CompanyMark from './components/companyMark/CompanyMark';
import {LOGIN} from './api/api';
import { useNavigate } from "react-router-dom";
import { AppRouter, LoginRouter } from './routers/router'
import { menus } from './utils/menu'
import './App.scss'
import { postForm } from './utils/axios';
import logo from './styles/images/login/logo.png'

const { Header, Content, Sider } = Layout;

const App = () => {
  let hash = location.hash

  const [menusItems, setMenusItems] = useState([])
  const [openKeys, setOpenKeys] = useState([])
  const [selectedKeys, setSelectedKeys] = useState([])
  const [isShowLogout, setIsShowLogout] = useState(false)
  const [isShowApp, setIsShowApp] = useState(false)

  const navigate = useNavigate();
  const onMenuClick = ({ keyPath }) => {
    sessionStorage.removeItem('current')
    navigate(`/${keyPath.reverse().join('/')}`);
  }

  const handleMenu = (list) => {
    return list.map(item => {
      if (item.children && item.children.length > 0) {
        let children = handleMenu(item.children)  // 获取处理children之后的值
        children = Array.from(new Set(children)) // 去重，用来去除多个null
        let index = children.findIndex((item) => item === null)  // 找到为null的元素的下标
        if (index > -1) {
          children.splice(index, 1)  //删除为null的元素
        }
        let obj = { ...item, children: children }
        if (obj.children && obj.children.length === 0) {
          delete obj.children
        }
        return obj
      } else if (item.children && item.children.length === 0) {
        delete item.children
        return item
      } else {
        if (item.isShowInMenu === false) {
          return null
        }
        return item
      }
    })
  }

  const setTip = (e,type)=>{
    e.preventDefault()
    console.log('type',type)
    setIsShowLogout(!!type)
  }

  const toLogout = ()=>{
    postForm(LOGIN.logout).then(res=>{
      if(res.state === 200) {
        sessionStorage.removeItem('current')
        navigate('/login')
      }
    })
  }

  useEffect(() => {
    setOpenKeys(hash?.split('/')[1])
    setSelectedKeys(hash?.split('/')[2])
  }, [hash])

  useEffect(() => {
    let menusItems = handleMenu(menus)
    setMenusItems(menusItems)
  }, [menus])
  // onMouseOut={setTip(0)}
  // onMouseOver={setTip(1)}

  useEffect(()=>{
    console.log('111',sessionStorage.getItem('platform-token'))
    if(sessionStorage.getItem('platform-token')){
      setIsShowApp(true)
    }
  },[sessionStorage.getItem('platform-token')])
  return (
    <div>
      {
        // isLogin ? 
        isShowApp&&
        <Layout>
          <Header className="header">
            <img className="logo" src={logo}/>
            <div className='user-info' onMouseEnter={(e)=>setTip(e,1)}  onMouseLeave={(e)=>setTip(e,0)}>
              <Popover content={<div  className='logout' onClick={toLogout}>退出登录</div>} >
                admin
              </Popover>

            </div>
          </Header>
          <Layout>
            <Sider width={200} className="site-layout-background">
              <Menu
                mode="inline"
                defaultOpenKeys={['users','userManager']}
                selectedKeys={selectedKeys}
                style={{ height: '100%', borderRight: 0 }}
                items={menusItems}
                theme="dark"
                onClick={(itemObj) => { onMenuClick(itemObj) }}
              />
            </Sider>
            <Layout>
              <BreadcrumbAntd />
              <div className='business-cont'>
                <AppRouter />
                <CompanyMark />
              </div>
              <div>
              </div>
            </Layout>
          </Layout>
        </Layout>
          // : <LoginRouter />
      }
    </div>

  )
};
export default App