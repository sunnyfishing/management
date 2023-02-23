/**
 * 使用 antD 4.x 的Upload组件进行文件流上传
 *
 *
 */

import { Button, message, Upload } from "antd";
import React, { useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import "./index.scss";

interface Props {
  config?: object; // 同antd组件的参数
  sendData?: any; //回传文件url
  setHaveChange?:any
}

export default function UploadFile(props: Props) {
  const { config={}, sendData,setHaveChange } = props;

  const [fileList, setFileList] = useState<string[]>([]);

  let configCopy = {
    maxCount:3,
    ...config
  }
  const checkFileSize = (file: any) => {
    return file.size / 1024 / 1024 < 100;
  };
  const onChange = (info: any) => {
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);
      // if(info.fileList)
      setFileList(info.fileList);
    }
    if (info.file.status === "done") {
      setHaveChange(true)
      message.success(`${info.file.name} 文件上传成功`);
      const response = info.file.response || {};
      const url = response?.results?.url;
      setFileList(fileList.concat(url));
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} 文件上传失败`);
    }
  };

  // const onRemove = (file:any)=>{
  //   console.log('file',file)
  // }

  useEffect(() => {
    console.log("fileList", fileList);
    sendData&&sendData(fileList);
  }, [fileList]);

  return (
    <div className="upload-file">
      <Upload
        name="file"
        action="/apiInterface/interface/hydra-opinion-platform/api/v1/common/hydraFile/uploadFile"
        headers={{
          "platform-token": sessionStorage.getItem("platform-token") || "",
        }}
        accept=".pdf"
        onChange={onChange}
        // onRemove={onRemove}
        {...configCopy}
        beforeUpload={checkFileSize}
      >
        {(fileList.length < configCopy.maxCount)&& <Button icon={<UploadOutlined />}>上传文件</Button>}
      </Upload>
    </div>
  );
}
