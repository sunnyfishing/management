import React from 'react';
import { UserOutlined } from '@ant-design/icons';

const menus = [
  {
    key: 'users',
    icon: React.createElement(UserOutlined),
    label: '用户体系',
    children: [
      {
        key: 'userManager',
        label: `用户管理`,

        children:[
          {key:'add',label:'新增',isShowInMenu:false},
          {key:'edit',label:'编辑',isShowInMenu:false},
          {key:'check',label:'查看',isShowInMenu:false},
        ]
      },
      {
        key: 'roleManager',
        label: `角色管理`,
        children:[]
      },
      {
        key: 'menuManager',
        label: `菜单管理`,
        children:[]
      },
      {
        key: 'messageList',
        label: `短信列表`,
        children:[]
      }
    ]
  }
]

export { menus }