import React, { useEffect, useState } from 'react'
import {Input} from 'antd'
import { get } from '../../utils/axios';
import loginData from '../../styles/images/login/login_data.png';
import './Login.scss'

export default function Login() {
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>, type:string) => {
    let value = e.target.value && e.target.value.replace(' ','');
    if(type === 'userName'){
      setUserName(value)
    }else if(type === 'password'){
      setPassword(value)
    }
  }
  const handleLoginClick = () => {
    const params={
      username,
      password,
    }
    console.log('params',params)
  }
  return (
    <div className="login-main">
      <div className='login-cont'>
        <img src={loginData} className="login-data" />
        <div className='cont-right'>
          <div className='login-main-right-title'>系统账户登录</div>
          <div className="login-main-right-block">
            <div className="login-main-right-label">账户名称</div>
            <Input value={username} placeholder="请输入账户名称" onChange={(e) => handleFormChange(e,'userName')} className='username-input mt15 mb18' />
            <div className="login-main-right-label">输入密码</div>
            <div className="login-main-right-ps ">
              <Input.Password value={password} placeholder="请输入密码" visibilityToggle={false} onChange={(e) => handleFormChange(e,'password')} className='username-password mt15' />
            </div>
          </div>
          <div className="login-main-right-submit" onClick={handleLoginClick}>登录</div>
        </div>
      </div>
    </div>
  )
}
