
import React, { Component, Fragment } from 'react';
import { Modal, Form, Row, Col, Input, Table, Tabs, Card, DatePicker, Icon, Button, message, Tooltip, Checkbox, Radio, Descriptions } from 'antd';
import { observer, inject, } from 'mobx-react';
import { SHOW_SpwcialDetails_MODEL } from "../../../../../../constants/toggleTypes"
import { supplierTrain } from '../../../../../../actions'
import _ from "lodash";
// 公用选择供应商组件

const { TabPane } = Tabs;
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性

@inject('toggleStore')
@observer
class SpwcialDetails extends React.Component {
    state = {
        name: "",
        pxnrfs: "",
        time: "",
        pxfy: "",
        pxdd1: "",
        zbdw: "",
        listTrainCertificateVO:[],
        listTrainImplementUserNewVO1:[],
    }

    handleCancel = () => {
        //点击取消，隐藏model框
        let { toggleStore } = this.props
        toggleStore.setToggle(SHOW_SpwcialDetails_MODEL)
    }
    handleSubmit = () => {
        //点击确定出发的事件
        let { toggleStore } = this.props
        toggleStore.setToggle(SHOW_SpwcialDetails_MODEL)
    }
    async loaddata(id) {
        // 根据ID查询培训详情
        let res = await supplierTrain.trainApplyNewDetail(id)
        console.log(res)
        if (res.code == 200) {
            let { name, pxnrfs, time, pxfy, pxdd1, zbdw ,listTrainCertificateVO,listTrainImplementUserNewVO1} = res.data
            this.setState({
                name,
                pxnrfs,
                time,
                pxfy,
                pxdd1,
                zbdw,
                listTrainCertificateVO,
                listTrainImplementUserNewVO1
            })
        }
    }
    componentDidMount = () => {
        let { recordId } = this.props
        this.loaddata(recordId)


    }
    render = () => {
        let { toggleStore } = this.props
        let {
            name,
            pxnrfs,
            time,
            pxfy,
            pxdd1,
            zbdw,
            listTrainCertificateVO, // 培训证书
            listTrainImplementUserNewVO1, // 参训人员

        } = this.state
        const columnsLicence = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 45,
                align: "center",
                render: (text, index, key) => key + 1
            },
            {
                title: '证书名称',
                dataIndex: 'name',
                width: 200,
                align: "center",
            },
            {
                title: '证书类型',
                dataIndex: 'type',
                width: 100,
                align: "center",
            },
            {
                title: '发证机构',
                dataIndex: 'authoritied_orgname',
                width: 150,
                align: "center",
            },
            {
                title: '有效期至',
                dataIndex: 'expiry_months',
                width: 200,
                align: "center",
            },

        ]
        const columnsPersonnel = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 45,
                align: "center",
                render: (text, index, key) => key + 1
            },
            {
                title: '姓名',
                dataIndex: 'username',
                width: 100,
                align: "center",
            },
            {
                title: '所属供应商',
                dataIndex: 'gysname',
                width: 200,
                align: "center",
            },
            {
                title: '所属部门',
                dataIndex: 'userorg',
                width: 150,
                align: "center",
            },
            {
                title: '现任职务/职称',
                dataIndex: 'title',
                width: 100,
                align: "center",
            },
            {
                title: '联系方式',
                dataIndex: 'tel',
                width: 100,
                align: "center",
            },
            {
                title: '证书编号',
                dataIndex: 'identitycode',
                width: 100,
                align: "center",
            },

        ]
        return (
            <Modal
                title={<div style={{ width: "100%", textAlign: "center", fontWeight: 900 }}>培训详情</div>}
                visible={toggleStore.toggles.get(SHOW_SpwcialDetails_MODEL)}
                onOk={(e) => { this.handleSubmit(e) }}
                onCancel={this.handleCancel}
                width={900}
            >
                <Tabs defaultActiveKey="1" >
                    <TabPane tab="培训基本信息" key="1">
                        <Row>
                            <Card bordered={false}>
                                <Descriptions column={2}>
                                    <Descriptions.Item label="培训名称">{name}</Descriptions.Item>
                                    <Descriptions.Item label="培训内容">{pxnrfs}</Descriptions.Item>
                                    <Descriptions.Item label="培训日期">{time}</Descriptions.Item>
                                    <Descriptions.Item label="培训费用">{pxfy}</Descriptions.Item>
                                    <Descriptions.Item label="培训地点">{pxdd1}</Descriptions.Item>
                                    <Descriptions.Item label="主办单位">{zbdw}</Descriptions.Item>
                                </Descriptions>
                            </Card>
                        </Row>
                        <Row>
                            <Card title={<span>培训证书</span>} bordered={false}>
                                <Table
                                    size='middle'
                                    bordered={false}
                                    rowKey={(text) => text.id}
                                    scroll={{ x: 650 }}
                                    columns={columnsLicence}
                                    pagination={false}
                                    dataSource={listTrainCertificateVO}
                                ></Table>
                            </Card>
                        </Row>
                        <Row>
                            <Card title={<span>参训人员</span>} bordered={false}>
                                <Table
                                    size='middle'
                                    bordered={false}
                                    rowKey={(text) => text.id}
                                    scroll={{ x: 750 }}
                                    columns={columnsPersonnel}
                                    pagination={false}
                                    dataSource={listTrainImplementUserNewVO1}
                                ></Table>
                            </Card>
                        </Row>
                    </TabPane>
                </Tabs>
            </Modal>
        )
    }


}

export default Form.create({ name: "spwcialdetails" })(SpwcialDetails);
