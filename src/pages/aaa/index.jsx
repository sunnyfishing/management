import React from 'react'
import { inject, observer } from 'mobx-react';

const Index = inject('appStore')(observer((props)=>{
  const {isLogin} = props.appStore
  console.log('aaaaa',isLogin)
  return <div>index</div>
}))

export default Index
