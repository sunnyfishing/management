import React, { MouseEventHandler, useEffect, useState } from 'react'
import { Select, Input, Table, Pagination, Popconfirm, Tooltip, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from "react-router-dom";
import type { PaginationProps } from 'antd';
import RoleCount from './components/RoleCount'
import './index.scss'
import { get, postForm } from '../../utils/axios';
import { USER, ROLE } from '../../api/api';
import { inject, observer } from 'mobx-react';
import MyTag from '../../components/myTag';

interface RoleList {
  value: string,
  label: string,
}

interface DataType {
  [x: string]: any;
  validityStart: any;
  validityEnd: any;
  key: React.Key;
  name: string;
  bbb: number;
  ccc: string;
}



const UserManager: React.FC = inject('staticStore')(observer((props: any) => {
  const { staticStore } = props
  const { sourceList, getSourceItem } = staticStore
  const [roleList, setRoleList] = useState([])
  const [statusList, setStatusList] = useState([])
  const [searchParams, setSearchParams] = useState({})
  const [data, setData] = useState([])
  const [total, setTotal] = useState(10)
  const [pageSize, setPageSize] = useState(10)
  const [current, setCurrent] = useState(1)
  const navigate = useNavigate();

  const handleChange = (value: string, type: string) => {
    setSearchParams({ ...searchParams, [type]: value })
  }

  const columns: ColumnsType<DataType> = [
    {
      title: '用户名',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role', render: (value,record) => <>
        {record?.roleList.map((item: { roleName: any; }) =>item.roleName).join(',')}
      </>
    },
    { title: '来源', dataIndex: 'source', key: 'source', render: (v) => <>{getSourceItem(v)}</> },
    { title: '手机号', dataIndex: 'phone', key: 'phone' },
    { title: '邮箱', dataIndex: 'email', key: ' email' },
    {
      title: '状态', dataIndex: 'status', key: 'status', render: (value) => <>
        {!value ? <div className='status-cont'>
          <span className='point stop'></span><span className='stop-text'>停用</span>
        </div>
          : <div className='status-cont'>
            <span className='point start'></span><span className='open-text'>启用</span>
          </div>}

      </>
    },
    {
      title: '意向', dataIndex: 'intentionType', key: 'intentionType', render: (value, record) => <>
        {value === 'NONE' ? <span className='tend-no-tend'>暂无</span> : <Tooltip title={record.intentionDescription}>
          <span className='tend-tend'>有意向</span>
        </Tooltip>}

      </>
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
      key: 'userId',
      dataIndex: 'userId',
      fixed: 'right',
      width: 200,
      render: (value, record) => <>
        <a className='mr14' onClick={() => checkData(value)}>查看</a>
        <a className='mr14' onClick={() => gotoNew('edit', value)}>编辑</a>
        <Popconfirm
          title={`确认${!record.status ? '启用' : '停用'}该用户`}
          onConfirm={() => startStop(value, record.status)}
          okText="是"
          cancelText="否"
        >
          <a className='mr14' >{!record.status ? '启用' : '停用'}</a>
        </Popconfirm>

        {!record.status ?
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


  const checkData = (value: DataType) => {
    sessionStorage.setItem('current', `${current}`)
    navigate(`/users/userManager/check/${value}`)
  }
  const deleteData = (value: DataType) => {
    postForm(USER.del, { userId: value }).then(res => {
      if (res.state === 200) {
        message.success(`删除成功`)
        getData()
      }
    })
  }
  const startStop = (value: string, status: number) => {
    console.log('value', value)
    postForm(USER.operate, { userId: value }).then(res => {
      if (res.state === 200) {
        message.success(`${status ? '停用' : '启用'}成功`)
        getData()
      }
    })
  }

  const onPressEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    var element = e.target as HTMLInputElement
    let value = element.value && element.value.replace(' ', '');
    setSearchParams((preState) => ({ ...preState, search: value }))
  }

  const getData = () => {
    const params = {
      ...searchParams,
      pageSize,
      current,
    }
    get(USER.list, params).then(res => {
      if (res.state === 200) {
        const { list = [], pagination = {} } = res?.results
        const { current, pageSize, total } = pagination
        setPageSize(pageSize)
        setCurrent(current)
        setTotal(total)
        setData(list)
      }
      // setSearchParams({})
    })
    console.log('params', params)
  }



  const onChange: PaginationProps['onChange'] = pageNumber => {
    setCurrent(pageNumber)
  };

  const onShowSizeChange: PaginationProps['onShowSizeChange'] = (current, size) => {
    setPageSize(size)
    setCurrent(current)
  };

  const gotoNew = (type: string, id?: string) => {
    switch (type) {
      case 'add':
        navigate('/users/userManager/add')
        break;
      case 'edit':
        navigate(`/users/userManager/edit/${id}`)
        sessionStorage.setItem('current', `${current}`)
        break;
    }
  }

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('e.target.value', e.target.value)
    if (e.target.value === '') {
      setSearchParams({ ...searchParams, search: '' })
    }
  }

  const getRoles = () => {
    const params = {
      current: 1,
      pageSize: 100
    }
    get(ROLE.optionList, params).then(res => {
      const { list } = res?.results
      setRoleList(list)
    })
  }


  useEffect(() => {
    const statusList = [
      { value: 0, label: '停用' },
      { value: 1, label: '启用' },
    ]
    setStatusList(statusList)
  }, [])


  useEffect(() => {
    getData()
  }, [searchParams, pageSize, current])

  useEffect(() => {
    getRoles()
  }, [])

  useEffect(()=>{
    setCurrent(Number(sessionStorage.getItem('current')) || 1)
  },[sessionStorage.getItem('current')])

  const getTags = (tags:string[])=>{
    console.log(tags)
  }

  const validateInput = (value:string)=>{
    return /^[a-zA-Z0-9]+$/.test(value)
  }

  return (
    <div className='user-manager'>
      {/* <MyTag sendTags = {getTags} validateInput={validateInput} defaultTags={[11,22,33]} isCheck={false}/> */}
      <div className="role-count">
        <RoleCount />
      </div>
      <div className='user-cont'>
        <div className='search-btn'>
          <div className='btn'>
            <div className='btn-new mr50' onClick={() => gotoNew('add')}>+ 新建</div>
            <div className=' mr50'>
              角色：
              <Select
                placeholder='请选择'
                style={{ width: 120 }}
                onChange={(value: string) => handleChange(value, 'roleId')}
                options={roleList}
                allowClear={true}
                fieldNames={{ label: 'roleName', value: 'roleId' }}
              />
            </div>
            <div className=' mr50'>
              来源：
              <Select
                placeholder='请选择'
                style={{ width: 120 }}
                onChange={(value: string) => handleChange(value, 'source')}
                options={sourceList}
                allowClear={true}
              />
            </div>
            <div>
              状态：
              <Select
                placeholder='请选择'
                style={{ width: 120 }}
                onChange={(value: string) => handleChange(value, 'status')}
                options={statusList}
                allowClear={true}
              />
            </div>
          </div>
          <div className='search'>
            <div>搜索：</div><Input size="small" placeholder="请输入用户名或联系方式" onPressEnter={onPressEnter} allowClear={true} onChange={(e) => { onSearchChange(e) }} />
          </div>
        </div>
        <div className='cont-table mt20'>
          <Table columns={columns} dataSource={data} scroll={{ x: 1300 }} pagination={false} rowKey='userId' />
          <div className='cont-pagination mt20'>
            <Pagination showQuickJumper pageSize={pageSize} total={total} onChange={onChange} showSizeChanger={true} onShowSizeChange={onShowSizeChange} />
          </div>
        </div>
      </div>
    </div>
  )
}))
export default UserManager