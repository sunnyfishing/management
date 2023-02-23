import { Modal } from 'antd'
import React, { useEffect, useState } from 'react'
interface Props {
    setIsShowPreview: any,
    // getData: any,
    // roleId: string
  }
export default function PreviewModal (props:Props){
    const {setIsShowPreview} = props
    const [title,setTitle] = useState('111')
    const handleCancel = ()=>{
        setIsShowPreview(false)
    }
 return (
    <Modal width={750} footer={false} open={true} onCancel={handleCancel} title={title} >
        {/* <img src="" alt="" /> */}
        <p>报告内容</p>
    </Modal>
 )
}