import React, { MouseEventHandler, useEffect, useState } from 'react'
import { Select, Input, Table, Pagination,Popconfirm,message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from "react-router-dom";
import type { PaginationProps } from 'antd';
import EditModal from './components/EditModal'
import { ROLE } from '../../api/api'
import { get,post, postForm } from '../../utils/axios';
import './index.scss'

interface RoleList {
  value: string,
  label: string,
}
interface DataType {
  roleId: DataType;
  createTime: any;
  updateTime: any;
  key: React.Key,
  roleName: string,
  bbb: number,
  ccc: number,
  deleted?:any
}
interface Params {
  current: number,
  pageSize: number,
}

export default function RoleManager() {
  const [searchParams, setSearchParams] = useState({})
  const [roleList, setRoleList] = useState([])
  const [data, setData] = useState([])
  const [total, setTotal] = useState(10)
  const [pageSize, setPageSize] = useState(10)
  const [current, setCurrent] = useState(1)
  const [isShowModal, setIsShowModal] = useState(false)
  const [modalType, setModalType] = useState('')
  const [roleId, setId] = useState('')

 
  const columns: ColumnsType<DataType> = [
    {
      title: '用户名',
      dataIndex: 'roleName',
      key: 'roleName',
      render:(value)=>(<>
        <div className='describe'>{value}</div>
      </>)
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      render:(value)=>(<>
        <div className='describe' title={value}>{value}</div>
      </>)
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      sorter: (a, b) => new Date(a.createTime).getTime() - new Date(b.createTime).getTime(),
      ellipsis: true,
    },
    {
      title: '修改时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      sorter: (a, b) => new Date(a.updateTime).getTime() - new Date(b.updateTime).getTime(),
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'roleId',
      dataIndex: 'roleId',
      fixed: 'right',
      width: 160,
      render: (value,record) => <>
        <a className='mr14' onClick={()=>gotoNew('check',value)}>查看</a>
        <a className='mr14' onClick={()=>gotoNew('edit',value)}>编辑</a>
        {!record.deleted ?
          <Popconfirm
            title='确定要删吗？确定吗？'
            onConfirm={() => deleteData(value)}
            okText="是"
            cancelText="否"
          >
            <a className='delete'>删除</a>
          </Popconfirm>
          : <span title="停用后可删除" className='disabled-delete'>删除</span>}
      </>,
    },
  ];

  const gotoNew = (type:string,roleId?:string) => {
    setId(roleId)
    setModalType(type)
    setIsShowModal(true)
  }

  const deleteData = (value: string) => {
    console.log('value', value)
    const params={
      roleId:value
    }
    postForm(ROLE.del,params).then(res => {
      if (res.state === 200) {
        message.success('删除成功')
        getData()
      }
    })
  }

  const onChange: PaginationProps['onChange'] = pageNumber => {
    setCurrent(pageNumber)
  };

  const onShowSizeChange: PaginationProps['onShowSizeChange'] = (current, size) => {
    setPageSize(size)
    setCurrent(current)
  };

  const onPressEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    var element = e.target as HTMLInputElement
    let value = element.value && element.value.replace(' ', '');
    setSearchParams({ ...searchParams, search: value.trim() })
  }

  const getData = () => {
    const params: Params = {
      current,
      pageSize,
      ...searchParams

    }
    get(ROLE.list, params).then(res => {
      const { list,pagination } = res?.results
      const {current,pageSize,total} = pagination
      setPageSize(pageSize)
      setCurrent(current)
      setTotal(total)
      setData(list)
    })
  }

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
    if(e.target.value === ''){
      setSearchParams({ ...searchParams, search:''})
    }
  }

  useEffect(()=>{
    getData()
  },[current,pageSize,searchParams])
  return (
    <div className='role-manager'>
      <div className='role-cont'>
        <div className='search-btn'>
          <div className='btn'>
            <div className='btn-new mr50' onClick={()=>gotoNew('add')}>+ 新建</div>
            <div className='search'>
              <div>角色：</div><Input size="small" placeholder="按回车搜索" onPressEnter={onPressEnter} onChange={(e)=>{onSearchChange(e)}} allowClear={true}/>
            </div>

          </div>
        </div>
        <div className='cont-table mt20'>
          <Table columns={columns} dataSource={data} scroll={{ x: 1300 }} pagination={false} rowKey='roleId'/>
          <div className='cont-pagination mt20'>
            <Pagination showQuickJumper pageSize={pageSize} total={total} onChange={onChange} showSizeChanger={true}  onShowSizeChange={onShowSizeChange} />
          </div>
        </div>
      </div>
      {isShowModal && <EditModal modalType={modalType} roleId={roleId} setIsShowModal={setIsShowModal} getData={getData}/>}
    </div>
  )
}
