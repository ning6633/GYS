import React, { Component } from 'react';
import { observer, inject, } from 'mobx-react';
import { SHOW_FeedBack_MODEL } from "../../../../constants/toggleTypes"
import { Modal, Form, Row, Col, Input, Typography, Checkbox, Card } from 'antd';
import { toJS } from "mobx"
import { supplierAction } from "../../../../actions"
import "./index.less"
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性
const { TextArea } = Input;
const { Text } = Typography;
@inject('toggleStore', 'supplierStore')
@observer
class FeedBack extends React.Component {
    state = {
        supFeedback: {}
    }
    checkObj = {}
    handleOk = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_FeedBack_MODEL)
    };
    handleCancel = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_FeedBack_MODEL)
    };
    handleSubmit = e => {
        const { supplierStore, toggleStore } = this.props;
        if (!supplierStore.islookFkdetail) {
            e.preventDefault();
            const { id } = this.state.supFeedback;
            this.props.form.validateFields(async (err, values) => {
                if (!err) {
                    let ret = await supplierAction.supplierfeedback(id, values.content, this.checkObj)
                    console.log(ret);
                    toggleStore.setToggle(SHOW_FeedBack_MODEL)
                }
            });
        } else {
            toggleStore.setToggle(SHOW_FeedBack_MODEL)
        }

    };
    checkedFn(e, type) {
        this.checkObj[type] = e.target.checked ? 1 : 0;
        console.log(this.checkObj);
    }
    componentDidMount() {
        const { supplierStore } = this.props;
        const { setFieldsValue } = this.props.form;
        let supFeedback = toJS(supplierStore.supFeedback);
        let { content } = supFeedback;
        this.setState({
            supFeedback
        })
        if (supplierStore.islookFkdetail) {
            setFieldsValue({ content })
        }
    }
    render() {
        const { toggleStore, supplierStore } = this.props;
        const { getFieldDecorator } = this.props.form;
        let { name, code, property_key,is_code_error,is_name_error } = supplierStore.supFeedback;
        return (
            <div>
                <Modal
                    title={supplierStore.islookFkdetail?`反馈详情 (${name})`:`问题反馈 (${name})`}
                    visible={toggleStore.toggles.get(SHOW_FeedBack_MODEL)}
                    width={800}
                    centered
                    okText="确认"
                    cancelText="取消"
                    onOk={this.handleSubmit}
                    onCancel={this.handleCancel}
                >
                    <Row gutter={24}>
                        <Col span={24}>
                            <Card title={<Text mark>{supplierStore.islookFkdetail?`反馈内容`:`请勾选有问题项`}</Text>}>
                                <div className="fb_box">
                                    <Col span={6}><p>填报供应商名称：</p></Col>
                                    <Col span={14}><Input value={name} disabled /></Col>
                                    <Col offset={2} span={2}><Checkbox disabled={supplierStore.islookFkdetail} defaultChecked={is_name_error==1} onChange={(val) => this.checkedFn(val, 'is_name_error')} /></Col>
                                </div>
                                <div className="fb_box">
                                    <Col span={6}><p>社会信用代码：</p></Col>
                                    <Col span={14}><Input value={code} disabled /></Col>
                                    <Col offset={2} span={2}><Checkbox disabled={supplierStore.islookFkdetail}  defaultChecked={is_code_error==1} onChange={(val) => this.checkedFn(val, 'is_code_error')} /></Col>
                                </div>
                                {/* <div className="fb_box">
                                    <Col span={6}><p>企业性质：</p></Col>
                                    <Col span={14}><Input value={property_key} disabled /></Col>
                                    <Col offset={2} span={2}><Checkbox disabled={supplierStore.islookFkdetail} onChange={(val) => this.checkedFn(val, 'is_key_error')} /></Col>
                                </div> */}
                                <Col span={24} style={{ marginTop: 20 }}>
                                    <Form layout={"vertical"}>
                                        <Form.Item label={'反馈内容'}>
                                            {getFieldDecorator(`content`, {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '反馈内容',
                                                    },
                                                ],
                                            })(<TextArea disabled={supplierStore.islookFkdetail} rows={6} placeholder="反馈内容" />)}
                                        </Form.Item>
                                    </Form>
                                </Col>
                            </Card>
                        </Col>
                    </Row>
                </Modal>
            </div>
        );
    }
}

export default Form.create({ name: 'FeedBack' })(FeedBack);