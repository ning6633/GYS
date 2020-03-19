import React, { Component } from 'react';
import { Modal, Select, Card, Form, Row, Col, Input, DatePicker, Icon, message } from 'antd';
import { observer, inject, } from 'mobx-react';
import { SHOW_NewPJZS_MODEL } from "../../../../constants/toggleTypes"
const { RangePicker } = DatePicker;
const { Option } = Select
// 新建评价证书
@inject('toggleStore')
@observer
class NewPJZS extends Component {
    handleOk = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_NewPJZS_MODEL)
        this.props.form.validateFields((err, values) => {
            console.log(values)
        })
    };
    handleCancel = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_NewPJZS_MODEL)
    };
    handleSubmit = e => {
        const { toggleStore } = this.props;
        this.props.form.validateFields((err, values) => {
            console.log(values)
            toggleStore.setToggle(SHOW_NewPJZS_MODEL)
        })
    }
    componentDidMount() {
    }
    handleChange(value) {
        console.log(`selected ${value}`);
    }
    render() {
        const { toggleStore } = this.props;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 16 },
        };
        const rangeConfig = {
            rules: [{ type: 'array', required: true, message: '请选择有效期' }],
          };
        return (
            <div>
                <Modal
                    width={700}
                    title="新建资质评价证书"
                    visible={toggleStore.toggles.get(SHOW_NewPJZS_MODEL)}
                    onOk={(e) => { this.handleSubmit(e) }}
                    onCancel={this.handleCancel}
                    okText="提交"
                >
                    <Form className="ant-advanced-search-form" onSubmit={(e) => { this.handleSubmit(e) }}>
                        <Card bordered={false} className="new_supplier_form">
                            <Row gutter={24}>
                                <Col span={24}>
                                    <Form.Item {...formItemLayout} label={'证书名称'}>
                                        {getFieldDecorator(`attr1`, {
                                            rules: [
                                                {
                                                    required: false,
                                                },
                                            ],
                                        })(<Input />)}
                                    </Form.Item>
                                    <Form.Item {...formItemLayout} label={'证书类型'}>
                                        {getFieldDecorator(`attr1`, {
                                            rules: [
                                                {
                                                    required: false,
                                                },
                                            ],
                                        })(<Select>
                                            <Option value="类型一">类型一</Option>
                                            <Option value="类型二">类型二</Option>
                                        </Select>)}
                                    </Form.Item>
                                    <Form.Item {...formItemLayout} label={'证书编号'}>
                                        {getFieldDecorator(`attr1`, {
                                            rules: [
                                                {
                                                    required: false,
                                                },
                                            ],
                                        })(<Input />)}
                                    </Form.Item>
                                    <Form.Item {...formItemLayout} label={'有效期限'}>
                                        {getFieldDecorator('range-picker', rangeConfig)(<RangePicker />)}
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                    </Form>
                </Modal>
            </div>
        );
    }
}

export default Form.create({ name: 'NewPJZSForm' })(NewPJZS);;