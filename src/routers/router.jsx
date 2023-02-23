import React from 'react';
import { Route, Routes } from "react-router-dom"

import Login from '../pages/login/Login'
import MenuManager from '../pages/menuManager'
import RoleManager from '../pages/roleManager'
import UserManager from '../pages/userManager'
import AddUser from '../pages/userManager/AddUser'
import MessageList from '../pages/messageList'
import ReportManager from '../pages/reportManager/reportManager';

export class AppRouter extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return <Routes>
        <Route path='/users/userManager' element={<UserManager />} />
        <Route path='/users/userManager/add' element={<AddUser />} />
        <Route path='/users/userManager/edit/:id' element={<AddUser />} />
        <Route path='/users/userManager/check/:id' element={<AddUser />} />
        <Route path='/users/menuManager' element={<MenuManager />} />
        <Route path='/users/roleManager' element={<RoleManager />} />
        <Route path='/users/messageList' element={<MessageList />} />
        <Route path='/datas/reportManager' element={<ReportManager/>}></Route>
      </Routes>
  }
}
export class LoginRouter extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return <Routes>
        <Route path='/'  element={<Login />} />
        <Route path='/login' element={<Login />} />
      </Routes>
  }
}