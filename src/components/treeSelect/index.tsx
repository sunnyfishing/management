import React, { useEffect, useState } from 'react'
import {  message, Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import { MENU } from '../../api/api'
import { get, postForm } from '../../utils/axios';

interface Props{
  activityKey:string,
  disabled:boolean,
  sendCheckedKeys:any,
  choosedKeys:any,
  menuOption:any
}

export default function TreeSelect(props:Props) {
  const {activityKey,disabled,sendCheckedKeys,choosedKeys,menuOption} = props
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>(choosedKeys);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [treeData, setTreeData] = useState([])
  // const [menuOption, setMenuOption] = useState([])

  

  const onExpand = (expandedKeysValue: React.Key[]) => {
    console.log('onExpand', expandedKeysValue);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onCheck = (checkedKeysValue: React.Key[],e: any) => {
    let parentMenuIds = e.checkedNodes.map((item:any)=>item.parentMenuId)
    let checkedKeys = Array.from(new Set(checkedKeysValue.concat(parentMenuIds)))
    checkedKeys.forEach((item:any,index:number)=>{
      if(item ===  ''){
        checkedKeys.splice(index,1)
      }
    })
    setCheckedKeys(checkedKeysValue);
    sendCheckedKeys(checkedKeys)
  };
  const onSelect = (checkedKeysValue: React.Key[],e: any) => {
    console.log('onCheck2', checkedKeysValue);
    console.log('e2', e);
    let parentMenuId = e.checkedNodes[0]?.parentMenuId
    console.log('parentMenuId',parentMenuId)
    setCheckedKeys(checkedKeysValue);
    sendCheckedKeys(checkedKeysValue)
  };



  useEffect(()=>{
    setCheckedKeys(choosedKeys)
  },[choosedKeys])

  // useEffect(() => {
  //   getMenuList()
  // }, [])
  return (
    <Tree
      selectable={false}
      checkable
      onExpand={onExpand}
      expandedKeys={expandedKeys}
      autoExpandParent={autoExpandParent}
      onCheck={onCheck}
      // onSelect={onSelect}
      checkedKeys={checkedKeys}
      treeData={menuOption}
      disabled={disabled}
      fieldNames={{title: 'menuName', key: 'menuId', children: 'children'}}
      // checkedKeys={}
    />
  )
}
