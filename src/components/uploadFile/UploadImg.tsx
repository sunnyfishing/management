/**
 * 使用 antD 4.x 的Upload组件进行文件流上传
 *
 *
 */

import React, { useEffect, useState } from "react";
import { message, Upload } from "antd";
import { UploadProps } from "antd/es/upload/interface";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";

interface Props {
  sendUrl?: any;
  url?: string;
  setHaveChange?:any
}

export default function UploadImg(props: Props) {
  const { sendUrl, url,setHaveChange } = props;
  const [imageUrl, setImageUrl] = useState<string>();
  const [loading, setLoading] = useState(false);
  const checkImgSize = (file: any) => {
    return file.size / 1024 / 1024 < 10;
  };

  const upLoadProps: UploadProps = {
    accept: "image/*",
    name: "file",
    listType: "picture-card",
    action:
      "/apiInterface/interface/hydra-opinion-platform/api/v1/common/hydraFile/uploadFile",
    showUploadList: false,
    headers: {
      "platform-token": sessionStorage.getItem("platform-token"),
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        setHaveChange(true)
        message.success(`${info.file.name} 文件上传成功`);
        const response = info.file.response || {};
        const url = response?.results?.url;
        setImageUrl(url);
        sendUrl(url);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} 文件上传失败`);
      }
      setLoading(false);
    },
  };

  useEffect(() => {
    setImageUrl(url);
  }, [url]);

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>上传</div>
    </div>
  );

  return (
    <div>
      <Upload {...upLoadProps}
      beforeUpload={checkImgSize}>
        {imageUrl ? (
          <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
        ) : (
          uploadButton
        )}
      </Upload>
    </div>
  );
}
