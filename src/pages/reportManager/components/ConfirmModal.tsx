import { Modal } from "antd";
import React from "react";

export default function ConfirmModal(){
    return (
    <Modal width={120}>
        确认修改将覆盖该条数据记录，确认修改?
    </Modal>
    )
}