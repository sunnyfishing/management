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
      },
      {
        key: 'roleManager',
        label: `角色管理`,
      },
      {
        key: 'menuManager',
        label: `菜单管理`,
      }
    ]
  }
]

export { menus }