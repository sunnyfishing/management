import React, { useEffect, useState } from 'react'
import {  message, Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import { MENU } from '../../api/api'
import { get, postForm } from '../../utils/axios';

interface Props{
  activityKey:string,
  disabled:boolean,
  sendCheckedKeys:any,
  choosedKeys:any
}

export default function TreeSelect(props:Props) {
  const {activityKey,disabled,sendCheckedKeys,choosedKeys} = props
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>(choosedKeys);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [treeData, setTreeData] = useState([])
  const [menuOption, setMenuOption] = useState([])

  

  const onExpand = (expandedKeysValue: React.Key[]) => {
    console.log('onExpand', expandedKeysValue);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onCheck = (checkedKeysValue: React.Key[],e: any) => {
    console.log('onCheck', checkedKeysValue);
    console.log('e', e);
    setCheckedKeys(checkedKeysValue);
    sendCheckedKeys(checkedKeysValue)
  };
  const onSelect = (checkedKeysValue: React.Key[],e: any) => {
    console.log('onCheck', checkedKeysValue);
    console.log('e', e);
    setCheckedKeys(checkedKeysValue);
    sendCheckedKeys(checkedKeysValue)
  };

  const getMenuList = () => {
    postForm(MENU.getUserMenuTree).then(res => {
      if (res.state !== 200) {
        message.error(res.msg)
        return
      }
      const { results } = res
      setMenuOption(results)
    })
  }

  useEffect(()=>{
    setCheckedKeys(choosedKeys)
  },[choosedKeys])

  useEffect(() => {
    getMenuList()
  }, [])
  return (
    <Tree
      selectable={false}
      checkable
      onExpand={onExpand}
      expandedKeys={expandedKeys}
      autoExpandParent={autoExpandParent}
      onCheck={onCheck}
      onSelect={onSelect}
      checkedKeys={checkedKeys}
      treeData={menuOption}
      disabled={disabled}
      fieldNames={{title: 'menuName', key: 'menuId', children: 'children'}}
      // checkedKeys={}
    />
  )
}
