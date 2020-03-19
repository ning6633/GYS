
import React, { Component } from 'react';
import { Modal, Form, Row, Col, Input, Table, Tabs, Card, DatePicker, Icon, Button, message, Tooltip, Checkbox, Radio, Descriptions, Select } from 'antd';
import { observer, inject, } from 'mobx-react';
import { SHOW_ManualInput_MODEL } from "../../../../../../constants/toggleTypes"
import { supplierTrain } from '../../../../../../actions'
import _ from "lodash";
// 公用选择供应商组件
const {Option} = Select
const { TabPane } = Tabs;
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性

@inject('toggleStore')
@observer
class ManualInput extends React.Component {


    handleCancel = () => {
        //点击取消，隐藏model框
        let { toggleStore } = this.props
        toggleStore.setToggle(SHOW_ManualInput_MODEL)
    }
    handleSubmit = () => {
        //点击确定出发的事件
        let {manualInput} = this.props
        this.props.form.validateFields((err, values) => {
            if (!err) {
                manualInput(values)
            }
        })
        let { toggleStore } = this.props
        toggleStore.setToggle(SHOW_ManualInput_MODEL)
    }
    componentDidMount=()=>{
        let {setFieldsValue} = this.props.form
        setFieldsValue({
            gender:"男"
        })
    }
    render = () => {
        let { toggleStore } = this.props
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
        };

        return (
            <Modal
                title={<div style={{ width: "100%", textAlign: "center", fontWeight: 900 }}>手动录入</div>}
                visible={toggleStore.toggles.get(SHOW_ManualInput_MODEL)}
                onOk={(e) => { this.handleSubmit(e) }}
                onCancel={this.handleCancel}
                width={900}
            >

                <Form >
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item {...formItemLayout} label={'姓名'}>
                                {getFieldDecorator(`username`, {
                                    rules: [
                                        {
                                            required: true,
                                            message: '姓名',
                                        },
                                    ],
                                })(<Input disabled={false} />)}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item {...formItemLayout} label={'性别'}>
                                {getFieldDecorator(`gender`, {
                                    rules: [
                                        {
                                            required: false,
                                            message: '性别',
                                        },
                                    ],
                                })(<Select>
                                    <Option value = "男">男</Option>
                                    <Option value = "女">女</Option>
                                </Select>)}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item {...formItemLayout} label={'所属供应商'}>
                                {getFieldDecorator(`gysname`, {
                                    rules: [
                                        {
                                            required: true,
                                            message: '所属供应商',
                                        },
                                    ],
                                })(<Input disabled={false} />)}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item {...formItemLayout} label={'所属部门'}>
                                {getFieldDecorator(`userorg`, {
                                    rules: [
                                        {
                                            required: false,
                                            message: '所属部门',
                                        },
                                    ],
                                })(<Input disabled={false} />)}
                            </Form.Item>
                        </Col>
                        
                        <Col span={12}>
                            <Form.Item {...formItemLayout} label={'现任职务/职称'}>
                                {getFieldDecorator(`title`, {
                                    rules: [
                                        {
                                            required: false,
                                            message: '现任职务/职称',
                                        },
                                    ],
                                })(<Input disabled={false} />)}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item {...formItemLayout} label={'联系方式'}>
                                {getFieldDecorator(`tel`, {
                                    rules: [
                                        {
                                            required: true,
                                            message: '联系方式',
                                        },
                                    ],
                                })(<Input disabled={false} />)}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                    <Col span={12}>
                            <Form.Item {...formItemLayout} label={'证书编号'}>
                                {getFieldDecorator(`number`, {
                                    rules: [
                                        {
                                            required: false,
                                            message: '现任职务/职称',
                                        },
                                    ],
                                })(<Input disabled={false} />)}
                            </Form.Item>
                        </Col>
                       
                        <Col span={12}>
                            <Form.Item {...formItemLayout} label={'备注'}>
                                {getFieldDecorator(`otherinfo`, {
                                    rules: [
                                        {
                                            required: false,
                                            message: '备注',
                                        },
                                    ],
                                })(<Input disabled={false} />)}
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>

            </Modal>
        )
    }


}

export default Form.create({ name: "manualInput" })(ManualInput);
