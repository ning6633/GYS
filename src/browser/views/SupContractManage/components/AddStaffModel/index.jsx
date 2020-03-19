import React, { Component } from 'react';
import { Modal, Form, Row, Col, Input, Table, Tabs, Card, Select, Icon, Button, message, Tooltip, Upload } from 'antd';
import { observer, inject, } from 'mobx-react';
import { SHOW_AddStaff_MODEL } from "../../../../constants/toggleTypes"
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
        console.log(this.props.formType)
    }
    render() {
        const { toggleStore,formType } = this.props;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
        };
        return (
            <div>
                <Modal
                    title={formType == "qualityProblem" ?"质量问题": formType == 'defectsProblem' ? "不合格品处理" : "合同要求"}
                    width={500}
                    visible={toggleStore.toggles.get(SHOW_AddStaff_MODEL)}
                    onOk={this.handleSubmit}
                    onCancel={this.handleCancel}
                >
                {
                    formType == "qualityProblem" ?
                    <Form className="ant-advanced-search-form" onSubmit={(e) => { }}>
                        <Card bordered={false} className="new_supplier_form">
                            <Row gutter={24}>
                                <Col span={24}>
                                    <Col span={24} >
                                        <Form.Item {...formItemLayout} label={'问题现象'}>
                                            {getFieldDecorator(`situation`, {
                                                initValue: "问题现象",
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '问题现象',
                                                    },
                                                ],
                                            })(<Input disabled={false} />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={24} >
                                        <Form.Item {...formItemLayout} label={'机理分析'}>
                                            {getFieldDecorator(`analysis`, {
                                                initValue: "机理分析",
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '机理分析',
                                                    },
                                                ],
                                            })(<Input disabled={false} />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={24} >
                                        <Form.Item {...formItemLayout} label={'复现情况'}>
                                            {getFieldDecorator(`reappear_situation`, {
                                                initValue: "复现情况",
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '复现情况',
                                                    },
                                                ],
                                            })(<Input disabled={false} />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={24} >
                                        <Form.Item {...formItemLayout} label={'评审情况'}>
                                            {getFieldDecorator(`review_situation`, {
                                                initValue: "评审情况",
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '评审情况',
                                                    },
                                                ],
                                            })(<Input disabled={false} />)}
                                        </Form.Item>
                                    </Col>
                                </Col>
                            </Row>
                        </Card>
                    </Form>
                    :
                    formType == 'defectsProblem' ? <Form className="ant-advanced-search-form" onSubmit={(e) => { }}>
                    <Card bordered={false} className="new_supplier_form">
                        <Row gutter={24}>
                            <Col span={24}>
                                <Col span={24} >
                                    <Form.Item {...formItemLayout} label={'不合格品编号'}>
                                        {getFieldDecorator(`defect_number`, {
                                            initValue: "不合格品编号",
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '不合格品编号',
                                                },
                                            ],
                                        })(<Input disabled={false} />)}
                                    </Form.Item>
                                </Col>
                                <Col span={24} >
                                    <Form.Item {...formItemLayout} label={'不合格品名称'}>
                                        {getFieldDecorator(`defect_name`, {
                                            initValue: "不合格品名称",
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '不合格品名称',
                                                },
                                            ],
                                        })(<Input disabled={false} />)}
                                    </Form.Item>
                                </Col>
                                <Col span={24} >
                                    <Form.Item {...formItemLayout} label={'不合格品数量'}>
                                        {getFieldDecorator(`defect_amount`, {
                                            initValue: "不合格品数量",
                                            rules: [
                                                {
                                                    required: false,
                                                    message: '不合格品数量',
                                                    pattern:new RegExp(/^[1-9]\d*$/, "g"),
                                                },
                                            ],
                                        })(<Input disabled={false} maxLength={5} />)}
                                    </Form.Item>
                                </Col>
                                <Col span={24} >
                                    <Form.Item {...formItemLayout} label={'处理措施'}>
                                        {getFieldDecorator(`measure`, {
                                            initValue: "处理措施",
                                            rules: [
                                                {
                                                    required: false,
                                                    message: '处理措施',
                                                },
                                            ],
                                        })(<Input disabled={false} />)}
                                    </Form.Item>
                                </Col>
                                <Col span={24} >
                                    <Form.Item {...formItemLayout} label={'产生影响'}>
                                        {getFieldDecorator(`effect`, {
                                            initValue: "产生影响",
                                            rules: [
                                                {
                                                    required: false,
                                                    message: '产生影响',
                                                },
                                            ],
                                        })(<Input disabled={false} />)}
                                    </Form.Item>
                                </Col>
                                <Col span={24} >
                                    <Form.Item {...formItemLayout} label={'处理类型'}>
                                        {getFieldDecorator(`type`, {
                                            initValue: "处理类型",
                                            rules: [
                                                {
                                                    required: false,
                                                    message: '处理类型',
                                                },
                                            ],
                                        })(<Input disabled={false} />)}
                                    </Form.Item>
                                </Col>
                                <Col span={24} >
                                    <Form.Item {...formItemLayout} label={'联系人'}>
                                        {getFieldDecorator(`contact`, {
                                            initValue: "联系人",
                                            rules: [
                                                {
                                                    required: false,
                                                    message: '联系人',
                                                },
                                            ],
                                        })(<Input disabled={false} />)}
                                    </Form.Item>
                                </Col>
                                <Col span={24} >
                                    <Form.Item {...formItemLayout} label={'联系方式'}>
                                        {getFieldDecorator(`phone`, {
                                            initValue: "联系方式",
                                            rules: [
                                                {
                                                    required: false,
                                                    message: '联系方式',
                                                },
                                            ],
                                        })(<Input disabled={false} />)}
                                    </Form.Item>
                                </Col>
                            </Col>
                        </Row>
                    </Card>
                </Form> :
                <Form className="ant-advanced-search-form" onSubmit={(e) => { }}>
                <Card bordered={false} className="new_supplier_form">
                    <Row gutter={24}>
                        <Col span={24}>
                            <Col span={24} >
                                <Form.Item {...formItemLayout} label={'质量要求'}>
                                    {getFieldDecorator(`zlyq`, {
                                        initValue: "质量要求",
                                        rules: [
                                            {
                                                required: true,
                                                message: '质量要求',
                                            },
                                        ],
                                    })(<Input disabled={false} />)}
                                </Form.Item>
                            </Col>
                            
                        </Col>
                    </Row>
                </Card>
            </Form>
                }

                </Modal>
            </div>
        );
    }
}
export default Form.create({ name: 'NewSupplier' })(AddStaffModel);;