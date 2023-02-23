import React, { useEffect, useState } from 'react'
import { Modal, Form, Input, Row, Col, message, Radio, InputNumber, TreeSelect } from 'antd';
import type { RadioChangeEvent } from 'antd';
import { get, postForm, postJson } from '../../../utils/axios';
import { inject, observer } from "mobx-react";
import { MENU } from '../../../api/api'
import '../index.scss'
import UploadImg from '../../../components/uploadFile/UploadImg';

interface Params {
  "funUri": string,
  "icon"?: string,
  "menuId"?: string,
  "menuName": string,
  "menuType": string,
  "module": string,
  "parentMenuId": string | any[],
  "sort": number,
}

interface ListParams {
  current: number,
  pageSize: number,
  module?: string,
  menuType: string | number,
  status:number
}

const inputWidth = 350

const initialMenuOption:any=[
  {
    "menuId": "root",
    "menuName": "官网",
    children: []
  }
]


const EditModal = inject("staticStore")(observer((props: any) => {
  const { modalType, setIsShowModal, activeKey, getData, menuId, staticStore } = props
  const { menuTypes } = staticStore
  const isEdit: boolean = modalType === 'edit'
  const [title, setTitle] = useState('')
  const [menuOption, setMenuOption] = useState(initialMenuOption)
  const [formObj, setFormObj] = useState({
    menuName: '',
    menuType: '',
    parentMenuId: 'root' || [],
    funUri: '',
    sort: -1,
    menuId: '',
    icon: '',
  })
  const [form] = Form.useForm();


  const handleOk = () => {
    form.validateFields().then(() => {
      const params: Params = {
        ...formObj,
        module: activeKey,
        parentMenuId: formObj.parentMenuId === 'root' ? '' : formObj.parentMenuId
      }
      // console.log('Params',params)
      postJson(MENU.saveMenu, params).then(res => {
        if (res.state !== 200) {
          message.error(res.msg)
          return
        }
        message.success('保存成功')
        setTimeout(() => {
          setIsShowModal(false);
          getData()
        }, 1000)
      })
    })
      .catch((info: any) => {
        console.log('表单校验失败', info);
        return
      });
  };

  const handleCancel = () => {
    setIsShowModal(false);
  };

  const onRadioChange = (e: RadioChangeEvent) => {
    if (e.target.value === 'CATALOGUE') {
      setMenuOption(initialMenuOption)
      setFormObj({ ...formObj, parentMenuId: 'root', menuType: e.target.value })
      form.setFieldsValue({
        parentMenuId: 'root'
      })
    } else {
      getMenuList(e.target.value === 'MENU'?'CATALOGUE':e.target.value === 'OPERATION'?'MENU':'')
      setFormObj({ ...formObj, menuType: e.target.value,parentMenuId: undefined })
      form.setFieldsValue({
        parentMenuId: undefined
      })
    }
  };


  const handleMenuChange = (value: string[]) => {
    setFormObj({ ...formObj, parentMenuId: value })
    // 修改原数据操作
  };

  const getMenuList = async (menuType:string) => {
    const params: ListParams = {
      current: 1,
      pageSize: 100,
      module: activeKey,
      menuType,
      status:1
    }
    await get(MENU.listRecord, params).then(res => {
      if (res.state !== 200) {
        message.error(res.msg)
        return
      }
      const list = res?.results?.list
      setMenuOption(list)
    })
  }

  const getDetail = () => {
    get(MENU.selectByMenuId, { menuId }).then(async res => {
      let {
        menuName = '',
        menuType = '',
        parentMenuId = undefined || 'root',
        funUri = '',
        sort = -1,
        menuId,
        icon = ''
      } = res?.results || {}
      if(menuType === 'CATALOGUE'){
        parentMenuId = parentMenuId || 'root',
        setMenuOption(initialMenuOption)
      }else{
        await getMenuList(menuType === 'MENU'?'CATALOGUE':menuType === 'OPERATION'?'MENU':'')
      }
      console.log('parentMenuId', parentMenuId)
      setFormObj({
        menuName,
        menuType,
        // menuType:menuTypes[menuType].key,
        parentMenuId,
        funUri,
        sort,
        menuId,
        icon,
      })
      form.setFieldsValue({
        menuName,
        menuType,
        // menuType:menuTypes[menuType].key,
        parentMenuId,
        funUri,
        sort,
        icon
      })
    })
  }

  const getUploadUrl = (url: string) => {
    setFormObj((pre) => ({
      ...pre,
      icon: url
    }))
  }

  useEffect(() => {
    console.log('formObj', formObj)
  }, [formObj])

  useEffect(() => {
    (modalType === 'edit' || modalType === 'check') && getDetail()
    if (modalType === 'add') {
      form.setFieldsValue({
        menuType: 'CATALOGUE',
        parentMenuId: 'root' || [],
      })
      setFormObj({
        ...formObj,
        menuType: 'CATALOGUE',
        parentMenuId: 'root' || [],
      })
    }
  }, [modalType])

  useEffect(() => {
    switch (modalType) {
      case 'add':
        setTitle('新建菜单')
        break;
      case 'edit':
        setTitle('编辑菜单')
        break;
      case 'check':
        setTitle('查看菜单')
        break;
    }
  }, [modalType])

  return (
    <Modal title={title} open={true} onOk={handleOk} maskClosable={false} onCancel={handleCancel} width={750} wrapClassName="edit-modal">
      <Form
        name="basic"
        autoComplete="off"
        validateTrigger="onBlur"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        form={form}
      >
        <Row>
          <Col span={24}>
            <Form.Item
              label="菜单名称："
              name="menuName"
              rules={[{ required: true, message: '请检查输入是否正确！' }]}
            >
              <Input maxLength={50} value={formObj.menuName} onChange={(e: any) => { setFormObj({ ...formObj, menuName: e.target.value }) }} style={{ width: inputWidth, marginRight: '20px' }} placeholder='请输入' />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              label="菜单类型："
              name="menuType"
              rules={[{ required: true, message: '请检查输入是否正确！' }]}
            >
              <Radio.Group onChange={onRadioChange} value={formObj.menuType} defaultValue={formObj.menuType} disabled={isEdit}>
                {Object.keys(menuTypes).map(item => <Radio value={item} key={item}>{menuTypes[item].label}</Radio>)}
                {/* {Object.values(menuTypes).map((item: { key: any; label: any; }) => (<Radio value={item.key} key={item.key}>{item.label}</Radio>))} */}
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              label="上级菜单："
              name="parentMenuId"
              rules={[{ required: true, message: '请检查输入是否正确！' }]}
            >
              <TreeSelect
                style={{ width: '100%' }}
                value={formObj.parentMenuId}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                placeholder="请选择"
                allowClear
                treeDefaultExpandAll
                onChange={handleMenuChange}
                treeData={menuOption}
                disabled={formObj.menuType === 'CATALOGUE'}
                fieldNames={{ label: 'menuName', value: 'menuId', children: 'children' }}
              />
            </Form.Item>
          </Col>
        </Row>
        {formObj.menuType === 'OPERATION' ?
          <Row>
            <Col span={24}>
              <Form.Item
                label="操作权限码："
                name="funUri"
                rules={[{ required: true, message: '请检查输入是否正确！' }]}
              >
                <Input maxLength={50} value={formObj.funUri} onChange={(e: any) => { setFormObj({ ...formObj, funUri: e.target.value }) }} style={{ width: inputWidth }} placeholder='请输入' />
              </Form.Item>
            </Col>
          </Row>
          : <Row>
            <Col span={24}>
              <Form.Item
                label='菜单URL：'
                name="funUri"
                rules={[{ required: true, message: '请检查输入是否正确！' }]}
              >
                <Input value={formObj.funUri} onChange={(e: any) => { setFormObj({ ...formObj, funUri: e.target.value }) }} maxLength={50} style={{ width: inputWidth }} placeholder='请输入' />
              </Form.Item>
            </Col>
          </Row>}


        {(formObj.menuType === 'CATALOGUE' || formObj.menuType === 'MENU') && <>
          <Row>
            <Col span={24}>
              <Form.Item
                label="排序："
                name="sort"
                rules={[{ required: true, message: '请检查输入是否正确！' }]}
              >
                <InputNumber value={formObj.sort} min={1} max={10000} onChange={(v: number) => { setFormObj({ ...formObj, sort: v }) }} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item
                label="icon："
                name="icon"
              >
                {/* <Upload {...upLoadProps}>
                  {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                </Upload> */}
                <UploadImg sendUrl={(url: string) => getUploadUrl(url)} url={formObj.icon} />
              </Form.Item>
            </Col>
          </Row>
        </>}
      </Form>
    </Modal>
  )
}))
export default EditModal
