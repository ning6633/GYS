import React, { Component, Fragment } from 'react';
import { observer, inject, } from 'mobx-react';
import { Modal, Form, Row, Col, Input, Button, Table, DatePicker, Select, message } from 'antd';
import { SHOW_AddList_MODEL } from "../../../../constants/toggleTypes";
import { toJS } from "mobx"
import moment from 'moment'
import { specialExposure } from "../../../../actions"
// import ChooseTBSupplier from '../../../../components/ChooseTBSupplier'

// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性
const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker

@inject('toggleStore', 'supplierStore')
@observer
class SupAdd extends React.Component {
    state = {
        list: [],
        supplierList: [],
        provider_id: '',
        uploadList: {},
        list: {},
    }
    closed = () => {
        let { toggleStore } = this.props
        toggleStore.setToggle(SHOW_AddList_MODEL);
    }
    async handleSubmit() {
        let { status, statuss, uploadInfo } = this.props
        this.props.form.validateFields(async (err, values) => {
            console.log(values.TIME)
            if (!err) {
                values.start_TIME = values.TIME[0].format("YYYY-MM-DD HH:mm:ss")
                values.end_TIME = values.TIME[1].format("YYYY-MM-DD HH:mm:ss")
                delete values.TIME
                if (statuss == 1) {
                    //新建 
                    values.status = 0
                    let res = await specialExposure.addCommunicate(values)
                    if (res.code == 200) {
                        let { toggleStore } = this.props
                        toggleStore.setToggle(SHOW_AddList_MODEL);
                        this.props.loaddata({})
                    }
                }
                if (statuss == 0) {
                    //保存
                    values.id = uploadInfo.id
                    let res = await specialExposure.updateCommunication(values)
                    if (res.code == 200) {
                        let { toggleStore } = this.props
                        toggleStore.setToggle(SHOW_AddList_MODEL);
                        this.props.loaddata({})
                    }
                }
            }
        });
    }
    componentDidMount = () => {
        let { statuss, uploadInfo } = this.props
        console.log(moment('2019-12-12','YYYY-MM-DD'))
        console.log(statuss)
        if (statuss == 12) {
            let {
                start_TIME,
                end_TIME,
                address,
                title,
                content
            } = uploadInfo
            const { setFieldsValue } = this.props.form;
            setFieldsValue({
                start_TIME:start_TIME && start_TIME.substr(0,start_TIME.length-2),
                end_TIME:end_TIME && end_TIME.substr(0,end_TIME.length-2),
                address,
                title,
                content
            })
        }
        if (statuss == 0) {
            let {
                start_TIME,
                end_TIME,
                address,
                title,
                content
            } = uploadInfo
            const { setFieldsValue } = this.props.form;
            setFieldsValue({
                TIME:[moment(start_TIME,"YYYY-MM-DD HH:mm:ss"),moment(end_TIME,"YYYY-MM-DD HH:mm:ss")],
                title,
                address,
                content
            })
        }
    }
    render() {
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
        const { getFieldDecorator } = this.props.form;
        let { statuss } = this.props
        return (
            <Modal
                title={statuss == 0 ? <b>修改</b> : statuss == 1 ? <b>新建</b> : <b>详情信息</b>}
                width={700}
                visible={true}
                footer={
                    <Fragment>
                        {statuss == 12 ? <Button onClick={() => { this.closed() }} type='primary'>关闭</Button> :
                            <Fragment>
                                <Button onClick={() => { this.closed() }}>取消</Button>
                                {statuss == 0 ? <Button onClick={() => { this.handleSubmit(0) }} type='primary'>确定</Button> :
                                    <Fragment>
                                        <Button onClick={() => { this.handleSubmit(0) }} type='primary'>保存</Button>
                                        <Button onClick={() => { this.handleSubmit(1) }} type='primary'>保存并提交</Button>
                                    </Fragment>}
                            </Fragment>
                        }
                    </Fragment>
                }
                onCancel={() => { this.closed() }}
            >
                <Form className="ant-advanced-search-form" onSubmit={(e) => { this.handleSubmit(e) }}>
                    <Row gutter={24}>
                        <Col span={24} >
                            {
                                statuss == 12 ? <Fragment>
                                    <Form.Item {...formItemLayout} label={<b>开始时间</b>} labelCol={{ span: 4, offset: 3 }}>
                                        {getFieldDecorator('start_TIME', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '开始时间',
                                                },
                                            ],
                                        })(<Input disabled={statuss == 12} style={{ width: 400 }} />)}
                                    </Form.Item>
                                    <Form.Item style={{ marginTop: 20 }} {...formItemLayout} label={<b>结束时间</b>} labelCol={{ span: 4, offset: 3 }}>
                                        {getFieldDecorator('end_TIME', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '结束时间',
                                                },
                                            ],
                                        })(<Input disabled={statuss == 12} style={{ width: 400 }} />)}
                                    </Form.Item>
                                </Fragment> : <Form.Item {...formItemLayout} label={<b>起止时间</b>} labelCol={{ span: 4, offset: 3 }}>
                                        {getFieldDecorator('TIME', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '开始时间',
                                                },
                                            ],
                                        })(<RangePicker showTime={{ format: 'HH:mm:ss' }}  disabled={statuss == 12} disabledDate={(current) => {

                                            if (!current) {
                                                return false
                                            } else {

                                                return current < moment().subtract(1, "days")
                                            }
                                        }} format="YYYY-MM-DD HH:mm" style={{ width: 400 }} />)}
                                    </Form.Item>
                            }
                        </Col>

                    </Row>
                    <Row gutter={24} style={{ marginTop: 20 }}>
                        <Col span={24} >
                            <Form.Item {...formItemLayout} label={<b>主题</b>} labelCol={{ span: 4, offset: 3 }}>
                                {getFieldDecorator('title', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '主题',
                                        },
                                    ],
                                })(<Input disabled={statuss == 12} style={{ width: 400 }} placeholder='请输入主题' />)}
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={24} style={{ marginTop: 20 }}>
                        <Col span={24} >
                            <Form.Item {...formItemLayout} label={<b>地点</b>} labelCol={{ span: 4, offset: 3 }}>
                                {getFieldDecorator('address', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '地点',
                                        },
                                    ],
                                })(<Input disabled={statuss == 12} style={{ width: 400 }} placeholder='请输入地址' />)}
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={24} style={{ marginTop: 20 }}>
                        <Col span={24} >
                            <Form.Item {...formItemLayout} label={<b>内容</b>} labelCol={{ span: 4, offset: 3 }}>
                                {getFieldDecorator('content', {
                                    rules: [
                                        {
                                            required: false,
                                            message: '内容',
                                        },
                                    ],
                                })(<Input.TextArea disabled={statuss == 12} maxLength={150} style={{ width: 400 }} placeholder='请输入内容,字数在150字之内。' onChange={(e) => {
                                    if (e.target.value.length >= 150) {
                                        message.error('输入的内容在150个字符之间')
                                    }
                                }} rows={6} />)}
                            </Form.Item>
                        </Col>
                    </Row>



                </Form>
            </Modal>
        )
    }
}

export default Form.create({ name: 'supAdd' })(SupAdd);