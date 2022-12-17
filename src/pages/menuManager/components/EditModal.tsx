import React, { Children, useEffect, useState } from 'react'
import { Modal, Form, Input, Row, Col, Select, Tabs, Radio, InputNumber, TreeSelect } from 'antd';
import type { RadioChangeEvent } from 'antd';
import { get, post,postForm, postJson } from '../../../utils/axios';
import { inject, observer } from "mobx-react";
import { message, Upload } from 'antd';
import { MENU } from '../../../api/api'
import '../index.scss'

interface Params {
  "funUri": string,
  "icon"?: string,
  "menuId"?: string,
  "menuName": string,
  "menuType": number,
  "module": string,
  "parentMenuId": string,
  "sort": number
}

const inputWidth = 350

const EditModal = inject("staticStore")(observer((props:any)=>{
  const { modalType, setIsShowModal, activeKey ,getData,menuId,staticStore} = props
  const {menuTypes} = staticStore
  const [title, setTitle] = useState('')
  const [menuOption, setMenuOption] = useState([])
  // const [menuName, setMenuName] = useState<string>('');
  // const [menuType, setMenuType] = useState<number>(0);
  // const [parentMenuId, setParentMenuId] = useState(undefined);
  // const [funUri, setFunUri] = useState<string>('');
  // const [sort, setSort] = useState<number>(-1);

  const [formObj, setFormObj] = useState({
    menuName:'',
    menuType:0,
    parentMenuId:undefined,
    funUri:'',
    sort:-1,
    menuId:''
  })
  const [form] = Form.useForm();


  const handleOk = () => {
    form.validateFields().then(values => {
        const params: Params = {
          ...formObj,
          module: activeKey,
        }
        // const header = {'Content-Type': 'application/json;charset=UTF-8'}
        console.log('params',params)
        postJson(MENU.saveMenu, params).then(res => {
          if(res.state !==200){
            message.error(res.msg)
            return
          }
          message.success('保存成功')
          setTimeout(()=>{
            setIsShowModal(false);
            getData()
          },1000)
        })
      })
      .catch(info => {
        console.log('表单校验失败', info);
        return
      });
  };

  const handleCancel = () => {
    setIsShowModal(false);
  };

  const onRadioChange = (e: RadioChangeEvent) => {
    // setMenuType(Number(e.target.value));
    setFormObj({...formObj,menuType:Number(e.target.value)})
  };


  const handleMenuChange = (value: string[]) => {
    console.log(`selected ${value}`);
    // setParentMenuId(value)
    setFormObj({...formObj,parentMenuId:value})
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

  const getDetail = ()=>{
    get(MENU.selectByMenuId,{menuId}).then(res=>{
      const {
        menuName='',
        menuType=0,
        parentMenuId=undefined,
        funUri='',
        sort=-1,
        menuId
      } = res?.results || {}
      setFormObj({
        menuName,
        menuType,
        parentMenuId,
        funUri,
        sort,
        menuId,
      })
      form.setFieldsValue({
          menuName,
          menuType,
          parentMenuId,
          funUri,
          sort
      })
    })
  }

  useEffect(()=>{
    console.log('formObj',formObj)
  },[formObj])

  useEffect(() => {
    getMenuList()
  }, [])

  useEffect(()=>{
    (modalType === 'edit' || modalType === 'check') && getDetail()
  },[modalType])

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
              <Input maxLength={50} value={formObj.menuName} onChange={(e) => { setFormObj({...formObj,menuName:e.target.value}) }} style={{ width: inputWidth, marginRight: '20px' }} placeholder='请输入' />
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
              <Radio.Group onChange={onRadioChange} value={formObj.menuType}>
                {menuTypes.map((item: { key: any; label:any; }) => (<Radio value={item.key} key={item.key}>{item.label}</Radio>))}
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
                fieldNames={{ label: 'menuName', value: 'menuId', children: 'children' }}
              />
            </Form.Item>
          </Col>
        </Row>
        {(formObj.menuType === 0 || formObj.menuType === 1) && <>

          <Row>
            <Col span={24}>
              <Form.Item
                label="菜单URL："
                name="funUri"
                rules={[{ required: true, message: '请检查输入是否正确！' }]}
              >
                <Input value={formObj.funUri} onChange={(e) => { setFormObj({...formObj,funUri:e.target.value}) }} maxLength={50} style={{ width: inputWidth }} placeholder='请输入' />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item
                label="权重："
                name="sort"
                rules={[{ required: true, message: '请检查输入是否正确！' }]}
              >
                <InputNumber value={formObj.sort} min={1} onChange={(v) => { setFormObj({...formObj,sort:v}) }} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item
                label="icon："
                name="icon"
              >
              </Form.Item>
            </Col>
          </Row>
        </>}
      </Form>
    </Modal>
  )
}))
export default EditModal
