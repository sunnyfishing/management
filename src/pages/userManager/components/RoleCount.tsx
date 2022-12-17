import React, { useEffect, useState } from 'react'
import {postForm} from '../../../utils/axios'
import {USER} from '../../../api/api'

interface RoleList{
  count:number,
  label:string
}

export default function RoleCount() {
  const [roleList, setRoleList] = useState<RoleList[]>([])

  const getData = ()=>{
    postForm(USER.userRoleAnalysis).then(res=>{
      const {total,newTodayTotal,userRoleDetail} = res?.results
      let roleList:RoleList[] = [
        {count:total,label:'用户总量'},
        {count:userRoleDetail['普通用户'],label:'普通用户'},
        {count:newTodayTotal,label:'今日新增'},
      ]
      setRoleList(roleList)
    })
  }

  useEffect(()=>{
    getData()
  },[])
  return (
    <div className='role-count-cont'>
      {roleList.map(item =>{
        return <div className='role-item' key={item.label}>
          <div>{item.count}</div>
          <div>{item.label}</div>
        </div>
      })}
    </div>
  )
}
