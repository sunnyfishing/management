import React from 'react';
import { Route, Routes } from "react-router-dom"

import Login from '../pages/login/Login'
import Index from '../pages/aaa'

export default class AppRouter extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return <Routes>
        <Route path='/aaa' element={<Index />} />
        <Route path='/login' element={<Login />} />
      </Routes>
  }
}
