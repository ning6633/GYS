
import React, { Component, Fragment } from 'react';
import { Modal, Form, Row, Col, Input, Table, Tabs, Card, DatePicker, Icon, Button, message, Tooltip, Checkbox, Radio, Descriptions } from 'antd';
import { observer, inject, } from 'mobx-react';
import { SHOW_NoticeDetails_MODEL } from "../../../../../../constants/toggleTypes"
import { supplierTrain } from '../../../../../../actions'
import _ from "lodash";
// 公用选择供应商组件

const { TabPane } = Tabs;
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性

@inject('toggleStore')
@observer
class NoticeDetails extends React.Component {
    state = {
        pxmd: "", //培训目的
        pxdx: "", //培训对象
        pxnrfs: "", // 培训内容和方式
        time: "", // 培训日期
        bmrsxz: "", // 报名人数限制
        pxdd1: "", //培训地点
        pxdd2: "", //培训地点详情
        bmjzrq: "", // 报名截止日期
        zbdw: "", // 主办单位
        bdrq: "", // 报道日期
        pxfy: "", // 培训费用
        fysm: "", // 费用说明
        hkfsyh:"",//汇款用户
        hkfskhh:"",//汇款开户行
        hkfszh:"", // 汇款账号
        pxfzr: "", // 负责人
        tel: "", // 联系电话
        bz: "", // 备注
        fjxz: [], // 附件下载
    }

