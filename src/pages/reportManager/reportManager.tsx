import { Input, Table, Pagination, Popconfirm, Select, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import type { PaginationProps } from "antd";
import EditModal from "./components/EditModal";
import PreviewModal from "./components/PreviewModal";
import "./index.scss";

interface DataType {
  roleId?: DataType;
  createTime: any;
  // updateTime: any;
  key?: React.Key;
  reportName: string;
  reportType: string;
  tags: string[];
  permission: string;
  status: number;
  // ccc: number,
  deleted?: any;
}

export default function ReportManager() {
  const columns: ColumnsType<DataType> = [
    {
      title: "报告名称",
      dataIndex: "reportName",
      key: "reportName",
      className: "reportName",
      // width: 200,
      render: (value) => (
        <>
          <div className="describe">{value}</div>
        </>
      ),
    },
    {
      title: "报告类型",
      dataIndex: "reportType",
      key: "reportType",
      width: 100,

      render: (value) => (
        <>
          <div className="describe">{value}</div>
        </>
      ),
    },
    {
      title: "标签",
      dataIndex: "tags",
      key: "tags",
      width: 280,
      align: "center",
      ellipsis: {
        showTitle: false,
      },
      render: (value) =>
        // (
        //   <>
        //     <div className="describe" title={value}>
        //       {value}
        //     </div>
        //   </>
        // )
        {
          let tags = value.slice(0, 3);
          const rederDiv = tags.map((item: any, index: number) => {
            return (
                <Tag className="tag-div" title={item} key={index}>
                  {item}
                </Tag>
            );
          });
          return rederDiv;
        },
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      // width: 100,
      // ellipsis: {
      //     showTitle: false,
      // },
      render: (value) => (
        <>
          {/* <div className='describe'>{value}</div> */}
          {value === 1 ? (
            <div className="activeStatus">已上架</div>
          ) : (
            <div className="inactiveStatus">待上架</div>
          )}
        </>
      ),
    },
    {
      title: "权限",
      dataIndex: "permission",
      key: "permission",
      // width: 100,
      render: (value) => (
        <>
          <div className="describe">{value}</div>
        </>
      ),
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
      width: 300,
      sorter: (a, b) =>
        new Date(a.createTime).getTime() - new Date(b.createTime).getTime(),
      ellipsis: true,
    },
    {
      title: "操作",
      key: "roleId",
      dataIndex: "roleId",
      fixed: "right",
      width: 280,
      render: (value, record) => (
        <>
          <a className="mr14" onClick={() => gotoNew("check", value)}>
            查看
          </a>
          {!record.status ? (
            <a
              className="mr14"
              onClick={() => statusChange(value, record.status)}
            >
              上架
            </a>
          ) : (
            <Popconfirm
              title="执行下架操作后，该数据将在用户页面删除，是否继续"
              onConfirm={() => statusChange(value, record.status)}
              okText="是"
              cancelText="否"
            >
              <a className="mr14">下架</a>
            </Popconfirm>
          )}

          <a
            className={`mr14 ${!record.status ? "" : "disabled-edit"}`}
            onClick={() => gotoNew("edit", value)}
          >
            编辑
          </a>
          <a className="mr14" onClick={() => gotoPreview()}>
            预览
          </a>
          {!record.status ? (
            <Popconfirm
              title="确定要删吗？确定吗？"
              onConfirm={() => deleteData(value)}
              okText="是"
              cancelText="否"
            >
              <a className="delete">删除</a>
            </Popconfirm>
          ) : (
            <span title="停用后可删除" className="disabled-delete">
              删除
            </span>
          )}
        </>
      ),
    },
  ];
  const data1: DataType[] = [
    {
      reportName:
        "John Brownaasdsaasdsadsasadassadsaasdsadsadsaasdsadsadasdasdsadsadsadasaddsasd",
      createTime: "2023-02-14 15:59:48",
      reportType: "John Brown",
      tags: ["龙井茶", "asdasda", "sadadasdasdsasadasadsasd"],
      permission: "只读",
      status: 1,
      deleted: 1,
    },
    {
      reportName: "John Brown",
      createTime: "2023-02-16 16:43:20",
      reportType: "John Brown",
      tags: ["龙井茶", "普洱茶", "铁观音"],
      permission: "只读",
      status: 0,
      deleted: 1,
    },
    {
      reportName: "农业农村部",
      createTime: "1111",
      reportType: "John Brown",
      tags: ["碧螺春"],
      permission: "只读",
      status: 1,
      deleted: 1,
    },
    {
      reportName: "农业农村部",
      createTime: "1111",
      reportType: "John Brown",
      tags: ["碧螺春"],
      permission: "只读",
      status: 1,
      deleted: 1,
    },
    {
      reportName: "农业农村部",
      createTime: "1111",
      reportType: "John Brown",
      tags: ["碧螺春"],
      permission: "只读",
      status: 1,
      deleted: 1,
    },
    {
      reportName: "农业农村部",
      createTime: "1111",
      reportType: "John Brown",
      tags: ["碧螺春"],
      permission: "只读",
      status: 1,
      deleted: 1,
    },
    {
      reportName: "农业农村部",
      createTime: "1111",
      reportType: "John Brown",
      tags: ["碧螺春"],
      permission: "只读",
      status: 1,
      deleted: 1,
    },
    {
      reportName: "农业农村部",
      createTime: "1111",
      reportType: "John Brown",
      tags: ["碧螺春"],
      permission: "只读",
      status: 1,
      deleted: 1,
    },
    {
      reportName: "农业农村部",
      createTime: "1111",
      reportType: "John Brown",
      tags: ["碧螺春"],
      permission: "只读",
      status: 1,
      deleted: 1,
    },
    {
      reportName: "农业农村部",
      createTime: "1111",
      reportType: "John Brown",
      tags: ["碧螺春"],
      permission: "只读",
      status: 1,
      deleted: 1,
    },
    {
      reportName: "农业农村部",
      createTime: "1111",
      reportType: "John Brown",
      tags: ["碧螺春"],
      permission: "只读",
      status: 1,
      deleted: 1,
    },
    {
      reportName: "农业农村部",
      createTime: "1111",
      reportType: "John Brown",
      tags: ["碧螺春"],
      permission: "只读",
      status: 1,
      deleted: 1,
    },
  ];

  const [searchParams, setSearchParams] = useState({});
  const [reportTypeList, setreportTypeList] = useState([]);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(10);
  const [pageSize, setPageSize] = useState(10);
  const [current, setCurrent] = useState(1);
  const [isShowModal, setIsShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [roleId, setId] = useState("");
  const [isShowPreview, setIsShowPreview] = useState(false);

  const onChange: PaginationProps["onChange"] = (pageNumber) => {
    setCurrent(pageNumber);
  };

  const onShowSizeChange: PaginationProps["onShowSizeChange"] = (
    current,
    size
  ) => {
    setPageSize(size);
    setCurrent(current);
  };

  const gotoNew = (type: string, roleId?: string) => {
    setId(roleId);
    setModalType(type);
    setIsShowModal(true);
  };

  const gotoPreview = () => {
    setIsShowPreview(true);
  };

  const statusChange = (value: string, status: number) => {
    //   console.log('value', value)
    //   postForm(USER.operate, { userId: value }).then(res => {
    //   if (res.state === 200) {
    //     message.success(`${status ? '停用' : '启用'}成功`)
    //     getData()
    //   }
    // })
  };

  const handleChange = (value: string, type: string) => {
    setSearchParams({ ...searchParams, [type]: value });
  };

  const onPressEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    var element = e.target as HTMLInputElement;
    let value = element.value && element.value.replace(" ", "");
    setSearchParams((preState) => ({ ...preState, search: value }));
  };

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("e.target.value", e.target.value);
    if (e.target.value === "") {
      setSearchParams({ ...searchParams, search: "" });
    }
  };

  const deleteData = (value: string) => {
    console.log("value", value);
    // const params={
    //   roleId:value
    // }
    // postForm(ROLE.del,params).then(res => {
    //   if (res.state === 200) {
    //     message.success('删除成功')
    //     getData()
    //   }
    // })
  };

  const getData = () => {
    console.log("111");
  };
  useEffect(() => {
    getData();
  });

  return (
    <div className="report-manager">
      <div className="report-cont">
        <div className="search-btn">
          <div className="btn">
            <div className="btn-new mr50" onClick={() => gotoNew("add")}>
              + 新建
            </div>
            <div className=" mr50">
              报告类型：
              <Select
                defaultValue="全部"
                style={{ width: 120 }}
                onChange={(value: string) =>
                  handleChange(value, "reportTypeId")
                }
                options={[
                  { value: "产研报告", label: "产研报告" },
                  { value: "智能报告", label: "智能报告" },
                  { value: "全部", label: "全部" },
                ]}
                allowClear={true}
                // fieldNames={{ label: 'reportType', value: 'reportTypeId' }}
              />
            </div>
            <div className=" mr50">
              权限：
              <Select
                defaultValue="全部"
                style={{ width: 120 }}
                onChange={(value: string) =>
                  handleChange(value, "permissionId")
                }
                options={[
                  { value: "试读", label: "试读" },
                  { value: "购买", label: "购买" },
                  { value: "全部", label: "全部" },
                ]}
                allowClear={true}
                // fieldNames={{ label: 'permission', value: 'permissionId' }}
              />
            </div>
            <div className="search">
              <div>搜索：</div>
              <Input
                size="small"
                placeholder="输入标题，标签"
                onPressEnter={onPressEnter}
                allowClear={true}
                onChange={(e) => {
                  onSearchChange(e);
                }}
              />
            </div>
          </div>
        </div>
        <div className="cont-table mt20">
          <Table
            columns={columns}
            dataSource={data1}
            scroll={{ x: "max-content", y: 500 }}
            pagination={false}
            rowKey="roleId"
          />
          <div className="cont-pagination mt20">
            <Pagination
              showQuickJumper
              pageSize={pageSize}
              total={total}
              onChange={onChange}
              showSizeChanger={true}
              onShowSizeChange={onShowSizeChange}
            />
          </div>
        </div>
      </div>
      {isShowModal && (
        <EditModal
          modalType={modalType}
          roleId={roleId}
          setIsShowModal={setIsShowModal}
          getData={getData}
        />
      )}
      {isShowPreview && (
        <PreviewModal setIsShowPreview={setIsShowPreview}></PreviewModal>
      )}
    </div>
  );
}
