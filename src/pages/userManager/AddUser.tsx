import React, { FocusEventHandler, useEffect, useState, MouseEventHandler } from 'react'
import { Form, Input, Row, Col, Button, DatePicker, Select, Divider, Radio, Modal, message } from 'antd'
import type { RangePickerProps } from 'antd/es/date-picker';
import { useNavigate } from "react-router-dom";
import { CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { validatorTel, validatorEmail } from '../../utils/lib'
import { get, postForm, postJson } from '../../utils/axios';
import { ROLE, USER } from '../../api/api';
import './index.scss'
import { inject, observer } from 'mobx-react';
var md5 = require('md5');

const { RangePicker } = DatePicker;
const { TextArea } = Input;

const colLayout = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 24 },
  xl: { span: 12 },
  xxl: { span: 8 }
}

const inputWidth = 350

const maxLength = 50

let initialState:any = {
  phone: '',
  email: '',
  password: '',
  userName: '',
  intentionType: 'NONE',
  intentionDescription: '',
  source: 0,
  roleId: [],
  userId: '',
  status: 0,
  createName: '',
  createTime: '',
  updateName: '',
  updateTime: ''
}


const AddUser = inject('staticStore')(observer((props: any) => {
  const { staticStore } = props
  let { sourceList } = staticStore
  let routes: string[] = location.hash.split('/') || []
  let isAdd: boolean = location.hash.indexOf('add') > -1
  let isEdit: boolean = location.hash.indexOf('edit') > -1
  let isCheck: boolean = location.hash.indexOf('check') > -1
  let id: string = isAdd ? '' : routes[routes.length - 1]
  const [isRightPhone, setIsRightPhone] = useState(undefined)
  const [isRightEmail, setIsRightEmail] = useState(undefined)
  const [roleOption, setRoleOption] = useState([])
  const [formObj, setFormObj] = useState(initialState)
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const checkEmail: FocusEventHandler<HTMLInputElement> = (e: { target: { value: any; }; }) => {
    let isRight = validatorEmail(e.target.value)
    setIsRightEmail(isRight)
  }
  
  if(isAdd){
    sourceList = sourceList.slice(0, 1)
  }
  console.log('sourceList',sourceList)

  const validatorPassWord = (rule: any, value: any, callback: (arg0: any) => void) => {
    if(isAdd){
      if (value === undefined) {
        return Promise.reject('请检查输入是否正确！')
      }
      if (value.length > 30 || value.length < 8) {
        return Promise.reject('请输入8-30位长度的密码！')
      }
      try {
        let reg = /^[\da-zA-Z]{8,30}$/
        let res = reg.test(value)
        if (res) {
          return Promise.resolve();
        } else {
          return Promise.reject('密码设置不可以包含特殊字符，请重新输入！')
        }
      } catch (err) {
        callback(err);
      }
    }else{
      return Promise.resolve()
    }
  }

  const validatorPhone = async (rule: any, value: any, callback: (arg0: any) => void) => {
    if(isAdd){
      let isRight = validatorTel(value)
      try {
        if (isRight) {
          let result = false
          const params={
            account:value
          }
          await postJson(`${USER.phone}`,params).then(res => {
            if (res.state !== 200) {
              message.warning(res.msg)
              setIsRightPhone(false)
            }
            if (res?.results?.expression) {
              result = true
              if(!formObj.userName){
                form.setFieldsValue({
                  userName: `用户${value}`,
                })
                setFormObj({ ...formObj, userName: `用户${value}` })
              }
              setIsRightPhone(true)
            } else {
              result = false
              setIsRightPhone(false)
            }
          })
          return result?Promise.resolve():Promise.reject('该手机号已成功注册，请更换手机号！')
        } else {
          setIsRightPhone(false)
          return Promise.reject('请检查输入是否正确！')
        }
      }
      catch (err) {
        callback(err)
      }
    }else{
      return Promise.resolve()
    }
  }

  const validatorFormEmail = async (rule: any, value: any, callback: (arg0: any) => void) => {
    if(isAdd){
      let isRight = validatorEmail(value)
      try {
        if (isRight) {
          let result = false
          const params={
            email:value
          }
          await postJson(`${USER.email}`,params).then(res => {
            if (res.state !== 200) {
              message.warning(res.msg)
              setIsRightEmail(false)
            }
            result = res?.results?.expression
            setIsRightEmail(res?.results?.expression)
          })
          return result?Promise.resolve():Promise.reject('该邮箱已成功注册，请更换邮箱！')
        } else {
          setIsRightEmail(false)
          return Promise.reject('请检查输入是否正确！')
        }
      }
      catch (err) {
        callback(err)
      }
    }else{
      return Promise.resolve()
    }
  }

  const onFinish = (values: any) => {
    console.log('Success:', values);
    console.log('formObj:', formObj);
    const { roleId = [] } = formObj
    let roleInfos = roleId.map((item: any) => {
      return {
        roleId: item,
        validityStart: '2022-12-12  01:00:00',
        validityEnd: '2222-12-12  01:00:00',
      }
    })
    // let roleInfos = 
    const params = {
      ...formObj,
      roleInfos,
      // accountType:'1',
      userId: id || '',
      validityStart: '2022-12-12  01:00:00',
      validityEnd: '2222-12-12  01:00:00',
      password: md5(formObj.password),
      status:isAdd?1:formObj.status
    }
    delete params.roleId
    console.log('params', params)
    postJson(USER.save, params).then(res => {
      if (res.state === 200) {
        message.success(`保存成功`)
        setTimeout(() => {
          navigate(-1)
        }, 1000)
      }else{
        message.error(`保存失败`)
      }
    })
  }
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
    const { values } = errorInfo
    const { phone, email } = values || {}
    let isRightP = validatorTel(phone)
    setIsRightPhone(isRightP)
    let isRightE = validatorEmail(email)
    setIsRightEmail(isRightE)
  };

  const onChange: RangePickerProps['onChange'] = (dates: any[], dateStrings: any[]) => {
    if (dates) {
      console.log('From: ', dates[0], ', to: ', dates[1]);
      console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
    } else {
      console.log('Clear');
    }
  };

  const handleChange = (value: string[]) => {
    console.log(`selected ${value}`);
    setFormObj((pre: any) => ({ ...pre, roleId: value }))
  };

  const goBack: MouseEventHandler<HTMLElement> = () => {
    if(JSON.stringify(initialState) === JSON.stringify(formObj)){
      navigate(-1)
      return
    }
    Modal.confirm({
      title: '确认放弃当前操作并返回列表页？',
      onOk: () => {
        navigate(-1)
      }
    })
    // setA({...a,b:33})
  }

  const getRoles = () => {
    const params = {
      current: 1,
      pageSize: 100
    }
    get(ROLE.optionList, params).then(res => {
      const { list } = res.results
      setRoleOption(list)
      if (isEdit || isCheck) {
        getDetail()
      }
      // (isEdit || isCheck) && getDetail()
    })
  }

  const getDetail = () => {
    postForm(USER.getUser, { userId: id }).then(res => {
      const {
        phone = '',
        email = '',
        password = '',
        userName = '',
        intentionType = '',
        intentionDescription = '',
        // accountType= '1',
        source = 0,
        roleInfos = [],
        accountNo = '',
        userId,
        status,
        createName = '',
        createTime = '',
        updateName = '',
        updateTime = ''
      } = res?.results || {}
      setFormObj({
        phone: phone || accountNo,
        email,
        password,
        userName,
        intentionType,
        intentionDescription,
        // accountType,
        source,
        roleId: roleInfos.map((item: { roleId: string; }) => item.roleId),
        userId,
        status,
        createName,
        createTime,
        updateName,
        updateTime
      })
      form.setFieldsValue({
        phone: phone || accountNo,
        email,
        password,
        userName,
        intentionType,
        intentionDescription,
        // accountType,
        source,
        roleId: roleInfos.map((item: { roleId: string; }) => item.roleId),
        status
      })
    })
  }

  useEffect(() => {
    getRoles()
  }, [])

  useEffect(() => {
    form.setFieldsValue({
      intentionType: 'NONE',
      roleId: [],
      userId: '',
    })
  }, [])

  return (
    <div className='add-user'>
      <h3>基本信息</h3>
      <Form
        name="basic"
        initialValues={{ remember: true }}
        autoComplete="off"
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        validateTrigger="onBlur"
        form={form}
      >
        {!isAdd && <Row>
          <Col {...colLayout}>
            <Form.Item
              label="用户ID"
              name="userId"
            >
              {formObj.userId}
            </Form.Item>
          </Col>
          <Col {...colLayout}>
            <Form.Item
              label="用户状态"
              name="status"
            >
              <Radio.Group
                value={formObj.status}
                defaultValue={formObj.status}
                onChange={(e: any) => setFormObj({ ...formObj, status: e.target.value })}
                disabled={isCheck}
              >
                <Radio value={1}>启用</Radio>
                <Radio value={0}>停用</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>}
        <Row>
          <Col {...colLayout}>
            <Form.Item
              label="手机号"
              name="phone"
              validateStatus={isRightPhone === undefined ? null : isRightPhone ? 'success' : 'error'}
              // rules={[{ required: true, message: '请检查输入是否正确！', pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-9])\d{8}$/ }]}
              rules={[{ required: true,validator: validatorPhone }]}
            >
              <Input
                suffix={isRightPhone === undefined ? <span /> : isRightPhone ? <CheckCircleOutlined style={{ color: 'green' }} /> : <CloseCircleOutlined style={{ color: 'red' }} />}
                maxLength={11}
                style={{ width: inputWidth }}
                // onBlur={(e: any) => checkPhone(e)}
                value={formObj.phone}
                onChange={(e: { target: { value: any; }; }) => setFormObj({ ...formObj, phone: e.target.value })}
                placeholder="请输入"
                autoComplete="off"
                disabled={isCheck || isEdit} />
            </Form.Item>
          </Col>
          <Col {...colLayout}>
            <Form.Item
              label="邮箱"
              name="email"
              validateStatus={isRightEmail === undefined ? null : isRightEmail ? 'success' : 'error'}
              // rules={[{ required: true, message: '请检查输入是否正确！', pattern: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/ }]}
              rules={[{ required: true,validator: validatorFormEmail }]}
            >
              <Input
                suffix={isRightEmail === undefined ? <span /> : isRightEmail ? <CheckCircleOutlined style={{ color: 'green' }} /> : <CloseCircleOutlined style={{ color: 'red' }} />}
                maxLength={maxLength}
                placeholder="请输入"
                style={{ width: inputWidth }}
                value={formObj.email}
                onChange={(e: { target: { value: any; }; }) => setFormObj({ ...formObj, email: e.target.value })}
                onBlur={(e: any) => checkEmail(e)}
                disabled={isCheck} />
            </Form.Item>
          </Col>
          <Col {...colLayout}>
            <Form.Item
              label="密码"
              name="password"
              rules={[{ required: true, validator: validatorPassWord }]}
            >
              <Input.Password style={{ width: inputWidth }}
                disabled={isCheck || isEdit}
                value={formObj.password}
                onChange={(e: { target: { value: any; }; }) => setFormObj({ ...formObj, password: e.target.value })}
                autoComplete="off"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col {...colLayout}>
            <Form.Item
              label="用户名"
              name="userName"
              rules={[{ required: true, message: '请检查输入是否正确！' }]}
            >
              <Input maxLength={maxLength} style={{ width: inputWidth }}
                placeholder="请输入"
                disabled={isCheck}
                value={formObj.userName}
                autoComplete="off"
                onChange={(e: { target: { value: any; }; }) => setFormObj({ ...formObj, userName: e.target.value })}
              />
            </Form.Item>
          </Col>
          {/* <Col {...colLayout}>
            <Form.Item
              label="有效期"
              name="eee"
              rules={[{ required: true, message: '请检查输入是否正确！' }]}
            >
              <RangePicker
                onChange={onChange}
                style={{ width: inputWidth }}
                ranges={{
                  '近七天': [moment(), moment().add(6, 'd')],
                  '近一月': [moment(), moment().add(30, 'd')],
                  '近一年': [moment(), moment().add(365, 'd')],
                }}
                disabled={isCheck} />
            </Form.Item>
          </Col> */}
          <Col {...colLayout}>
            <Form.Item
              label="角色"
              name="roleId"
              rules={[{ required: true, message: '请检查输入是否正确！' }]}
            >
              <Select
                mode="multiple"
                allowClear
                style={{ width: inputWidth }}
                placeholder="请选择"
                onChange={handleChange}
                options={roleOption}
                disabled={isCheck}
                value={formObj.roleId}
                // value={formObj.roleId}
                fieldNames={{ label: 'roleName', value: 'roleId' }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col {...colLayout}>
            <Form.Item
              label="意向"
              name="intentionType"
              rules={[{ required: true, message: '请检查输入是否正确！' }]}
            >
              <Radio.Group
                value={formObj.intentionType}
                defaultValue={formObj.intentionType}
                disabled={isCheck}
                onChange={(e: any) => setFormObj({ ...formObj, intentionType: e.target.value })}
              >
                <Radio value='NONE'>暂无</Radio>
                <Radio value='YES'>有意向</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          {formObj.intentionType === 'YES' && <Col {...colLayout}>
            <Form.Item
              label="意向描述"
              name="intentionDescription"
              rules={[{ required: true, message: '请检查输入是否正确！' }]}
            >
              <TextArea rows={4} placeholder="请简单描述你的需求" maxLength={1000} style={{ width: inputWidth }}
                disabled={isCheck}
                value={formObj.intentionDescription}
                onChange={(e: { target: { value: any; }; }) => setFormObj({ ...formObj, intentionDescription: e.target.value })}
              />
            </Form.Item>
          </Col>}
        </Row>
        {!isAdd && <Row>
          <Col {...colLayout}>
            <Form.Item
              label="创建时间"
              name="createTime"
            >
              {formObj.createTime}
            </Form.Item>
          </Col>
          <Col {...colLayout}>
            <Form.Item
              label="修改时间"
              name="updateTime"
            >
              {formObj.updateTime}
            </Form.Item>
          </Col>
          <Col {...colLayout}>
            <Form.Item
              label="操作人"
              name="updateName"
            >
              {formObj.updateName || formObj.createName}
            </Form.Item>
          </Col>
        </Row>}
        <Divider ></Divider>
        <h3>组织信息</h3>
        <Row>
          <Col span={24}>
            <Form.Item
              label="用户类型"
              name="accountType"
            >
              <div className='user-type'>散户</div>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col {...colLayout}>
            <Form.Item
              label="来源"
              name="source"
              rules={[{ required: true, message: '请检查输入是否正确！' }]}
            >
              <Select
                allowClear
                style={{ width: inputWidth }}
                placeholder="请选择"
                value={formObj.source}
                onChange={(v: any) => setFormObj({ ...formObj, source: v })}
                options={sourceList}
                disabled={isCheck || isEdit}
              />
            </Form.Item>
          </Col>
        </Row>
        {(isAdd || isEdit) && <Row>
          <Col span={4}>
            <div className='btn'>
              <Button type="primary" htmlType="submit" className='mr20'>
                提交
              </Button>
              <Button onClick={goBack}>
                取消
              </Button>
            </div>
          </Col>
        </Row>}
        {
          isCheck && <Row>
            <Col span={4}>
              <div className='btn'>
                <Button onClick={() => navigate(-1)}>
                  返回
                </Button>
              </div>
            </Col>
          </Row>
        }

      </Form>
    </div>
  )
}))
export default AddUser
