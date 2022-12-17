import React, { useEffect, useState } from 'react';
import { Layout, Menu } from 'antd';
import BreadcrumbAntd from './components/breadcrumbAntd/BreadcrumbAntd';
import CompanyMark from './components/companyMark/CompanyMark';
import { Navigate } from "react-router-dom";
import { AppRouter } from './routers/router'
import { menus } from './utils/menu'
import './App.scss'

const { Header, Content, Sider } = Layout;

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      menusItems: [],
      openKeys: [],
      selectedKeys: [],
      isShowLogout: false
    }
    this.hash = location.hash
  }

  onMenuClick({keyPath}) {
    console.log('this.props',this.props)
    Navigate(`/${keyPath.reverse().join('/')}`)
    // this.props.navigate(`/${keyPath.reverse().join('/')}`)
  }

  handleMenu(list) {
    return list.map(item => {
      if (item.children && item.children.length > 0) {
        let children = this.handleMenu(item.children)  // 获取处理children之后的值
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

  setTip(e, type) {
    e.preventDefault()
    console.log('type', type)
    // setIsShowLogout(!!type)
    this.setState({
      isShowLogout: !!type
    })
  }
  toLogout() {

  }

  componentDidMount() {
    let menusItems = this.handleMenu(menus)
    // setMenusItems(menusItems)
    this.setState({
      openKeys: this.hash?.split('/')[1],
      selectedKeys: this.hash?.split('/')[2],
      menusItems
    })
  }

  shouldComponentUpdate() {
    if (sessionStorage.getItem('platform-token')) {
      return true
    }
    return false
  }


  render() {
    const { 
      menusItems,
      openKeys,
      selectedKeys,
      isShowLogout } = this.state
    if (!sessionStorage.getItem('platform-token')) {
      return <></>
    }
    return <div>
      {
        <Layout>
          <Header className="header">
            <img className="logo" />
            <div className='user-info' onMouseEnter={(e) => this.setTip(e, 1)} onMouseLeave={(e) => this.setTip(e, 0)}>
              admin
              {isShowLogout && <div className='logout' onClick={() => this.toLogout()}>
                退出登录
              </div>}

            </div>
          </Header>
          <Layout>
            <Sider width={200} className="site-layout-background">
              <Menu
                mode="inline"
                openKeys={openKeys}
                selectedKeys={selectedKeys}
                style={{ height: '100%', borderRight: 0 }}
                items={menusItems}
                theme="dark"
                onClick={(itemObj) => { this.onMenuClick(itemObj) }}
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
      }
    </div>
  }
}
export default App