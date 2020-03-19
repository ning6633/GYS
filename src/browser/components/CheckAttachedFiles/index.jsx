import React, { Component } from 'react';
import { observer, inject, } from 'mobx-react';
import { SHOW_CheckAttachedFiles_MODEL } from "../../constants/toggleTypes"
import {Modal, Form, Table, Card, Button } from 'antd';
import CustomScroll from "../CustomScroll";
import { supplierTrain} from "../../actions"
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性
@inject('toggleStore')
@observer
class CheckAttachedFiles extends React.Component {
    state = {
        attachedFiles: [],
    }
    handleOk = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_CheckAttachedFiles_MODEL)
    };
    handleCancel = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_CheckAttachedFiles_MODEL)
    };
    async componentDidMount() {
        let _files = this.props.editrecord.trainPlanFileList;
        this.setState({
            attachedFiles: _files
        })
    }
    render() {
        const { toggleStore } = this.props;
        const { attachedFiles } = this.state;
        const columns_files = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 100,
                align: "center",
                render: (text, index, key) => key + 1
            },
            {
                title: '文件名称',
                dataIndex: 'name',
                width: 300,
                align: "center",
            },
            {
                title: '创建时间',
                dataIndex: 'createTime',
                width: 230,
                align: "center",
            },
            {
                title: '创建人',
                dataIndex: 'createUser',
                width: 230,
                align: "center",
            },
            {
                title: '操作',
                dataIndex: 'cz',
                width: 150,
                render: (text, record, key) => {
                    return (<div> <span onClick={() => { window.open(`${supplierTrain.FileBaseURL}${record.fileId}`) }} size={'small'} style={{ cursor: "pointer", 'color': '#3383da'}}>下载</span></div>)
                }
            },
        ]
        return (
            <div>
                <Modal
                    title="查看附件"
                    visible={toggleStore.toggles.get(SHOW_CheckAttachedFiles_MODEL)}
                    width={600}
                    centered
                    okText="确认"
                    cancelText="取消"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <Card>
                        <CustomScroll>
                            <Table size='middle' bordered={true} rowKey={(text, key) => text.id || key} columns={columns_files} dataSource={attachedFiles} />
                        </CustomScroll>
                    </Card>
                </Modal>
            </div>
        );
    }
}

export default Form.create({ name: 'ChooseXzqy' })(CheckAttachedFiles);