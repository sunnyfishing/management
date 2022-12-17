import React, { MouseEventHandler, useEffect, useState } from 'react'
import { Select, Input, Table, Pagination, Popconfirm, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { PaginationProps } from 'antd';
import './index.scss'
import { get } from '../../utils/axios';
import { MESSAGE } from '../../api/api';

interface DataType {
  account: string,
  description: number,
}

const columns: ColumnsType<DataType> = [
  {
    title: '手机号',
    dataIndex: 'account',
    key: 'account',
  },
  {
    title: '短信内容',
    dataIndex: 'message',
    key: 'message',
  }
];

export default function MessageList() {
  const [data, setData] = useState([])
  const [total, setTotal] = useState(10)
  const [pageSize, setPageSize] = useState(10)
  const [current, setCurrent] = useState(1)
  const [searchParams, setSearchParams] = useState({})

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
    setSearchParams({ ...searchParams, account: value.trim() })
  }
  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
    if(e.target.value === ''){
      setSearchParams({ ...searchParams, search:''})
    }
  }

  const getData = () => {
    const params = {
      ...searchParams,
      pageSize: 10,
      current: 1
    }
    get(MESSAGE.list, params).then(res => {
      const { list, pagination } = res?.results || {}
      const { current, pageSize, total } = pagination
      setPageSize(pageSize)
      setCurrent(current)
      setTotal(total)
      setData(list)
    })
  }

  useEffect(() => {
    getData()
  }, [current,pageSize,searchParams])

  // useEffect(()=>{
  //   console.log('111')
  // })
  return (
    <div className='message-manager'>
      <div className='message-cont'>
      <div className='search-btn'>
          <div className='btn'>
            <div className='search'>
              <div>手机号：</div><Input size="small" placeholder="按回车搜索" onPressEnter={onPressEnter} onChange={(e)=>{onSearchChange(e)}} allowClear={true}/>
            </div>

          </div>
        </div>
        <div className='cont-table mt20'>
          <Table columns={columns} dataSource={data} pagination={false} rowKey='id' />
          <div className='cont-pagination mt20'>
            <Pagination showQuickJumper pageSize={pageSize} total={total} onChange={onChange} showSizeChanger={true} onShowSizeChange={onShowSizeChange} />
          </div>
        </div>
      </div>
    </div>
  )
}
