import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Row,
  Col,
  Checkbox,
  Tabs,
  Tree,
  message,
  Select,
  Radio,
  Upload,
  Button,
  UploadProps,
  Space,
  InputNumber,
  Popconfirm,
} from "antd";
import { get, post, postForm, postJson } from "../../../utils/axios";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { MENU, ROLE } from "../../../api/api";
import TreeSelect from "../../../components/treeSelect";
import { UploadOutlined } from "@ant-design/icons";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import "../index.scss";
import { RcFile, UploadChangeParam } from "antd/lib/upload";
import MyTag from "../../../components/myTag";
import ConfirmModal from "./ConfirmModal";
import UploadFile from "../../../components/uploadFile/UploadFile";
import UploadImg from "../../../components/uploadFile/UploadImg";

const { TextArea } = Input;
const { TabPane } = Tabs;

interface Props {
  modalType: string;
  setIsShowModal: any;
  getData: any;
  roleId: string;
}

interface Params {
  description: string;
  groupId: number;
  isDefault: boolean;
  roleId: string;
  menuIds: any;
  roleName: string;
}

const inputWidth = 350;

const props: UploadProps = {
  name: "file",
  action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
  headers: {
    authorization: "authorization-text",
  },
  onChange(info) {
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

// const props: UploadProps = {
//   beforeUpload: file => {
//     const isPNG = file.type === 'image/png';
//     if (!isPNG) {
//       message.error(`${file.name} is not a png file`);
//     }
//     return isPNG || Upload.LIST_IGNORE;
//   },
//   onChange: info => {
//     console.log(info.fileList);
//   },

// };

// const beforeUpload = (file: RcFile) => {
//   const isLt2M = file.size / 1024 / 1024 < 10;
//   if (!isLt2M) {
//     message.error('Image must smaller than 10MB!');
//   }
//   return isLt2M;
// };

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export default function EditModal(props: Props) {
  const { modalType, setIsShowModal, roleId, getData } = props;
  // const isAdd:boolean =  modalType === 'add'
  const [title, setTitle] = useState("");
  const [appList, setAppList] = useState([]);
  const [activeKey, setActiveKey] = useState("1");
  const [isDisabledForm, setIsDisabledForm] = useState(false);
  const [choosedKeys, setChoosedKeys] = useState([]);
  const [form] = Form.useForm();
  const [isAdd, setIsAdd] = useState(false);
  const [isCheck, setIsCheck] = useState(false);
  const [menuOption, setMenuOption] = useState([]);
  const [searchParams, setSearchParams] = useState({});
  const [type, setType] = useState("产研报告");
  const [showPreModal, setIsShowPreModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  // const [isShowConfirmModal,setIsShowConfirmModal] = useState(false)
  // const [roleList, setRoleList] = useState()
  // const [fileList, setFileList] = useState<UploadFile[]>([

  // ]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [childTags, setChildTags] = useState([]);

  const [formObj, setFormObj] = useState({
    description: "",
    roleName: "",
    menuIds: [],
    isDefault: false,
    roleId: "",
    updateName: "",
    updateTime: "",
    createName: "",
    createTime: "",
    tags: [],
  });
  const [BeforeformObj, setBeforeFormObj] = useState({
    description: "",
    roleName: "",
    menuIds: [],
    isDefault: false,
    roleId: "",
    updateName: "",
    updateTime: "",
    createName: "",
    createTime: "",
    tags: [],
  });

  let loginName = "admin";

  const handleOk = () => {
    // setIsShowConfirmModal(true);
    form
      .validateFields()
      .then((values) => {
        console.log("values", values);
        const params: Params = {
          ...formObj,
          groupId: 0,
        };
        console.log("params", params);
        postJson(ROLE.saveRoleMenu, params).then((res) => {
          if (res.state !== 200) {
            message.error(res.msg);
            return;
          }
          message.success("保存成功");
          setTimeout(() => {
            setIsShowModal(false);
            getData();
          }, 1000);
        });
      })
      .catch((info) => {
        console.log("表单校验失败", info);
        return;
      });
  };

  const checkFileSize = (file: any) => {
    if (file.size / 1024 / 1024 >= 100) {
      message.error("文件大小不能超过100MB!");
      return false;
    }
  };

  //   const imgChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
  //   setFileList(newFileList);

  // const imgPreview = async (file: UploadFile) => {
  //   if (!file.url && !file.preview) {
  //     file.preview = await getBase64(file.originFileObj as RcFile);
  //   }

  //   setPreviewImage(file.url || (file.preview as string));
  //   setPreviewOpen(true);
  //   setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  // };
  const handleCancel = () => {
    setIsShowModal(false);
  };
  const handlePreCancel = () => {
    setPreviewOpen(false);
  };

  const onChange = (e: CheckboxChangeEvent) => {
    if (e.target.checked) {
      postForm(ROLE.checkDefaultRole, { excludeRoleId: roleId || "" }).then(
        (res) => {
          if (res.state !== 200) {
            message.error(res.msg);
            setFormObj((pre) => ({ ...pre, isDefault: false }));
            return;
          }
          setFormObj((pre) => ({ ...pre, isDefault: e.target.checked }));
        }
      );
    } else {
      setFormObj((pre) => ({ ...pre, isDefault: false }));
    }
  };

  const tabChange = (activeKey: string) => {
    setActiveKey(activeKey);
  };

  const handleChange = (value: string, type: string) => {
    setSearchParams({ ...searchParams, [type]: value });
  };
  const typeChange = (value: string) => {
    setType(value);
  };

  const sendCheckedKeys = (v: string[]) => {
    form.setFieldValue("menuIds", v);
    v.forEach((item: any, index: number) => {
      if (item === undefined) {
        v.splice(index, 1);
      }
    });
    setFormObj((pre) => ({ ...pre, menuIds: v }));
  };

  const getDetail = () => {
    get(`${ROLE.getDetail}/${roleId}`, { roleId }).then((res) => {
      const {
        description = "",
        roleName = "",
        menuIds = [],
        isDefault = false,
        roleId = "",
        updateName = "",
        updateTime = "",
        createName = "",
        createTime = "",
        tags = [],
      } = res?.results || {};
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
        tags,
      });
      setBeforeFormObj({
        description,
        roleName,
        menuIds,
        isDefault,
        roleId,
        updateName,
        updateTime,
        createName,
        createTime,
        tags,
      });

      form.setFieldsValue({
        description,
        roleName,
        menuIds,
        isDefault,
        roleId,
      });
      getMenuList(menuIds);
    });
  };

  const getMenuList = (menuIds: string[]) => {
    postForm(MENU.getMenuTreeByModule, {
      module: "OFFICIAL_WEBSITE",
      status: 1,
    }).then((res) => {
      const { results } = res;
      setMenuOption(results);
      let parentMenuIds: string[] = [];
      for (let item of results) {
        if (item.children.length > 0) {
          parentMenuIds.push(item.menuId);
        }
      }
      let menuIdsCopy = menuIds.slice();
      parentMenuIds.forEach((item: string) => {
        let index = menuIdsCopy.indexOf(item);
        if (index > -1) {
          menuIdsCopy.splice(index, 1);
        }
      });
      console.log("menuIdsCopy", menuIdsCopy);
      setChoosedKeys(menuIdsCopy);
    });
  };

  function deepEquals(x: any, y: any) {
    // 先判断传入的是否为对象
    let f1 = x instanceof Object;
    let f2 = y instanceof Object;
    if (!f1 || !f2) {
      return x === y;
    }
    if (Object.keys(x).length !== Object.keys(y).length) {
      return false;
    }
    let newX = Object.keys(x);
    for (let p = 0; p < newX.length; p++) {
      let p2 = newX[p];
      let a = x[p2] instanceof Object;
      let b = y[p2] instanceof Object;
      if (a && b) {
        if (!deepEquals(x[p2], y[p2])) {
          return false;
        }
      } else if (x[p2] !== y[p2]) {
        return false;
      }
    }
    return true;
  }

  const getTags = (tags: []) => {
    console.log(tags, "22222222222");
    setChildTags(tags);
    console.log(childTags, "23123123123123123");
  };

  const validateInput = (value: string) => {
    return /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(value);
  };

  // const InputNumberChange = (value: number) => {
  //   const val = value.toString()
  //   const tempArr = val.split(".");
  //   if (tempArr[1]?.length) {
  //     // return `${tempArr[0]}.${tempArr[1].slice(0, 2)}`.replace(
  //     //   /[^\d{1,}\.\d{1,}|\d{1,}]/g,
  //     //   ""
  //     // );
  //     return /[^\d{1,}\.\d{1,}|\d{1,}]/g.test(`${tempArr[0]}.${tempArr[1].slice(0, 2)}`)
  //   } else if (tempArr[0] == '0') {
  //     // return val.replace(/0/g, " ");
  //     return /0/g.test(val)
  //   } else {
  //     // return val.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g, " ");
  //     return /[^\d{1,}\.\d{1,}|\d{1,}]/g.test(val)
  //   }
  // };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传</div>
    </div>
  );

  // const validatorPrice =async (e:any)=>{
  //   const {value} =e.target
  //   return /^\D*(\d*(?:\.\d{0,2})?).*$/g.test(value)
  // }
  const handleIdValidator = async (_: any, value: any) => {
    // step1. 非空校验
    if (value === undefined || !value.trim()) {
      throw new Error();
    }
  };
  const validatorTags = () => {
    if (childTags.length > 5) {
      return Promise.reject("标签不能超过5个！");
    }
  };

  useEffect(() => {
    switch (modalType) {
      case "add":
        setTitle("新建报告");
        setIsAdd(true);
        getMenuList([]);
        break;
      case "edit":
        setTitle("编辑报告");
        setIsEdit(true);
        break;
      case "check":
        setTitle("查看报告");
        setIsDisabledForm(true);
        setIsCheck(true);
        break;
    }
  }, [modalType]);

  useEffect(() => {
    console.log(childTags, "sdadasdasdasd");
  }, [childTags]);
  useEffect(() => {
    (modalType === "edit" || modalType === "check") && getDetail();
  }, [modalType]);

  useEffect(() => {
    let appList = [
      {
        label: "官网",
        key: "1",
      },
    ];
    setAppList(appList);
  }, []);

  return (
    <Modal
      title={title}
      open={true}
      maskClosable={false}
      footer={false}
      width={750}
      onCancel={handleCancel}
      wrapClassName="edit-modal"
    >
      <Form
        name="basic"
        autoComplete="off"
        validateTrigger="onBlur"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        form={form}
        initialValues={{ aaa: "产研报告",permission:"试读"}}
      >
        <Row>
          <Col span={24}>
            <Form.Item
              label="报告类型："
              name="aaa"
              rules={[{ required: true, message: "请选择正确的一项！" }]}
            >
              <Select
                defaultValue="产研报告"
                style={{ width: 350 }}
                onChange={(value: string) => typeChange(value)}
                options={[
                  { value: "产研报告", label: "产研报告" },
                  { value: "智能", label: "智能报告" },
                ]}
                allowClear={true}
                disabled={isDisabledForm}

                // fieldNames={{ label: 'roleName', value: 'roleId' }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={20} push={1}>
            <Form.Item
              label="报告名称："
              name="roleName"
              rules={[{ required: true, message: "请检查输入是否正确！" }]}
            >
              <div className="role-name">
                <Input
                  value={formObj.roleName}
                  maxLength={200}
                  style={{ width: inputWidth, marginRight: "20px" }}
                  disabled={isDisabledForm}
                  onChange={(e) => {
                    setFormObj((pre) => ({ ...pre, roleName: e.target.value }));
                  }}
                  placeholder="请输入"
                />
              </div>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={20} push={1}>
            <Form.Item
              label="标签："
              name="tags"
              rules={[
                { required: true, message: "请检查输入是否正确！" },
                { max: 10, message: "字符不能超过10" },
                { validator: validatorTags },
              ]}
            >
              <div className="role-name">
                <MyTag
                  sendTags={getTags}
                  validateInput={validateInput}
                  defaultTags={[11, 22, 33]}
                  isCheck={isCheck}
                  disabled={isDisabledForm}
                />
                {/* <Input value={formObj.tags} maxLength={200} style={{ width: inputWidth, marginRight: '20px' }} disabled={isDisabledForm} onChange={(e) => { setFormObj((pre) => ({ ...pre, tags: e.target.value })) }} placeholder="多标签用逗号隔开" /> */}
              </div>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={20} push={1}>
            <Form.Item
              label="权限："
              name="permission"
              rules={[{ required: true, message: "请检查输入是否正确！" }]}
            >
              <div className="role-name">
                <Radio.Group
                  // onChange={onChange}
                  disabled={isDisabledForm}
                  defaultValue={"试读"}
                >
                  <Radio value={"试读"}>试读</Radio>
                  <Radio value={"购买"}>购买</Radio>
                </Radio.Group>
              </div>
            </Form.Item>
          </Col>
        </Row>
        {type === "产研报告" && (
          <div>
            <Row>
              <Col span={20} push={1}>
                <Form.Item
                getValueFromEvent={(e: any) => {
                  const { value } = e.target;
                  const tempArr = value.split(".");
                  if (tempArr[1]?.length) {
                    return `${tempArr[0]}.${tempArr[1].slice(0, 2)}`.replace(
                      /[^\d{1,}\.\d{1,}|\d{1,}]/g,
                      ""
                    );
                  } else if (tempArr[0] == 0) {
                    return value.replace(/0/, "");
                  } else {
                    return value.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g, "");
                  }
                }}
                  label="原价："
                  name="beforePrice"
                  rules={[{ required: true, message: "请检查输入是否正确！" }]}
                >
                  <div className="role-name">
                    <Space direction="vertical">
                      <InputNumber
                        addonBefore="￥"
                        min={-1}
                        max={1000000}
                        disabled={isDisabledForm}
                        // onChange={InputNumberChange}
                      />
                    </Space>
                  </div>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={20} push={1}>
                <Form.Item
                  getValueFromEvent={(e: any) => {
                    const { value } = e.target;
                    const tempArr = value.split(".");
                    if (tempArr[1]?.length) {
                      return `${tempArr[0]}.${tempArr[1].slice(0, 2)}`.replace(
                        /[^\d{1,}\.\d{1,}|\d{1,}]/g,
                        ""
                      );
                    } else if (tempArr[0] == 0) {
                      return value.replace(/0/, "");
                    } else {
                      return value.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g, "");
                    }
                  }}
                  label="折后价："
                  name="afterPrice"
                  rules={[{ required: true, message: "请检查输入是否正确！" }]}
                >
                  <div className="role-name">
                    <Space direction="vertical">
                      <InputNumber
                        addonBefore="￥"
                        min={-1}
                        max={1000000}
                        // onChange={InputNumberChange}
                        // parser={text=>/^\d+$/.test(text)?text:0}
                        disabled={isDisabledForm}
                      />
                    </Space>
                  </div>
                </Form.Item>
              </Col>
            </Row>
          </div>
        )}

        <Row>
          <Col span={20} push={1}>
            <Form.Item
              label="上传附件："
              name="uploadFile"
              rules={[{ required: true, message: "请上传附件！" }]}
            >
              <div className="role-name">
                <UploadFile></UploadFile>
              </div>
              <div className="point-out">支持扩展名：.pdf</div>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={20} push={1}>
            <Form.Item
              label="封面："
              name="uploadCover"
              rules={[{ required: true, message: "请上传封面！" }]}
            >
              <div className="role-name">
                <UploadImg sendUrl={""} url={""}></UploadImg>
                {/* <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handlePreCancel}>
               <img alt="example" style={{ width: '100%' }} src={previewImage} />
             </Modal> */}
              </div>
              <div className="point-out">
                支持扩展名：.png .jpg .jpeg .bmp .svg .ico...
              </div>
            </Form.Item>
          </Col>
        </Row>
        {!isAdd && (
          <>
            <Row>
              <Col span={24}>
                <Form.Item label="创建时间：" name="createTime">
                  {formObj.createTime}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item label="修改时间：" name="updateTime">
                  {formObj.updateTime}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item label="编辑人：" name="updateName">
                  {formObj.updateName || formObj.createName || "admin"}
                </Form.Item>
              </Col>
            </Row>
          </>
        )}
      </Form>
      {!isCheck && (
        <div className="modal-footer-btn">
          <div className="footer-btn de-active mr10" onClick={handleCancel}>
            取消
          </div>
          {/* <div className='footer-btn active' onClick={handleOk}>确定</div> */}
          {!isEdit && deepEquals(formObj, BeforeformObj) ? (
            <div className="footer-btn active" onClick={handleOk}>
              确定
            </div>
          ) : (
            <Popconfirm
              title="确认修改将覆盖该条数据记录，确认修改"
              onConfirm={() => handleOk()}
              okText="是"
              cancelText="否"
            >
              <div className="footer-btn active">确定</div>
            </Popconfirm>
          )}
        </div>
      )}
      {/* {isShowConfirmModal && <ConfirmModal></ConfirmModal>} */}
    </Modal>
  );
}
