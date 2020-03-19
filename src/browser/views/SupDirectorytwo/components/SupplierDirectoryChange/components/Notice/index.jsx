import React, { Component } from 'react';
import { Modal, Button, Card, Form, Row, Col, Input, message, Table } from 'antd';
import { observer, inject, } from 'mobx-react';
import { SHOW_Notice_MODEL } from "../../../../../../constants/toggleTypes"
import _ from "lodash";
import { supplierDirectory } from "../../../../../../actions"
import './index.less'
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性'
@inject('toggleStore', 'directoryStore')
@observer
class Notice extends React.Component {
    state = {

    }
    handleCancel = e => {
        let {toggleStore} = this.props
        toggleStore.setToggle(SHOW_Notice_MODEL)
    };

    // 已执行
    handleSubmit = e => {
        let {info} = this.props
        this.suretoread(info.id)
        this.suretozx(info.id)
        this.props.history.push('/fe/supplierDirectorysee')
        // let {toggleStore } = this.props
        // toggleStore.setToggle(SHOW_Notice_MODEL)
    }

    // 已执行
    async suretozx(messageid) {
        let res = await supplierDirectory.suretozx(messageid)
    }


    // 已读
    alreadyRead = () => {
        let { toggleStore,info } = this.props
        this.suretoread(info.id)
        toggleStore.setToggle(SHOW_Notice_MODEL)
    }
    async suretoread(messageid) {
        let res = await supplierDirectory.suretoread(messageid)
    }

    // 角标
    FooterBtn = () => {
        return (
            <div className='notice_div_footer'>
                <span className='move_color' onClick={() => { this.alreadyRead() }}><a className='move_color_a'>【关闭】</a></span>
                <span className='move_color' onClick={() => { this.handleSubmit() }}><a className='move_color_a'>【查看】</a></span>
            </div>
        )
    }
    loaddata = () => {
    }
    componentDidMount = () => {
        this.loaddata()
    }
    render() {
        const { toggleStore, info } = this.props
        const list = [
            {
                id:info.id,
                gysname:info.gysname,
                code:info.code,
                model_area:info.model_area,
                updatetype:info.updatetype,
                updatedate:info.updatedate,
            }
        ]
        const columns = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 45,
                align: "center",
                render: (text, index, key) => key + 1
            },
            {
                title: '供应商名称',
                dataIndex: 'gysname',
                width: 150,
                align: "center",
            },
            {
                title: '统一社会信用代码',
                dataIndex: 'code',
                width: 230,
                align: "center",
            },
            {
                title: '产品类别',
                dataIndex: 'model_area',
                width: 100,
                align: "center",
            },
            {
                title: '变更原因',
                dataIndex: 'updatetype',
                width: 100,
                align: "center",
            },
            {
                title: '变更时间',
                dataIndex: 'updatedate',
                width: 100,
                align: "center",
                render:(text)=>{
                    return (
                    <span>{text && text.substr(0,9)}</span>
                    )
                }
            },
        ];
        return (
            <div>
                <Modal
                    title={<div className='notice_div_title'>名录变更通知</div>}
                    visible={toggleStore.toggles.get(SHOW_Notice_MODEL)}
                    // onOk={(e) => { this.handleSubmit(e) }}
                    onCancel={this.handleCancel}
                    footer={false}
                    width={950}
                >
                    <Card
                        bordered={false}

                    >
                        <div className="notice_div_top">
                            <p>发布人：{info.updateuser}</p>
                            <p>发布时间：{info.updatedate}</p>
                            <p>单位：{info.sendorgname}</p>
                        </div>
                        <div className="notice_div_bottom">{info.content}</div>
                        <Table
                            size='middle'
                            // loading={loading}
                            rowClassName={(text) => text.is_diff == 1 ? 'is_diff' : text.is_new == 1 ? 'is_new' : ''}
                            bordered={false}
                            pagination={false}
                            rowKey={(text) => text.id}
                            scroll={{ x: 875 }}
                            footer={this.FooterBtn}
                            columns={columns}

                        dataSource={list}
                        />
                    </Card>
                </Modal>
            </div>
        );
    }
}

export default Form.create({ name: 'notice' })(Notice);;