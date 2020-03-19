import React, { Component } from 'react';
import { Modal, Form, Row, Col, Input, Table, Tabs, Card, Select, Icon, Button, message, Tooltip, Upload } from 'antd';
import { observer, inject, } from 'mobx-react';
import { SHOW_AddStaff_MODEL } from "../../../../../../../../constants/toggleTypes"
// 公用选择供应商组件
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性
@inject('toggleStore')
@observer
class AddStaffModel extends React.Component {
    state = {

    }
    handleOk = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_AddStaff_MODEL)
    };
    handleSubmit = e => {
        e.preventDefault();
        const { toggleStore,chooseFinishFn } = this.props;
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                chooseFinishFn(values)
                toggleStore.setToggle(SHOW_AddStaff_MODEL)
            }
        })

    };
    handleCancel = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_AddStaff_MODEL)
    };
    async componentDidMount() {
        
    }
    render() {
        const { toggleStore } = this.props;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
        };
        return (
            <div>
                <Modal
                    title="添加培训人员"
                    width={500}
                    visible={toggleStore.toggles.get(SHOW_AddStaff_MODEL)}
                    onOk={this.handleSubmit}
                    onCancel={this.handleCancel}
                >
                    <Form className="ant-advanced-search-form" onSubmit={(e) => { }}>
                        <Card bordered={false} className="new_supplier_form">
                            <Row gutter={24}>
                                <Col span={24}>
                                    <Col span={24} >
                                        <Form.Item {...formItemLayout} label={'姓名'}>
                                            {getFieldDecorator(`username`, {
                                                initValue: "姓名",
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '姓名',
                                                    },
                                                ],
                                            })(<Input disabled={false} />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={24} >
                                        <Form.Item {...formItemLayout} label={'联系方式'}>
                                            {getFieldDecorator(`tel`, {
                                                initValue: "联系方式",
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '联系方式',
                                                    },
                                                ],
                                            })(<Input disabled={false} />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={24} >
                                        <Form.Item {...formItemLayout} label={'证件类型'}>
                                            {getFieldDecorator(`identitytype`, {
                                                initialValue: "身份证",
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '证件类型',
                                                    },
                                                ],
                                            })(<Input disabled={true} />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={24} >
                                        <Form.Item {...formItemLayout} label={'证件号码'}>
                                            {getFieldDecorator(`identitycode`, {
                                                initValue: "证件号码",
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '证件号码',
                                                    },
                                                ],
                                            })(<Input disabled={false} />)}
                                        </Form.Item>
                                    </Col>
                                </Col>
                            </Row>
                        </Card>
                    </Form>
                </Modal>
            </div>
        );
    }
}
export default Form.create({ name: 'NewSupplier' })(AddStaffModel);;