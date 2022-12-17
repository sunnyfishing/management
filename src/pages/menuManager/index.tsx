import React, { MouseEventHandler, useEffect, useState } from 'react'
import { Space, Switch, Table, Tabs, Popconfirm, Pagination, message } from 'antd';
import type { PaginationProps } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { TableRowSelection } from 'antd/es/table/interface';
import { inject, observer } from "mobx-react";
import EditModal from './components/EditModal'
import { get,post,postForm } from '../../utils/axios';
import { MENU } from '../../api/api'
import { Divider } from 'antd'
import defaultIcon from '../../styles/images/menu/defaultIcon.png'
import './index.scss'

interface DataType {
  key: React.Key;
  name: string;
  bbb: number;
  ccc: string;
  sort: number,
  status:number,
  children?: DataType[];
}

interface Params {
  current: number,
  pageSize: number,
  module?:string
}

const MenuManager = inject("staticStore")(observer((props: any) => {
  const { staticStore } = props
  const { menuTypes,tabData } = staticStore
  const [isShowModal, setIsShowModal] = useState(false)
  const [modalType, setModalType] = useState('')
  const [activeKey, setActiveKey] = useState('OFFICIAL_WEBSITE')
  const [total, setTotal] = useState(10)
  const [pageSize, setPageSize] = useState(10)
  const [current, setCurrent] = useState(1)
  const [menuId, setMenuId] = useState('')
  const [data, setData] = useState<DataType[]>([])


  const columns: ColumnsType<DataType> = [
    {
      title: '菜单名称',
      dataIndex: 'menuName',
      key: 'menuName',
    },
    {
      title: 'icon',
      dataIndex: 'icon',
      key: 'icon',
      render: (v) => <img src={v || defaultIcon} />
    },
    { title: '菜单URL', dataIndex: 'funUri', key: 'funUri' },
    {
      title: '类型', 
      dataIndex: 'menuType', 
      key: 'menuType',
      render: (v) => {
        const item = menuTypes.find((item: any) => item.key === v)
        return <>{item.label}</>
      }
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      sorter: (a, b) => a.sort - b.sort,
      ellipsis: true,
    },
    {
      title: '状态', dataIndex: 'status', key: 'status', render: (value) => <>
        {!value ? <div className='status-cont'>
          <span className='point stop'></span><span className='stop-text'>停用</span>
        </div>
          : <div className='status-cont'>
            <span className='point start'></span><span className='open-text'>启用</span>
          </div>}

      </>, filters: [
        {
          text: '启用',
          value: 1,
        },
        {
          text: '停用',
          value: 0,
        },
      ],
      onFilter: (value: string, record) => { console.log(record); return record.status === Number(value) },
    },
    {
      title: '操作',
      key: 'menuId',
      dataIndex: 'menuId',
      fixed: 'right',
      width: 160,
      render: (value,record) => <>
        <a className='mr14' onClick={() => gotoNew('edit',value)}>编辑</a>
        <Popconfirm
          title={`确认${true ? '启用' : '停用'}该用户`}
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


  const deleteData = (value: DataType) => {
    console.log('value', value)
    const params={
      menuId:value
    }
    postForm(MENU.del,params).then(res => {
      if (res.state === 200) {
        message.success('删除成功')
        getData()
      }
    })
  }

  const startStop = (menuId:string,status:number) => {
    const params={
      menuId:menuId
    }
    postForm(MENU.operate,params).then(res => {
      if (res.state === 200) {
        message.success(`${status?'停用':'启用'}成功`)
        getData()
      }
    })
  }

  const gotoNew = (type: string,menuId?:string) => {
    setMenuId(menuId)
    setModalType(type)
    setIsShowModal(true)
  }

  const onTabChange = (key: string) => {
    clearData()
    setActiveKey(key)
  }
  const onChange: PaginationProps['onChange'] = pageNumber => {
    console.log('Page: ', pageNumber);
    setCurrent(pageNumber)

  };
  const onShowSizeChange: PaginationProps['onShowSizeChange'] = (current, size) => {
    setPageSize(size)
    setCurrent(current)
  };

  const clearData = ()=>{
    setPageSize(10)
    setCurrent(1)
    setTotal(0)
    setData([])
  }

  const getData = () => {
    const params: Params = {
      current,
      pageSize,
      module:activeKey
    }
    get(MENU.list, params).then(res => {
      let { list,pagination } = res?.results
      const {current,pageSize,total} = pagination
      setPageSize(pageSize)
      setCurrent(current)
      setTotal(total)
      setData(list)
    })
  }

  useEffect(() => {
    getData()
  }, [current,pageSize,activeKey])

  return (
    <div className='menu-manager'>
      <div className='menu-types'>
        <Tabs
          activeKey={activeKey}
          type="card"
          items={tabData}
          onChange={onTabChange}
        />
      </div>
      <div className='btn-new mt20 mb20' onClick={() => gotoNew('add')}>+ 新建</div>
      {isShowModal && <EditModal modalType={modalType} activeKey={activeKey} getData={getData} setIsShowModal={setIsShowModal} menuId={menuId}/>}
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        rowKey='menuId'
      />
      {!!total && <div className='cont-pagination mt20'>
        <Pagination showQuickJumper pageSize={pageSize} total={total} showSizeChanger={true}  onChange={onChange} onShowSizeChange={onShowSizeChange} />
      </div>}
    </div>
  )
}))

export default MenuManager