    handleCancel = () => {
        //点击取消，隐藏model框
        let { toggleStore } = this.props
        toggleStore.setToggle(SHOW_NoticeDetails_MODEL)
    }
    handleSubmit = () => {
        //点击确定出发的事件
        let { toggleStore } = this.props
        toggleStore.setToggle(SHOW_NoticeDetails_MODEL)
    }
    async newTrainPlanFile(id) {
        let res = await supplierTrain.newTrainPlanFile(id)
        // 根据培训计划ID获取附件信息
        if (res.code == 200) {
            this.setState({
                fjxz: res.data
            })
        }
    }
    downLoad = (item) => {
        console.log(item)
        supplierTrain.noticeDownLoad(item.fileId)

    }
    async newTrainPlanById(id) {
        // 根据计划ID获取详情信息
        let res = await supplierTrain.newTrainPlanById(id)
        console.log(res.data)
        if (res.code == 200) {
            let {
                pxmd, //培训目的
                pxdx, //培训对象
                pxnrfs, // 培训内容和方式
                time, // 培训日期
                bmrsxz, // 报名人数限制
                pxdd1, //培训地点
                pxdd2, //培训地点详情
                bmjzrq, // 报名截止日期
                zbdw, // 主办单位
                bdrq, // 报道日期
                pxfy, // 培训费用
                fysm, // 费用说明
                hkfsyh,//汇款用户
                hkfskhh,//汇款开户行
                hkfszh, // 汇款账号
                pxfzr, // 负责人
                tel, // 联系电话
                bz, // 备注
                name,
            } = res.data
            this.setState(
                {
                    pxmd, //培训目的
                    pxdx, //培训对象
                    pxnrfs, // 培训内容和方式
                    time, // 培训日期
                    bmrsxz, // 报名人数限制
                    pxdd1, //培训地点
                    pxdd2, //培训地点详情
                    bmjzrq, // 报名截止日期
                    zbdw, // 主办单位
                    bdrq, // 报道日期
                    pxfy, // 培训费用
                    fysm, // 费用说明
                    hkfsyh,//汇款用户
                    hkfskhh,//汇款开户行
                    hkfszh, // 汇款账号
                    pxfzr, // 负责人
                    tel, // 联系电话
                    bz, // 备注
                    name
                }
            )
        }
    }
    componentDidMount = () => {
        let { id } = this.props
        this.newTrainPlanById(id)
        this.newTrainPlanFile(id)

    }
    render = () => {
        let { toggleStore } = this.props
        let {
            pxmd, //培训目的
            pxdx, //培训对象
            pxnrfs, // 培训内容和方式
            time, // 培训日期
            bmrsxz, // 报名人数限制
            pxdd1, //培训地点
            pxdd2, //培训地点详情
            bmjzrq, // 报名截止日期
            zbdw, // 主办单位
            bdrq, // 报道日期
            pxfy, // 培训费用
            fysm, // 费用说明
            hkfsyh,//汇款用户
            hkfskhh,//汇款开户行
            hkfszh, // 汇款账号
            pxfzr, // 负责人
            tel, // 联系电话
            bz, // 备注
            fjxz, //附件下载
            name
        } = this.state
        return (
            <Modal
                title={<div style={{ width: "100%", textAlign: "center", fontWeight: 900 }}>{`关于${name}的培训通知`}</div>}
                visible={toggleStore.toggles.get(SHOW_NoticeDetails_MODEL)}
                onOk={(e) => { this.handleSubmit(e) }}
                onCancel={this.handleCancel}
                width={900}
            >
                <Row>
                    <Descriptions title="一、培训目的" >
                        <Descriptions.Item>{pxmd}</Descriptions.Item>
                    </Descriptions>
                </Row>
                <Row>
                    <Descriptions title="二、培训对象">
                        <Descriptions.Item>{pxdx}</Descriptions.Item>
                    </Descriptions>
                </Row>
                <Row>
                    <Descriptions title="三、培训内容">
                        <Descriptions.Item>{pxnrfs}</Descriptions.Item>
                    </Descriptions>
                </Row>
                <Row>
                    <Descriptions title="四、培训安排" column={2}>
                        <Descriptions.Item label="培训日期">{time}</Descriptions.Item>
                        <Descriptions.Item label="报名人数限制">{bmrsxz}</Descriptions.Item>
                        <Descriptions.Item label="培训地点">{`${pxdd1} ${pxdd2}`}</Descriptions.Item>
                        <Descriptions.Item label="报名截止日期">{bmjzrq}</Descriptions.Item>
                        <Descriptions.Item label="主办单位">{zbdw}</Descriptions.Item>
                        <Descriptions.Item label="报道日期">{bdrq}</Descriptions.Item>
                    </Descriptions>
                </Row>
                <Row>
                    <Descriptions size="small" title="五、费用" column={1}>
                        <Descriptions.Item label="培训费用">{pxfy && pxfy.replace(/(?!^)(?=(\d{3})+$)/g, ",")}</Descriptions.Item>
                        <Descriptions.Item label="费用说明">{fysm}</Descriptions.Item>
                        <Descriptions.Item label="汇款方式">
                            用户：{hkfsyh}
                            <br />
                            开户行：{hkfskhh}
                            <br />
                            账号：{hkfszh}
                        </Descriptions.Item>
                    </Descriptions>
                </Row>
                <Row>
                    <Descriptions title="六、咨询联系人" column={1}>
                        <Descriptions.Item label="负责人">{pxfzr}</Descriptions.Item>
                        <Descriptions.Item label="联系电话">{tel}</Descriptions.Item>
                    </Descriptions>
                </Row>
                <Row>
                    <Descriptions title="七、其他" column={1}>
                        <Descriptions.Item>
                            <Fragment>
                                <span>备注：</span>
                                <span style={{ cursor: "pointer", 'color': 'red' }}>{bz}</span>
                            </Fragment>
                        </Descriptions.Item>
                        <Descriptions.Item>附件下载：{fjxz.map((item) => {
                            return (
                                <Fragment key={item.id}>

                                    <span style={{ cursor: "pointer", 'color': '#3383da', textDecoration: "underline" }} onClick={() => {
                                        this.downLoad(item)
                                    }} >{item.name}</span><b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b>
                                </Fragment>
                            )
                        })}</Descriptions.Item>


                    </Descriptions>
                </Row>
            </Modal>
        )
    }


}

export default Form.create({ name: "noticeDetails" })(NoticeDetails);
