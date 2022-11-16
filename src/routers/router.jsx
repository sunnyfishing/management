import React from 'react';
import { Route, Routes } from "react-router-dom"

import Login from '../pages/login/Login'
import MenuManager from '../pages/menuManager'
import RoleManager from '../pages/roleManager'
import UserManager from '../pages/userManager'

export class AppRouter extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return <Routes>
        <Route path='/users/userManager' element={<UserManager />} />
        <Route path='/users/menuManager' element={<MenuManager />} />
        <Route path='/users/roleManager' element={<RoleManager />} />
      </Routes>
  }
}
export class LoginRouter extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return <Routes>
        <Route path='/login' element={<Login />} />
      </Routes>
  }
}