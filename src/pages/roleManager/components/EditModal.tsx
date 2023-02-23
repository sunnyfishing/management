import React, { useEffect, useState } from 'react'
import { Modal, Form, Input, Row, Col, Checkbox, Tabs, Tree, message } from 'antd';
import { get, post, postForm, postJson } from '../../../utils/axios';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import { MENU, ROLE } from '../../../api/api'
import TreeSelect from '../../../components/treeSelect';
import '../index.scss'

const { TextArea } = Input;
const { TabPane } = Tabs;

interface Props {
  modalType: string,
  setIsShowModal: any,
  getData: any,
  roleId: string
}

interface Params {
  "description": string,
  "groupId": number,
  "isDefault": boolean,
  "roleId": string,
  "menuIds": any,
  "roleName": string
}

const inputWidth = 350

export default function EditModal(props: Props) {
  const { modalType, setIsShowModal, roleId, getData } = props
  // const isAdd:boolean =  modalType === 'add'
  const [title, setTitle] = useState('')
  const [appList, setAppList] = useState([])
  const [activeKey, setActiveKey] = useState('1')
  const [isDisabledForm, setIsDisabledForm] = useState(false)
  const [choosedKeys, setChoosedKeys] = useState([])
  const [form] = Form.useForm();
  const [isAdd, setIsAdd] = useState(false)
  const [isCheck, setIsCheck] = useState(false)
  const [menuOption, setMenuOption] = useState([])

  const [formObj, setFormObj] = useState({
    description: '',
    roleName: '',
    menuIds: [],
    isDefault: false,
    roleId: '',
    updateName:'',
    updateTime:'',
    createName:'',
    createTime:'',
  })

  let loginName = 'admin'

  const handleOk = () => {
    // setIsShowModal(false);

    form.validateFields().then(values => {
      console.log('values', values)
      const params: Params = {
        ...formObj,
        groupId: 0,
      }
      console.log('params', params)
      postJson(ROLE.saveRoleMenu, params).then(res => {
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
      .catch(info => {
        console.log('表单校验失败', info);
        return
      });
  };

  const handleCancel = () => {
    setIsShowModal(false);
  };

  const onChange = (e: CheckboxChangeEvent) => {
    if(e.target.checked){
      postForm(ROLE.checkDefaultRole,{excludeRoleId:roleId|| ''}).then(res=>{
        if (res.state !== 200) {
            message.error(res.msg)
            setFormObj((pre) => ({ ...pre, isDefault:false }))
            return
        }
        setFormObj((pre) => ({ ...pre, isDefault: e.target.checked }))
      })
    }else{
      setFormObj((pre) => ({ ...pre, isDefault:false }))
    }
  };

  const tabChange = (activeKey: string) => {
    setActiveKey(activeKey)
  }

  const sendCheckedKeys = (v: string[]) => {
    form.setFieldValue('menuIds', v)
    v.forEach((item:any,index:number)=>{
      if(item ===  undefined){
        v.splice(index,1)
      }
    })
    setFormObj((pre) => ({ ...pre, menuIds: v }))
  }

  const getDetail = () => {
    get(`${ROLE.getDetail}/${roleId}`, { roleId }).then(res => {
      const {
        description = '',
        roleName = '',
        menuIds = [],
        isDefault = false,
        roleId = '',
        updateName= '',
        updateTime= '',
        createName= '',
        createTime= '',
      } = res?.results || {}
      setFormObj({
        description,
        roleName,
        menuIds,
        isDefault,
        roleId,
        updateName,
        updateTime,
        createName,
        createTime,
      })
      
      form.setFieldsValue({
        description,
        roleName,
        menuIds,
        isDefault,
        roleId
      })
      getMenuList(menuIds)
    })
  }

  const getMenuList = (menuIds:string[]) => {
    postForm(MENU.getMenuTreeByModule,{module:'OFFICIAL_WEBSITE',status:1}).then(res => {
      const { results } = res
      setMenuOption(results)
      let parentMenuIds:string[] = []
      for(let item of results){
        if(item.children.length>0){
          parentMenuIds.push(item.menuId)
        }
      }
      let menuIdsCopy = menuIds.slice()
      parentMenuIds.forEach((item:string)=>{
        let index = menuIdsCopy.indexOf(item)
        if(index>-1){
          menuIdsCopy.splice(index,1)
        }
      })
      console.log('menuIdsCopy',menuIdsCopy)
      setChoosedKeys(menuIdsCopy)
    })
  }

  useEffect(() => {
    switch (modalType) {
      case 'add':
        setTitle('新建角色')
        setIsAdd(true)
        getMenuList([])
        break;
      case 'edit':
        setTitle('编辑角色')
        break;
      case 'check':
        setTitle('查看角色')
        setIsDisabledForm(true)
        setIsCheck(true)
        break;
    }
  }, [modalType])

  useEffect(() => {
    (modalType === 'edit' || modalType === 'check') && getDetail()
  }, [modalType])

  useEffect(() => {
    let appList = [
      {
        label: '官网',
        key: '1'
      }
    ]
    setAppList(appList)
  }, [])

  return (
    <Modal title={title} open={true}  maskClosable={false} footer={false}  width={750} onCancel={handleCancel} wrapClassName="edit-modal">
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
              label="创建人："
              name="aaa"
            >
              <div>{loginName}</div>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={20} push={1}>
            <Form.Item
              label="角色名称："
              name="roleName"
              rules={[{ required: true, message: '请检查输入是否正确！' }]}
            >
              <div className='role-name'>
                <Input value={formObj.roleName} maxLength={50} style={{ width: inputWidth, marginRight: '20px' }} disabled={isDisabledForm} onChange={(e) => { setFormObj((pre) => ({ ...pre, roleName: e.target.value })) }} />
                {/* <Checkbox onChange={onChange} checked={formObj.isDefault} disabled={isDisabledForm}>默认角色</Checkbox> */}
              </div>
            </Form.Item>
          </Col>
          <Col pull={1} style={{marginTop:'5px'}}>
            <Checkbox onChange={onChange} checked={formObj.isDefault} disabled={isDisabledForm}>默认角色</Checkbox>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              label="角色描述："
              name="description"
            >
              <TextArea value={formObj.description} onChange={(e) => { setFormObj((pre) => ({ ...pre, description: e.target.value })) }} rows={4} placeholder="没付钱的用户" disabled={isDisabledForm} maxLength={200} style={{ width: inputWidth }} />
            </Form.Item>
          </Col>
        </Row>
        {(!isAdd) && <>
          <Row>
            <Col span={24}>
              <Form.Item
                label="创建时间："
                name="createTime"
              >
                {formObj.createTime}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item
                label="修改时间："
                name="updateTime"
              >
                {formObj.updateTime}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item
                label="编辑人："
                name="updateName"
              >
                {formObj.updateName || formObj.createName}
              </Form.Item>
            </Col>
          </Row>
        </>}
        <Row>
          <Col span={24}>
            <Form.Item
              label="应用权限配置："
              name="menuIds"
              rules={[{ required: true, message: '请检查输入是否正确！' }]}
            >
              <Tabs activeKey={activeKey} className='aaaaa' onChange={tabChange} items={appList} />
              <TreeSelect menuOption={menuOption} choosedKeys={choosedKeys} activityKey={activeKey} disabled={isDisabledForm} sendCheckedKeys={sendCheckedKeys} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      {!isCheck && <div className='modal-footer-btn'>
        <div className='footer-btn de-active mr10' onClick={handleCancel}>取消</div>
        <div className='footer-btn active' onClick={handleOk}>确定</div>
      </div>}
      
    </Modal>
  )
}
